import { useEffect, useState } from "react";
import { Select } from "antd";
import i18n from "../../../utils/i18n";
import styled from "styled-components";

const { Option } = Select;

const CustomSelect = styled(Select)`
  .ant-select-selector {
    border: none !important;
    box-shadow: none !important;
  }
`;

const LanguageSelector = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  useEffect(() => {
    let storedLanguage = localStorage.getItem("i18nextLng") || "en";
    if (storedLanguage.includes("-")) {
      storedLanguage = storedLanguage.split("-")[0];
    }
    setSelectedLanguage(storedLanguage);
    i18n.changeLanguage(storedLanguage);
  }, []);

  const changeLanguage = (lng) => {
    if (lng.includes("-")) {
      lng = lng.split("-")[0];
    }
    i18n.changeLanguage(lng);
    localStorage.setItem("i18nextLng", lng);
    setSelectedLanguage(lng);
    window.location.reload();
  };

  return (
    <CustomSelect value={selectedLanguage} style={{ width: 120 }} onChange={changeLanguage}>
      <Option value="en">English</Option>
      <Option value="tr">Türkçe</Option>
      <Option value="ru">Русский</Option>
      <Option value="az">Azərbaycan</Option>
    </CustomSelect>
  );
};

export default LanguageSelector;
