"use client";

import {
  Box,
  Container,
  Drawer,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  HStack,
  IconButton,
  Image,
  useDisclosure,
} from "@chakra-ui/react";
import { useRef } from "react";
import { IoMenu } from "react-icons/io5";
import { NavBar } from "./navbar";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef<HTMLButtonElement | null>(null);

  return (
    <>
      <Box
        px={"20px"}
        py={"12px"}
        display={{ lg: "none" }}
        position={"fixed"}
        top={0}
        left={0}
        right={0}
        bg={"white"}
        shadow={"xl"}
        as={HStack}
        zIndex={3}
      >
        <IconButton
          aria-label="menu"
          ref={btnRef}
          icon={<IoMenu size={"30px"} />}
          colorScheme="gray"
          onClick={onOpen}
          variant={"outline"}
          size={"md"}
          rounded={"sm"}
        />

        <Drawer
          size={"xs"}
          isOpen={isOpen}
          placement="left"
          onClose={onClose}
          finalFocusRef={btnRef}
        >
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <Box
              w={"full"}
              h={"100vh"}
              bg={"gray.700"}
              display={{ lg: "none" }}
            >
              <NavBar />
            </Box>
          </DrawerContent>
        </Drawer>
        <Image
          srcSet="/logo.png"
          alt="Logo"
          maxW={"80px"}
          pos={"absolute"}
          right={"50%"}
          transform={"translateX(50%)"}
        />
      </Box>
      <HStack alignItems={"start"} spacing={"32px"}>
        <Box
          w={"220px"}
          h={"100vh"}
          bg={"gray.700"}
          display={{ base: "none", lg: "block" }}
        >
          <NavBar />
        </Box>

        <Box
          flex={1}
          mt={{ base: "70px", lg: 0 }}
          maxH={"100vh"}
          overflowY={"auto"}
        >
          <Container maxW={"9xl"} pb={12}>
            {children}
          </Container>
        </Box>
      </HStack>
    </>
  );
};
