"use client";

import { SearchInput } from "@/components/SearchInput";
import { useCampaigns } from "@/hooks/useCampaigns";
import usePagination from "@/hooks/usePagination";
import { Link } from "@chakra-ui/next-js";
import {
  Button,
  Center,
  Heading,
  HStack,
  IconButton,
  SimpleGrid,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";

export default function Page() {
  const [search, setSearch] = useState("");
  const { campaigns, isLoading } = useCampaigns();

  const campaignsFilters =
    campaigns?.filter(
      (campaign) =>
        !search ||
        campaign?.name
          ?.toLocaleLowerCase()
          .trim()
          .includes(search.toLocaleLowerCase().trim())
    ) || [];

  const rows = campaignsFilters.flatMap(
    (campaign) =>
      campaign.customer_results?.map((result) => ({
        campaignName: campaign.name,
        result,
      })) || []
  );

  const { currentPage, nextPage, prevPage, totalPages } = usePagination({
    total: rows.length,
    perpage: 20,
  });

  const rowsPag = rows.slice((currentPage - 1) * 20, currentPage * 20);

  if (isLoading) {
    return (
      <Center h={"300px"}>
        <Spinner />
      </Center>
    );
  }

  return (
    <>
      <HStack mt={"24px"} flexWrap={"wrap"}>
        <Button
          as={Link}
          href={"/private/campaigns/create-campaigns"}
          rounded={"sm"}
          leftIcon={<FaPlus />}
          colorScheme="teal"
        >
          Tạo chiến dịch
        </Button>
      </HStack>

      <SimpleGrid
        columns={{ base: 1, md: 3 }}
        mt={"32px"}
        mb={"48px"}
        gap={"24px"}
      >
        <HStack alignItems={"center"} justifyContent={"start"} maxW={"500px"}>
          <Heading size={"sm"} w={"100px"}>
            Tìm kiếm
          </Heading>
          <SearchInput onSearch={(value) => setSearch(value)} />
        </HStack>

        <HStack>
          <Text>{`${currentPage}/ ${totalPages} trang`}</Text>
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

      <Table variant="simple" mb={8} bgColor={"#f1f4f9"}>
        <Thead bgColor={"#e1e3ea"}>
          <Tr fontWeight={"bold"} fontSize={"2xl"}>
            <Th>Tên chiến dịch</Th>
            <Th>Id mẫu tin</Th>
            <Th>Người nhận</Th>
            <Th>Số điện thoại</Th>
            <Th>Gửi lúc</Th>
            <Th>Trạng thái</Th>
          </Tr>
        </Thead>
        <Tbody>
          {rowsPag.length > 0 ? (
            rowsPag.map((row, index) => (
              <Tr key={index} fontSize="sm" _hover={{ bgColor: "white" }}>
                <Td>{row.campaignName}</Td>
                <Td>{row.result.template?.toString()}</Td>
                <Td>{row.result.name}</Td>
                <Td>{row.result.phone}</Td>
                <Td>
                  {row.result.createdAt
                    ? new Date(row.result.createdAt).toLocaleString("en-GB", {
                        timeZone: "Asia/Ho_Chi_Minh",
                      })
                    : "N/A"}
                </Td>
                <Td>
                  <Text
                    color={
                      row.result.status === "success"
                        ? "green.500"
                        : row.result.status === "failure"
                        ? "red.500"
                        : "black"
                    }
                  >
                    {row.result.status === "failure"
                      ? "Thất bại"
                      : row.result.status === "success"
                      ? "Thành công"
                      : row.result.status}
                  </Text>
                </Td>
              </Tr>
            ))
          ) : (
            <Tr>
              <Td colSpan={6} textAlign="center">
                <Text fontSize="xs" color="gray.500">
                  No customer results available
                </Text>
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>
    </>
  );
}
