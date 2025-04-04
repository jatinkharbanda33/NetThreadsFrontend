import React, { useEffect, useState } from "react";
import { Avatar } from "@chakra-ui/avatar";
import { Image } from "@chakra-ui/image";
import { Box, Flex, Text } from "@chakra-ui/layout";
import { FaRegHeart, FaRegComment, FaHeart } from "react-icons/fa";
import axios from "axios";
import { Link as RouterLink } from "react-router-dom";
import {
  HStack,
  Link,
  VStack,
  Divider,
  useColorModeValue,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
const Reply = React.memo(
  ({ reply}) => {
    const navigate = useNavigate();
    const dividerColor = useColorModeValue("black", "gray.500");
    let replypath = String(`/reply/${reply._id}`);
    let likespath = String(`/reply/likes/${reply._id}`);
    const [isLiked, setLike] = useState(false);
    const [likesCount, setLikesCount] = useState(reply.likesCount);
    const [repliesCount, setrepliesCount] = useState(reply.repliesCount);
    const formatTextWithLinks = (text) => {
      const linkRegex = /(https?:\/\/[^\s]+)/g;
      return text.split(linkRegex).map((part, index) => {
        if (part.match(linkRegex)) {
          return (
            <Text
              as="a"
              key={index}
              href={part}
              color="blue.500"
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()} // Prevents post click
            >
              {part}
            </Text>
          );
        }
        return part;
      });
    };
    const formatTimestamp = (timestamp) => {
      const now = new Date();
      const timestampDate = new Date(timestamp.replace(" ", "T"));
      const diff = now.getTime() - timestampDate.getTime();
      const seconds = Math.floor(diff / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);

      if (seconds < 60) {
        return seconds + "s";
      } else if (minutes < 60) {
        return minutes + "m";
      } else if (hours <= 48) {
        return hours + "h";
      } else {
        return days + "d";
      }
    };
    const toggleLike = async () => {
      try {
        if (isLiked) {
          setLike(!isLiked);
          setLikesCount(likesCount - 1);
        } else {
          setLike(!isLiked);
          setLikesCount(likesCount + 1);
        }
        const token = localStorage.getItem("authToken");

        let payload = {
          replyId: reply._id,
        };
        const sendConfig = {
          method: "POST",
          url: `${import.meta.env.VITE_API_BASE_URL}/reply/like/${reply._id}`,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          data: payload,
        };
        const request = await axios(sendConfig);
        if (request.status == 401) navigate("/");

        const response = await request.data;

        if (!response.status) {
          console.error(response.error);
          return;
        }

        if (isLiked) {
          reply = { ...reply, likesCount: reply.likesCount - 1 };
        } else {
          reply = { ...reply, likesCount: reply.likesCount + 1 };
        }
      } catch (err) {
        console.log(err);
      }
    };
    useEffect(() => {
      if(reply?.likedByUser && reply.likedByUser==true){
        setLike(true);
      }
     
    }, []);
    // function formatTimestamp(timestamp) {
    //   const now = new Date();
    //   const diff = now.getTime() - new Date(timestamp).getTime();
    //   const seconds = Math.floor(diff / 1000);
    //   const minutes = Math.floor(seconds / 60);
    //   const hours = Math.floor(minutes / 60);
    //   const days = Math.floor(hours / 24);

    //   if (seconds < 60) {
    //      return seconds + "s";
    //   } else if (minutes < 60) {
    //      return minutes + "m";
    //   } else if (hours <= 48) {
    //      return hours + "h";
    //   } else {
    //      return days + "d";
    //   }
    //  }

    return (
      <>
        <Flex borderColor={"gray"}>
          <VStack>
            <Avatar
              size="md"
              src={reply.profilepicture}
              mt={2.5}
            />
          </VStack>
          <Flex flex={1} flexDirection={"column"} gap={2} padding={2}>
            <Flex justifyContent={"space-between"} w={"full"}>
              <Flex w={"full"} alignItems={"center"}>
                <HStack gap="2">
                  <Link
                    as={RouterLink}
                    to={`/user/${reply.postedBy}`}
                    _hover={{ textDecoration: "none" }}
                  >
                    <Text
                      fontSize={"l"}
                      fontWeight={"bold"}
                      _hover={{
                        color: "gray.600",
                        transition: "color 0.2s ease-in-out",
                      }}
                    >
                      {reply.username}
                    </Text>
                  </Link>
                  {reply.verified && reply.verified === true && <Image src="/verified.png" w={4} h={4} />}
                </HStack>
              </Flex>
              <Flex gap={4} alignItems={"center"}>
                <Text
                  fontSize={"sm"}
                  width={36}
                  textAlign={"right"}
                  color={"gray.light"}
                >
                  {formatTimestamp(reply.inserted_at)}
                </Text>
              </Flex>
            </Flex>
            <Box
              as="div"
              onClick={() => navigate(postpath)} // Manual navigation
              cursor="pointer"
              _hover={{ textDecoration: "none" }}
            >
              <Text 
                fontSize={"15px"} 
                mb={3}
                px={2}
              >
                {formatTextWithLinks(reply.text)}
              </Text>
              {reply.image && (
                <Box
                  borderRadius={6}
                  overflow={"hidden"}
                  border={"1px solid"}
                  borderColor={"gray.light"}
                  mx={2}
                  _hover={{
                    opacity: 0.95,
                    transition: "opacity 0.2s ease-in-out",
                  }}
                >
                  <Image src={reply.image} w={"full"} maxHeight={"460px"} />
                </Box>
              )}
            </Box>
            <HStack gap={4}>
              {isLiked ? (
                <Box
                  as={FaHeart}
                  color="red"
                  onClick={toggleLike}
                  size={24}
                  _hover={{ transform: "scale(1.1)" }}
                />
              ) : (
                <Box
                  as={FaRegHeart}
                  onClick={toggleLike}
                  size={24}
                  _hover={{ transform: "scale(1.1)" }}
                />
              )}
              <Link as={RouterLink} to={replypath}>
                <Box
                  as={FaRegComment}
                  size={24}
                  _hover={{ transform: "scale(1.1)" }}
                />
              </Link>
            </HStack>
            <HStack gap={2}>
              {likesCount > 0 ? (
                <Link
                  as={RouterLink}
                  to={likespath}
                  _hover={{ textDecoration: "none" }}
                >
                  <Text
                    color="#777777"
                    _hover={{
                      color: "gray.600",
                      transition: "color 0.2s ease-in-out",
                    }}
                  >
                    {likesCount} likes
                  </Text>
                </Link>
              ) : (
                <Text color="#777777">{likesCount} likes</Text>
              )}
              {repliesCount > 0 ? (
                <Link
                  as={RouterLink}
                  to={replypath}
                  _hover={{ textDecoration: "none" }}
                >
                  <Text color="#777777">{repliesCount} replies</Text>
                </Link>
              ) : (
                <Text color="#777777">{repliesCount} replies</Text>
              )}
            </HStack>
          </Flex>
        </Flex>
        <Divider
          orientation="horizontal"
          borderColor={dividerColor}
          borderWidth="1px"
        />
      </>
    );
  },
    (prevProps, nextProps) => {
      return prevProps.id === nextProps.id;
    }
);

export default Reply;
