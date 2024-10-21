/* eslint-disable react/no-children-prop */
"use client";

import { RequestUserInfo } from "@/types/global";
import {
  createRequestUserInfo,
  deleteRequestUserInfo,
  updateRequestUserInfo,
} from "@/untils/methods/upRequestUserInfo";

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
  title: string;
  subtitle: string;
  image_url: string | null;
};

export const RequestUserInfoForm = ({
  RequestUserInfo,
}: {
  RequestUserInfo?: RequestUserInfo;
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

  const createRequestUserInfoMutation = useMutation({
    mutationFn: createRequestUserInfo,
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

  const updateRequestUserInfoMutation = useMutation({
    mutationFn: updateRequestUserInfo,
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

  const deleteRequestUserInfoMutation = useMutation({
    mutationFn: deleteRequestUserInfo,
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

    const currentRequestUserInfo: Omit<
      RequestUserInfo,
      "createdAt" | "updatedAt"
    > = {
      _id: RequestUserInfo?._id!,
      title: data?.title,
      subtitle: data?.subtitle,
      image_url: data?.image_url || "",
      status: "active",
    };

    buttonName === "create" &&
      createRequestUserInfoMutation.mutate(currentRequestUserInfo);

    buttonName === "update" &&
      updateRequestUserInfoMutation.mutate(currentRequestUserInfo);
  };

  useEffect(() => {
    if (RequestUserInfo?.title) {
      setValue("title", RequestUserInfo.title);
    }

    if (RequestUserInfo?.subtitle) {
      setValue("subtitle", RequestUserInfo.subtitle);
    }

    if (RequestUserInfo?.image_url) {
      setValue("image_url", RequestUserInfo.image_url);
    }
  }, [RequestUserInfo, setValue]);

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
              <FormLabel>Tên mẫu</FormLabel>
              <InputGroup flexDir={"column"}>
                <InputLeftElement
                  pointerEvents="none"
                  children={<CFaUserAlt color="gray.300" />}
                />
                <Input
                  rounded={"sm"}
                  {...register("title", {
                    required: true,
                    maxLength: 100,
                  })}
                  type="text"
                  placeholder="Nhập tên mẫu"
                />
                {errors.title && errors.title.type === "required" && (
                  <FormHelperText color="red.300">
                    Tên mẫu là bắt buộc
                  </FormHelperText>
                )}
                {errors.title && errors.title.type === "maxLength" && (
                  <FormHelperText color="red.300">
                    Tên mẫu không được vượt quá 100 ký tự
                  </FormHelperText>
                )}
              </InputGroup>
            </FormControl>
            <FormControl>
              <FormLabel>Đường dẫn ảnh</FormLabel>
              <InputGroup flexDir={"column"}>
                <InputLeftElement
                  pointerEvents="none"
                  color="gray.300"
                  children={<IoIosLink color="gray.300" />}
                />
                <Input
                  rounded={"sm"}
                  {...register("image_url", { required: true })}
                  placeholder="/duong-dan-cua-nhom"
                />
                {errors.image_url && (
                  <FormHelperText color="red.300">
                    Đường dẫn ảnh là bắt buộc
                  </FormHelperText>
                )}
              </InputGroup>
            </FormControl>
          </SimpleGrid>
          <FormControl>
            <FormLabel>Tiêu đề phụ</FormLabel>
            <InputGroup flexDir={"column"}>
              <InputLeftElement
                pointerEvents="none"
                color="gray.300"
                children={<MdOutlineDescription color="gray.300" />}
              />
              <Input
                as={Textarea}
                rounded={"sm"}
                {...register("subtitle", {
                  required: true,
                  maxLength: 500,
                })}
                placeholder="Nhập tiêu đề phụ"
              />
              {errors.subtitle && errors.subtitle.type === "required" && (
                <FormHelperText color="red.300">
                  Tiêu đề phụ là bắt buộc
                </FormHelperText>
              )}
              {errors.subtitle && errors.subtitle.type === "maxLength" && (
                <FormHelperText color="red.300">
                  Tiêu đề phụ không được vượt quá 500 ký tự
                </FormHelperText>
              )}
            </InputGroup>
          </FormControl>

          {RequestUserInfo && (
            <FormControl>
              <FormLabel>_id</FormLabel>
              <Input readOnly rounded={"sm"} value={RequestUserInfo?._id} />
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
        {RequestUserInfo && (
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
                        deleteRequestUserInfoMutation.mutate(
                          RequestUserInfo._id
                        )
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
        {!RequestUserInfo && (
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
