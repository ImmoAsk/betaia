import React, { useState, useEffect } from 'react';
import ImageLoader from '../ImageLoader'
const ImageComponent = ({ imageUri }) => {
  let imageUrl = 'https://immoaskbetaapi.omnisoft.africa/public/storage/uploads/visuels/proprietes/' + imageUri;
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
        //<ImageLoader className='rounded-3' src={'https://immoaskbetaapi.omnisoft.africa/public/storage/uploads/visuels/proprietes/' + imageUri} width={967} height={545} alt='Image' />
        <img className='rounded-3' src={'https://immoaskbetaapi.omnisoft.africa/public/storage/uploads/visuels/proprietes/' + imageUri} width={967} height={545} alt='Bien immobilier ImmoAsk'/>
      ) : (
        //<ImageLoader className='rounded-3' src={'https://immoaskbetaapi.omnisoft.africa/public/storage/uploads/visuels/proprietes/' + imageUri} width={967} height={545} alt='Image' />
        <img className='rounded-3' src={'https://immoaskbetaapi.omnisoft.africa/public/storage/uploads/visuels/proprietes/' + imageUri} width={967} height={545} alt='Bien immobilier ImmoAsk'/>
      )}
    </>
  );
};

export default ImageComponent;