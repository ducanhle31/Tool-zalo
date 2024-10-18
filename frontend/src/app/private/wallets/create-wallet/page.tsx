"use client";

import { FilterInput } from "@/components/FilterInput";
import { SearchInput } from "@/components/SearchInput";
import { useCustomerGroups } from "@/hooks/useCustomerGroups";
import { useCustomers } from "@/hooks/useCustomers";
import usePagination from "@/hooks/usePagination";
import { CardCustomer, Customer } from "@/templates/customers/customer";
import { createWallet } from "@/untils/methods/upWallets";
import { Link } from "@chakra-ui/next-js";
import {
  Box,
  Button,
  Center,
  GridItem,
  Heading,
  HStack,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Spinner,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import lodash from "lodash";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";

const CustomerWithModal = (props: CardCustomer) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const router = useRouter();

  const { customer, ...args } = props;

  const createWalletMutation = useMutation({
    mutationFn: createWallet,
    onSuccess: async (data) => {
      const res = await data.json();
      if (res?.ok) {
        toast({
          title: "Thành công",
          description: "Tạo thẻ thành viên thành công!",
          status: "success",
          position: "top-right",
        });
        onClose();
        router.push(`/private/wallets/${res?.result[0]?._id}`);
      } else {
        toast({
          title: "Thất bại",
          description: "Tạo thẻ thành viên thất bại!" + res?.error,
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

  if (!customer) return null;

  return (
    <>
      <Customer
        edit={false}
        href="#"
        customer={customer}
        {...args}
        onClick={onOpen}
      />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent rounded={"sm"}>
          <ModalHeader>Tạo thẻ thành viên</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Bạn chắc chắn muốn tạo thẻ thành viên cho khách hàng? <br />
            <br />
            <b>- Họ và tên: </b>
            {customer?.name}
            <br />
            <b>- Số điện thoại liên hệ: </b> {customer?.phone}
          </ModalBody>

          <ModalFooter>
            <Button rounded={"sm"} colorScheme="gray" mr={3} onClick={onClose}>
              Hủy
            </Button>
            <Button
              colorScheme="teal"
              rounded={"sm"}
              onClick={() =>
                createWalletMutation.mutate({
                  customer: customer?._id!,
                  status: "active",
                })
              }
            >
              Tạo thẻ thành viên
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default function Page() {
  const [search, setSearch] = useState("");
  const [idGroups, setIdGroups] = useState<string[]>([]);
  const { customers, isLoading } = useCustomers();
  const { customerGroups } = useCustomerGroups();

  const customersFilters =
    customers?.filter(
      (customer) =>
        !customer?.wallet &&
        (!idGroups?.length ||
          lodash.intersection(idGroups, customer?.customer_groups || [])
            ?.length > 0) &&
        (!search ||
          customer?.name
            ?.toLocaleLowerCase()
            .trim()
            .includes(search.toLocaleLowerCase().trim()) ||
          customer?.phone?.includes(search))
    ) || [];

  const { currentPage, nextPage, prevPage, totalPages } = usePagination({
    total: customersFilters?.length,
    perpage: 50,
  });

  const customersPag = customersFilters.slice(
    currentPage - 1,
    currentPage + 49
  );

  return (
    <>
      <HStack mt={"24px"} flexWrap={"wrap"}>
        <Text>
          Chọn khách hàng bạn muốn tạo thẻ thành viên. Nếu chưa tồn tại hãy
        </Text>
        <Link href={"/private/customers/create-customers"} color={"blue"}>
          Thêm mới khách hàng
        </Link>
      </HStack>

      <SimpleGrid columns={{ base: 1, md: 4 }} mt={"32px"} mb={"48px"} gap={12}>
        <HStack alignItems={"center"} justifyContent={"start"} maxW={"500px"}>
          <Heading size={"sm"} w={"100px"}>
            Tìm kiếm
          </Heading>
          <SearchInput onSearch={(value) => setSearch(value)} />
        </HStack>
        <GridItem
          as={HStack}
          alignItems={"center"}
          justifyContent={"start"}
          colSpan={2}
        >
          <Heading size={"sm"}>Nhóm khách hàng</Heading>
          <Box flex={1}>
            <FilterInput
              filters={customerGroups?.map((group) => ({
                label: group?.name,
                value: group?._id,
              }))}
              onSearch={(data) => {
                setIdGroups(data);
              }}
            />
          </Box>
        </GridItem>
        <HStack>
          <Text>{`${currentPage}/ ${totalPages} trang`}</Text>
          <IconButton
            rounded={"sm"}
            aria-label="prev"
            onClick={() => prevPage()}
            icon={<GrFormPrevious />}
            colorScheme="teal"
            isDisabled={currentPage <= 1}
          />
          <IconButton
            rounded={"sm"}
            aria-label="next"
            onClick={() => nextPage()}
            icon={<GrFormNext />}
            colorScheme="teal"
            isDisabled={currentPage >= totalPages}
          />
        </HStack>
      </SimpleGrid>

      {isLoading && (
        <Center h={"300px"}>
          <Spinner />
        </Center>
      )}

      {!isLoading && (
        <SimpleGrid
          columns={{ base: 1, sm: 2, md: 4, lg: 5, xl: 6, "2xl": 7 }}
          gap={"18px"}
          color={"gray.400"}
        >
          {customersPag?.map((customer, index) => (
            <GridItem key={index}>
              <CustomerWithModal edit={false} href="#" customer={customer} />
            </GridItem>
          ))}
        </SimpleGrid>
      )}
    </>
  );
}
