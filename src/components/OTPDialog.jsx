import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  PinInput,
  PinInputField,
  VStack,
  Text,
  Button,
  HStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { useState } from "react";

const OTPDialog = ({ isOpen, onClose, onVerify, email }) => {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bgColor = useColorModeValue("white", "gray.dark");
  const textColor = useColorModeValue("gray.800", "whiteAlpha.900");
  const secondaryTextColor = useColorModeValue("gray.600", "gray.400");
  const handleVerify = async () => {
    setIsLoading(true);
    try {
      console.log("trying to call api");
      await onVerify(otp);
      onClose();
    } catch (error) {
      console.error("OTP verification failed:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay backdropFilter="blur(5px)" />
      <ModalContent bg={bgColor} p={4}>
        <ModalHeader color={textColor}>Enter Verification Code</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <Text fontSize="sm" color={secondaryTextColor}>
              We've sent a verification code to {email}
            </Text>

            <HStack justify="center" spacing={2}>
              <PinInput size="lg" value={otp} onChange={setOtp} otp mask>
                <PinInputField />
                <PinInputField />
                <PinInputField />
                <PinInputField />
                <PinInputField />
                <PinInputField />
              </PinInput>
            </HStack>

            <Button
              mt={4}
              mb={2}
              onClick={handleVerify}
              isLoading={isLoading}
              bg={useColorModeValue("gray.800", "whiteAlpha.900")}
              color={useColorModeValue("white", "gray.800")}
              _hover={{ opacity: 0.9 }}
              w="full"
            >
              Verify
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default OTPDialog;
