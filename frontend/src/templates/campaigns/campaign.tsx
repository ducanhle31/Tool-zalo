"use client";

import { Campaign as TypeCampaign } from "@/types/global";
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
import { MdCampaign } from "react-icons/md";
import Moment from "react-moment";

interface CardCampaign extends CardProps {
  campaign: TypeCampaign | null;
}

export const Campaign = (props: CardCampaign) => {
  const { campaign, children, ...args } = props;

  return (
    <Card
      {...args}
      px={"12px"}
      py={"12px"}
      as={Link}
      href={`/private/campaigns/${campaign?._id}`}
      rounded={"sm"}
      minW={"min-content"}
      pos={"relative"}
    >
      <HStack>
        <Box flex={1}>
          <Icon as={MdCampaign} w={"32px"} h={"32px"} />
        </Box>
        <Stack flex={5}>
          <Heading minW={"min-content"} size={"sm"} isTruncated>
            {campaign?.name}
          </Heading>
          <HStack alignItems={"end"}>
            <Text fontSize={"xs"}>Ngày tạo: </Text>
            <Text fontSize={"xs"}>
              <Moment format="DD/MM/YYYY">{campaign?.createdAt}</Moment>
            </Text>
          </HStack>

          <HStack alignItems={"end"}>
            <Text fontSize={"xs"}>Còn: </Text>
            <Text fontSize={"xs"}>
              <Moment format="DD/MM/YYYY">{campaign?.createdAt}</Moment>
            </Text>
          </HStack>
        </Stack>
      </HStack>
    </Card>
  );
};
