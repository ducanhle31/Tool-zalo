"use client";

import { UserOa } from "@/types/global";
import { Box, Card, CardProps, HStack, Text } from "@chakra-ui/react";
import { Link } from "@chakra-ui/next-js";

interface UserOaProps extends CardProps {
  user: UserOa;
}

export const UserOaDetail = (props: UserOaProps) => {
  const { user, children, ...args } = props;

  return (
    <Card
      {...args}
      px={"12px"}
      py={"12px"}
      as={Link}
      href={`/private/manage-zalo-oa/user/${user.user_id}`}
      rounded={"sm"}
      minW={"min-content"}
      pos={"relative"}
      _hover={{ bg: "gray.100" }}
    >
      <HStack>
        <Box key={user?.user_id}>
          <Text fontSize="lg" color={"blue"}>
            {user?.user_id}
          </Text>
        </Box>
      </HStack>
    </Card>
  );
};
