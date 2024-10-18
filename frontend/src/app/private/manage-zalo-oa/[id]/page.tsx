"use client";

import { useZaloTemplate } from "@/hooks/useZaloTemplates";
import { TemplateDetail } from "@/templates/template-zalo/template-detail";
import { Link } from "@chakra-ui/next-js";
import { Box, Center, Heading, HStack, Icon, Spinner } from "@chakra-ui/react";
import { IoIosArrowBack } from "react-icons/io";

export default function MessageDetail({ params }: { params: { id: string } }) {
  const { zaloTemplate, isLoading } = useZaloTemplate(params.id!);

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
          href={"/private/manage-zalo-oa"}
          display={"flex"}
          alignItems={"center"}
        >
          <Icon as={IoIosArrowBack} w={"28px"} h={"28px"} />
        </Link>
        <Heading size={"md"}>Chi tiết template</Heading>
      </HStack>

      <Box>
        <TemplateDetail zaloTemplate={zaloTemplate} />
      </Box>
    </Box>
  );
}
