"use client";

import { useUser } from "@/hooks/useUsers";
import { UserForm } from "@/templates/users/user-form";
import { Link } from "@chakra-ui/next-js";
import {
  Box,
  Center,
  Heading,
  HStack,
  Icon,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { IoIosArrowBack } from "react-icons/io";

export default function Page({ params }: { params: { id: string } }) {
  const { user, isLoading } = useUser(params.id!);

  if (isLoading)
    return (
      <Center height={"300px"}>
        <Spinner />
      </Center>
    );

  return (
    <Box color={"gray.600"}>
      <HStack py={"12px"} pb={"48px"}>
        <Link
          href={"/private/settings/users"}
          display={"flex"}
          alignItems={"center"}
        >
          <Icon as={IoIosArrowBack} w={"28px"} h={"28px"} />
        </Link>
        <Heading size={"md"}>Chi tiết người dùng</Heading>
      </HStack>

      {user && (
        <Box maxW={"1000px"}>
          <UserForm user={user} />
        </Box>
      )}

      {!user && (
        <Box maxW={"1000px"}>
          <Center>
            <Text>Không có người dùng phù hợp!</Text>
          </Center>
        </Box>
      )}
    </Box>
  );
}
