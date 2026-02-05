import toNormalForm from "./toNormalForm";
import { replaceSpacesWithAny } from "./generalUtils";

const getPropertyFullUrl = (country, categoryParam, propertytype, town, quarter, nuo) => {
  // Validation des parametres obligatoires
  if (!country || !propertytype || !town || !nuo) {
    console.error("getPropertyFullUrl: parametres manquants", { country, categoryParam, propertytype, town, quarter, nuo });
    return '#';
  }
  
  let categoryArray = {
    'bailler': 'baux-immobiliers',
    'vendre': 'ventes-immobilieres',
    'louer': 'locations-immobilieres',
    'investir': 'investissements-immobiliers'
  };

  const category = categoryArray[categoryParam] || 'locations-immobilieres';
  // Eviter le double slash en utilisant 'centre' comme valeur par defaut
  const safeQuarter = quarter ? quarter.toLowerCase() : 'centre';
  const safePropertyType = replaceSpacesWithAny(toNormalForm(propertytype.toLowerCase()), '-');
  const safeTown = toNormalForm(town.toLowerCase());
  const safeCountry = country.toLowerCase();
  
  let uri = '/' + safeCountry + '/' + category + '/' + safePropertyType + '/' + safeTown + '/' + safeQuarter + '/' + nuo;
  return uri;
};

export default getPropertyFullUrl;