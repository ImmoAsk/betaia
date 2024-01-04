import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import 'dotenv/config'
const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
export default function businessInsight() {

    return useQuery(["BI"],
  ()=> axios.get(`${apiUrl}?query={immoaskBI{minCountByTownPropertyUsage}}`).
  then(res=>res.data.immoaskBI.minCountByTownPropertyUsage));
}