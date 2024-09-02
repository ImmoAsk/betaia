import { useState} from "react";

const getFirstImageArray = (imageArray) => {
  let firstImage='';
  let tempImgsArray =[];
  if(Array.isArray(imageArray) && !imageArray.length){
    firstImage='/images/tg/catalog/39.jpg';
  }
  imageArray.map((visuel) => {
    tempImgsArray.push(visuel.uri);
    firstImage='https://immoaskbetaapi.omnisoft.africa/public/storage/uploads/visuels/proprietes/'+tempImgsArray[0];
  });
  let oneImageArray = [[firstImage, 467, 305, 'Image']];
  return oneImageArray
}

export default getFirstImageArray;