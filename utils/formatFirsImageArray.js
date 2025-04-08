import { useState } from "react";
import { IMAGE_URL } from "./settings";

const getFirstImageArray = (imageArray) => {
  let firstImage = '/images/tg/catalog/39.jpg'; // Default image
  let oneImageArray = firstImage;
  //console.log(imageArray);
  if (Array.isArray(imageArray) && imageArray.length) {
    // Find the image with position 1
    const firstVisuel = imageArray.find((visuel) => visuel.position === 1);

    if (firstVisuel && firstVisuel.uri) {
      firstImage = `${IMAGE_URL}${firstVisuel.uri}`;
      oneImageArray = firstImage;
    }
  }

  return oneImageArray;
};

export default getFirstImageArray;
