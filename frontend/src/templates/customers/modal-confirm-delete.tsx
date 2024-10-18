"use client";

import {
  Button,
  HStack,
  MenuItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { toast } from "react-toastify";

export const ModalConfirmDelete = ({ customer }: { customer: any }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <MenuItem onClick={onOpen} color={"red.500"}>
        Xóa khách hàng
      </MenuItem>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent rounded={"sm"}>
          <ModalHeader>Cảnh báo</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              Dữ liệu khách hàng sẽ bị xóa, hành động này sẽ không thể khôi
              phục. Bạn chắc chắn muốn xóa?
            </Text>
          </ModalBody>

          <ModalFooter>
            <HStack>
              <Button
                rounded={"sm"}
                colorScheme="red"
                onClick={() => {
                  console.log("deleted ", customer?.fullName);
                  onClose();
                  toast.success("Xóa khách hàng thành công!");
                }}
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
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
