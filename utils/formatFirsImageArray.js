import { useState } from "react";

const getFirstImageArray = (imageArray) => {
  let firstImage = '/images/tg/catalog/39.jpg'; // Default image
  let oneImageArray = firstImage;
  //console.log(imageArray);
  if (Array.isArray(imageArray) && imageArray.length) {
    // Find the image with position 1
    const firstVisuel = imageArray.find((visuel) => visuel.position === 1);

    if (firstVisuel && firstVisuel.uri) {
      firstImage = `https://immoaskbetaapi.omnisoft.africa/public/storage/uploads/visuels/proprietes/${firstVisuel.uri}`;
      oneImageArray = firstImage;
    }
  }

  return oneImageArray;
};

export default getFirstImageArray;
