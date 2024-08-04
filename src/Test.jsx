import { useState, useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
import PropTypes from "prop-types";
import { Select } from "antd";
import { CodeControlByUrlService } from "../../../../api/services/code/services";

const Driver = ({ name, codeName, required }) => {
  const [data, setData] = useState([]);
  const { watch, setValue, control } = useFormContext();

  useEffect(() => {
    handleClickSelect();
  }, []);

  const handleClickSelect = async () => {
    try {
      const res = await CodeControlByUrlService("Driver/GetDriverListForSelectInput");
      setData(res.data);
    } catch (error) {
      console.error("Error fetching driver list:", error);
    }
  };

  return (
    <Controller
      name={codeName || "surucuId"}
      control={control}
      rules={{ required: required ? "Bu alan boş bırakılamaz!" : false }}
      render={({ field, fieldState }) => (
        <>
          <Select
            {...field}
            showSearch
            allowClear
            optionFilterProp="children"
            className={fieldState.error ? "input-error" : ""}
            filterOption={(input, option) => (option?.label.toLowerCase() ?? "").includes(input.toLowerCase())}
            filterSort={(optionA, optionB) => (optionA?.label.toLowerCase() ?? "").localeCompare(optionB?.label.toLowerCase() ?? "")}
            options={data.map((item) => ({
              label: item.isim,
              value: item.surucuId,
            }))}
            value={watch(name || "surucu")}
            onChange={(e) => {
              field.onChange(e);
              const selectedOption = data.find((option) => option.surucuId === e);
              if (selectedOption) {
                setValue(name || "surucu", selectedOption.isim);
              } else {
                setValue(name || "surucu", "");
              }
            }}
            onClick={handleClickSelect}
          />
          {fieldState.error && <span style={{ color: "red" }}>{fieldState.error.message}</span>}
        </>
      )}
    />
  );
};

Driver.propTypes = {
  name: PropTypes.string,
  codeName: PropTypes.string,
  required: PropTypes.bool,
};

export default Driver;
