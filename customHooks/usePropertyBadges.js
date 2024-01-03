import { useQuery } from "@tanstack/react-query";
import axios from "axios";


export default function usePropertyBadges(propertyid) {
    return useQuery(["badges_property",propertyid],
  ()=> axios.get(`http://localhost:8000/api/v2?query={getBadgesByProprieteId(propriete_id:${propertyid}){id,badge{badge_name,badge_image},date_expiration}}`).then(res=>res.data.data.getBadgesByProprieteId));
}