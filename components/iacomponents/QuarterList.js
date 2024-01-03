import React from "react";
import LoadingSpinner from "../LoadingSpinner";
import useListQuarters from "../../customHooks/useListQuarters";
import LocationsOptions from "./LocationsOptions";

export default function QuarterList({town_code}) {
  const { status, data:quarters, error, isFetching,isLoading,isError }  = useListQuarters(town_code);
  //console.log(towns);
  if(isLoading) return <LoadingSpinner/>
  return <LocationsOptions locations={quarters}/>
  ;
}