import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal, Table, Input } from "antd";
import AxiosInstance from "../../../../../../../../api/http";
import { Resizable } from "react-resizable";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";

const ResizableTitle = (props) => {
  const { onResize, width, ...restProps } = props;

  // You may need to adjust the style to suit your exact needs
  const handleStyle = {
    position: "absolute",
    bottom: 0,
    right: "-5px",
    width: "20%",
    height: "100%", // this is the area that is draggable, you can adjust it
    zIndex: 2, // ensure it's above other elements
    cursor: "col-resize",
    padding: "0px",
    backgroundSize: "0px",
  };
  if (!width) {
    return <th {...restProps} />;
  }
  return (
    <Resizable
      width={width}
      height={0}
      handle={
        <span
          className="react-resizable-handle"
          onClick={(e) => {
            e.stopPropagation();
          }}
          style={handleStyle}
        />
      }
      onResize={onResize}
      draggableOpts={{
        enableUserSelectHack: false,
      }}
    >
      <th {...restProps} />
    </Resizable>
  );
};

// Türkçe karakterleri İngilizce karşılıkları ile değiştiren fonksiyon
const normalizeText = (text) => {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ğ/g, "g")
    .replace(/Ğ/g, "G")
    .replace(/ü/g, "u")
    .replace(/Ü/g, "U")
    .replace(/ş/g, "s")
    .replace(/Ş/g, "S")
    .replace(/ı/g, "i")
    .replace(/İ/g, "I")
    .replace(/ö/g, "o")
    .replace(/Ö/g, "O")
    .replace(/ç/g, "c")
    .replace(/Ç/g, "C");
};

export default function ServisKoduTablo({ workshopSelectedId, onSubmit }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchTerm1, setSearchTerm1] = useState("");
  const [filteredData1, setFilteredData1] = useState([]);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const [columns, setColumns] = useState(() => {
    const savedWidths = localStorage.getItem("servisTableColumnWidths");
    const defaultColumns = [
      {
        title: "Servis Kodu",
        dataIndex: "code",
        key: "code",
        width: 150,
        sorter: (a, b) => {
          if (a.code === null) return -1;
          if (b.code === null) return 1;
          return a.code.localeCompare(b.code);
        },
      },
      {
        title: "Servis Tanımı",
        dataIndex: "subject",
        key: "subject",
        width: 350,
      },
      {
        title: "Km",
        dataIndex: "km",
        key: "km",
        width: 100,
        render: (text) => <span>{Number(text).toLocaleString()}</span>,
      },
      {
        title: "Gün",
        dataIndex: "gun",
        key: "gun",
        width: 100,
      },
      {
        title: "Servis Tipi",
        dataIndex: "servisTipi",
        key: "servisTipi",
        width: 100,
      },
      {
        title: "Peryodik",
        dataIndex: "periyodik",
        key: "periyodik",
        width: 100,
        render: (text) => (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            {text ? <CheckCircleOutlined style={{ color: "green" }} /> : <CloseCircleOutlined style={{ color: "red" }} />}
          </div>
        ),
      },
    ];

    if (!savedWidths) {
      return defaultColumns;
    }

    const parsedWidths = JSON.parse(savedWidths);
    return defaultColumns.map((col, index) => ({
      ...col,
      width: parsedWidths[index] || col.width,
    }));
  });

  const handleResize =
    (index) =>
    (_, { size }) => {
      const newColumns = [...columns];
      newColumns[index] = {
        ...newColumns[index],
        width: size.width,
      };
      setColumns(newColumns);
      localStorage.setItem("servisTableColumnWidths", JSON.stringify(newColumns.map((col) => col.width)));
    };
  const mergedColumns = columns.map((col, index) => ({
    ...col,
    onHeaderCell: (column) => ({
      width: column.width,
      onResize: handleResize(index),
    }),
  }));

  const fetch = useCallback(() => {
    setLoading(true);
    AxiosInstance.get(`ServiceDef/GetServiceDefList?page=${pagination.current}`)
      .then((response) => {
        const { list, recordCount } = response.data; // Destructure the list and recordCount from the response
        const fetchedData = list.map((item) => ({
          ...item,
          key: item.bakimId,
          code: item.bakimKodu,
          subject: item.tanim,
        }));
        setData(fetchedData);
        setPagination({
          ...pagination,
          total: recordCount, // Update the total number of records for pagination
        });
      })
      .finally(() => setLoading(false));
  }, [pagination.current]);

  const handleModalToggle = () => {
    setIsModalVisible((prev) => !prev);
    if (!isModalVisible) {
      fetch();
      setSelectedRowKeys([]);
    }
  };

  const handleModalOk = () => {
    const selectedData = data.find((item) => item.key === selectedRowKeys[0]);
    if (selectedData) {
      onSubmit && onSubmit(selectedData);
      console.log("selectedRowKeys", selectedData);
    }
    setIsModalVisible(false);
  };

  useEffect(() => {
    setSelectedRowKeys(workshopSelectedId ? [workshopSelectedId] : []);
  }, [workshopSelectedId]);

  const onRowSelectChange = (selectedKeys) => {
    setSelectedRowKeys(selectedKeys.length ? [selectedKeys[0]] : []);
  };

  const handleTableChange = (newPagination) => {
    setPagination(newPagination);
  };

  // Arama işlevselliği için handleSearch fonksiyonları
  const handleSearch1 = (e) => {
    const value = e.target.value;
    setSearchTerm1(value);
    const normalizedSearchTerm = normalizeText(value);
    if (value) {
      const filtered = data.filter((item) =>
        Object.keys(item).some((key) => item[key] && normalizeText(item[key].toString()).toLowerCase().includes(normalizedSearchTerm.toLowerCase()))
      );
      setFilteredData1(filtered);
    } else {
      setFilteredData1(data);
    }
  };
  return (
    <div>
      <Button onClick={handleModalToggle}> + </Button>
      <Modal width={1200} centered title="Servis Kodları" open={isModalVisible} onOk={handleModalOk} onCancel={handleModalToggle}>
        <Input placeholder="Arama..." value={searchTerm1} onChange={handleSearch1} style={{ width: "300px", marginBottom: "15px" }} />
        <Table
          rowSelection={{
            type: "radio",
            selectedRowKeys,
            onChange: onRowSelectChange,
          }}
          bordered
          components={{
            header: {
              cell: ResizableTitle,
            },
          }}
          scroll={{ y: "calc(100vh - 380px)" }}
          columns={mergedColumns}
          dataSource={filteredData1.length > 0 || searchTerm1 ? filteredData1 : data}
          loading={loading}
          pagination={pagination}
          onChange={handleTableChange}
        />
      </Modal>
    </div>
  );
}
