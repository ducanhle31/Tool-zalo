/* eslint-disable react/no-children-prop */
"use client";

import { useCustomerGroups } from "@/hooks/useCustomerGroups";
import { useZaloTemplate, useZaloTemplates } from "@/hooks/useZaloTemplates";
import { Campaign, CampaignPreview } from "@/types/global";
import {
  createCampaign,
  deleteCampaign,
  updateCampaign,
} from "@/untils/methods/upCampaigns";
import { Link } from "@chakra-ui/next-js";
import {
  Box,
  Button,
  chakra,
  FormControl,
  FormHelperText,
  FormLabel,
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
  SimpleGrid,
  Stack,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { FaCalendarAlt, FaUserAlt } from "react-icons/fa";
import { MdOutlineDescription } from "react-icons/md";
import Select from "react-select";

const CFaUserAlt = chakra(FaUserAlt);

type Inputs = {
  name: string;
  description: string;
  customerGroups: { label: string; value: string }[];
  startAt: Date | string;
  template: { label: string; value: string };
};

export const CampaignForm = ({ campaign }: { campaign?: Campaign }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const toast = useToast();
  const { customerGroups } = useCustomerGroups();
  const { zaloTemplates } = useZaloTemplates();
  const [id, setSelectedTemplateId] = useState<string>("");
  const { zaloTemplate } = useZaloTemplate(id);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<Inputs>();

  const createCampaignMutation = useMutation({
    mutationFn: createCampaign,
    onSuccess: async (data) => {
      const res = await data.json();
      console.log(res);
      if (res?.ok) {
        toast({
          title: "Thành công",
          description: "Chiến dịch đã bắt đầu!",
          status: "success",
          position: "top-right",
        });
      } else {
        toast({
          title: "Thất bại",
          description: "Tạo chiến dịch thất bại!",
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

  const updateCampaignMutation = useMutation({
    mutationFn: updateCampaign,
    onSuccess: async (data) => {
      const res = await data.json();
      if (res?.ok) {
        toast({
          title: "Thành công",
          description: "Cập nhật chiến dịch thành công!",
          status: "success",
          position: "top-right",
        });
      } else {
        toast({
          title: "Thất bại",
          description: "Cập nhật chiến dịch thất bại!",
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

  const deleteCampaignMutation = useMutation({
    mutationFn: deleteCampaign,
    onSuccess: async (data) => {
      const res = await data.json();
      if (res?.ok) {
        toast({
          title: "Thành công",
          description: "Đã xóa dữ liệu chiến dịch!",
          status: "success",
          position: "top-right",
        });

        router.push("/private/campaigns");
      } else {
        toast({
          title: "Thất bại",
          description: "Không thể xóa dữ liệu chiến dịch!",
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

  const handleTemplateChange = (selectedOption: any) => {
    const templateId = selectedOption?.value || "";
    setSelectedTemplateId(templateId);
  };

  const onSubmit: SubmitHandler<Inputs> = async (data, event) => {
    const submitter = (event?.nativeEvent as SubmitEvent)
      .submitter as HTMLButtonElement;
    const buttonName = submitter?.name;

    if (!data) return;

    const currentCampaign: Omit<CampaignPreview, "createdAt" | "updatedAt"> = {
      _id: campaign?._id!,
      name: data?.name,
      description: data?.description,
      status: "active",
      customer_groups: data?.customerGroups?.map((item) => item.value),
      startAt: data?.startAt,
      template: data?.template?.value,
    };

    buttonName === "create" && createCampaignMutation.mutate(currentCampaign);

    buttonName === "update" && updateCampaignMutation.mutate(currentCampaign);
  };

  useEffect(() => {
    if (campaign?.name) {
      setValue("name", campaign.name);
    }

    if (campaign?.description) {
      setValue("description", campaign.description);
    }

    if (campaign?.customer_groups) {
      setValue(
        "customerGroups",
        campaign?.customer_groups?.map((item) => ({
          label: item.name,
          value: item?._id,
        })) || []
      );
    }

    if (campaign?.template) {
      setValue("template", {
        label: campaign?.template?.templateName,
        value: campaign?.template?.templateId,
      });
    }

    if (campaign?.startAt) {
      setValue("startAt", campaign?.startAt);
    }
  }, [campaign, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={6}>
        <Stack spacing={"24px"}>
          <FormControl>
            <FormLabel>Tên chiến dịch</FormLabel>
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
                <FormHelperText color="red.300">Tên là bắt buộc</FormHelperText>
              )}
            </InputGroup>
          </FormControl>
          <FormControl>
            <FormLabel>Mô tả chiến dịch</FormLabel>
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
                placeholder="Nhập mô tả"
              />
              {errors.description && (
                <FormHelperText color="red.300">
                  Mô tả là bắt buộc
                </FormHelperText>
              )}
            </InputGroup>
          </FormControl>
        </Stack>

        <Stack>
          <Heading size={"sm"}>Chọn loại tin mẫu</Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={"4"}>
            <Box>
              <Controller
                control={control}
                {...register("template", { required: true })}
                render={({
                  field: { onChange, onBlur, value, name, ref },
                  formState: { errors },
                }) => (
                  <FormControl
                    isInvalid={!!errors.template}
                    id="campaign-template"
                  >
                    <Select
                      options={zaloTemplates?.map((item) => ({
                        label: item?.templateName,
                        value: item?.templateId,
                      }))}
                      // onChange={onChange}
                      onChange={(selectedOption) => {
                        onChange(selectedOption);
                        handleTemplateChange(selectedOption);
                      }}
                      onBlur={onBlur}
                      value={value}
                      name={name}
                      ref={ref}
                      placeholder="Mẫu tin"
                    />
                    {errors.template && (
                      <FormHelperText color="red.300">
                        Mẫu tin là bắt buộc!
                      </FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Box>
            <Box bgColor={"white"}>
              {zaloTemplate ? (
                <iframe
                  src={zaloTemplate.previewUrl}
                  title="Preview"
                  width="100%"
                  height="350px"
                  style={{ backgroundColor: "white" }}
                />
              ) : (
                <Heading size="sm">Chọn mẫu tin</Heading>
              )}
            </Box>
          </SimpleGrid>
        </Stack>

        <Stack>
          <Heading size={"sm"}>Chọn nhóm khách hàng</Heading>
          <HStack spacing={4} backgroundColor="whiteAlpha.900">
            <Controller
              control={control}
              {...register("customerGroups", { required: true })}
              render={({
                field: { onChange, onBlur, value, name, ref },
                formState: { errors },
              }) => (
                <FormControl
                  isInvalid={!!errors.customerGroups}
                  id="campaign-customer-groups"
                >
                  <Select
                    options={customerGroups?.map((item) => ({
                      label: item?.name,
                      value: item?._id,
                    }))}
                    onChange={onChange}
                    isMulti={true}
                    onBlur={onBlur}
                    value={value}
                    name={name}
                    ref={ref}
                    placeholder="Nhóm khách hàng"
                  />
                  {errors.customerGroups && (
                    <FormHelperText color="red.300">
                      Nhóm Khách hàng là bắt buộc!
                    </FormHelperText>
                  )}
                </FormControl>
              )}
            />
          </HStack>
        </Stack>

        <Stack>
          <FormControl>
            <FormLabel>
              Đặt thời gian gửi (Nếu bắt đầu ngay thì bỏ qua trường này)
            </FormLabel>
            <InputGroup flexDir={"column"}>
              <InputLeftElement
                pointerEvents="none"
                color="gray.300"
                children={<FaCalendarAlt color="gray.300" />}
              />
              <Input
                type="datetime-local"
                rounded={"sm"}
                {...register("startAt", { required: false })}
              />
            </InputGroup>
          </FormControl>
        </Stack>
      </Stack>

      <HStack justifyContent={"end"} mt={"24px"}>
        <Button
          rounded={"sm"}
          size={"lg"}
          variant="outline"
          mr={3}
          as={Link}
          href={"/private/campaigns"}
        >
          Hủy
        </Button>
        {campaign && (
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
                        deleteCampaignMutation.mutate(campaign._id)
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
        {!campaign && (
          <Button
            rounded={"sm"}
            size={"lg"}
            colorScheme="teal"
            name="create"
            type="submit"
          >
            Bắt đầu chiến dịch
          </Button>
        )}
      </HStack>
    </form>
  );
};
