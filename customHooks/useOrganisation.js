import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import 'dotenv/config';
import { API_URL } from "../utils/settings";

function useOrganisation(user_id) {
    const final_url= `${API_URL}?query={user(id:${user_id}){name,phone,organisation{name_organisation,description,status,logo,facebook_url,linkedin_url,twitter_url,tel_whatsapp,tel_portable}}}`
    console.log(final_url)
    return useQuery(["organisation", user_id],()=> axios.get(final_url).then(res=>res.data.data.user));
}

function useOrganisationStatistics(code_organisation) {
  const query = `
    {
      orgStatistics(code_organisation: "${code_organisation}") {
        organisation {
          id
          name_organisation
          logo
        }
        statistics {
          sejour
          acquisition
          logement
          entreprise
        }
        proprietes {
          id
          titre
          super_categorie
          est_disponible
          cout_visite
          cout_assistance_client
          preco_prix: cout_vente
          cout_mensuel
          papier_propriete
          nuitee
          prevente
          garage
          est_meuble
          descriptif
          surface
          usage
          cuisine
          salon
          piece
          wc_douche_interne
          categorie_propriete {
            id
            denomination
          }
          infrastructures {
            denomination
            icone
          }
          meubles {
            libelle
            icone
          }
          badge_propriete {
            id
            date_expiration
            badge {
              id
              badge_name
              badge_image
            }
          }
          pays {
            id
            code
            denomination
          }
          ville {
            id
            denomination
          }
          quartier {
            id
            denomination
            minus_denomination
          }
          adresse {
            libelle
          }
          offre {
            id
            denomination
          }
          visuels {
            uri
            position
          }
          tarifications {
            id
            mode
            currency
            montant
          }
          user {
            id
          }
        }
      }
    }
  `;

  const final_url = `${API_URL}?query=${encodeURIComponent(query)}`;
  console.log(final_url);

  return useQuery(
    ["orgStatistics", code_organisation],
    () => axios.get(final_url).then(res => res.data.data.orgStatistics)
  );
}
export { useOrganisation, useOrganisationStatistics };