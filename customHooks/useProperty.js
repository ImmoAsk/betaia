import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import getPropertyByFullUrl from "../remoteAPI/getProperty";
import 'dotenv/config'
const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
export default function useProperty(nuo) {
    return useQuery(["Property", nuo],
  ()=> axios.get(`${apiUrl}?query={propriete(nuo:${nuo}){nuo,garage,titre,descriptif,surface,usage,cuisine,salon,piece,wc_douche_interne,cout_mensuel,nuitee,cout_vente,categorie_propriete{denomination},ville{denomination},quartier{denomination},adresse{libelle},offre{denomination},visuels{uri}}}`).then(res=>res.data));;
}