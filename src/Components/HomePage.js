import React from "react";
import { Box, Text, Button } from "@chakra-ui/react";

const HomePage = () => {
  const backgroundImageUrl =
    "https://www.placesofjuma.com/wp-content/uploads/2022/05/Santorini-Kamari-Beach-4.jpg";

  return (
    <Box
      bgImage={`url(${backgroundImageUrl})`}
      bgSize="cover"
      bgPosition="center"
      h="100vh"
      position="relative"
      textAlign="center"
    >
      <Box
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        color="white"
        p="5"
        borderRadius="lg"
        boxShadow="lg"
        bg="rgba(0, 0, 0, 0.7)"
      >
        <Text fontSize="4xl" fontWeight="bold" mb="5">
          Welcome to Our Accomodation Web3 App
        </Text>
        <Text fontSize="lg" mb="5">
          Discover the finest real estate listings in the city. Explore our curated listings and find your dream home today!
        </Text>
      </Box>
    </Box>
  );
};

export default HomePage;