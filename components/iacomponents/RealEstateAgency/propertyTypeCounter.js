"use client";
import React from "react";
import properties from "./dummy data/propertyData.json";

export default function PropertyTypeCounter() {
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
        {Object.entries(typeCounts).map(([type, count]) => (
          <li key={type} className="d-flex align-items-center mb-2">
            <i
              className={`${typeIcons[type] || "fi-map"} me-2 text-primary`}
              style={{ fontSize: "1rem" }}
            ></i>
            <span>
              <span>{count}</span> on{" "}
              <strong>{type.charAt(0).toUpperCase() + type.slice(1)}</strong>{" "}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
