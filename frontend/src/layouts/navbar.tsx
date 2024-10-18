"use client";

import { useSessions } from "@/hooks/useSessions";
import { Link } from "@chakra-ui/next-js";
import {
  Box,
  Button,
  Collapse,
  HStack,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { AiOutlineTransaction } from "react-icons/ai";
import { BsHeart } from "react-icons/bs";
import { CiExport, CiSettings } from "react-icons/ci";
import { FaPlus } from "react-icons/fa";
import { FaRegCircleUser } from "react-icons/fa6";
import { FiUser } from "react-icons/fi";
import { GrGroup } from "react-icons/gr";
import { IoIosLogOut } from "react-icons/io";
import { IoWalletOutline } from "react-icons/io5";
import { LuLeaf, LuPackageCheck } from "react-icons/lu";
import {
  TbAffiliate,
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
  {
    name: "Chiến dịch",
    icon: <LuLeaf fontSize={"24px"} />,
    href: "/private/campaigns",
    child: [
      {
        name: "Tạo chiến dịch",
        icon: <FaPlus fontSize={"20px"} />,
        href: "/private/campaigns/create-campaigns",
      },
      {
        name: "Danh sách tin gửi",
        icon: <FaPlus fontSize={"20px"} />,
        href: "/private/campaigns/send-campaigns",
      },
    ],
  },
  {
    name: "Dịch vụ & gói",
    icon: <LuPackageCheck fontSize={"24px"} />,
    href: "/private/products",
    child: [
      {
        name: "Tạo sản phẩm",
        icon: <FaPlus fontSize={"20px"} />,
        href: "/private/products/create-product",
      },
      {
        name: "Nhập sản phẩm",
        icon: <CiExport fontSize={"20px"} />,
        href: "/private/products/import-products",
      },
    ],
  },

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
  {
    name: "Zalo OA",
    icon: <BsHeart fontSize={"24px"} />,
    href: "/private/manage-zalo-oa",
    child: [
      {
        name: "Mẫu tin zns",
        icon: <TbMessage2Dollar fontSize={"20px"} />,
        href: "/private/manage-zalo-oa/zns-template",
      },
      {
        name: "Mẫu tin UID",
        icon: <TbMessage2Heart fontSize={"20px"} />,
        href: "/private/manage-zalo-oa/uid-template",
      },
    ],
  },
  {
    name: "Cài đặt",
    icon: <CiSettings fontSize={"24px"} />,
    href: "/private/settings",
    child: [
      {
        name: "Nguồn giới thiệu",
        icon: <TbAffiliate fontSize={"20px"} />,
        href: "/private/settings/facilities",
      },
      {
        name: "Người dùng",
        icon: <FaRegCircleUser fontSize={"20px"} />,
        href: "/private/settings/users",
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

  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const handleMouseEnter = (menuName: string) => {
    setActiveMenu(menuName);
  };

  const handleMouseLeave = () => {
    setActiveMenu(null);
  };

  return (
    <Box
      bg={"gray.700"}
      color={"gray.200"}
      position="sticky"
      top="0"
      zIndex="10"
    >
      <HStack
        justifyContent={"center"}
        w={"full"}
        borderBottom={"1px"}
        borderColor={"gray.300"}
        py={"12px"}
        bg="gray.700"
      >
        <Image srcSet="/zalo.png" alt="logo" w={"full"} maxW={"120px"} />
      </HStack>

      <VStack>
        {menus.map((item, index) => (
          <Box key={index} w={"full"} onMouseLeave={handleMouseLeave}>
            <HStack
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
              onMouseEnter={() => handleMouseEnter(item.name)} // Open submenu on hover
            >
              {item.icon}
              <Text fontSize={"lg"}>{item.name}</Text>
            </HStack>

            {item?.child && (
              <Collapse in={activeMenu === item.name}>
                <Box
                  bg="gray.700"
                  onMouseEnter={() => handleMouseEnter(item.name)}
                  onMouseLeave={handleMouseLeave}
                >
                  {item?.child?.map((childItem, index) => (
                    <HStack
                      key={index}
                      as={Link}
                      justifyContent={"start"}
                      alignItems={"center"}
                      href={childItem.href}
                      _hover={{
                        textDecoration: "none",
                        color: "teal.500",
                      }}
                      color={
                        pathName.includes(childItem.href)
                          ? "teal.500"
                          : "gray.500"
                      }
                      w={"full"}
                      py={"8px"}
                      px={"12px"}
                      pl={"36px"}
                    >
                      {childItem.icon}
                      <Text fontSize={"md"}>{childItem.name}</Text>
                    </HStack>
                  ))}
                </Box>
              </Collapse>
            )}
          </Box>
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
