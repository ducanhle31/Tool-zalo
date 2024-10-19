"use client";

import { UsersOa } from "@/types/global";
import { Link } from "@chakra-ui/next-js";
import { Box, Card, CardProps, HStack, Text } from "@chakra-ui/react";

interface UserOaProps extends CardProps {
  usersoa: UsersOa | null;
}

export const UserOa = (props: UserOaProps) => {
  const { usersoa, children, ...args } = props;
  console.log(usersoa);
  return (
    <Card
      {...args}
      px={"12px"}
      py={"12px"}
      /*   as={Link}
      href={`/private/manage-zalo-oa/${users?.users?.user_id}`} */
      rounded={"sm"}
      minW={"min-content"}
      pos={"relative"}
      _hover={{ bg: "gray.100" }}
    >
      <HStack>
        
        <Box key={usersoa?.total}>
          <Text fontSize="lg" color={"blue"}>
            {usersoa?.count}
          </Text>
          <Text>ID: {usersoa?.offset}</Text>
        </Box>
      </HStack>
    </Card>
  );
};
