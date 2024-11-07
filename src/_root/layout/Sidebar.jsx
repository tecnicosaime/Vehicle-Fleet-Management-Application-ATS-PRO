import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Menu, Divider, Modal, Button } from "antd";
import { PieChartOutlined, CarOutlined } from "@ant-design/icons";
import { MdOutlineSystemUpdateAlt } from "react-icons/md";
import { PiTireBold } from "react-icons/pi";
import { LuWarehouse } from "react-icons/lu";
import { FaGears } from "react-icons/fa6";
import { BsFuelPump } from "react-icons/bs";
import { GiAutoRepair } from "react-icons/gi";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { t } from "i18next";
import Draggable from "react-draggable";
import Ayarlar from "../pages/Ayarlar/Ayarlar";

const Sidebar = () => {
  const [openKeys, setOpenKeys] = useState([]);
  const [open, setOpen] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [bounds, setBounds] = useState({
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
  });

  const onOpenChange = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
  };

  const draggleRef = useRef(null);
  const showModal = () => {
    setOpen(true);
  };
  const handleOk = (e) => {
    console.log(e);
    setOpen(false);
  };
  const handleCancel = (e) => {
    console.log(e);
    setOpen(false);
  };
  const onStart = (_event, uiData) => {
    const { clientWidth, clientHeight } = window.document.documentElement;
    const targetRect = draggleRef.current?.getBoundingClientRect();
    if (!targetRect) {
      return;
    }
    setBounds({
      left: -targetRect.left + uiData.x,
      right: clientWidth - (targetRect.right - uiData.x),
      top: -targetRect.top + uiData.y,
      bottom: clientHeight - (targetRect.bottom - uiData.y),
    });
  };

  const items = [
    {
      key: "1",
      icon: <PieChartOutlined />,
      label: <Link to={"/"}>{t("dashboard")}</Link>,
    },
    {
      key: "2",
      icon: <CarOutlined />,
      label: t("aracYonetimi"),
      children: [
        {
          key: "3",
          label: <Link to={"/araclar"}>{t("araclar")}</Link>,
        },
        {
          key: "4",
          label: <Link to={"/yakit-islemleri"}>{t("yakitIslemleri")}</Link>,
        },
        /* {
          key: "5",
          label: <Link to={"/servis-islemleri"}>{t("servisIslemleri")}</Link>,
        },*/
        {
          key: "6",
          label: <Link to={"/sefer-islemleri"}>{t("seferler")}</Link>,
        },
        {
          key: "7",
          label: <Link to={"/sigorta-islemleri"}>{t("sigortalar")}</Link>,
        },
        {
          key: "8",
          label: <Link to={"/harcama-islemleri"}>{t("harcamalar")}</Link>,
        },
        {
          key: "9",
          label: <Link to={"/kaza-islemleri"}>{t("kazalar")}</Link>,
        },
        {
          key: "10",
          label: <Link to={"/ceza-islemleri"}>{t("cezalar")}</Link>,
        },
        {
          key: "11",
          label: <Link to={"/lastik-tanimlari"}>{t("lastikler")}</Link>,
        },
        {
          key: "121",
          label: <Link to={"/ekspertizler"}>{t("ekspertizler")}</Link>,
        },
        {
          key: "12",
          label: <Link to={"/hizli-km-guncelleme"}>{t("hizliKmGuncelleme")}</Link>,
        },
      ],
    },

    {
      key: "19",
      icon: <GiAutoRepair />,
      label: "Bakım & Onarım",
      children: [
        {
          key: "21",
          label: <Link to={"/servis-islemleri"}>{t("servisIslemleri")}</Link>,
        },
        {
          key: "20",
          label: <Link to={"/Periodic-Maintenance"}>{t("periyodikBakimlar")}</Link>,
        },
        {
          key: "22",
          label: <Link to={"/sefer-islemleri"}>{t("randevuTakibi")}</Link>,
        },
        /*{
          key: "23",
          label: <Link to={"/harcama-islemleri"}>{t("servısFaturalari")}</Link>,
        },*/
        {
          key: "24",
          label: <Link to={"/malzeme-tanimlari"}>{t("atolyeTanimlari")}</Link>,
        },
      ],
    },
    /* {
      key: "345",
      icon: <FaGears />,
      label: t("lastikYonetimi"),
      children: [
        {
          key: "2345",
          label: <Link to={"/lastikIslemleri"}>{t("lastikIslemleri")}</Link>,
        },
        {
          key: "99324",
          label: <Link to={`/lastikEnvanteri`}>{t("lastikEnvanteri")}</Link>,
        },
        {
          key: "divider-1",
          label: <Divider className="menu-divider" />, // Special class for styling
        },
        {
          key: "3647",
          label: <Link to={`/lastikTanimlari`}>{t("lastikTanimlari")}</Link>,
        },
        {
          key: "12344",
          label: <Link to={`/aksTanimlari`}>{t("aksTanimlari")}</Link>,
        },
      ],
    }, */
    {
      key: "31",
      icon: <LuWarehouse />,
      label: t("malzemeDepo"),
      children: [
        {
          key: "32",
          label: <Link to={"/malzeme-tanimlari"}>{t("malzemeTanimlari")}</Link>,
        },
        {
          key: "33",
          label: <Link to={"/giris-fisleri"}>{t("girisFisleri")}</Link>,
        },
        {
          key: "34",
          label: <Link to={"/cikis-fisleri"}>{t("cikisFisleri")}</Link>,
        },
        {
          key: "35",
          label: <Link to={"/transferler"}>{t("malzemeTransferleri")}</Link>,
        },
        {
          key: "36",
          label: <Link to={"/hazirlaniyor"}>{t("talepler")}</Link>,
        },
        {
          key: "37",
          label: <Link to={"/hareketler"}>{t("malzemeHareketleri")}</Link>,
        },
        {
          key: "837",
          label: <Link to={"/hazirlaniyor"}>{t("malzemeDepoTanimlari")}</Link>,
        },
      ],
    },
    {
      key: "13",
      icon: <BsFuelPump />,
      label: t("yakitYonetimi"),
      children: [
        {
          key: "14",
          label: <Link to={"/yakit-tanimlari"}>{t("tanimlar")}</Link>,
        },
        {
          key: "15",
          label: <Link to={"/yakit-giris-fisleri"}>{t("girişFişleri")}</Link>,
        },
        {
          key: "16",
          label: <Link to={"/yakit-cikis-fisleri"}>{t("çıkışFişleri")}</Link>,
        },
        {
          key: "17",
          label: <Link to={"/yakit-transferler"}>{t("transferler")}</Link>,
        },
        {
          key: "18",
          label: <Link to={"/yakit-hareketleri"}>{t("hareketler")}</Link>,
        },
        {
          key: "138",
          label: <Link to={"/"}>{t("yakitTanklari")}</Link>,
        },
      ],
    },
    /*{
      key: "338",
      icon: <HiOutlineDocumentReport />,
      label: t("finansYonetim"),
      children: [
        {
          key: "435",
          label: <Link to={"/hazirlaniyor"}>{t("faturalar")}</Link>,
        },
        {
          key: "661",
          label: <Link to={"/hazirlaniyor"}>{t("cariHesaplar")}</Link>,
        },
        {
          key: "487",
          label: <Link to={"/hazirlaniyor"}>{t("gelirIslemleri")}</Link>,
        },
      ],
    },*/
    /*{
      key: "348",
      icon: <HiOutlineDocumentReport />,
      label: t("satinAlmaYonetim"),
      children: [
        {
          key: "235",
          label: <Link to={"/hazirlaniyor"}>{t("malzemeTalepleri")}</Link>,
        },
        {
          key: "064",
          label: <Link to={"/hazirlaniyor"}>{t("teklifler")}</Link>,
        },
        {
          key: "832",
          label: <Link to={"/hazirlaniyor"}>{t("siparisler")}</Link>,
        },
      ],
    },*/
    /*{
      key: "368",
      icon: <HiOutlineDocumentReport />,
      label: <Link to={"/hazirlaniyor"}>{t("kurumsalModuller")}</Link>,
    },*/
    {
      key: "2v34789",
      icon: <FaGears />,
      label: t("analizler"),
      children: [
        {
          key: "2980345df",
          label: <Link to={"/fuel-analysis"}>{t("yakitTuketimAnalizleri")}</Link>,
        },
      ],
    },
    {
      key: "38",
      icon: <HiOutlineDocumentReport />,
      label: <Link to={"/raporlar"}>{t("raporlar")}</Link>,
    },
    {
      key: "39",
      icon: <MdOutlineSystemUpdateAlt />,
      label: t("sistemTanimlari"),
      children: [
        {
          key: "401",
          label: <Link to={"/lokasyon-tanimlari"}>{t("lokasyonlar")}</Link>,
        },
        {
          key: "40",
          label: <Link to={"/firma-tanimlari"}>{t("firma")}</Link>,
        },
        {
          key: "41",
          label: <Link to={"/surucu-tanimlari"}>{t("surucu")}</Link>,
        },
        {
          key: "42",
          label: <Link to={"/personel-tanimlari"}>{t("personel")}</Link>,
        },
        {
          key: "43",
          label: <Link to={"/servis-tanimlari"}>{t("servisTanimlari")}</Link>,
        },
        {
          key: "44",
          label: <Link to={"/guzergah-tanimlari"}>{t("guzergah")}</Link>,
        },
        {
          key: "45",
          label: <Link to={"/lastik-tanimlari"}>{t("lastik")}</Link>,
        },
        {
          key: "46",
          label: <Link to={"/ceza-tanimlari"}>{t("ceza")}</Link>,
        },
        {
          key: "47",
          label: <Link to={"/arac-marka-ve-model"}>{t("markaModel")}</Link>,
        },
        {
          key: "48",
          label: <Link to={"/sehir-tanimlari"}>{t("sehirTanimlari")}</Link>,
        },
        {
          key: "49",
          label: <Link to={"/is-kartlari"}>{t("isKartlari")}</Link>,
        },
      ],
    },

    {
      key: "50",
      icon: <FaGears />,
      label: "Sistem Ayarları",
      children: [
        // {
        //   key: "534",
        //   label: <Link to={"/ayarlar"}>{t("ayarlar")}</Link>,
        // },
        {
          key: "51",
          label: <div onClick={showModal}>{t("ayarlar")}</div>,
        },
        {
          key: "52",
          label: <Link to={`/user_definitions`}>{t("kullaniciTanimlari")}</Link>,
        },
        {
          key: "53",
          label: <Link to={`/kod-yonetimi`}>{t("kodYonetimi")}</Link>,
        },
      ],
    },
  ];

  return (
    <>
      <div className="flex justify-center w-full py-20 text-center">
        <Link to="/">
          <img src="/images/logo_white.png" alt="ats logo" className="sidebar-logo" />
        </Link>
      </div>
      <Menu mode="inline" theme="dark" openKeys={openKeys} onOpenChange={onOpenChange} items={items} />
      <Modal
        title={
          <div
            style={{
              width: "100%",
              cursor: "move",
            }}
            onMouseOver={() => {
              if (disabled) {
                setDisabled(false);
              }
            }}
            onMouseOut={() => {
              setDisabled(true);
            }}
            // fix eslintjsx-a11y/mouse-events-have-key-events
            // https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/mouse-events-have-key-events.md
            onFocus={() => {}}
            onBlur={() => {}}
            // end
          >
            <div style={{ fontSize: "20px" }}>{t("ayarlar")}</div>
          </div>
        }
        centered
        open={open}
        width={800}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null} // Ok ve Cancel düğmelerini kaldırmak için
        modalRender={(modal) => (
          <Draggable disabled={disabled} bounds={bounds} nodeRef={draggleRef} onStart={(event, uiData) => onStart(event, uiData)}>
            <div ref={draggleRef}>{modal}</div>
          </Draggable>
        )}
      >
        <Ayarlar />
      </Modal>
    </>
  );
};

export default Sidebar;
