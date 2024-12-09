import buildPropertyBadge from "./buildPropertyBadge";
import getFirstImageArray from "./formatFirsImageArray";
import getPropertyFullUrl from "./getPropertyFullURL";
import numeral from "numeral";
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
function replaceSpacesWithDots(inputString) {
    return inputString.replace(/ /g, '.');
}

function replaceSpacesWithAny(inputString, anyThing) {
    return inputString.replace(/ /g, anyThing);
}


function toLowerCaseString(inputString) {
    return inputString.toLowerCase();
}


const getLastPage=(totalItems)=>{
    var reminder = totalItems%6;
    var totalPages= totalItems/6;
    if(reminder===0){ var lastPage=totalPages ;}
    if(reminder!=0){ var lastPage=Math.floor(totalPages)+1;}
    return lastPage;
  }

function buildPropertiesArray(properties) {

    let tempPropertyArray = [];

    if (Array.isArray(properties) && !properties.length) {
        tempPropertyArray = [];
    }
    properties.map((property) => {
        const _objetProperty = createPropertyObject(property);
        tempPropertyArray.push(_objetProperty);
    });
    let propertiesArrayCustomized = tempPropertyArray;
    return propertiesArrayCustomized;
}

const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' };
    return date.toLocaleDateString('fr-FR', options);
};
function createPropertyObject(property) {
    let _objetProperty = {
        nuo: property.nuo,
        href: getPropertyFullUrl(property.pays.code, property.offre.denomination, property.categorie_propriete.denomination, property.ville.denomination, property?.quartier?.minus_denomination, property.nuo),
        images: [[getFirstImageArray(property.visuels), 467, 305, 'Image']],
        title: 'N°' + property?.nuo + ': ' + property.categorie_propriete.denomination + ' à ' + property.offre.denomination + ' | ' + property.surface + 'm²',
        category: property.usage,
        location: property.quartier.denomination + ", " + property.ville.denomination,
        price: getHumanReadablePrice(property),
        badges: buildPropertyBadge(property.badge_propriete),
        amenities: [property.piece, property.wc_douche_interne, property.garage],
    }
    return _objetProperty;
}


function getHumanReadablePrice(property) {
    let price = property.cout_mensuel === 0 
        ? numeral(property.cout_vente).format('0,0') + " XOF/vie" 
        : numeral(property.cout_mensuel).format('0,0') + " XOF/mois";

    if (property.nuitee > 0) {
        price = numeral(property.nuitee).format('0,0') + " XOF/nuitée";
    }
    
    return price;
}

function formatPropertyOwners(owners) {
    if (!Array.isArray(owners)) {
        console.error('Invalid input: owners must be an array.');
        return [];
    }

    return owners.map((owner) => {
        return {
            value: String(owner.id),
            label: owner.name,
        };
    });
}

function formatRealEstateAgents(owners) {
    if (!Array.isArray(owners)) {
        console.error('Invalid input: owners must be an array.');
        return [];
    }

    return owners.map((owner) => {
        return {
            value: String(owner.id),
            label: owner.name +"@"+owner.organisation.name_organisation,
        };
    });
}


function formatTownsOptions(towns) {
    if (!Array.isArray(towns)) {
        console.error('Invalid input: towns must be an array.');
        return [];
    }

    return towns.map((town) => {
        return {
            value: String(town.id),
            label: town.denomination,
        };
    });
}

function formatDistrictsOptions(districts) {
    if (!Array.isArray(districts)) {
        console.error('Invalid input: districts must be an array.');
        return [];
    }

    return districts.map((district) => {
        return {
            value: String(district.id),
            label: district.denomination,
        };
    });
}


export { formatDate,getHumanReadablePrice,formatDistrictsOptions,formatTownsOptions,buildPropertiesArray,replaceSpacesWithAny,getLastPage,createPropertyObject,capitalizeFirstLetter, replaceSpacesWithDots, toLowerCaseString,formatPropertyOwners,formatRealEstateAgents};