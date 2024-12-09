import React, { useState, useEffect, useRef } from "react";
import { Button, Modal, Input, List, Typography, Divider, Spin, message as AntMessage } from "antd";
import AxiosInstance from "../../../../../../../../api/http";

const { TextArea } = Input;
const { Paragraph } = Typography;

function YapayZekayaSor({ selectedRows }) {
  // Modal görünürlüğünü kontrol eden durum
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Sohbet mesajlarını saklayan durum
  const [messages, setMessages] = useState([]);

  // Kullanıcının girdiği mesajı saklayan durum
  const [userInput, setUserInput] = useState("");

  // API'den gelen araç bilgilerini saklayan durum
  const [vehicleData, setVehicleData] = useState(null);

  // İlk yükleme durumunu tutan state
  const [initialLoading, setInitialLoading] = useState(false);

  // Yanıt beklerken (mesaj gönderdiğimizde) bekleme durumunu tutan state
  const [responseLoading, setResponseLoading] = useState(false);

  // Mesaj listesini otomatik kaydırmak için ref
  const messageListRef = useRef(null);

  // Google Gemini API Anahtarı (Güvenlik riski taşır!)
  const GEMINI_API_KEY = "AIzaSyBsTjvQnaDv-xz-XMtldUTCGC6m0dMah2Q"; // Buraya kendi API anahtarınızı ekleyin

  // Modal açıldığında araç bilgilerini çek ve sohbete başla
  const showModal = async () => {
    if (!selectedRows || !selectedRows.key) {
      AntMessage.error("Bir araç seçmelisiniz.");
      return;
    }

    setIsModalVisible(true);
    setInitialLoading(true);

    try {
      const response = await AxiosInstance.get(`Vehicle/GetVehicleById`, {
        params: { id: selectedRows.key },
      });

      setVehicleData(response.data);

      // Başlangıç mesajı ekle
      /*       setMessages([{ sender: "system", text: "Araç bilgileri yüklendi. Sorularınızı sorabilirsiniz." }]); */

      // Araç bilgilerini modele gönder
      await sendToGemini("Araç bilgileri: " + JSON.stringify(response.data));
    } catch (error) {
      console.error("API Hatası:", error);
      AntMessage.error("Araç bilgileri yüklenirken bir hata oluştu.");
      setIsModalVisible(false);
    } finally {
      setInitialLoading(false);
    }
  };

  // Modal'ı kapatma fonksiyonu
  const handleCancel = () => {
    setIsModalVisible(false);
    setMessages([]);
    setUserInput("");
    setVehicleData(null);
  };

  // Google Gemini API'ye mesaj gönderme fonksiyonu
  const sendToGemini = async (message) => {
    const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

    try {
      const response = await fetch(GEMINI_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: message,
                },
              ],
            },
          ],
          systemInstruction: {
            role: "system",
            parts: [
              {
                text:
                  "Sen bir araç bilgisi asistanısın. Aşağıda araçla ilgili detaylı bilgiler verilmiştir. Bu bilgileri kullanarak kullanıcının sorularına cevap ver. Kullanıcı bir soru sormasını bekle:\n" +
                  JSON.stringify(vehicleData),
              },
            ],
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Google Gemini API Hatası: ${response.statusText}`);
      }

      const data = await response.json();
      const geminiResponse = data.candidates[0].content.parts[0].text;

      setMessages((prevMessages) => [...prevMessages, { sender: "bot", text: geminiResponse }]);
    } catch (error) {
      console.error("Gemini API Hatası:", error);
      AntMessage.error("Google Gemini API ile iletişim kurulamadı.");
      setMessages((prevMessages) => [...prevMessages, { sender: "bot", text: "Bir hata oluştu. Lütfen tekrar deneyin." }]);
    }
  };

  // Mesaj gönderme fonksiyonu
  const handleSend = async () => {
    if (userInput.trim() === "") return;

    const newMessages = [...messages, { sender: "user", text: userInput }];
    setMessages(newMessages);
    setUserInput("");

    // Sadece yanıt beklerken loading aç
    setResponseLoading(true);

    try {
      await sendToGemini(userInput);
    } catch (error) {
      console.error("Mesaj gönderme sırasında hata:", error);
      setMessages((prev) => [...prev, { sender: "bot", text: "Bir hata oluştu. Lütfen tekrar deneyin." }]);
      AntMessage.error("Mesaj gönderilirken bir hata oluştu.");
    } finally {
      setResponseLoading(false);
    }
  };

  // Mesajlar güncellendiğinde otomatik kaydır
  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div>
      <div style={{ cursor: "pointer" }} onClick={showModal}>
        Yapay Zekaya Sor
      </div>

      <Modal title="Yapay Zeka ile Sohbet" open={isModalVisible} onCancel={handleCancel} footer={null} width={600}>
        {initialLoading ? (
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <Spin />
          </div>
        ) : (
          <>
            <div ref={messageListRef} style={{ maxHeight: "300px", overflowY: "auto" }}>
              <List
                dataSource={messages}
                renderItem={(item) => {
                  const isUser = item.sender === "user";
                  return (
                    <List.Item
                      style={{
                        display: "flex",
                        justifyContent: isUser ? "flex-end" : "flex-start",
                      }}
                    >
                      <div
                        style={{
                          backgroundColor: isUser ? "#e6f7ff" : "#f5f5f5",
                          padding: "8px 12px",
                          borderRadius: "8px",
                          maxWidth: "80%",
                          wordBreak: "break-word",
                          textAlign: isUser ? "right" : "left",
                        }}
                      >
                        <Paragraph style={{ margin: 0 }}>{item.text}</Paragraph>
                      </div>
                    </List.Item>
                  );
                }}
                locale={{ emptyText: "Sohbete başlayın!" }}
              />
            </div>
            <Divider />
            <TextArea
              rows={4}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Mesajınızı yazın..."
              onPressEnter={(e) => {
                if (!e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              disabled={responseLoading}
            />
            <Button type="primary" onClick={handleSend} style={{ marginTop: "10px" }} block disabled={responseLoading}>
              {responseLoading ? <Spin /> : "Gönder"}
            </Button>
          </>
        )}
      </Modal>
    </div>
  );
}

export default YapayZekayaSor;
