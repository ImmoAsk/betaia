import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import 'dotenv/config';
const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
function usePropertiesByOCTD({ offer, category, town, district }) {
  return useQuery({
      queryKey: ["propertiesByOCTD", offer, category, town, district],
      queryFn: async () => {
          const response = await axios.get(`${apiUrl}?query={
              getPropertiesByKeyWords(
                  offre_id: ${offer},
                  category_id: ${category},
                  ville_id: ${town},
                  quartier_id: ${district}
              ) {
                  badge_propriete { badge { badge_name, badge_image } },
                  visuels { uri },
                  surface, lat_long, nuo, usage,
                  offre { denomination },
                  categorie_propriete { denomination },
                  pays { code },
                  piece, titre, garage, cout_mensuel,
                  ville { denomination },
                  wc_douche_interne, cout_vente,
                  quartier { denomination }
              }
          }`);
          return response.data.data.getPropertiesByKeyWords;
      },
      staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
      refetchOnWindowFocus: false, // Avoid unnecessary refetching
  });
}

function usePropertiesBySuperCategory({ usage, status }) {
    return useQuery({
        queryKey: ["propertiesBySuperCategory", usage, status],
        queryFn: async () => {
            const response = await axios.get(`${apiUrl}?query={
                getPropertiesByKeyWords(orderBy:{column:NUO,order:DESC},limit:6,usage:${usage},statut:${status}) {
                    badge_propriete { badge { badge_name, badge_image } },
                    visuels { uri, position },
                    surface, lat_long, nuo, usage,
                    offre { denomination },
                    categorie_propriete { denomination },
                    pays { code },
                    piece, titre, garage, cout_mensuel,
                    ville { denomination },
                    wc_douche_interne, cout_vente,
                    quartier { denomination,minus_denomination }
                }
            }`);
            return response.data.data.getPropertiesByKeyWords;
        },
        staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
        refetchOnWindowFocus: false // Prevent unnecessary refetching
    });
}

function useRessourceByRole(role) {
  return useQuery({
      queryKey: ["ressources", role],
      queryFn: async () => {
          const response = await axios.get(`${apiUrl}?query={
              getListRessourcesByUserRole(role_id: ${role}) {
                  ressource {
                      id,
                      ressourceName,
                      ressourceLink,
                      icone,
                      statut
                  }
              }
          }`);
          return response.data.data.getListRessourcesByUserRole;
      },
      staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
      refetchOnWindowFocus: false, // Prevent unnecessary refetching
  });
}


function useRessourceByUser(userId) {
  return useQuery({
      queryKey: ["user_ressources", userId],
      queryFn: async () => {
          const response = await axios.get(`${apiUrl}?query={
              getListRessourcesByUser(user_id: ${userId},statut:1) {
                  ressource {
                      id,
                      ressourceName,
                      ressourceLink,
                      icone,
                      statut
                  }
              }
          }`);
          return response.data.data.getListRessourcesByUser;
      },
      staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
      refetchOnWindowFocus: false, // Prevent unnecessary refetching
  });
}



function useUserProperties(user) {
  return useQuery({
      queryKey: ["user_properties", user],
      queryFn: async () => {
          const response = await axios.get(`${apiUrl}?query={
              getUserProperties(
                  user_id: ${user},
                  first: 50,
                  orderBy: { order: DESC, column: NUO }
              ) {
                  data {
                      badge_propriete { badge { badge_name, badge_image } },
                      visuels { uri,position },
                      surface, lat_long, nuo, usage,id,
                      offre { denomination, id },
                      categorie_propriete { denomination, id },
                      pays { code, id },
                      piece, titre, garage, cout_mensuel,
                      ville { denomination, id },
                      wc_douche_interne, cout_vente,
                      quartier { denomination, minus_denomination,id }
                  }
              }
          }`);
          return response.data.data.getUserProperties;
      },
      staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
      refetchOnWindowFocus: false, // Prevent unnecessary refetching
  });
}


export{usePropertiesByOCTD,useRessourceByRole,useUserProperties,usePropertiesBySuperCategory,useRessourceByUser};