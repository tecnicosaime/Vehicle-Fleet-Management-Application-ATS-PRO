import React from "react";
import { Tabs } from "antd";
import MainTabs from "./MainTabs/MainTabs";
import Yetkiler from "./Yetkiler/Yetkiler";
import LokasyonYetkileri from "./LokasyonYetkileri/LokasyonYetkileri";
import { t } from "i18next";

function Tablar() {
  const items = [
    {
      key: "1",
      label: t("hesap"),
      children: <MainTabs />,
    },
    {
      key: "2",
      label: t("lokasyonlar"),
      children: <LokasyonYetkileri />,
    },
    {
      key: "3",
      label: t("yetkiler"),
      children: <Yetkiler />,
    },
  ];
  return <Tabs defaultActiveKey="1" items={items} />;
}

export default Tablar;
