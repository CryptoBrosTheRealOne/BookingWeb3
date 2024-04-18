import React, { useEffect, useState } from "react";
import {
  Flex,
  Text,
  Link,
  Button,
  Stack,
  useColorModeValue,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

function Navigation() {
  const navigate = useNavigate();

  const [isNavSticky, setIsNavSticky] = useState(false);

  const handleScroll = () => {
    if (window.scrollY > 0) {
      setIsNavSticky(true);
    } else {
      setIsNavSticky(false);
    }
  };

  const bgColor = useColorModeValue("blue.500", "gray.800");
  const textColor = useColorModeValue("white", "gray.300");

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleSignOut = () => {
    navigate("/SignOut");
  };
  const handleEditProfile = () => {
    navigate("/editUser");
  };

  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      w="100%"
      p={4}
      bg={bgColor}
      color={textColor}
      position={isNavSticky ? "fixed" : "relative"}
      top="0"
      zIndex="1000"
    >
      <Text fontSize="xl" fontWeight="bold">
        Book accomodation
      </Text>

      <Stack direction="row" spacing={4}>
        <Link href="/" fontSize="md" _hover={{ color: "blue.300" }}>
          Main Page
        </Link>
        <>
          <Link
            href="/propertyManage"
            fontSize="md"
            _hover={{ color: "blue.300" }}
          >
            See accomodations
          </Link>
          <Link href="/profile" fontSize="md" _hover={{ color: "blue.300" }}>
            Profile
          </Link>
        </>
      </Stack>
    </Flex>
  );
}

export default Navigation;
