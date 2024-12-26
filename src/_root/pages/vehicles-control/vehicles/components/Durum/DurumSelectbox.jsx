import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Select } from "antd";
import { t } from "i18next";

const { Option } = Select;

const DURUM_OPTIONS = [
  { value: 8, label: t("tumu") },
  { value: 1, label: t("aktifAraclar") },
  { value: 2, label: t("pasifAraclar") },
  { value: 3, label: t("arsivdekiAraclar") },
  { value: 4, label: t("periyodikAraclar") },
  { value: 5, label: t("servistekiAraclar") },
  { value: 6, label: t("yenilemeSuresiYaklasanlar") },
  { value: 7, label: t("seferdeOlanAraclar") },
];

const DurumSelect = () => {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  return (
    <Controller
      name="durum"
      control={control}
      render={({ field }) => (
        <Select {...field} placeholder="Durum Seçin" style={{ width: "200px" }} allowClear>
          {DURUM_OPTIONS.map((option) => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>
      )}
    />
  );
};

export default DurumSelect;
