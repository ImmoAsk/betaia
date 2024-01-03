import { useQuery } from "@tanstack/react-query";
import axios from "axios";


export default function useListTowns(country_code) {
    return useQuery(["towns", country_code],
  ()=> axios.get(`http://127.0.0.1:8000/api/v2?query={getTownsByCountryCode(pays_id:${country_code}){id,denomination,code}}`).then(res=>res.data.data.getTownsByCountryCode));
}