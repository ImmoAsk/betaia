import React from "react";
import NearestInfrastructure from "./NearestInfrastructure";

export default function NearestInfrastructureList({ nearestinfrastructures }) {
    return (
        nearestinfrastructures.map(({ icone, denomination }, indx) => (
            <NearestInfrastructure icon={icone} title={denomination} indx={indx} />
        )));
}