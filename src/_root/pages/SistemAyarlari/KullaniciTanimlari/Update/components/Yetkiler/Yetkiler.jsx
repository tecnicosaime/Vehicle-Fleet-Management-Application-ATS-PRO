import React, { useEffect, useState } from "react";
import { Drawer, Typography, Button, Input, Select, DatePicker, TimePicker, Row, Col, Checkbox, InputNumber, Radio, ColorPicker, Spin, message, Divider, Pagination } from "antd";
import { useFormContext } from "react-hook-form";
import AxiosInstance from "../../../../../../../api/http.jsx";

const { Text } = Typography;
const { TextArea } = Input;

function Yetkiler() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Mevcut sayfa
  const itemsPerPage = 10; // Sayfa başına öğe sayısı

  const { watch } = useFormContext();

  const userID = watch("siraNo");

  // Kendi yetki tanımlarınızı burada tanımlayın
  const customYetkiTanimlari = {
    "00001": "Özel Program Ayarları",
    "00003": "Özel Servis Kayıtları",
    "00004": "Özel Periyodik Bakım",
    "00005": "Özel Yakıt Kayıtları",
    "00006": "Özel Sefer Kayıtları",
    "00007": "Özel Harcamalar",
    "00008": "Özel Kazalar/Cezalar",
    "00009": "Özel Araç Lastikleri",
    "00010": "Özel Araç Sigortaları",
    "00011": "Özel Araç Analizi",
    "00012": "Özel Araç",
    "00013": "Özel Sürücüler",
    "00014": "Özel Firmalar",
    "00015": "Özel Personel",
    "00016": "Özel Güzergah",
    "00017": "Özel Servisler",
    "00018": "Özel Malzemeler",
    "00019": "Özel Malzeme Giriş Fişleri",
    "00020": "Özel Malzeme Çıkış Fişleri",
    "00021": "Özel Malzeme Hareketleri",
    "00022": "Özel Raporlar",
    "00023": "Özel Kod Yönetimi",
    "00024": "Özel Araç Marka/Modelleri",
    "00025": "Özel Araç Sürücü Değişikliği",
    "00026": "Özel Araç Yolcu Bilgileri",
    "00027": "Özel Hatırlatıcı",
    "00028": "Özel Yedekleme",
    "00029": "Özel Yedeği Geri Yükleme",
    "00030": "Özel Güncelleme",
    "00031": "Özel Kullanıcı Tanımları",
    "00032": "Özel Hızlı Yakıt Girişi",
    "00033": "Özel Sistem Güvenliği",
    "00034": "Özel Sürücü Değişikliği",
    "00036": "Özel Lastikler",
    "00037": "Özel Malzeme Transfer Fişleri",
    "00038": "Özel Yakıt Giriş Fişleri",
    "00039": "Özel Yakıt Çıkış Fişleri",
    "00040": "Özel Yakıt Transfer Fişleri",
    "00041": "Özel Yakıt Hareketleri",
    "00042": "Özel Yakıt Tankları",
    "00043": "Özel Malzeme Depoları",
    "00044": "Özel Araç Bölge Değişikliği",
    "00045": "Özel Malzeme Talep Fişleri",
    "00050": "Özel Gelir İşlemleri",
    "00051": "Özel Ceza Tanımları",
    "00052": "Özel Şehir /Yer Tanımlamaları",
    "00053": "Özel İş Kartları",
    "00054": "Özel Aktarımlar",
    "00055": "Özel Yakıtlar",
    "00056": "Özel Hızlı Km Güncelleme",
    "00057": "Özel Form Tasarımları",
    "00058": "Özel Yazıcı Ayarları",
    "00059": "Özel Programı İlk Ayarlarına Döndür",
    "00061": "Özel Hızlı Sefer Girişi",
    "00062": "Özel Analizler",
    // Diğer yetki kodları ve tanımları...
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await AxiosInstance.get(`Authority/GetUserAuthListById?id=${userID}`);
      if (response.data) {
        const formattedData = response.data.map((item) => {
          return {
            ...item,
            key: item.yetkiKod,
            yetkiTanim: customYetkiTanimlari[item.yetkiKod] || item.yetkiTanim,
          };
        });
        setData(formattedData);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error in API request:", error);
      setLoading(false);
      if (navigator.onLine) {
        message.error("Hata Mesajı: " + error.message);
      } else {
        message.error("Internet Bağlantısı Mevcut Değil.");
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [userID]);

  // Sayfalama için gösterilecek veriyi hesaplayın
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = data.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div>
      {loading ? (
        <Spin />
      ) : (
        <>
          {currentData.map((item) => {
            return (
              <div key={item.key}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Text>{item.yetkiTanim}</Text>
                  <div>
                    <Checkbox checked={item.ekle}>Ekle</Checkbox>
                    <Checkbox checked={item.sil}>Sil</Checkbox>
                    <Checkbox checked={item.degistir}>Değiştir</Checkbox>
                    <Checkbox checked={item.gor}>Gör</Checkbox>
                  </div>
                </div>
                <Divider />
              </div>
            );
          })}
          <Pagination
            current={currentPage}
            total={data.length}
            pageSize={itemsPerPage}
            onChange={(page) => setCurrentPage(page)}
            style={{ textAlign: "right", marginTop: "20px" }}
          />
        </>
      )}
    </div>
  );
}

export default Yetkiler;
