import { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../utils/settings';

const useFilterSubmit = () => {
  const [loading, setLoading] = useState(false);

  const submitFilters = async ({
    city,
    district,
    propertyType,
    category,
    bedrooms,
    bathrooms,
    surfaceMin,
    surfaceMax,
    budgetMin,
    budgetMax,
    garage,
    cautionAvance,
    amenities,
    options
  }) => {
    setLoading(true);
    console.log("Submitting filters:", {
      city,
      district,
      propertyType,
      category,
      bedrooms,
      bathrooms,
      surfaceMin,
      surfaceMax,
      budgetMin,
      budgetMax,
      garage,
      cautionAvance,
    });
    try {
      let query = `query={getPropertiesByKeyWords(limit:100,orderBy:{column:NUO,order:DESC}`;

      if (category) {
        query += `,offre_id:\"${category}\"`;
      }
      if (propertyType) {
        query += `,categorie_id:\"${propertyType}\"`;
      }
      if (city) {
        query += `,ville_id:\"${city}\"`;
      }
      if (district) {
        query += `,quartier_id:\"${district}\"`;
      }
      if (bedrooms) {
        query += `,piece:${bedrooms}`;
      }
      if (bathrooms) {
        query += `,wc_douche_interne:\"${bathrooms}\"`;
      }
      if (surfaceMin) {
        query += `,surface_min:${surfaceMin}`;
      }
      if (surfaceMax) {
        query += `,surface_max:${surfaceMax}`;
      }
      if (category && category === '1' && budgetMax) {
        query += `,rentMax:${Number(budgetMax)}`;
      }
      if (category && category === '1' && budgetMin) {
        query += `,rentMin:${Number(budgetMin)}`;
      }

       if (category && category === '2' && budgetMax) {
        query += `,buyMax:${Number(budgetMax)}`;
      }
      if (category && category === '2' && budgetMin) {
        query += `,buyMin:${Number(budgetMin)}`;
      }
      
      if (cautionAvance) {
        query += `,caution_avance:\"${cautionAvance}\"`;
      }
      if (garage) {
        query += `,garage:${garage}`;
      }
      /* if (amenities && amenities.length > 0) {
        query += `,amenities:[${amenities.map(a => `\"${a}\"`).join(',')}]`;
      }
      if (options && options.length > 0) {
        query += `,options:[${options.map(o => `\"${o}\"`).join(',')}]`;
      } */

      query += `){badge_propriete{badge{badge_name,badge_image}},visuels{uri,position},surface,lat_long,nuo,usage,offre{denomination},categorie_propriete{denomination},pays{code},piece,titre,garage,cout_mensuel,ville{denomination},wc_douche_interne,cout_vente,quartier{denomination,minus_denomination}}}`;

      const response = await axios.get(`${API_URL}?${query}`);
      return response.data?.data?.getPropertiesByKeyWords || [];
    } catch (error) {
      console.error("Error submitting filters:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { submitFilters, loading };
};

export default useFilterSubmit;
