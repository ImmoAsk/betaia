import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import 'dotenv/config';
const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
export default function useListQuarters(town_id) {
    return useQuery(["Quarters", town_id],
  ()=> axios.get(`${apiUrl}?query={getDistrictsByTownId(ville_id:${town_id}){id,denomination,code}}`).then(res=>res.data.data.getDistrictsByTownId));
}

