import React from "react";
import { usePropertiesBySuperCategory } from "../../../customHooks/realEstateHooks";
import { PropertyListSwiper } from "../PropertyListSwiper";
import { createTop6PropertiesIn } from "../../../utils/generalUtils";


export default function SuperCategoryProperties({ usage, status }) {
    const { data: properties, isLoading, isError } = usePropertiesBySuperCategory({ usage, status });

    if (isLoading) return <p>Chargement des biens immobiliers...</p>;
    if (isError) return <p>Une erreur s&apos;est produite.</p>;
    //console.log("Usage: ", usage, "Status: ", status, "Properties: ", properties);
    const topProperties = createTop6PropertiesIn(properties); // Replace with your actual properties;
    //console.log("Top Properties: ", topProperties);
    return (
       <PropertyListSwiper propertyList={topProperties} />
    );
}
