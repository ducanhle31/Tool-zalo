"use client";

import { useUserOA } from "@/hooks/useUsers";
import { Link } from "@chakra-ui/next-js";
import {
  Avatar,
  Box,
  Center,
  Divider,
  Grid,
  Heading,
  HStack,
  Icon,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { IoIosArrowBack } from "react-icons/io";

export default function UserOaDetail({ params }: { params: { id: string } }) {
  const { useroa, isLoading } = useUserOA(params.id!);
  if (isLoading)
    return (
      <Center height={"300px"}>
        <Spinner size={"lg"} />
      </Center>
    );

  if (!useroa) return <Text>No user details found.</Text>;

  const {
    avatar,
    display_name,
    user_id,
    user_is_follower,
    user_last_interaction_date,
    is_sensitive,
    shared_info,
    user_id_by_app,
    tags_and_notes_info,
  } = useroa;

  return (
    <Box color={"gray.600"}>
      <HStack py={"12px"} pb={"48px"}>
        <Link
          href={"/private/manage-zalo-oa/user"}
          display={"flex"}
          alignItems={"center"}
        >
          <Icon as={IoIosArrowBack} w={"28px"} h={"28px"} />
        </Link>
        <Heading size={"md"}>Danh sách người dùng</Heading>
      </HStack>

      <VStack align={"stretch"} spacing={6} width="100%">
        <Avatar src={avatar} size="2xl" />

        <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4}>
          <Box>
            <Heading size="sm">Tên hiển thị:</Heading>
            <Text>{display_name}</Text>
          </Box>

          <Box>
            <Heading size="sm">ID Người dùng với Zalo OA:</Heading>
            <Text>{user_id}</Text>
          </Box>

          <Box>
            <Heading size="sm">ID Người dùng với mini app:</Heading>
            <Text>{user_id_by_app}</Text>
          </Box>

          <Box>
            <Heading size="sm">Theo dõi ZALO OA:</Heading>
            <Text>{user_is_follower ? "Có" : "Không"}</Text>
          </Box>

          <Box>
            <Heading size="sm">Lần tương tác cuối:</Heading>
            <Text>{user_last_interaction_date}</Text>
          </Box>

          <Box>
            <Heading size="sm">Thông tin:</Heading>
            <Text>{is_sensitive ? "Dưới 18 tuổi" : "Trên 18 tuổi"}</Text>
          </Box>
        </Grid>

        {shared_info &&
          (shared_info.name || shared_info.address || shared_info.phone) && (
            <Box>
              <Divider />
              <Heading size="md" mb={2}>
                Thông tin liên hệ
              </Heading>
              <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4}>
                <Box>
                  <Text>
                    <strong>Tên:</strong> {shared_info.name || "Không có tên"}
                  </Text>
                </Box>
                <Box>
                  <Text>
                    <strong>Địa chỉ:</strong>
                    {shared_info.address
                      ? `${shared_info.address},`
                      : "Không có địa chỉ"}
                    {shared_info.district
                      ? `${shared_info.district},`
                      : "Không có quận"}
                    {shared_info.city || "Không có thành phố"}
                  </Text>
                </Box>
                <Box>
                  <Text>
                    <strong>Số điện thoại:</strong>{" "}
                    {shared_info.phone || "Không có số điện thoại"}
                  </Text>
                </Box>
              </Grid>
            </Box>
          )}

        {tags_and_notes_info && (
          <>
            <Divider />
            <Box>
              <Heading size="md" mb={2}>
                Ghi chú và Thẻ
              </Heading>
              <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4}>
                <Box>
                  <Text>
                    <strong>Ghi chú:</strong>{" "}
                    {tags_and_notes_info.notes?.join(", ") ||
                      "Không có ghi chú"}
                  </Text>
                </Box>
                <Box>
                  <Text>
                    <strong>Thẻ:</strong>{" "}
                    {tags_and_notes_info.tag_names?.join(", ") ||
                      "Không có thẻ"}
                  </Text>
                </Box>
              </Grid>
            </Box>
          </>
        )}
      </VStack>
    </Box>
  );
}
