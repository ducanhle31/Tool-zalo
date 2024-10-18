/* eslint-disable react/no-children-prop */
"use client";

import { Wallet } from "@/types/global";
import { updateStatusWallet } from "@/untils/methods/upWallets";
import { Link } from "@chakra-ui/next-js";
import {
  Button,
  chakra,
  FormControl,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Radio,
  RadioGroup,
  SimpleGrid,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import CurrencyInput from "react-currency-input-field";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { FaUserAlt } from "react-icons/fa";
import { MdLocalPhone } from "react-icons/md";
import Moment from "react-moment";

const CFaUserAlt = chakra(FaUserAlt);

export const WalletForm = ({ wallet }: { wallet?: Wallet }) => {
  const { register, control, setValue, handleSubmit } = useForm<{
    status: string;
  }>();
  const toast = useToast();
  const router = useRouter();

  const updateStatusWalletMutation = useMutation({
    mutationFn: updateStatusWallet,
    onSuccess: async (data) => {
      const res = await data.json();
      if (res?.ok) {
        toast({
          title: "Thành công",
          description: "Cập nhật tình trạng thẻ thành viên thành công!",
          status: "success",
          position: "top-right",
        });
        router.push(`/private/wallets/redirect?id=${wallet?._id}`);
      } else {
        toast({
          title: "Thất bại",
          description: "Cập nhật tình trạng thẻ thành viên thất bại!",
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

  const onSubmit: SubmitHandler<{ status: string }> = ({ status }, event) => {
    const submitter = (event?.nativeEvent as SubmitEvent)
      .submitter as HTMLButtonElement;
    const buttonName = submitter?.name;

    wallet?._id &&
      buttonName === "update" &&
      updateStatusWalletMutation.mutate({
        status,
        _id: wallet._id,
      });
  };

  useEffect(() => {
    if (wallet?.status) {
      setValue("status", wallet?.status || "active");
    }
  }, [wallet, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={6}>
        <Stack>
          <SimpleGrid
            columns={{ base: 1, md: 2 }}
            spacing={6}
            backgroundColor="whiteAlpha.900"
          >
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
              <FormLabel>Số dư hiện tại</FormLabel>
              <Input
                readOnly
                as={CurrencyInput}
                prefix="+"
                suffix=" VNĐ"
                name="wallet-current-balance"
                value={wallet?.current_balance}
              />
            </FormControl>

            {wallet && (
              <>
                <FormControl>
                  <FormLabel>Mã thẻ</FormLabel>
                  <Input readOnly value={wallet?._id?.slice(-6)} />
                </FormControl>

                <FormControl>
                  <FormLabel>Ngày tạo</FormLabel>
                  <Moment format="DD/MM/YYYY">{wallet?.createdAt}</Moment>
                </FormControl>
              </>
            )}

            <Controller
              control={control}
              {...register("status", { required: true })}
              render={({
                field: { value, onChange, onBlur, ref, name },
                formState: { errors },
              }) => (
                <FormControl>
                  <FormLabel>Tình trạng</FormLabel>
                  <RadioGroup
                    as={HStack}
                    spacing={12}
                    name={name}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    ref={ref}
                  >
                    <Radio value="active" colorScheme="green">
                      Hoạt động
                    </Radio>
                    <Radio value="lock" colorScheme="red">
                      Khóa
                    </Radio>
                  </RadioGroup>
                </FormControl>
              )}
            />
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
        {wallet && (
          <>
            <Button
              rounded={"sm"}
              size={"lg"}
              colorScheme="teal"
              type="submit"
              name="update"
            >
              Lưu
            </Button>
          </>
        )}
        {!wallet && (
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
