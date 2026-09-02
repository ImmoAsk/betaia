"use client";
import React from "react";
import properties from "./dummy data/propertyData.json";

export default function PropertyTypeCounter({ countSejours, countLogements, countEntreprises, countAcquisitions }) {
  const typeCounts = properties.reduce((acc, property) => {
    const type = property.property_type.toLowerCase().trim();
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  const typeIcons = {
    sejours: "fi-home",
    logements: "fi-apartment",
    entreprises: "fi-home",
    acquisitions: "fi-apartment",
  };

  return (
    <div>
      <ul className="list-unstyled">
        
          <li className="d-flex align-items-center mb-2">
            <i
              className={`${typeIcons.sejours || "fi-map"} me-2 text-primary`}
              style={{ fontSize: "1rem" }}
            ></i>
            <span>
              <span>{countSejours}</span> {" "}
              <strong>biens immobiliers meublés</strong>{" "}
            </span>
          </li>

          <li  className="d-flex align-items-center mb-2">
            <i
              className={`${typeIcons.logements || "fi-map"} me-2 text-primary`}
              style={{ fontSize: "1rem" }}
            ></i>
            <span>
              <span>{countLogements}</span> {" "}
              <strong>logements de long terme</strong>{" "}
            </span>
          </li>
          <li className="d-flex align-items-center mb-2">
            <i
              className={`${typeIcons.entreprises || "fi-map"} me-2 text-primary`}
              style={{ fontSize: "1rem" }}
            ></i>
            <span>
              <span>{countEntreprises}</span> {" "}
              <strong>biens d'entreprise</strong>{" "}
            </span>
          </li>
          <li  className="d-flex align-items-center mb-2">
            <i
              className={`${typeIcons.acquisitions || "fi-map"} me-2 text-primary`}
              style={{ fontSize: "1rem" }}
            ></i>
            <span>
              <span>{countAcquisitions}</span> {" "}
              <strong>biens en achat immobilier</strong>{" "}
            </span>
          </li>
        
      </ul>
    </div>
  );
}
