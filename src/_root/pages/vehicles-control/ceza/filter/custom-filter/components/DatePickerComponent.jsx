import React from "react";
import { DatePicker, Space } from "antd";
const onChange = (date, dateString) => {
  console.log(date, dateString);
};
const DatePickerComponent = () => (
  <Space direction="vertical">
    <DatePicker onChange={onChange} />
  </Space>
);
export default DatePickerComponent;
