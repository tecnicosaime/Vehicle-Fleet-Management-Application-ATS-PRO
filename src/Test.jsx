import React, { useEffect, useState } from "react";
import { Table, Select, Input, Button } from "antd";
import AxiosInstance from "../../../../../../../../api/http";

const { Option } = Select;

const EkspertizTable = ({ onSelectChange, selectedOptions, vehicleExpertData, getData }) => {
  const [data, setData] = useState([]);
  const [options, setOptions] = useState([]);

  const fetchOptions = async () => {
    try {
      const response = await AxiosInstance.get("AppraisalsSettings/GetAppraisalsSettings");
      const apiData = response.data;

      const newOptions = apiData.map((item) => ({
        id: item.aracEkspertizAyarId,
        value: item.aracEkspertizDurum,
      }));

      // Sadece options'u güncelle
      setData((prevData) =>
        prevData.map((item) => ({
          ...item,
          options: newOptions, // Sadece options'u güncelle, diğer alanlara dokunma
        }))
      );
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    const formattedData = [
      {
        key: "1",
        title: "1 - Sol Ön Çamurluk",
        options: options,
        aciklama: vehicleExpertData?.aracEkspertizAciklama1 || "",
        selectedOption: vehicleExpertData?.parcaDurum1 || "",
        selectedOptionID: vehicleExpertData?.parcaAyar1 || "",
      },
      {
        key: "2",
        title: "2 - Sol Ön Kapı",
        options: options,
        aciklama: vehicleExpertData?.aracEkspertizAciklama2 || "",
        selectedOption: vehicleExpertData?.parcaDurum2 || "",
        selectedOptionID: vehicleExpertData?.parcaAyar2 || "",
      },
      // Diğer elemanlar aynı şekilde eklenir...
    ];

    setData(formattedData);
  }, [vehicleExpertData]); // vehicleExpertData değiştiğinde yeniden oluşturulur

  useEffect(() => {
    fetchOptions(); // İlk başta options'u yüklemek için
  }, []);

  const handleSelectChange = (title, value, id) => {
    const newData = data.map((item) => (item.title === title ? { ...item, selectedOption: value, selectedOptionID: id } : item));
    setData(newData);
    onSelectChange(title, value, id);
  };

  const handleAciklamaChange = (key, value) => {
    const newData = data.map((item) => (item.key === key ? { ...item, aciklama: value } : item));
    setData(newData);
  };

  const columns = [
    {
      title: "Aksam",
      dataIndex: "title",
      key: "title",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Durum",
      dataIndex: "options",
      key: "options",
      render: (options, record) => (
        <Select
          style={{ width: 120 }}
          value={record.selectedOption}
          onDropdownVisibleChange={(open) => {
            if (open) {
              fetchOptions(); // Fetch options again when dropdown is opened
            }
          }}
          onChange={(value, option) => handleSelectChange(record.title, value, option.key)}
        >
          {options.map((option) => (
            <Option key={option.id} value={option.value}>
              {option.value}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: "Açıklama",
      dataIndex: "aciklama",
      key: "aciklama",
      render: (text, record) => <Input value={record.aciklama} onChange={(e) => handleAciklamaChange(record.key, e.target.value)} placeholder="Açıklama giriniz" />,
    },
  ];

  const handleLogData = () => {
    console.log(data);
  };

  return (
    <>
      <Button onClick={handleLogData}>Log Table Data</Button>
      <Table dataSource={data} columns={columns} pagination={false} size="small" />
    </>
  );
};

export default EkspertizTable;
