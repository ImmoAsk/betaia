import { useState} from "react";

const categoryParamTitle = (categoryParam) => {
  let humanTitle="";
  switch (categoryParam) {
    case 'bailler':
      humanTitle = "Baux immobiliers";
      return humanTitle
      break
    case 'vendre':
      humanTitle = "Ventes immobilières"
      return humanTitle
      break
    case 'louer':
      humanTitle = "Locations immobilières"
      return humanTitle
      break
    case 'investir':
      humanTitle = "Investissements immobiliers"
      return humanTitle
      break
    default:
      humanTitle = "Locations immobilières"
      return humanTitle
      break
  }
}

export default categoryParamTitle;
