import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// Utilise le proxy local pour eviter les erreurs CORS
const apiUrl = '/api/graphql';

export default function businessInsight() {
    return useQuery({
      queryKey: ["BI"],
      queryFn: async () => {
        const query = `{immoaskBI{minCountByTownPropertyUsage}}`;
        const response = await axios.get(apiUrl, { params: { query } });
        return response.data?.data?.immoaskBI?.minCountByTownPropertyUsage || null;
      }
    });
}