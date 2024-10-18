"use client";

import { Link } from "@chakra-ui/next-js";
import { Button, Center, Text, VStack } from "@chakra-ui/react";
import { FaArrowRight } from "react-icons/fa";

export default function Page() {
  return (
    <Center height={"100vh"}>
      <VStack
        spacing={8}
        justifyContent={"space-around"}
        alignItems={"stretch"}
      >
        <Button
          justifyContent={"space-between"}
          size={"lg"}
          rounded={"sm"}
          colorScheme="teal"
          rightIcon={<FaArrowRight />}
          as={Link}
          href={"/private/settings/facilities"}
        >
          Cài đặt cơ sở
        </Button>

        <Button
          justifyContent={"space-between"}
          size={"lg"}
          rounded={"sm"}
          colorScheme="teal"
          rightIcon={<FaArrowRight />}
          as={Link}
          href={"/private/settings/facilities"}
        >
          <Text> Cài đặt phương thức thanh toán</Text>
        </Button>

        <Button
          justifyContent={"space-between"}
          size={"lg"}
          rounded={"sm"}
          colorScheme="teal"
          rightIcon={<FaArrowRight />}
          as={Link}
          href={"/private/settings/facilities"}
        >
          <Text>Cài đặt loại giao dịch</Text>
        </Button>
      </VStack>
    </Center>
  );
}
