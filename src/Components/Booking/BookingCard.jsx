import {
  Box,
  Flex,
  Text,
  Image,
  Badge,
  Heading,
  Divider,
} from "@chakra-ui/react";
import React from "react";

const BookingCard = ({ property }) => {
  function formatDate(date) {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

  function EventStatusBadge() {
    debugger;
    const now = new Date();

    const start = new Date(property.startDate);
    const end = new Date(property.endDate);

    let status;
    let colorScheme;
    if (now < start) {
      status = "Upcoming";
      colorScheme="teal"
    } else if (now >= start && now <= end) {
      status = "During";
      colorScheme = "yellow"
    } else {
      status = "Expired";
      colorScheme="red"
    }
    return (
      <Badge rounded="full" px="2" colorScheme={colorScheme}>
        {status}
      </Badge>
    );
  }

  return (
    <Box
      bg="#edf3f8"
      _dark={{
        bg: "gray.800",
      }}
      my={8}
      maxW="sm"
      borderWidth="1px"
      rounded="lg"
      shadow="lg"
    >
      <Image src={property.imageUrl} alt={property.imageAlt} roundedTop="lg" />
      <Box p={5}>
        <Heading size="sm" mb="2">
          Location: {property.propertyName}
        </Heading>
        <Divider />
        {EventStatusBadge()}
        <Box mt="2">
          <div>
            Period: {formatDate(property.startDate)} -{" "}
            {formatDate(property.endDate)}
          </div>
          <div>
            Total price: {property.price.toString()}{" "}
            <Box as="span" color="gray.600" fontSize="sm">
              {` wei`}
            </Box>
          </div>
        </Box>
      </Box>
    </Box>
  );
};

export default BookingCard;
