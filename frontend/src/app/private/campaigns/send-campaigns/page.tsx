"use client";

import { SearchInput } from "@/components/SearchInput";
import { useCampaignResult } from "@/hooks/useCampaigns";
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
  const { campaignsresult, isLoading } = useCampaignResult();

  const filteredCampaignsResult =
    campaignsresult?.filter(
      (campaign) =>
        !search ||
        campaign?.name
          ?.toLocaleLowerCase()
          .includes(search.toLocaleLowerCase().trim())
    ) || [];

  // Flattening customer results and combining campaign details
  const rows = filteredCampaignsResult.flatMap((campaign) => {
    return {
      campaignName: campaign.campaign_name,
      campaignID: campaign.campaign_id,
      template: campaign.template,
      status: campaign.status,
      createdAt: campaign.createdAt,
      customerName: campaign.name,
      phone: campaign.phone,
    };
  });

  const { currentPage, nextPage, prevPage, totalPages } = usePagination({
    total: rows.length,
    perpage: 20,
  });

  const rowsPaginated = rows.slice((currentPage - 1) * 20, currentPage * 20);

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
          href={"/private/campaignsresult/create-campaignsresult"}
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
            <Th>ID chiến dịch</Th>
            <Th>Id mẫu tin</Th>
            <Th>Trạng thái gửi</Th>
            <Th>Ngày gửi</Th>
            <Th>Tên khách hàng</Th>
            <Th>Số điện thoại</Th>
          </Tr>
        </Thead>
        <Tbody>
          {rowsPaginated.length > 0 ? (
            rowsPaginated.map((row, index) => (
              <Tr key={index} fontSize="sm" _hover={{ bgColor: "white" }}>
                <Td>{row.campaignName}</Td>
                <Td>{row.campaignID}</Td>
                <Td>{row.template}</Td>
                <Td>
                  <Text
                    color={
                      row.status === "success"
                        ? "green.500"
                        : row.status === "failure"
                        ? "red.500"
                        : "black"
                    }
                  >
                    {row.status === "failure" ? "Thất bại" : "Thành công"}
                  </Text>
                </Td>
                <Td>{new Date(row.createdAt).toLocaleString()}</Td>
                <Td>{row.customerName}</Td>
                <Td>{row.phone}</Td>
              </Tr>
            ))
          ) : (
            <Tr>
              <Td colSpan={7} textAlign="center">
                <Text fontSize="xs" color="gray.500">
                  Không có kết quả
                </Text>
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>
    </>
  );
}
