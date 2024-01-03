import React from "react";


export default function LocationsOptions({locations}) {
 
  return locations.map((location,i) =>
  (<option key={i} value={location.id}>{location.denomination}</option>)
  );
}