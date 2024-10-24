import React, { useState } from "react";
import { Drawer, Typography, Button, Input, Select, DatePicker, TimePicker, Row, Col, Checkbox, Table } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import LokasyonTablo from "./components/LokasyonTablo";
import { t } from "i18next";

const { Text, Link } = Typography;
const { TextArea } = Input;

function LokasyonYetkileri() {
  const { control, watch, setValue } = useFormContext();
  const [data, setData] = useState([]);

  const handleAnaLokasyonMinusClick = () => {
    setValue("anaLokasyonTanim", "");
    setValue("anaLokasyonID", "");
  };

  const columns = [
    {
      title: t("yetkiliOlunanLokasyon"),
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", width: "100%", flexDirection: "column", justifyContent: "space-between", gap: "8px" }}>
        <Text style={{ fontSize: "14px", color: "#000000a4" }}>{t("lokasyonlar")}</Text>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            minWidth: "300px",
            gap: "10px",
            width: "100%",
          }}
        >
          <Controller
            name="anaLokasyonTanim"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="text" // Set the type to "text" for name input
                style={{ width: "100%", maxWidth: "630px" }}
                disabled
              />
            )}
          />
          <Controller
            name="anaLokasyonID"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="text" // Set the type to "text" for name input
                style={{ display: "none" }}
              />
            )}
          />
          <LokasyonTablo
            onSubmit={(selectedData) => {
              setValue("anaLokasyonTanim", selectedData.lokasyonTanim);
              setValue("anaLokasyonID", selectedData.key);
            }}
          />
          <Button onClick={handleAnaLokasyonMinusClick}> - </Button>
        </div>
      </div>
      <Table columns={columns} dataSource={data} />
    </div>
  );
}

export default LokasyonYetkileri;
