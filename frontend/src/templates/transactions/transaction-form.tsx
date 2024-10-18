/* eslint-disable react/no-children-prop */
"use client";

import { Transaction } from "@/types/global";
import { updateTransaction } from "@/untils/methods/upTransactions";
import { Link } from "@chakra-ui/next-js";
import {
  Button,
  chakra,
  FormControl,
  FormLabel,
  GridItem,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import CurrencyInput from "react-currency-input-field";
import { SubmitHandler, useForm } from "react-hook-form";
import { CiWallet } from "react-icons/ci";
import { FaUserAlt } from "react-icons/fa";
import { GoNote } from "react-icons/go";
import { MdLocalPhone, MdOutlineDriveFileRenameOutline } from "react-icons/md";

const CFaUserAlt = chakra(FaUserAlt);

export const TransactionForm = ({
  transaction,
}: {
  transaction?: Transaction;
}) => {
  const { register, setValue, handleSubmit } = useForm<{
    note: string;
    title: string;
  }>();

  const toast = useToast();

  const updateTransactionMutation = useMutation({
    mutationFn: updateTransaction,
    onSuccess: async (data) => {
      const res = await data.json();
      if (res?.ok) {
        toast({
          title: "Thành công",
          description: "Cập nhật thông tin giao dịch thành công!",
          status: "success",
          position: "top-right",
        });
      } else {
        toast({
          title: "Thất bại",
          description: "Cập nhật thông tin giao dịch thất bại! " + res?.error,
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

  const onSubmit: SubmitHandler<{
    note: string;
    title: string;
  }> = ({ note, title }, event) => {
    const submitter = (event?.nativeEvent as SubmitEvent)
      .submitter as HTMLButtonElement;
    const buttonName = submitter?.name;

    transaction?._id &&
      buttonName === "update" &&
      updateTransactionMutation.mutate({
        _id: transaction?._id,
        title,
        note,
      });
  };

  useEffect(() => {
    if (transaction?.title) {
      setValue("title", transaction?.title);
    }
    if (transaction?.note) {
      setValue("note", transaction?.note);
    }
  }, [transaction, setValue]);

  if (!transaction?.value)
    return <Text>Không tồn tại giao dịch có giá trị là 0 VNĐ</Text>;

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
              <FormLabel>Tiêu đề giao dịch</FormLabel>
              <InputGroup flexDir={"column"}>
                <InputLeftElement
                  pointerEvents="none"
                  children={
                    <MdOutlineDriveFileRenameOutline color="gray.300" />
                  }
                />
                <Input rounded={"sm"} {...register("title")} />
              </InputGroup>
            </GridItem>

            <GridItem as={FormControl} colSpan={{ base: 1, lg: 3 }}>
              <FormLabel>Nội dung ghi chú</FormLabel>
              <InputGroup flexDir={"column"}>
                <InputLeftElement
                  pointerEvents="none"
                  children={<GoNote color="gray.300" />}
                />
                <Input as={Textarea} rounded={"sm"} {...register("note")} />
              </InputGroup>
            </GridItem>

            <GridItem as={FormControl} colSpan={{ lg: 3 }}>
              <FormLabel>Loại giao dịch</FormLabel>
              <InputGroup flexDir={"column"}>
                <Input
                  rounded={"sm"}
                  readOnly
                  value={transaction?.transaction_type?.name}
                />
              </InputGroup>
            </GridItem>

            <GridItem as={FormControl}>
              <FormLabel>Phương thức thanh toán</FormLabel>
              <InputGroup flexDir={"column"}>
                <Input
                  rounded={"sm"}
                  readOnly
                  value={transaction?.transaction_form?.name}
                />
              </InputGroup>
            </GridItem>

            <FormControl>
              <FormLabel>Số dư trước đó</FormLabel>
              <Input
                readOnly
                as={CurrencyInput}
                prefix="+"
                suffix=" VNĐ"
                name="wallet-current-balance"
                value={transaction?.previous_balance}
              />
            </FormControl>

            {transaction?.value && (
              <FormControl>
                <FormLabel>Giá trị giao dịch</FormLabel>
                <Input
                  readOnly
                  as={CurrencyInput}
                  suffix=" VNĐ"
                  color="red"
                  name="wallet-current-balance"
                  value={transaction?.value}
                />
              </FormControl>
            )}

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
                  value={transaction?.customer?.name}
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
                  value={transaction?.customer?.phone}
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
                  value={transaction?.wallet?._id}
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
          href={"/private/wallets"}
        >
          Hủy
        </Button>
        {transaction && (
          <Button
            rounded={"sm"}
            size={"lg"}
            colorScheme="teal"
            type="submit"
            name="update"
          >
            Lưu
          </Button>
        )}
        {!transaction && (
          <Button
            rounded={"sm"}
            size={"lg"}
            colorScheme="teal"
            name="create"
            type="submit"
          >
            Tạo
          </Button>
        )}
      </HStack>
    </form>
  );
};
