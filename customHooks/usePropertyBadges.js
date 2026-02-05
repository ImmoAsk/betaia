import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// Utilise le proxy local pour eviter les erreurs CORS
const apiUrl = '/api/graphql';

export default function usePropertyBadges(propertyid) {
    return useQuery({
        queryKey: ["badges_property", propertyid],
        queryFn: async () => {
            const query = `{getBadgesByProprieteId(propriete_id:${propertyid}){id,badge{badge_name,badge_image},date_expiration}}`;
            const response = await axios.get(apiUrl, { params: { query } });
            return response.data?.data?.getBadgesByProprieteId || [];
        }
    });
}