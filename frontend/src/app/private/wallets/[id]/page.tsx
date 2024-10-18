"use client";

import { useWallet } from "@/hooks/useWallets";
import { TransactionHistories } from "@/templates/wallets/transaction-histories";
import { WalletForm } from "@/templates/wallets/wallet-form";
import { Link } from "@chakra-ui/next-js";
import {
  Box,
  Button,
  Center,
  Container,
  Heading,
  HStack,
  Icon,
  SimpleGrid,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { FaPlus } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import { LuHistory } from "react-icons/lu";
import { MdPayment } from "react-icons/md";

export default function Page({ params }: { params: { id: string } }) {
  const { wallet, isLoading } = useWallet(params.id!);

  if (isLoading)
    return (
      <Center height={"300px"}>
        <Spinner />
      </Center>
    );

  return (
    <Container maxW={"6xl"} color={"gray.600"}>
      <HStack py={"12px"} pb={"48px"}>
        <Link href={"/private/wallets"} display={"flex"} alignItems={"center"}>
          <Icon as={IoIosArrowBack} w={"28px"} h={"28px"} />
        </Link>
        <Heading size={"md"}>Chi tiết thông tin thẻ thành viên</Heading>
      </HStack>

      {wallet && (
        <>
          <HStack pb={12}>
            <Button
              isDisabled={wallet?.status !== "active"}
              as={Link}
              href={`/private/transactions/create-transaction/${wallet?._id}/?type=recharge`}
              rounded={"sm"}
              leftIcon={<FaPlus />}
              colorScheme="teal"
            >
              Nạp tiền
            </Button>

            <Button
              as={Link}
              href={`/private/transactions/create-transaction/${wallet?._id}/?type=payment`}
              rounded={"sm"}
              leftIcon={<MdPayment />}
              colorScheme="teal"
              isDisabled={wallet?.status !== "active"}
            >
              Chi
            </Button>
          </HStack>
          <SimpleGrid columns={{ base: 1, lg: 1 }} spacing={12}>
            <WalletForm wallet={wallet} />
            <Box maxH={"600px"} overflowY={"auto"} py={6}>
              <HStack>
                <LuHistory size={"24px"} />
                <Heading size={"md"}>Lịch sử giao dịch</Heading>
              </HStack>
              <TransactionHistories wallet={wallet} />
            </Box>
          </SimpleGrid>
        </>
      )}

      {!wallet && (
        <Box>
          <Center>
            <Text>Không có thẻ thành viên nào!</Text>
          </Center>
        </Box>
      )}
    </Container>
  );
}
