import { Box, Divider, Flex, Heading, useToast, Text, Button } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import PropertyManagementABI from "./PropertyManagement.json";
import { useNavigate, useParams } from 'react-router-dom';
import Web3 from 'web3';
import env from '../../env';
import InteractiveMap from '../../Components/Map/Map';
import PropertyReservationABI from './PropertyReservation.json';

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

        } catch (error) {
            console.error("Error removing property:", error);
        }
    };

    const bookProperty = async () => {
        if (!propertyReservationContract || accounts.length === 0) {
            console.error("Contract not loaded or no accounts available");
            return;
          }
          try {
            await propertyReservationContract.methods
              .reserveProperty(id)
              .send({ from: accounts[0] });
            console.log("Reservation successful");
            loadProperty()
          } catch (error) {
            console.error("Error reserving property:", error);
          }
    }


    return (
        <Box maxW="800px" mx="auto" p="4">
            <Flex flexDir={"row"} justifyContent={"space-between"}>
                <Heading mb="4">View - {property.name}</Heading>
                {property.available ? <Button onClick={bookProperty}>Book</Button> : <Text>Unavailable</Text>}
            </Flex>
            <Divider mb="4" />
            <Text>{property.description}</Text>
            {coords.lat && <InteractiveMap coords={coords} />}
        </Box>
    )
}

export default ViewProperty