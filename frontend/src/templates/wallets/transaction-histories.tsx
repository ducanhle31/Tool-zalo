import { useTransactionsByWallet } from "@/hooks/useTransactions";
import { Wallet } from "@/types/global";
import { Center, SimpleGrid, Spinner, Text } from "@chakra-ui/react";
import { Transaction } from "../transactions/transaction";

export const TransactionHistories = ({ wallet }: { wallet: Wallet }) => {
  const { transactions, isLoading } = useTransactionsByWallet({
    wallet: wallet?._id,
  });

  if (isLoading)
    return (
      <Center h={"300px"}>
        <Spinner />
      </Center>
    );

  if (!transactions?.length)
    return (
      <Text textAlign={"center"} py={6}>
        Không có giao dịch!
      </Text>
    );

  return (
    <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={12} py={6}>
      {transactions?.map((transaction, index) => (
        <Transaction transaction={transaction} key={index} />
      ))}
    </SimpleGrid>
  );
};
