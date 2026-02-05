import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// Utilise le proxy local pour eviter les erreurs CORS
const apiUrl = '/api/graphql';

export default function useListQuarters(town_id) {
    return useQuery({
        queryKey: ["Quarters", town_id],
        queryFn: async () => {
            const query = `{getDistrictsByTownId(ville_id:${town_id}){id,denomination,code}}`;
            const response = await axios.get(apiUrl, { params: { query } });
            return response.data?.data?.getDistrictsByTownId || [];
        }
    });
}

