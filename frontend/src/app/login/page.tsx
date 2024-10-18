/* eslint-disable react/no-children-prop */
"use client";

import { useSessions } from "@/hooks/useSessions";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormHelperText,
  Heading,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Stack,
  chakra,
} from "@chakra-ui/react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { FaLock, FaUserAlt } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";

const CFaUserAlt = chakra(FaUserAlt);
const CFaLock = chakra(FaLock);

type Inputs = {
  userName: string;
  password: string;
};

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const { login } = useSessions();

  const [showPassword, setShowPassword] = useState(false);

  const handleShowClick = () => setShowPassword(!showPassword);
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    const user_name = data.userName;
    const password = data.password;

    login({ user_name, password });
  };

  return (
    <>
      <Flex
        flexDirection="column"
        width="100wh"
        height="100vh"
        backgroundColor="white"
        justifyContent="center"
        alignItems="center"
      >
        <Stack
          flexDir="column"
          mb="2"
          justifyContent="center"
          alignItems="center"
        >
          <Image srcSet="/logo.png" maxW={"150px"} alt="logo" />
          <Heading color="gray.700">Đăng nhập</Heading>
          <Box minW={{ base: "90%", md: "468px" }}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack
                spacing={4}
                p="1rem"
                backgroundColor="whiteAlpha.900"
                boxShadow="md"
              >
                <FormControl>
                  <InputGroup>
                    <InputLeftElement
                      pointerEvents="none"
                      children={<CFaUserAlt color="gray.300" />}
                    />
                    <Input
                      {...register("userName", { required: true })}
                      rounded={"sm"}
                      type="text"
                      placeholder="User name"
                    />
                    {errors.userName && (
                      <FormHelperText color="red.300">
                        Tên đăng nhập là bắt buộc!
                      </FormHelperText>
                    )}
                  </InputGroup>
                </FormControl>
                <FormControl>
                  <InputGroup>
                    <InputLeftElement
                      pointerEvents="none"
                      color="gray.300"
                      children={<CFaLock color="gray.300" />}
                    />
                    <Input
                      {...register("password", { required: true })}
                      rounded={"sm"}
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                    />
                    {errors.password && (
                      <FormHelperText color="red.300">
                        Mật khẩu là bắt buộc!
                      </FormHelperText>
                    )}
                    <InputRightElement width="4.5rem">
                      <Button
                        h="1.75rem"
                        size="sm"
                        rounded={"sm"}
                        onClick={handleShowClick}
                      >
                        {showPassword ? "Hide" : "Show"}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                </FormControl>
                <Button
                  borderRadius={0}
                  type="submit"
                  variant="solid"
                  colorScheme="teal"
                  width="full"
                >
                  Đăng nhập
                </Button>
              </Stack>
            </form>
          </Box>
        </Stack>
      </Flex>
    </>
  );
}
