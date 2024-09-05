import React, { useEffect } from "react";
import { Button, Modal, Typography } from "antd";
import { t } from "i18next";
import Table from "./Table/Table.jsx";
import { FormProvider, useForm } from "react-hook-form";
import AxiosInstance from "../../../../../../api/http.jsx";

const { Text } = Typography;

function PeryodikBakimlar({ visible, onClose, ids }) {
  const formMethods = useForm();
  const [data, setData] = React.useState([]);

  const fetchData = async () => {
    try {
      const response = await AxiosInstance.get(`Fuel/GetFuelCardContentById?vehicleId=${ids}`);
      if (response.data) {
        setData(response.data);
      }
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };

  useEffect(() => {
    if (ids) {
      fetchData();
    }
  }, [ids]);

  const footer = [
    <Button key="back" className="btn cancel-btn" onClick={onClose}>
      {t("kapat")}
    </Button>,
  ];

  return (
    <FormProvider {...formMethods}>
      <div>
        <Modal title={`Servis Bilgileri - Plaka: [${data?.plaka}]`} open={visible} onCancel={onClose} maskClosable={false} footer={footer} width={1200}>
          <Table ids={ids} />
        </Modal>
      </div>
    </FormProvider>
  );
}

export default PeryodikBakimlar;
