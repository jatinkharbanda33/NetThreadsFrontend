import React from "react";
import { Avatar } from "@chakra-ui/avatar";
import { Image } from "@chakra-ui/image";
import { Flex, Text } from "@chakra-ui/layout";
import { Box, useColorModeValue } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const UserSearchCard = ({ userDetails }) => {
  const navigate = useNavigate();
  const cardBg = useColorModeValue("white", "#151515");
  const hoverBg = useColorModeValue("gray.50", "#202020");
  const borderColor = useColorModeValue("gray.200", "gray.800");
  const secondaryText = useColorModeValue("gray.600", "gray.400");
  return (
    <Box
      w="full"
      bg={cardBg}
      borderRadius="lg"
      border="1px"
      borderColor={borderColor}
      overflow="hidden"
      transition="all 0.2s"
      _hover={{
        bg: hoverBg,
        transform: "translateY(-2px)",
        boxShadow: "sm",
        cursor: "pointer",
      }}
      onClick={() => navigate(`/user/${userDetails._id}`)}
    >
      <Flex p={4} alignItems="center" gap={4}>
        <Avatar
          size="lg"
          src={userDetails?.profilepicture || "https://bit.ly/broken-link"}
          name={userDetails.username}
          borderRadius="full"
          border="2px"
          borderColor={borderColor}
        />

        <Box flex="1">
          <Flex alignItems="center" gap={2} mb={1}>
            <Text fontSize="lg" fontWeight="bold">
              {userDetails.name}
            </Text>
            {userDetails.verified && (
              <Image src="/verified.png" w={5} h={5} alt="Verified" />
            )}
          </Flex>
          <Box spacing={4} color={secondaryText} fontSize="sm">
            <Text>@{userDetails?.username?.toLowerCase()}</Text>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
};

export default UserSearchCard;
