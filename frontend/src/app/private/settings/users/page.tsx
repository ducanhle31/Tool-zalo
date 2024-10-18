"use client";

import { FilterInput } from "@/components/FilterInput";
import { useFacilities } from "@/hooks/useFacilities";
import usePagination from "@/hooks/usePagination";
import { useSessions } from "@/hooks/useSessions";
import { useUsers } from "@/hooks/useUsers";
import { User } from "@/templates/users/user";
import { Link } from "@chakra-ui/next-js";
import {
  Box,
  Button,
  Center,
  Heading,
  HStack,
  IconButton,
  SimpleGrid,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";

export default function Page() {
  const { users, isLoading } = useUsers();
  const { facilities } = useFacilities();
  const { user } = useSessions();

  const [idFacilities, setIdFacilities] = useState<string[] | null>(null);

  const usersFilters =
    users?.filter(
      (user) =>
        (user?.facility &&
          (!idFacilities || idFacilities?.includes(user?.facility))) ||
        !idFacilities ||
        !idFacilities?.length
    ) || [];

  const { currentPage, nextPage, prevPage, totalPages } = usePagination({
    total: usersFilters?.length,
    perpage: 50,
  });

  const usersPag = usersFilters.slice(currentPage - 1, currentPage + 49);

  if ((user as any)?.role !== "admin")
    return (
      <Center h={"300px"}>
        <VStack>
          <Text textAlign={"center"}>
            Chức năng này chỉ dành cho quản trị viên!
          </Text>
          <Button
            rounded={"sm"}
            colorScheme="teal"
            as={Link}
            href={"/login"}
            size={"lg"}
          >
            Đăng nhập
          </Button>
        </VStack>
      </Center>
    );

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
          href={"/private/settings/users/create-users"}
          rounded={"sm"}
          leftIcon={<FaPlus />}
          colorScheme="teal"
        >
          Tạo người dùng
        </Button>
      </HStack>

      <SimpleGrid
        columns={{ base: 1, md: 3 }}
        mt={"32px"}
        mb={"48px"}
        gap={"24px"}
      >
        <HStack alignItems={"center"} justifyContent={"start"} maxW={"500px"}>
          <Heading size={"sm"} w={"100px"} flex={1}>
            Nguồn
          </Heading>
          <Box flex={5}>
            <FilterInput
              filters={facilities?.map((facility) => ({
                label: facility?.name,
                value: facility?._id,
              }))}
              onSearch={(data) => {
                setIdFacilities(data);
              }}
            />
          </Box>
        </HStack>
        <HStack>
          <Text>{`${currentPage}/ ${totalPages} trang`}</Text>
          <IconButton
            rounded={"sm"}
            aria-label="prev"
            onClick={() => prevPage()}
            icon={<GrFormPrevious />}
            colorScheme="teal"
            isDisabled={currentPage <= 1}
          />
          <IconButton
            rounded={"sm"}
            aria-label="next"
            onClick={() => nextPage()}
            icon={<GrFormNext />}
            colorScheme="teal"
            isDisabled={currentPage >= totalPages}
          />
        </HStack>
      </SimpleGrid>

      {isLoading && (
        <Center h={"300px"}>
          <Spinner />
        </Center>
      )}

      {!isLoading && (
        <SimpleGrid
          columns={{ base: 1, sm: 2, md: 3, lg: 4, xl: 5, "2xl": 6 }}
          gap={"18px"}
          color={"gray.400"}
        >
          {usersPag?.map((user, index) => (
            <User user={user} key={index} />
          ))}
        </SimpleGrid>
      )}
    </>
  );
}
