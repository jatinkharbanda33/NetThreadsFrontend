import React, { useEffect, useState } from "react";
import UserHeader from "../components/UserHeader";
import { Button, VStack, Spinner, Flex } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import Post from "../components/Post";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const UserPage = React.memo(() => {
  const navigate=useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const { id } = useParams();
  const [userLoading, setUserLoading] = useState(false);
  const [postLoading, setPostLoading] = useState(false);
  const { ref, inView } = useInView();
  let URL = `${import.meta.env.VITE_API_BASE_URL}/users/profile/${id}`;
  const getuser = async () => {
    try {
      if(typeof id !== "string") return;
      const token = localStorage.getItem("authToken");
      setUserLoading(true);
      const sendConfig = {
        method: "GET",
        url: URL,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };
      const request = await axios(sendConfig);
      if(request.status==401) navigate("/");
      const response = await request.data;
      if (response.error) {
        console.error(response.error);
        return;
      }
      setUserProfile(response);
    } catch (err) {
      console.error(err);
    } finally {
      setUserLoading(false);
    }
  };
  useEffect(() => {
    getuser();
  }, []);

  const getuserposts = async (props) => {
    if (!id) return;
    try {
      const reqbody = { page_count: props.pageParam };
      const token = localStorage.getItem("authToken");
      setPostLoading(true);
      const sendConfig = {
        method: "POST",
        url: `${import.meta.env.VITE_API_BASE_URL}/posts/get/userposts/${id}`,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data:reqbody
      };
      const request = await axios(sendConfig);
      if(request.status==401) navigate("/");
      const response = await request.data;
      if (response.error) {
        console.error(response.error);
        return;
      }
      if (response.length === 0) {
        return;
      }

      return response;
    } catch (err) {
      console.error(err);
    } finally {
      setPostLoading(false);
    }
  };

  const { data, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["posts"],
      queryFn: getuserposts,
      initialPageParam: 0, //page_count in future
      getNextPageParam: (lastPage, allPages) => {
        const nextPage = lastPage?.length ? allPages?.length : undefined;
        return nextPage;
      },
    });
  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  // if(!id){
  //   return <h1> User Not Found</h1>;
  // }
  const content = data?.pages;

  return (
    <>
      {(userLoading || postLoading) && (
        <Flex justify={"center"}>
          <Spinner size="xl"></Spinner>
        </Flex>
      )}
      {!userLoading && <UserHeader user={userProfile}></UserHeader>}
      {!userLoading && !postLoading && content?.length === 0 && <h1>User has no posts</h1>}

      {!userLoading && !postLoading &&
        content?.map((postarr) =>
          postarr?.map((post) => (
            <Post
              post={post}
              key={post._id}
              postname={userProfile?.username}
              profilepic={userProfile?.profilepicture}
            />
          ))
        )}
      {!postLoading && <VStack py={4}>
        <Button
          variant={"ghost "}
          ref={ref}
          isDisabled={!hasNextPage || isFetchingNextPage}
          onClick={() => {
            fetchNextPage();
          }}
        >
          {isFetchingNextPage
            ? "Loading more..."
            : hasNextPage
            ? "Load More"
            : "No more NetThreads..."}
        </Button>
      </VStack>}
    </>
  );
});

export default UserPage;
