import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import 'dotenv/config';
const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
function usePropertiesByOCTD({offer,category,town,district}) {
  
  return useQuery(["propertiesByOCTD",offer,category,town,district],
  ()=> axios.get(`${apiUrl}?query={getPropertiesByKeyWords(offre_id:${offer},ville_id:${ville},quartier_id:${district},category_id:${category})
  {badge_propriete{badge{badge_name,badge_image}},visuels{uri},surface,lat_long,nuo,usage,offre{denomination},categorie_propriete{denomination},pays{code},piece,titre,garage,cout_mensuel,ville{denomination},wc_douche_interne,cout_vente,quartier{denomination}}}`).then(res=>res.data.data.getPropertiesByKeyWords));
}

function useRessourceByRole(role){
  return useQuery(["ressources",role],
  ()=> axios.get(`${apiUrl}?query={getListRessourcesByUserRole(role_id:${role})
  {ressource{id,ressourceName,ressourceLink,icone,statut}}}`).then(res=>res.data.data.getListRessourcesByUserRole));
}

export{usePropertiesByOCTD,useRessourceByRole}