"use client";

import { SearchInput } from "@/components/SearchInput";
import { useCustomers } from "@/hooks/useCustomers";
import { Customer } from "@/templates/customers/customer";
import { CustomersExport } from "@/templates/customers/export";
import { Link } from "@chakra-ui/next-js";
import {
  Box,
  Button,
  Center,
  Heading,
  HStack,
  SimpleGrid,
  Spinner,
} from "@chakra-ui/react";
import { useState } from "react";
import { CiExport } from "react-icons/ci";
import { FaPlus } from "react-icons/fa";

export default function Customers() {
  const [search, setSearch] = useState("");
  const { customers, isLoading } = useCustomers();

  if (isLoading)
    return (
      <Center h={"300px"}>
        <Spinner />
      </Center>
    );

  return (
    <>
      <HStack mt={"24px"} flexWrap={"wrap"}>
        <Button
          as={Link}
          href={"/private/customers/create-customers"}
          rounded={"sm"}
          leftIcon={<FaPlus />}
          colorScheme="teal"
        >
          Tạo khách hàng
        </Button>
        <Button
          rounded={"sm"}
          leftIcon={<CiExport size={"24px"} />}
          colorScheme="teal"
          as={Link}
          href={"/customers/import-customers"}
        >
          Import excel
        </Button>
        <CustomersExport customers={customers} />
      </HStack>

      <Box mt={"32px"}>
        <HStack
          alignItems={"center"}
          mb={8}
          justifyContent={"start"}
          maxW={"500px"}
        >
          <Heading size={"sm"} w={"100px"}>
            Tìm kiếm
          </Heading>
          <SearchInput onSearch={(data) => setSearch(data?.search)} />
        </HStack>
      </Box>
      <SimpleGrid
        columns={{ base: 1, sm: 2, md: 4, lg: 5, xl: 6, "2xl": 7 }}
        gap={"18px"}
        color={"gray.400"}
      >
        {customers?.map((customer, index) => (
          <Customer customer={customer} key={index} />
        ))}
      </SimpleGrid>
    </>
  );
}
