import { useState } from "react";
import RealEstateAgencyPublicBoard from "../../../components/iacomponents/RealEstateAgency/RealEstateAgencyPublicBoard";
import { Container } from "react-bootstrap";
import RealEstateProperty from "../../../components/iacomponents/RealEstateAgency/newprop";
import PropertyAds from "../../../components/iacomponents/RealEstateAgency/PropertyAds";
import { API_URL } from "../../../utils/settings";

const Organisation = ({ orgStatistics }) => {
  const [selectedType, setSelectedType] = useState("all");

  // Handle case when no data was fetched
  if (!orgStatistics) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "70vh" }}>
        <p className="text-danger">Impossible de charger les informations de l’organisation.</p>
      </div>
    );
  }

  return (
    <RealEstateAgencyPublicBoard
      onSelectType={setSelectedType}
      orgStatistics={orgStatistics.statistics || {}}
      organisation={orgStatistics.organisation || {}}
    >
      <PropertyAds />

      <RealEstateProperty selectedType={selectedType} orgProperties={orgStatistics.proprietes || []} />

    </RealEstateAgencyPublicBoard>
  );
};

export async function getServerSideProps(context) {
  const { code } = context.query;

  if (!code) {
    return { notFound: true };
  }

  const query = `
    {
      orgStatistics(code_organisation: "${code}") {
        organisation {
          id
          name_organisation
          logo
          description
          facebook_url
          linkedin_url
          twitter_url
          proprietaire {
            id
            name
            email
            phone
          }
        }
        statistics {
          sejour
          acquisition
          logement
          entreprise
        }
        proprietes {
          data {
            id
            titre
            super_categorie
            est_disponible
            cout_visite
            cout_assistance_client
            cout_vente
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
            nuo
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
            pays { id code denomination }
            ville { id denomination }
            quartier { id denomination minus_denomination }
            adresse { libelle }
            offre { id denomination }
            visuels { uri position }
            tarifications { id mode currency montant }
            user { id }
          }
          paginatorInfo {
            count
            currentPage
            lastPage
            perPage
            total
          }
        }
      }
    }
  `;

  try {
    const res = await fetch(`${API_URL}?query=${encodeURIComponent(query)}`);
    console.log("Full url:", `${API_URL}?query=${query}`);
    console.log("Fetching org stats for code:", code);
    const json = await res.json();
    console.log(json)
    return {
      props: {
        orgStatistics: json?.data?.orgStatistics || null,
      },
    };
  } catch (error) {
    console.error("Error fetching org stats:", error);
    return {
      props: { orgStatistics: null },
    };
  }
}

export default Organisation;
