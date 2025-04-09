import { Avatar } from "@chakra-ui/avatar";
import { Box, HStack, Flex, Link, Text, VStack } from "@chakra-ui/layout";
import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/menu";
import { Portal } from "@chakra-ui/portal";
import { useSelector } from "react-redux";
import {
  Button,
  Input,
  Icon,
  Image,
  useColorMode,
  Spinner,
  Code,
} from "@chakra-ui/react";
import { useState, useEffect, useRef } from "react";
import { CgMoreO } from "react-icons/cg";
import { Link as RouterLink } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import useFileUpload from "../hooks/use-File-Upload";
import ImageModal from "../modals/ImageModal";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const UserHeader = ({ user }) => {
  const navigate = useNavigate();
  const currentuser = useSelector((state) => state.user);
  const { file, handleFileChange, filePreview, clearFile, setFilePreview } =
    useFileUpload();
  const { colorMode, toggleColorMode } = useColorMode();

  // useEffect(() => {
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setFilePreview(reader.result);
  //     };
  //     reader.readAsDataURL(file);
  //   } else {
  //     setFilePreview(null);
  //   }
  // }, [file]);
  const fileInputRef = useRef(null);

  const handleIconClick = () => {
    fileInputRef.current.value = "";
    fileInputRef.current.click();
  };

  const copyURL = () => {
    const currentURL = window.location.href;
    navigator.clipboard.writeText(currentURL).then(() => {
      toast.success("Copied to Clipboard", currentURL);
    });
  };

  const changeProfilePicture = async () => {
    setLoading(true);
    try {
      if (!file) {
        return;
      }
      let requestBody = {};
      if (file) {
        requestBody.file_name = file.name;
        requestBody.file_content_type = file.type;
      }
      const token = localStorage.getItem("authToken");
      const sendConfig = {
        method: "POST",
        url: `${import.meta.env.VITE_API_BASE_URL}/users/update/profilepicture`,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: requestBody,
      };
      const request = await axios(sendConfig);
      if (request.status == 401) navigate("/");
      const response = await request.data;
      if (response.error) {
        console.log(response.error);
        return;
      }
      if (!response.status) {
        return;
      }
      clearFile();
      if (response.url) {
        await fetch(response.url, {
          method: "PUT",
          headers: {
            "Content-Type": file.type,
          },
          body: file,
        });
      }
      setFetchAgain(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  if (!user) return <h1>No user found</h1>;
  return (
    <VStack gap={4} alignItems={"start"}>
      <Flex
        justifyContent={"space-between"}
        w={"full"}
        marginTop={"14"}
        paddingX={"6"}
      >
        <Box>
          <Link 
            as={RouterLink} 
            to={`/user/${user._id}`}
            _hover={{ textDecoration: "none" }}
          >
            <Text 
              fontSize={"3xl"} 
              fontWeight={"bold"}
              _hover={{
                color: "gray.600",
                transition: "color 0.2s ease-in-out",
              }}
            >
              {user.name}
            </Text>
          </Link>
          <Flex gap={4} alignItems={"center"}>
            <Link 
              as={RouterLink} 
              to={`/user/${user._id}`}
              _hover={{ textDecoration: "none" }}
            >
              <Text 
                fontSize={"md"} 
                color={"gray"}
                _hover={{
                  color: "gray.600",
                  transition: "color 0.2s ease-in-out",
                }}
              >
                ~{user.username}
              </Text>
            </Link>
            <Code
              fontSize={"sm"}
              bg={"gray"}
              color={"white"}
              p={1}
              borderRadius={"full"}
            >
              netthreads
            </Code>
          </Flex>
        </Box>
        <Box position={"relative"} display={"inline-block"}>
          {user.profilepicture && (
            <Avatar
              name={user.name}
              src={user.profilepicture}
              transition="opacity 0.2s"
              _hover={{
                transform: "scale(1.2)",
                transition: "transform 0.5s ease-in-out",
              }}
              size={{
                base: "md",
                md: "2xl",
              }}
            />
          )}
          {!user.profilepicture && (
            <Avatar
              name={user.name}
              src="https://bit.ly/broken-link"
              size={{
                base: "md",
                md: "xl",
              }}
            />
          )}
          {currentuser._id === user._id && (
            <Box>
              <Input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              <HStack gap={2} marginTop={4}>
                <Icon
                  as={FaEdit}
                  boxSize={6}
                  onClick={handleIconClick}
                  style={{ cursor: "pointer", border: "none", padding: 0 }}
                />
                {file && file != null && (
                  <>
                    <ImageModal filePreview={filePreview} />
                    <Button onClick={changeProfilePicture}>Update</Button>
                  </>
                )}
              </HStack>
            </Box>
          )}
        </Box>
      </Flex>

      {/* <Text>{user.bio}</Text> */}
      <Flex w={"full"} justifyContent={"left"} margin={6} gap={2}>
        {currentuser?._id === user._id && (
          <Link 
            as={RouterLink} 
            to="/user/updateinfo"
            _hover={{ textDecoration: "none" }}
          >
            <Button
              size={"sm"}
              bg={colorMode === "dark" ? "white" : "black"}
              color={colorMode === "dark" ? "black" : "white"}
              _hover={{ 
                bg: "white", 
                color: "black",
                transition: "all 0.2s ease-in-out"
              }}
            >
              Update Profile
            </Button>
          </Link>
        )}
        <Button
          bg={colorMode === "dark" ? "white" : "black"}
          color={colorMode === "dark" ? "black" : "white"}
          size={"sm"}
          onClick={copyURL}
          _hover={{ 
            bg: "white", 
            color: "black",
            transition: "all 0.2s ease-in-out"
          }}
        >
          Share Profile
        </Button>
      </Flex>
      <Flex w={"full"} justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Box w="1" h="1" bg={"gray.light"} borderRadius={"full"}></Box>
          <Link 
            as={RouterLink}
            to="/"
            color={"gray.light"}
            _hover={{ 
              textDecoration: "none",
              color: "gray.600",
              transition: "color 0.2s ease-in-out"
            }}
          >
            netthreads.crabdance.com
          </Link>
        </Flex>
        <Flex>
          <Box className="icon-container">
            <Image
              cursor={"pointer"}
              alt="logo"
              w={6}
              src={
                colorMode === "dark" ? "/dark_n_new.png" : "/light_n_new.png"
              }
            />
          </Box>
          <Box className="icon-container">
            <Menu>
              <MenuButton>
                <CgMoreO size={24} cursor={"pointer"} />
              </MenuButton>
              <Portal>
                <MenuList bg={"gray.dark"}>
                  <MenuItem bg={"gray.dark"} onClick={copyURL}>
                    Copy link
                  </MenuItem>
                </MenuList>
              </Portal>
            </Menu>
          </Box>
        </Flex>
      </Flex>

      <Flex w={"full"}>
        <Flex
          flex={1}
          justifyContent={"center"}
          cursor={"pointer"}
          _hover={{
            color: "gray.600",
            transition: "color 0.2s ease-in-out"
          }}
        >
          <Text fontWeight={"bold"}> {user.name}'s Activity</Text>
        </Flex>
      </Flex>
    </VStack>
  );
};

export default UserHeader;
