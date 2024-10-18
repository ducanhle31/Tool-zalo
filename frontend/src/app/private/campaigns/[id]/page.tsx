"use client";

import { useCampaign } from "@/hooks/useCampaigns";
import { CampaignForm } from "@/templates/campaigns/campaign-form";
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
  const { campaign, isLoading } = useCampaign(params.id!);

  if (isLoading)
    return (
      <Center height={"300px"}>
        <Spinner size={"lg"} />
      </Center>
    );

  return (
    <Box color={"gray.600"}>
      <HStack py={"12px"} pb={"48px"}>
        <Link
          href={"/private/campaigns"}
          display={"flex"}
          alignItems={"center"}
        >
          <Icon as={IoIosArrowBack} w={"28px"} h={"28px"} />
        </Link>
        <Heading size={"md"}>Chi tiết chiến dịch</Heading>
      </HStack>

      {campaign && (
        <Box maxW={"1000px"}>
          <CampaignForm campaign={campaign || undefined} />
        </Box>
      )}

      {!campaign && (
        <Box maxW={"1000px"}>
          <Center>
            <Text>Không có khách hàng phù hợp!</Text>
          </Center>
        </Box>
      )}
    </Box>
  );
}
