import React, { useState } from "react";
import { Modal, Input, Button, Typography } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import AxiosInstance from "../../../../../../../../../api/http";

const { Text } = Typography;

function OzelAlanlar(props) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [clickedField, setClickedField] = useState("");
  const [inputValue, setInputValue] = useState("");

  const showModal = (field) => {
    setClickedField(field);
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      await AxiosInstance.post(
        `/CustomField/AddCustomFieldTopic?form=SERVIS&topic=${inputValue}&field=${clickedField}`
      );
      setIsModalVisible(false);
      setInputValue("");
    } catch (error) {
      console.error("API request failed: ", error);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setInputValue("");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          maxWidth: "450px",
          gap: "10px",
          rowGap: "0px",
        }}
      >
        <Text
          style={{ fontSize: "14px", cursor: "pointer" }}
          onClick={() => showModal("OZELALAN_1")}
        >
          Özel Alan 1:
        </Text>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            maxWidth: "300px",
            minWidth: "300px",
            gap: "10px",
            width: "100%",
          }}
        >
          <Controller
            name="ozelAlan1"
            control={control}
            render={({ field }) => <Input {...field} style={{ flex: 1 }} />}
          />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          maxWidth: "450px",
          gap: "10px",
          rowGap: "0px",
        }}
      >
        <Text
          style={{ fontSize: "14px", cursor: "pointer" }}
          onClick={() => showModal("OZELALAN_2")}
        >
          Özel Alan 2:
        </Text>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            maxWidth: "300px",
            minWidth: "300px",
            gap: "10px",
            width: "100%",
          }}
        >
          <Controller
            name="ozelAlan2"
            control={control}
            render={({ field }) => <Input {...field} style={{ flex: 1 }} />}
          />
        </div>
      </div>

      <Modal
        title="Özel Alan Girişi"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Değer giriniz"
        />
      </Modal>
    </div>
  );
}

export default OzelAlanlar;
