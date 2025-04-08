import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import 'dotenv/config';
import { API_URL } from "../utils/settings";

export default function useOrganisation(user_id) {
    const final_url= `${API_URL}?query={user(id:${user_id}){name,phone,organisation{name_organisation,description,status,logo,facebook_url,linkedin_url,twitter_url,tel_whatsapp,tel_portable}}}`
    console.log(final_url)
    return useQuery(["organisation", user_id],()=> axios.get(final_url).then(res=>res.data.data.user));
}