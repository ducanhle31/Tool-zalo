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
        >
          Open
        </IconButton>
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
              h={"150vh"}
              bg={"gray.700"}
              display={{ lg: "none" }}
            >
              <NavBar />
            </Box>
          </DrawerContent>
        </Drawer>
      </Box>
      <HStack alignItems={"start"} spacing={"32px"}>
        <Box
          w={"220px"}
          h={"150vh"}
          bg={"gray.700"}
          display={{ base: "none", lg: "block" }}
        >
          <NavBar />
        </Box>

        <Box flex={1} mt={{ base: "70px", lg: 0 }}>
          <Container maxW={"9xl"}>{children}</Container>
        </Box>
      </HStack>
    </>
  );
};
