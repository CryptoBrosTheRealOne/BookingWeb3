import React, { useEffect, useState } from 'react'
import Web3 from 'web3';
import PropertyManagementABI from "./PropertyManagement.json";
import { Box, Button, Divider, Flex, FormControl, FormLabel, Heading, Input, useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import InsertMap from '../../Components/InsertMap/InsertMap';
import env from '../../env';

const AddProperty = () => {
  const [newPropertyLocation, setNewPropertyLocation] = useState("");
  const [newPropertyDescription, setNewPropertyDescription] = useState("");
  const [newPropertyPrice, setNewPropertyPrice] = useState("");
  const [web3, setWeb3] = useState(null);
  const [propertyManagementContract, setPropertyManagementContract] =
    useState(null);
  const toast = useToast();
  const navigate = useNavigate();
  const [newLocation, setNewLocation] = useState({})

  useEffect(() => {
    if (window.ethereum) {
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);

      const propertyContract = new web3Instance.eth.Contract(
        PropertyManagementABI,
        env.contractAddress
      );
      setPropertyManagementContract(propertyContract);
    }
  }, []);

  const addProperty = async () => {
    try {
      const accounts = await web3.eth.getAccounts();
      if (accounts.length === 0) {
        console.error("No accounts found.");
        return;
      }
      const fromAddress = accounts[0];
      await propertyManagementContract.methods
        .addProperty(newPropertyLocation, newPropertyDescription, newPropertyPrice, parseInt(newLocation.lat * 100000), parseInt(newLocation.lng * 100000))
        .send({ from: fromAddress });

      toast({
        title: "Property Added",
        description: "Property added successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      navigate("/propertyManage")
    } catch (error) {
      console.error("Error adding property:", error);
      toast({
        title: "Error",
        description: "Failed to add property",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };
  return (
    <Box maxW="800px" mx="auto" p="4">
      <Box mb="4">
        <Heading size="lg" mb="2">
          Add New Property
        </Heading>
        <Divider/>
        <FormControl mt="5">
          <FormLabel>Name</FormLabel>
          <Input
            type="text"
            value={newPropertyLocation}
            onChange={(e) => setNewPropertyLocation(e.target.value)}
            placeholder="Name"
            mb="2"
          />
        </FormControl>

        <FormControl>
          <FormLabel>Description</FormLabel>
          <Input
            type="text"
            value={newPropertyDescription}
            onChange={(e) => setNewPropertyDescription(e.target.value)}
            placeholder="Description"
            mb="2"
          />
        </FormControl>

        <FormControl>
          <FormLabel>Price</FormLabel>
          <Input
            type="number"
            value={newPropertyPrice}
            onChange={(e) => setNewPropertyPrice(e.target.value)}
            placeholder="Price per night"
            mb="2"
          />
        </FormControl>

        <FormControl>
          <FormLabel>Location</FormLabel>
          <Flex justifyContent={"center"} alignItems={"center"}>
            <InsertMap changeHandler={setNewLocation} />
          </Flex>
          
        </FormControl>

        <Flex m="5" alignItems={"center"} justifyContent={"center"}>
          <Button size="lg" colorScheme="teal" onClick={addProperty}>
            Add Property
          </Button>
        </Flex>

      </Box>

    </Box>
  )
}

export default AddProperty