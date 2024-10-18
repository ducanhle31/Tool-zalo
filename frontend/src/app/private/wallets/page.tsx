"use client";

import { FilterInput } from "@/components/FilterInput";
import { SearchInput } from "@/components/SearchInput";
import { useCustomerGroups } from "@/hooks/useCustomerGroups";
import usePagination from "@/hooks/usePagination";
import { useWallets } from "@/hooks/useWallets";
import { Wallet } from "@/templates/wallets/wallet";
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

export default function Page() {
  const [search, setSearch] = useState("");
  const [idGroups, setIdGroups] = useState<string[]>([]);
  const { wallets, isLoading } = useWallets();
  const { customerGroups } = useCustomerGroups();

  const walletsFilters =
    wallets?.filter(
      (wallet) =>
        (!idGroups?.length ||
          lodash.intersection(idGroups, wallet?.customer?.customer_groups || [])
            ?.length > 0) &&
        (!search ||
          wallet?.customer?.name
            ?.toLocaleLowerCase()
            .trim()
            .includes(search.toLocaleLowerCase().trim()) ||
          wallet?.customer?.phone?.includes(search))
    ) || [];

  const { currentPage, nextPage, prevPage, totalPages } = usePagination({
    total: walletsFilters?.length,
    perpage: 50,
  });

  const walletsPag = walletsFilters.slice(currentPage - 1, currentPage + 49);

  return (
    <>
      <HStack mt={"24px"} flexWrap={"wrap"}>
        <Button
          as={Link}
          href={"/private/wallets/create-wallet"}
          rounded={"sm"}
          leftIcon={<FaPlus />}
          colorScheme="teal"
        >
          Tạo thẻ thành viên
        </Button>
        <Button
          rounded={"sm"}
          leftIcon={<CiExport size={"24px"} />}
          colorScheme="teal"
          as={Link}
          href={"/private/wallets/import-wallets"}
        >
          Import excel
        </Button>
        {/* <CustomersExport customers={customersFilters} /> */}
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
          <Heading size={"sm"} w={"100px"} flex={2}>
            Nhóm khách hàng
          </Heading>
          <Box flex={5}>
            <FilterInput
              filters={customerGroups?.map((group) => ({
                label: group?.name,
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
          columns={{ base: 1, sm: 2, md: 4, lg: 5, xl: 6, "2xl": 7 }}
          gap={"18px"}
          color={"gray.400"}
        >
          {walletsPag?.map((wallet, index) => (
            <Wallet wallet={wallet} key={index} />
          ))}
        </SimpleGrid>
      )}
    </>
  );
}
