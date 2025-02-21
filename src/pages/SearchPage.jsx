import React, { useEffect, useState } from "react";
import { Box, Flex, Input, Spinner } from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { addInCache } from "../redux/slices/searchCacheSlice";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "sonner";
import UserSearchCard from "../components/userSearchCard";

const SearchPage = React.memo(() => {
  const navigate = useNavigate();
  const [searchArray, setSearchArray] = useState([]);
  let searchCache = useSelector((state) => state.searchCache);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const dispatch = useDispatch();

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

  useEffect(() => {
    setLoading(true);
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
  }, [searchQuery]);

  return (
    <Flex w="full" direction="column" alignItems="center">
      <Box w="full">
        <Input
          type="text"
          variant="unstyled"
          p={3}
          placeholder="Search here"
          size="lg"
          focusBorderColor="grey"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
          }}
        ></Input>
      </Box>
      {loading && (
        <Flex justify={"center"}>
          <Spinner size="xl"></Spinner>
        </Flex>
      )}
      {!loading &&
        searchArray.map((userDetails) => (
          <UserSearchCard key={userDetails.id} userDetails={userDetails}></UserSearchCard>
        ))}
    </Flex>
  );
});

export default SearchPage;
