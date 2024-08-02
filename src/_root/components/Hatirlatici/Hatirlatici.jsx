import React, { useEffect, useState } from "react";
import { Button, Popover, Typography, Spin } from "antd";
import { BellOutlined } from "@ant-design/icons";
import { FaRegCalendarAlt } from "react-icons/fa";
import AxiosInstance from "../../../api/http";
import styled from "styled-components";

const { Text } = Typography;

const CustomSpin = styled(Spin)`
  .ant-spin-dot-item {
    background-color: #0091ff !important; /* Blue color */
    gap: 10px;
    display: flex;
    flex-direction: column;
  }
`;

const ContentWrapper = styled.div`
  width: 200px;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const Indicator = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
`;

export default function HatirlaticiPopover() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const getHatirlatici = async () => {
    try {
      setLoading(true);
      const response = await AxiosInstance.get("/Reminder");
      if (response.data) {
        setData(response.data);
        setLoading(false); // Yükleme bittiğinde
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
    if (open) {
      getHatirlatici();
    }
  }, [open]);

  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  };

  const content = (
    <ContentWrapper>
      <Text strong style={{ fontSize: "16px" }}>
        Hatırlatıcılar
      </Text>
      <CustomSpin spinning={loading}>
        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          <Row>
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "5px" }}>
              <Indicator style={{ backgroundColor: "red" }} />
              <Text>Sigorta</Text>
            </div>
            <Text style={{ borderRadius: "8px 8px 8px 8px", padding: "1px 7px", backgroundColor: "#ff000066", color: "red" }}>{data.sigortaHatirlaticiSayisi}</Text>
          </Row>
          <Row>
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "5px" }}>
              <Indicator style={{ backgroundColor: "#009b84" }} />
              <Text>Araç Kartı</Text>
            </div>

            <Text style={{ borderRadius: "8px 8px 8px 8px", padding: "1px 7px", backgroundColor: "rgb(0 155 132 / 35%)", color: "#009b84" }}>
              {data.aracKartiHatirlaticiSayisi}
            </Text>
          </Row>
          <Row>
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "5px" }}>
              <Indicator style={{ backgroundColor: "rgb(106,14,168)" }} />
              <Text>Ceza Ödeme</Text>
            </div>

            <Text style={{ borderRadius: "8px 8px 8px 8px", padding: "1px 7px", backgroundColor: "rgb(106 14 168 / 35%)", color: "rgb(106,14,168)" }}>
              {data.cezaHatirlaticiSayisi}
            </Text>
          </Row>
          <Row>
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "5px" }}>
              <Indicator style={{ backgroundColor: "rgb(202,108,0)" }} />
              <Text>Yakit Tüketimi</Text>
            </div>

            <Text style={{ borderRadius: "8px 8px 8px 8px", padding: "1px 7px", backgroundColor: "rgb(202,108,0,0.35)", color: "rgb(202,108,0)" }}>
              {data.yakitTuketimiHatirlaticiSayisi}
            </Text>
          </Row>
          <Row>
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "5px" }}>
              <Indicator style={{ backgroundColor: "rgba(0,196,255,0.88)" }} />
              <Text>Kiralama</Text>
            </div>

            <Text style={{ borderRadius: "8px 8px 8px 8px", padding: "1px 7px", backgroundColor: "rgb(0,196,255,0.35)", color: "rgb(0,161,207)" }}>
              {data.kiralamaHatirlaticiSayisi}
            </Text>
          </Row>
          <Row>
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "5px" }}>
              <Indicator style={{ backgroundColor: "rgba(0,59,209,0.88)" }} />
              <Text>Stok</Text>
            </div>

            <Text style={{ borderRadius: "8px 8px 8px 8px", padding: "1px 7px", backgroundColor: "rgb(0,59,209,0.20)", color: "rgb(0,59,209,0.88)" }}>
              {data.stokHatirlaticiSayisi}
            </Text>
          </Row>
          <Row>
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "5px" }}>
              <Indicator style={{ backgroundColor: "rgba(255,117,31,0.88)" }} />
              <Text>Sürücü</Text>
            </div>
            <Text style={{ borderRadius: "8px 8px 8px 8px", padding: "1px 7px", backgroundColor: "rgb(255,117,31,0.20)", color: "rgb(255,117,31,0.88)" }}>
              {data.surucuHatirlaticiSayisi}
            </Text>
          </Row>
        </div>
      </CustomSpin>
    </ContentWrapper>
  );

  return (
    <Popover content={content} trigger="click" open={open} onOpenChange={handleOpenChange}>
      <Button type="succes" shape="circle" icon={<FaRegCalendarAlt style={{ fontSize: "20px" }} />}></Button>
    </Popover>
  );
}
