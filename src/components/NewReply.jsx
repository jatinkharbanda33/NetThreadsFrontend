import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link as RouterLink } from "react-router-dom";
import { Divider, useColorModeValue } from "@chakra-ui/react";
import ImageModal from "../modals/ImageModal";
import {
  Box,
  Flex,
  Input,
  Button,
  Text,
  Avatar,
  Icon,
  HStack,
  Link,
  Image,
} from "@chakra-ui/react";
import { MdAttachment } from "react-icons/md";
import { toast } from "sonner";
import axios from "axios";
import useFileUpload from "../hooks/use-File-Upload";
import { useNavigate } from "react-router-dom";

const NewReply = (params) => {
  const postId=params.postId;
  const nesting_level=params?.nesting_level?params?.nesting_level:0;
  const navigate=useNavigate();
  const dividerColor = useColorModeValue("black", "gray.500");
  const [thread, setThread] = useState("");
  const { file, filePreview, handleFileChange, clearFile } = useFileUpload();
  const handleReply = async () => {
    try {
      const requestBody = {};
      if (!thread && !file) {
        return;
      }
      if (thread) {
        requestBody.text = thread;
        console.log(postId);
        requestBody.parent_reply_id=String(postId);
        requestBody.nesting_level=parseInt(nesting_level+1);
      }
      if (file) {
        requestBody.file_name = file.name;
        requestBody.file_content_type = file.type;
      }
      const token = localStorage.getItem('authToken');
      const sendConfig = {
        method: "POST",
        url: `${import.meta.env.VITE_API_BASE_URL}/reply/create`,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: requestBody,
      };
      const request = await axios(sendConfig);
      if(request.status==401) navigate("/");
      const response = await request.data;
      if (!response.status) {
        toast.error("An Error Occurred");
        return;
      }
      if (response.url) {
        await fetch(response.url, {
          method: "PUT",
          headers: {
            "Content-Type": file.type,
          },
          body: file,
        });
      }
      setThread("");
      // setFilePreview(null);
      clearFile();
      toast.success("Reply Added");
    } catch (err) {
      toast.error("An Unexpected Error Occurred");
      console.log(err);
    }
  };
  const handleReset=()=>{
    setThread("");
    clearFile();
  }

  const currentuser = useSelector((state) => state.user);
  const fileInputRef = useRef(null);
  const userPath = `/user/${currentuser?._id}`;

  const handleIconClick = () => {
    fileInputRef.current.value = "";
    fileInputRef.current.click();
  };

  return (
    <>
      <Flex
        direction={"column"}
        p={3}
        rounded={"lg"}
        w={{
          base: "full",
          md: "600px",
        }}
      >
        <Flex direction={"row"}>
          <Avatar
            size="md"
            name={currentuser?.name}
            src={currentuser?.profilepicture}
          />
          <Flex direction={"column"} ml={2}>
            <Flex alignItems={"center"}>
              <Link 
                as={RouterLink} 
                to={userPath}
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
                  {currentuser?.username}
                </Text>
              </Link>
              {currentuser?.verified && currentuser?.verified === true && (
                <Image src="/verified.png" w={4} h={4} ml={1} />
              )}
            </Flex>
            <Input
              type="text"
              variant="unstyled"
              p={3}
              placeholder="Reply to this NetThread..."
              size="lg"
              focusBorderColor="grey"
              value={thread}
              cursor="text"
              _hover={{ cursor: "text" }}
              onChange={(e) => {
                setThread(e.target.value);
              }}
            />
            <Flex px={3} justify={"space-between"} w={"140px"}>
              <Input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              <HStack gap={2}>
                <Icon
                  as={MdAttachment}
                  boxSize={5}
                  onClick={handleIconClick}
                  style={{ cursor: "pointer", border: "none", padding: 0 }}
                />
                {file && file != null && (
                  <ImageModal filePreview={filePreview} />
                )}
              </HStack>
            </Flex>
          </Flex>
        </Flex>
        <Flex
          justify={"space-between"}
          alignItems={"center"}
          textColor={"gray"}
        >
          <Text>Anyone Can Reply</Text>

          <HStack>
          <Button
            colorScheme="gray"
            rounded={"full"}
            w={"90px"}
            isDisabled={thread.length === 0 && !file}
            onClick={handleReset}
          >
            Reset
          </Button>
          <Button
            colorScheme="gray"
            rounded={"full"}
            w={"90px"}
            isDisabled={thread.length === 0 && !file}
            onClick={handleReply}
          >
            Reply
          </Button>
          </HStack>
        </Flex>
      </Flex>
      <Divider
        orientation="horizontal"
        borderColor={dividerColor}
        borderWidth="1px"
        mt={4}
        mb={4}
      />
    </>
  );
};

export default NewReply;
