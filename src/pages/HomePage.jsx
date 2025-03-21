import { Box, Flex, Spinner, useColorModeValue, Divider } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changePost } from "../redux/slices/postSlice";
import Post from "../components/Post";
import InfiniteScroll from "react-infinite-scroll-component";
import NewPost from "../components/NewPost";
import axios from 'axios'
import { useNavigate } from "react-router-dom";

const HomePage = React.memo(() => {
  const [loading, setLoading] = useState(false);
  const posts = useSelector((state) => state.post);
  const dispatch = useDispatch();
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const navigate=useNavigate();
  const dividerColor = useColorModeValue("black", "gray.500");
  const getFeedPosts = async (isInitialLoad = false) => {
    if (loading ||!hasMore) return;
    setLoading(true);
    try {

      const reqBody = { lastFetchedPostId:posts.length>0?posts[posts.length-1]._id:null };
      const token = localStorage.getItem('authToken');
      const sendConfig={
        method:"POST",
        url:`${import.meta.env.VITE_API_BASE_URL}/posts/feed/previous`,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data:reqBody
      }
      const request = await axios(sendConfig);
      if(request.status==401) navigate("/");
      const response = request.data;
      if (response.error) {
        console.log(response.error);
        return;
      }
      if (isInitialLoad) {
        dispatch(changePost(response)); 
      } else {
        const newPosts=[...posts,...response];
        dispatch(changePost(newPosts));
        setPage(prev => prev + 1);
      }
      setHasMore(response.length ==12);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
   if(posts.length==0){
      getFeedPosts(true); 
   }
    
  }, []);

  return (
    <Flex gap="10" alignItems={"flex-start"} overflowX="hidden" style={{ width: "100%", overflowX: "hidden" }} >
      <Box flex={70} style={{ width: "100%" , maxWidth: "100%"}}>
        <NewPost />
        <Divider
        orientation="horizontal"
        borderColor={dividerColor}
        borderWidth="1px"
        mt={4}
        mb={4}
      />
        {posts.length > 0  && (
          <Box width="100%">
          <InfiniteScroll
            dataLength={posts.length}
            next={() => getFeedPosts()}
            overflow="hidden" // Ensuring the correct function signature
            hasMore={hasMore}
            loader={<Flex justify={"center"} align={"center"} py={"20px"} style={{ width: "100%" }}>
              <Spinner size="xl" />
            </Flex>}
            endMessage={
              <Flex overflow="hidden" justifyContent={'center'} py={'20px'}  overflowX="hidden">
                <b>
                  {posts.length === 0? "No Posts Yet" : "No More Posts"}
                </b>
              </Flex>
            }
          >
            {posts.map((post) => (
              <Post key={`/home/post/${post._id}`} post={post}  overflowX="hidden" maxWidth="100%" />
            ))}
          </InfiniteScroll>
          </Box>
        ) }
      </Box>
      <Box
        flex={30}
        display={{
          base: "none",
          md: "block",
        }}
      ></Box>
    </Flex>
  );
});

export default HomePage;
