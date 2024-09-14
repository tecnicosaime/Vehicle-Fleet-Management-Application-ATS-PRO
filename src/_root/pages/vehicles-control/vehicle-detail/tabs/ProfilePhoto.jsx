import React, { useState, useEffect } from "react";
import { Carousel, Image } from "antd";
import { DownloadPhotoByIdService } from "../../../../../api/services/upload/services";
import styled from "styled-components";

const CarouselSlide = styled.div`
  /* Center the content */
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  overflow: hidden !important;
`;

const ImageCarousel = ({ imageUrls }) => {
  const [images, setImages] = useState([]);

  useEffect(() => {
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
            // Assuming response.data contains the Blob of the image
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

  return (
    <Image.PreviewGroup items={images.map((image) => image.url)}>
      <Carousel arrows autoplay>
        {images.map((image) => (
          <CarouselSlide key={image.uid}>
            <Image src={image.url} alt={image.name} style={{ width: "100%", height: "100%" }} />
          </CarouselSlide>
        ))}
      </Carousel>
    </Image.PreviewGroup>
  );
};

export default ImageCarousel;
