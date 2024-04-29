import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Input,
  Button,
  UnorderedList,
  ListItem,
  Divider,
  useToast,
  Flex,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useWeb3 } from "../../hooks/useWeb3";
import { subscribeToPropertyRemoved } from "./service/propertyService";
import PropertyCard from "../../Components/Property/PropertyCard";

const PropertyManagementComponent = () => {
  const { web3, accounts, contracts } = useWeb3(); // Using a custom hook to handle web3 initialization
  const { propertyManagementContract, propertyReservationContract } = contracts;

  const [properties, setProperties] = useState([]);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (contracts.propertyManagementContract) {
      if (propertyManagementContract) {
        loadProperties(propertyManagementContract);
      }

      const unsubscribe = subscribeToPropertyRemoved(
        propertyManagementContract,
        handleRemove
      );
    }
  }, [contracts.propertyManagementContract]);

  const handleRemove = () => {
    toast({
      title: "Property Removed",
      description: "Property removed successfully",
      status: "success",
      duration: 5000,
      isClosable: true,
    });

    loadProperties(propertyManagementContract);
  };

  const loadProperties = async (propertyContract) => {
    const propertiesCount = await propertyContract.methods
      .nextPropertyId()
      .call();
    const loadedProperties = [];
    for (let i = 0; i < propertiesCount; i++) {
      const property = await propertyContract.methods.getProperty(i).call();
      property.pricePerNight = Number(property.pricePerNight);
      loadedProperties.push(property);
    }
    setProperties(loadedProperties);
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
      <Flex flexDir={"row"} justifyContent={"space-between"}>
        <Heading mb="4">Property Management</Heading>
        <Button onClick={() => navigate("/addProperty")}>Add property</Button>
      </Flex>
      <Divider mb="4" />
      {properties.map((property) => (
          <PropertyCard
            key={property.id}
            property={{
              ...property,
              imageUrl: "https://bit.ly/2Z4KKcF",
              imageAlt: "Rear view of modern home with pool",
              title: property.name,
              description: property.description,
              formattedPrice: property.pricePerNight,
            }}
            removeHandler={removeProperty}
          />
      ))}
    </Box>
  );
};

export default PropertyManagementComponent;
