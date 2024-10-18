/* eslint-disable react/no-children-prop */
"use client";


import { InputPassword } from "@/components/InputPassword";
import MySelect from "@/components/MySelect";
import { useFacilities } from "@/hooks/useFacilities";
import { useSessions } from "@/hooks/useSessions";
import { User, UserPreview } from "@/types/global";
import { createUser, deleteUser, updateUser } from "@/untils/methods/upUsers";
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
  Radio,
  RadioGroup,
  SimpleGrid,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { FaUserAlt } from "react-icons/fa";

const CFaUserAlt = chakra(FaUserAlt);

type Inputs = {
  fullName: string;
  userName: string;
  password: string;
  facility: { label: string; value: string };
  status?: string;
};

export const UserForm = ({ user }: { user?: User }) => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<Inputs>();
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const { facilities } = useFacilities();
  const { user: userLogin } = useSessions();

  const createUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: async (data) => {
      const res = await data.json();
      if (res?.ok) {
        toast({
          title: "Thành công",
          description: "Tạo người dùng thành công!",
          status: "success",
          position: "top-right",
        });

        res.result && router.push(`/private/settings/users/${res.result?._id}`);
      } else {
        toast({
          title: "Thất bại",
          description: "Tạo người dùng thất bại! " + res?.error,
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

  const updateUserMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: async (data) => {
      const res = await data.json();
      if (res?.ok) {
        toast({
          title: "Thành công",
          description: "Cập nhật người dùng thành công!",
          status: "success",
          position: "top-right",
        });
      } else {
        toast({
          title: "Thất bại",
          description: "Cập nhật người dùng thất bại!",
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

  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: async (data) => {
      const res = await data.json();
      if (res?.ok) {
        toast({
          title: "Thành công",
          description: "Đã xóa dữ liệu người dùng!",
          status: "success",
          position: "top-right",
        });

        router.push("/private/settings/users");
      } else {
        toast({
          title: "Thất bại",
          description: "Không thể xóa dữ liệu người dùng!",
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

    const currentUser: Omit<UserPreview, "createdAt" | "updatedAt"> = {
      _id: user?._id!,
      name: data?.fullName,
      facility: data?.facility?.value || null,
      status: data?.status || "active",
      user_name: data?.userName,
      password: data?.password,
      token: null,
    };

    buttonName === "create" && createUserMutation.mutate(currentUser);
    buttonName === "update" && updateUserMutation.mutate(currentUser);
  };

  useEffect(() => {
    if (user?.name) {
      setValue("fullName", user.name);
    }

    if (user?.user_name) {
      setValue("userName", user.user_name);
    }

    if (user?.password) {
      setValue("password", user.password);
    }

    if (user?.facility) {
      setValue("facility", {
        label: user?.facility?.name,
        value: user?.facility?._id,
      });
    }

    if (user?.status) {
      setValue("status", user?.status);
    }
  }, [user, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={6}>
        <SimpleGrid
          columns={{ base: 1, md: 2 }}
          spacing={4}
          backgroundColor="whiteAlpha.900"
        >
          <FormControl>
            <FormLabel>Họ tên</FormLabel>
            <InputGroup flexDir={"column"}>
              <InputLeftElement
                pointerEvents="none"
                children={<CFaUserAlt color="gray.300" />}
              />
              <Input
                rounded={"sm"}
                {...register("fullName", { required: true })}
                defaultValue={user?.name!}
                type="text"
                placeholder={user?.name!}
              />
              {errors.fullName && (
                <FormHelperText color="red.300">Tên là bắt buộc</FormHelperText>
              )}
            </InputGroup>
          </FormControl>

          <Stack>
            <Text size={"md"} fontWeight={500}>
              Chọn nguồn
            </Text>
            <HStack spacing={4} backgroundColor="whiteAlpha.900">
              <Controller
                control={control}
                {...register("facility", { required: "Nguồn là bắt buộc!" })}
                render={({
                  field: { onChange, onBlur, value, name },
                  formState: { errors },
                }) => (
                  <FormControl isInvalid={!!errors.facility} id="user-facility">
                    <MySelect
                      options={facilities?.map((facility) => ({
                        label: facility?.name,
                        value: facility?._id,
                      }))}
                      onChange={onChange}
                      isMulti={false}
                      onBlur={onBlur}
                      value={value}
                      name={name}
                      placeholder="Nguồn"
                    />
                    {errors?.facility && (
                      <FormHelperText color="red.300">
                        {errors.facility.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </HStack>
          </Stack>
        </SimpleGrid>

        <SimpleGrid
          columns={{ base: 1, md: 2 }}
          spacing={4}
          backgroundColor="whiteAlpha.900"
        >
          <FormControl>
            <FormLabel>Tên đăng nhập</FormLabel>
            <InputGroup flexDir={"column"}>
              <InputLeftElement
                pointerEvents="none"
                color="gray.300"
                children={<CFaUserAlt color="gray.300" />}
              />
              <Input
                type="number"
                rounded={"sm"}
                {...register("userName", {
                  required: "Số điện thoại là bắt buộc!",
                  pattern: {
                    value: /^(0[2|3|5|7|8|9])+([0-9]{8})$/, // Regex cho số điện thoại Việt Nam
                    message: "Tên đăng nhập phải là số điện thoại hợp lệ!",
                  },
                })}
                placeholder="Tên đăng nhập"
              />
              {errors.userName && (
                <FormHelperText color="red.300">
                  {errors.userName?.message}
                </FormHelperText>
              )}
            </InputGroup>
          </FormControl>
          <FormControl>
            <FormLabel>Mật khẩu</FormLabel>
            <InputPassword
              rounded={"sm"}
              {...register("password", {
                required: "Mật khẩu là bắt buộc!",
                minLength: {
                  value: 6,
                  message: "Mật khẩu phải có số ký tự lơn hơn 6",
                },
              })}
              placeholder="Mật khẩu"
            />
            {errors.password && (
              <FormHelperText color="red.300">
                {errors.password?.message}
              </FormHelperText>
            )}
          </FormControl>
        </SimpleGrid>

        {user && userLogin?._id !== user?._id && (
          <Controller
            control={control}
            {...register("status")}
            render={({
              field: { value, onChange, onBlur, ref, name },
              formState: { errors },
            }) => (
              <FormControl>
                <FormLabel>Trạng thái hoạt động</FormLabel>
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
                    Khóa tài khoản{" "}
                  </Radio>
                </RadioGroup>
              </FormControl>
            )}
          />
        )}
      </Stack>

      <HStack justifyContent={"end"} mt={"24px"}>
        <Button
          rounded={"sm"}
          size={"lg"}
          variant="outline"
          mr={3}
          as={Link}
          href={"/private/settings/users"}
        >
          Hủy
        </Button>
        {user && (
          <>
            <>
              <Button
                rounded={"sm"}
                size={"lg"}
                colorScheme="red"
                name="delete"
                onClick={onOpen}
              >
                Xóa
              </Button>

              <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>Xóa người dùng</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                    Toàn bộ dữ liệu của người dùng sẽ bị xóa. Hành động này sẽ
                    không thể khôi phục?
                  </ModalBody>

                  <ModalFooter as={HStack} spacing={"12px"}>
                    <Button
                      rounded={"sm"}
                      colorScheme="red"
                      onClick={() => deleteUserMutation.mutate(user._id)}
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
              colorScheme="teal"
              type="submit"
              name="update"
            >
              Lưu
            </Button>
          </>
        )}
        {!user && (
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
