import { use } from "react";
import buildPropertyBadge from "./buildPropertyBadge";
import getFirstImageArray from "./formatFirsImageArray";
import getPropertyFullUrl from "./getPropertyFullURL";
import numeral from "numeral";
import { usePropertiesBySuperCategory } from "../customHooks/realEstateHooks";
import { title } from "process";

const OFFER_MAP = { 1: "locations", 2: "achats", 3: "investissements", 4: "bails" };
const CATEGORY_MAP = {
    1: "Villa",
    2: "Appartement",
    3: "Maison",
    4: "Chambre",
    5: "Chambre salon",
    6: "Terrain rural",
    9: "Bureau",
    10: "Appartement meublé",
    7: "Terrain urbain",
    12: "Magasin",
    13: "Terrain",
    14: "Boutique",
    8: "2 chambres salon",
    11: "3 chambres salon",
    15: "Studio",
    16: "Pièce",
    17: "Studio meublé",
    18: "Immeuble",
    19: "Immeuble commercial",
    20: "Espace coworking",
    21: "Villa luxueuse",
    22: "Appartement luxueux",
    23: "Villa meublée",
    24: "Bureau meublé",
    25: "Hotel",
    26: "Ecole",
    27: "Chambre d'hotel",
    28: "Bar-restaurant",
    29: "Espace commercial",
    30: "Garage",
    31: "Salle de conference"
}
    ;
const USAGE_MAP = { 1: "logements", 3: "immeubles commerciaux", 5: "sejours", 7: "achats" };
const TOWN_MAP = {
    1: "Lome",
    2: "Kpalime",
    3: "Tsevie",
    4: "Akepe",
    5: "Tabligbo",
    6: "Notse",
    7: "Aneho",
    8: "Kovie",
    9: "Keve",
    10: "Afagnan",
    11: "Agbelouve",
    12: "Noepe",
    13: "Togoville",
    14: "Agbodrafo",
    15: "Koudassi"
}
    ;
const DISTRICT_MAP = {
    1: "Novissi",
    2: "Adetikope",
    3: "Baguida",
    4: "Agoe",
    7: "Bè",
    9: "Attiégou",
    10: "Gblinkome",
    13: "Hédzranawoe",
    14: "Adidogome",
    18: "Akodessewa",
    20: "Leo 2000",
    23: "Avenou",
    24: "Kegue",
    25: "Adewui",
    26: "Zanguera",
    29: "Avedji",
    36: "Avepozo",
    54: "Kpogan",
    68: "Djidjolé",
    73: "Badja",
    74: "Atikoumé",
    79: "Amouzoukopé",
    80: "Mission tové",
    81: "Attikpa",
    85: "Klikamé",
    98: "Agbalépédo",
    1480: "Agbelouve",
    102: "Nyékonakpoè",
    106: "Agodékè",
    120: "Totsi",
    123: "Lomégan",
    147: "Adakpame",
    156: "Adamavo",
    158: "Togo 2000",
    162: "Assahoun",
    190: "Adidoadin",
    205: "Agbata",
    209: "Dague",
    213: "Glenvie",
    228: "Dékon",
    229: "Lome nava",
    236: "Vovi",
    243: "Kpomé",
    268: "Tokoin",
    289: "Bodje",
    294: "Gta",
    305: "Kodjoviakope",
    306: "Sagbado",
    452: "Davie",
    485: "Segbe",
    517: "Ananissime",
    518: "Akepedo",
    519: "Tsiviepe",
    577: "Kleme agokpanou",
    581: "Assigome",
    605: "Zebevi",
    705: "Nukafu",
    707: "Kelegougan",
    718: "Glidji",
    719: "Agbalepedogan",
    848: "Chr tsevie",
    857: "Cite oua",
    858: "Ablogame",
    929: "Afanme",
    943: "Sigbehoue",
    987: "Kpogan",
    1008: "Caisse",
    1055: "Noukafou",
    1059: "Ahanoukope",
    1061: "Kagome",
    1063: "Agbavi",
    1069: "Sito aeroport",
    1083: "Djagble",
    1102: "Assivito",
    1124: "Kpeme",
    1129: "Gbegnedji",
    1173: "Gbossime",
    1176: "Afagnan",
    1180: "Sanguera",
    1200: "Agbalepeto",
    1217: "Kpime",
    1220: "Yokele",
    1231: "Cito aeroport",
    1255: "Super taco",
    1272: "Agbavi",
    1294: "Agbanou",
    1396: "Akepe",
    1408: "Noepe",
    1418: "Avetonou",
    1479: "Sagboville",
    1481: "Avegame",
    1482: "Akato",
    1483: "Noepe",
    1484: "Togoville",
    1485: "Agbodrafo",
    1486: "Kpessi",
    1487: "Agou",
    1488: "Dalave",
    1489: "Koudassi"
};


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


const getLastPage = (totalItems) => {
    var reminder = totalItems % 6;
    var totalPages = totalItems / 6;
    if (reminder === 0) { var lastPage = totalPages; }
    if (reminder != 0) { var lastPage = Math.floor(totalPages) + 1; }
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
    //console.log("Before Processing - Property: ", property);

    if (!property.pays) {
        console.error("🚨 Error: property.pays is undefined!");
        return null;
    }

    let _objetProperty = {
        nuo: property?.nuo,
        href: getPropertyFullUrl(property?.pays?.code, property?.offre?.denomination,
            property?.categorie_propriete?.denomination,
            property?.ville?.denomination,
            property?.quartier?.minus_denomination,
            property?.nuo),
        images: [[getFirstImageArray(property.visuels), 467, 305, 'Image']],
        img: [getFirstImageArray(property.visuels), 735, 389, 'Image'],
        title: `N°${property?.nuo}: ${property?.categorie_propriete?.denomination} à ${property?.offre?.denomination} | ${property?.surface}m²`,
        category: property?.usage,
        id: property?.id,
        location: `${property?.quartier?.denomination}, ${property?.ville?.denomination}`,
        price: getHumanReadablePrice(property),
        badges: buildPropertyBadge(property?.badge_propriete),
        amenities: [property?.piece, property?.wc_douche_interne, property?.garage],
    };

    //console.log("Processed Property Object: ", _objetProperty);
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
            id: owner.id,
            fullName: owner.name,
            ownerEmail: owner.email,
            phoneNumber: owner.phone,
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
            label: owner.name + "@" + owner.organisation.name_organisation,
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

function formatLandlordPropertiesOptions(properties) {
    if (!Array.isArray(properties)) {
        console.error('Invalid input: districts must be an array.');
        return [];
    }

    return properties.map((property) => {
        return {
            value: String(property?.id),
            id: property?.id,
            label: `${property?.title} , ${property?.location} , ${property?.price}`,
            location: property?.location,
            price: property.price,
            category: property?.category,
            images: property?.images,
            title: property?.title,
            badges: property?.badges,
            amenities: property?.amenities,
            href: property?.href,
            horizontal: true,
            nuo: property?.nuo,
        };
    });
}



function createCatalogTitle(category, offer, town, district, usage) {
    let titleParts = [];

    if (offer && OFFER_MAP[offer]) titleParts.push(OFFER_MAP[offer]);
    if (category && CATEGORY_MAP[category]) titleParts.push(CATEGORY_MAP[category]);
    if (usage && USAGE_MAP[usage]) titleParts.push(USAGE_MAP[usage]);
    if (district && DISTRICT_MAP[district]) titleParts.push(`à ${DISTRICT_MAP[district]}`);
    else if (town && TOWN_MAP[town]) titleParts.push(`à ${TOWN_MAP[town]}`);

    return titleParts.length ? "Catalogue immobilier de " + titleParts.join(" ") : "Catalogue des biens immobiliers";
}

function createTop6PropertiesIn(properties) {
    let top6Properties = [];
    if (properties.length === 0) {
        console.warn("No properties found after filtering.");
        return [];
    }
    let tempPropertyArray = buildPropertiesArray(properties);//[{},{},{}]
    top6Properties = createNestedArray(tempPropertyArray, 2, 3);
    return top6Properties;
}

function createNestedArray(inputArray, rows, cols) {
    if (inputArray.length !== rows * cols) {
        throw new Error("Invalid input: The array length must match rows * cols");
    }

    let index = 0;
    return Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () => (inputArray[index++]))
    );
}
export { createTop6PropertiesIn, formatLandlordPropertiesOptions,createCatalogTitle, formatDate, getHumanReadablePrice, formatDistrictsOptions, formatTownsOptions, buildPropertiesArray, replaceSpacesWithAny, getLastPage, createPropertyObject, capitalizeFirstLetter, replaceSpacesWithDots, toLowerCaseString, formatPropertyOwners, formatRealEstateAgents };

