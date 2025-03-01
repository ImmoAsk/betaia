import { useState, useEffect } from 'react';
import RealEstatePageLayout from '../../components/partials/RealEstatePageLayout';
import RealEstateAccountLayout from '../../components/partials/RealEstateAccountLayout';
import Nav from 'react-bootstrap/Nav';
import { useSession, getSession } from 'next-auth/react';
import { Row, Col } from 'react-bootstrap';
import { API_URL } from '../../utils/settings';
import SouscriptionsList from '../../components/iacomponents/Souscriptions/SouscriptionsList';

// Helper function to fetch negotiations by statut for property owner
async function fetchVisitationsByStatut(statut, proprietaireID) {
  const dataAPIresponse = await fetch(
    `${API_URL}?query={getSouscriptionsByKeyWords(statut:${statut},proprietaire_id:${proprietaireID},orderBy:{order:DESC,column:ID}){id,client{name,id},statut,telephone_visitor,date_transaction,fullname_visitor,propriete{id,nuo}}}`
  );
  const responseData = await dataAPIresponse.json();
  console.log(responseData)

  return responseData.data ? responseData.data.getSouscriptionsByKeyWords : [];
}


async function fetchRenterVisitationsByStatut(statut, proprietaireID) {
  const dataAPIresponse = await fetch(
    `${API_URL}?query={getSouscriptionsByKeyWords(statut:${statut},user_id:${proprietaireID},orderBy:{order:DESC,column:ID}){id,client{name,id},statut,telephone_visitor,date_transaction,fullname_visitor,propriete{id,nuo}}}`
  );
  const responseData = await dataAPIresponse.json();
  console.log(responseData)
  return responseData.data ? responseData.data.getSouscriptionsByKeyWords : [];
}

// Helper function to fetch negotiations by statut for admin
async function fetchVisitationsByStatutByRole(statut) {
  const dataAPIresponse = await fetch(
    `${API_URL}?query={getSouscriptionsByKeyWords(statut:${statut},orderBy:{order:DESC,column:ID}){id,client{name,id},statut,telephone_visitor,fullname_visitor,date_transaction,propriete{id,nuo}}}`
  );
  const responseData = await dataAPIresponse.json();
  console.log(responseData)
  return responseData.data ? responseData.data.getSouscriptionsByKeyWords : [];
}

const SouscriptionsPage = ({ _newNegotiations, _acceptedNegotiations, _declinedNegotiations }) => {
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
    return <SouscriptionsList projects={projects} />;
  };

  const columnStyle = {
    height: '700px',
    overflowY: 'scroll',
  };

  return (
    <RealEstatePageLayout pageTitle='Souscriptions de prévente' activeNav='Souscriptions' userLoggedIn>

      <RealEstateAccountLayout accountPageTitle='Souscriptions de prévente'>
        <div className='d-flex align-items-center justify-content-between mb-3'>
          <h1 className='h2 mb-0'> Souscription de biens immobiliers</h1>
        </div>
        <p className='pt-1 mb-4'>
          Consulter ici toutes les souscriptions des biens immobiliers en prevente.
        </p>
        <Nav variant='tabs' defaultActiveKey='published' onSelect={handleTabChange} className='border-bottom mb-2'>
          <Nav.Item as={Col}>
            <Nav.Link eventKey='published'>
              <i className='fi-file fs-base me-2'></i>
              Nouvelles souscriptions
            </Nav.Link>
          </Nav.Item>
          <Nav.Item as={Col}>
            <Nav.Link eventKey='accepted'>
              <i className='fi-archive fs-base me-2'></i>
              Souscriptions acceptées
            </Nav.Link>
          </Nav.Item>
          <Nav.Item as={Col}>
            <Nav.Link eventKey='declined'>
              <i className='fi-file-clean fs-base me-2'></i>
              Souscriptions refusées
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
              {activeTab === 'declined' && (
                <Col xs={12} style={columnStyle}>
                  {getHandledNegotiationRentOffers(_declinedNegotiations)}
                </Col>
              )}
              {activeTab === 'accepted' && (
                <Col xs={12} style={columnStyle}>
                  {getHandledNegotiationRentOffers(_acceptedNegotiations)}
                </Col>
              )}
              
            </>
          ) : (
            <>
              <Col xs={12} lg={4} style={columnStyle}>
                {getHandledNegotiationRentOffers(_newNegotiations)}
              </Col>
              <Col xs={12} lg={4} style={columnStyle}>
                {getHandledNegotiationRentOffers(_declinedNegotiations)}
              </Col>
              <Col xs={12} lg={4} style={columnStyle}>
                {getHandledNegotiationRentOffers(_acceptedNegotiations)}
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
  let _newNegotiations=[], _acceptedNegotiations=[], _declinedNegotiations=[],_reportedVisit=[],_refusedVisit=[];
  // Determine negotiations based on the user's role
  switch (session?.user?.roleId) {
    case '151': // Tenant role
       console.log('Tenant visitations');
      _newNegotiations = await fetchRenterVisitationsByStatut(0, session.user.id);

      _acceptedNegotiations = await fetchRenterVisitationsByStatut(2, session.user.id);
      _reportedVisit = await fetchRenterVisitationsByStatut(3, session.user.id);
      _refusedVisit = await fetchRenterVisitationsByStatut(4, session.user.id);
      _declinedNegotiations = await fetchRenterVisitationsByStatut(1, session.user.id);
      break;
    case '1200': // Admin role
    case '1231': // Admin role
      console.log('Admin visitations');
      _newNegotiations = await fetchVisitationsByStatutByRole(0);
      _acceptedNegotiations = await fetchVisitationsByStatutByRole(2);
      _declinedNegotiations = await fetchVisitationsByStatutByRole(1);
      _reportedVisit = await fetchVisitationsByStatutByRole(3);
      _refusedVisit = await fetchVisitationsByStatutByRole(4);
      break;

    default: // Property owner
      console.log('Property owner visitations');
      _newNegotiations = await fetchVisitationsByStatut(0, session.user.id);
      _acceptedNegotiations = await fetchVisitationsByStatut(2, session.user.id);
      _reportedVisit = await fetchVisitationsByStatut(3,session.user.id);
      _refusedVisit = await fetchVisitationsByStatut(4,session.user.id);
      _declinedNegotiations = await fetchVisitationsByStatut(1, session.user.id);
      break;
  }


  const allVisitHandled = [
    ..._reportedVisit,
    ..._refusedVisit,
    ..._acceptedNegotiations,
  ];
  return {
    props: { _newNegotiations, _acceptedNegotiations: allVisitHandled, _declinedNegotiations },
  };

}

export default SouscriptionsPage;
