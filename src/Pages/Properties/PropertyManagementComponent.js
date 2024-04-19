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
import Web3 from "web3";
import PropertyManagementABI from "./PropertyManagement.json";
import { useNavigate } from "react-router-dom";
import env from "../../env";

const PropertyManagementComponent = () => {
  const [web3, setWeb3] = useState(null);
  const [propertyManagementContract, setPropertyManagementContract] =
    useState(null);
  const [properties, setProperties] = useState([]);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (window.ethereum) {
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);

      const propertyContract = new web3Instance.eth.Contract(
        PropertyManagementABI,
        env.contractAddress
      );
      setPropertyManagementContract(propertyContract);

      loadProperties(propertyContract);
    }
  }, []);

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
      <Flex flexDir={"row"} justifyContent={"space-between"}>
        <Heading mb="4">Property Management</Heading>
        <Button onClick={() => navigate("/addProperty")}>Add property</Button>
      </Flex>
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
              borderColor={"green.300"}
              boxShadow="0 0 8px rgba(0, 0, 0, 0.1)"
              transition="border-color 0.2s"
              _hover={{
                borderColor:"green.500",
              }}
            >
              <Heading size="sm" mb="2">
                Location: {property.name}
              </Heading>
              <Divider />
              <Box mt="2">
                <div>Description: {property.description}</div>
                <div>Price per night: {property.pricePerNight}</div>
                <Flex w="50%" justifyContent={"space-between"}>
                  <Button
                    mt="3"
                    onClick={() => navigate(`/viewProperty/${property.id}`)}
                  >
                    View Property
                  </Button>
                  <Button
                    colorScheme="red"
                    mt="3"
                    onClick={() => removeProperty(property.id)}
                  >
                    Remove Property
                  </Button>
                </Flex>
              </Box>
            </Box>
          </ListItem>
        ))}
      </UnorderedList>
    </Box>
  );
};

export default PropertyManagementComponent;
