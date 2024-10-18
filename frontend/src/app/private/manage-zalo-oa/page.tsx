"use client";

import { useCustomers } from "@/hooks/useCustomers";
import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  HStack,
  SimpleGrid,
  Spinner,
} from "@chakra-ui/react";
import Image from "next/image";
import { BiSolidLogInCircle } from "react-icons/bi";

export default function Customers() {
  const { customers, isLoading } = useCustomers();
  const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
  const handleLogin = () => {
    const width = 500;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    window.open(
      `${NEXT_PUBLIC_API_URL}/authzalo/login`,
      "Zalo OA Login",
      `width=${width},height=${height},top=${top},left=${left},scrollbars=no`
    );
  };

  return (
    <>
      <HStack mt={"24px"} flexWrap={"wrap"}>
        <Button
          onClick={handleLogin}
          rounded={"sm"}
          leftIcon={<BiSolidLogInCircle />}
          colorScheme="teal"
        >
          Kết nối Zalo OA
        </Button>
      </HStack>

      <SimpleGrid
        columns={{ base: 1, md: 3 }}
        mt={"32px"}
        mb={"48px"}
        gap={"24px"}
      >
        <Heading size={"xl"}>Thông tin OA</Heading>
      </SimpleGrid>

      {isLoading && (
        <Center h={"300px"}>
          <Spinner />
        </Center>
      )}
      <Flex alignItems={"center"} justifyContent={"start"}>
        <Image
          alt="Zalo OA"
          width={60}
          height={60}
          style={{ borderRadius: "full" }}
          src="https://s160-ava-talk.zadn.vn/7/5/0/8/1/160/5ea0809ac52b3250d2c3eeb34702f0ae.jpg"
        />
        <Heading size={"sm"} color={"black"}>
          Thông tin OA
        </Heading>
      </Flex>
      <Box>
        <Box fontWeight={"bold"} my={"10px"}>
          Mô tả Mini App
        </Box>
        <Box>
          Zalo Official Account (Zalo OA) là tài khoản chính thức của Doanh
          Nghiệp, Media và Cơ quan nhà nước với mục đích kết nối và mang lại giá
          trị với người dùng Zalo.
        </Box>
      </Box>
      {!isLoading && (
        <SimpleGrid
          columns={{ base: 1, sm: 2, md: 4, lg: 5, xl: 6, "2xl": 7 }}
          gap={"18px"}
          color={"gray.400"}
        ></SimpleGrid>
      )}
    </>
  );
}
