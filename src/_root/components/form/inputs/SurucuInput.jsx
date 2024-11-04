import { Controller, useFormContext } from "react-hook-form";
import PropTypes from "prop-types";
import { Input } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const SurucuInput = ({ name, checked, readonly, onPlusClick }) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => <Input {...field} readOnly={readonly} suffix={<PlusOutlined style={{ color: "#1677ff" }} onClick={onPlusClick} />} />}
    />
  );
};

SurucuInput.propTypes = {
  name: PropTypes.string,
  checked: PropTypes.bool,
  readonly: PropTypes.bool,
  onPlusClick: PropTypes.func,
};

export default SurucuInput;
