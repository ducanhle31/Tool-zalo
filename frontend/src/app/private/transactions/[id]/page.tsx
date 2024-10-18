"use client";

import { useTransaction } from "@/hooks/useTransactions";
import { TransactionForm } from "@/templates/transactions/transaction-form";
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
  const { transaction, isLoading } = useTransaction(params.id!);

  if (isLoading)
    return (
      <Center height={"300px"}>
        <Spinner />
      </Center>
    );

  return (
    <Box color={"gray.600"} maxW={"1000px"}>
      <HStack py={"12px"} pb={"48px"}>
        <Link
          href={"/private/transactions"}
          display={"flex"}
          alignItems={"center"}
        >
          <Icon as={IoIosArrowBack} w={"28px"} h={"28px"} />
        </Link>
        <Heading size={"md"}>Chi tiết thông tin giao dịch</Heading>
      </HStack>

      {transaction && (
        <>
          <TransactionForm transaction={transaction} />
        </>
      )}

      {!transaction && (
        <Box maxW={"1000px"}>
          <Center>
            <Text>Không có giao dịch nào!</Text>
          </Center>
        </Box>
      )}
    </Box>
  );
}
