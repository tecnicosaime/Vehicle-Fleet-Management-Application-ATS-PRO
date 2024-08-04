import React, { useEffect, useState } from "react";
import { Button, Popover, Typography, Spin, Badge, Modal } from "antd";
import { FaRegCalendarAlt } from "react-icons/fa";
import styled from "styled-components";
import Sigorta from "./components/Sigorta";
import { FormProvider, useForm } from "react-hook-form";

const { Text } = Typography;

const CustomSpin = styled(Spin)`
  .ant-spin-dot-item {
    background-color: #0091ff !important; /* Blue color */
  }
`;

const ContentWrapper = styled.div`
  width: 200px;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  cursor: pointer;
`;

const Indicator = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
`;

const Hatirlatici = ({ data, getHatirlatici, loading }) => {
  const [open, setOpen] = useState(false);
  const [requested, setRequested] = useState(false); // Bayrak
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState(null);

  const methods = useForm(); // Initialize form methods

  useEffect(() => {
    if (open && !requested) {
      getHatirlatici();
      setRequested(true); // Bayrağı ayarla
    }
  }, [open, requested, getHatirlatici]);

  const handleOpenChange = (newOpen) => {
    if (!newOpen) {
      setRequested(false); // Popover kapandığında bayrağı sıfırla
    }
    setOpen(newOpen);
  };

  const handleRowClick = (title, content) => {
    setModalTitle(title);
    setModalContent(content);
    setModalVisible(true);
  };

  const totalReminders = data ? Object.values(data).reduce((acc, currentValue) => acc + currentValue, 0) : 0;

  const content = (
    <ContentWrapper>
      <Text strong style={{ fontSize: "16px" }}>
        Hatırlatıcılar
      </Text>
      <CustomSpin spinning={loading}>
        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          <Row onClick={() => handleRowClick("Sigorta", <Sigorta />)}>
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "5px" }}>
              <Indicator style={{ backgroundColor: "red" }} />
              <Text>Sigorta</Text>
            </div>
            <Text
              style={{
                borderRadius: "8px 8px 8px 8px",
                padding: "1px 7px",
                backgroundColor: "#ff000066",
                color: "red",
              }}
            >
              {data?.sigortaHatirlaticiSayisi}
            </Text>
          </Row>
          <Row onClick={() => handleRowClick("Taşıt Kartı", <div>Taşıt Kartı İçeriği</div>)}>
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "5px" }}>
              <Indicator style={{ backgroundColor: "#009b84" }} />
              <Text>Taşıt Kartı</Text>
            </div>
            <Text
              style={{
                borderRadius: "8px 8px 8px 8px",
                padding: "1px 7px",
                backgroundColor: "rgb(0 155 132 / 35%)",
                color: "#009b84",
              }}
            >
              {data?.aracKartiHatirlaticiSayisi}
            </Text>
          </Row>
          <Row onClick={() => handleRowClick("Ceza Ödeme", <div>Ceza Ödeme İçeriği</div>)}>
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "5px" }}>
              <Indicator style={{ backgroundColor: "rgb(106,14,168)" }} />
              <Text>Ceza Ödeme</Text>
            </div>
            <Text
              style={{
                borderRadius: "8px 8px 8px 8px",
                padding: "1px 7px",
                backgroundColor: "rgb(106 14 168 / 35%)",
                color: "rgb(106,14,168)",
              }}
            >
              {data?.cezaHatirlaticiSayisi}
            </Text>
          </Row>
          <Row onClick={() => handleRowClick("Yakit Tüketimi", <div>Yakit Tüketimi İçeriği</div>)}>
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "5px" }}>
              <Indicator style={{ backgroundColor: "rgb(202,108,0)" }} />
              <Text>Yakit Tüketimi</Text>
            </div>
            <Text
              style={{
                borderRadius: "8px 8px 8px 8px",
                padding: "1px 7px",
                backgroundColor: "rgb(202,108,0,0.35)",
                color: "rgb(202,108,0)",
              }}
            >
              {data?.yakitTuketimiHatirlaticiSayisi}
            </Text>
          </Row>
          <Row onClick={() => handleRowClick("Kiralama", <div>Kiralama İçeriği</div>)}>
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "5px" }}>
              <Indicator style={{ backgroundColor: "rgba(0,196,255,0.88)" }} />
              <Text>Kiralama</Text>
            </div>
            <Text
              style={{
                borderRadius: "8px 8px 8px 8px",
                padding: "1px 7px",
                backgroundColor: "rgb(0,196,255,0.35)",
                color: "rgb(0,161,207)",
              }}
            >
              {data?.kiralamaHatirlaticiSayisi}
            </Text>
          </Row>
          <Row onClick={() => handleRowClick("Stok", <div>Stok İçeriği</div>)}>
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "5px" }}>
              <Indicator style={{ backgroundColor: "rgba(0,59,209,0.88)" }} />
              <Text>Stok</Text>
            </div>
            <Text
              style={{
                borderRadius: "8px 8px 8px 8px",
                padding: "1px 7px",
                backgroundColor: "rgb(0,59,209,0.20)",
                color: "rgb(0,59,209,0.88)",
              }}
            >
              {data?.stokHatirlaticiSayisi}
            </Text>
          </Row>
          <Row onClick={() => handleRowClick("Sürücü", <div>Sürücü İçeriği</div>)}>
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "5px" }}>
              <Indicator style={{ backgroundColor: "rgba(255,117,31,0.88)" }} />
              <Text>Sürücü</Text>
            </div>
            <Text
              style={{
                borderRadius: "8px 8px 8px 8px",
                padding: "1px 7px",
                backgroundColor: "rgb(255,117,31,0.20)",
                color: "rgb(255,117,31,0.88)",
              }}
            >
              {data?.surucuHatirlaticiSayisi}
            </Text>
          </Row>
        </div>
      </CustomSpin>
    </ContentWrapper>
  );

  return (
    <div>
      <FormProvider {...methods}>
        <Popover content={content} trigger="click" open={open} onOpenChange={handleOpenChange}>
          <Badge count={totalReminders} offset={[-3, 3]}>
            <Button type="succes" shape="circle" icon={<FaRegCalendarAlt style={{ fontSize: "20px" }} />}></Button>
          </Badge>
        </Popover>
        <Modal title={modalTitle} open={modalVisible} onCancel={() => setModalVisible(false)} footer={null} width="90%">
          {modalContent}
        </Modal>
      </FormProvider>
    </div>
  );
};

export default Hatirlatici;
