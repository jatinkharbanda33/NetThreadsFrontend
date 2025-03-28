import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link as RouterLink } from "react-router-dom";
import ImageModal from "../modals/ImageModal";
import {
  Flex,
  Input,
  Button,
  Text,
  Avatar,
  Icon,
  HStack,
  Link,
  Image
} from "@chakra-ui/react";
import { MdAttachment } from "react-icons/md";
import { toast } from "sonner";
import axios from "axios";
import useFileUpload from "../hooks/use-File-Upload";
import { useNavigate } from "react-router-dom";

const NewPost = () => {
  const navigate = useNavigate();
  const [thread, setThread] = useState("");
  const { file, filePreview, handleFileChange, clearFile } = useFileUpload();
  const handlePost = async () => {
    try {
      const requestBody = {};
      if (!thread && !file) {
        return;
      }
      if (thread) {
        requestBody.text = thread;
      }
      if (file) {
        requestBody.file_name = file.name;
        requestBody.file_content_type = file.type;
      }
      const token = localStorage.getItem("authToken");
      const sendConfig = {
        method: "POST",
        url: `${import.meta.env.VITE_API_BASE_URL}/posts/create`,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: requestBody,
      };
      const request = await axios(sendConfig);
      if (request.status == 401) navigate("/");
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
        clearFile();
      }
      setThread("");
      // setFilePreview(null);
      toast.success("Post Added");
    } catch (err) {
      toast.error("An Unexpected Error Occurred");
      console.log(err);
    }
  };

  const currentuser = useSelector((state) => state.user);
  const fileInputRef = useRef(null);
  const userPath = `/user/${currentuser?._id}`;
  const handleReset = () => {
    console.log("trying to reset");
    setThread("");
    clearFile();
  };
  const handleIconClick = () => {
    fileInputRef.current.value = "";
    fileInputRef.current.click();
  };

  return (
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
          size="lg"
          name={currentuser?.name}
          src={currentuser?.profilepicture}
        />
        <Flex direction={"column"}>
          <HStack gap={2}>
            <Link
              as={RouterLink}
              to={`/user/${currentuser?._id}`}
              _hover={{ textDecoration: "none" }}
            >
              <Text
                fontSize={"l"}
                paddingLeft={2}
                fontWeight={"bold"}
                _hover={{
                  color: "gray.600",
                  transition: "color 0.2s ease-in-out",
                }}
                onClick={() => {}}
              >
                {currentuser?.username}
              </Text>
            </Link>
            {currentuser?.verified && currentuser?.verified === true && (
              <Image src="/verified.png" w={4} h={4} />
            )}
          </HStack>
          <Input
            type="text"
            variant="unstyled"
            p={3}
            placeholder="Start a NetThread..."
            size="lg"
            focusBorderColor="grey"
            value={thread}
            onChange={(e) => {
              setThread(e.target.value);
            }}
          ></Input>
          <Flex px={3} justify={"space-between"} w={"140px"}>
            <Input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: "none" }}
              accept="image/*"
            />
            <HStack gap={2}>
              <Button
                as={MdAttachment}
                boxSize={5}
                onClick={handleIconClick}
                style={{ cursor: "pointer", border: "none", padding: 0 }}
              />
              {file && file != null && <ImageModal filePreview={filePreview} />}
            </HStack>
          </Flex>
        </Flex>
      </Flex>
      <Flex justify={"space-between"} alignItems={"center"} textColor={"gray"}>
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
            onClick={handlePost}
          >
            Post
          </Button>
        </HStack>
      </Flex>
    </Flex>
  );
};

export default NewPost;
