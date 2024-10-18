"use client";

import { useCustomer } from "@/hooks/useCustomers";
import { CustomerForm } from "@/templates/customers/customer-form";
import { createWallet } from "@/untils/methods/upWallets";
import { Link } from "@chakra-ui/next-js";
import {
  Box,
  Button,
  Center,
  Heading,
  HStack,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { CiUnlock, CiWallet } from "react-icons/ci";
import { FaRegEye } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";

export default function CustomerDetail({ params }: { params: { id: string } }) {
  const { customer, isLoading } = useCustomer(params.id!);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const toast = useToast();
  const router = useRouter();

  const createWalletMutation = useMutation({
    mutationFn: createWallet,
    onSuccess: async (data) => {
      const res = await data.json();
      if (res?.ok) {
        toast({
          title: "Thành công",
          description: "Tạo thẻ thành viên thành công!",
          status: "success",
          position: "top-right",
        });
        onClose();
        router.push(`/private/wallets/${res?.result[0]?._id}`);
      } else {
        toast({
          title: "Thất bại",
          description: "Tạo thẻ thành viên thất bại!" + res?.error,
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

  if (isLoading)
    return (
      <Center height={"300px"}>
        <Spinner />
      </Center>
    );

  return (
    <Box color={"gray.600"}>
      <HStack py={"12px"} pb={"48px"}>
        <Link
          href={"/private/customers"}
          display={"flex"}
          alignItems={"center"}
        >
          <Icon as={IoIosArrowBack} w={"28px"} h={"28px"} />
        </Link>
        <Heading size={"md"}>Chi tiết khách hàng</Heading>
      </HStack>

      {customer?.wallet && customer?.wallet?.status === "active" && (
        <HStack pb={6}>
          <Button
            as={Link}
            colorScheme="teal"
            rounded={"sm"}
            leftIcon={<FaRegEye size={"24px"} />}
            href={`/private/wallets/${customer.wallet?._id}`}
          >
            Xem thẻ
          </Button>
        </HStack>
      )}

      {customer?.wallet && customer?.wallet?.status === "lock" && (
        <HStack pb={6}>
          <Button
            as={Link}
            colorScheme="teal"
            rounded={"sm"}
            leftIcon={<CiUnlock size={"24px"} />}
            href={`/private/wallets/${customer.wallet?._id}`}
          >
            Mở khóa thẻ
          </Button>
        </HStack>
      )}

      {!customer?.wallet && (
        <HStack pb={6}>
          <Button
            colorScheme="teal"
            rounded={"sm"}
            leftIcon={<CiWallet size={"24px"} />}
            onClick={onOpen}
          >
            Tạo thẻ thành viên
          </Button>
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent rounded={"sm"}>
              <ModalHeader>Tạo thẻ thành viên</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                Bạn chắc chắn muốn tạo thẻ thành viên cho khách hàng? <br />
                <br />
                <b>- Họ và tên: </b>
                {customer?.name}
                <br />
                <b>- Số điện thoại liên hệ: </b> {customer?.phone}
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
                <Button
                  colorScheme="teal"
                  rounded={"sm"}
                  onClick={() =>
                    createWalletMutation.mutate({
                      customer: customer?._id!,
                      status: "active",
                    })
                  }
                >
                  Tạo thẻ thành viên
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </HStack>
      )}

      {customer && (
        <Box maxW={"1000px"}>
          <CustomerForm customer={customer} />
        </Box>
      )}

      {!customer && (
        <Box maxW={"1000px"}>
          <Center>
            <Text>Không có khách hàng phù hợp!</Text>
          </Center>
        </Box>
      )}
    </Box>
  );
}
