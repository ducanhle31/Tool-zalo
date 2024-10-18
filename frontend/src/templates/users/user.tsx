"use client";

import { UserPreview } from "@/types/global";
import { deleteUser, updateUser } from "@/untils/methods/upUsers";
import { Link } from "@chakra-ui/next-js";
import {
  Box,
  Button,
  Card,
  CardProps,
  Circle,
  Heading,
  HStack,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Portal,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { BsThreeDots } from "react-icons/bs";
import { CiLock } from "react-icons/ci";
import { FaEye, FaUser } from "react-icons/fa";

export interface CardUser extends CardProps {
  user: UserPreview;
  view?: boolean;
  edit?: boolean;
  href?: string;
}

export const User = (props: CardUser) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const router = useRouter();

  const { user, view = true, edit = true, href, children, ...args } = props;

  const deleleUserMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: async (res) => {
      const data = await res.json();
      if (data?.ok) {
        toast({
          title: "Thành công",
          description: "Đã xóa người dùng!",
          status: "success",
          position: "top-right",
        });
        onClose();
        router.push("/private/settings/users/redirect");
      } else {
        toast({
          title: "Thất bại",
          description: "Không thể xóa người dùng!" + data?.error,
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
        description: "Không thể xóa người dùng!" + error?.message,
        status: "error",
        position: "top-right",
      });
      onClose();
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: async (res) => {
      const data = await res.json();
      if (data?.ok) {
        toast({
          title: "Thành công",
          description: "Đã cập nhật người dùng!",
          status: "success",
          position: "top-right",
        });
        onClose();
      } else {
        toast({
          title: "Thất bại",
          description: "Không thể cập nhật người dùng!" + data?.error,
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
        description: "Không thể cập nhật người dùng!" + error?.message,
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
      as={Link}
      href={href || `/private/settings/users/${user._id}`}
      rounded={"sm"}
      shadow={"none"}
      border={"1px"}
      borderColor={"gray.200"}
      minW={"min-content"}
      pos={"relative"}
      _hover={{ transform: "translateY(-6px)" }}
      color={"teal.900"}
      opacity={user.status !== "active" ? 0.5 : 1}
      {...args}
    >
      <HStack
        position="absolute"
        top="0"
        right="0"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
      >
        {edit && (
          <>
            <Menu>
              <MenuButton
                as={IconButton}
                aria-label="Options"
                icon={<BsThreeDots />}
                variant="outline"
                bg={"transparent"}
                border={"none"}
                _hover={{ borderColor: "transparent" }}
                rounded={"sm"}
              />
              <Portal>
                <MenuList rounded={"sm"}>
                  {user?.status === "active" && (
                    <MenuItem
                      color="red.500"
                      icon={<CiLock />}
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        onOpen();
                      }}
                    >
                      Khóa tài khoản
                    </MenuItem>
                  )}
                  <MenuItem
                    icon={<FaEye />}
                    as={Link}
                    href={href || `/private/settings/users/${user._id}`}
                  >
                    Xem chi tiết
                  </MenuItem>
                </MenuList>
              </Portal>
            </Menu>

            <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Khóa tài khoản</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  Bạn có chắc chắn khóa tài khoản người dùng. Tài khoản này sẽ
                  không thể đăng nhập vào hệ thống?
                </ModalBody>

                <ModalFooter as={HStack} spacing={"12px"}>
                  <Button
                    rounded={"sm"}
                    colorScheme="red"
                    onClick={() =>
                      updateUserMutation.mutate({
                        _id: user?._id,
                        status: "lock",
                        name: user?.name,
                        user_name: user?.user_name,
                        password: user?.password,
                        facility: user?.facility,
                        token: null,
                      })
                    }
                  >
                    Khóa tài khoản
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
        <Box
          flex={1}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Circle p={3} border={"1px"} borderColor={"gray.300"}>
            <Icon as={FaUser} />
          </Circle>
        </Box>
        <Stack flex={5}>
          <Heading
            minW={"min-content"}
            size={{ base: "md", lg: "sm" }}
            isTruncated
            fontWeight={"500"}
          >
            {user?.name}
          </Heading>
          <HStack alignItems={"end"}>
            <Text fontSize={"xs"}>User name: </Text>
            <Text fontSize={"sm"} color={"green.500"}>
              <Text>{user?.user_name}</Text>
            </Text>
          </HStack>
        </Stack>
      </HStack>
    </Card>
  );
};
