import React, { useState } from 'react';

const ImageSized = ({ imageUri, width, height, alt }) => {
  const [imageSrc, setImageSrc] = useState(imageUri);
  const fallbackImage = '/images/logo/immoask-logo-cropped.png';

  // Gestion de l'erreur de chargement directement via onError
  const handleImageError = () => {
    setImageSrc(fallbackImage);
  };

  return (
    <img
      className="rounded-3"
      src={imageSrc}
      width={width}
      height={height}
      alt={alt || 'Image'}
      style={{ opacity: 0.9 }}
      onError={handleImageError}
    />
  );
};

export default ImageSized;