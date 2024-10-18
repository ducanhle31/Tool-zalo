/* eslint-disable react/no-children-prop */
"use client";

import { CustomerGroup } from "@/types/global";
import {
  createCustomerGroup,
  deleteCustomerGroup,
  updateCustomerGroup,
} from "@/untils/methods/upCustommerGroups";
import { Link } from "@chakra-ui/next-js";
import {
  Button,
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
  SimpleGrid,
  Stack,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { FaUserAlt } from "react-icons/fa";
import { IoIosLink } from "react-icons/io";
import { MdOutlineDescription } from "react-icons/md";

const CFaUserAlt = chakra(FaUserAlt);

type Inputs = {
  name: string;
  description: string;
  slug: string | null;
};

export const CustomerGroupForm = ({
  customerGroup,
}: {
  customerGroup?: CustomerGroup;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const toast = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Inputs>();

  const createCustomerGroupMutation = useMutation({
    mutationFn: createCustomerGroup,
    onSuccess: async (data) => {
      const res = await data.json();
      if (res?.ok) {
        toast({
          title: "Thành công",
          description: "Tạo nhóm khách hàng thành công!",
          status: "success",
          position: "top-right",
        });
      } else {
        toast({
          title: "Thất bại",
          description: "Tạo nhóm khách hàng thất bại!",
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

  const updateCustomerGroupMutation = useMutation({
    mutationFn: updateCustomerGroup,
    onSuccess: async (data) => {
      const res = await data.json();
      if (res?.ok) {
        toast({
          title: "Thành công",
          description: "Cập nhật nhóm khách hàng thành công!",
          status: "success",
          position: "top-right",
        });
      } else {
        toast({
          title: "Thất bại",
          description: "Cập nhật nhóm khách hàng thất bại!",
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

  const deleteCustomerGroupMutation = useMutation({
    mutationFn: deleteCustomerGroup,
    onSuccess: async (data) => {
      const res = await data.json();
      if (res?.ok) {
        toast({
          title: "Thành công",
          description: "Đã xóa dữ liệu nhóm khách hàng!",
          status: "success",
          position: "top-right",
        });

        router.push("/private/customer-groups");
      } else {
        toast({
          title: "Thất bại",
          description: "Không thể xóa dữ liệu nhóm khách hàng!",
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

  const onSubmit: SubmitHandler<Inputs> = async (data, event) => {
    const submitter = (event?.nativeEvent as SubmitEvent)
      .submitter as HTMLButtonElement;
    const buttonName = submitter?.name;

    if (!data) return;

    const currentCustomerGroup: Omit<CustomerGroup, "createdAt" | "updatedAt"> =
      {
        _id: customerGroup?._id!,
        name: data?.name,
        description: data?.description,
        slug: data?.slug || "",
        status: "active",
        count: 0,
      };

    buttonName === "create" &&
      createCustomerGroupMutation.mutate(currentCustomerGroup);

    buttonName === "update" &&
      updateCustomerGroupMutation.mutate(currentCustomerGroup);
  };

  useEffect(() => {
    if (customerGroup?.name) {
      setValue("name", customerGroup.name);
    }

    if (customerGroup?.slug) {
      setValue("slug", customerGroup.slug);
    }

    if (customerGroup?.description) {
      setValue("description", customerGroup.description);
    }
  }, [customerGroup, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={6}>
        <Stack spacing={"24px"}>
          <SimpleGrid
            columns={{ base: 1, md: 2 }}
            spacing={4}
            backgroundColor="whiteAlpha.900"
          >
            <FormControl>
              <FormLabel>Tên nhóm</FormLabel>
              <InputGroup flexDir={"column"}>
                <InputLeftElement
                  pointerEvents="none"
                  children={<CFaUserAlt color="gray.300" />}
                />
                <Input
                  rounded={"sm"}
                  {...register("name", { required: true })}
                  type="text"
                />
                {errors.name && (
                  <FormHelperText color="red.300">
                    Tên nhóm là bắt buộc
                  </FormHelperText>
                )}
              </InputGroup>
            </FormControl>
            <FormControl>
              <FormLabel>Đường dẫn</FormLabel>
              <InputGroup flexDir={"column"}>
                <InputLeftElement
                  pointerEvents="none"
                  color="gray.300"
                  children={<IoIosLink color="gray.300" />}
                />
                <Input
                  rounded={"sm"}
                  {...register("slug", { required: true })}
                  placeholder="/duong-dan-cua-nhom"
                />
                {errors.slug && (
                  <FormHelperText color="red.300">
                    Đường dẫn là bắt buộc
                  </FormHelperText>
                )}
              </InputGroup>
            </FormControl>
          </SimpleGrid>
          <FormControl>
            <FormLabel>Mô tả nhóm</FormLabel>
            <InputGroup flexDir={"column"}>
              <InputLeftElement
                pointerEvents="none"
                color="gray.300"
                children={<MdOutlineDescription color="gray.300" />}
              />
              <Input
                as={Textarea}
                rounded={"sm"}
                {...register("description", { required: true })}
                placeholder="Nhập mô tả của nhóm"
              />
              {errors.description && (
                <FormHelperText color="red.300">
                  Mô tả là bắt buộc
                </FormHelperText>
              )}
            </InputGroup>
          </FormControl>

          {customerGroup && (
            <FormControl>
              <FormLabel>_id</FormLabel>
              <Input readOnly rounded={"sm"} value={customerGroup?._id} />
            </FormControl>
          )}
        </Stack>
      </Stack>

      <HStack justifyContent={"end"} mt={"24px"}>
        <Button
          rounded={"sm"}
          size={"lg"}
          variant="outline"
          mr={3}
          as={Link}
          href={"/private/customer-groups"}
        >
          Hủy
        </Button>
        {customerGroup && (
          <>
            <>
              <Button
                rounded={"sm"}
                size={"lg"}
                colorScheme="red"
                type="submit"
                onClick={onOpen}
              >
                Xóa
              </Button>
              <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>Xóa khách hàng</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                    Toàn bộ dữ liệu của khách hàng sẽ bị xóa. Hành động này sẽ
                    không thể khôi phục?
                  </ModalBody>

                  <ModalFooter as={HStack} spacing={"12px"}>
                    <Button
                      rounded={"sm"}
                      colorScheme="red"
                      onClick={() =>
                        deleteCustomerGroupMutation.mutate(customerGroup._id)
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
            <Button
              rounded={"sm"}
              size={"lg"}
              name="update"
              colorScheme="teal"
              type="submit"
            >
              Lưu
            </Button>
          </>
        )}
        {!customerGroup && (
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
