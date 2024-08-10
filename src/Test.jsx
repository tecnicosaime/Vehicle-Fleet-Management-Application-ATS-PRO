import { useState, useEffect, useContext } from "react";
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
  const [loading, setLoading] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(false);
  const [openRowHeader, setOpenRowHeader] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [keys, setKeys] = useState([]);
  const [rows, setRows] = useState([]);
  const [filterData, setFilterData] = useState({});
  const [ayarlarData, setAyarlarData] = useState(null);
  const [country, setCountry] = useState({
    name: "",
    code: "",
  });

  // Separate loading states for each API call
  const [locationLoading, setLocationLoading] = useState(true);
  const [ayarlarLoading, setAyarlarLoading] = useState(true);
  const [vehiclesLoading, setVehiclesLoading] = useState(true);

  // Fetch location data
  useEffect(() => {
    const getLocation = async () => {
      try {
        const res = await axios.get("http://ip-api.com/json");
        if (res.status === 200) {
          setCountry({ name: res.data.country, code: res.data.countryCode });
        }
      } catch (error) {
        console.error("Error fetching location data:", error);
      } finally {
        setLocationLoading(false); // End location loading
      }
    };

    getLocation();
  }, []);

  // Fetch settings data
  useEffect(() => {
    const fetchAyarlardata = async () => {
      try {
        const response = await AxiosInstance.get("ReminderSettings/GetReminderSettingsItems");
        if (response.data) {
          setAyarlarData(response.data);
        }
      } catch (error) {
        console.error("Error fetching settings data:", error);
      } finally {
        setAyarlarLoading(false); // End settings loading
      }
    };

    fetchAyarlardata();
  }, []);

  // Fetch vehicles data
  useEffect(() => {
    const fetchData = async () => {
      setVehiclesLoading(true); // Start vehicles loading
      try {
        const res = await GetVehiclesListService(search, tableParams.pagination.current, tableParams.pagination.pageSize, filterData);
        setDataSource(res?.data.vehicleList || []);
        setTableParams((prevTableParams) => ({
          ...prevTableParams,
          pagination: {
            ...prevTableParams.pagination,
            total: res?.data.vehicleCount || 0,
          },
        }));
      } catch (error) {
        console.error("Error fetching vehicles data:", error);
      } finally {
        setVehiclesLoading(false); // End vehicles loading
        setIsInitialLoading(false);
      }
    };

    fetchData();
  }, [search, tableParams.pagination.current, tableParams.pagination.pageSize, status, filterData]);

  // Overall loading state based on individual loading states
  useEffect(() => {
    if (!locationLoading && !ayarlarLoading && !vehiclesLoading) {
      setLoading(false); // All data has been loaded, end overall loading
    }
  }, [locationLoading, ayarlarLoading, vehiclesLoading]);

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

        if (gerceklesen === 0 || gerceklesen === undefined) {
          return null;
        }

        const formattedGerceklesen = gerceklesen.toFixed(2);

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
      title: "Egzoz Tarih",
      dataIndex: "egzosTarih",
      key: 12,
      ellipsis: true,
      width: 160,
      render: (text) => {
        const today = dayjs(); // Sistem tarihini al
        const date = dayjs(text); // Sütundaki tarihi al
        const difference = date.diff(today, "day"); // İki tarih arasındaki gün farkı

        // 3 id'li ayarı bul
        const ayar = ayarlarData.find((item) => item.hatirlaticiAyarId === 3);

        let backgroundColor = "";

        if (ayar) {
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
        const today = dayjs(); // Sistem tarihini al
        const date = dayjs(text); // Sütundaki tarihi al
        const difference = date.diff(today, "day"); // İki tarih arasındaki gün farkı

        // 1 id'li ayarı bul
        const ayar = ayarlarData.find((item) => item.hatirlaticiAyarId === 1);

        let backgroundColor = "";

        if (ayar) {
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
        const today = dayjs(); // Sistem tarihini al
        const date = dayjs(text); // Sütundaki tarihi al
        const difference = date.diff(today, "day"); // İki tarih arasındaki gün farkı

        // 8 id'li ayarı bul
        const ayar = ayarlarData.find((item) => item.hatirlaticiAyarId === 8);

        let backgroundColor = "";

        if (ayar) {
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
        const today = dayjs(); // Sistem tarihini al
        const date = dayjs(text); // Sütundaki tarihi al
        const difference = date.diff(today, "day"); // İki tarih arasındaki gün farkı

        // 6 id'li ayarı bul
        const ayar = ayarlarData.find((item) => item.hatirlaticiAyarId === 6);

        let backgroundColor = "";

        if (ayar) {
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

  const handleRowSelection = (row, selected) => {
    if (selected) {
      if (!keys.includes(row.aracId)) {
        setKeys((prevKeys) => [...prevKeys, row.aracId]);
        setRows((prevRows) => [...prevRows, row]);
      }
    } else {
      setKeys((prevKeys) => prevKeys.filter((key) => key !== row.aracId));
      setRows((prevRows) => prevRows.filter((item) => item.aracId !== row.aracId));
    }
  };

  useEffect(() => localStorage.setItem("selectedRowKeys", JSON.stringify(keys)), [keys]);

  useEffect(() => {
    const newPlakaEntries = rows.map((vehicle) => ({
      id: vehicle.aracId,
      plaka: vehicle.plaka,
      lokasyonId: vehicle.lokasyonId,
      lokasyon: vehicle.lokasyon,
    }));
    setPlaka(newPlakaEntries);
  }, [rows]);

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
            <OperationsInfo ids={keys} />
          </div>
        </div>
      </div>

      <div className="content">
        <DragAndDropContext items={columns} setItems={setColumns}>
          <Spin spinning={loading || isInitialLoading} indicator={customIcon}>
            <Table
              rowKey={(record) => record.aracId}
              columns={columns}
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
                selectedRowKeys: selectedRowKeys,
                onChange: (selectedKeys) => setSelectedRowKeys(selectedKeys),
                onSelect: handleRowSelection,
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
          </Spin>
        </DragAndDropContext>
      </div>
    </>
  );
};

export default Vehicles;
