import React from "react";
import { Avatar } from "@chakra-ui/avatar";
import { Image } from "@chakra-ui/image";
import { Box, Flex, Text } from "@chakra-ui/layout";
import { Link as RouterLink } from "react-router-dom";
import {
    Link,
  VStack,
  HStack,
  Divider,
  useColorModeValue,
} from "@chakra-ui/react";

const UserSearchCard = ({ userDetails }) => {
  const dividerColor = useColorModeValue("black", "gray.500");
  return (
    <>
      <Flex
       
        p={2}
        mb={4}
        w="full"
        alignItems="center"
      >
        <Avatar
          size="md"
          src={userDetails?.profilepicture || "https://bit.ly/broken-link"}
          mr={4}
        />
        <Flex flex={1} flexDirection={"column"} gap={2}>
          <Flex justifyContent={"space-between"} w={"full"}>
            <Flex w={"full"} alignItems={"center"}>
              <HStack gap={2}>
                <Link as ={RouterLink} to={`/user/${userDetails._id}`}>
                <Text
                  fontSize={"l"}
                  fontWeight={"bold"}
                  _hover={{
                    boxShadow: "0 0 20px rgba(128, 128, 128, 0.7)",
                    bg: "transparent",
                  }}
                  onClick={() => {}}
                >
                  {userDetails.username}
                </Text>
                </Link>
                <Image src="/verified.png" w={4} h={4} />
              </HStack>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
      <Divider
        orientation="horizontal"
        borderColor={dividerColor}
        borderWidth="1px"
      />
    </>
  );
};

export default UserSearchCard;
