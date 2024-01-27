import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import 'dotenv/config';
const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
export default function useRTListProperties() {

    return useQuery(["RTProperties"],
  ()=> axios.get(`${apiUrl}?query={getAllProperties(first:20){data{est_disponible,nuo,usage,caution_avance,descriptif}}}`).
  then(res=>res.data.data.getAllProperties));
}