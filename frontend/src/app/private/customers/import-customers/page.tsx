"use client";

import { useFiles } from "@/hooks/useFiles";
import { CustomerPreview } from "@/types/global";
import { importCustommers } from "@/untils/methods/upCustommers";
import {
  Button,
  Card,
  Center,
  Container,
  Heading,
  Input,
  Spinner,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { CiImport } from "react-icons/ci";

export default function ImportCustomers() {
  const { handleExportTemplate } = useFiles();
  const [file, setFile] = useState<File | null>(null);
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const mutation = useMutation({
    mutationFn: importCustommers,
    onSuccess: async (data) => {
      const res = await data.json();
      setIsLoading(false);
      if (data.ok) {
        toast({
          title: "Thành công",
          description: "Nhập dữ liệu khách hàng thành công vào hệ thống",
          status: "success",
          position: "top-right",
        });
      } else {
        toast({
          title: "Thất bại",
          description:
            "Thiếu trường thông tin hoặc trùng số điện thoại: " + res?.error,
          status: "error",
          position: "top-right",
        });
      }
    },
    onError: (error) => {
      setIsLoading(false);
      toast({
        title: "Thất bại",
        description: error?.message,
        status: "error",
        position: "top-right",
      });
      console.log(error);
    },
  });

  return (
    <>
      <Card as={Container} maxW={"2xl"} mt={"64px"} px={"20px"} py={"20px"}>
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
            onClick={handleExportTemplate}
          >
            Download
          </Button>
        </Stack>
        <Input
          onChange={(e) => {
            e?.target?.files && setFile(e?.target?.files[0]);
          }}
          size={"lg"}
          type="file"
          accept=".xlsx"
        />
        <Button
          isDisabled={!file}
          colorScheme="teal"
          rounded={"sm"}
          size={"lg"}
          onClick={() => {
            setIsLoading(true);
            file && mutation.mutate(file);
          }}
        >
          Bắt đầu import
        </Button>
      </Card>
      {isLoading && (
        <Center
          pos={"fixed"}
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg={"#2d374870"}
        >
          <Spinner />
        </Center>
      )}
    </>
  );
}
