import React, { useEffect, useState } from "react";
import { Drawer, Typography, Button, Input, Select, DatePicker, TimePicker, Row, Col, Checkbox } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import LokasyonTipi from "./components/LokasyonTipi";
import LokasyonBina from "./components/LokasyonBina";
import ServisKoduTablo from "./components/ServisKoduTablo.jsx";
import LokasyonKat from "./components/LokasyonKat";
import LokasyonPersonelTablo from "./components/LokasyonPersonelTablo";
import LokasyonDepoTablo from "./components/LokasyonDepoTablo";
import styled from "styled-components";
import LokasyonTablo from "./components/LokasyonTablo";
import GoogleMaps from "./components/GoogleMaps.jsx";
import Plaka from "./components/Plaka.jsx";
import Surucu from "./components/Surucu.jsx";
import dayjs from "dayjs";

const { Text, Link } = Typography;
const { TextArea } = Input;

const StyledInput = styled(Input)`
  @media (min-width: 600px) {
    max-width: 720px;
  }
  @media (max-width: 600px) {
    max-width: 300px;
  }
`;

const StyledDiv = styled.div`
  @media (min-width: 600px) {
    width: 100%;
    max-width: 720px;
  }
  @media (max-width: 600px) {
    width: 100%;
    max-width: 300px;
  }
`;

const StyledDivBottomLine = styled.div`
  @media (min-width: 600px) {
    alignitems: "center";
  }
  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const StyledDivMedia = styled.div`
  .anar {
    @media (min-width: 600px) {
      max-width: 720px;
      width: 100%;
    }
    @media (max-width: 600px) {
      flex-direction: column;
      align-items: flex-start;
    }
  }
`;

export default function MainTabs({ modalOpen }) {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();
  const [localeDateFormat, setLocaleDateFormat] = useState("DD/MM/YYYY"); // Varsayılan format
  const [localeTimeFormat, setLocaleTimeFormat] = useState("HH:mm"); // Default time format

  const handleMinusClick = () => {
    setValue("servisKodu", "");
    setValue("servisKoduID", "");
    setValue("servisTanimi", "");
    setValue("servisTipi", "");
    setValue("servisTipiID", "");
  };

  const handleYoneticiMinusClick = () => {
    setValue("lokasyonYoneticiTanim", "");
    setValue("lokasyonYoneticiID", "");
  };

  const handleDepoMinusClick = () => {
    setValue("lokasyonDepoTanim", "");
    setValue("lokasyonDepoID", "");
  };

  const handleAnaLokasyonMinusClick = () => {
    setValue("anaLokasyonTanim", "");
    setValue("anaLokasyonID", "");
  };

  const selectedLokasyonId = watch("selectedLokasyonId");

  // duzenlenmeTarihi ve duzenlenmeSaati alanlarının boş ve ye sistem tarih ve saatinden büyük olup olmadığını kontrol etmek için bir fonksiyon

  const validateDateTime = (value) => {
    const date = watch("duzenlenmeTarihi");
    const time = watch("duzenlenmeSaati");
    if (!date || !time) {
      return "Alan Boş Bırakılamaz!";
    }
    const currentTime = dayjs();
    const inputDateTime = dayjs(`${dayjs(date).format("YYYY-MM-DD")} ${dayjs(time).format("HH:mm")}`);
    if (inputDateTime.isAfter(currentTime)) {
      return "Düzenlenme tarihi ve saati mevcut tarih ve saatten büyük olamaz";
    }
    return true;
  };

  // duzenlenmeTarihi ve duzenlenmeSaati alanlarının boş ve ye sistem tarih ve saatinden büyük olup olmadığını kontrol etmek için bir fonksiyon sonu

  // sistemin o anki tarih ve saatini almak için

  useEffect(() => {
    if (modalOpen) {
      const currentDate = dayjs(); // Şu anki tarih için dayjs nesnesi
      const currentTime = dayjs(); // Şu anki saat için dayjs nesnesi

      // Tarih ve saat alanlarını güncelle
      setTimeout(() => {
        setValue("duzenlenmeTarihi", currentDate);
        setValue("duzenlenmeSaati", currentTime);
      }, 50);
    }
  }, [modalOpen, setValue]);

  // sistemin o anki tarih ve saatini almak sonu

  // tarihleri kullanıcının local ayarlarına bakarak formatlayıp ekrana o şekilde yazdırmak için

  // Intl.DateTimeFormat kullanarak tarih formatlama
  const formatDate = (date) => {
    if (!date) return "";

    // Örnek bir tarih formatla ve ay formatını belirle
    const sampleDate = new Date(2021, 0, 21); // Ocak ayı için örnek bir tarih
    const sampleFormatted = new Intl.DateTimeFormat(navigator.language).format(sampleDate);

    let monthFormat;
    if (sampleFormatted.includes("January")) {
      monthFormat = "long"; // Tam ad ("January")
    } else if (sampleFormatted.includes("Jan")) {
      monthFormat = "short"; // Üç harfli kısaltma ("Jan")
    } else {
      monthFormat = "2-digit"; // Sayısal gösterim ("01")
    }

    // Kullanıcı için tarihi formatla
    const formatter = new Intl.DateTimeFormat(navigator.language, {
      year: "numeric",
      month: monthFormat,
      day: "2-digit",
    });
    return formatter.format(new Date(date));
  };

  const formatTime = (time) => {
    if (!time || time.trim() === "") return ""; // `trim` metodu ile baştaki ve sondaki boşlukları temizle

    try {
      // Saati ve dakikayı parçalara ayır, boşlukları temizle
      const [hours, minutes] = time
        .trim()
        .split(":")
        .map((part) => part.trim());

      // Saat ve dakika değerlerinin geçerliliğini kontrol et
      const hoursInt = parseInt(hours, 10);
      const minutesInt = parseInt(minutes, 10);
      if (isNaN(hoursInt) || isNaN(minutesInt) || hoursInt < 0 || hoursInt > 23 || minutesInt < 0 || minutesInt > 59) {
        throw new Error("Invalid time format");
      }

      // Geçerli tarih ile birlikte bir Date nesnesi oluştur ve sadece saat ve dakika bilgilerini ayarla
      const date = new Date();
      date.setHours(hoursInt, minutesInt, 0);

      // Kullanıcının lokal ayarlarına uygun olarak saat ve dakikayı formatla
      // `hour12` seçeneğini belirtmeyerek Intl.DateTimeFormat'ın kullanıcının yerel ayarlarına göre otomatik seçim yapmasına izin ver
      const formatter = new Intl.DateTimeFormat(navigator.language, {
        hour: "numeric",
        minute: "2-digit",
        // hour12 seçeneği burada belirtilmiyor; böylece otomatik olarak kullanıcının sistem ayarlarına göre belirleniyor
      });

      // Formatlanmış saati döndür
      return formatter.format(date);
    } catch (error) {
      console.error("Error formatting time:", error);
      return ""; // Hata durumunda boş bir string döndür
    }
  };

  // tarihleri kullanıcının local ayarlarına bakarak formatlayıp ekrana o şekilde yazdırmak için sonu

  // tarih formatlamasını kullanıcının yerel tarih formatına göre ayarlayın

  useEffect(() => {
    // Format the date based on the user's locale
    const dateFormatter = new Intl.DateTimeFormat(navigator.language);
    const sampleDate = new Date(2021, 10, 21);
    const formattedSampleDate = dateFormatter.format(sampleDate);
    setLocaleDateFormat(formattedSampleDate.replace("2021", "YYYY").replace("21", "DD").replace("11", "MM"));

    // Format the time based on the user's locale
    const timeFormatter = new Intl.DateTimeFormat(navigator.language, {
      hour: "numeric",
      minute: "numeric",
    });
    const sampleTime = new Date(2021, 10, 21, 13, 45); // Use a sample time, e.g., 13:45
    const formattedSampleTime = timeFormatter.format(sampleTime);

    // Check if the formatted time contains AM/PM, which implies a 12-hour format
    const is12HourFormat = /AM|PM/.test(formattedSampleTime);
    setLocaleTimeFormat(is12HourFormat ? "hh:mm A" : "HH:mm");
  }, []);

  // tarih formatlamasını kullanıcının yerel tarih formatına göre ayarlayın sonu

  return (
    <div
      style={{
        display: "flex",
        marginBottom: "15px",
        flexDirection: "column",
        gap: "10px",
        maxWidth: "870px",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <div style={{ width: "100%", maxWidth: "330px" }}>
          <StyledDivBottomLine
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Text
              style={{
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              Plaka:
            </Text>
            <Plaka />
          </StyledDivBottomLine>
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            maxWidth: "450px",
            gap: "10px",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ fontSize: "14px", fontWeight: "600" }}>Düzenlenme Tarihi:</Text>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              maxWidth: "300px",
              minWidth: "300px",
              gap: "10px",
              width: "100%",
            }}
          >
            <Controller
              name="duzenlenmeTarihi"
              control={control}
              rules={{ validate: validateDateTime }}
              render={({ field, fieldState: { error } }) => (
                <DatePicker {...field} status={error ? "error" : ""} style={{ width: "180px" }} format={localeDateFormat} placeholder="Tarih seçiniz" />
              )}
            />
            {/*{errors.duzenlenmeTarihi && (*/}
            {/*  <div style={{ color: "red" }}>*/}
            {/*    {errors.duzenlenmeTarihi.message}*/}
            {/*  </div>*/}
            {/*)}*/}

            <Controller
              name="duzenlenmeSaati"
              control={control}
              rules={{ validate: validateDateTime }}
              render={({ field, fieldState: { error } }) => (
                <TimePicker {...field} status={error ? "error" : ""} style={{ width: "110px" }} format={localeTimeFormat} placeholder="Saat seçiniz" />
              )}
            />
            {errors.duzenlenmeSaati && <div style={{ color: "red" }}>{errors.duzenlenmeSaati.message}</div>}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            maxWidth: "450px",
          }}
        >
          <Text style={{ fontSize: "14px", fontWeight: "600" }}>Servis Kodu:</Text>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              width: "300px",
            }}
          >
            <Controller
              name="servisKodu"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="text" // Set the type to "text" for name input
                  style={{ width: "215px" }}
                  disabled
                />
              )}
            />
            <Controller
              name="servisKoduID"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="text" // Set the type to "text" for name input
                  style={{ display: "none" }}
                />
              )}
            />
            <ServisKoduTablo
              onSubmit={(selectedData) => {
                setValue("servisKodu", selectedData.bakimKodu);
                setValue("servisKoduID", selectedData.key);
                setValue("servisTanimi", selectedData.tanim);
                setValue("servisTipi", selectedData.servisTipi);
                setValue("servisTipiID", selectedData.servisTipiKodId);
              }}
            />
            <Button onClick={handleMinusClick}> - </Button>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            maxWidth: "450px",
            gap: "10px",
            rowGap: "0px",
          }}
        >
          <Text style={{ fontSize: "14px" }}>Servis Tanımı:</Text>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              maxWidth: "300px",
              minWidth: "300px",
              gap: "10px",
              width: "100%",
            }}
          >
            <Controller name="servisTanimi" control={control} render={({ field }) => <Input {...field} disabled style={{ flex: 1 }} />} />
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            maxWidth: "450px",
            gap: "10px",
            rowGap: "0px",
          }}
        >
          <Text style={{ fontSize: "14px" }}>Servis Tipi:</Text>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              maxWidth: "300px",
              minWidth: "300px",
              gap: "10px",
              width: "100%",
            }}
          >
            <Controller name="servisTipi" control={control} render={({ field }) => <Input {...field} disabled style={{ flex: 1 }} />} />
          </div>
        </div>
        <div style={{ width: "100%", maxWidth: "330px" }}>
          <StyledDivBottomLine
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Text
              style={{
                fontSize: "14px",
              }}
            >
              Sürücü:
            </Text>
            <Surucu />
          </StyledDivBottomLine>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          gap: "10px",
          rowGap: "0px",
        }}
      >
        <Text style={{ fontSize: "14px" }}>Lokasyon Tanımı:</Text>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            maxWidth: "720px",
            minWidth: "300px",
            gap: "10px",
            width: "100%",
          }}
        >
          <Controller name="lokasyonTanimi" control={control} render={({ field }) => <Input {...field} style={{ flex: 1 }} />} />
          <Controller
            name="selectedLokasyonId"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="text" // Set the type to "text" for name input
                style={{ display: "none" }}
              />
            )}
          />
          <Controller
            name="lokasyonAktif"
            control={control}
            defaultValue={true} // or true if you want it checked by default
            render={({ field }) => (
              <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)}>
                Aktif
              </Checkbox>
            )}
          />
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            maxWidth: "450px",
            gap: "10px",
            width: "100%",
          }}
        >
          <LokasyonTipi />
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            maxWidth: "410px",
            gap: "10px",
            width: "100%",
          }}
        >
          <LokasyonBina />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            maxWidth: "410px",
            gap: "10px",
            width: "100%",
          }}
        >
          <LokasyonKat />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          flexWrap: "wrap",
        }}
      >
        <StyledDivBottomLine
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            width: "100%",
            maxWidth: "450px",
          }}
        >
          <Text style={{ fontSize: "14px" }}>Yönetici:</Text>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              width: "300px",
            }}
          >
            <Controller
              name="lokasyonYoneticiTanim"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="text" // Set the type to "text" for name input
                  style={{ width: "215px" }}
                  disabled
                />
              )}
            />
            <Controller
              name="lokasyonYoneticiID"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="text" // Set the type to "text" for name input
                  style={{ display: "none" }}
                />
              )}
            />
            <LokasyonPersonelTablo
              onSubmit={(selectedData) => {
                setValue("lokasyonYoneticiTanim", selectedData.subject);
                setValue("lokasyonYoneticiID", selectedData.key);
              }}
            />
            <Button onClick={handleYoneticiMinusClick}> - </Button>
          </div>
        </StyledDivBottomLine>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            maxWidth: "410px",
          }}
        >
          <Text style={{ fontSize: "14px" }}>Malzeme Depo:</Text>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              width: "300px",
            }}
          >
            <Controller
              name="lokasyonDepoTanim"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="text" // Set the type to "text" for name input
                  style={{ width: "215px" }}
                  disabled
                />
              )}
            />
            <Controller
              name="lokasyonDepoID"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="text" // Set the type to "text" for name input
                  style={{ display: "none" }}
                />
              )}
            />
            <LokasyonDepoTablo
              onSubmit={(selectedData) => {
                setValue("lokasyonDepoTanim", selectedData.subject);
                setValue("lokasyonDepoID", selectedData.key);
              }}
            />
            <Button onClick={handleDepoMinusClick}> - </Button>
          </div>
        </div>
      </div>
      <StyledDivMedia
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          maxWidth: "870px",
        }}
      >
        <Text style={{ fontSize: "14px" }}>Ana Lokasyon:</Text>
        <div
          className="anar"
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            minWidth: "300px",
            gap: "3px",
          }}
        >
          <Controller
            name="anaLokasyonTanim"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="text" // Set the type to "text" for name input
                style={{ width: "100%", maxWidth: "630px" }}
                disabled
              />
            )}
          />
          <Controller
            name="anaLokasyonID"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="text" // Set the type to "text" for name input
                style={{ display: "none" }}
              />
            )}
          />
          <LokasyonTablo
            onSubmit={(selectedData) => {
              setValue("anaLokasyonTanim", selectedData.lokasyonTanim);
              setValue("anaLokasyonID", selectedData.key);
            }}
          />
          <Button onClick={handleAnaLokasyonMinusClick}> - </Button>
        </div>
      </StyledDivMedia>
      <StyledDivBottomLine
        style={{
          display: "flex",
          flexWrap: "wrap",

          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <Text style={{ fontSize: "14px" }}>E-Mail:</Text>
        <Controller
          name="lokasyonEmail"
          control={control}
          render={({ field }) => (
            <StyledInput
              {...field}
              type="text" // Set the type to "text" for name input
            />
          )}
        />
      </StyledDivBottomLine>
      <StyledDivBottomLine
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-start",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <Text style={{ fontSize: "14px" }}>Açıklama:</Text>
        <StyledDiv>
          <Controller
            name="lokasyonAciklama"
            control={control}
            render={({ field }) => (
              <TextArea
                {...field}
                type="text" // Set the type to "text" for name input
              />
            )}
          />
        </StyledDiv>
      </StyledDivBottomLine>
    </div>
  );
}
