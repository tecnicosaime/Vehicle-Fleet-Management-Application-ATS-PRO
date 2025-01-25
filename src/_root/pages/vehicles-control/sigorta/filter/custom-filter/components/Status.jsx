import React from "react";
import { Select } from "antd";
import { t } from "i18next";

function Status({ value, onChange }) {
  const options = [
    { value: 1, label: t("aktif") },
    { value: 2, label: t("pasif") },
  ];

  return (
    <div style={{ width: "100%" }}>
      <Select value={value === "" ? 1 : value} onChange={onChange} placeholder={t("secimYapiniz")} options={options} style={{ width: "100%" }} />
    </div>
  );
}

export default Status;
