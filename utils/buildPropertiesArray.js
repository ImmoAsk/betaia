import buildPropertyBadge from "./buildPropertyBadge";
import getFirstImageArray from "./formatFirsImageArray";
import { getHumanReadablePrice } from "./generalUtils";
import getPropertyFullUrl from "./getPropertyFullURL";

function buildPropertiesArray(properties) {
    let tempPropertyArray = [];
    
    if (!Array.isArray(properties) || properties.length === 0) {
        return [];
    }
    
    properties.forEach((property) => {
        const _objetProperty = createPropertyObject(property);
        if (_objetProperty) {
            tempPropertyArray.push(_objetProperty);
        }
    });
    
    return tempPropertyArray;
}

function createPropertyObject(property) {
    // Protection contre les proprietes null ou undefined
    if (!property || !property.offre || !property.categorie_propriete || !property.ville) {
        return null;
    }
    
    const paysCode = property?.pays?.code || 'tg';
    const quarterDenom = property?.quartier?.denomination || 'Centre';
    
    let _objetProperty = {
        nuo: property.nuo,
        href: getPropertyFullUrl(paysCode, property.offre.denomination, property.categorie_propriete.denomination, property.ville.denomination, quarterDenom, property.nuo),
        images: [[getFirstImageArray(property.visuels), 467, 305, 'Image']],
        title: 'N°' + property.nuo + ': ' + property.categorie_propriete.denomination + ' à ' + property.offre.denomination + ' | ' + property.surface + 'm²',
        category: property.usage,
        location: quarterDenom + ", " + property.ville.denomination,
        price: getHumanReadablePrice(property),
        badges: buildPropertyBadge(property.badge_propriete),
        amenities: [property.piece, property.wc_douche_interne, property.garage],
    };
    
    return _objetProperty;
}

export { buildPropertiesArray, createPropertyObject };