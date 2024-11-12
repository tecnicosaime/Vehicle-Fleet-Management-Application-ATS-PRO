import React, { useState, useEffect } from "react";
import { Table } from "antd";
import AxiosInstance from "../../../api/http";

const MyTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [setPointId, setSetPointId] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [firstOrderId, setFirstOrderId] = useState(0);
  const [lastOrderId, setLastOrderId] = useState(0);

  const fetchData = async (diff, targetPage) => {
    setLoading(true);
    try {
      let currentSetPointId = 0;

      // diff değerine göre setPointId'yi belirle
      if (diff > 0) {
        // İleri sayfaya gidiliyorsa, mevcut lastOrderId'yi kullan
        currentSetPointId = lastOrderId;
      } else if (diff < 0) {
        // Geri sayfaya gidiliyorsa, mevcut firstOrderId'yi kullan
        currentSetPointId = firstOrderId;
      } else {
        // İlk yüklemede setPointId = 0
        currentSetPointId = 0;
      }

      const response = await AxiosInstance.get(`Fuel/GetFuelList?diff=${diff}&setPointId=${currentSetPointId}&parameter=`);
      const newData = response.data.fuel_list;
      const totalCount = response.data.total_count;
      setTotalCount(totalCount);

      if (Array.isArray(newData) && newData.length > 0) {
        setData(newData);

        // newData'nın ilk ve son objelerinin orderId değerlerini sakla
        const firstItem = newData[0];
        const lastItem = newData[newData.length - 1];
        setFirstOrderId(firstItem.orderId);
        setLastOrderId(lastItem.orderId);

        // Gelecekteki istekler için setPointId'yi güncelle
        if (diff < 0) {
          setSetPointId(firstItem.orderId);
        } else {
          setSetPointId(lastItem.orderId);
        }

        // currentPage'i güncelle
        setCurrentPage(targetPage);
      } else {
        console.log("Veri bulunamadı.");
      }
    } catch (error) {
      console.error("Veri çekilirken hata oluştu:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData(0, 1); // İlk sayfa için diff = 0, targetPage = 1
  }, []);

  const columns = [
    {
      title: "Plaka",
      dataIndex: "plaka",
      key: "plaka",
    },
    {
      title: "Order ID",
      dataIndex: "orderId",
      key: "orderId",
    },
    // Diğer kolonlar...
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey="orderId"
      loading={loading}
      pagination={{
        current: currentPage,
        total: totalCount,
        pageSize: 10,
        showSizeChanger: false,
        showQuickJumper: false,
        onChange: (page) => {
          const diff = page - currentPage;
          fetchData(diff, page);
        },
      }}
    />
  );
};

export default MyTable;
