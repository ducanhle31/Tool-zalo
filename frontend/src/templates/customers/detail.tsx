/* eslint-disable react/no-children-prop */
"use client";

import { useBirthday } from "@/hooks/useBirthday";
import { useVietnam } from "@/hooks/useVietnam";
import data from "@/untils/data/vietnam.json";
import {
  Button,
  chakra,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  FormControl,
  FormHelperText,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  MenuItem,
  Radio,
  RadioGroup,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import { useRef } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { FaMapMarkerAlt, FaUserAlt } from "react-icons/fa";
import { MdLocalPhone, MdOutlineEmail } from "react-icons/md";
import Select from "react-select";

const CFaUserAlt = chakra(FaUserAlt);
const CFaMapMarkerAlt = chakra(FaMapMarkerAlt);
const CFaEmail = chakra(MdOutlineEmail);

type Inputs = {
  userName: string;
  password: string;
  email: string;
  phone: string;
  fullName: string;
  addressProvince: { label: string; value: string } | null;
  addressDistrict: { label: string; value: string } | null;
  addressTown: { label: string; value: string } | null;
  addressDetail: string | null;
  facilities: { label: string; value: string }[] | null;
  characteristics: { label: string; value: string }[] | null;
  birthDay: { label: string; value: string } | null;
  birthMonth: { label: string; value: string } | null;
  birthYear: { label: string; value: string } | null;
  gender: string;
};

export const CustomerDetail = ({ customer }: { customer: any }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    console.log(data);
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

  return (
    <>
      <MenuItem rounded={"sm"} ref={btnRef as never} onClick={onOpen}>
        Xem chi tiết
      </MenuItem>
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef as never}
        size={"lg"}
      >
        <DrawerOverlay />
        <DrawerContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <DrawerCloseButton />
            <DrawerHeader pb={12}>
              <Heading size={"lg"}>Thông tin khách hàng</Heading>
            </DrawerHeader>

            <DrawerBody h={"calc(100vh - 200px)"} overflowY={"auto"}>
              <Stack spacing={6}>
                <Stack>
                  <Heading size={"sm"}>Chung</Heading>
                  <HStack spacing={4} backgroundColor="whiteAlpha.900">
                    <FormControl>
                      <InputGroup flexDir={"column"}>
                        <InputLeftElement
                          pointerEvents="none"
                          children={<CFaUserAlt color="gray.300" />}
                        />
                        <Input
                          {...register("fullName", { required: true })}
                          defaultValue={customer?.fullName}
                          type="text"
                          placeholder="Nhập họ tên"
                        />
                        {errors.fullName && (
                          <FormHelperText color="red.300">
                            Tên đăng nhập là bắt buộc!
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
                  </HStack>
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
                              Cơ sở là bắt buộc!
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
                            options={[{ label: "Hà Nội", value: "HN" }]}
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
                  <HStack spacing={4} backgroundColor="whiteAlpha.900">
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
                              reset({
                                addressDistrict: null,
                                addressTown: null,
                                addressDetail: null,
                              });
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
                  </HStack>
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
                  <HStack spacing={4} backgroundColor="whiteAlpha.900">
                    <Controller
                      control={control}
                      {...register("birthYear", { required: true })}
                      render={({
                        field: { onChange, onBlur, value, name, ref },
                        formState: { errors },
                      }) => (
                        <FormControl
                          isInvalid={!!errors.facilities}
                          id="cus-birthYear"
                        >
                          <Select
                            options={years?.map((item: number) => ({
                              label: "Năm " + String(item),
                              value: String(item),
                            }))}
                            onChange={(year) => {
                              year && setSelectedYear(year.value);
                              setSelectedMonth(null);
                              reset({
                                birthMonth: null,
                                birthDay: null,
                              });
                              onChange(year);
                            }}
                            onBlur={onBlur}
                            value={value}
                            name={name}
                            ref={ref}
                            placeholder="Năm sinh"
                          />
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
                        <FormControl
                          isInvalid={!!errors.birthDay}
                          id="cus-facilities"
                        >
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
                  </HStack>
                </Stack>

                <Stack>
                  <Heading size={"sm"}>Đặc điểm khách hàng</Heading>
                  <HStack spacing={4} backgroundColor="whiteAlpha.900">
                    <Controller
                      control={control}
                      {...register("characteristics")}
                      render={({
                        field: { onChange, onBlur, value, name, ref },
                        formState: { errors },
                      }) => (
                        <FormControl
                          isInvalid={!!errors.characteristics}
                          id="cus-characteristics"
                        >
                          <Select
                            options={[{ label: "Hà Nội", value: "HN" }]}
                            onChange={onChange}
                            isMulti={true}
                            onBlur={onBlur}
                            value={value}
                            name={name}
                            ref={ref}
                            placeholder="Đặc điểm khách hàng"
                          />
                        </FormControl>
                      )}
                    />
                  </HStack>
                </Stack>
              </Stack>
            </DrawerBody>

            <DrawerFooter>
              <Button
                rounded={"sm"}
                size={"lg"}
                variant="outline"
                mr={3}
                onClick={onClose}
              >
                Hủy
              </Button>
              <Button
                rounded={"sm"}
                size={"lg"}
                colorScheme="teal"
                type="submit"
              >
                Lưu
              </Button>
            </DrawerFooter>
          </form>
        </DrawerContent>
      </Drawer>
    </>
  );
};
