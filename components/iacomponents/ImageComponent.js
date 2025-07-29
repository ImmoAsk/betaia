import React, { useState, useEffect } from 'react';
import { IMAGE_URL } from '../../utils/settings';
const ImageComponent = ({ imageUri }) => {
  let imageUrl = IMAGE_URL + imageUri;
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const checkImageStatus = async () => {
      try {
        const response = await fetch(imageUrl);

        // Check if the response status is 404
        if (!response.ok) {
          setImageError(true);
        }
      } catch (error) {
        console.error('Error checking image status:', error);
        setImageError(true);
      }
    };

    checkImageStatus();
  }, [imageUrl]);

  return (
    <>
      {imageError ? (
         <>
          <img className='rounded-3' src={IMAGE_URL+"/"+imageUri} width={967} height={545} alt='Bien immobilier ImmoAsk' />
          <img
            src={"/images/logo/immoask-logo-cropped.png"}
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
      ) : (
        //<ImageLoader className='rounded-3' src={'https://immoaskbetaapi.omnisoft.africa/public/storage/uploads/visuels/proprietes/' + imageUri} width={967} height={545} alt='Image' />
        <>
          <img className='rounded-3' src={IMAGE_URL+"/"+imageUri} width={967} height={545} alt='Bien immobilier ImmoAsk' />
          <img
            src={"/images/logo/immoask-logo-cropped.png"}
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

      )}
    </>
  );
};

export default ImageComponent;