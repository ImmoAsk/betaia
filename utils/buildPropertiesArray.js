import buildPropertyBadge from "./buildPropertyBadge";
import getFirstImageArray from "./formatFirsImageArray";
import { getHumanReadablePrice } from "./generalUtils";
import getPropertyFullUrl from "./getPropertyFullURL";

function buildPropertiesArray  (properties)  {

    let  tempPropertyArray =[];
    
    if(Array.isArray(properties) && !properties.length){
      tempPropertyArray=[];
    }
    properties.map((property) => {
      const _objetProperty=createPropertyObject(property);
      tempPropertyArray.push(_objetProperty);
    });
    let propertiesArrayCustomized = tempPropertyArray;
    return propertiesArrayCustomized;
  }
 function createPropertyObject (property){
    //console.log(property)
    let _objetProperty={
      nuo:property.nuo,
      href: getPropertyFullUrl(property.pays.code,property.offre.denomination,property.categorie_propriete.denomination,property.ville.denomination,property.quartier.denomination,property.nuo),
      images: [[getFirstImageArray(property.visuels), 467, 305, 'Image']],
      title: 'N°'+property.nuo+': '+property.categorie_propriete.denomination+' à '+property.offre.denomination+' | '+property.surface+'m²',
      category: property.usage,
      location: property.quartier.denomination+", "+property.ville.denomination,
      price: getHumanReadablePrice(property),
      badges: buildPropertyBadge(property.badge_propriete),
      amenities: [property.piece, property.wc_douche_interne, property.garage],
    }
    return _objetProperty;
  }
  export {buildPropertiesArray,createPropertyObject};