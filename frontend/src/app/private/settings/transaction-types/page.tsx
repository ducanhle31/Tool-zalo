/* eslint-disable react/no-children-prop */
"use client";

import { useTransactionTypes } from "@/hooks/useTransactionTypes";
import { TransactionType } from "@/templates/transaction-types/transaction-type";
import { createTransactionType } from "@/untils/methods/upTransactionType";
import {
  Box,
  Button,
  Center,
  chakra,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
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
  Radio,
  RadioGroup,
  SimpleGrid,
  Spinner,
  Stack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { CiStickyNote } from "react-icons/ci";
import { FaPlus, FaUserAlt } from "react-icons/fa";

const CFaUserAlt = chakra(FaUserAlt);

export default function Page() {
  const { transactionTypes, isLoading } = useTransactionTypes();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<{ name: string; value: string; description: string }>();
  const toast = useToast();
  const router = useRouter();

  const createTransactionTypeMutation = useMutation({
    mutationFn: createTransactionType,
    onSuccess: async (data) => {
      const res = await data.json();
      if (res?.ok) {
        toast({
          title: "Thành công",
          description: "Tạo phương loại giao dịch thành công!",
          status: "success",
          position: "top-right",
        });

        onClose();

        res.result && router.push(`/private/settings/transaction-types/1`);
      } else {
        toast({
          title: "Thất bại",
          description: "Tạo phương loại giao dịch thất bại! " + res?.error,
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

  const onSubmit = async (data: {
    name: string;
    value: string;
    description: string;
  }) => {
    if (!data?.value) {
      toast({
        title: "Thất bại",
        status: "error",
        description: "Thiếu thông tin quy định của loại giao dịch!",
        position: "top-right",
      });
    } else {
      const transactionType = {
        name: data?.name,
        value: Number(data.value),
        status: "active",
        description: data?.description,
      };

      createTransactionTypeMutation.mutate(transactionType);
    }
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
          Tạo loại giao dịch
        </Button>

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent
            rounded={"sm"}
            as={"form"}
            onSubmit={handleSubmit(onSubmit)}
          >
            <ModalHeader>Tạo sơ sở</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Stack spacing={6}>
                <Stack>
                  <FormControl>
                    <FormLabel>Tên loại giao dịch</FormLabel>
                    <InputGroup flexDir={"column"}>
                      <InputLeftElement
                        pointerEvents="none"
                        children={<CFaUserAlt color="gray.300" />}
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

                  <FormControl>
                    <FormLabel>Mô tả loại giao dịch</FormLabel>
                    <InputGroup flexDir={"column"}>
                      <InputLeftElement
                        pointerEvents="none"
                        children={<CiStickyNote color="gray.300" />}
                      />
                      <Input
                        {...register("description", {
                          required: "Mô tả là bắt buộc!",
                        })}
                        rounded={"sm"}
                      />
                    </InputGroup>

                    {errors?.name && (
                      <FormHelperText color={"red.500"}>
                        {errors.name?.message}
                      </FormHelperText>
                    )}
                  </FormControl>

                  <Controller
                    control={control}
                    {...register("value", {
                      required:
                        "Kiểu thanh toán của loại giao dịch là bắt buộc!",
                    })}
                    render={({
                      field: { value, onChange, onBlur, ref, name },
                      formState: { errors },
                    }) => (
                      <FormControl>
                        <FormLabel>
                          Loại giao dịch thêm hay chi từ thẻ?
                        </FormLabel>
                        <RadioGroup
                          as={HStack}
                          spacing={12}
                          name={name}
                          value={value}
                          onChange={onChange}
                          onBlur={onBlur}
                          ref={ref}
                        >
                          <Radio value="1">Thêm tiền vào thẻ</Radio>
                          <Radio value="-1">Chi tiền từ thẻ</Radio>
                        </RadioGroup>
                        {errors?.value && (
                          <FormHelperText color={"red.500"}>
                            {errors.value?.message}
                          </FormHelperText>
                        )}
                      </FormControl>
                    )}
                  />
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
                Tạo loại giao dịch
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
        {transactionTypes?.map((transactionType, index) => (
          <TransactionType transactionType={transactionType} key={index} />
        ))}
      </SimpleGrid>
    </Box>
  );
}
