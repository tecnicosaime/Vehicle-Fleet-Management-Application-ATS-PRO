import tr_TR from "antd/es/locale/tr_TR";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Space, ConfigProvider, Modal, message } from "antd";
import React, { useEffect, useState } from "react";
import MainTabs from "./components/MainTabs/MainTabs";
import { useForm, FormProvider } from "react-hook-form";
import dayjs from "dayjs";
import AxiosInstance from "../../../../../api/http.jsx";
import Footer from "../Footer";
// import SecondTabs from "./components/secondTabs/secondTabs";

export default function CreateModal({ selectedLokasyonId, onRefresh }) {
  const [open, setOpen] = useState(false);
  const showModal = () => {
    setOpen(true);
  };
  const onClose = () => {
    Modal.confirm({
      title: "İptal etmek istediğinden emin misin?",
      content: "Kaydedilmemiş değişiklikler kaybolacaktır.",
      okText: "Evet",
      cancelText: "Hayır",
      onOk: () => {
        setOpen(false);
        methods.reset();
      },
      onCancel: () => {
        // Do nothing, continue from where the user left off
      },
    });
  };

  // back-end'e gönderilecek veriler

  const handleClick = () => {
    const values = methods.getValues();
    console.log(onSubmit(values));
  };

  //* export
  const methods = useForm({
    defaultValues: {
      PlakaID: "",
      Plaka: null,
      duzenlenmeTarihi: null,
      duzenlenmeSaati: null,
      servisKodu: "",
      servisKoduID: "",
      servisTanimi: "",
      servisTipi: "",
      Surucu: null,
      SurucuID: "",
      servisNedeni: null,
      servisNedeniID: "",
      faturaTarihi: null,
      faturaNo: "",
      hasarNo: "",
      hasarNoID: "",
      talepNo: "",
      onay: null,
      onayID: "",
      onayLabel: "",
      baslamaTarihi: null,
      baslamaSaati: null,
      bitisTarihi: null,
      bitisSaati: null,
      aracKM: "",
      isEmriNo: "",
      islemiYapan: "1",
      islemiYapan1: "",
      islemiYapan1ID: "",
      iscilikUcreti: "",
      malzemeUcreti: "",
      digerUcreti: "",
      kdvUcreti: "",
      eksiUcreti: "",
      sigortaBilgileri: false,
      sigorta: "",
      sigortaID: "",
      policeNo: "",
      firma: "",

      durumBilgisi: "",
      garantiKapsami: false,

      surucuOder: false,

      aciklama: "",
      sikayetler: "",
    },
  });

  const formatDateWithDayjs = (dateString) => {
    const formattedDate = dayjs(dateString);
    return formattedDate.isValid() ? formattedDate.format("YYYY-MM-DD") : "";
  };

  const formatTimeWithDayjs = (timeObj) => {
    const formattedTime = dayjs(timeObj);
    return formattedTime.isValid() ? formattedTime.format("HH:mm:ss") : "";
  };

  const { setValue, reset } = methods;

  //* export
  const onSubmit = (data) => {
    const Body = {
      aracId: data.PlakaID,
      bakimId: data.servisKoduID,
      kazaId: data.hasarNoID,
      durumBilgisi: data.durumBilgisi,
      islemiYapan: data.islemiYapan,
      servisNedeniKodId: data.servisNedeniID,

      islemiYapanId: data.islemiYapan1ID,
      surucuId: data.SurucuID,
      // lokasyonId: data.,
      km: data.aracKM,
      indirim: data.eksiUcreti,
      // toplam: data.,
      kdv: data.kdvUcreti,
      diger: data.digerUcreti,
      malzeme: data.malzemeUcreti,
      // iscilik: data.,
      talepNo: data.talepNo,
      onayId: data.onayID,
      tarih: data.duzenlenmeTarihi,
      baslamaTarih: data.baslamaTarihi,
      bitisTarih: data.bitisTarihi,
      faturaTarih: data.faturaTarihi,
      saat: data.duzenlenmeSaati,
      baslamaSaat: data.baslamaSaati,
      bitisSaat: data.bitisSaati,
      faturaNo: data.faturaNo,
      aciklama: data.aciklama,
      sikayetler: data.sikayetler,
      sigortaVar: data.sigortaBilgileri,
      surucuOder: data.surucuOder,
      sigortaId: data.sigortaID,
      ozelAlan1: data.ozelAlan1,
      ozelAlan2: data.ozelAlan2,
      ozelAlan3: data.ozelAlan3,
      ozelAlan4: data.ozelAlan4,
      ozelAlan5: data.ozelAlan5,
      ozelAlan6: data.ozelAlan6,
      ozelAlan7: data.ozelAlan7,
      ozelAlan8: data.ozelAlan8,
      ozelAlanKodId9: data.ozelAlanID9,
      ozelAlanKodId10: data.ozelAlanID10,
      ozelAlan11: data.ozelAlan11,
      ozelAlan12: data.ozelAlan12,
    };

    // AxiosInstance.post("/api/endpoint", { Body }).then((response) => {
    // handle response
    // });

    AxiosInstance.post("Location/AddLocation", Body)
      .then((response) => {
        // Handle successful response here, e.g.:
        console.log("Data sent successfully:", response);

        if (response.data.statusCode === 200 || response.data.statusCode === 201) {
          message.success("Ekleme Başarılı.");
          setOpen(false);
          onRefresh();
          reset();
        } else if (response.data.statusCode === 401) {
          message.error("Bu işlemi yapmaya yetkiniz bulunmamaktadır.");
        } else {
          message.error("Ekleme Başarısız.");
        }
      })
      .catch((error) => {
        // Handle errors here, e.g.:
        console.error("Error sending data:", error);
        message.error("Başarısız Olundu.");
      });
    console.log({ Body });
  };

  useEffect(() => {
    // Eğer selectedLokasyonId varsa ve geçerli bir değerse, formun default değerini güncelle
    if (selectedLokasyonId !== undefined && selectedLokasyonId !== null) {
      methods.reset({
        ...methods.getValues(),
        selectedLokasyonId: selectedLokasyonId,
      });
    }
  }, [selectedLokasyonId, methods]);

  return (
    <FormProvider {...methods}>
      <ConfigProvider locale={tr_TR}>
        <Button
          type="primary"
          onClick={showModal}
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <PlusOutlined />
          Ekle
        </Button>
        <Modal
          width="1300px"
          title="Yeni Kayıt Ekle"
          destroyOnClose
          open={open}
          onCancel={onClose}
          footer={
            <Space>
              <Button onClick={onClose}>İptal</Button>
              <Button
                type="submit"
                onClick={handleClick}
                style={{
                  backgroundColor: "#2bc770",
                  borderColor: "#2bc770",
                  color: "#ffffff",
                }}
              >
                Kaydet
              </Button>
            </Space>
          }
        >
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <div style={{ overflow: "auto", height: "calc(100vh - 250px)" }}>
              <MainTabs modalOpen={open} />
              {/* <SecondTabs /> */}
              {/*<Footer />*/}
            </div>
          </form>
        </Modal>
      </ConfigProvider>
    </FormProvider>
  );
}
