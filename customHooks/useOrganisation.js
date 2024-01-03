import { useQuery } from "@tanstack/react-query";
import axios from "axios";


export default function useOrganisation(user_id) {
    return useQuery(["organisation", user_id],
  ()=> axios.get(`http://127.0.0.1:8000/api/v2?query={user(id:${user_id}){name,organisation{name_organisation,description,logo,facebook_url,linkedin_url,twitter_url,tel_whatsapp,tel_portable}}}`).then(res=>res.data.data.user));
}