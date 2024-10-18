/* eslint-disable react/no-children-prop */
"use client";

import { Button, Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { useState } from "react";
import { FiSearch } from "react-icons/fi";

export const SearchInput = ({
  onSearch,
}: {
  onSearch: (value: any) => void;
}) => {
  const [value, setValue] = useState("");

  return (
    <>
      <InputGroup>
        <InputRightElement
          as={Button}
          onClick={() => onSearch(value.toLocaleLowerCase().trim())}
          size={"18px"}
          color={"gray.100"}
          colorScheme="teal"
          rounded={"sm"}
          children={<FiSearch />}
        />
        <Input
          onChange={(e) => {
            setValue(e.target?.value?.trim());
            onSearch(e.target?.value?.toLocaleLowerCase().trim());
          }}
          rounded={"sm"}
          type="text"
          placeholder="Tìm kiếm"
        />
      </InputGroup>
    </>
  );
};
