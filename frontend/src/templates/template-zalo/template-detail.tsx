"use client";

import { Box, SimpleGrid, Stack, Text } from "@chakra-ui/react";

export const TemplateDetail = ({ zaloTemplate }: { zaloTemplate: any }) => {
  const getTemplateQuality = (quality: string) => {
    switch (quality) {
      case "HIGH":
        return "Cao";
      case "MEDIUM":
        return "Trung bình";
      case "LOW":
        return "Thấp";
      case "UNDEFINED":
      default:
        return "Chưa xác định";
    }
  };
  const getTemplateTag = (tag: string) => {
    switch (tag) {
      case "OTP":
        return "OTP";
      case "IN_TRANSACTION":
        return "Xác nhận/Cập nhật giao dịch";
      case "POST_TRANSACTION":
        return "Hỗ trợ dịch vụ liên quan sau giao dịch";
      case "ACCOUNT_UPDATE":
        return "Cập nhật thông tin tài khoản";
      case "GENERAL_UPDATE":
        return "Thay đổi thông tin dịch vụ";
      case "FOLLOW_UP":
        return "Thông báo ưu đãi đến khách hàng cũ";
      default:
        return "Không xác định";
    }
  };
  return (
    <>
      <Stack spacing={6} width={"100%"} direction={"column"}>
        <Stack
          justifyContent={{
            base: "flex-start",
            md: "space-around",
          }}
          direction={{
            base: "column",
            md: "row",
          }}
        >
          <Stack
            width={{
              base: "100%",
              md: "70%",
            }}
            bgColor={"#efefef"}
            p={5}
            borderRadius={"8px"}
            color={"black"}
          >
            <Text textAlign={"start"} fontSize={"sm"}>
              Tên mẫu tin đã duyệt
            </Text>
            <Text
              bgColor={"white"}
              p={3}
              borderRadius={"8px"}
              textAlign={"start"}
            >
              {zaloTemplate.templateName}
            </Text>
            <SimpleGrid columns={2} spacingX={6} mt={3}>
              <Box>
                <Text textAlign={"start"} fontSize={"sm"} mb={2}>
                  Template ID
                </Text>
                <Text
                  bgColor={"white"}
                  p={3}
                  borderRadius={"8px"}
                  textAlign={"start"}
                >
                  {zaloTemplate.templateId}
                </Text>
              </Box>
              <Box>
                <Text textAlign={"start"} fontSize={"sm"} mb={2}>
                  Chi phí tạm tính
                </Text>
                <Text
                  bgColor={"white"}
                  p={3}
                  borderRadius={"8px"}
                  textAlign={"start"}
                >
                  {zaloTemplate.price} VND
                </Text>
              </Box>
            </SimpleGrid>
            <SimpleGrid columns={2} spacingX={6} mt={3}>
              <Box>
                <Text textAlign={"start"} fontSize={"sm"} mb={2}>
                  Loại nội dung của template
                </Text>
                <Text
                  bgColor={"white"}
                  p={3}
                  borderRadius={"8px"}
                  textAlign={"start"}
                >
                  {getTemplateTag(zaloTemplate.templateTag)}
                </Text>
              </Box>
              <Box>
                <Text textAlign={"start"} fontSize={"sm"} mb={2}>
                  Chất lượng của template
                </Text>
                <Text
                  bgColor={"white"}
                  p={3}
                  borderRadius={"8px"}
                  textAlign={"start"}
                >
                  {getTemplateQuality(zaloTemplate.templateQuality)}
                </Text>
              </Box>
            </SimpleGrid>
            <Text
              mt={8}
              bgColor={"pink.50"}
              p={3}
              borderRadius={"8px"}
              textAlign={"start"}
              fontSize={"sm"}
            >
              Nội dung tin nhắn là nội dung đã được duyệt trước đó từ Zalo và
              không thể chỉnh sửa
            </Text>
          </Stack>
          <Stack
            width={{
              base: "100%",
              md: "30%",
            }}
            textAlign={"center"}
          >
            <iframe
              src={zaloTemplate.previewUrl}
              title="Preview"
              width="100%"
              height="350px"
              style={{ backgroundColor: "white", borderRadius: "8px" }}
            />
          </Stack>
        </Stack>
      </Stack>
    </>
  );
};
