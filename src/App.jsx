import { Container, Box, Spinner, Flex, useColorMode } from "@chakra-ui/react";
import React, { Suspense, lazy, useEffect, useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { changeUser } from "./redux/slices/userSlice";
import Header from "./components/Header";
import axios from "axios";
import { Toaster } from "sonner";

// Lazy-loaded pages
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
const LikePage = lazy(() => import("./pages/LikePage"));
const PostPage = lazy(() => import("./pages/PostPage"));
const UserPage = lazy(() => import("./pages/UserPage"));
const UpdateInfo = lazy(() => import("./pages/UpdateInfo"));
const SearchPage = lazy(() => import("./pages/SearchPage"));
const EmailVerificationPage = lazy(() => import("./pages/EmailVerificationPage"));
const ReplyPage = lazy(() => import("./pages/ReplyPage"));
const ReplyLikePage = lazy(() => import("./pages/ReplyLikePage"));

// Protected Route Component
const ProtectedRoute = ({ element }) => {
  const isUser = useSelector((state) => state.user);
  const authToken = localStorage.getItem("authToken");
  return isUser || authToken ? element : <Navigate to="/auth" />;
};

const App = React.memo(() => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isUser = useSelector((state) => state.user);
  const authToken = localStorage.getItem("authToken");
  const { colorMode } = useColorMode();
  const [loading, setLoading] = useState(true);

  const refreshToken = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/users/refresh/token`, {
        withCredentials: true,
      });
      if (data?.authToken && data.authToken!=null) {
        localStorage.setItem("authToken", data.authToken);
        dispatch(changeUser(data));
        window.location.reload();
      }
    } catch (err) {
      console.error("Token refresh failed", err);
    }
  };

  const getUser = async () => {
    try {
      if (authToken && !isUser) {
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/users/getuser/token`,
          {},
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );
        dispatch(changeUser(data));
      }
    } catch (err) {
      await refreshToken();
    }
  };

  useEffect(() => {
    if (!isUser && authToken) {
      getUser();
    } else if (!authToken) {
      refreshToken();
    }
    setLoading(false);
  }, []);

  const routes = [
    { path: "/home", element: <HomePage /> },
    { path: "/post/likes/:id", element: <LikePage /> },
    { path: "/reply/likes/:id", element: <ReplyLikePage /> },
    { path: "/post/:id", element: <PostPage /> },
    { path: "/reply/:id", element: <ReplyPage /> },
    { path: "/user/:id", element: <UserPage /> },
    { path: "/user/updateinfo", element: <UpdateInfo /> },
    { path: "/user/search", element: <SearchPage /> },
    { path: "/user/verify", element: <EmailVerificationPage /> },
  ];

  return (
    <Box position="relative" w="full">
      <Container maxW="620px">
        <Header />
        <Suspense fallback={<Flex justify="center"><Spinner size="xl" /></Flex>}>
          {loading ? (
            <Flex justify="center"><Spinner size="xl" /></Flex>
          ) : (
            <Routes>
              <Route path="/auth" element={isUser ? <Navigate to="/home" /> : <AuthPage />} />
              {routes.map(({ path, element }) => (
                <Route key={path} path={path} element={<ProtectedRoute element={element} />} />
              ))}
              <Route path="/" element={<Navigate to="/auth" />} />
            </Routes>
          )}
        </Suspense>
        <Toaster theme={colorMode === "dark" ? "dark" : "light"} />
      </Container>
    </Box>
  );
});

export default App;
