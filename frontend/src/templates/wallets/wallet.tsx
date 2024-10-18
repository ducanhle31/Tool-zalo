"use client";

import { Wallet as TypeWallet } from "@/types/global";
import { updateStatusWallet } from "@/untils/methods/upWallets";
import { Link } from "@chakra-ui/next-js";
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
  Stack,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { CiLock } from "react-icons/ci";
import { GoDotFill } from "react-icons/go";
import { IoWallet } from "react-icons/io5";

interface CardWallet extends CardProps {
  wallet: TypeWallet;
  href?: string;
  edit?: boolean;
}

export const Wallet = (props: CardWallet) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const router = useRouter();

  const { wallet, href, children, edit = true, ...args } = props;

  const updateWalletMutation = useMutation({
    mutationFn: updateStatusWallet,
    onSuccess: async (res) => {
      const data = await res.json();
      if (data?.ok) {
        toast({
          title: "Thành công",
          description: "Đã khóa giao dịch với thẻ thành viên!",
          status: "success",
          position: "top-right",
        });
        onClose();
        router.push("/private/wallets/redirect");
      } else {
        toast({
          title: "Thất bại",
          description:
            "Không thể khóa giao dịch với thẻ thành viên!" + data?.error,
          status: "error",
          position: "top-right",
        });
        onClose();
      }
    },
    onError: (error) => {
      console.log(error);
      toast({
        title: "Thất bại",
        description:
          "Không thể khóa giao dịch với thẻ thành viên!" + error?.message,
        status: "error",
        position: "top-right",
      });
      onClose();
    },
  });

  return (
    <Card
      {...args}
      px={"12px"}
      py={"12px"}
      as={Link}
      href={href || `/private/wallets/${wallet._id}`}
      rounded={"sm"}
      minW={"min-content"}
      pos={"relative"}
      opacity={wallet?.status !== "active" ? 0.5 : 1}
    >
      <HStack position="absolute" top="0" right="0">
        <Icon
          as={GoDotFill}
          color={wallet?.status === "active" ? "green" : "red"}
        />
      </HStack>

      <HStack position="absolute" bottom="0" right="0">
        {wallet?.status === "active" && edit && (
          <>
            <IconButton
              aria-label="trash"
              variant={"ghost"}
              icon={<CiLock />}
              colorScheme="red"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onOpen();
              }}
            />

            <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Khóa giao dịch</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  Bạn có chắc chắn muốn khóa giao dịch của thẻ. Từ thời điểm
                  khóa cho đến khi mở lại khách hàng và bạn không thể giao dịch
                  từ thẻ thành viên này?
                </ModalBody>

                <ModalFooter as={HStack} spacing={"12px"}>
                  <Button
                    rounded={"sm"}
                    colorScheme="red"
                    onClick={() =>
                      updateWalletMutation.mutate({
                        _id: wallet?._id,
                        status: "lock",
                      })
                    }
                  >
                    Khóa giao dịch
                  </Button>
                  <Button
                    rounded={"sm"}
                    variant={"outline"}
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
        )}
      </HStack>
      <HStack>
        <Box flex={1}>
          <Icon as={IoWallet} />
        </Box>
        <Stack flex={5}>
          <Heading minW={"min-content"} size={"sm"} isTruncated>
            {wallet?.customer?.name}
          </Heading>
          <HStack alignItems={"end"}>
            <Text fontSize={"xs"}>Số dư: </Text>
            <Text fontSize={"md"} color={"green.700"}>
              {"+" +
                wallet?.current_balance.toLocaleString("vi", {
                  style: "currency",
                  currency: "VND",
                })}
            </Text>
          </HStack>

          <HStack alignItems={"end"}>
            <Text fontSize={"xs"}>Mã thẻ: </Text>
            <Text fontSize={"xs"}>{wallet?._id.slice(-6)}</Text>
          </HStack>
        </Stack>
      </HStack>
    </Card>
  );
};
