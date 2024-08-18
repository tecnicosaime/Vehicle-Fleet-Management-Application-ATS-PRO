import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal, Table, Input } from "antd";
import AxiosInstance from "../../../../../../../../api/http";
import { Resizable } from "react-resizable";
import { CheckCircleOutlined, CloseCircleOutlined, SearchOutlined } from "@ant-design/icons";
import { useFormContext } from "react-hook-form";

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

export default function HasarNoTablo({ workshopSelectedId, onSubmit }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debounceTimer, setDebounceTimer] = useState(null);
  const [hasInteracted, setHasInteracted] = useState(false); // To track if the user has interacted with the search input

  const { watch } = useFormContext();

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

  const plakaID = watch("PlakaID");

  const fetch = useCallback(() => {
    setLoading(true);
    const body = [plakaID];

    AxiosInstance.post(`Accident/GetAccidentsListByVehicleId?page=${pagination.current}&parameter=${searchTerm}`, body)
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
  }, [pagination.current, searchTerm, plakaID]);

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

  useEffect(() => {
    if (hasInteracted) {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
      const timeout = setTimeout(() => {
        fetch();
      }, 2000);
      setDebounceTimer(timeout);

      return () => clearTimeout(timeout);
    }
  }, [searchTerm, hasInteracted, fetch]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    if (!hasInteracted) setHasInteracted(true);
  };

  return (
    <div>
      <Button onClick={handleModalToggle}> + </Button>
      <Modal width={1200} centered title="Kaza Kayıtları" open={isModalVisible} onOk={handleModalOk} onCancel={handleModalToggle}>
        <Input placeholder="Arama..." prefix={<SearchOutlined />} value={searchTerm} onChange={handleSearchChange} style={{ marginBottom: "20px" }} />
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
