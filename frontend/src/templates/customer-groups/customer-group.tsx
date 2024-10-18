"use client";

import { CustomerGroup as TypeCustomerGroup } from "@/types/global";
import { Link } from "@chakra-ui/next-js";
import {
  Box,
  Card,
  CardProps,
  Heading,
  HStack,
  Icon,
  Stack,
  Text,
} from "@chakra-ui/react";
import { GrGroup } from "react-icons/gr";
import Moment from "react-moment";

interface CardCustomer extends CardProps {
  group: TypeCustomerGroup | null;
}

export const CustomerGroup = (props: CardCustomer) => {
  const { group, children, ...args } = props;

  return (
    <Card
      {...args}
      px={"12px"}
      py={"12px"}
      as={Link}
      href={`/private/customer-groups/${group?._id}`}
      rounded={"sm"}
      minW={"min-content"}
      pos={"relative"}
    >
      <HStack>
        <Box flex={1}>
          <Icon as={GrGroup} />
        </Box>
        <Stack flex={3}>
          <Heading minW={"min-content"} size={"sm"} isTruncated>
            {group?.name}
          </Heading>
          <HStack alignItems={"end"}>
            <Text fontSize={"xs"}>Ngày tạo: </Text>
            <Text fontSize={"xs"}>
              <Moment format="DD/MM/YYYY">{group?.updatedAt}</Moment>
            </Text>
          </HStack>
        </Stack>
      </HStack>
    </Card>
  );
};
