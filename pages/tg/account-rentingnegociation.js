import { useState, useEffect } from 'react';
import RealEstatePageLayout from '../../components/partials/RealEstatePageLayout';
import RealEstateAccountLayout from '../../components/partials/RealEstateAccountLayout';
import Nav from 'react-bootstrap/Nav';
import { useSession, getSession } from 'next-auth/react';
import { Row, Col } from 'react-bootstrap';
import RentingNegotiationOfferList from '../../components/iacomponents/RentingNegotiationOfferList';
import { API_URL } from '../../utils/settings';

// Helper function to fetch negotiations by statut for property owner
async function fetchNegotiationsByStatut(statut, proprietaireID) {
  const dataAPIresponse = await fetch(
    `${API_URL}?query={getNegotiatiionsByKeyWords(statut:${statut},proprietaire_id:${proprietaireID},orderBy:{order:DESC,column:ID}){id,date_negociation,statut,telephone_negociateur,negociateur{id,name,phone},fullname_negociateur,montant,propriete{id,nuo}}}`
  );
  const responseData = await dataAPIresponse.json();
  return responseData.data ? responseData.data.getNegotiatiionsByKeyWords : [];
}

async function fetchRenterNegotiationsByStatut(statut, userID) {
  const dataAPIresponse = await fetch(
    `${API_URL}?query={getNegotiatiionsByKeyWords(statut:${statut},user_id:${userID},orderBy:{order:DESC,column:ID}){id,date_negociation,statut,telephone_negociateur,negociateur{id,name,phone},fullname_negociateur,montant,propriete{id,nuo}}}`
  );
  const responseData = await dataAPIresponse.json();
  return responseData.data ? responseData.data.getNegotiatiionsByKeyWords : [];
}

// Helper function to fetch negotiations by statut for admin
async function fetchNegotiationsByStatutByRole(statut) {
  const dataAPIresponse = await fetch(
    `${API_URL}?query={getNegotiatiionsByKeyWords(statut:${statut},orderBy:{order:DESC,column:ID}){id,date_negociation,statut,telephone_negociateur,fullname_negociateur,montant,negociateur{id,name,phone},propriete{id,nuo}}}`
  );
  const responseData = await dataAPIresponse.json();
  return responseData.data ? responseData.data.getNegotiatiionsByKeyWords : [];
}

const RentingNegociationPage = ({ _newNegotiations, _acceptedNegotiations, _declinedNegotiations }) => {
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
    return <RentingNegotiationOfferList projects={projects} />;
  };

  const columnStyle = {
    height: '700px',
    overflowY: 'scroll',
  };

  return (
    <RealEstatePageLayout pageTitle='Negociation de loyers' activeNav='Account' userLoggedIn>
      {/* {editPropertyShow && (
        <EditPropertyModal centered size='lg' show={editPropertyShow} onHide={() => setEditPropertyShow(false)} property={propertyModal} />
      )} */}
      <RealEstateAccountLayout accountPageTitle='Negociation de loyers'>
        <div className='d-flex align-items-center justify-content-between mb-3'>
          <h1 className='h2 mb-0'>Négociations de loyers</h1>
        </div>
        <p className='pt-1 mb-4'>
          Trouvez ici toutes les propositions de négociation de loyer envoyées par des locataires potentiels pour vos biens en location et séjours
          immobiliers.
        </p>
        <Nav variant='tabs' defaultActiveKey='published' onSelect={handleTabChange} className='border-bottom mb-2'>
          <Nav.Item as={Col}>
            <Nav.Link eventKey='published'>
              <i className='fi-file fs-base me-2'></i>
              Négociations non traitées
            </Nav.Link>
          </Nav.Item>
          <Nav.Item as={Col}>
            <Nav.Link eventKey='accepted'>
              <i className='fi-archive fs-base me-2'></i>
              Négociations acceptées
            </Nav.Link>
          </Nav.Item>
          <Nav.Item as={Col}>
            <Nav.Link eventKey='declined'>
              <i className='fi-file-clean fs-base me-2'></i>
              Négociations déclinées
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

  // Check the user's role and fetch negotiations accordingly
  switch (session?.user?.roleId) {
    case '151': // Tenant role
      _newNegotiations = await fetchRenterNegotiationsByStatut(0, session.user.id);
      _acceptedNegotiations = await fetchRenterNegotiationsByStatut(1, session.user.id);
      _declinedNegotiations = await fetchRenterNegotiationsByStatut(2, session.user.id);
      break;
    case '1200': // Admin role
    case '1231': // Admin role
      _newNegotiations = await fetchNegotiationsByStatutByRole(0);
      _acceptedNegotiations = await fetchNegotiationsByStatutByRole(1);
      _declinedNegotiations = await fetchNegotiationsByStatutByRole(2);
      break;

    default: // Property owner
      _newNegotiations = await fetchNegotiationsByStatut(0, session.user.id);
      _acceptedNegotiations = await fetchNegotiationsByStatut(1, session.user.id);
      _declinedNegotiations = await fetchNegotiationsByStatut(2, session.user.id);
      break;
  }

  return {
    props: { _newNegotiations, _acceptedNegotiations, _declinedNegotiations },
  };
}

export default RentingNegociationPage;
