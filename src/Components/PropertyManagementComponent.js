import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Input,
  Button,
  UnorderedList,
  ListItem,
  Divider,
  Center,
} from "@chakra-ui/react";
import Web3 from "web3";
import PropertyManagementABI from "./PropertyManagement.json";

const PropertyManagementComponent = () => {
  const [web3, setWeb3] = useState(null);
  const [propertyManagementContract, setPropertyManagementContract] =
    useState(null);
  const [properties, setProperties] = useState([]);
  const [newPropertyLocation, setNewPropertyLocation] = useState("");
  const [newPropertyDescription, setNewPropertyDescription] = useState("");
  const [newPropertyPrice, setNewPropertyPrice] = useState("");

  useEffect(() => {
    if (window.ethereum) {
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);

      // Load PropertyManagement contract
      const propertyManagementContract = new web3Instance.eth.Contract(
        PropertyManagementABI,
        "0x14f6ccbb1d1132632499d0a2ef35b4f1feb7b77d"
      );
      setPropertyManagementContract(propertyManagementContract);

      // Load properties
      const loadProperties = async () => {
        const propertiesCount =
          await propertyManagementContract.methods.nextPropertyId().call();
        const properties = [];
        for (let i = 0; i < propertiesCount; i++) {
          const property = await propertyManagementContract.methods
            .getProperty(i)
            .call();
            property.pricePerNight=Number(property.pricePerNight);
          properties.push(property);
        }
        setProperties(properties);
      };
      loadProperties();
      

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
        .addProperty(
          newPropertyLocation,
          newPropertyDescription,
          newPropertyPrice
        )
        .send({
          from: fromAddress,
        });

      console.log("Property added successfully");

      // Refresh properties
      const propertiesCount =
        await propertyManagementContract.methods.nextPropertyId().call();
      const properties = [];
      for (let i = 0; i < propertiesCount; i++) {
        const property = await propertyManagementContract.methods
          .getProperty(i)
          .call();
        properties.push(property);
      }
      setProperties(properties);
    } catch (error) {
      console.error("Error adding property:", error);
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
      // Add a shadow for better visual separation
      boxShadow="0 0 8px rgba(0, 0, 0, 0.1)"
      // Add a transition for the border color
      transition="border-color 0.2s"
      // Change border color on hover
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
        <div>
          Available: {property.available ? "Yes" : "No"}
        </div>
      </Box>
    </Box>
  </ListItem>
))}

      </UnorderedList>
    </Box>
  );
};

export default PropertyManagementComponent;
