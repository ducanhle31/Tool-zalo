import { forwardRef, useEffect, useState } from "react";
import Select from "react-select";

interface MySelectProps {
  isDisabled?: boolean;
  options: any[];
  onChange?: (c?: any) => void;
  isMulti?: boolean;
  onBlur?: () => void;
  value?: any;
  name?: string;
  placeholder?: string;
}

const MySelect = forwardRef((props: MySelectProps, ref) => {
  const id = Date.now().toString();
  const [isMounted, setIsMounted] = useState(false);
  const { ...args } = props;

  // Must be deleted once
  // https://github.com/JedWatson/react-select/issues/5459 is fixed.
  useEffect(() => setIsMounted(true), []);

  return isMounted ? <Select ref={ref as any} {...args} id={id} /> : null;
});

MySelect.displayName = "MySelect";

export default MySelect;
