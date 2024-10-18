/* eslint-disable react/no-children-prop */
"use client";

import { useBirthday } from "@/hooks/useBirthday";
import { useCustomerGroups } from "@/hooks/useCustomerGroups";
import { useFacilities } from "@/hooks/useFacilities";
import { useVietnam } from "@/hooks/useVietnam";
import { Customer, CustomerPreview } from "@/types/global";
import data from "@/untils/data/vietnam.json";
import {
  createCustomer,
  deleteCustomer,
  updateCustomer,
} from "@/untils/methods/upCustommers";
import { Link } from "@chakra-ui/next-js";
import {
  Box,
  Button,
  chakra,
  Flex,
  FormControl,
  FormHelperText,
  GridItem,
  Heading,
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
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { FaMapMarkerAlt, FaUserAlt } from "react-icons/fa";
import { MdLocalPhone, MdOutlineEmail } from "react-icons/md";
import Select from "react-select";
import { ListTable } from "./template-forms/list-table";
import { ButtonActions } from "./template-forms/button-action";

const CFaUserAlt = chakra(FaUserAlt);
const CFaMapMarkerAlt = chakra(FaMapMarkerAlt);
const CFaEmail = chakra(MdOutlineEmail);

type Inputs = {
  email: string;
  phone: string;
  fullName: string;
  addressProvince: { label: string; value: string } | null;
  addressDistrict: { label: string; value: string } | null;
  addressTown: { label: string; value: string } | null;
  addressDetail: string | null;
  facilities: { label: string; value: string }[] | null;
  groups: { label: string; value: string }[] | null;
  birthDay: { label: string; value: string } | null;
  birthMonth: { label: string; value: string } | null;
  birthYear: { label: string; value: string } | null;
  gender: string;
};

interface OptionType {
  label: string;
  value: string;
}

export const TemplateForm = ({ customer }: { customer?: Customer }) => {
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

  const { customerGroups } = useCustomerGroups();
  const { facilities } = useFacilities();

  const createCustomerMutation = useMutation({
    mutationFn: createCustomer,
    onSuccess: async (data) => {
      const res = await data.json();
      if (res?.ok) {
        toast({
          title: "Thành công",
          description: "Tạo khách hàng thành công!",
          status: "success",
          position: "top-right",
        });
      } else {
        toast({
          title: "Thất bại",
          description: "Tạo khách hàng thất bại!",
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

  const updateCustomerMutation = useMutation({
    mutationFn: updateCustomer,
    onSuccess: async (data) => {
      const res = await data.json();
      if (res?.ok) {
        toast({
          title: "Thành công",
          description: "Cập nhật khách hàng thành công!",
          status: "success",
          position: "top-right",
        });
      } else {
        toast({
          title: "Thất bại",
          description: "Cập nhật khách hàng thất bại!",
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

  const deleteCustomerMutation = useMutation({
    mutationFn: deleteCustomer,
    onSuccess: async (data) => {
      const res = await data.json();
      if (res?.ok) {
        toast({
          title: "Thành công",
          description: "Đã xóa dữ liệu khách hàng!",
          status: "success",
          position: "top-right",
        });

        router.push("/private/customers");
      } else {
        toast({
          title: "Thất bại",
          description: "Không thể xóa dữ liệu khách hàng!",
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

    const currentCustomer: Omit<CustomerPreview, "createdAt" | "updatedAt"> = {
      _id: customer?._id,
      name: data?.fullName,
      phone: data?.phone,
      email: data?.email,
      birth: `${data?.birthMonth?.value}/${data?.birthDay?.value}/${data.birthYear?.value}`,
      address: {
        country: "Việt Nam",
        province: data?.addressProvince?.value!,
        district: data?.addressDistrict?.value!,
        town: data?.addressTown?.value!,
        free_note: data?.addressDetail!,
      },
      facilities: data?.facilities?.map((facility) => facility?.value) || null,
      customer_groups: data?.groups?.map((group) => group?.value) || null,
      gender: data?.gender!,
      is_follow_oa: false,
      wallet: null,
      user: null,
      status: "",
      metadata: { ...customer?.metadata },
    };

    buttonName === "create" && createCustomerMutation.mutate(currentCustomer);
    buttonName === "update" && updateCustomerMutation.mutate(currentCustomer);
  };

  const {
    currentProvince,
    setCurrentProvince,
    currentDistrict,
    setCurrentDistrict,
    districts,
    towns,
  } = useVietnam();

  const {
    selectedYear,
    setSelectedYear,
    selectedMonth,
    setSelectedMonth,
    years,
    months,
    daysInMonth,
  } = useBirthday();

  useEffect(() => {
    if (customer?.name) {
      setValue("fullName", customer.name);
    }

    if (customer?.email) {
      setValue("email", customer.email);
    }

    if (customer?.phone) {
      setValue("phone", customer.phone);
    }

    if (customer?.address?.free_note) {
      setValue("addressDetail", customer?.address?.free_note);
    }

    if (customer?.facilities?.length) {
      setValue(
        "facilities",
        customer?.facilities?.map((facility) => ({
          label: facility.name,
          value: facility?._id,
        })) || []
      );
    }

    if (customer?.customer_groups?.length) {
      setValue(
        "groups",
        customer?.customer_groups?.map((group) => ({
          label: group.name,
          value: group?._id,
        })) || []
      );
    }

    if (customer?.gender) {
      setValue("gender", customer?.gender);
    }

    if (customer?.address?.province) {
      setValue("addressProvince", {
        label: customer.address.province,
        value: customer.address.province,
      });
    }

    if (customer?.address?.district) {
      setValue("addressDistrict", {
        label: customer.address.district,
        value: customer.address.district,
      });
    }

    if (customer?.address?.town) {
      setValue("addressTown", {
        label: customer.address.town,
        value: customer.address.town,
      });
    }

    if (customer?.birth) {
      setValue("birthYear", {
        label: `Năm ${new Date(customer?.birth).getFullYear()}`,
        value: `${new Date(customer?.birth).getFullYear()}`,
      });
      setValue("birthMonth", {
        label: `Tháng ${new Date(customer?.birth).getMonth() + 1}`,
        value: `${new Date(customer?.birth).getMonth() + 1}`,
      });
      setValue("birthDay", {
        label: `Ngày ${new Date(customer?.birth).getDate()}`,
        value: `${new Date(customer?.birth).getDate()}`,
      });
    }
  }, [customer, setValue]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={6}>
        <Stack>
          <SimpleGrid
            columns={{ base: 1, md: 2 }}
            spacing={4}
            backgroundColor="whiteAlpha.900"
          >
            <Box>
              <Heading size={"sm"} mb={2}>
                Tên mẫu tin
              </Heading>
              <FormControl>
                <InputGroup flexDir={"column"}>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<CFaUserAlt color="gray.300" />}
                  />
                  <Input
                    rounded={"sm"}
                    {...register("fullName", { required: true })}
                    defaultValue={customer?.name!}
                    type="text"
                    placeholder={customer?.name!}
                  />
                  {errors.fullName && (
                    <FormHelperText color="red.300">
                      Tên là bắt buộc
                    </FormHelperText>
                  )}
                </InputGroup>
              </FormControl>
            </Box>
            <Box>
              <Heading size={"sm"} mb={2}>
                Chọn loại tin
              </Heading>
              <FormControl>
                <Controller
                  control={control}
                  {...register("gender", { required: true })}
                  render={({
                    field: { value, onChange, onBlur, ref, name },
                    formState: { errors },
                  }) => (
                    <FormControl>
                      <Select<OptionType>
                        options={[
                          { label: "Tin tư vấn", value: "tuvan" },
                          { label: "Tin giao dịch", value: "giaodich" },
                          { label: "Tin truyền thông", value: "truyenthong" },
                        ]}
                        onChange={onChange}
                        onBlur={onBlur}
                        value={value as unknown as OptionType}
                        name={name}
                        ref={ref}
                        placeholder="Chọn loại tin"
                      />
                      {errors.gender && (
                        <FormHelperText color="red.300">
                          Loại tin là bắt buộc
                        </FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </FormControl>
            </Box>
          </SimpleGrid>
        </Stack>
        <Stack>
          <Heading size="sm">Banner</Heading>
          <HStack spacing={4} backgroundColor="whiteAlpha.900">
            <Controller
              control={control}
              {...register("bannerImage", { required: true })}
              render={({
                field: { onChange, onBlur, value, name, ref },
                formState: { errors },
              }) => (
                <FormControl
                  isInvalid={!!errors?.bannerImage}
                  id="banner-image"
                >
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      handleImageChange(e);
                      onChange(e.target.files); // Passing the file data to react-hook-form
                    }}
                    onBlur={onBlur}
                    name={name}
                    ref={ref}
                    placeholder="Upload Image"
                  />
                  {errors?.bannerImage && (
                    <FormHelperText color="red.300">
                      Image upload is required!
                    </FormHelperText>
                  )}
                </FormControl>
              )}
            />
          </HStack>

          {selectedImage && (
            <Image
              src={selectedImage}
              alt="Selected Image Preview"
              width={500}
              height={500}
              objectFit="cover"
            />
          )}
        </Stack>
        <Stack>
          <Heading size={"sm"} mb={2}>
            Tiêu đề
          </Heading>
          <FormControl>
            <InputGroup flexDir={"column"}>
              <InputLeftElement
                pointerEvents="none"
                children={<CFaUserAlt color="gray.300" />}
              />
              <Input
                rounded={"sm"}
                {...register("fullName", { required: true })}
                defaultValue={customer?.name!}
                type="text"
                placeholder={customer?.name!}
              />
              {errors.fullName && (
                <FormHelperText color="red.300">
                  Tiêu đề là bắt buộc
                </FormHelperText>
              )}
            </InputGroup>
          </FormControl>
        </Stack>
        <Stack>
          <Heading size={"sm"} mb={2}>
            Nội dung chính
          </Heading>
          <FormControl>
            <InputGroup flexDir={"column"}>
              <InputLeftElement
                pointerEvents="none"
                children={<CFaUserAlt color="gray.300" />}
              />
              <Input
                rounded={"sm"}
                {...register("fullName", { required: true })}
                defaultValue={customer?.name!}
                type="text"
                placeholder={customer?.name!}
              />
              {errors.fullName && (
                <FormHelperText color="red.300">
                  Nội dung là bắt buộc
                </FormHelperText>
              )}
            </InputGroup>
          </FormControl>
        </Stack>

        <ListTable customer={customer} />

        <Stack>
          <Heading size={"sm"}>Nội dung phụ</Heading>

          <HStack spacing={4} backgroundColor="whiteAlpha.900" mt={2}>
            <FormControl>
              <InputGroup flexDir={"column"}>
                <InputLeftElement
                  pointerEvents="none"
                  children={<CFaMapMarkerAlt color="gray.300" />}
                />
                <Input
                  {...register("addressDetail")}
                  type="text"
                  placeholder="Tên đường, số nhà"
                />
              </InputGroup>
            </FormControl>
          </HStack>
        </Stack>

        <ButtonActions />
      </Stack>

      <HStack justifyContent={"end"} mt={"24px"}>
        <Button
          rounded={"sm"}
          size={"lg"}
          variant="outline"
          mr={3}
          as={Link}
          href={"/private/customers"}
        >
          Hủy
        </Button>
        {customer && (
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
                        deleteCustomerMutation.mutate(customer._id)
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
              colorScheme="teal"
              type="submit"
              name="update"
            >
              Lưu
            </Button>
          </>
        )}
        {!customer && (
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
