import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// Utilise le proxy local pour eviter les erreurs CORS
const apiUrl = '/api/graphql';

export default function useListTowns(country_code) {
    return useQuery({
        queryKey: ["towns", country_code],
        queryFn: async () => {
            const query = `{getTownsByCountryCode(pays_id:${country_code}){id,denomination,code}}`;
            const response = await axios.get(apiUrl, { params: { query } });
            return response.data?.data?.getTownsByCountryCode || [];
        }
    });
}