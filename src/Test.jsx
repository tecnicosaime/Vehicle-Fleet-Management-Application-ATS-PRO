import React, { useState, useEffect } from "react";
import { Carousel } from "antd";
import { DownloadPhotoByIdService } from "../../../../../api/services/upload/services";
import styled from "styled-components";

const CustomCarousel = styled(Carousel)`
  /* Remove fixed height to allow dynamic sizing */
`;

const CarouselSlide = styled.div`
  position: relative;
  width: 100%;
  /* Set the desired aspect ratio (e.g., 16:9) */
  padding-top: ${(9 / 16) * 100}%;

  /* Center the content */
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

const CarouselImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
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
    <CustomCarousel arrows autoplay>
      {images.map((image) => (
        <CarouselSlide key={image.uid}>
          <CarouselImage src={image.url} alt={image.name} />
        </CarouselSlide>
      ))}
    </CustomCarousel>
  );
};

export default ImageCarousel;
