import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import 'dotenv/config'
const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
export default function useListTowns(country_code) {
    return useQuery(["towns", country_code],
  ()=> axios.get(`${apiUrl}?query={getTownsByCountryCode(pays_id:${country_code}){id,denomination,code}}`).then(res=>res.data.data.getTownsByCountryCode));
}