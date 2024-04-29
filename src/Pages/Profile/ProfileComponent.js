import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Text,
  useToast,
} from "@chakra-ui/react";
import { getDateRange } from "../Properties/BookModal";
import { useWeb3 } from "../../hooks/useWeb3";
import BookingCard from "../../Components/Booking/BookingCard";
function UserProfiles() {
  const [myBookings, setMyBookings] = useState([]);
  const { web3, accounts, contracts } = useWeb3(); // Using a custom hook to handle web3 initialization
  const { propertyManagementContract, propertyReservationContract } = contracts;

  const toast = useToast();

  useEffect(() => {
    if (propertyManagementContract) {
      loadProperties();
    }
  }, [propertyManagementContract]);

  const loadProperties = async () => {
    const properties = await propertyReservationContract.methods
      .getMyBookings(accounts[0])
      .call();

    let changedProperties = properties;
    for (let prop of changedProperties) {
      [prop.startDate, prop.endDate] = getDateRange(
        new Date(parseInt(prop.startDate.toString()) * 1000),
        new Date(parseInt(prop.endDate.toString()) * 1000)
      );
    }
    setMyBookings(changedProperties);
  };

  return (
    <Box maxW="800px" mx="auto" p="4">
      <Flex flexDir={"row"} justifyContent={"space-between"}>
        <Heading mb="4">My bookings</Heading>
      </Flex>
      <Divider mb="4" />
      {myBookings &&
        myBookings.map((property) => (
          <>
            {/* <Box
            key={property.id}
            borderWidth="1px"
            borderRadius="lg"
            p="4"
            borderColor={"green.300"}
            boxShadow="0 0 8px rgba(0, 0, 0, 0.1)"
            transition="border-color 0.2s"
            _hover={{
              borderColor: "green.500",
            }}
          >
            <Heading size="sm" mb="2">
              Location: {property.propertyName}
            </Heading>
            <Divider />
            <Box mt="2">
              <div>
                Period: {formatDate(property.startDate)} -{" "}
                {formatDate(property.endDate)}
              </div>
              <div>Total price: {property.price.toString()}</div>
            </Box>
          </Box> */}
            <BookingCard
            key={property.id}
              property={{
                imageUrl: "https://bit.ly/2Z4KKcF",
                imageAlt: "Rear view of modern home with pool",
                title: property.name,
                formattedPrice: property.price.toString(),
                ...property,
              }}
            />
          </>
        ))}
    </Box>
  );
}

export default UserProfiles;
