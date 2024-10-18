/* eslint-disable react/no-children-prop */
"use client";

import { useFacilities } from "@/hooks/useFacilities";
import { Facility } from "@/templates/facilities/facility";
import { createFacility } from "@/untils/methods/upFacilities";
import {
  Box,
  Button,
  Center,
  chakra,
  FormControl,
  FormHelperText,
  FormLabel,
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
  Spinner,
  Stack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { FaPlus, FaUserAlt } from "react-icons/fa";
import { MdLocalPhone } from "react-icons/md";

const CFaUserAlt = chakra(FaUserAlt);

export default function Page() {
  const { facilities, isLoading } = useFacilities();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ name: string; phone: string }>();
  const toast = useToast();
  const router = useRouter();

  const createFacilityMutation = useMutation({
    mutationFn: createFacility,
    onSuccess: async (data) => {
      const res = await data.json();
      if (res?.ok) {
        toast({
          title: "Thành công",
          description: "Tạo cơ sở thành công!",
          status: "success",
          position: "top-right",
        });

        onClose();

        res.result && router.push(`/private/settings/facilities/1`);
      } else {
        toast({
          title: "Thất bại",
          description: "Tạo cơ sở thất bại! " + res?.error,
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

  const onSubmit = async (data: { name: string; phone: string }) => {
    const facility = {
      name: data?.name,
      phone: data?.phone,
      manager: null,
      status: "active",
    };

    createFacilityMutation.mutate(facility);
  };

  if (isLoading)
    return (
      <Center h={"300px"}>
        <Spinner />
      </Center>
    );

  return (
    <Box pt={10} maxW={"800px"}>
      <>
        <Button
          rounded={"sm"}
          colorScheme="teal"
          leftIcon={<FaPlus />}
          onClick={onOpen}
        >
          Tạo cơ sở
        </Button>

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent
            rounded={"sm"}
            as={"form"}
            onSubmit={handleSubmit(onSubmit)}
          >
            <ModalHeader>Tạo sơ sở</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Stack spacing={6}>
                <Stack>
                  <FormControl>
                    <FormLabel>Tên cơ sở</FormLabel>
                    <InputGroup flexDir={"column"}>
                      <InputLeftElement
                        pointerEvents="none"
                        children={<CFaUserAlt color="gray.300" />}
                      />
                      <Input
                        {...register("name", { required: "Tên là bắt buộc!" })}
                        rounded={"sm"}
                      />
                    </InputGroup>

                    {errors?.name && (
                      <FormHelperText color={"red.500"}>
                        {errors.name?.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                  <FormControl>
                    <FormLabel>Số điện thoại</FormLabel>
                    <InputGroup flexDir={"column"}>
                      <InputLeftElement
                        pointerEvents="none"
                        color="gray.300"
                        children={<MdLocalPhone color="gray.300" />}
                      />
                      <Input
                        rounded={"sm"}
                        type="number"
                        {...register("phone", {
                          required: "Số điện thoại là bắt buộc!",
                          pattern: {
                            value: /^(?:\+84|0)(?:3|5|7|8|9)\d{8}$/,
                            message: "Số điện thoại không hợp lệ",
                          },
                        })}
                      />
                    </InputGroup>
                    {errors?.phone && (
                      <FormHelperText color={"red.500"}>
                        {errors.phone?.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Stack>
              </Stack>
            </ModalBody>

            <ModalFooter>
              <Button
                rounded={"sm"}
                colorScheme="gray"
                mr={3}
                onClick={onClose}
              >
                Hủy
              </Button>
              <Button colorScheme="teal" rounded={"sm"} type="submit">
                Tạo cơ sở
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
      <SimpleGrid
        mt={12}
        columns={{ base: 1, md: 2, lg: 3 }}
        spacing={4}
        color={"gray.500"}
      >
        {facilities?.map((facility, index) => (
          <Facility facility={facility} key={index} />
        ))}
      </SimpleGrid>
    </Box>
  );
}
