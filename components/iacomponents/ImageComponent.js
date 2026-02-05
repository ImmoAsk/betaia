import React, { useState } from 'react';
import { IMAGE_URL } from '../../utils/settings';

const ImageComponent = ({ imageUri }) => {
  const imageUrl = IMAGE_URL + "/" + imageUri;
  const [imageError, setImageError] = useState(false);

  // Gestion de l'erreur de chargement directement via onError
  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <>
      <img 
        className='rounded-3' 
        src={imageUrl} 
        width={967} 
        height={545} 
        alt='Bien immobilier ImmoAsk'
        onError={handleImageError}
        style={imageError ? { display: 'none' } : {}}
      />
      {imageError && (
        <img
          src="/images/logo/immoask-logo-cropped.png"
          alt="Logo fallback"
          width={967}
          height={545}
          className='rounded-3'
          style={{ objectFit: 'contain', backgroundColor: '#f5f5f5' }}
        />
      )}
      <img
        src="/images/logo/immoask-logo-cropped.png"
        alt="Logo"
        style={{
          position: "absolute",
          top: "10px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "128px",
          height: "auto",
          opacity: 0.8,
        }}
      />
    </>
  );
};

export default ImageComponent;