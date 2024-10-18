"use client";

import { useZaloTemplates } from "@/hooks/useZaloTemplates";
import { TemplateZalo } from "@/templates/template-zalo/templateZalo";
import { Center, SimpleGrid, Spinner, Text } from "@chakra-ui/react";

export default function TemplateList() {
  const { zaloTemplates, isLoading } = useZaloTemplates();

  if (isLoading) {
    return (
      <Center height="500px">
        <Spinner />
      </Center>
    );
  }

  return (
    <>
      <Text my={"24px"} fontSize={"xl"} fontWeight={"bold"}>
        Mẫu tin ZNS
      </Text>
      <SimpleGrid
        columns={{ base: 1, sm: 2, md: 4, lg: 4, xl: 4, "2xl": 4 }}
        gap={"18px"}
      >
        {zaloTemplates.map((template, index) => (
          <TemplateZalo key={index} template={template} />
        ))}
      </SimpleGrid>
    </>
  );
}
