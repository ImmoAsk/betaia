import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// Utilise le proxy local pour eviter les erreurs CORS
const apiUrl = '/api/graphql';

export default function useProperty(nuo) {
    return useQuery({
        queryKey: ["Property", nuo],
        queryFn: async () => {
            const query = `{propriete(nuo:${nuo}){nuo,garage,titre,descriptif,surface,usage,cuisine,salon,piece,wc_douche_interne,cout_mensuel,nuitee,cout_vente,categorie_propriete{denomination},ville{denomination},quartier{denomination},adresse{libelle},offre{denomination},visuels{uri}}}`;
            const response = await axios.get(apiUrl, { params: { query } });
            return response.data || null;
        }
    });
}