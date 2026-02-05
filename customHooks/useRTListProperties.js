import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// Utilise le proxy local pour eviter les erreurs CORS
const apiUrl = '/api/graphql';

export default function useRTListProperties() {
    return useQuery({
        queryKey: ["RTProperties"],
        queryFn: async () => {
            const query = `{getAllProperties(first:20){data{est_disponible,nuo,usage,caution_avance,descriptif}}}`;
            const response = await axios.get(apiUrl, { params: { query } });
            return response.data?.data?.getAllProperties || { data: [] };
        }
    });
}