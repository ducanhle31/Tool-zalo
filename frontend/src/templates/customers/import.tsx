"use client";

import { useFiles } from "@/hooks/useFiles";
import { DataRow } from "@/types/global";
import { upCustommers } from "@/untils/methods/upCustommers";
import {
  Button,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  Heading,
  Input,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { useRef } from "react";
import { CiExport, CiImport } from "react-icons/ci";

const jsonDateTemplate: DataRow[] = [
  { id: 1, name: "John Doe", age: 30, occupation: "Developer" },
  { id: 2, name: "Jane Smith", age: 25, occupation: "Designer" },
  { id: 3, name: "Sam Johnson", age: 35, occupation: "Manager" },
];

export const CustomersImport = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();
  const { jsonData, handleFileUpload, exportToExcel } = useFiles();

  const mutation = useMutation({
    mutationFn: upCustommers,
    onSuccess: () => {},
    onError: () => {},
  });

  return (
    <>
      <Button
        rounded={"sm"}
        ref={btnRef as never}
        onClick={onOpen}
        leftIcon={<CiExport size={"24px"} />}
        colorScheme="teal"
      >
        Import excel
      </Button>
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef as never}
        size={"lg"}
      >
        <DrawerOverlay />
        <DrawerContent px={10} py={10}>
          <Stack pb={"64px"}>
            <Heading size={"sm"} color={"gray.500"}>
              Bạn chưa biết import thế nào? Vui lòng tải về file mẫu dưới đây
            </Heading>
            <Button
              rightIcon={<CiImport size={"24px"} />}
              rounded={"sm"}
              variant={"outline"}
              colorScheme="teal"
              maxW={"200px"}
              onClick={() =>
                exportToExcel({
                  jsonDateTemplate,
                  fileName: "customers",
                })
              }
            >
              Download
            </Button>
          </Stack>
          <Input
            onChange={handleFileUpload}
            size={"lg"}
            type="file"
            accept=".xlsx, .csv, .excel"
          />
          <Button
            isDisabled={!jsonData}
            colorScheme="teal"
            rounded={"sm"}
            size={"lg"}
            onClick={() => {
              mutation.mutate(jsonData);
            }}
          >
            Bắt đầu import
          </Button>
        </DrawerContent>
      </Drawer>
    </>
  );
};
