"use client";

import { Customer } from "@/types/global";
import {
  Box,
  Button,
  chakra,
  Flex,
  FormControl,
  FormHelperText,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FaUserAlt } from "react-icons/fa";
import Select from "react-select";

const CFaUserAlt = chakra(FaUserAlt);

type Inputs = {
  email: string;
  phone: string;
  fullName: string;
  addressProvince: { label: string; value: string } | null;
  addressDistrict: { label: string; value: string } | null;
  addressTown: { label: string; value: string } | null;
  addressDetail: string | null;
  facilities: { label: string; value: string }[] | null;
  groups: { label: string; value: string }[] | null;
  birthDay: { label: string; value: string } | null;
  birthMonth: { label: string; value: string } | null;
  birthYear: { label: string; value: string } | null;
  gender: string;
};

export const ListTable = ({ customer }: { customer?: Customer }) => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<Inputs>();
  const [inputPairs, setInputPairs] = useState([{ id: 0 }]); // Initial state with one pair
  const [showWarning, setShowWarning] = useState(false); // State to handle warning

  // Function to add a new input pair
  const addInputPair = () => {
    if (inputPairs.length < 5) {
      setInputPairs([...inputPairs, { id: inputPairs.length }]); // Add a new pair
      setShowWarning(false); // Hide warning when adding successfully
    } else {
      setShowWarning(true); // Show warning when reaching the limit
    }
  };

  // Function to remove an input pair
  const removeInputPair = (id: number) => {
    if (inputPairs.length > 1) {
      setInputPairs(inputPairs.filter((pair) => pair.id !== id)); // Remove the pair by id
      setShowWarning(false); // Hide warning if user removes a row
    }
  };
  return (
    <Stack spacing={4}>
      <Heading size={"sm"} mb={2}>
        Nội dung bảng * (Tối đa 5 dòng)
      </Heading>

      {inputPairs.map((pair, index) => (
        <SimpleGrid
          key={pair.id}
          columns={{ base: 1, md: 2 }}
          spacing={4}
          backgroundColor="whiteAlpha.900"
        >
          <Box>
            <FormControl>
              <InputGroup flexDir={"column"}>
                <InputLeftElement
                  pointerEvents="none"
                  children={<CFaUserAlt color="gray.300" />}
                />
                <Input
                  rounded={"sm"}
                  {...register(`fullName[${index}]`, { required: true })}
                  defaultValue={customer?.name!}
                  type="text"
                  placeholder={customer?.name! || "Tiêu đề"}
                />
                {errors.fullName && (
                  <FormHelperText color="red.300">
                    Tên là bắt buộc
                  </FormHelperText>
                )}
              </InputGroup>
            </FormControl>
          </Box>
          <Flex>
            <FormControl>
              <Controller
                control={control}
                name={`gender[${index}]`}
                render={({ field: { value, onChange, onBlur, ref } }) => (
                  <FormControl>
                    <Select
                      options={[
                        { label: "Tên OA", value: "{{oa_name}}" },
                        { label: "Mã KH", value: "{{customer_id}}" },
                        { label: "Số điện thoại", value: "{{phone}}" },
                      ]}
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value}
                      ref={ref}
                      placeholder="Giá trị"
                      formatOptionLabel={(option) => {
                        if (typeof option === "string") {
                          return <div>{option}</div>;
                        }
                        return (
                          <div>
                            <span>{option.label}</span> -{" "}
                            <span>{option.value}</span>
                          </div>
                        );
                      }}
                    />
                    {errors.gender && (
                      <FormHelperText color="red.300">
                        Loại tin là bắt buộc
                      </FormHelperText>
                    )}
                  </FormControl>
                )}
                rules={{ required: true }}
              />
            </FormControl>

            <Box ml={4}>
              <Button
                colorScheme="red"
                onClick={() => removeInputPair(pair.id)}
              >
                Xóa
              </Button>
            </Box>
          </Flex>
        </SimpleGrid>
      ))}

      {/* Display warning when the limit is reached */}
      {showWarning && (
        <Text color="red.500" fontSize="sm">
          Đã đạt tối đa 5 dòng.
        </Text>
      )}

      <Box>
        <Button
          onClick={addInputPair}
          colorScheme="teal"
          mt={4}
          isDisabled={inputPairs.length >= 5}
        >
          Thêm dòng
        </Button>
      </Box>
    </Stack>
  );
};
