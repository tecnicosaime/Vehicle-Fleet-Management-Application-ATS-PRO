import React, { useState, createRef, useEffect } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Select, Typography, Divider, Button, Input, message, Space } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const { Text, Link } = Typography;

export default function Plaka({ disabled, fieldRequirements, selectedRowsData }) {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext();

  const [options, setOptions] = useState([]);
  const inputRef = createRef();
  const [name, setName] = useState("");
  const [selectKey, setSelectKey] = useState(0);

  // Message API
  const [messageApi, contextHolder] = message.useMessage();

  // Update options when selectedRowsData changes
  useEffect(() => {
    if (selectedRowsData && selectedRowsData.length > 0) {
      setOptions(selectedRowsData);
    }
  }, [selectedRowsData]);

  const onNameChange = (e) => {
    setName(e.target.value);
  };

  // Add new item to the select box
  const addItem = () => {
    if (name.trim() !== "") {
      if (options.some((option) => option.plaka === name)) {
        messageApi.open({
          type: "warning",
          content: "Bu plaka zaten mevcut!",
        });
        return;
      }

      const newId = Date.now(); // Generate a unique ID for the new item

      messageApi.open({
        type: "success",
        content: "Plaka başarıyla eklendi",
      });

      setOptions((prevOptions) => [...prevOptions, { aracId: newId, plaka: name }]);
      setSelectKey((prevKey) => prevKey + 1);
      setName("");
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px", justifyContent: "space-between" }}>
      {contextHolder}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", flexDirection: "column" }}>
        <Controller
          name="Plaka"
          control={control}
          rules={{ required: "Alan boş bırakılamaz!" }}
          render={({ field }) => (
            <Select
              {...field}
              status={errors.Plaka ? "error" : ""}
              disabled={disabled}
              key={selectKey}
              style={{ width: "180px" }}
              showSearch
              allowClear
              placeholder="Plaka seçiniz"
              optionFilterProp="children"
              filterOption={(input, option) => (option.label ? option.label.toLowerCase().includes(input.toLowerCase()) : false)}
              options={options.map((item) => ({
                value: item.aracId, // Use the ID as the value
                label: item.plaka, // Display the plaka in the dropdown
              }))}
              onChange={(value) => {
                setValue("Plaka", value ?? null);
                setValue("PlakaID", value ?? null);
                field.onChange(value ?? null);
              }}
              value={field.value ?? null}
              dropdownRender={(menu) => (
                <>
                  {menu}
                  <Divider
                    style={{
                      margin: "8px 0",
                    }}
                  />
                  <Space
                    style={{
                      padding: "0 8px 4px",
                    }}
                  >
                    <Input placeholder="Yeni plaka" ref={inputRef} value={name} onChange={onNameChange} />
                    <Button type="text" icon={<PlusOutlined />} onClick={addItem}>
                      Ekle
                    </Button>
                  </Space>
                </>
              )}
            />
          )}
        />
        <Controller name="PlakaID" control={control} render={({ field }) => <Input {...field} type="hidden" />} />
        {errors.Plaka && <div style={{ color: "red", marginTop: "5px" }}>{errors.Plaka.message}</div>}
      </div>
    </div>
  );
}
