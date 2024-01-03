import { useState} from "react";

const getFirstImageArray = (imageArray) => {
  let firstImage='';
  let tempImgsArray =[];
  if(Array.isArray(imageArray) && !imageArray.length){
    firstImage='/images/tg/catalog/39.jpg';
  }
  imageArray.map((visuel) => {
    tempImgsArray.push(visuel.uri);
    firstImage='https://immoask.com/tg/uploads/images_biens/'+tempImgsArray[0];
  });
  let oneImageArray = [[firstImage, 467, 305, 'Image']];
  return oneImageArray
}

export default getFirstImageArray;