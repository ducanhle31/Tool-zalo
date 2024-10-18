import { TransactionPreview } from "@/types/global";
import { Link } from "@chakra-ui/next-js";
import {
  Card,
  CardProps,
  Heading,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";
import Moment from "react-moment";

interface CardTransaction extends CardProps {
  transaction: TransactionPreview;
  href?: string;
}

export const Transaction = (props: CardTransaction) => {
  const { transaction, href, ...args } = props;

  return (
    <Card
      px={"12px"}
      py={"12px"}
      rounded={"sm"}
      minW={"min-content"}
      pos={"relative"}
      as={Link}
      href={href || `/private/transactions/${transaction?._id!}`}
      {...args}
    >
      <VStack alignItems={"start"} fontSize={"sm"}>
        <Heading size={"sm"}>{transaction?.title}</Heading>
        <HStack>
          <Text>Giá trị: </Text>
          <Text color={"red.500"}>
            {transaction?.value?.toLocaleString("vi", {
              style: "currency",
              currency: "VND",
            })}
          </Text>
        </HStack>
        <HStack>
          <Text>Ngày: </Text>
          <Moment format="DD/MM/YYYY">{transaction?.createdAt}</Moment>
        </HStack>
      </VStack>
    </Card>
  );
};
