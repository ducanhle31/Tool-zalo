"use client";

import { useCustomer } from "@/hooks/useCustomers";
import { CustomerForm } from "@/templates/customers/customer-form";
import { Link } from "@chakra-ui/next-js";
import { Box, Heading, HStack, Icon } from "@chakra-ui/react";
import { IoIosArrowBack } from "react-icons/io";

export default function CustomerDetail({ params }: { params: { id: string } }) {
  const { customer, isLoading } = useCustomer(params.id!);

  return (
    <Box color={"gray.600"}>
      <HStack py={"12px"} pb={"48px"}>
        <Link
          href={"/private/customers"}
          display={"flex"}
          alignItems={"center"}
        >
          <Icon as={IoIosArrowBack} w={"28px"} h={"28px"} />
        </Link>
        <Heading size={"md"}>Chi tiết khách hàng</Heading>
      </HStack>

      <Box maxW={"1000px"}>
        <CustomerForm customer={customer || undefined} />
      </Box>
    </Box>
  );
}
