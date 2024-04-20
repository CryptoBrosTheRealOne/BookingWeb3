import { Box, Divider, Flex, Heading, useToast, Text, Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import PropertyManagementABI from "./PropertyManagement.json";
import { useNavigate, useParams } from 'react-router-dom';
import Web3 from 'web3';
import env from '../../env';
import InteractiveMap from '../../Components/Map/Map';
import PropertyReservationABI from './PropertyReservation.json';

import BookModal from './BookModal';

const ViewProperty = () => {
    let { id } = useParams();
    const [web3, setWeb3] = useState(null);
    const [propertyManagementContract, setPropertyManagementContract] =
        useState(null);
    const [propertyReservationContract, setPropertyReservationContract] =
        useState(null);
    const [property, setProperty] = useState([]);
    const [coords, setCoords] = useState({})
    const toast = useToast();
    const navigate = useNavigate();
    const [accounts, setAccounts] = useState([]);
    const { isOpen, onOpen, onClose } = useDisclosure()

    useEffect(() => {
        if (window.ethereum) {
            const web3Instance = new Web3(window.ethereum);
            setWeb3(web3Instance);

            const propertyContract = new web3Instance.eth.Contract(
                PropertyManagementABI,
                env.contractAddress
            );
            setPropertyManagementContract(propertyContract);
            const reservationContract = new web3Instance.eth.Contract(
                PropertyReservationABI,
                env.reservationAddress
            );
            setPropertyReservationContract(reservationContract);
            const loadAccounts = async () => {
                const acc = await web3Instance.eth.getAccounts();
                setAccounts(acc);
            };
            loadAccounts();
        }
    }, []);

    useEffect(() => {
        if (web3 && propertyManagementContract) {
            loadProperty();
        }
    }, [web3, propertyManagementContract])

    const loadProperty = async () => {
        try {
            const accounts = await web3.eth.getAccounts();
            if (accounts.length === 0) {
                console.error("No accounts found.");
                return;
            }

            let x = await propertyManagementContract.methods
                .getProperty(id).call()
            setProperty(x)
            setCoords({ lat: parseFloat(parseInt(x.latitude.toString()) / 100000), lng: parseFloat(parseInt(x.longitude.toString()) / 100000) })
            console.log(x)
        } catch (error) {
            console.error("Error removing property:", error);
        }
    };

    const bookProperty = async (startDate, endDate) => {
        if (!propertyReservationContract || accounts.length === 0) {
            console.error("Contract not loaded or no accounts available");
            return;
        }
        try {
            let totalDays = Math.floor((endDate - startDate) / (60 * 60 * 24)) + 1;
            let totalPrice = totalDays * parseInt(property.pricePerNight.toString());
            const latestBlock = await web3.eth.getBlock('latest');

            const baseFee = parseInt(latestBlock.baseFeePerGas);
            const maxPriorityFeePerGas = web3.utils.toWei('2', 'gwei');  // Suggested tip to miner
            const maxFeePerGas = web3.utils.toWei((baseFee * 1.2 + parseInt(maxPriorityFeePerGas)).toString(), 'wei');

            web3.eth.sendTransaction({
                from: accounts[0],
                to: property.owner,
                value: totalPrice.toString(),
                gas: 21000, 
                maxFeePerGas: maxFeePerGas,
                maxPriorityFeePerGas: maxPriorityFeePerGas
            }).then(async (receipt) => {
                await propertyReservationContract.methods
                    .reserveProperty(id, startDate, endDate)
                    .send({ from: accounts[0] });

                toast({
                    title: "Success",
                    description: "Booked successfully, with transaction hash: " + receipt.transactionHash,
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });
                loadProperty()
                onClose()
            });


        } catch (error) {
            console.error("Error reserving property:", error);
            toast({
                title: "Error",
                description: "Failed to book property: " + error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    }

    return (
        <Box maxW="800px" mx="auto" p="4">
            <Flex flexDir={"row"} justifyContent={"space-between"}>
                <Heading mb="4">View - {property.name}</Heading>
                <Button onClick={onOpen}>Book</Button>
            </Flex>
            <Divider mb="4" />
            <Text>{property.description}</Text>
            {coords.lat && <InteractiveMap coords={coords} />}
            <BookModal isOpen={isOpen} onClose={onClose} bookedPeriods={property.bookedPeriods} bookHandler={bookProperty}></BookModal>
        </Box>
    )
}

export default ViewProperty