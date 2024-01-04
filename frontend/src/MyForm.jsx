import React, { useState, useRef } from "react";
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Textarea,
} from "@chakra-ui/react";

export default function MyForm() {
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const baseUrl = "http://localhost:8000";

  const sendEmail = async () => {
    try {
      let dataSend = {
        email: email,
        subject: subject,
        message: message,
        image: selectedImage, // Include the selected image in the data
      };

      const formData = new FormData();
      formData.append("email", dataSend.email);
      formData.append("subject", dataSend.subject);
      formData.append("message", dataSend.message);
      formData.append("image", dataSend.image); // Append the image to the FormData

      const res = await fetch(`${baseUrl}/email/sendEmail`, {
        method: "POST",
        body: formData, // Use FormData for sending files
        headers: {
          Accept: "application/json",
        },
      });

      if (res.status >= 200 && res.status < 300) {
        alert("Email sent successfully!");
      } else {
        alert("Email sending failed. Please try again.");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      alert("An error occurred while sending the email. Please try again.");
    }
  };

  const [imageLoaded, setImageLoaded] = useState(false);
  const [blockSize] = useState(64);
  const inputImageRef = useRef(null);
  const canvasRef = useRef(null);

  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          // Display the uploaded image on the canvas
          const canvas = canvasRef.current;
          canvas.width = 256;
          canvas.height = 256;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, 256, 256);
          setImageLoaded(true);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
      setSelectedImage(file); // Set the selected image
    }
  };

  const shuffleArray = (array) => {
    const shuffled = [...array];

    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
  };

  const timeBasedScramble = (imageData, blockSize) => {
    const pixelData = new Uint8ClampedArray(imageData.data);

    for (
      let blockStart = 0;
      blockStart < pixelData.length;
      blockStart += blockSize * 4
    ) {
      const blockEnd = Math.min(blockStart + blockSize * 4, pixelData.length);
      const block = pixelData.slice(blockStart, blockEnd);

      const scrambledBlock = shuffleArray(block);
      pixelData.set(scrambledBlock, blockStart);
    }

    return new ImageData(pixelData, imageData.width, imageData.height);
  };

  const handleScrambleClick = () => {
    if (imageLoaded) {
      // Scramble the image and update the canvas
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const outputImageData = timeBasedScramble(imageData, blockSize);
      ctx.putImageData(outputImageData, 0, 0);
    }
  };

  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"}>Image Scramble</Heading>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          <Stack spacing={4}>
            <FormControl id="receiverEmail">
              <FormLabel>Email address</FormLabel>
              <Input
                type="email"
                placeholder="Receiver's Email Address"
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>
            <FormControl id="subject">
              <FormLabel>Subject</FormLabel>
              <Input
                onChange={(e) => setSubject(e.target.value)}
                type="text"
                placeholder="Enter the subject here..."
              />
            </FormControl>
            <FormControl id="message">
              <FormLabel>Message</FormLabel>
              <Textarea
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter your message here..."
              />
            </FormControl>

            <FormControl id="message">
              <FormLabel>Block Size:</FormLabel>
              <Input type="number" id="blockSize" min="1" value="64"/>
            </FormControl>

            <FormControl id="image">
              <FormLabel>Upload Image</FormLabel>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e)}
              />
            </FormControl>
            <FormControl id="image">
              <FormLabel>Image Shown</FormLabel>
              <canvas id="outputCanvas" width="256" height="256" ref={canvasRef}></canvas>
            </FormControl>

            <Stack spacing={10}>
              <Button
                bg={"blue.700"}
                color={"white"}
                _hover={{
                  bg: "blue.200",
                }}
                onClick={() => handleScrambleClick()}
                disabled={!imageLoaded}
              >
                Scramble
              </Button>
              <Button
                bg={"blue.400"}
                color={"white"}
                _hover={{
                  bg: "blue.500",
                }}
                onClick={() => sendEmail()}
              >
                Send Email
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
