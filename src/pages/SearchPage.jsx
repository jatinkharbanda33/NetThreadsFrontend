import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Input,
  Spinner,
  Container,
  Button,
  FormControl,
  FormHelperText,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { addInCache } from "../redux/slices/searchCacheSlice";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "sonner";
import UserSearchCard from "../components/UserSearchCard";

const SearchPage = React.memo(() => {
  const navigate = useNavigate();
  const [searchArray, setSearchArray] = useState([]);
  let searchCache = useSelector((state) => state.searchCache);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const dispatch = useDispatch();
  const bgColor = useColorModeValue("white", "#101010");
  const borderColor = useColorModeValue("gray.200", "gray.800");
  const textColor = useColorModeValue("gray.800", "whiteAlpha.900");
  const secondaryTextColor = useColorModeValue("gray.600", "gray.400");

  const getResults = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const sendConfig = {
        method: "GET",
        url: `${
          import.meta.env.VITE_API_BASE_URL
        }/search/username/?query=${searchQuery}&page=${page}`,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };
      const request = await axios(sendConfig);
      if (request.status == 401) navigate("/");
      const response = request.data;
      if (response.err) {
        toast.error(response.error);
        return;
      }
      const newItems = response.data;
      const payload = {
        key: searchQuery,
        values: newItems,
        page: page,
      };
      toast.success(response.message);
      dispatch(addInCache(payload));
      setSearchArray(newItems);
      setLoading(false);
      setHasMore(newItems.length == 10);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const updateSearchResult = () => {
    setPage(0);
    setHasMore(true);
    if (
      searchCache[searchQuery] == undefined ||
      searchCache[searchQuery].page < page
    ) {
      getResults();
    } else {
      setSearchArray(searchCache[searchQuery].values);
      setLoading(false);
    }
  };
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      updateSearchResult();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={6} align="stretch">
        <Box
          bg={bgColor}
          p={4}
          borderRadius="xl"
          boxShadow="sm"
          border="1px"
          borderColor={borderColor}
        >
          <FormControl>
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for users"
              size="lg"
              borderColor={borderColor}
              _hover={{ borderColor: textColor }}
              _focus={{ borderColor: textColor, boxShadow: "none" }}
            />
            <FormHelperText color={secondaryTextColor}>
              Search for users by their username
            </FormHelperText>
          </FormControl>
        </Box>

        {loading ? (
          <Flex justify="center" py={10}>
            <Spinner size="xl" thickness="4px" speed="0.65s" color="blue.500" />
          </Flex>
        ) : searchArray.length > 0 ? (
          <VStack
            spacing={2}
            bg={bgColor}
            borderRadius="xl"
            boxShadow="sm"
            border="1px"
            borderColor={borderColor}
            p={4}
          >
            {searchArray.map((userDetails) => (
              <UserSearchCard key={userDetails.id} userDetails={userDetails} />
            ))}
          </VStack>
        ) : (
          searchQuery &&
          !loading && (
            <Flex justify="center" py={10}>
              <Text color={useColorModeValue("gray.600", "gray.400")}>
                No users found matching "{searchQuery}"
              </Text>
            </Flex>
          )
        )}
      </VStack>
    </Container>
  );
});

export default SearchPage;
