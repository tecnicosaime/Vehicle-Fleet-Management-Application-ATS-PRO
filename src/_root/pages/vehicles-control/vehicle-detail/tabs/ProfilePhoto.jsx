import React, { useState, useEffect } from "react";
import { Carousel, Image, ConfigProvider } from "antd";
import { DownloadPhotoByIdService } from "../../../../../api/services/upload/services";
import styled from "styled-components";
import trTR from "antd/es/locale/tr_TR";
import enUS from "antd/es/locale/en_US";
import ruRU from "antd/es/locale/ru_RU";
import azAZ from "antd/es/locale/az_AZ"; // Import Azerbaijani locale

const CarouselSlide = styled.div`
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  overflow: hidden !important;
`;

const ImageCarousel = ({ imageUrls }) => {
  const [images, setImages] = useState([]);
  const [locale, setLocale] = useState(trTR); // Default locale

  useEffect(() => {
    // Retrieve the language code from localStorage
    const language = localStorage.getItem("i18nextLng");

    // Map the language code to the corresponding antd locale object
    const localeMap = {
      tr: trTR,
      en: enUS,
      ru: ruRU,
      az: azAZ, // Add Azerbaijani mapping
      // Add other mappings as needed
    };

    // Set the locale based on the retrieved language code
    if (language && localeMap[language]) {
      setLocale(localeMap[language]);
    }

    const fetchImages = async () => {
      try {
        if (imageUrls && imageUrls.length > 0) {
          const requests = imageUrls.map((img) => {
            const data = {
              photoId: img.tbResimId,
              extension: img.rsmUzanti,
              fileName: img.rsmAd,
            };
            return DownloadPhotoByIdService(data);
          });

          const responses = await Promise.all(requests);

          const fetchedImages = responses.map((response) => {
            // response.data'in içinde, API'nizin tasarımına göre blob veya base64 gibi veriler olabilir.
            // Bu örnekte blob olarak varsayıyoruz.
            return {
              uid: response.data.photoId,
              url: URL.createObjectURL(response.data),
              name: response.data.fileName,
            };
          });

          setImages(fetchedImages);
        } else {
          setImages([]);
        }
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();

    // Cleanup function to revoke object URLs
    return () => {
      images.forEach((image) => URL.revokeObjectURL(image.url));
    };
  }, [imageUrls]);

  const fallbackSrc = "/images/ResimYok.jpeg"; // Sabit resim yolunu burada belirtiyoruz

  return (
    <ConfigProvider locale={locale}>
      {images.length > 0 ? (
        <Image.PreviewGroup items={images.map((image) => image.url)}>
          <Carousel arrows autoplay>
            {images.map((image) => (
              <CarouselSlide key={image.uid}>
                <Image src={image.url} alt={image.name} style={{ width: "100%", height: "100%" }} />
              </CarouselSlide>
            ))}
          </Carousel>
        </Image.PreviewGroup>
      ) : (
        // Eğer resim yoksa fallback resimi Carousel içinde tek bir slide olarak gösteriyoruz.
        <Carousel arrows autoplay>
          <CarouselSlide>
            <Image src={fallbackSrc} alt="Fallback" style={{ width: "100%", height: "100%" }} />
          </CarouselSlide>
        </Carousel>
      )}
    </ConfigProvider>
  );
};

export default ImageCarousel;
