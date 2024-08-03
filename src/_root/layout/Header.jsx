import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Input, Avatar, Button, Layout, Spin } from "antd";
import { HomeOutlined, AntDesignOutlined, MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";
import LanguageSelector from "../components/lang/LanguageSelector";
import Bildirim from "../components/Notification/Bildirim";
import Hatirlatici from "../components/Hatirlatici/Hatirlatici";
import { t } from "i18next";
import AxiosInstance from "../../api/http";
import styled from "styled-components";

const { Header } = Layout;

const CustomSpin = styled(Spin)`
  .ant-spin-dot-item {
    background-color: #0091ff !important; /* Blue color */
  }
`;

const HeaderComp = ({ collapsed, colorBgContainer, setCollapsed }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const getHatirlatici = async () => {
    try {
      setLoading(true);
      const response = await AxiosInstance.get("/Reminder");
      if (response.data) {
        setData(response.data);
        setLoading(false);
      } else {
        console.error("API response is not in expected format");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getHatirlatici();
  }, []);

  return (
    <Header
      style={{
        background: colorBgContainer,
      }}
    >
      <div className="flex justify-between align-center gap-1 header">
        <div className="flex gap-1 justify-between align-baseline">
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
          <HomeOutlined />
          <LanguageSelector />
        </div>
        <div style={{ gap: "10px" }} className="flex gap-1 justify-between align-center">
          <CustomSpin spinning={loading}>
            <Hatirlatici data={data} getHatirlatici={getHatirlatici} loading={loading} />
          </CustomSpin>
          <Bildirim />
          <Input className="search-input" placeholder={t("arama")} allowClear />
          <Avatar className="header-avatar" icon={<AntDesignOutlined />} />
        </div>
      </div>
    </Header>
  );
};

HeaderComp.propTypes = {
  collapsed: PropTypes.bool,
  colorBgContainer: PropTypes.string,
  setCollapsed: PropTypes.func,
};

export default HeaderComp;
