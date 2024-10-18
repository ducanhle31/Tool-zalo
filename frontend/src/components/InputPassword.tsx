/* eslint-disable react/no-children-prop */
"use client";

import {
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputProps,
  InputRightElement,
} from "@chakra-ui/react";
import { forwardRef, useState } from "react";
import { BiSolidHide } from "react-icons/bi";
import { CiLock } from "react-icons/ci";
import { FaEye } from "react-icons/fa";

export const InputPassword = forwardRef((props: InputProps, ref) => {
  const { children, type, placeholder, ...args } = props;
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <InputGroup>
      <InputLeftElement
        pointerEvents="none"
        color="gray.300"
        children={<CiLock color="gray.300" />}
      />
      <Input type={showPassword ? "text" : "password"} ref={ref} {...args} />
      <InputRightElement
        children={
          <IconButton
            aria-label="show/hide"
            icon={!showPassword ? <FaEye /> : <BiSolidHide />}
            rounded={"sm"}
            fontSize={"sm"}
            colorScheme="gray"
          />
        }
        onClick={togglePasswordVisibility}
      />
    </InputGroup>
  );
});

InputPassword.displayName = "InputPassword";
