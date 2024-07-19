import { Container, Box,Spinner,Flex,useColorMode } from "@chakra-ui/react";
import React, { Suspense, lazy } from "react";
import Header from "./components/Header";
import { Navigate, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { changeUser } from "./redux/slices/userSlice";
const HomePage = lazy(() => import("./pages/HomePage"));
const AuthPage = lazy(() => import("./pages/AuthPage"));
const LikePage = lazy(() => import("./pages/LikePage"));
const PostPage = lazy(() => import("./pages/PostPage"));
const UserPage = lazy(() => import("./pages/UserPage"));
const UpdateInfo=lazy(()=>import("./pages/UpdateInfo"));
import { Toaster } from 'sonner'
import axios from "axios";

const App = React.memo(() => {
  const { colorMode, toggleColorMode } = useColorMode();
  let isUser = useSelector((state) => state.user);
  const dispatch = useDispatch();
  useEffect(() => {
    const getUser = async () => {
      try {
        if (localStorage.getItem("authToken") && !isUser) {
          const token = localStorage.getItem("authToken");
          const sendConfig={
            method:"POST",
            url:"/api/users/getuser/token",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            }

          }
          const req1 = await axios(sendConfig)
          const res1 = await req1.data;
          if (res1.status == false) {
            localStorage.removeItem("authToken");
            return;
          }
          dispatch(changeUser(res1));
          isUser = res1;
        }
      } catch (err) {
        localStorage.removeItem("authToken");
        console.log(err);
      }
    };
    if (!isUser && localStorage.getItem("authToken")) {
      getUser();
    }
    console.log("User");
  }, []);
  console.log("App renders");
  return (
    <Box position={"relative"} w={"full"}>
      <Container maxW="620px">

        <Header />
        <Suspense fallback={ <Flex justify={"center"}>
            <Spinner size="xl"></Spinner>
          </Flex>}>
          <Routes>
            <Route
              path={"/home"}
              element={
                isUser || localStorage.getItem("authToken") ? (
                  <HomePage />
                ) : (
                  <Navigate to="/auth" />
                )
              }
            />
            
            <Route
              path="/auth"
              element={!isUser ? <AuthPage /> : <Navigate to="/home" />}
            />
            <Route
              path="/post/likes/:id"
              element={
                isUser || localStorage.getItem("authToken") ? (
                  <LikePage />
                ) : (
                  <Navigate to="/auth" />
                )
              }
            />
            <Route
              path="/post/:id"
              element={
                isUser || localStorage.getItem("authToken") ? (
                  <PostPage />
                ) : (
                  <Navigate to="/auth" />
                )
              }
            />
            <Route
              path="/user/:id"
              element={
                isUser || localStorage.getItem("authToken") ? (
                  <UserPage />
                ) : (
                  <Navigate to="/auth" />
                )
              }
            />
             <Route
              path="/user/updateinfo"
              element={
                isUser || localStorage.getItem("authToken") ? (
                  <UpdateInfo />
                ) : (
                  <Navigate to="/auth" />
                )
              }
            />
            <Route
            path="/"
            element={<Navigate to="/auth" />}
            
             />
          </Routes>
        </Suspense>
        <Toaster theme={colorMode=="dark"?"dark":"light"} toastOptions={{
    style: { background: colorMode=="dark"?'#71797E':'white' },
    
  }}/>
      </Container>
    </Box>
  );
});
export default App;
