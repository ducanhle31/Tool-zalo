/* eslint-disable react/no-children-prop */
"use client";

import { TransactionType as TTransactionType } from "@/types/global";
import { deleteTransactionType } from "@/untils/methods/upTransactionType";
import {
  Box,
  Button,
  Card,
  CardProps,
  Heading,
  HStack,
  Icon,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { CiMoneyCheck1 } from "react-icons/ci";
import { FaTrash } from "react-icons/fa";

interface TransactionTypeProps extends CardProps {
  transactionType: TTransactionType;
}

export const TransactionType = (props: TransactionTypeProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const router = useRouter();

  const { transactionType } = props;

  const deleteTransactionTypeMutation = useMutation({
    mutationFn: deleteTransactionType,
    onSuccess: async (data) => {
      const res = await data.json();
      if (res?.ok) {
        toast({
          title: "Thành công",
          description: "Đã xóa dữ liệu của cơ sở!",
          status: "success",
          position: "top-right",
        });

        onClose();

        res.result && router.push(`/private/settings/transaction-types/1`);
      } else {
        toast({
          title: "Thất bại",
          description: "Xóa cơ sở thất bại! " + res?.error,
          status: "error",
          position: "top-right",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Thất bại",
        description: error?.message,
        status: "error",
        position: "top-right",
      });
    },
  });

  return (
    <Card
      rounded={"sm"}
      shadow={"lg"}
      pos={"relative"}
      px={4}
      py={4}
      as={VStack}
    >
      <Icon as={CiMoneyCheck1} w={"30px"} h={"30px"} />
      <Box>
        <Heading size={"md"} textAlign={"center"}>
          {transactionType?.name}
        </Heading>
        <>
          <IconButton
            rounded={"sm"}
            colorScheme="red"
            variant={"ghost"}
            aria-label="delete"
            icon={<FaTrash />}
            pos={"absolute"}
            top={0}
            right={0}
            onClick={onOpen}
          />
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent rounded={"sm"}>
              <ModalHeader>Xóa loại giao dịch</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                Bạn chắc chắn muốn xóa {transactionType?.name}?
              </ModalBody>

              <ModalFooter as={HStack}>
                <Button
                  colorScheme="red"
                  rounded={"sm"}
                  onClick={() =>
                    deleteTransactionTypeMutation.mutate(transactionType?._id)
                  }
                >
                  Xóa
                </Button>
                <Button
                  rounded={"sm"}
                  colorScheme="gray"
                  mr={3}
                  onClick={onClose}
                >
                  Hủy
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      </Box>
    </Card>
  );
};
