"use client";

import { useUserOA } from "@/hooks/useUsers";
import { Link } from "@chakra-ui/next-js";
import { Box, Center, Heading, HStack, Icon, Spinner } from "@chakra-ui/react";
import { IoIosArrowBack } from "react-icons/io";

export default function UserOaDetail({
  params,
}: {
  params: { userId: string };
}) {
  console.log("User ID from params:", params.userId); // Log user ID

  const { useroa, isLoading } = useUserOA(params.userId!);

  // Log the fetched user data
  console.log("details", useroa);
  console.log(params.userId);
  if (isLoading)
    return (
      <Center height={"300px"}>
        <Spinner size={"lg"} />
      </Center>
    );
  console.log("details", useroa);
  return (
    <Box color={"gray.600"}>
      <HStack py={"12px"} pb={"48px"}>
        <Link
          href={"/private/manage-zalo-oa"}
          display={"flex"}
          alignItems={"center"}
        >
          <Icon as={IoIosArrowBack} w={"28px"} h={"28px"} />
        </Link>
        <Heading size={"md"}>Chi tiết template</Heading>
      </HStack>
    </Box>
  );
}
