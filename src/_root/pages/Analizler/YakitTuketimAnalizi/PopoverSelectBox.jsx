import React, { useState, useEffect } from "react";
import { Popover, Input, Spin } from "antd";
import AxiosInstance from "../../../../api/http.jsx";
import { Controller, useFormContext } from "react-hook-form";

const PopoverSelectBox = () => {
  const {
    control,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext();
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // API çağrısı burada yapılacak
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await AxiosInstance.get("Location/GetLocationList"); // API URL'si
        setData(response.data); // API'den gelen veriler state'e atanıyor
      } catch (error) {
        console.error("API hata:", error);
      }
      setLoading(false);
    };

    if (visible) {
      fetchData(); // Popover açıldığında veriler getiriliyor
    }
  }, [visible]);

  const handleSelect = (value, id) => {
    setValue("locationName", value); // İsim için React Hook Form'daki input'un değerini ayarla
    setValue("locationId", id); // ID için React Hook Form'daki input'un değerini ayarla
    setVisible(false); // Seçim yapıldığında Popover kapanıyor
  };

  const popoverContent = (
    <div style={{ width: "400px", height: "200px", overflowY: "auto" }}>
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
          <Spin /> {/* Loading spinner */}
        </div>
      ) : (
        data.map((item) => (
          <div
            key={item.lokasyonId}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "5px 10px",
              borderRadius: "5px",
              cursor: "pointer",
              backgroundColor: getValues("locationName") === item.lokasyonTanim ? "#0086ff5c" : "white",
              border: getValues("locationName") === item.lokasyonTanim ? "1px solid #0097ff" : "none",
              marginBottom: "5px",
            }}
            onClick={() => handleSelect(item.lokasyonTanim, item.lokasyonId)}
          >
            <span>{item.lokasyonTanim}</span>
          </div>
        ))
      )}
    </div>
  );

  return (
    <div style={{ maxWidth: "400px" }}>
      {/* Popover ile kontrol edilen, görünen input (Lokasyon ismi) */}
      <Popover content={popoverContent} trigger="click" open={visible} onOpenChange={(visible) => setVisible(visible)}>
        <Controller
          name="locationName" // React Hook Form'daki input'un ismi
          control={control}
          render={({ field }) => <Input {...field} placeholder="Seçim yapın" readOnly onClick={() => setVisible(true)} />}
        />
      </Popover>

      {/* Gizli input (Lokasyon ID'si) */}
      <Controller
        name="locationId" // React Hook Form'daki gizli input'un ismi
        control={control}
        render={({ field }) => <Input {...field} style={{ display: "none" }} />}
      />
    </div>
  );
};

export default PopoverSelectBox;
