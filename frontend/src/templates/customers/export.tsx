"use client";

import { useFiles } from "@/hooks/useFiles";
import { Button } from "@chakra-ui/react";
import { CiImport } from "react-icons/ci";

export const CustomersExport = ({ customers }: { customers: any }) => {
  const { handleExportData } = useFiles();

  return (
    <Button
      colorScheme="teal"
      variant={"outline"}
      rounded={"sm"}
      leftIcon={<CiImport size={"24px"} />}
      onClick={() => handleExportData(customers)}
    >
      Export excel
    </Button>
  );
};
