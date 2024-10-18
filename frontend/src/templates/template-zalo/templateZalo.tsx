"use client";

import { ZaloTemplates } from "@/types/global";
import { Link } from "@chakra-ui/next-js";
import { Box, Card, CardProps, HStack, Text } from "@chakra-ui/react";

interface CardCampaign extends CardProps {
  template: ZaloTemplates | null;
}

export const TemplateZalo = (props: CardCampaign) => {
  const { template, children, ...args } = props;

  return (
    <Card
      {...args}
      px={"12px"}
      py={"12px"}
      as={Link}
      href={`/private/manage-zalo-oa/${template?.templateId}`}
      rounded={"sm"}
      minW={"min-content"}
      pos={"relative"}
      _hover={{ bg: "gray.100" }}
    >
      <HStack>
        <Box key={template?.templateId}>
          <Text fontSize="lg" color={"blue"}>
            {template?.templateName}
          </Text>
          <Text>ID: {template?.templateId}</Text>
        </Box>
      </HStack>
    </Card>
  );
};
