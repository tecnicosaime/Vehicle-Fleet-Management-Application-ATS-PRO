import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import AxiosInstance from "../../../../../../../api/http";
import { Button, message, Modal, Popconfirm, DatePicker, Input, ConfigProvider } from "antd";
import { DeleteOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { t } from "i18next";
import dayjs from "dayjs";
import trTR from "antd/lib/locale/tr_TR";
import enUS from "antd/lib/locale/en_US";
import ruRU from "antd/lib/locale/ru_RU";
import azAZ from "antd/lib/locale/az_AZ";
// Import other locales as needed

const localeMap = {
  tr: trTR,
  en: enUS,
  ru: ruRU,
  az: azAZ,
  // Add other mappings here
};

// Define date format mapping based on language
const dateFormatMap = {
  tr: "DD.MM.YYYY",
  en: "MM/DD/YYYY",
  ru: "DD.MM.YYYY",
  az: "DD.MM.YYYY",
  // Add other mappings here
};

// Define time format mapping based on language
const timeFormatMap = {
  tr: "HH:mm",
  en: "hh:mm A",
  ru: "HH:mm",
  az: "HH:mm",
  // Add other mappings here
};

export default function ArsivdenCikar({ selectedRows, refreshTableData, disabled, hidePopover }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [localeDateFormat, setLocaleDateFormat] = useState("MM/DD/YYYY"); // Default format
  const [localeTimeFormat, setLocaleTimeFormat] = useState("HH:mm"); // Default format
  // Sil düğmesini gizlemek için koşullu stil
  const buttonStyle = disabled ? { display: "none" } : {};

  const methods = useForm({
    defaultValues: {
      selectedDate: "",
      aciklama: "",
      // ... Tüm default değerleriniz
    },
  });

  const { setValue, reset, handleSubmit, control } = methods;

  // İşlemni tetikleyecek fonksiyon
  const onSubmit = async (data) => {
    let isError = false;
    try {
      for (const row of selectedRows) {
        const body = {
          aracId: row.key,
          durum: false,
          tarih: data.selectedDate && dayjs(data.selectedDate).isValid() ? dayjs(data.selectedDate).format("YYYY-MM-DD") : null,
          aciklama: data.aciklama,
        };
        const response = await AxiosInstance.post(`Vehicle/ArchiveVehicle`, body);
        console.log("İşlem başarılı:", response);
        if (response.data.statusCode === 200 || response.data.statusCode === 201 || response.data.statusCode === 202 || response.data.statusCode === 204) {
          message.success(`İşlem Başarılı ${row.plaka}`);
        } else if (response.data.statusCode === 401) {
          message.error("Bu işlemi yapmaya yetkiniz bulunmamaktadır.");
          isError = true;
          break;
        } else {
          message.error("İşlem Başarısız.");
          isError = true;
          break;
        }
      }
    } catch (error) {
      console.error("İşlem sırasında hata oluştu:", error);
      message.error("İşlem sırasında hata oluştu.");
      isError = true;
    }
    if (!isError) {
      refreshTableData();
      hidePopover();
      setIsModalVisible(false);
      reset(); // Formu sıfırla
    }
  };

  // Kullanıcının dilini localStorage'den alın
  const currentLang = localStorage.getItem("i18nextLng") || "en";
  const currentLocale = localeMap[currentLang] || enUS;

  useEffect(() => {
    // Ay ve tarih formatını dil bazında ayarlayın
    const selectedDateFormat = dateFormatMap[currentLang] || "MM/DD/YYYY";
    setLocaleDateFormat(selectedDateFormat);

    const selectedTimeFormat = timeFormatMap[currentLang] || "HH:mm";
    setLocaleTimeFormat(selectedTimeFormat);
  }, [currentLang]);

  // Modal kapandığında formu sıfırla
  const handleCancel = () => {
    setIsModalVisible(false);
    reset(); // Formu sıfırla
  };

  return (
    <div style={buttonStyle}>
      <div style={{ marginTop: "8px", cursor: "pointer" }} onClick={() => setIsModalVisible(true)}>
        Arşivden Çıkar
      </div>

      <Modal title="Arşivden Çıkar" open={isModalVisible} onOk={methods.handleSubmit(onSubmit)} onCancel={handleCancel}>
        <ConfigProvider locale={currentLocale}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <Controller
              name="selectedDate"
              control={control}
              render={({ field }) => <DatePicker {...field} style={{ width: "100%", marginBottom: 8 }} format={localeDateFormat} placeholder={t("Tarih seçiniz")} />}
            />
            <Controller name="aciklama" control={control} render={({ field }) => <Input.TextArea {...field} rows={4} placeholder={t("Açıklama")} style={{ marginTop: 8 }} />} />
          </form>
        </ConfigProvider>
      </Modal>
    </div>
  );
}
// ...existing code...
