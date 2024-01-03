import { useState} from "react";
import toNormalForm from "./toNormalForm";
import { replaceSpacesWithAny } from "./generalUtils";

const getPropertyFullUrl = (country,categoryParam,propertytype,town,quarter,nuo) => {
  let categoryArray = {
    'bailler':'baux-immobiliers',
    'vendre' : 'ventes-immobilieres',
    'louer': 'locations-immobilieres',
    'investir':'investissements-immobiliers'
  }
  return '/'+country.toLowerCase()+'/'+categoryArray[categoryParam]+'/'+replaceSpacesWithAny(toNormalForm(propertytype.toLowerCase()),'-')+'/'+toNormalForm(town.toLowerCase())+'/'+quarter.toLowerCase()+'/'+nuo
}

export default getPropertyFullUrl;