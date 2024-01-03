import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import getPropertyByFullUrl from "../remoteAPI/getProperty";

export default function useProperty(nuo) {
    return useQuery(["Property", nuo],
  ()=> axios.get(`http://127.0.0.1:8000/api/v2?query={propriete(nuo:${nuo}){nuo,garage,titre,descriptif,surface,usage,cuisine,salon,piece,wc_douche_interne,cout_mensuel,nuitee,cout_vente,categorie_propriete{denomination},ville{denomination},quartier{denomination},adresse{libelle},offre{denomination},visuels{uri}}}`).then(res=>res.data));;
}