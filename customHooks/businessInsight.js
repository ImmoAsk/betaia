import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function businessInsight() {

    return useQuery(["BI"],
  ()=> axios.get(`http://127.0.0.1:8000/api/v2?query={immoaskBI{minCountByTownPropertyUsage}}`).
  then(res=>res.data.immoaskBI.minCountByTownPropertyUsage));
}