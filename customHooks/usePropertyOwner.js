import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "../utils/settings";

function useLandLord(role) {
  return useQuery({
    queryKey: ["landlords", role],
    queryFn: () => {
    const query = `{getPropertyOwners(role_id:${role}){id,name,phone,email,organisation{logo,name_organisation,status,id}}}`;
    const fullUrl = `${API_URL}?query=${encodeURIComponent(query)}`;
    console.log("Landlord fetch URL:", fullUrl); // ✅ Log full URL

    return axios.get(fullUrl).then(res => res.data.data.getPropertyOwners);
  }
});
}

function useTenant(role) {
  return useQuery({
    queryKey: ["tenants", role],
    queryFn: () => {
    const query = `{getPropertyOwners(role_id:${role}){id,name,phone,email,organisation{logo,name_organisation,status,id}}}`;
    const fullUrl = `${API_URL}?query=${encodeURIComponent(query)}`;
    console.log("Tenant fetch URL:", fullUrl); // ✅ Log full URL

    return axios.get(fullUrl).then(res => res.data.data.getPropertyOwners);
  }
});
}

function useLandlordTenant(landlord_id) {
  return useQuery({
    queryKey: ["tenants", landlord_id],
    queryFn: () => {
    const query = `{getLandlordTenants(proprietaire_id:${Number(landlord_id)}){id,proprietaire{id,name,phone,email},locataire{id,name,phone,email}}}`;
    const fullUrl = `${API_URL}?query=${encodeURIComponent(query)}`;
    console.log("Tenant fetch URL:", fullUrl); // ✅ Log full URL

    return axios.get(fullUrl).then(res => res.data.data.getLandlordTenants);
  }
});
}


function useTenantContract(user_id) {
  return useQuery({
    queryKey: ["contracts", user_id],
    queryFn: async () => {
    const query = `
      {
        getContractsByKeyWords(locataire_id: ${Number(user_id)}, statut: 1) {
          id
          date_debut
          date_fin
          montant_final
          proprietaire {
            id
            name
            phone
            email
          }
          locataire {
            id
            name
            phone
            email
          }
          propriete {
            id
            nuo
            categorie_propriete {
              denomination
            }
            adresse {
              libelle
            }
            ville {
              denomination
            }
            quartier {
              denomination
            }
          }
        }
      }
    `;

    const fullUrl = `${API_URL}?query=${encodeURIComponent(query)}`;
    console.log("📡 Fetching tenant contract from:", fullUrl);

    try {
      const response = await axios.get(fullUrl);
      const contracts = response?.data?.data?.getContractsByKeyWords || [];

      // Customize the returned JSON format
      return contracts.map(contract => ({
        id: contract.id,
        startDate: contract.date_debut,
        endDate: contract.date_fin,
        amount: contract.montant_final,
        landlord: {
          id: contract.proprietaire.id,
          name: contract.proprietaire.name,
          email: contract.proprietaire.email,
          phone: contract.proprietaire.phone,
        },
        property: {
          id: contract.propriete.id,
          nuo: contract.propriete.nuo,
          category: contract.propriete.categorie_propriete.denomination,
          address: contract.propriete.adresse.libelle,
          city: contract.propriete.ville.denomination,
          neighborhood: contract.propriete.quartier.denomination,
        },
        tenant: {
          id: contract.locataire.id,
          name: contract.locataire.name,
          email: contract.locataire.email,
          phone: contract.locataire.phone,
        },
      }));
    } catch (error) {
      console.error("❌ Error fetching tenant contracts:", error);
      throw new Error("Failed to load tenant contracts.");
    }
  }
});
}

function useLandlordContract(landlord_id) {
  return useQuery({
    queryKey: ["contracts", landlord_id],
    queryFn: async () => {
    const query = `
      {
        getContractsByKeyWords(proprietaire_id: ${Number(landlord_id)}, statut: 1) {
          id
          date_debut
          date_fin
          montant_final
          proprietaire {
            id
            name
            phone
            email
          }
          locataire {
            id
            name
            phone
            email
          }
          propriete {
            id
            nuo
            categorie_propriete {
              denomination
            }
            adresse {
              libelle
            }
            ville {
              denomination
            }
            quartier {
              denomination
            }
          }
        }
      }
    `;

    const fullUrl = `${API_URL}?query=${encodeURIComponent(query)}`;
    console.log("📡 Fetching landlord contracts from:", fullUrl);

    try {
      const response = await axios.get(fullUrl);
      const contracts = response?.data?.data?.getContractsByKeyWords || [];

      // Customize the returned JSON format
      return contracts.map(contract => ({
        id: contract.id,
        startDate: contract.date_debut,
        endDate: contract.date_fin,
        amount: contract.montant_final,
        landlord: {
          id: contract.proprietaire.id,
          name: contract.proprietaire.name,
          email: contract.proprietaire.email,
          phone: contract.proprietaire.phone,
        },
        property: {
          id: contract.propriete.id,
          nuo: contract.propriete.nuo,
          category: contract.propriete.categorie_propriete.denomination,
          address: contract.propriete.adresse.libelle,
          city: contract.propriete.ville.denomination,
          neighborhood: contract.propriete.quartier.denomination,
        },
        tenant: {
          id: contract.locataire.id,
          name: contract.locataire.name,
          email: contract.locataire.email,
          phone: contract.locataire.phone,
        },
      }));
    } catch (error) {
      console.error("❌ Error fetching landlord contracts:", error);
      throw new Error("Failed to load landlord contracts.");
    }
  }
});
}


export { useLandLord, useTenant , useLandlordTenant, useLandlordContract ,useTenantContract };
