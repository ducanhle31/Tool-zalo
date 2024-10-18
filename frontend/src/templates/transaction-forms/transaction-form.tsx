/* eslint-disable react/no-children-prop */
"use client";

import { TransactionForm as TypeTransactionForm } from "@/types/global";
import { deleteTransactionForm } from "@/untils/methods/upTransactionForms";
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
import { FaTrash } from "react-icons/fa";
import { RiSecurePaymentFill } from "react-icons/ri";

interface TransactionFormProps extends CardProps {
  transactionForm: TypeTransactionForm;
}

export const TransactionForm = (props: TransactionFormProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const router = useRouter();

  const { transactionForm } = props;

  const deleteTransactionFormMutation = useMutation({
    mutationFn: deleteTransactionForm,
    onSuccess: async (data) => {
      const res = await data.json();
      if (res?.ok) {
        toast({
          title: "Thành công",
          description: "Đã xóa phương thức giao dịch!",
          status: "success",
          position: "top-right",
        });

        onClose();

        res.result && router.push(`/private/settings/transaction-forms/1`);
      } else {
        toast({
          title: "Thất bại",
          description: "Xóa phương thức giao dịch thất bại! " + res?.error,
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
      <Icon as={RiSecurePaymentFill} w={"30px"} h={"30px"} />
      <Box>
        <Heading size={"md"} textAlign={"center"}>
          {transactionForm?.name}
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
              <ModalHeader>Xóa phương thức giao dịch</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                Bạn chắc chắn muốn xóa {transactionForm?.name}?
              </ModalBody>

              <ModalFooter as={HStack}>
                <Button
                  colorScheme="red"
                  rounded={"sm"}
                  onClick={() =>
                    deleteTransactionFormMutation.mutate(transactionForm?._id)
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
