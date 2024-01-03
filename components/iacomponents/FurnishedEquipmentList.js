import React from "react";
import FurnishedEquipment from "./FurnishedEquipment";

export default function FurnishedEquipmentList({furnishedEquipments}) {
    return (
        furnishedEquipments.map(({ icone, libelle }, indx) => (
            <FurnishedEquipment icon={icone} title={libelle} indx={indx}/>
        )));
}