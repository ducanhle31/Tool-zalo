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
  Button,
  chakra,
  FormControl,
  FormHelperText,
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
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { FaMapMarkerAlt, FaUserAlt } from "react-icons/fa";
import { MdLocalPhone, MdOutlineEmail } from "react-icons/md";
import Select from "react-select";

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

export const CustomerForm = ({ customer }: { customer?: Customer }) => {
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

        res.result &&
          res.result[0] &&
          router.push(`/private/customers/${res.result[0]?._id}`);
      } else {
        toast({
          title: "Thất bại",
          description: "Tạo khách hàng thất bại! " + res?.error,
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

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={6}>
        <Stack>
          <Heading size={"sm"}>Chung</Heading>
          <SimpleGrid
            columns={{ base: 1, md: 2 }}
            spacing={4}
            backgroundColor="whiteAlpha.900"
          >
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
            <FormControl>
              <InputGroup flexDir={"column"}>
                <InputLeftElement
                  pointerEvents="none"
                  color="gray.300"
                  children={<MdLocalPhone color="gray.300" />}
                />
                <Input
                  rounded={"sm"}
                  {...register("phone", { required: true })}
                  placeholder="Số Zalo"
                />
                {errors.phone && (
                  <FormHelperText color="red.300">
                    Số điện thoại là bắt buộc!
                  </FormHelperText>
                )}
              </InputGroup>
            </FormControl>
          </SimpleGrid>
          <HStack spacing={4} backgroundColor="whiteAlpha.900" mt={2}>
            <Controller
              control={control}
              {...register("gender", { required: true })}
              render={({
                field: { value, onChange, onBlur, ref, name },
                formState: { errors },
              }) => (
                <FormControl>
                  <RadioGroup
                    as={HStack}
                    spacing={12}
                    name={name}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    ref={ref}
                  >
                    <Radio value="male">Nam</Radio>
                    <Radio value="female">Nữ </Radio>
                  </RadioGroup>
                  {errors.gender && (
                    <FormHelperText color="red.300">
                      Giới tính là bắt buộc
                    </FormHelperText>
                  )}
                </FormControl>
              )}
            />
          </HStack>
        </Stack>

        <Stack>
          <Heading size={"sm"}>Chọn cơ sở</Heading>
          <HStack spacing={4} backgroundColor="whiteAlpha.900">
            <Controller
              control={control}
              {...register("facilities", { required: true })}
              render={({
                field: { onChange, onBlur, value, name, ref },
                formState: { errors },
              }) => (
                <FormControl
                  isInvalid={!!errors.facilities}
                  id="cus-facilities"
                >
                  <Select
                    options={facilities?.map((facility) => ({
                      label: facility?.name,
                      value: facility?._id,
                    }))}
                    onChange={onChange}
                    isMulti={true}
                    onBlur={onBlur}
                    value={value}
                    name={name}
                    ref={ref}
                    placeholder="Cơ sở"
                  />
                  {errors.facilities && (
                    <FormHelperText color="red.300">
                      Cơ sở là bắt buộc!
                    </FormHelperText>
                  )}
                </FormControl>
              )}
            />
          </HStack>
        </Stack>

        <Stack>
          <Heading size={"sm"}>Địa chỉ</Heading>
          <SimpleGrid
            columns={{ base: 1, md: 2, lg: 3 }}
            spacing={4}
            backgroundColor="whiteAlpha.900"
          >
            <Controller
              control={control}
              {...register("addressProvince", { required: true })}
              render={({
                field: { onChange, onBlur, value, name, ref },
                formState: { errors },
              }) => (
                <FormControl
                  isInvalid={!!errors.addressProvince}
                  id="cus-addressProvince"
                >
                  <Select
                    options={data.map((item: any) => ({
                      label: item.name,
                      value: item.name,
                      ...(typeof item === "object" ? item : {}),
                    }))}
                    onChange={(province) => {
                      setCurrentProvince(province);
                      setCurrentDistrict(null);
                      setValue("addressDistrict", null);
                      setValue("addressTown", null);
                      setValue("addressDetail", null);
                      onChange(province);
                    }}
                    onBlur={onBlur}
                    value={value}
                    name={name}
                    ref={ref}
                    placeholder="Tỉnh / Thành phố"
                  />
                  {errors.addressProvince && (
                    <FormHelperText color="red.300">
                      Tỉnh / Thành phố là bắt buộc!
                    </FormHelperText>
                  )}
                </FormControl>
              )}
            />
            <Controller
              control={control}
              {...register("addressDistrict", { required: true })}
              render={({
                field: { onChange, onBlur, value, name, ref },
                formState: { errors },
              }) => (
                <FormControl
                  isInvalid={!!errors.addressDistrict}
                  id="cus-addressDistrict"
                >
                  <Select
                    isDisabled={!currentProvince}
                    options={districts?.map((item: any) => ({
                      label: item.name,
                      value: item.name,
                      ...(typeof item === "object" ? item : {}),
                    }))}
                    onChange={(districts) => {
                      setCurrentDistrict(districts);
                      onChange(districts);
                    }}
                    onBlur={onBlur}
                    value={value}
                    name={name}
                    ref={ref}
                    placeholder="Quận / Huyện"
                  />
                  {errors.addressDistrict && (
                    <FormHelperText color="red.300">
                      Quận / Huyện là bắt buộc!
                    </FormHelperText>
                  )}
                </FormControl>
              )}
            />
            <Controller
              control={control}
              {...register("addressTown")}
              render={({
                field: { onChange, onBlur, value, name, ref },
                formState: { errors },
              }) => (
                <FormControl
                  isInvalid={!!errors.addressTown}
                  id="cus-addressTown"
                >
                  <Select
                    isDisabled={!currentDistrict}
                    options={towns?.map((item: any) => ({
                      label: item.name,
                      value: item.name,
                      ...(typeof item === "object" ? item : {}),
                    }))}
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                    name={name}
                    ref={ref}
                    placeholder="Xã / Phường"
                  />
                </FormControl>
              )}
            />
          </SimpleGrid>
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

        <Stack>
          <Heading size={"sm"}>Email</Heading>
          <HStack spacing={4} backgroundColor="whiteAlpha.900">
            <FormControl>
              <InputGroup flexDir={"column"}>
                <InputLeftElement
                  pointerEvents="none"
                  children={<CFaEmail color="gray.300" />}
                />
                <Input
                  {...register("email")}
                  type="text"
                  placeholder="Nhập Email"
                />
                {errors.email && (
                  <FormHelperText color="red.300">
                    Email là bắt buộc!
                  </FormHelperText>
                )}
              </InputGroup>
            </FormControl>
          </HStack>
        </Stack>

        <Stack>
          <Heading size={"sm"}>Ngày sinh</Heading>
          <SimpleGrid
            columns={{ base: 1, md: 2, lg: 3 }}
            spacing={4}
            backgroundColor="whiteAlpha.900"
          >
            <Controller
              control={control}
              {...register("birthYear", { required: true })}
              render={({
                field: { onChange, onBlur, value, name, ref },
                formState: { errors },
              }) => (
                <FormControl isInvalid={!!errors.facilities} id="cus-birthYear">
                  <Select
                    options={years?.map((item: number) => ({
                      label: "Năm " + String(item),
                      value: String(item),
                    }))}
                    onChange={(year) => {
                      year && setSelectedYear(year.value);
                      setSelectedMonth(null);
                      setValue("birthMonth", null);
                      setValue("birthDay", null);
                      onChange(year);
                    }}
                    onBlur={onBlur}
                    value={value}
                    name={name}
                    ref={ref}
                    placeholder="Năm sinh"
                  />

                  {errors.birthYear && (
                    <FormHelperText color="red.300">
                      Năm sinh là bắt buộc!
                    </FormHelperText>
                  )}
                </FormControl>
              )}
            />
            <Controller
              control={control}
              {...register("birthMonth", { required: true })}
              render={({
                field: { onChange, onBlur, value, name, ref },
                formState: { errors },
              }) => (
                <FormControl
                  isInvalid={!!errors.facilities}
                  id="cus-birthMonth"
                >
                  <Select
                    isDisabled={!selectedYear}
                    options={months?.map((item: number) => ({
                      label: "Tháng " + String(item),
                      value: String(item),
                    }))}
                    onChange={(month) => {
                      month && setSelectedMonth(month.value);
                      onChange(month);
                    }}
                    onBlur={onBlur}
                    value={value}
                    name={name}
                    ref={ref}
                    placeholder="Tháng"
                  />
                </FormControl>
              )}
            />
            <Controller
              control={control}
              {...register("birthDay", { required: true })}
              render={({
                field: { onChange, onBlur, value, name, ref },
                formState: { errors },
              }) => (
                <FormControl isInvalid={!!errors.birthDay} id="cus-facilities">
                  <Select
                    isDisabled={!selectedMonth}
                    options={daysInMonth?.map((item: number) => ({
                      label: "Ngày " + String(item),
                      value: String(item),
                    }))}
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                    name={name}
                    ref={ref}
                    placeholder="Ngày sinh"
                  />
                </FormControl>
              )}
            />
          </SimpleGrid>
        </Stack>

        <Stack>
          <Heading size={"sm"}>Nhóm khách hàng</Heading>
          <HStack spacing={4} backgroundColor="whiteAlpha.900">
            <Controller
              control={control}
              {...register("groups")}
              render={({
                field: { onChange, onBlur, value, name, ref },
                formState: { errors },
              }) => (
                <FormControl isInvalid={!!errors.groups} id="cus-groups">
                  <Select
                    options={customerGroups?.map((customerGroup) => ({
                      label: customerGroup?.name,
                      value: customerGroup?._id,
                    }))}
                    onChange={onChange}
                    isMulti={true}
                    onBlur={onBlur}
                    value={value}
                    name={name}
                    ref={ref}
                    placeholder="Nhóm khách hàng"
                  />
                </FormControl>
              )}
            />
          </HStack>
        </Stack>
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
