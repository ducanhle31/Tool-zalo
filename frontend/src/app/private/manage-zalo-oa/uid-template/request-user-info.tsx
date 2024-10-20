"use client";

import { FilterInput } from "@/components/FilterInput";
import { SearchInput } from "@/components/SearchInput";
import { useCustomers } from "@/hooks/useCustomers";
import usePagination from "@/hooks/usePagination";
import { useRequestUserInfos } from "@/hooks/useRequestUserInfo";
import { Customer } from "@/templates/customers/customer";
import { CustomersExport } from "@/templates/customers/export";
import { RequestUseInfoDetail } from "@/templates/template-zalo/request-use-info-detail";
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
} from "@chakra-ui/react";
import lodash from "lodash";
import { useState } from "react";
import { CiExport } from "react-icons/ci";
import { FaPlus } from "react-icons/fa";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";

export default function RequestUserInfo() {
  const [search, setSearch] = useState("");
  const [idGroups, setIdGroups] = useState<string[]>([]);

  const { requestUserInfos, isLoading } = useRequestUserInfos();
  console.log(requestUserInfos);
  const customersFilters =
    requestUserInfos?.filter(
      (requestUserInfos) =>
        (!idGroups?.length ||
          lodash.intersection(idGroups, requestUserInfos?.title || [])?.length >
            0) &&
        (!search ||
          requestUserInfos?.title
            ?.toLocaleLowerCase()
            .trim()
            .includes(search.toLocaleLowerCase().trim()) ||
          requestUserInfos?.subtitle?.includes(search))
    ) || [];

  const { currentPage, nextPage, prevPage, totalPages } = usePagination({
    total: customersFilters?.length,
    perpage: 50,
  });

  const customersPag = customersFilters.slice(
    currentPage - 1,
    currentPage + 49
  );

  return (
    <>
      <HStack mt={"24px"} flexWrap={"wrap"}>
        <Button
          as={Link}
          href={"/private/manage-zalo-oa/create-template"}
          rounded={"sm"}
          leftIcon={<FaPlus />}
          colorScheme="teal"
        >
          Thêm mẫu yêu cầu thông tin người dùng
        </Button>
        <Button
          rounded={"sm"}
          leftIcon={<CiExport size={"24px"} />}
          colorScheme="teal"
          as={Link}
          href={"/private/customers/import-customers"}
        >
          Import excel
        </Button>
        <CustomersExport customers={customersFilters} />
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
        <HStack alignItems={"center"} justifyContent={"start"} maxW={"500px"}>
          <Heading size={"sm"} w={"100px"} flex={1}>
            Bộ lọc
          </Heading>
          <Box flex={5}>
            <FilterInput
              filters={requestUserInfos?.map((group) => ({
                label: group?.title,
                value: group?._id,
              }))}
              onSearch={(data) => {
                setIdGroups(data);
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
          columns={{ base: 1, sm: 2, md: 4, lg: 4, xl: 4, "2xl": 4 }}
          gap={"18px"}
          color={"gray.400"}
        >
          {customersPag?.map((customer, index) => (
            <RequestUseInfoDetail customer={customer} key={index} />
          ))}
        </SimpleGrid>
      )}
    </>
  );
}
