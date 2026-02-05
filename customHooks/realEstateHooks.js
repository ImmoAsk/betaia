import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// Utilise le proxy local pour eviter les erreurs CORS
const apiUrl = '/api/graphql';

function usePropertiesByOCTD({ offer, category, town, district }) {
  return useQuery({
      queryKey: ["propertiesByOCTD", offer, category, town, district],
      queryFn: async () => {
          const query = `{getPropertiesByKeyWords(offre_id:${offer},category_id:${category},ville_id:${town},quartier_id:${district}){badge_propriete{badge{badge_name,badge_image}},visuels{uri},surface,lat_long,nuo,usage,offre{denomination},categorie_propriete{denomination},pays{code},piece,titre,garage,cout_mensuel,ville{denomination},wc_douche_interne,cout_vente,quartier{denomination}}}`;
          const response = await axios.get(apiUrl, { params: { query } });
          return response.data?.data?.getPropertiesByKeyWords || [];
      },
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
  });
}

function usePropertiesBySuperCategory({ usage, status }) {
    return useQuery({
        queryKey: ["propertiesBySuperCategory", usage, status],
        queryFn: async () => {
            // Champ pays retire car certaines proprietes (usage=1 logements) n'ont pas de pays defini
            const query = `{getPropertiesByKeyWords(orderBy:{column:NUO,order:DESC},limit:6,usage:${usage},statut:${status}){badge_propriete{badge{badge_name,badge_image}},visuels{uri,position},surface,lat_long,nuo,usage,offre{denomination},categorie_propriete{denomination},piece,titre,garage,cout_mensuel,ville{denomination},wc_douche_interne,cout_vente,quartier{denomination,minus_denomination}}}`;
            const response = await axios.get(apiUrl, { params: { query } });
            return response.data?.data?.getPropertiesByKeyWords || [];
        },
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false
    });
}

function useRessourceByRole(role) {
  return useQuery({
      queryKey: ["ressources", role],
      queryFn: async () => {
          const query = `{getListRessourcesByUserRole(role_id:${role}){ressource{id,ressourceName,ressourceLink,icone,statut}}}`;
          const response = await axios.get(apiUrl, { params: { query } });
          return response.data?.data?.getListRessourcesByUserRole || [];
      },
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
  });
}


function useRessourceByUser(userId) {
  return useQuery({
      queryKey: ["user_ressources", userId],
      queryFn: async () => {
          const query = `{getListRessourcesByUser(user_id:${userId},statut:1){ressource{id,ressourceName,ressourceLink,icone,statut}}}`;
          const response = await axios.get(apiUrl, { params: { query } });
          return response.data?.data?.getListRessourcesByUser || [];
      },
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
  });
}

function useUser(userId) {
  return useQuery({
      queryKey: ["user_identity", userId],
      queryFn: async () => {
          const query = `{user(id:${userId}){id,name,email,phone,avatar}}`;
          const response = await axios.get(apiUrl, { params: { query } });
          return response.data?.data?.user || null;
      },
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
  });
}



function useUserProperties(user) {
  return useQuery({
      queryKey: ["user_properties", user],
      queryFn: async () => {
          const query = `{getUserProperties(user_id:${user},first:50,orderBy:{order:DESC,column:NUO}){data{badge_propriete{badge{badge_name,badge_image}},visuels{uri,position},surface,lat_long,nuo,usage,id,offre{denomination,id},categorie_propriete{denomination,id},pays{code,id},piece,titre,garage,cout_mensuel,ville{denomination,id},wc_douche_interne,cout_vente,quartier{denomination,minus_denomination,id}}}}`;
          const response = await axios.get(apiUrl, { params: { query } });
          return response.data?.data?.getUserProperties || { data: [] };
      },
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
  });
}


export{usePropertiesByOCTD,useRessourceByRole,useUserProperties,usePropertiesBySuperCategory,useRessourceByUser, useUser};