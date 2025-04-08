import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import 'dotenv/config';
const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
function useLandLord(role){
  return useQuery(["landlords",role],
  ()=> axios.get(`${apiUrl}?query={getPropertyOwners(role_id:${role})
  {id,name,organisation{logo,name_organisation,status,id}}}`).then(res=>res.data.data.getPropertyOwners));
}


export{useLandLord}