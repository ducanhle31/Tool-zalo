/* eslint-disable react/no-children-prop */
"use client";

import { FormControl, HStack, IconButton } from "@chakra-ui/react";
import { Controller, useForm } from "react-hook-form";
import { FiFilter } from "react-icons/fi";
import Select from "react-select";

export const FilterInput = ({
  filters,
  onSearch,
  placeholder,
}: {
  filters: { label: string; value: string }[];
  onSearch: (value: string[]) => void;
  placeholder?: string;
}) => {
  const { register, handleSubmit, control } = useForm<{
    filter_input: { label: string; value: string }[];
  }>();

  const handleSearch = (data: {
    filter_input: { label: string; value: string }[];
  }) => {
    onSearch(data?.filter_input?.map((item) => item.value));
  };

  return (
    <>
      <HStack
        w={"full"}
        backgroundColor="whiteAlpha.900"
        as={"form"}
        onSubmit={handleSubmit(handleSearch)}
      >
        <Controller
          control={control}
          {...register("filter_input", { required: true })}
          render={({
            field: { onChange, onBlur, value, name, ref },
            formState: { errors },
          }) => (
            <FormControl id="cus-filter-input">
              <Select
                options={filters}
                onChange={(value) => {
                  onChange(value);
                  onSearch(value?.map((item) => item.value));
                }}
                isMulti={true}
                onBlur={onBlur}
                value={value}
                name={name}
                ref={ref}
                placeholder={placeholder}
              />
            </FormControl>
          )}
        />

        <IconButton
          aria-label="filter-button"
          type="submit"
          w={"18px"}
          color={"gray.100"}
          colorScheme="teal"
          rounded={"sm"}
          icon={<FiFilter />}
        />
      </HStack>
    </>
  );
};
