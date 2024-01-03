import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function useListQuarters(town_id) {
    return useQuery(["Quarters", town_id],
  ()=> axios.get(`http://127.0.0.1:8000/api/v2?query={getDistrictsByTownId(ville_id:${town_id}){id,denomination,code}}`).then(res=>res.data.data.getDistrictsByTownId));
}

