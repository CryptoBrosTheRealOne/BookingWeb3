import React, { useEffect, useState } from "react";
import {
  Box,
  Divider,
  Flex,
  Heading,
  Text,
  Button,
  useToast,
  useDisclosure,
} from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import { useWeb3 } from "../../hooks/useWeb3"; // custom hook for Web3 interaction
import InteractiveMap from "../../Components/Map/Map";
import BookModal from "./BookModal";
import {
  loadPropertyDetails,
  subscribeToReservationCreated,
  unsubscribeAll,
} from "./service/propertyService"; // External service functions

const ViewProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { web3, accounts, contracts } = useWeb3(); // Using a custom hook to handle web3 initialization
  const { propertyManagementContract, propertyReservationContract } = contracts;
  const [property, setProperty] = useState(null);
  const [coords, setCoords] = useState({});
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isShown, setIsShown] = useState();
  const [estimatedCost, setEstimatedCost] = useState(null);

  useEffect(() => {
    if (propertyManagementContract) {
      loadProperty();
    }

    const unsubscribe = subscribeToReservationCreated(
      propertyReservationContract,
      handleNewReservation
    );
  }, [propertyManagementContract, propertyReservationContract]);

  const loadProperty = async () => {
    try {
      const propertyDetails = await loadPropertyDetails(
        propertyManagementContract,
        id
      );
      setProperty(propertyDetails);
      setCoords({
        lat: parseFloat(propertyDetails.latitude) / 100000,
        lng: parseFloat(propertyDetails.longitude) / 100000,
      });
    } catch (error) {
      console.error("Error loading property:", error);
      toast({
        title: "Error",
        description: "Failed to load property details.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleNewReservation = () => {
    if (!isShown) {
      toast({
        title: "Booking Confirmed",
        description: "Your booking has been confirmed.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setTimeout(() => {
        setIsShown(false);
      }, 5000);
    }

    loadProperty();
    onClose();
  };

  const bookProperty = async (startDate, endDate) => {
    if (!propertyReservationContract || accounts.length === 0) {
      console.error("Contract not loaded or no accounts available");
      return;
    }
    try {
      let totalDays = Math.floor((endDate - startDate) / (60 * 60 * 24)) + 1;
      let totalPrice = totalDays * parseInt(property.pricePerNight.toString());
      const latestBlock = await web3.eth.getBlock("latest");

      const baseFee = parseInt(latestBlock.baseFeePerGas);
      const maxPriorityFeePerGas = web3.utils.toWei("2", "gwei"); // Suggested tip to miner
      const maxFeePerGas = web3.utils.toWei(
        (baseFee * 1.2 + parseInt(maxPriorityFeePerGas)).toString(),
        "wei"
      );

      try {
        const receipt = await web3.eth.sendTransaction({
          from: accounts[0],
          to: property.owner,
          value: totalPrice.toString(),
          gas: 21000,
          maxFeePerGas: maxFeePerGas,
          maxPriorityFeePerGas: maxPriorityFeePerGas,
        });

        if (receipt.status) {
          await propertyReservationContract.methods
            .reserveProperty(id, startDate, endDate)
            .send({ from: accounts[0] });
        } else {
          console.error("Transaction failed", receipt);
        }
      } catch (error) {
        console.error("Error during transaction", error);
      }
    } catch (error) {
      console.error("Error booking property:", error);
      toast({
        title: "Booking Failed",
        description: `Failed to book property: ${error.message}`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const estimateTransactionCost = async (startDate, endDate) => {
    if (!propertyReservationContract || accounts.length === 0) {
      console.error("Contract not loaded or no accounts available");
      return;
    }
    try {
      const currentBlockNumber = await web3.eth.getBlockNumber();
      const latestBlocks = await Promise.all(
        [...Array(5)].map((_, i) =>
          web3.eth.getBlock(parseInt(currentBlockNumber.toString()) - i)
        )
      );

      const averageBaseFee =
        latestBlocks.reduce(
          (acc, block) => acc + parseInt(block.baseFeePerGas),
          0
        ) / latestBlocks.length;
      const maxPriorityFeePerGas = web3.utils.toWei("2", "gwei");

      const gasEstimate = await propertyReservationContract.methods
        .reserveProperty(id, startDate, endDate)
        .estimateGas({
          from: accounts[0],
        });

      const estimateTransactionCostFunc = (
        gasEstimate,
        averageBaseFee,
        maxPriorityFeePerGas
      ) => {
        try {
             /* eslint-disable */
          const gasEstimateBigInt = BigInt(gasEstimate);
           /* eslint-disable */
          const averageBaseFeeBigInt = BigInt(Math.floor(averageBaseFee));
           /* eslint-disable */
          const maxPriorityFeePerGasBigInt = BigInt(maxPriorityFeePerGas);
            debugger
          const totalCostWei =
            gasEstimateBigInt * averageBaseFeeBigInt +
            maxPriorityFeePerGasBigInt;

          const estimatedTransactionCost = web3.utils.fromWei(
            totalCostWei.toString(),
            "ether"
          );

          return estimatedTransactionCost;
        } catch (error) {
          console.error("Failed to estimate transaction cost:", error);
          throw error; // Re-throw the error for further handling
        }
      };
      const estimatedTransactionCost = estimateTransactionCostFunc(
        gasEstimate,
        averageBaseFee,
        maxPriorityFeePerGas
      );

      toast({
        title: "Estimated Transaction Cost",
        description: `Estimated cost: ${estimatedTransactionCost} ETH`,
        status: "info",
        duration: 7000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Transaction estimation failed:", error);
      toast({
        title: "Transaction Error",
        description:
          "Could not estimate transaction cost. Please check the input parameters and your account permissions.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  return (
    <Box maxW="800px" mx="auto" p="4">
      <Flex flexDir={"row"} justifyContent={"space-between"}>
        <Heading mb="4">View - {property?.name}</Heading>
        <Button onClick={onOpen}>Book</Button>
      </Flex>
      <Divider mb="4" />
      <Text>{property?.description}</Text>
      {coords.lat && <InteractiveMap coords={coords} />}
      <BookModal
        isOpen={isOpen}
        onClose={onClose}
        bookedPeriods={property?.bookedPeriods}
        bookHandler={bookProperty}
        estimateHandler={estimateTransactionCost}
      ></BookModal>
    </Box>
  );
};

export default ViewProperty;
