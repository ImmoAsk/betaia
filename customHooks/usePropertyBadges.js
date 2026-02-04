import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function usePropertyBadges(propertyid) {
    return useQuery({
        queryKey: ["badges_property",propertyid],
        queryFn: ()=> axios.get(`${apiUrl}?query={getBadgesByProprieteId(propriete_id:${propertyid}){id,badge{badge_name,badge_image},date_expiration}}`).then(res=>res.data.data.getBadgesByProprieteId)
    });
}