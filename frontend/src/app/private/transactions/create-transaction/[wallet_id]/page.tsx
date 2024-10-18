"use client";

import { useWallet } from "@/hooks/useWallets";
import { TransactionCreateForm } from "@/templates/transactions/transaction-create-form";
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

export default function Page({ params }: { params: { wallet_id: string } }) {
  const { wallet, isLoading } = useWallet(params.wallet_id!);

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
        <Heading size={"md"}>Thông tin tạo giao dịch</Heading>
      </HStack>

      {wallet && (
        <>
          <TransactionCreateForm wallet={wallet} />
        </>
      )}

      {!wallet && (
        <Box maxW={"1000px"}>
          <Center>
            <Text>Không có thẻ thành viên hợp lệ nào!</Text>
          </Center>
        </Box>
      )}
    </Box>
  );
}
