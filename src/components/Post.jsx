import React, { useEffect, useState, useRef } from "react";
import { Avatar } from "@chakra-ui/avatar";
import { Image } from "@chakra-ui/image";
import { Box, Flex, Text } from "@chakra-ui/layout";
import { Link as RouterLink } from "react-router-dom";
import { FaRegHeart, FaRegComment, FaHeart } from "react-icons/fa";
import {
  HStack,
  Link,
  Divider,
  useColorModeValue,
} from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { updatePost } from "../redux/slices/postSlice";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Post = React.memo(
  ({ post, postname, profilepic }) => {
    const navigate = useNavigate();
    let dispatch = useDispatch();
    if (postname) {
      post.profilepicture = profilepic;
      post.username = postname;
    }
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
    const dividerColor = useColorModeValue("black", "gray.500");
    let postpath = String(`/post/${post._id}`);
    let likespath = String(`/post/likes/${post._id}`);
    const [isLiked, setLike] = useState(false);
    const [likesCount, setLikesCount] = useState(post.likesCount);
    const [repliesCount, setrepliesCount] = useState(post.repliesCount);
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
        const sendConfig = {
          method: "POST",
          url: `${import.meta.env.VITE_API_BASE_URL}/posts/like/${post._id}`,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        };
        const request = await axios(sendConfig);
        if (request.status == 401) navigate("/");
        const response = await request.data;
        if (response.error) {
          console.error(response.error);
          return;
        }

        if (isLiked) {
          let newpost = { ...post, likesCount: post.likesCount - 1 };
          dispatch(updatePost(newpost));
        } else {
          let newpost = { ...post, likesCount: post.likesCount + 1 };
          dispatch(updatePost(newpost));
        }
      } catch (err) {
        console.error(err);
      }
    };
    useEffect(() => {
      const isLiked = async () => {
        try {
          const token = localStorage.getItem("authToken");
          const sendConfig = {
            method: "POST",
            url: `${import.meta.env.VITE_API_BASE_URL}/posts/isliked/${
              post._id
            }`,
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          };
          const request = await axios(sendConfig);
          if (request.status == 401) navigate("/");
          const response = await request.data;
          if (response.error) {
            return;
          }
          setLike(response["answer"]);
        } catch (err) {
          console.error(err);
        }
      };
      isLiked();
    }, []);
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

    return (
      <Box width="100%" overflowX="hidden">
        <Flex borderColor={"gray"} direction={"row"} gap={1}>
          <Avatar
            size="md"
            src={post.profilepicture}
            mt={2.5}
          />
          <Flex flex={1} flexDirection={"column"} gap={2} padding={2}>
            <Flex justifyContent={"space-between"} w={"full"}>
              <Flex w={"full"} alignItems={"center"}>
                <HStack gap="2">
                  <Link
                    as={RouterLink}
                    to={`/user/${post.postedBy}`}
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
                      {post.username}
                    </Text>
                  </Link>
                  {post.verified && post.verified === true && (
                    <Image src="/verified.png" w={4} h={4} />
                  )}
                </HStack>
              </Flex>
              <Flex gap={4} alignItems={"center"}>
                <Text
                  fontSize={"sm"}
                  width={36}
                  textAlign={"right"}
                  color={"gray.light"}
                >
                  {formatTimestamp(post.inserted_at)}
                </Text>
              </Flex>
            </Flex>
            <Box
              as="div"
              onClick={() => navigate(postpath)} // Manual navigation
              cursor="pointer"
              _hover={{ textDecoration: "none" }}
            >
              <Text fontSize={"15px"} mb={3}>
                {formatTextWithLinks(post.text)}
              </Text>
              {post.image && (
                <Box
                  borderRadius={6}
                  overflow={"hidden"}
                  border={"1px solid"}
                  borderColor={"gray.light"}
                  _hover={{
                    opacity: 0.95,
                    transition: "opacity 0.2s ease-in-out",
                  }}
                >
                  <Image src={post.image} w={"full"} maxHeight={"460px"} />
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
              <Link as={RouterLink} to={postpath}>
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
                  <Text color="#777777">{likesCount} likes</Text>
                </Link>
              ) : (
                <Text color="#777777">{likesCount} likes</Text>
              )}
              {repliesCount > 0 ? (
                <Link
                  as={RouterLink}
                  to={postpath}
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
      </Box>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.id === nextProps.id;
  }
);

export default Post;
