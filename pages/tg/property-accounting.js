import { useState, useEffect } from 'react';
import RealEstatePageLayout from '../../components/partials/RealEstatePageLayout';
import RealEstateAccountLayout from '../../components/partials/RealEstateAccountLayout';
import Nav from 'react-bootstrap/Nav';
import { useSession, getSession } from 'next-auth/react';
import { Row, Col } from 'react-bootstrap';
import PropertyAccountingList from '../../components/iacomponents/PropertyAccounting/PropertyAccountingList';
import { API_URL } from '../../utils/settings';
import ManualExitMovementModal from '../../components/iacomponents/PropertyAccounting/ManualExitMovementModal';

// Helper function to fetch negotiations by statut for property owner
// Fetch accounting movements by type for a specific property owner
async function fetchAccountingMovementsByTypeForOwner(typeMouvement, proprietaireID) {
  try {
    const query = `
      {
        getMouvementsComptablesByKeyWords(
          type_mouvement: "${typeMouvement}",
          proprietaire_id: ${proprietaireID},
          orderBy: { order: DESC, column: ID }
        ) {
          id
          created_at
          statut
          montant
          recu
          type_mouvement
          source_mouvement
          contrat {
            id
            locataire { id, name }
            propriete {
              id
              nuo
              categorie_propriete { denomination }
            }
          }
        }
      }
    `;

    const response = await fetch(`${API_URL}?query=${encodeURIComponent(query)}`);
    console.log("Fetching accounting movements for owner:", response.url);
    const json = await response.json();
    console.log("Owner accounting movements:", json);

    return json.data?.getMouvementsComptablesByKeyWords || [];
  } catch (error) {
    console.error("Error fetching accounting movements for owner:", error);
    return [];
  }
}

// Fetch accounting movements by type for admins (global access)
async function fetchAccountingMovementsByTypeForAdmin(typeMouvement) {
  try {
    const query = `
      {
        getMouvementsComptablesByKeyWords(
          type_mouvement: "${typeMouvement}",
          orderBy: { order: DESC, column: ID }
        ) {
          id
          created_at
          statut
          montant
          recu
          type_mouvement
          source_mouvement
          contrat {
            id
            locataire { id, name }
            propriete {
              id
              nuo
              categorie_propriete { denomination }
            }
          }
        }
      }
    `;

    const response = await fetch(`${API_URL}?query=${encodeURIComponent(query)}`);
    const json = await response.json();
    console.log("Admin accounting movements:", json);

    return json.data?.getMouvementsComptablesByKeyWords || [];
  } catch (error) {
    console.error("Error fetching accounting movements for admin:", error);
    return [];
  }
}


const PropertyAccountingPage = ({ _newNegotiations, _acceptedNegotiations, _declinedNegotiations }) => {
  const [editPropertyShow, setEditPropertyShow] = useState(false);
  const [activeTab, setActiveTab] = useState('published');
  const [propertyModal, setPropertyModal] = useState({});
  const [isMobile, setIsMobile] = useState(false);

  const { data: session } = useSession();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 992);
    };

    handleResize(); // Call once to set initial state
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleEditPropertyModal = (e) => {
    if (session) {
      setEditPropertyShow(true);
    } else {
      console.log("Sign in needed");
    }
  };

  const handleTabChange = (tabKey) => {
    if (['published', 'accepted', 'declined'].includes(tabKey)) {
      setActiveTab(tabKey);
    } else {
      setActiveTab('published'); // Fallback to default tab
    }
  };

  const getHandledNegotiationRentOffers = (projects) => {
    return <PropertyAccountingList rents_collection={projects} />;
  };

  const columnStyle = {
    height: '700px',
    overflowY: 'scroll',
  };

  return (
    <RealEstatePageLayout pageTitle='Comptabilité des biens immobiliers' activeNav='VisitProperties' userLoggedIn>

      <RealEstateAccountLayout accountPageTitle='Comptabilité des biens immobiliers'>
        <div className='d-flex align-items-center justify-content-between mb-3'>
          <h1 className='h2 mb-0'>Comptabilité des biens immobiliers</h1>
          { session?.user?.roleId === '1200' && (
            <div className="d-flex align-items-right">
            <ManualExitMovementModal />

          </div>
          )}
          

        </div>
        <p className='pt-1 mb-4'>
          Consulter ici tous les mouvements d'entrées(revenu locatif, retour sur investissement) et de sorties(maintenances, entretiens, assistance) des biens immobiliers en gestion.
        </p>
        <Nav variant='tabs' defaultActiveKey='published' onSelect={handleTabChange} className='border-bottom mb-2'>
          <Nav.Item as={Col}>
            <Nav.Link eventKey='published'>
              <i className='fi-file fs-base me-2'></i>
              Entrées
            </Nav.Link>
          </Nav.Item>
          <Nav.Item as={Col}>
            <Nav.Link eventKey='accepted'>
              <i className='fi-archive fs-base me-2'></i>
              Sorties
            </Nav.Link>
          </Nav.Item>
          <Nav.Item as={Col}>
            <Nav.Link eventKey='declined'>
              <i className='fi-file-clean fs-base me-2'></i>
              Bilan
            </Nav.Link>
          </Nav.Item>
        </Nav>

        <Row>
          {/* For small screens, display only one column based on activeTab */}
          {isMobile ? (
            <>
              {activeTab === 'published' && (
                <Col xs={12} style={columnStyle}>
                  {getHandledNegotiationRentOffers(_newNegotiations)}
                </Col>
              )}
              {activeTab === 'accepted' && (
                <Col xs={12} style={columnStyle}>
                  {getHandledNegotiationRentOffers(_acceptedNegotiations)}
                </Col>
              )}
              {activeTab === 'declined' && (
                <Col xs={12} style={columnStyle}>
                  {getHandledNegotiationRentOffers(_declinedNegotiations)}
                </Col>
              )}

            </>
          ) : (
            <>
              <Col xs={12} lg={4} style={columnStyle}>
                {getHandledNegotiationRentOffers(_newNegotiations)}
              </Col>
              <Col xs={12} lg={4} style={columnStyle}>
                {getHandledNegotiationRentOffers(_acceptedNegotiations)}
              </Col>
              <Col xs={12} lg={4} style={columnStyle}>
                {getHandledNegotiationRentOffers(_declinedNegotiations)}
              </Col>
            </>
          )}
        </Row>
      </RealEstateAccountLayout>
    </RealEstatePageLayout>
  );
};

// Fetch data from API in getServerSideProps using statut as an input variable
export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      },
    };
  }
  let _newNegotiations, _acceptedNegotiations, _declinedNegotiations;
  // Determine negotiations based on the user's role
  switch (session?.user?.roleId) {
    case '1200': // Admin role
      _newNegotiations = await fetchAccountingMovementsByTypeForAdmin("entree");
      _acceptedNegotiations = await fetchAccountingMovementsByTypeForAdmin("sortie");
      _declinedNegotiations = await fetchAccountingMovementsByTypeForAdmin("bilan");
      break;

    default: // Property owner
      console.log('Property owner visitations');
      _newNegotiations = await fetchAccountingMovementsByTypeForOwner("entree", session.user.id);
      _acceptedNegotiations = await fetchAccountingMovementsByTypeForOwner("sortie", session.user.id);
      _declinedNegotiations = await fetchAccountingMovementsByTypeForOwner("bilan", session.user.id);
      break;
  }

  return {
    props: { _newNegotiations, _acceptedNegotiations, _declinedNegotiations },
  };

}

export default PropertyAccountingPage;
