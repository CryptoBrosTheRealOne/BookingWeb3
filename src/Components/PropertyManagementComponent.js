import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Input,
  Button,
  UnorderedList,
  ListItem,
  Divider,
  useToast
} from "@chakra-ui/react";
import Web3 from "web3";
import PropertyManagementABI from "./PropertyManagement.json";

const PropertyManagementComponent = () => {
  const [web3, setWeb3] = useState(null);
  const [propertyManagementContract, setPropertyManagementContract] = useState(null);
  const [properties, setProperties] = useState([]);
  const [newPropertyLocation, setNewPropertyLocation] = useState("");
  const [newPropertyDescription, setNewPropertyDescription] = useState("");
  const [newPropertyPrice, setNewPropertyPrice] = useState("");
  const toast = useToast();

  useEffect(() => {
    if (window.ethereum) {
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);

      const propertyContract = new web3Instance.eth.Contract(
        PropertyManagementABI,
        "0x8dbe9a4977b2794e1d81c95d351453eae33bde3a"
      );
      setPropertyManagementContract(propertyContract);

      loadProperties(propertyContract);
    }
  }, []);

  const loadProperties = async (propertyContract) => {
    const propertiesCount = await propertyContract.methods.nextPropertyId().call();
    const loadedProperties = [];
    for (let i = 0; i < propertiesCount; i++) {
      const property = await propertyContract.methods.getProperty(i).call();
      property.pricePerNight = Number(property.pricePerNight);
      loadedProperties.push(property);
    }
    setProperties(loadedProperties);
  };

  const addProperty = async () => {
    try {
      const accounts = await web3.eth.getAccounts();
      if (accounts.length === 0) {
        console.error("No accounts found.");
        return;
      }
      const fromAddress = accounts[0];
      await propertyManagementContract.methods
        .addProperty(newPropertyLocation, newPropertyDescription, newPropertyPrice)
        .send({ from: fromAddress });

      toast({
        title: "Property Added",
        description: "Property added successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      // Refresh properties
      loadProperties(propertyManagementContract);
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

  const removeProperty = async (propertyId) => {
    try {
        const accounts = await web3.eth.getAccounts();
        if (accounts.length === 0) {
            console.error("No accounts found.");
            return;
        }
        const fromAddress = accounts[0];
        await propertyManagementContract.methods
            .removeProperty(propertyId)
            .send({ from: fromAddress });

        toast({
            title: "Property Removed",
            description: "Property removed successfully",
            status: "success",
            duration: 5000,
            isClosable: true,
        });

        // Refresh properties
        loadProperties(propertyManagementContract);
    } catch (error) {
        console.error("Error removing property:", error);
        toast({
            title: "Error",
            description: "Failed to remove property: " + error.message,
            status: "error",
            duration: 5000,
            isClosable: true,
        });
    }
};


  return (
    <Box maxW="800px" mx="auto" p="4">
      <Heading mb="4">Property Management</Heading>
      <Box mb="4">
        <Heading size="md" mb="2">
          Add New Property
        </Heading>
        <Input
          type="text"
          value={newPropertyLocation}
          onChange={(e) => setNewPropertyLocation(e.target.value)}
          placeholder="Location"
          mb="2"
        />
        <Input
          type="text"
          value={newPropertyDescription}
          onChange={(e) => setNewPropertyDescription(e.target.value)}
          placeholder="Description"
          mb="2"
        />
        <Input
          type="number"
          value={newPropertyPrice}
          onChange={(e) => setNewPropertyPrice(e.target.value)}
          placeholder="Price per night"
          mb="2"
        />
        <Button colorScheme="teal" onClick={addProperty}>
          Add Property
        </Button>
      </Box>
      <Divider mb="4" />
      <Heading size="md" mb="2">
        Properties
      </Heading>
      <UnorderedList>
        {properties.map((property) => (
          <ListItem key={property.id} mb="4">
            <Box
              borderWidth="1px"
              borderRadius="lg"
              p="4"
              borderColor={property.available ? "green.300" : "red.300"}
              boxShadow="0 0 8px rgba(0, 0, 0, 0.1)"
              transition="border-color 0.2s"
              _hover={{
                borderColor: property.available ? "green.500" : "red.500"
              }}
            >
              <Heading size="sm" mb="2">
                Location: {property.location}
              </Heading>
              <Divider />
              <Box mt="2">
                <div>Description: {property.description}</div>
                <div>Price per night: {property.pricePerNight}</div>
                <div>Available: {property.available ? "Yes" : "No"}</div>
                <Button colorScheme="red" mt="3" onClick={() => removeProperty(property.id)}>
                  Remove Property
                </Button>
              </Box>
            </Box>
          </ListItem>
        ))}
      </UnorderedList>
    </Box>
  );
};

export default PropertyManagementComponent;
