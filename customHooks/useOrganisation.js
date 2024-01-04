import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import 'dotenv/config'
const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function useOrganisation(user_id) {
    return useQuery(["organisation", user_id],
  ()=> axios.get(`${apiUrl}?query={user(id:${user_id}){name,organisation{name_organisation,description,logo,facebook_url,linkedin_url,twitter_url,tel_whatsapp,tel_portable}}}`).then(res=>res.data.data.user));
}