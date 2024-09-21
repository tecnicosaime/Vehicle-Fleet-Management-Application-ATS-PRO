import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal, Table, Input } from "antd";
import AxiosInstance from "../../../../../../../../api/http";
import { Resizable } from "react-resizable";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";

const ResizableTitle = (props) => {
  const { onResize, width, ...restProps } = props;

  const handleStyle = {
    position: "absolute",
    bottom: 0,
    right: "-5px",
    width: "20%",
    height: "100%",
    zIndex: 2,
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

export default function ServisKoduTablo({ workshopSelectedId, onSubmit }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchTerm1, setSearchTerm1] = useState("");

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
    AxiosInstance.get(`ServiceDef/GetServiceDefList?page=${pagination.current}&parameter=${encodeURIComponent(searchTerm1 || "")}&isPeriodic=true`)
      .then((response) => {
        const { list, recordCount } = response.data;
        const fetchedData = list.map((item) => ({
          ...item,
          key: item.bakimId,
          code: item.bakimKodu,
          subject: item.tanim,
        }));
        setData(fetchedData);
        setPagination((prev) => ({
          ...prev,
          total: recordCount,
        }));
      })
      .finally(() => setLoading(false));
  }, [pagination.current, searchTerm1]);

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
    }
    setIsModalVisible(false);
  };

  useEffect(() => {
    setSelectedRowKeys(workshopSelectedId ? [workshopSelectedId] : []);
  }, [workshopSelectedId]);

  const onRowSelectChange = (selectedKeys) => {
    setSelectedRowKeys(selectedKeys.length ? [selectedKeys[0]] : []);
  };

  const handleTableChange = (pagination) => {
    setPagination((prev) => ({
      ...prev,
      current: pagination.current,
      pageSize: pagination.pageSize,
    }));
  };

  // Debounce fetch when search term changes
  useEffect(() => {
    const handler = setTimeout(() => {
      setPagination((prev) => ({ ...prev, current: 1 })); // Reset to page 1 when search term changes
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm1]);

  // Fetch data when pagination changes
  useEffect(() => {
    fetch();
  }, [pagination.current]);

  const handleSearch1 = (e) => {
    const value = e.target.value;
    setSearchTerm1(value);
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
          dataSource={data}
          loading={loading}
          pagination={pagination}
          onChange={handleTableChange}
        />
      </Modal>
    </div>
  );
}
