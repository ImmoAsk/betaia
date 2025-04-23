import React, { useState, useEffect } from 'react';

const ImageSized = ({ imageUri, width, height, alt }) => {
  const [imageSrc, setImageSrc] = useState(imageUri);

  useEffect(() => {
    const checkImageStatus = async () => {
      try {
        const response = await fetch(imageUri, { method: 'HEAD' });

        if (!response.ok) {
          // Image is not available, set fallback
          setImageSrc('/images/logo/immoask-logo-cropped.png');
        }
      } catch (error) {
        console.error('Error checking image status:', error);
        setImageSrc('/images/logo/immoask-logo-cropped.png');
      }
    };

    checkImageStatus();
  }, [imageUri]);

  return (
    <img
      className="rounded-3"
      src={imageSrc}
      width={width}
      height={height}
      alt={alt}
      style={{ opacity: 0.9 }}
    />
  );
};

export default ImageSized;