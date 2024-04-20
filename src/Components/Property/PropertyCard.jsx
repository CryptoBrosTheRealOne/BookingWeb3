import {
  Badge,
  Box,
  Flex,
  Text,
  Image,
  chakra,
  Link,
  Button,
} from "@chakra-ui/react";
import React from "react";
import { useNavigate } from "react-router-dom";

const PropertyCard = ({ property, removeHandler }) => {
  const navigate = useNavigate();
  return (
    <>
      <Box
        bg="#edf3f8"
        _dark={{
          bg: "gray.800",
        }}
        mx={{
          lg: 8,
        }}
        display={{
          lg: "flex",
        }}
        maxW={{
          lg: "5xl",
        }}
        shadow={{
          lg: "lg",
        }}
        rounded={{
          lg: "lg",
        }}
        my={8}
      >
        <Box
          w={{
            lg: "50%",
          }}
        >
          <Box
            h={{
              base: 64,
              lg: "full",
            }}
            rounded={{
              lg: "lg",
            }}
            bgSize="cover"
            style={{
              backgroundImage: `url(${property.imageUrl})`,
            }}
          ></Box>
        </Box>

        <Box
          py={12}
          px={6}
          maxW={{
            base: "xl",
            lg: "5xl",
          }}
          w={{
            lg: "50%",
          }}
        >
          <chakra.h2
            fontSize={{
              base: "2xl",
              md: "3xl",
            }}
            color="gray.800"
            _dark={{
              color: "white",
            }}
            fontWeight="bold"
          >
            {property.title}
          </chakra.h2>
          <Text
            mt="1"
            color="gray.500"
            fontWeight="semibold"
            as="h4"
            lineHeight="tight"
            noOfLines={1}
          >
            {property.description}
          </Text>
          <Box>
            {property.formattedPrice}
            <Box as="span" color="gray.600" fontSize="sm">
              {` wei/night`}
            </Box>
          </Box>
          <Flex justifyContent={"space-between"}>
            <Button
              mt="3"
              onClick={() => navigate(`/viewProperty/${property.id}`)}
            >
              View Property
            </Button>
            <Button
              colorScheme="red"
              mt="3"
              onClick={() => removeHandler(property.id)}
            >
              Remove Property
            </Button>
          </Flex>
        </Box>
      </Box>
    </>
  );
};

export default PropertyCard;
