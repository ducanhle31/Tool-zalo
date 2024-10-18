"use client";

import { SearchInput } from "@/components/SearchInput";
import usePagination from "@/hooks/usePagination";
import { useTransactions } from "@/hooks/useTransactions";
import { Transaction } from "@/templates/transactions/transaction";
import { Link } from "@chakra-ui/next-js";
import {
  Button,
  Center,
  Heading,
  HStack,
  IconButton,
  SimpleGrid,
  Spinner,
  Text,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import { MdClose } from "react-icons/md";
import DatePicker, { DateObject } from "react-multi-date-picker";

dayjs.extend(isBetween);

export default function Page() {
  const [search, setSearch] = useState("");
  const { transactions, isLoading } = useTransactions();
  const [timeRage, setTimeRange] = useState<DateObject[] | null>(null);

  const startDate =
    timeRage && timeRage[0]
      ? dayjs(timeRage[0]?.toDate().setHours(0, 0, 0))
      : null;

  const endDate =
    timeRage && timeRage[1]
      ? dayjs(timeRage[1]?.toDate().setHours(23, 59, 59))
      : null;

  const transactionsFilters =
    transactions?.filter(
      (transaction) =>
        (!search ||
          transaction?.title
            ?.toLocaleLowerCase()
            .trim()
            .includes(search.toLocaleLowerCase().trim()) ||
          transaction?.note
            ?.toLocaleLowerCase()
            .trim()
            .includes(search.toLocaleLowerCase().trim())) &&
        (!startDate ||
          !endDate ||
          dayjs(transaction?.createdAt)?.isBetween(
            startDate,
            endDate,
            null,
            "[]"
          ))
    ) || [];

  const { currentPage, nextPage, prevPage, totalPages } = usePagination({
    total: transactionsFilters?.length,
    perpage: 50,
  });

  const transactionsPag = transactionsFilters.slice(
    currentPage - 1,
    currentPage + 49
  );

  return (
    <>
      <HStack mt={"24px"} flexWrap={"wrap"}>
        <Button
          as={Link}
          href={"/private/transactions/create-transaction"}
          rounded={"sm"}
          leftIcon={<FaPlus />}
          colorScheme="teal"
        >
          Tạo giao dịch
        </Button>
        {/* <Button
          rounded={"sm"}
          leftIcon={<CiExport size={"24px"} />}
          colorScheme="teal"
          as={Link}
          href={"/private/wallets/import-wallets"}
        >
          Import excel
        </Button> */}
        {/* <CustomersExport customers={customersFilters} /> */}
      </HStack>

      <HStack mt={"32px"} mb={"48px"} gap={6} flexWrap={"wrap"}>
        <HStack alignItems={"center"} justifyContent={"start"} maxW={"500px"}>
          <Heading size={"sm"} w={"100px"}>
            Tìm kiếm
          </Heading>
          <SearchInput onSearch={(value) => setSearch(value)} />
        </HStack>

        <HStack maxW={"500px"}>
          <Heading size={"sm"}>Khoảng TG</Heading>
          <DatePicker
            range
            format="DD/MM/YYYY"
            value={timeRage ?? []}
            onChange={(value) => setTimeRange(value)}
            style={{ height: "38px", borderRadius: "2px" }}
          />
          <IconButton
            aria-label="filter"
            icon={<MdClose />}
            rounded={"sm"}
            colorScheme="gray"
            onClick={() => setTimeRange(null)}
          />
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
      </HStack>

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
          {transactionsPag?.map((transaction, index) => (
            <Transaction transaction={transaction} key={index} />
          ))}
        </SimpleGrid>
      )}
    </>
  );
}
