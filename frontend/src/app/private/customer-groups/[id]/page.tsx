"use client";

import { useCustomerGroup } from "@/hooks/useCustomerGroups";
import { CustomerGroupForm } from "@/templates/customer-groups/customer-group-form";
import { Link } from "@chakra-ui/next-js";
import { Box, Center, Heading, HStack, Icon, Spinner } from "@chakra-ui/react";
import { IoIosArrowBack } from "react-icons/io";

export default function CustomerDetail({ params }: { params: { id: string } }) {
  const { customerGroup, isLoading } = useCustomerGroup(params.id!);

  if (isLoading)
    return (
      <Center height={"300px"}>
        <Spinner size={"lg"} />
      </Center>
    );

  return (
    <Box color={"gray.600"}>
      <HStack py={"12px"} pb={"48px"}>
        <Link
          href={"/private/customer-groups"}
          display={"flex"}
          alignItems={"center"}
        >
          <Icon as={IoIosArrowBack} w={"28px"} h={"28px"} />
        </Link>
        <Heading size={"md"}>Chi tiết nhóm khách hàng</Heading>
      </HStack>

      <Box maxW={"1000px"}>
        <CustomerGroupForm customerGroup={customerGroup || undefined} />
      </Box>
    </Box>
  );
}
