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
  Center,
  GridItem,
  Heading,
  HStack,
  IconButton,
  SimpleGrid,
  Spinner,
  Text,
} from "@chakra-ui/react";
import lodash from "lodash";
import { useState } from "react";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";

export default function Page() {
  const [search, setSearch] = useState("");
  const [idGroups, setIdGroups] = useState<string[]>([]);
  const { wallets, isLoading } = useWallets();
  const { customerGroups } = useCustomerGroups();

  const walletsFilters =
    wallets?.filter(
      (wallet) =>
        wallet?.status === "active" &&
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
        <Text>Chọn một thẻ thành viên để giao dịch. Nếu chưa tồn tại hãy</Text>
        <Link href={"/private/wallets/create-wallet"} color={"blue"}>
          Tạo thẻ thành viên
        </Link>
      </HStack>

      <SimpleGrid columns={{ base: 1, md: 4 }} mt={"32px"} mb={"48px"} gap={12}>
        <HStack alignItems={"center"} justifyContent={"start"} maxW={"500px"}>
          <Heading size={"sm"} w={"100px"}>
            Tìm kiếm
          </Heading>
          <SearchInput onSearch={(value) => setSearch(value)} />
        </HStack>
        <GridItem
          as={HStack}
          alignItems={"center"}
          justifyContent={"start"}
          colSpan={2}
        >
          <Heading size={"sm"}>Nhóm khách hàng</Heading>
          <Box flex={1}>
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
        </GridItem>
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
            <GridItem key={index}>
              <Wallet
                edit={false}
                wallet={wallet}
                href={`/private/transactions/create-transaction/${wallet?._id!}`}
              />
            </GridItem>
          ))}
        </SimpleGrid>
      )}
    </>
  );
}
