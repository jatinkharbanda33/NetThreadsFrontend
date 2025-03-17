import {
  Container,
  VStack,
  Text,
  Input,
  Button,
  Box,
  useColorModeValue,
  Image,
  useDisclosure,
  FormControl,
  FormHelperText,
  Center,
  Icon,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import OTPDialog from "../components/OTPDialog";
import axios from "axios";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { FaCheckCircle } from "react-icons/fa";
import { IoArrowBack } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { changeVerifiedStatus } from "../redux/slices/userSlice";
const EmailVerificationPage = () => {

  let user = useSelector((state) => state.user);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const bgColor = useColorModeValue("white", "gray.dark");
  const textColor = useColorModeValue("gray.800", "whiteAlpha.900");
  const secondaryTextColor = useColorModeValue("gray.600", "gray.400");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const dispatch = useDispatch();

  const handleSendOTP = async () => {
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setIsLoading(true);
    try {
      const accessToken = localStorage.getItem("authToken");
      const config = {
        method: "POST",
        url: `${import.meta.env.VITE_API_BASE_URL}/verify/email`,
        data: { email },
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      };
      const request = await axios(config);
      const response = await request.data;
      if (response.status == false) {
        toast.error(response.data.error);
        return;
      }

      toast.success("OTP sent successfully!");
      onOpen();
    } catch (error) {
      toast.error("Failed to send OTP. Please try again.");
      console.error("Error sending OTP:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (otp) => {
    try {
      const accessToken = localStorage.getItem("authToken");
      const config = {
        method: "POST",
        url: `${import.meta.env.VITE_API_BASE_URL}/verify/otp`,
        data: { email, otp },
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      };
      const request = await axios(config);
      const response = await request.data;
      if (response.status == false) {
        toast.error(response.data.error);
        return;
      }
      if (response.status == true) {
        toast.success("Email verified successfully!");
        dispatch(changeVerifiedStatus(true));
        navigate("/home");
      }
    } catch (error) {
      console.log(error);
      toast.error("Invalid OTP. Please try again.");
    }
  };

  if (user && user.verified === true) {
    return (
      <Container maxW="container.sm" py={16}>
        <Box
          bg={bgColor}
          p={8}
          borderRadius="xl"
          border="1px solid"
          borderColor={borderColor}
          textAlign="center"
        >
          <Center flexDirection="column" gap={4}>
            <Icon as={FaCheckCircle} boxSize={16} color="green.500" mb={2} />
            <Text fontSize="2xl" fontWeight="bold" color={textColor}>
              Email Already Verified
            </Text>
            <Text color={secondaryTextColor}>
              Your email address has already been verified. You can continue
              using NetThreads.
            </Text>
            <Button
              leftIcon={<IoArrowBack />}
              onClick={() => navigate(-1)}
              mt={4}
              size="lg"
              bg={useColorModeValue("gray.800", "whiteAlpha.900")}
              color={useColorModeValue("white", "gray.800")}
              _hover={{ opacity: 0.9 }}
            >
              Go Back
            </Button>
          </Center>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxW="container.sm" py={8}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Text fontSize="2xl" fontWeight="bold" color={textColor} mb={2}>
            Verify Your Email
          </Text>
        </Box>
        <Box
          bg={bgColor}
          p={8}
          borderRadius="xl"
          border="1px solid"
          borderColor={borderColor}
        >
          <VStack spacing={4}>
            <FormControl>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                size="lg"
                borderColor={borderColor}
                _hover={{ borderColor: textColor }}
                _focus={{ borderColor: textColor, boxShadow: "none" }}
              />
              <FormHelperText color={secondaryTextColor}>
                We'll send a verification code to this email
              </FormHelperText>
            </FormControl>

            <Button
              w="full"
              size="lg"
              onClick={handleSendOTP}
              isLoading={isLoading}
              bg={useColorModeValue("gray.800", "whiteAlpha.900")}
              color={useColorModeValue("white", "gray.800")}
              _hover={{ opacity: 0.9 }}
            >
              Send Verification Code
            </Button>
          </VStack>
        </Box>
      </VStack>

      <OTPDialog
        isOpen={isOpen}
        onClose={onClose}
        onVerify={handleVerifyOTP}
        email={email}
      />
    </Container>
  );
};

export default EmailVerificationPage;
