"use client";

import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import RequestUserInfo from "./request-user-info";

export default function UidTemplate() {
  return (
    <>
      <Tabs mt={"24px"} colorScheme="green">
        <TabList>
          <Tab>Tin yêu cầu thông tin người dùng</Tab>
          <Tab>Tin giao dịch</Tab>
          <Tab>Tin truyền thông cá nhân</Tab>
          <Tab>Tin truyền thông Broadcast</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <RequestUserInfo />
          </TabPanel>
          <TabPanel>
            <p>two!</p>
          </TabPanel>
          <TabPanel>
            <p>3</p>
          </TabPanel>
          <TabPanel>
            <p>two!</p>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
}
