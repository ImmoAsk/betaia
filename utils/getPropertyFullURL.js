import { useState } from "react";
import toNormalForm from "./toNormalForm";
import { replaceSpacesWithAny } from "./generalUtils";

const getPropertyFullUrl = (country, categoryParam, propertytype, town, quarter, nuo) => {
  console.log(country, categoryParam, propertytype, town, quarter, nuo);
  
  let categoryArray = {
    'bailler': 'baux-immobiliers',
    'vendre': 'ventes-immobilieres',
    'louer': 'locations-immobilieres',
    'investir': 'investissements-immobiliers'
  };

  const category = categoryArray[categoryParam] || 'locations-immobilieres';
  quarter = quarter ? quarter.toLowerCase() : '';
  nuo = nuo || '';
  let uri= '/' + country.toLowerCase() + '/' + category + '/' + replaceSpacesWithAny(toNormalForm(propertytype.toLowerCase()), '-') + '/' + toNormalForm(town.toLowerCase()) + '/' + quarter + '/' + nuo;
  console.log(uri);
  return uri
};

export default getPropertyFullUrl;