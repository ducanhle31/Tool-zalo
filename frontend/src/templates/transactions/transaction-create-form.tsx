/* eslint-disable react/no-children-prop */
"use client";

import { useTransactionForms } from "@/hooks/useTransactionForms";
import { useTransactionTypes } from "@/hooks/useTransactionTypes";
import { TransactionPreview, Wallet } from "@/types/global";
import { createTransaction } from "@/untils/methods/upTransactions";
import { Link } from "@chakra-ui/next-js";
import {
  Button,
  chakra,
  FormControl,
  FormHelperText,
  FormLabel,
  GridItem,
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
  SimpleGrid,
  Stack,
  Text,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import CurrencyInput from "react-currency-input-field";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { CiWallet } from "react-icons/ci";
import { FaUserAlt } from "react-icons/fa";
import { GoNote } from "react-icons/go";
import { MdLocalPhone, MdOutlineDriveFileRenameOutline } from "react-icons/md";
import Select from "react-select";

const CFaUserAlt = chakra(FaUserAlt);

type Inputs = {
  title: string;
  note: string;
  transaction_type: { label: string; value: string };
  transaction_form: { label: string; value: string };
  value: string;
};

export const TransactionCreateForm = ({ wallet }: { wallet?: Wallet }) => {
  const { transactionForms } = useTransactionForms();
  const { transactionTypes } = useTransactionTypes();
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Inputs>();
  const toast = useToast();

  const [transactionForm, setTransactionForm] = useState<Inputs | null>(null);

  const createTransactionMutation = useMutation({
    mutationFn: createTransaction,
    onSuccess: async (data) => {
      const res = await data.json();
      if (res?.ok) {
        toast({
          title: "Thành công",
          description: "Giao dịch thành công!",
          status: "success",
          position: "top-right",
        });

        router.push(`/private/wallets/${wallet?._id}`);
      } else {
        toast({
          title: "Thất bại",
          description: "Giao dịch thất bại! " + res?.error,
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

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    const value = parseInt(data?.value?.replace(/[^\d]/g, ""), 10);

    if (value <= 0) {
      toast({
        title: "Thất bại",
        description: "Giá trị giao dịch phải lớn hơn 0!",
        status: "error",
        position: "top-right",
      });
      return;
    }

    setTransactionForm(data);
    onOpen();
  };

  const handleConfirmCreateTransaction = async (data: Inputs) => {
    const temp = transactionTypes?.find(
      (type) => type.name === data?.transaction_type?.label
    );

    const value = parseInt(data?.value?.replace(/[^\d]/g, ""), 10);

    if (
      (temp?.value === 1 || temp?.value === -1) &&
      typeof wallet?.current_balance !== "undefined" &&
      wallet?.current_balance >= 0
    ) {
      const transaction: Omit<
        TransactionPreview,
        "createdAt" | "updatedAt" | "_id" | "previous_balance" | "metadata"
      > & { wallet: string; customer: string; facility: string } = {
        title: data?.title,
        note: data?.note,
        transaction_type: data?.transaction_type.value,
        transaction_form: data?.transaction_form.value,
        value: value * temp?.value,
        wallet: wallet?._id!,
        facility: null,
        customer: wallet?.customer?._id!,
      } as any;

      transaction && createTransactionMutation.mutate(transaction);
    } else {
      toast({
        title: "Thất bại",
        description: "Số dư không đủ hoặc loại giao dịch chưa được thiết lập!",
        status: "error",
        position: "top-right",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={6}>
        <Stack>
          <SimpleGrid
            columns={{ base: 1, md: 3 }}
            spacing={6}
            backgroundColor="whiteAlpha.900"
          >
            <GridItem as={FormControl} colSpan={{ base: 1, lg: 3 }}>
              <FormControl>
                <FormLabel>Tiêu đề giao dịch</FormLabel>
                <InputGroup flexDir={"column"}>
                  <InputLeftElement
                    pointerEvents="none"
                    children={
                      <MdOutlineDriveFileRenameOutline color="gray.300" />
                    }
                  />
                  <Input
                    rounded={"sm"}
                    {...register("title", { required: true })}
                  />
                </InputGroup>
                {errors?.title && (
                  <FormHelperText color={"red.500"}>
                    Tiêu đề là bắt buộc!
                  </FormHelperText>
                )}
              </FormControl>
            </GridItem>

            <GridItem as={FormControl} colSpan={{ base: 1, lg: 3 }}>
              <FormControl>
                <FormLabel>Nội dung ghi chú</FormLabel>
                <InputGroup flexDir={"column"}>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<GoNote color="gray.300" />}
                  />
                  <Input
                    as={Textarea}
                    rounded={"sm"}
                    {...register("note", { required: true })}
                  />
                </InputGroup>
                {errors?.note && (
                  <FormHelperText color={"red.500"}>
                    Ghi chú là bắt buộc!
                  </FormHelperText>
                )}
              </FormControl>
            </GridItem>

            <GridItem as={FormControl} colSpan={{ lg: 3 }}>
              <Controller
                control={control}
                {...register("transaction_type", { required: true })}
                render={({
                  field: { onChange, onBlur, value, name, ref },
                  formState: { errors },
                }) => (
                  <FormControl
                    isInvalid={!!errors.transaction_type}
                    id="trans-type"
                  >
                    <FormLabel>Loại giao dịch</FormLabel>
                    <Select
                      options={transactionTypes?.map((item) => ({
                        label: item?.name,
                        value: item?._id,
                      }))}
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value}
                      name={name}
                      ref={ref}
                      placeholder="Ví dụ thanh toán liệu trình"
                    />

                    {errors?.transaction_type && (
                      <FormHelperText color={"red.500"}>
                        Loại giao dịch là bắt buộc!
                      </FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </GridItem>

            <GridItem as={FormControl}>
              <Controller
                control={control}
                {...register("transaction_form", { required: true })}
                render={({
                  field: { onChange, onBlur, value, name, ref },
                  formState: { errors },
                }) => (
                  <FormControl
                    isInvalid={!!errors.transaction_type}
                    id="trans-form"
                  >
                    <FormLabel>Phương thức thanh toán</FormLabel>
                    <Select
                      options={transactionForms?.map((item) => ({
                        label: item?.name,
                        value: item?._id,
                      }))}
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value}
                      name={name}
                      ref={ref}
                      placeholder="Ví dụ chuyển khoản ngân hàng"
                    />
                    {errors?.transaction_form && (
                      <FormHelperText color={"red.500"}>
                        Phương thức giao dịch là bắt buộc!
                      </FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </GridItem>

            <FormControl>
              <FormLabel>Số dư hiện tại</FormLabel>
              <Input
                readOnly
                color="green"
                as={CurrencyInput}
                prefix="+"
                suffix=" VNĐ"
                name="wallet-current-balance"
                value={wallet?.current_balance}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Giá trị giao dịch</FormLabel>
              <Input
                {...register("value", {
                  required: "Giá trị giao dịch là bắt buộc!",
                })}
                as={CurrencyInput}
                suffix=" VNĐ"
                color="red"
              />

              {errors?.value && (
                <FormHelperText color={"red.500"}>
                  {errors?.value?.message}
                </FormHelperText>
              )}
            </FormControl>

            <FormControl>
              <FormLabel>Họ tên khách hàng</FormLabel>
              <InputGroup flexDir={"column"}>
                <InputLeftElement
                  pointerEvents="none"
                  children={<CFaUserAlt color="gray.300" />}
                />
                <Input
                  rounded={"sm"}
                  name="wallet-customer-name"
                  value={wallet?.customer?.name}
                  readOnly
                />
              </InputGroup>
            </FormControl>
            <FormControl>
              <FormLabel>Số điện thoại</FormLabel>
              <InputGroup flexDir={"column"}>
                <InputLeftElement
                  pointerEvents="none"
                  color="gray.300"
                  children={<MdLocalPhone color="gray.300" />}
                />
                <Input
                  rounded={"sm"}
                  name="wallet-customer-phone"
                  value={wallet?.customer?.phone}
                  readOnly
                />
              </InputGroup>
            </FormControl>

            <FormControl>
              <FormLabel>Mã số thẻ thành viên</FormLabel>
              <InputGroup flexDir={"column"}>
                <InputLeftElement
                  pointerEvents="none"
                  color="gray.300"
                  children={<CiWallet color="gray.300" />}
                />
                <Input
                  rounded={"sm"}
                  name="wallet-customer-phone"
                  value={wallet?._id}
                  readOnly
                />
              </InputGroup>
            </FormControl>
          </SimpleGrid>
        </Stack>
      </Stack>

      <HStack justifyContent={"end"} mt={"24px"}>
        <Button
          rounded={"sm"}
          size={"lg"}
          variant="outline"
          mr={3}
          as={Link}
          href={"/private/transactions/create-transaction"}
        >
          Hủy
        </Button>

        <Button rounded={"sm"} size={"lg"} colorScheme="teal" type="submit">
          Tạo
        </Button>

        <Modal isOpen={isOpen} onClose={onClose} size={"xl"}>
          <ModalOverlay />
          <ModalContent rounded={"sm"}>
            <ModalHeader>Kiểm tra lại thông tin giao dịch</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {transactionForm && (
                <Stack spacing={3}>
                  <p>
                    <strong>Tiêu đề:</strong> {transactionForm.title}
                  </p>
                  <p>
                    <strong>Loại giao dịch:</strong>
                    {transactionForm.transaction_type.label}
                  </p>
                  <HStack>
                    <strong>Phương thức thanh toán:</strong>
                    <Text> {transactionForm.transaction_form.label}</Text>
                  </HStack>
                  <HStack>
                    <strong>Giá trị giao dịch:</strong>{" "}
                    <Text color={"red.500"}>{transactionForm.value}</Text>
                  </HStack>
                </Stack>
              )}
            </ModalBody>

            <ModalFooter>
              <Button
                rounded={"sm"}
                size={"lg"}
                colorScheme="gray"
                mr={3}
                onClick={onClose}
              >
                Hủy giao dịch
              </Button>
              <Button
                rounded={"sm"}
                size={"lg"}
                colorScheme="teal"
                onClick={() =>
                  transactionForm &&
                  handleConfirmCreateTransaction(transactionForm)
                }
              >
                Xác nhận
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </HStack>
    </form>
  );
};
