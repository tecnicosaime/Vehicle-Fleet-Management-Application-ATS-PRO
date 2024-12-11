import React, { useState, useEffect, useMemo } from "react";
import { Modal, Table, Button, Checkbox, Typography } from "antd";
import { HolderOutlined, SearchOutlined, MenuOutlined, HomeOutlined, ArrowDownOutlined, ArrowUpOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";
import AxiosInstance from "../../../../../../api/http.jsx";
import { DndContext, PointerSensor, useSensor, useSensors, KeyboardSensor } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { Resizable } from "react-resizable";
import DraggableRow from "./DraggableRow";
import * as XLSX from "xlsx";
import { SiMicrosoftexcel } from "react-icons/si";

const { Text } = Typography;

// ResizableTitle bileşeni
const ResizableTitle = (props) => {
  const { onResize, width, ...restProps } = props;

  const handleStyle = {
    position: "absolute",
    bottom: 0,
    right: "-5px",
    width: "10px",
    height: "100%",
    zIndex: 2,
    cursor: "col-resize",
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

function RecordModal({ selectedRow, onDrawerClose, drawerVisible, onRefresh }) {
  const [tableData, setTableData] = useState([]);
  const [initialColumns, setInitialColumns] = useState([]);
  const [columns, setColumns] = useState([]);
  const [manageColumnsVisible, setManageColumnsVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (drawerVisible && selectedRow) {
      setLoading(true);
      const lan = localStorage.getItem("i18nextLng") || "tr";
      AxiosInstance.get("/Report/GetReportDetail", {
        params: { id: selectedRow.key, lan: lan },
      })
        .then((response) => {
          const { headers, list } = response.data;
          if (headers && headers.length > 0) {
            const headerObj = headers[0];
            const cols = Object.keys(headerObj).map((key) => ({
              title: headerObj[key],
              dataIndex: key,
              key: key,
              visible: true,
              width: 150,
            }));

            setInitialColumns(cols);
            setColumns(cols);
            setTableData(list);
          }
        })
        .catch((error) => {
          console.error("Error fetching detail:", error);
        })
        .finally(() => {
          setLoading(false); // Veri yüklendi veya hata alındı, spin durdur
        });
    } else {
      // Modal kapanınca resetle
      setTableData([]);
      setInitialColumns([]);
      setColumns([]);
    }
  }, [drawerVisible, selectedRow]);

  const visibleColumns = useMemo(() => columns.filter((col) => col.visible), [columns]);

  const toggleVisibility = (key, checked) => {
    setColumns((prev) => prev.map((col) => (col.key === key ? { ...col, visible: checked } : col)));
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setColumns((prev) => {
        const oldIndex = prev.findIndex((col) => col.key === active.id);
        const newIndex = prev.findIndex((col) => col.key === over.id);

        const visibleCols = prev.filter((col) => col.visible);
        const hiddenCols = prev.filter((col) => !col.visible);

        const moved = [...visibleCols];
        const [removed] = moved.splice(oldIndex, 1);
        moved.splice(newIndex, 0, removed);

        const reordered = moved.concat(hiddenCols);
        return reordered;
      });
    }
  };

  const handleRecordModalClose = () => {
    onDrawerClose();
  };

  const handleResize =
    (index) =>
    (e, { size }) => {
      setColumns((prevColumns) => {
        const newColumns = [...prevColumns];
        newColumns[index] = { ...newColumns[index], width: size.width };
        return newColumns;
      });
    };

  const components = {
    header: {
      cell: ResizableTitle,
    },
  };

  const resizableColumns = visibleColumns.map((col, index) => ({
    ...col,
    onHeaderCell: (column) => ({
      width: column.width,
      onResize: handleResize(index),
    }),
  }));

  // XLSX İndirme Fonksiyonu
  const handleExportXLSX = () => {
    // Visible kolon başlıklarını al
    const headers = visibleColumns.map((col) => col.title);
    // Veri satırlarını oluştur (sadece visible kolonların dataIndex'lerini kullan)
    const dataRows = tableData.map((row) => visibleColumns.map((col) => row[col.dataIndex]));

    const sheetData = [headers, ...dataRows];
    const ws = XLSX.utils.aoa_to_sheet(sheetData);

    // Sütun genişliklerini ayarla
    // Her visibleColumn için wpx: col.width değeri belirliyoruz
    ws["!cols"] = visibleColumns.map((col) => {
      return { wpx: col.width || 100 }; // width tanımlı değilse varsayılan 100 px verelim
    });

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "tablo_export.xlsx");
  };

  return (
    <>
      <Modal title={selectedRow?.rprTanim} open={drawerVisible} onCancel={handleRecordModalClose} footer={null} width={800}>
        <div style={{ marginBottom: "10px", display: "flex", justifyContent: "space-between" }}>
          <Button style={{ padding: "0px", width: "32px", height: "32px" }} onClick={() => setManageColumnsVisible(true)}>
            <MenuOutlined />
          </Button>
          <Button style={{ display: "flex", alignItems: "center" }} onClick={handleExportXLSX} icon={<SiMicrosoftexcel />}>
            İndir
          </Button>
        </div>
        <Table
          components={components}
          columns={resizableColumns}
          dataSource={tableData}
          loading={loading}
          rowKey={(record) => (record.id ? record.id : JSON.stringify(record))}
          pagination={{
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50", "100"],
            defaultPageSize: 10,
          }}
          scroll={{ y: "calc(100vh - 335px)" }}
        />
      </Modal>

      <Modal title="Sütunları Yönet" centered width={800} open={manageColumnsVisible} onOk={() => setManageColumnsVisible(false)} onCancel={() => setManageColumnsVisible(false)}>
        <Text style={{ marginBottom: "15px" }}>Aşağıdaki Ekranlardan Sütunları Göster / Gizle, Sıralamalarını ve Genişliklerini Ayarlayabilirsiniz.</Text>
        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "center",
            marginTop: "10px",
          }}
        >
          <Button
            onClick={() => {
              // Sütunları varsayılan haline döndür
              setColumns(initialColumns);
            }}
            style={{ marginBottom: "15px" }}
          >
            Sütunları Sıfırla
          </Button>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div
            style={{
              width: "46%",
              border: "1px solid #8080806e",
              borderRadius: "8px",
              padding: "10px",
            }}
          >
            <div
              style={{
                marginBottom: "20px",
                borderBottom: "1px solid #80808051",
                padding: "8px 8px 12px 8px",
              }}
            >
              <Text style={{ fontWeight: 600 }}>Sütunları Göster / Gizle</Text>
            </div>
            <div style={{ height: "400px", overflow: "auto" }}>
              {initialColumns.map((col) => (
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    alignItems: "center",
                    marginBottom: "8px",
                  }}
                  key={col.key}
                >
                  <Checkbox checked={columns.find((column) => column.key === col.key)?.visible || false} onChange={(e) => toggleVisibility(col.key, e.target.checked)} />
                  {col.title}
                </div>
              ))}
            </div>
          </div>

          <DndContext
            onDragEnd={handleDragEnd}
            sensors={useSensors(
              useSensor(PointerSensor),
              useSensor(KeyboardSensor, {
                coordinateGetter: sortableKeyboardCoordinates,
              })
            )}
          >
            <div
              style={{
                width: "46%",
                border: "1px solid #8080806e",
                borderRadius: "8px",
                padding: "10px",
              }}
            >
              <div
                style={{
                  marginBottom: "20px",
                  borderBottom: "1px solid #80808051",
                  padding: "8px 8px 12px 8px",
                }}
              >
                <Text style={{ fontWeight: 600 }}>Sütunların Sıralamasını Ayarla</Text>
              </div>
              <div style={{ height: "400px", overflow: "auto" }}>
                <SortableContext items={columns.filter((col) => col.visible).map((col) => col.key)} strategy={verticalListSortingStrategy}>
                  {columns
                    .filter((col) => col.visible)
                    .map((col, index) => (
                      <DraggableRow key={col.key} id={col.key} index={index} text={col.title} />
                    ))}
                </SortableContext>
              </div>
            </div>
          </DndContext>
        </div>
      </Modal>
    </>
  );
}

export default RecordModal;
