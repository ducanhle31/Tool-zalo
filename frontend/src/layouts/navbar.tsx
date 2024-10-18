"use client";

import { useSessions } from "@/hooks/useSessions";
import { Link } from "@chakra-ui/next-js";
import {
  Box,
  Button,
  Collapse,
  HStack,
  Image,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AiOutlineTransaction } from "react-icons/ai";
import { BsHeart } from "react-icons/bs";
import { CiExport, CiSettings } from "react-icons/ci";
import { FaPlus } from "react-icons/fa";
import { FiUser } from "react-icons/fi";
import { GrGroup } from "react-icons/gr";
import { IoIosLogOut } from "react-icons/io";
import { IoWalletOutline } from "react-icons/io5";
import { LuLeaf, LuPackageCheck } from "react-icons/lu";
import { MdOutlinePlace } from "react-icons/md";
import {
  TbMessage2Dollar,
  TbMessage2Heart,
  TbTransactionPound,
} from "react-icons/tb";

const menus = [
  {
    name: "Khách hàng",
    icon: <FiUser fontSize={"24px"} />,
    href: "/private/customers",
    child: [
      {
        name: "Tạo khách hàng",
        icon: <FaPlus fontSize={"20px"} />,
        href: "/private/customers/create-customers",
      },
      {
        name: "Nhập Excel",
        icon: <CiExport fontSize={"20px"} />,
        href: "/private/customers/import-customers",
      },
    ],
  },
  {
    name: "Nhóm",
    icon: <GrGroup fontSize={"24px"} />,
    href: "/private/customer-groups",
    child: [
      {
        name: "Tạo nhóm",
        icon: <FaPlus fontSize={"20px"} />,
        href: "/private/customer-groups/create-customer-groups",
      },
    ],
  },
  // {
  //   name: "Chiến dịch",
  //   icon: <LuLeaf fontSize={"24px"} />,
  //   href: "/private/campaigns",
  //   child: [
  //     {
  //       name: "Tạo chiến dịch",
  //       icon: <FaPlus fontSize={"20px"} />,
  //       href: "/private/campaigns/create-campaigns",
  //     },
  //   ],
  // },
  // {
  //   name: "Dịch vụ & gói",
  //   icon: <LuPackageCheck fontSize={"24px"} />,
  //   href: "/private/products",
  //   child: [
  //     {
  //       name: "Tạo sản phẩm",
  //       icon: <FaPlus fontSize={"20px"} />,
  //       href: "/private/products/create-product",
  //     },
  //     {
  //       name: "Nhập sản phẩm",
  //       icon: <CiExport fontSize={"20px"} />,
  //       href: "/private/products/import-products",
  //     },
  //   ],
  // },

  {
    name: "Thẻ thành viên",
    icon: <IoWalletOutline fontSize={"24px"} />,
    href: "/private/wallets",
    child: [
      {
        name: "Tạo thẻ thành viên",
        icon: <FaPlus fontSize={"20px"} />,
        href: "/private/wallets/create-wallet",
      },
    ],
  },
  {
    name: "Giao dịch",
    icon: <AiOutlineTransaction fontSize={"24px"} />,
    href: "/private/transactions",
    child: [
      {
        name: "Tạo giao dịch",
        icon: <FaPlus fontSize={"20px"} />,
        href: "/private/transactions/create-transaction",
      },
    ],
  },
  // {
  //   name: "Zalo OA",
  //   icon: <BsHeart fontSize={"24px"} />,
  //   href: "/private/manage-zalo-oa",
  //   child: [
  //     {
  //       name: "Mẫu tin zns",
  //       icon: <TbMessage2Dollar fontSize={"20px"} />,
  //       href: "",
  //     },
  //     {
  //       name: "Mẫu tin UID",
  //       icon: <TbMessage2Heart fontSize={"20px"} />,
  //       href: "",
  //     },
  //   ],
  // },
  {
    name: "Cài đặt",
    icon: <CiSettings fontSize={"24px"} />,
    href: "/private/settings",
    child: [
      {
        name: "Cơ sở",
        icon: <MdOutlinePlace fontSize={"20px"} />,
        href: "/private/settings/facilities",
      },
      {
        name: "Loại giao dịch",
        icon: <TbMessage2Heart fontSize={"20px"} />,
        href: "/private/settings/transaction-types",
      },

      {
        name: "Phương thức giao dịch",
        icon: <TbTransactionPound fontSize={"20px"} />,
        href: "/private/settings/transaction-forms",
      },
    ],
  },
];

export const NavBar = () => {
  const pathName = usePathname();
  const { logout } = useSessions();
  const router = useRouter();

  const [collapses, setCollapses] = useState({
    customer: false,
    customerGroup: false,
    campaigns: false,
    product: false,
    productCategory: false,
    wallet: false,
    transaction: false,
    setting: false,
  });

  useEffect(() => {
    if (pathName.includes("/customers/create-customers")) {
      setCollapses((prev) => ({ ...prev, customer: true }));
    }
  }, [pathName]);

  return (
    <Box bg={"gray.700"} color={"gray.200"}>
      <HStack
        justifyContent={"center"}
        w={"full"}
        borderBottom={"1px"}
        borderColor={"gray.300"}
        py={"12px"}
      >
        <Image srcSet="/logo.png" alt="logo" w={"full"} maxW={"120px"} />
      </HStack>
      <VStack>
        {menus.map((item, index) => (
          <Stack key={index} w={"full"}>
            <HStack
              key={index}
              as={Link}
              justifyContent={"start"}
              alignItems={"center"}
              href={item.href}
              _hover={{
                textDecoration: "none",
                bg: "teal.500",
              }}
              bg={pathName.includes(item.href) ? "teal.500" : "transparent"}
              w={"full"}
              py={"12px"}
              px={"16px"}
              onClick={() =>
                setCollapses((prev) => {
                  if (item.href.includes("/customers")) {
                    return { ...prev, customer: !prev?.customer };
                  }
                  if (item.href.includes("/customer-groups")) {
                    return { ...prev, customerGroup: !prev?.customerGroup };
                  }
                  if (item.href.includes("/campaigns")) {
                    return { ...prev, campaigns: !prev?.campaigns };
                  }
                  if (item.href.includes("/products")) {
                    return { ...prev, product: !prev?.product };
                  }
                  if (item.href.includes("/product-categories")) {
                    return { ...prev, productCategory: !prev?.productCategory };
                  }
                  if (item.href.includes("/wallets")) {
                    return { ...prev, wallet: !prev?.wallet };
                  }
                  if (item.href.includes("/transactions")) {
                    return { ...prev, transaction: !prev?.transaction };
                  }
                  if (item.href.includes("/settings")) {
                    return { ...prev, setting: !prev?.setting };
                  }
                  return prev;
                })
              }
            >
              {item.icon}
              <Text fontSize={"lg"}> {item.name}</Text>
            </HStack>
            {item?.child &&
              item?.child?.map((childItem, index) => (
                <Collapse
                  in={
                    (childItem.href.includes("/customers") &&
                      collapses?.customer) ||
                    (childItem.href.includes("/customer-groups") &&
                      collapses?.customerGroup) ||
                    (childItem.href.includes("/campaigns") &&
                      collapses?.campaigns) ||
                    (childItem.href.includes("/products") &&
                      collapses?.product) ||
                    (childItem.href.includes("/product-categories") &&
                      collapses?.productCategory) ||
                    (childItem.href.includes("/wallets") &&
                      collapses?.wallet) ||
                    (childItem.href.includes("/transactions") &&
                      collapses?.transaction) ||
                    (childItem.href.includes("/settings") && collapses?.setting)
                  }
                  key={index}
                >
                  <Box bg="gray.700">
                    <HStack
                      key={index}
                      as={Link}
                      justifyContent={"start"}
                      alignItems={"center"}
                      href={childItem?.href}
                      _hover={{
                        textDecoration: "none",
                        color: "teal.500",
                      }}
                      color={
                        pathName.includes(childItem?.href)
                          ? "teal.500"
                          : "gray.500"
                      }
                      w={"full"}
                      py={"8px"}
                      px={"12px"}
                      pl={"36px"}
                    >
                      {childItem?.icon}
                      <Text fontSize={"md"}> {childItem?.name}</Text>
                    </HStack>
                  </Box>
                </Collapse>
              ))}
          </Stack>
        ))}
        <HStack
          as={Button}
          rounded={"none"}
          bg={"transparent"}
          _hover={{
            textDecoration: "none",
            bg: "teal.500",
            color: "white",
          }}
          color={"red.300"}
          justifyContent={"start"}
          alignItems={"center"}
          w={"full"}
          py={"12px"}
          px={"16px"}
        >
          <IoIosLogOut fontSize={"24px"} />
          <Text
            fontSize={"lg"}
            onClick={() => {
              logout();
              router.push("/login");
            }}
          >
            Đăng xuất
          </Text>
        </HStack>
      </VStack>
    </Box>
  );
};
