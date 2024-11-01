import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { t } from "i18next";
import axios from "axios";
import { Table, Popover, Button, Input, Spin, Typography, Tooltip } from "antd";
import { MenuOutlined, HomeOutlined, LoadingOutlined, ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import { PlakaContext } from "../../../../context/plakaSlice";
import { GetVehiclesListService } from "../../../../api/services/vehicles/vehicles/services";
import { DemoService } from "../../../../api/service";
import BreadcrumbComp from "../../../components/breadcrumb/Breadcrumb";
import DragAndDropContext from "../../../components/drag-drop-table/DragAndDropContext";
import SortableHeaderCell from "../../../components/drag-drop-table/SortableHeaderCell";
import Content from "../../../components/drag-drop-table/DraggableCheckbox";
import AddModal from "./add/AddModal";
import Filter from "./filter/Filter";
import OperationsInfo from "./operations/OperationsInfo";
import DurumFiltresi from "./components/DurumFiltresi.jsx";
import dayjs from "dayjs";
import AxiosInstance from "../../../../api/http";

const { Text } = Typography;

const breadcrumb = [{ href: "/", title: <HomeOutlined /> }, { title: t("araclar") }];

const Vehicles = () => {
  const { setPlaka } = useContext(PlakaContext);
  const [dataSource, setDataSource] = useState([]);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });
  const [loading, setLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(false);
  const [openRowHeader, setOpenRowHeader] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [keys, setKeys] = useState([]);
  const [rows, setRows] = useState([]);
  const [filterData, setFilterData] = useState({});
  const [ayarlarData, setAyarlarData] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [selectedRowsData, setSelectedRowsData] = useState([]); // Seçilen tüm satır verilerini saklar
  const [country, setCountry] = useState({
    name: "",
    code: "",
  });
  useEffect(() => {
    fetchAyarlardata(); // Ensure this function is called before rendering the table
  }, []);

  useEffect(() => {
    getLocation();
  }, []);

  async function getLocation() {
    const res = await axios.get("https://ipapi.co/json");
    if (res.status === 200) setCountry({ name: res.data.country_name, code: res.data.country_code });
  }

  const fetchAyarlardata = async () => {
    try {
      setDataLoaded(false);
      const response = await AxiosInstance.get("ReminderSettings/GetReminderSettingsItems");
      if (response.data) {
        setAyarlarData(response.data);
      } else {
        setAyarlarData(null); // Or set to an empty array if appropriate
      }
      setDataLoaded(true); // Always set dataLoaded to true
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
      setDataLoaded(true); // Ensure dataLoaded is true even if there's an error
    }
  };

  const getBaseColumns = (country) => [
    {
      title: t("aracPlaka"),
      dataIndex: "plaka",
      key: 1,
      render: (text, record) => (
        <div style={{}}>
          <Link to={`/detay/${record.aracId}`} className="plaka-button">
            <span>{country.code}</span> <span>{text}</span>
          </Link>
        </div>
      ),
      ellipsis: true,
      width: 160,
    },
    {
      title: t("aracTip"),
      dataIndex: "aracTip",
      key: 2,
      ellipsis: true,
      width: 100,
    },
    {
      title: t("marka"),
      dataIndex: "marka",
      key: 3,
      ellipsis: true,
      width: 160,
    },
    {
      title: t("model"),
      dataIndex: "model",
      key: 4,
      ellipsis: true,
      width: 160,
    },
    {
      title: t("aracLokasyon"),
      dataIndex: "lokasyon",
      key: 10,
      ellipsis: true,
      width: 160,
    },

    {
      title: t("guncelKm"),
      dataIndex: "guncelKm",
      key: 6,
      ellipsis: true,
      width: 160,
    },

    {
      title: t("yil"),
      dataIndex: "yil",
      key: 8,
      ellipsis: true,
      width: 160,
    },
    {
      title: t("yakitTip"),
      dataIndex: "yakitTip",
      key: 9,
      ellipsis: true,
      width: 100,
    },
    {
      title: t("yakitTuketimi"),
      dataIndex: "ortalamaTuketim",
      key: "ortalamaTuketim",
      ellipsis: true,
      width: 100,
      render: (text, record) => {
        const { onGorulen, onGorulenMin, gerceklesen } = record;

        // Eğer gerceklesen değeri 0 veya undefined ise hiçbir şey gösterme
        if (gerceklesen === 0 || gerceklesen === undefined) {
          return null;
        }

        // Ondalıklı sayıyı 2 basamağa yuvarla ve 2 basamaklı hale getir
        const formattedGerceklesen = gerceklesen.toFixed(Number(record?.ortalamaFormat));

        let icon = null;
        if (onGorulenMin !== null && onGorulenMin !== 0) {
          if (gerceklesen < onGorulenMin) {
            icon = <ArrowDownOutlined style={{ color: "green", marginLeft: 4 }} />;
          } else if (gerceklesen > onGorulen) {
            icon = <ArrowUpOutlined style={{ color: "red", marginLeft: 4 }} />;
          } else if (gerceklesen >= onGorulenMin && gerceklesen <= onGorulen) {
            icon = <span style={{ marginLeft: 4 }}>~</span>;
          }
        } else if (onGorulen !== null && onGorulen !== 0) {
          if (gerceklesen < onGorulen) {
            icon = <ArrowDownOutlined style={{ color: "green", marginLeft: 4 }} />;
          }
        }

        return (
          <Tooltip title={`Gerçekleşen: ${formattedGerceklesen}`}>
            <span style={{ display: "flex", justifyContent: "flex-end" }}>
              {formattedGerceklesen}
              {icon}
            </span>
          </Tooltip>
        );
      },
    },
    {
      title: t("aracGrup"),
      dataIndex: "grup",
      key: 5,
      ellipsis: true,
      width: 160,
    },
    {
      title: t("surucu"),
      dataIndex: "surucu",
      key: 10,
      ellipsis: true,
      width: 160,
    },
    {
      title: t("departman"),
      dataIndex: "departman",
      key: 10,
      ellipsis: true,
      width: 160,
    },
    {
      title: t("muayeneTarihi"),
      dataIndex: "muayeneTarih",
      key: 11,
      ellipsis: true,
      width: 160,
      render: (text) => (text ? dayjs(text).format("DD.MM.YYYY") : ""),
    },
    {
      title: t("aracEgzoz"),
      dataIndex: "egzosTarih",
      key: 12,
      ellipsis: true,
      width: 160,
      render: (text) => {
        if (!ayarlarData) {
          return null; // Eğer ayarlarData henüz yüklenmediyse hiçbir şey render etme
        }

        const today = dayjs(); // Sistem tarihini al
        const date = dayjs(text); // Sütundaki tarihi al
        const difference = date.diff(today, "day"); // İki tarih arasındaki gün farkı

        // 3 id'li ayarı bul
        const ayar = ayarlarData.find((item) => item.hatirlaticiAyarId === 3);

        let backgroundColor = "";

        if (ayar) {
          // Eğer ayar bulunduysa
          if (difference > ayar.uyariSuresi) {
            backgroundColor = ""; // Yeşil
          } else if (difference <= ayar.uyariSuresi && difference >= ayar.kritikSure) {
            backgroundColor = "#31c637"; // Sarı
          } else if (difference < ayar.kritikSure && difference >= 0) {
            backgroundColor = "yellow"; // Kırmızı
          } else if (difference < 0) {
            backgroundColor = "#ff4646"; // Mor
          }
        }

        return (
          <div style={{ backgroundColor, padding: "5px", display: "flex", alignItems: "center", justifyContent: "center" }}>{text ? dayjs(text).format("DD.MM.YYYY") : ""}</div>
        );
      },
    },
    {
      title: t("aracVergi"),
      dataIndex: "vergiTarih",
      key: 13,
      ellipsis: true,
      width: 160,
      render: (text) => {
        if (!ayarlarData) {
          return null; // Eğer ayarlarData henüz yüklenmediyse hiçbir şey render etme
        }

        const today = dayjs(); // Sistem tarihini al
        const date = dayjs(text); // Sütundaki tarihi al
        const difference = date.diff(today, "day"); // İki tarih arasındaki gün farkı

        // 3 id'li ayarı bul
        const ayar = ayarlarData.find((item) => item.hatirlaticiAyarId === 1);

        let backgroundColor = "";

        if (ayar) {
          // Eğer ayar bulunduysa
          if (difference > ayar.uyariSuresi) {
            backgroundColor = ""; // Yeşil
          } else if (difference <= ayar.uyariSuresi && difference >= ayar.kritikSure) {
            backgroundColor = "#31c637"; // Sarı
          } else if (difference < ayar.kritikSure && difference >= 0) {
            backgroundColor = "yellow"; // Kırmızı
          } else if (difference < 0) {
            backgroundColor = "#ff4646"; // Mor
          }
        }

        return (
          <div style={{ backgroundColor, padding: "5px", display: "flex", alignItems: "center", justifyContent: "center" }}>{text ? dayjs(text).format("DD.MM.YYYY") : ""}</div>
        );
      },
    },
    {
      title: t("sozlesmeTarih"),
      dataIndex: "sozlesmeTarih",
      key: 14,
      ellipsis: true,
      width: 160,
      render: (text) => {
        if (!ayarlarData) {
          return null; // Eğer ayarlarData henüz yüklenmediyse hiçbir şey render etme
        }

        const today = dayjs(); // Sistem tarihini al
        const date = dayjs(text); // Sütundaki tarihi al
        const difference = date.diff(today, "day"); // İki tarih arasındaki gün farkı

        // 3 id'li ayarı bul
        const ayar = ayarlarData.find((item) => item.hatirlaticiAyarId === 8);

        let backgroundColor = "";

        if (ayar) {
          // Eğer ayar bulunduysa
          if (difference > ayar.uyariSuresi) {
            backgroundColor = ""; // Yeşil
          } else if (difference <= ayar.uyariSuresi && difference >= ayar.kritikSure) {
            backgroundColor = "#31c637"; // Sarı
          } else if (difference < ayar.kritikSure && difference >= 0) {
            backgroundColor = "yellow"; // Kırmızı
          } else if (difference < 0) {
            backgroundColor = "#ff4646"; // Mor
          }
        }

        return (
          <div style={{ backgroundColor, padding: "5px", display: "flex", alignItems: "center", justifyContent: "center" }}>{text ? dayjs(text).format("DD.MM.YYYY") : ""}</div>
        );
      },
    },
    {
      title: t("sigortaTarih"),
      dataIndex: "sigortaBitisTarih",
      key: 15,
      ellipsis: true,
      width: 160,
      render: (text) => {
        if (!ayarlarData) {
          return null; // Eğer ayarlarData henüz yüklenmediyse hiçbir şey render etme
        }

        const today = dayjs(); // Sistem tarihini al
        const date = dayjs(text); // Sütundaki tarihi al
        const difference = date.diff(today, "day"); // İki tarih arasındaki gün farkı

        // 3 id'li ayarı bul
        const ayar = ayarlarData.find((item) => item.hatirlaticiAyarId === 6);

        let backgroundColor = "";

        if (ayar) {
          // Eğer ayar bulunduysa
          if (difference > ayar.uyariSuresi) {
            backgroundColor = ""; // Yeşil
          } else if (difference <= ayar.uyariSuresi && difference >= ayar.kritikSure) {
            backgroundColor = "#31c637"; // Sarı
          } else if (difference < ayar.kritikSure && difference >= 0) {
            backgroundColor = "yellow"; // Kırmızı
          } else if (difference < 0) {
            backgroundColor = "#ff4646"; // Mor
          }
        }

        return (
          <div style={{ backgroundColor, padding: "5px", display: "flex", alignItems: "center", justifyContent: "center" }}>{text ? dayjs(text).format("DD.MM.YYYY") : ""}</div>
        );
      },
    },
  ];

  const [columns, setColumns] = useState(() =>
    getBaseColumns(country).map((column, i) => ({
      ...column,
      key: `${i}`,
      onHeaderCell: () => ({
        id: `${i}`,
      }),
    }))
  );

  const defaultCheckedList = columns.map((item) => item.key);
  const [checkedList, setCheckedList] = useState(defaultCheckedList);

  useEffect(() => {
    const fetchData = async () => {
      DemoService().then((res) => res.data);

      setLoading(true);
      const res = await GetVehiclesListService(search, tableParams.pagination.current, tableParams.pagination.pageSize, filterData);
      setLoading(false);
      setIsInitialLoading(false);

      // Set dataSource and tableParams
      setDataSource(res?.data.vehicleList || []);
      setTableParams((prevTableParams) => ({
        ...prevTableParams,
        pagination: {
          ...prevTableParams.pagination,
          total: res?.data.vehicleCount || 0,
        },
      }));
    };

    if (ayarlarData) {
      fetchData();
    }
  }, [ayarlarData, search, tableParams.pagination.current, tableParams.pagination.pageSize, status, filterData]);

  const handleTableChange = (pagination, filters, sorter) => {
    setLoading(true);
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });

    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setDataSource([]);
    }
  };

  const filter = (data) => {
    setLoading(true);
    setStatus(true);
    setFilterData(data);
  };

  const clear = () => {
    setLoading(true);
    setFilterData({});
  };

  const newColumns = columns.map((col) => ({
    ...col,
    hidden: !checkedList.includes(col.key),
  }));

  const options = columns.map(({ key, title }) => ({
    label: title,
    value: key,
  }));

  const moveCheckbox = (fromIndex, toIndex) => {
    const updatedColumns = [...columns];
    const [removed] = updatedColumns.splice(fromIndex, 1);
    updatedColumns.splice(toIndex, 0, removed);

    setColumns(updatedColumns);
    setCheckedList(updatedColumns.map((col) => col.key));
  };

  const content = <Content options={options} checkedList={checkedList} setCheckedList={setCheckedList} moveCheckbox={moveCheckbox} />;

  // get selected rows data
  if (!localStorage.getItem("selectedRowKeys")) localStorage.setItem("selectedRowKeys", JSON.stringify([]));

  // Tekli seçim için
  const handleRowSelection = (row, selected) => {
    if (selected) {
      // Eğer satır seçildiyse, id'yi keys'e, tüm veriyi selectedRowsData'ya ekle
      if (!keys.includes(row.aracId)) {
        setKeys((prevKeys) => [...prevKeys, row.aracId]);
        setSelectedRowsData((prevRows) => [...prevRows, row]);
      }
    } else {
      // Eğer satır seçimi kaldırıldıysa, id'yi keys'den, veriyi selectedRowsData'dan çıkar
      setKeys((prevKeys) => prevKeys.filter((key) => key !== row.aracId));
      setSelectedRowsData((prevRows) => prevRows.filter((item) => item.aracId !== row.aracId));
    }
  };

  // Çoklu seçim için
  const handleRowSelectionChange = (selectedKeys, selectedRows) => {
    // Çoklu seçimde keys'i ve tüm satır verilerini güncelle
    setKeys(selectedKeys);
    setSelectedRowsData(selectedRows); // Tüm satır verilerini selectedRowsData'ya kaydet
  };

  useEffect(() => localStorage.setItem("selectedRowKeys", JSON.stringify(keys)), [keys]);

  useEffect(() => {
    // Seçilen plaka verilerini güncellemek için
    const newPlakaEntries = selectedRowsData.map((vehicle) => ({
      id: vehicle.aracId,
      plaka: vehicle.plaka,
      lokasyonId: vehicle.lokasyonId,
      lokasyon: vehicle.lokasyon,
    }));
    setPlaka(newPlakaEntries);
  }, [selectedRowsData]);

  useEffect(() => {
    const storedSelectedKeys = JSON.parse(localStorage.getItem("selectedRowKeys"));
    if (storedSelectedKeys.length) {
      setKeys(storedSelectedKeys);
    }
  }, []);

  useEffect(() => {
    const storedSelectedKeys = JSON.parse(localStorage.getItem("selectedRowKeys"));
    if (storedSelectedKeys.length) {
      setSelectedRowKeys(storedSelectedKeys);
    }
  }, [tableParams.pagination.current, search]);

  useEffect(() => {
    setColumns(
      getBaseColumns(country).map((column, i) => ({
        ...column,
        key: `${i}`,
        onHeaderCell: () => ({
          id: `${i}`,
        }),
      }))
    );
  }, [country]);

  // Custom loading icon
  const customIcon = <LoadingOutlined style={{ fontSize: 36 }} className="text-primary" spin />;

  return (
    <>
      <div className="content">
        <BreadcrumbComp items={breadcrumb} />
      </div>

      <div className="content">
        <div className="flex justify-between align-center">
          <div className="flex align-center gap-1">
            <Popover content={content} placement="bottom" trigger="click" open={openRowHeader} onOpenChange={(newOpen) => setOpenRowHeader(newOpen)}>
              <Button className="btn primary-btn">
                <MenuOutlined />
              </Button>
            </Popover>
            <Input placeholder="Arama" onChange={(e) => setSearch(e.target.value)} />
            <AddModal setStatus={setStatus} />
            <Filter filter={filter} clearFilters={clear} />
            <DurumFiltresi />
          </div>
          <div>
            <OperationsInfo ids={keys} selectedRowsData={selectedRowsData} />
          </div>
        </div>
      </div>

      <div className="content">
        <DragAndDropContext items={columns} setItems={setColumns}>
          <Spin spinning={!dataLoaded || loading} indicator={customIcon}>
            {dataLoaded && (
              <Table
                rowKey={(record) => record.aracId}
                columns={newColumns}
                dataSource={dataSource}
                pagination={{
                  ...tableParams.pagination,
                  showTotal: (total) => (
                    <p className="text-info">
                      [{total} {t("kayit")}]
                    </p>
                  ),
                  locale: {
                    items_per_page: `/ ${t("sayfa")}`,
                  },
                }}
                loading={false}
                size="small"
                onChange={handleTableChange}
                rowSelection={{
                  selectedRowKeys: keys, // selectedRowKeys state ile senkronize
                  onChange: handleRowSelectionChange, // Çoklu seçim için
                  onSelect: handleRowSelection, // Tekli seçim için
                }}
                components={{
                  header: {
                    cell: SortableHeaderCell,
                  },
                }}
                scroll={{
                  x: 1200,
                }}
                locale={{
                  emptyText: "Veri Bulunamadı",
                }}
              />
            )}
          </Spin>
        </DragAndDropContext>
      </div>
    </>
  );
};

export default Vehicles;
