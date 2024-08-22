import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { InputNumber, Typography } from "antd";

const { Text } = Typography;

const MyComponent = ({ iscilikUcreti }) => {
  const { control, watch, setValue } = useForm();

  const indirimYuzde = watch("indirimYuzde");
  const indirimOrani = watch("indirimOrani");

  useEffect(() => {
    if (indirimYuzde !== undefined && indirimYuzde !== null) {
      const calculatedIndirimOrani = (iscilikUcreti * indirimYuzde) / 100;
      setValue("indirimOrani", calculatedIndirimOrani);
    }
  }, [indirimYuzde, iscilikUcreti, setValue]);

  useEffect(() => {
    if (indirimOrani !== undefined && indirimOrani !== null) {
      const calculatedIndirimYuzde = (indirimOrani / iscilikUcreti) * 100;
      setValue("indirimYuzde", calculatedIndirimYuzde);
    }
  }, [indirimOrani, iscilikUcreti, setValue]);

  return (
    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", maxWidth: "300px", minWidth: "300px", gap: "10px", width: "100%" }}>
      <Controller
        name="indirimYuzde"
        control={control}
        render={({ field }) => <InputNumber {...field} style={{ flex: 1 }} prefix={<Text style={{ color: "#0091ff" }}>%</Text>} />}
      />
      <Controller name="indirimOrani" control={control} render={({ field }) => <InputNumber {...field} style={{ flex: 1 }} />} />
    </div>
  );
};

export default MyComponent;
