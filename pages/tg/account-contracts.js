import { useState, useEffect } from 'react';
import RealEstatePageLayout from '../../components/partials/RealEstatePageLayout';
import RealEstateAccountLayout from '../../components/partials/RealEstateAccountLayout';
import Nav from 'react-bootstrap/Nav';
import { useSession, getSession } from 'next-auth/react';
import { Row, Col } from 'react-bootstrap';
import { API_URL } from '../../utils/settings';
import PropertyContractList from '../../components/iacomponents/PropertyContract/PropertyContractList';
import PropertyContractModal from '../../components/iacomponents/PropertyContract/PropertyContractModal';

// Helper function to fetch Contracts by statut for property owner
async function fetchContractsByStatut(statut, proprietaireID) {
  const dataAPIresponse = await fetch(
    `${API_URL}?query={getContractsByKeyWords(statut:${statut},proprietaire_id:${proprietaireID},orderBy:{order:DESC,column:ID}){id,statut,type_contrat,date_debut,montant_final,propriete{id,nuo},locataire{id,name,phone}}}`
  );
  const responseData = await dataAPIresponse.json();
  return responseData.data ? responseData.data.getContractsByKeyWords : [];
}

async function fetchRenterContractsByStatut(statut, userID) {
  const dataAPIresponse = await fetch(
    `${API_URL}?query={getContractsByKeyWords(statut:${statut},locataire_id:${userID},orderBy:{order:DESC,column:ID}){id,statut,type_contrat,date_debut,montant_final,propriete{id,nuo},locataire{id,name,phone}}}`
  );
  const responseData = await dataAPIresponse.json();
  return responseData.data ? responseData.data.getContractsByKeyWords : [];
}

// Helper function to fetch Contracts by statut for admin
async function fetchContractsByStatutByRole(statut) {
  const dataAPIresponse = await fetch(
    `${API_URL}?query={getContractsByKeyWords(statut:${statut},orderBy:{order:DESC,column:ID}){id,statut,date_debut,type_contrat,montant_final,propriete{id,nuo},locataire{id,name,phone}}}`
  );
  const responseData = await dataAPIresponse.json();
  return responseData.data ? responseData.data.getContractsByKeyWords : [];
}

const PropertyContractPage = ({ _newContracts, _acceptedContracts, _declinedContracts }) => {
  const [propertyContractShow, setPropertyContractShow] = useState(false);
  const [activeTab, setActiveTab] = useState('published');
  const [propertyModal, setPropertyModal] = useState({});
  const [isMobile, setIsMobile] = useState(false);

  const { data: session } = useSession();
  const roleId = Number(session && session.user.roleId);
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

  const createPropertyContractModal = (e) => {
    if (session) {
      setPropertyContractShow(true);
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

  const getHandledPropertyContracts = (projects) => {
    return <PropertyContractList projects={projects} />;
  };

  const columnStyle = {
    height: '700px',
    overflowY: 'scroll',
  };

  return (
    <RealEstatePageLayout pageTitle='Contrats immobiliers' activeNav='Account' userLoggedIn>
      {propertyContractShow && (
        <PropertyContractModal centered size='lg' show={propertyContractShow} onHide={() => setPropertyContractShow(false)}/>
      )}
      <RealEstateAccountLayout accountPageTitle='Contrats immobiliers'>
        <div className='d-flex align-items-center justify-content-between mb-3'>
          <h1 className='h2 mb-0'>Contrats immobiliers</h1>
          {(roleId === 1230 || roleId === 1200) && (
          <div className='d-flex align-items-right'>
            <a href='#' className='fw-bold text-decoration-none' onClick={createPropertyContractModal}>
              <i className='fi-link mt-n1 me-2'></i>
              Créer un contrat immobilier
            </a>
          </div>)}
        </div>
        <p className='pt-1 mb-4'>
          Trouvez ici tous les contrats immobiliers par des locataires potentiels pour vos biens en location et bails
          immobiliers commerciaux
        </p>
        <Nav variant='tabs' defaultActiveKey='published' onSelect={handleTabChange} className='border-bottom mb-2'>
          <Nav.Item as={Col}>
            <Nav.Link eventKey='published'>
              <i className='fi-file fs-base me-2'></i>
              Nouvels contrats
            </Nav.Link>
          </Nav.Item>
          <Nav.Item as={Col}>
            <Nav.Link eventKey='accepted'>
              <i className='fi-archive fs-base me-2'></i>
              Contrats en cours
            </Nav.Link>
          </Nav.Item>
          <Nav.Item as={Col}>
            <Nav.Link eventKey='declined'>
              <i className='fi-file-clean fs-base me-2'></i>
              Contrats terminés
            </Nav.Link>
          </Nav.Item>
        </Nav>

        <Row>
          {/* For small screens, display only one column based on activeTab */}
          {isMobile ? (
            <>
              {activeTab === 'published' && (
                <Col xs={12} style={columnStyle}>
                  {getHandledPropertyContracts(_newContracts)}
                </Col>
              )}
              {activeTab === 'accepted' && (
                <Col xs={12} style={columnStyle}>
                  {getHandledPropertyContracts(_acceptedContracts)}
                </Col>
              )}
              {activeTab === 'declined' && (
                <Col xs={12} style={columnStyle}>
                  {getHandledPropertyContracts(_declinedContracts)}
                </Col>
              )}
            </>
          ) : (
            <>
              <Col xs={12} lg={4} style={columnStyle}>
                {getHandledPropertyContracts(_newContracts)}
              </Col>
              <Col xs={12} lg={4} style={columnStyle}>
                {getHandledPropertyContracts(_acceptedContracts)}
              </Col>
              <Col xs={12} lg={4} style={columnStyle}>
                {getHandledPropertyContracts(_declinedContracts)}
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

  let _newContracts, _acceptedContracts, _declinedContracts;

  // Check the user's role and fetch Contracts accordingly
  switch (session?.user?.roleId) {
    case '151': // Tenant role
      _newContracts = await fetchRenterContractsByStatut(0, session.user.id);
      _acceptedContracts = await fetchRenterContractsByStatut(1, session.user.id);
      _declinedContracts = await fetchRenterContractsByStatut(2, session.user.id);
      break;
    case '1200': // Admin role
    case '1231': // Admin role
      _newContracts = await fetchContractsByStatutByRole(0);
      _acceptedContracts = await fetchContractsByStatutByRole(1);
      _declinedContracts = await fetchContractsByStatutByRole(2);
      break;

    default: // Property owner
      _newContracts = await fetchContractsByStatut(0, session.user.id);
      _acceptedContracts = await fetchContractsByStatut(1, session.user.id);
      _declinedContracts = await fetchContractsByStatut(2, session.user.id);
      break;
  }

  return {
    props: { _newContracts, _acceptedContracts, _declinedContracts },
  };
}

export default PropertyContractPage;
