/* eslint-disable react/no-children-prop */
"use client";

import { useTransactionForms } from "@/hooks/useTransactionForms";
import { TransactionForm } from "@/templates/transaction-forms/transaction-form";
import { createTransactionForm } from "@/untils/methods/upTransactionForms";
import {
  Box,
  Button,
  Center,
  chakra,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Spinner,
  Stack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { FaPlus, FaUserAlt } from "react-icons/fa";
import { MdOutlineDriveFileRenameOutline, MdQrCode2 } from "react-icons/md";

const CFaUserAlt = chakra(FaUserAlt);

export default function Page() {
  const { transactionForms, isLoading } = useTransactionForms();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ name: string; qrcode: string }>();
  const toast = useToast();
  const router = useRouter();

  const createTransactionFormMutation = useMutation({
    mutationFn: createTransactionForm,
    onSuccess: async (data) => {
      const res = await data.json();
      if (res?.ok) {
        toast({
          title: "Thành công",
          description: "Tạo phương thức giao dịch thành công!",
          status: "success",
          position: "top-right",
        });

        onClose();

        res.result && router.push(`/private/settings/transaction-forms/1`);
      } else {
        toast({
          title: "Thất bại",
          description: "Tạo phương thức giao dịch thất bại! " + res?.error,
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

  const onSubmit = async (data: { name: string; qrcode: string }) => {
    const transactionForm = {
      name: data?.name,
      qrcode: data?.qrcode,
      status: "active",
    };

    createTransactionFormMutation.mutate(transactionForm);
  };

  if (isLoading)
    return (
      <Center h={"300px"}>
        <Spinner />
      </Center>
    );

  return (
    <Box pt={10} maxW={"800px"}>
      <>
        <Button
          rounded={"sm"}
          colorScheme="teal"
          leftIcon={<FaPlus />}
          onClick={onOpen}
        >
          Tạo phương thức giao dịch
        </Button>

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent
            rounded={"sm"}
            as={"form"}
            onSubmit={handleSubmit(onSubmit)}
          >
            <ModalHeader>Tạo phương thức giao dịch</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Stack spacing={6}>
                <Stack>
                  <FormControl>
                    <FormLabel>Tên phương thức</FormLabel>
                    <InputGroup flexDir={"column"}>
                      <InputLeftElement
                        pointerEvents="none"
                        children={
                          <MdOutlineDriveFileRenameOutline color="gray.300" />
                        }
                      />
                      <Input
                        {...register("name", { required: "Tên là bắt buộc!" })}
                        rounded={"sm"}
                      />
                    </InputGroup>

                    {errors?.name && (
                      <FormHelperText color={"red.500"}>
                        {errors.name?.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Stack>
                <Stack>
                  <FormControl>
                    <FormLabel>Link QRCODE</FormLabel>
                    <InputGroup flexDir={"column"}>
                      <InputLeftElement
                        pointerEvents="none"
                        children={<MdQrCode2 color="gray.300" />}
                      />
                      <Input
                        {...register("qrcode", {
                          required: false,
                        })}
                        rounded={"sm"}
                      />
                    </InputGroup>
                  </FormControl>
                </Stack>
              </Stack>
            </ModalBody>

            <ModalFooter>
              <Button
                rounded={"sm"}
                colorScheme="gray"
                mr={3}
                onClick={onClose}
              >
                Hủy
              </Button>
              <Button colorScheme="teal" rounded={"sm"} type="submit">
                Tạo phương thức
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
      <SimpleGrid
        mt={12}
        columns={{ base: 1, md: 2, lg: 3 }}
        spacing={4}
        color={"gray.500"}
      >
        {transactionForms?.map((transactionForm, index) => (
          <TransactionForm transactionForm={transactionForm} key={index} />
        ))}
      </SimpleGrid>
    </Box>
  );
}
