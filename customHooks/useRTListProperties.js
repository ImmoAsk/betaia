import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function useRTListProperties() {

    return useQuery(["RTProperties"],
  ()=> axios.get(`http://localhost:8000/api/v2?query={getAllProperties(first:20){data{est_disponible,nuo,usage,caution_avance,descriptif}}}`).
  then(res=>res.data.data.getAllProperties));
}