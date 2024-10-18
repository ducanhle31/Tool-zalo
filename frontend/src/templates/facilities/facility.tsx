/* eslint-disable react/no-children-prop */
"use client";

import { FacilityPreview } from "@/types/global";
import { deleteFacility } from "@/untils/methods/upFacilities";
import {
  Box,
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
  Text,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { FaTrash } from "react-icons/fa";
import { MdPlace } from "react-icons/md";

interface FacilityProps extends CardProps {
  facility: FacilityPreview;
}

export const Facility = (props: FacilityProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const router = useRouter();

  const { facility } = props;

  const deleteFacilityMutation = useMutation({
    mutationFn: deleteFacility,
    onSuccess: async (data) => {
      const res = await data.json();
      if (res?.ok) {
        toast({
          title: "Thành công",
          description: "Đã xóa dữ liệu của cơ sở!",
          status: "success",
          position: "top-right",
        });

        onClose();

        res.result && router.push(`/private/settings/facilities/1`);
      } else {
        toast({
          title: "Thất bại",
          description: "Xóa cơ sở thất bại! " + res?.error,
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

  return (
    <Card
      rounded={"sm"}
      shadow={"lg"}
      pos={"relative"}
      px={4}
      py={4}
      as={VStack}
    >
      <Icon as={MdPlace} w={"30px"} h={"30px"} />
      <Box>
        <Heading size={"md"} textAlign={"center"}>
          {facility?.name}
        </Heading>
        <Text fontSize={"xs"}>Nhất Liệu Khang {facility?.name}</Text>
        <>
          <IconButton
            rounded={"sm"}
            colorScheme="red"
            variant={"ghost"}
            aria-label="delete"
            icon={<FaTrash />}
            pos={"absolute"}
            top={0}
            right={0}
            onClick={onOpen}
          />
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent rounded={"sm"}>
              <ModalHeader>Xóa cơ sở</ModalHeader>
              <ModalCloseButton />
              <ModalBody>Bạn chắc chắn muốn xóa {facility?.name}?</ModalBody>

              <ModalFooter as={HStack}>
                <Button
                  colorScheme="red"
                  rounded={"sm"}
                  onClick={() => deleteFacilityMutation.mutate(facility?._id)}
                >
                  Xóa
                </Button>
                <Button
                  rounded={"sm"}
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
      </Box>
    </Card>
  );
};
