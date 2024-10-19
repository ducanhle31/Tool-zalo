"use client";
import usePagination from "@/hooks/usePagination";
import { useUsersOA } from "@/hooks/useUsers";
import { UserOa } from "@/types/global";
import {
  Box,
  Center,
  HStack,
  IconButton,
  SimpleGrid,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";

export default function Page() {
  const { usersoa, isLoading } = useUsersOA();

  const { currentPage, nextPage, prevPage, totalPages } = usePagination({
    total: usersoa?.users?.length || 0,
    perpage: 40,
  });

  const startIndex = (currentPage - 1) * 40;
  const endIndex = startIndex + 40;
  const paginatedUsers = usersoa?.users?.slice(startIndex, endIndex);

  if (isLoading) {
    return (
      <Center height="500px">
        <Spinner />
      </Center>
    );
  }

  return (
    <>
      <Text my={"24px"} fontSize={"xl"} fontWeight={"bold"}>
        Danh sách người dùng
      </Text>

      <SimpleGrid
        columns={{ base: 1, md: 3 }}
        mt={"32px"}
        mb={"48px"}
        gap={"24px"}
      >
        <HStack>
          <Text>{`${currentPage} / ${totalPages} trang`}</Text>
          <IconButton
            rounded={"sm"}
            aria-label="prev"
            onClick={prevPage}
            icon={<GrFormPrevious />}
            colorScheme="teal"
            isDisabled={currentPage <= 1}
          />
          <IconButton
            rounded={"sm"}
            aria-label="next"
            onClick={nextPage}
            icon={<GrFormNext />}
            colorScheme="teal"
            isDisabled={currentPage >= totalPages}
          />
        </HStack>
      </SimpleGrid>

      <SimpleGrid
        columns={{ base: 1, sm: 2, md: 4, lg: 4, xl: 4, "2xl": 4 }}
        gap={"18px"}
      >
        {paginatedUsers?.map((user: UserOa) => (
          <Box
            key={user.user_id}
            padding={4}
            borderWidth={1}
            borderRadius="md"
            boxShadow="md"
          >
            <Text fontSize="lg">User ID: {user.user_id}</Text>
          </Box>
        ))}
      </SimpleGrid>
    </>
  );
}
