import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Heading,
  HStack,
  Input,
  InputGroup,
  Select,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

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

export const ButtonActions = () => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<Inputs>();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  const [buttons, setButtons] = useState([
    { id: 1, name: "", type: "", value: "" },
  ]);
  const maxButtons = 4;

  const addButton = () => {
    if (buttons.length < maxButtons) {
      setButtons([
        ...buttons,
        { id: Date.now(), name: "", type: "", value: "" },
      ]);
    }
  };

  const removeButton = (id: number) => {
    if (buttons.length > 1) {
      setButtons(buttons.filter((button) => button.id !== id));
    }
  };

  const handleInputChange = (id: number, field: string, value: string) => {
    setButtons(
      buttons.map((button) =>
        button.id === id ? { ...button, [field]: value } : button
      )
    );
  };
  return (
    <Stack spacing={4}>
      <Heading size={"sm"}>Nút thao tác</Heading>
      {buttons.map((button, index) => (
        <HStack
          key={button.id}
          spacing={4}
          backgroundColor="whiteAlpha.900"
          padding={4}
          borderRadius="md"
          border="1px solid #ccc"
        >
          {" "}
          <Box>
            {" "}
            <Controller
              control={control}
              {...register("bannerImage", { required: true })}
              render={({
                field: { onChange, onBlur, value, name, ref },
                formState: { errors },
              }) => (
                <FormControl
                  isInvalid={!!errors?.bannerImage}
                  id="banner-image"
                >
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      handleImageChange(e);
                      onChange(e.target.files); // Passing the file data to react-hook-form
                    }}
                    onBlur={onBlur}
                    name={name}
                    ref={ref}
                    placeholder="Upload Image"
                  />
                  {errors?.bannerImage && (
                    <FormHelperText color="red.300">
                      Image upload is required!
                    </FormHelperText>
                  )}
                </FormControl>
              )}
            />
          </Box>
          {/* Nhập tên nút */}
          <FormControl>
            <InputGroup>
              <Input
                type="text"
                placeholder="Nhập tên button"
                value={button.name}
                onChange={(e) =>
                  handleInputChange(button.id, "name", e.target.value)
                }
              />
            </InputGroup>
          </FormControl>
          {/* Chọn loại hành động */}
          <FormControl>
            <Select
              placeholder="Chọn loại hành động"
              value={button.type}
              onChange={(e) =>
                handleInputChange(button.id, "type", e.target.value)
              }
            >
              <option value="url">Mở URL</option>
              <option value="call">Gọi điện</option>
            </Select>
          </FormControl>
          <FormControl>
            <InputGroup>
              <Input
                type={button.type === "call" ? "tel" : "text"}
                placeholder={
                  button.type === "call" ? "Nhập số điện thoại" : "Nhập URL"
                }
                value={button.value}
                onChange={(e) =>
                  handleInputChange(button.id, "value", e.target.value)
                }
              />
            </InputGroup>
          </FormControl>
          <Button colorScheme="red" onClick={() => removeButton(button.id)}>
            Xóa
          </Button>
        </HStack>
      ))}
      {buttons.length >= maxButtons && (
        <Text color="red.500" fontSize="sm">
          Đã đạt tối đa 4 nút thao tác.
        </Text>
      )}
      <Box>
        <Button
          onClick={addButton}
          colorScheme="teal"
          mt={4}
          isDisabled={buttons.length >= maxButtons}
        >
          Thêm nút thao tác
        </Button>
      </Box>
    </Stack>
  );
};
