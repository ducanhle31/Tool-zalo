"use client";

import { RequestUserInfo } from "@/types/global";
import { deleteCustomer } from "@/untils/methods/upCustommers";
import {
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
import { FaTrash } from "react-icons/fa";
import Moment from "react-moment";

export interface CardCustomer extends CardProps {
  customer: RequestUserInfo;
  view?: boolean;
  edit?: boolean;
  href?: string;
}

export const RequestUseInfoDetail = (props: CardCustomer) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const router = useRouter();

  const { customer, view = true, edit = true, href, children, ...args } = props;

  const deleleCustomerMutation = useMutation({
    mutationFn: deleteCustomer,
    onSuccess: async (res) => {
      const data = await res.json();
      if (data?.ok) {
        toast({
          title: "Thành công",
          description: "Đã xóa khách hàng!",
          status: "success",
          position: "top-right",
        });
        onClose();
        router.push("/private/customers/redirect");
      } else {
        toast({
          title: "Thất bại",
          description: "Không thể xóa khách hàng!" + data?.error,
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
        description: "Không thể xóa khách hàng!" + error?.message,
        status: "error",
        position: "top-right",
      });
      onClose();
    },
  });

  return (
    <Card
      px={"12px"}
      py={"12px"}
      rounded={"sm"}
      minW={"min-content"}
      pos={"relative"}
      {...args}
    >
      <HStack position="absolute" bottom="0" right="0">
        {edit && (
          <>
            <IconButton
              aria-label="trash"
              variant={"ghost"}
              icon={<FaTrash />}
              colorScheme="red"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onOpen();
              }}
            >
              <Icon as={FaTrash} w={"20px"} color="green.500" />
            </IconButton>
            <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Xóa mẫu</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  Bạn có chắc chắn xóa mẫu. Hành động này sẽ không thể khôi phục
                </ModalBody>

                <ModalFooter as={HStack} spacing={"12px"}>
                  <Button
                    rounded={"sm"}
                    colorScheme="red"
                    onClick={() =>
                      deleleCustomerMutation.mutate(customer?._id!)
                    }
                  >
                    Xóa
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
        <Stack>
          <Text fontSize={"xs"}>{customer?.image_url} </Text>
          <Heading minW={"min-content"} size={"sm"} isTruncated>
            {customer?.title}
          </Heading>
          <HStack alignItems={"end"}>
            <Text fontSize={"xs"}>Tạo: </Text>
            <Text fontSize={"xs"}>
              <Moment format="DD/MM/YYYY">{customer?.createdAt}</Moment>
            </Text>
          </HStack>
          <HStack alignItems={"end"}>
            <Text fontSize={"xs"}>Cập nhật lần cuối: </Text>
            <Text fontSize={"xs"}>
              <Moment format="DD/MM/YYYY">{customer?.updatedAt}</Moment>
            </Text>
          </HStack>
        </Stack>
      </HStack>
    </Card>
  );
};
