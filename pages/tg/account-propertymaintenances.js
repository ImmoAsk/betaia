import { useState, useEffect } from 'react';
import RealEstatePageLayout from '../../components/partials/RealEstatePageLayout';
import RealEstateAccountLayout from '../../components/partials/RealEstateAccountLayout';
import Nav from 'react-bootstrap/Nav';
import { useSession, getSession } from 'next-auth/react';
import { Row, Col } from 'react-bootstrap';
import { API_URL } from '../../utils/settings';
import PropertyMaintenanceList from '../../components/iacomponents/PropertyMaintenance/PropertyMaintenanceList';
import PropertyMaintenanceModal from '../../components/iacomponents/PropertyMaintenance/PropertyMaintenanceModal';

// Helper function to fetch Maintenances by statut for property owner
async function fetchMaintenancesByStatut(statut, proprietaireID) {
  const dataAPIresponse = await fetch(
    `${API_URL}?query={getMaintenancesByKeyWords(statut:${statut},proprietaire_id:${proprietaireID},orderBy:{order:DESC,column:ID}){id,statut,created_at,description,categorie,propriete{id,nuo}}}`
  );
  const responseData = await dataAPIresponse.json();
  return responseData.data ? responseData.data.getMaintenancesByKeyWords : [];
}

async function fetchRenterMaintenancesByStatut(statut, userID) {
  const fullURL = `${API_URL}?query={getMaintenancesByKeyWords(statut:${statut},user_id:${userID},orderBy:{order:DESC,column:ID}){id,statut,created_at,description,categorie,propriete{id,nuo}}}`;
  const dataAPIresponse = await fetch(fullURL);
  console.log("URL:", fullURL);
  const responseData = await dataAPIresponse.json();
  return responseData.data ? responseData.data.getMaintenancesByKeyWords : [];
}

// Helper function to fetch Maintenances by statut for admin
async function fetchMaintenancesByStatutByRole(statut) {
  const dataAPIresponse = await fetch(
    `${API_URL}?query={getMaintenancesByKeyWords(statut:${statut},orderBy:{order:DESC,column:ID}){id,statut,created_at,description,categorie,propriete{id,nuo}}}`
  );
  const responseData = await dataAPIresponse.json();
  return responseData.data ? responseData.data.getMaintenancesByKeyWords : [];
}

const PropertyMaintenancePage = ({ _newMaintenances, _acceptedMaintenances, _declinedMaintenances }) => {
  const [propertyMaintenanceShow, setPropertyMaintenanceShow] = useState(false);
  const [activeTab, setActiveTab] = useState('published');
  const [propertyModal, setPropertyModal] = useState({});
  const [isMobile, setIsMobile] = useState(false);

  const { data: session } = useSession();

  const roleId = Number(session?.user?.roleId || 0);
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

  const createPropertyMaintenanceModal = (e) => {
    if (session) {
      setPropertyMaintenanceShow(true);
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

  const getHandledPropertyMaintenances = (projects) => {
    return <PropertyMaintenanceList projects={projects} />;
  };

  const columnStyle = {
    height: '700px',
    overflowY: 'scroll',
  };

  return (
    <RealEstatePageLayout pageTitle='Maintenances immobilieres' activeNav='Account' userLoggedIn>
      {propertyMaintenanceShow && (
        <PropertyMaintenanceModal centered size='lg' show={propertyMaintenanceShow} onHide={() => setPropertyMaintenanceShow(false)} />
      )}
      <RealEstateAccountLayout accountPageTitle='Maintenances immobilieres'>
        <div className='d-flex align-items-center justify-content-between mb-3'>
          <h1 className='h2 mb-0'>Maintenances immobilieres</h1>
          {(roleId === 151 || roleId === 1200 || roleId === 1230) && (
            <div className='d-flex align-items-right'>
              <a href='#' className='fw-bold text-decoration-none' onClick={createPropertyMaintenanceModal}>
                <i className='fi-cash mt-n1 me-2'></i>
                Lancer une maintenance
              </a>
            </div>
          )}

        </div>
        <p className='pt-1 mb-4'>
          Trouvez ici toutes les maintenances par des locataires potentiels pour vos biens en location et bails
          immobiliers commerciaux
        </p>
        <Nav variant='tabs' defaultActiveKey='published' onSelect={handleTabChange} className='border-bottom mb-2'>
          <Nav.Item as={Col}>
            <Nav.Link eventKey='published'>
              <i className='fi-file fs-base me-2'></i>
              Nouvelles maintenances
            </Nav.Link>
          </Nav.Item>
          <Nav.Item as={Col}>
            <Nav.Link eventKey='accepted'>
              <i className='fi-archive fs-base me-2'></i>
              Maintenances en cours
            </Nav.Link>
          </Nav.Item>
          <Nav.Item as={Col}>
            <Nav.Link eventKey='declined'>
              <i className='fi-file-clean fs-base me-2'></i>
              Maintenances terminees
            </Nav.Link>
          </Nav.Item>
        </Nav>

        <Row>
          {/* For small screens, display only one column based on activeTab */}
          {isMobile ? (
            <>
              {activeTab === 'published' && (
                <Col xs={12} style={columnStyle}>
                  {getHandledPropertyMaintenances(_newMaintenances)}
                </Col>
              )}
              {activeTab === 'accepted' && (
                <Col xs={12} style={columnStyle}>
                  {getHandledPropertyMaintenances(_acceptedMaintenances)}
                </Col>
              )}
              {activeTab === 'declined' && (
                <Col xs={12} style={columnStyle}>
                  {getHandledPropertyMaintenances(_declinedMaintenances)}
                </Col>
              )}
            </>
          ) : (
            <>
              <Col xs={12} lg={4} style={columnStyle}>
                {getHandledPropertyMaintenances(_newMaintenances)}
              </Col>
              <Col xs={12} lg={4} style={columnStyle}>
                {getHandledPropertyMaintenances(_acceptedMaintenances)}
              </Col>
              <Col xs={12} lg={4} style={columnStyle}>
                {getHandledPropertyMaintenances(_declinedMaintenances)}
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

  let _newMaintenances, _acceptedMaintenances, _declinedMaintenances;

  // Check the user's role and fetch Maintenances accordingly
  switch (session?.user?.roleId) {
    case '151': // Tenant role
      _newMaintenances = await fetchRenterMaintenancesByStatut(0, session.user.id);
      _acceptedMaintenances = await fetchRenterMaintenancesByStatut(1, session.user.id);
      _declinedMaintenances = await fetchRenterMaintenancesByStatut(2, session.user.id);
      break;
    case '1200': // Admin role
    case '1231': // Admin role
      _newMaintenances = await fetchMaintenancesByStatutByRole(0);
      _acceptedMaintenances = await fetchMaintenancesByStatutByRole(1);
      _declinedMaintenances = await fetchMaintenancesByStatutByRole(2);
      break;

    default: // Property owner
      _newMaintenances = await fetchMaintenancesByStatut(0, session.user.id);
      _acceptedMaintenances = await fetchMaintenancesByStatut(1, session.user.id);
      _declinedMaintenances = await fetchMaintenancesByStatut(2, session.user.id);
      break;
  }

  return {
    props: { _newMaintenances, _acceptedMaintenances, _declinedMaintenances },
  };
}

export default PropertyMaintenancePage;
