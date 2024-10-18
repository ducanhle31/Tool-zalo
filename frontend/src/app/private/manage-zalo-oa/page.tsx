"use client";

import { useOaInfo } from "@/hooks/useInfoOa";
import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  HStack,
  SimpleGrid,
  Spinner,
  Text,
} from "@chakra-ui/react";
import Image from "next/image";
import { BiSolidLogInCircle } from "react-icons/bi";
const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL!;

export default function ManageZaloOA() {
  const { oaInfo, isLoading } = useOaInfo();

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
      {!oaInfo && (
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
      )}

      <SimpleGrid
        columns={{ base: 1, md: 3 }}
        mt={"32px"}
        mb={"48px"}
        gap={"24px"}
      >
        <Heading size={"lg"}>Thông tin OA</Heading>
      </SimpleGrid>

      {isLoading && (
        <Center h={"300px"}>
          <Spinner />
        </Center>
      )}

      {!isLoading && !oaInfo && (
        <Center h={"300px"}>
          <Text color="red.500" fontSize="xl" fontWeight={"bold"}>
            Vui lòng kết nối Zalo OA
          </Text>
        </Center>
      )}

      {!isLoading && oaInfo && (
        <>
          <Flex alignItems={"center"} justifyContent={"start"} mb={4}>
            <Image
              alt="Zalo OA Avatar"
              width={60}
              height={60}
              src={oaInfo.avatar}
              style={{ borderRadius: "50%" }}
            />
            <Box ml={4}>
              <Heading size={"sm"} color={"black"}>
                {oaInfo.name}
              </Heading>
              <Text fontSize="sm" color="gray.500">
                {oaInfo.cate_name}
              </Text>
            </Box>
          </Flex>

          <Box>
            <Box fontWeight={"bold"} my={"10px"}>
              Mô tả OA
            </Box>
            <Box>{oaInfo.description}</Box>
          </Box>

          <Box mt={6}>
            <Text fontWeight={"bold"}>OA ID:</Text>
            <Text>{oaInfo.oa_id}</Text>

            <Text fontWeight={"bold"} mt={4}>
              Số lượng người theo dõi:
            </Text>
            <Text>{oaInfo.num_follower}</Text>

            <Text fontWeight={"bold"} mt={4}>
              Loại gói:
            </Text>
            <Text>{oaInfo.package_name}</Text>

            <Text fontWeight={"bold"} mt={4}>
              Gói dịch vụ hết hạn:
            </Text>
            <Text>{oaInfo.package_valid_through_date}</Text>

            <Text fontWeight={"bold"} mt={4}>
              Gia hạn tự động vào ngày:
            </Text>
            <Text>{oaInfo.package_auto_renew_date}</Text>

            <Text fontWeight={"bold"} mt={4}>
              ZCA liên kết:
            </Text>
            <Text>{oaInfo.linked_zca}</Text>
          </Box>
        </>
      )}
    </>
  );
}
