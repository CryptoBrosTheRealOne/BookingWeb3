import React, { useState, useEffect } from "react";
import Web3 from "web3";
import PropertyReservationABI from "../Pages/Properties/PropertyReservation.json";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
} from "@chakra-ui/react";

const PropertyReservationComponent = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [propertyId, setPropertyId] = useState("");

  useEffect(() => {
    if (window.ethereum) {
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);
      const reservationContract = new web3Instance.eth.Contract(
        PropertyReservationABI,
        "0x17c4e63e41afeb6abcbc690421f6644687191259"
      );
      setContract(reservationContract);
      const loadAccounts = async () => {
        const acc = await web3Instance.eth.getAccounts();
        setAccounts(acc);
      };
      loadAccounts();
    }
  }, []);

  const handleReserveProperty = async () => {
    if (!contract || accounts.length === 0) {
      console.error("Contract not loaded or no accounts available");
      return;
    }
    try {
      await contract.methods
        .reserveProperty(propertyId)
        .send({ from: accounts[0] });
      console.log("Reservation successful");
    } catch (error) {
      console.error("Error reserving property:", error);
    }
  };

  return (
    <Box p="4" maxW="400px" mx="auto">
      <Heading mb="4">Reserve Property</Heading>
      <FormControl>
        <FormLabel>Property ID</FormLabel>
        <Input
          type="number"
          value={propertyId}
          onChange={(e) => setPropertyId(e.target.value)}
          placeholder="Enter Property ID"
          mb="4"
        />
        <Button colorScheme="teal" onClick={handleReserveProperty}>
          Reserve
        </Button>
      </FormControl>
    </Box>
  );
};

export default PropertyReservationComponent;
