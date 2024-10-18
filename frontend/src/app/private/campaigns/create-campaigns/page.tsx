"use client";

import { CampaignForm } from "@/templates/campaigns/campaign-form";
import { Link } from "@chakra-ui/next-js";
import {
  Box,
  Heading,
  HStack,
  Icon,
  IconButton,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";

export default function Page() {
  const [tabs, setTabs] = useState(1);

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
        <Heading size={"md"}>Thêm chiến dịch</Heading>
      </HStack>
      <Tabs>
        <TabList>
          {Array.from({ length: tabs })?.map((item, index) => (
            <Tab key={index}>{`Chiến dịch 0${index + 1}`}</Tab>
          ))}
          <IconButton
            onClick={() => setTabs((prev) => prev + 1)}
            aria-label="add"
            rounded={"sm"}
            icon={<FaPlus size={"12px"} />}
          >
            Thêm chiến dịch
          </IconButton>
        </TabList>

        <TabPanels p={0}>
          {Array.from({ length: tabs })?.map((item, index) => (
            <TabPanel key={index} px={0}>
              <Box maxW={"1000px"}>
                <CampaignForm />
              </Box>
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </Box>
  );
}
