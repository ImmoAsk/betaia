import { useState, useEffect } from 'react';
import RealEstatePageLayout from '../../components/partials/RealEstatePageLayout';
import RealEstateAccountLayout from '../../components/partials/RealEstateAccountLayout';
import Nav from 'react-bootstrap/Nav';
import { useSession, getSession } from 'next-auth/react';
import { Row, Col } from 'react-bootstrap';
import PropertyVisitList from '../../components/iacomponents/PropertyVisitList';

// Helper function to fetch negotiations by statut for property owner
async function fetchNegotiationsByStatut(statut, proprietaireID) {
  const dataAPIresponse = await fetch(
    `https://immoaskbetaapi.omnisoft.africa/public/api/v2?query={getVisitationsByKeyWords(statut:${statut},proprietaire_id:${proprietaireID},orderBy:{order:DESC,column:ID}){id,visiteur{name,id},date_visite,heure_visite,statut,telephone_visitor,fullname_visitor,propriete{id,nuo}}}`
  );
  const responseData = await dataAPIresponse.json();
  console.log(responseData)
  return responseData.data ? responseData.data.getVisitationsByKeyWords : [];
}

// Helper function to fetch negotiations by statut for admin
async function fetchNegotiationsByStatutByRole(statut) {
  const dataAPIresponse = await fetch(
    `https://immoaskbetaapi.omnisoft.africa/public/api/v2?query={getVisitationsByKeyWords(statut:${statut},orderBy:{order:DESC,column:ID}){id,visiteur{name,id},date_visite,heure_visite,statut,telephone_visitor,fullname_visitor,propriete{id,nuo}}}`
  );
  const responseData = await dataAPIresponse.json();
  console.log(responseData)
  return responseData.data ? responseData.data.getVisitationsByKeyWords : [];
}

const VisitPropertiesPage = ({ _newNegotiations, _acceptedNegotiations, _declinedNegotiations }) => {
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
    return <PropertyVisitList projects={projects} />;
  };

  const columnStyle = {
    height: '650px',
    overflowY: 'scroll',
  };

  return (
    <RealEstatePageLayout pageTitle='Visites de biens immobilièrs' activeNav='Account' userLoggedIn>
      {/* {editPropertyShow && (
        <EditPropertyModal centered size='lg' show={editPropertyShow} onHide={() => setEditPropertyShow(false)} property={propertyModal} />
      )} */}

      <RealEstateAccountLayout accountPageTitle='Visites de biens immobilièrs'>
        <div className='d-flex align-items-center justify-content-between mb-3'>
          <h1 className='h2 mb-0'>Visites de biens immobiliers</h1>
        </div>
        <p className='pt-1 mb-4'>
          Consulter ici toutes les visites de biens immobiliers et se preparer au rendez-vous.
        </p>
        <Nav variant='tabs' defaultActiveKey='published' onSelect={handleTabChange} className='border-bottom mb-2'>
          <Nav.Item as={Col}>
            <Nav.Link eventKey='published'>
              <i className='fi-file fs-base me-2'></i>
              Nouvelles visites
            </Nav.Link>
          </Nav.Item>
          <Nav.Item as={Col}>
            <Nav.Link eventKey='accepted'>
              <i className='fi-archive fs-base me-2'></i>
              Visites en cours
            </Nav.Link>
          </Nav.Item>
          <Nav.Item as={Col}>
            <Nav.Link eventKey='declined'>
              <i className='fi-file-clean fs-base me-2'></i>
              Visites deja faites
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

  // Check if the user is an admin or property owner
  if (session?.user?.roleId == '1200'|| session?.user?.roleId == '1231') {
    // Admin role
    console.log(session?.user?.roleId)
    _newNegotiations = await fetchNegotiationsByStatutByRole(0);
    console.log(_newNegotiations)
    _acceptedNegotiations = await fetchNegotiationsByStatutByRole(1);
    _declinedNegotiations = await fetchNegotiationsByStatutByRole(2);
  } else {
    // Property owner
    _newNegotiations = await fetchNegotiationsByStatut(0, session.user.id);
    _acceptedNegotiations = await fetchNegotiationsByStatut(1, session.user.id);
    _declinedNegotiations = await fetchNegotiationsByStatut(2, session.user.id);
  }

  return {
    props: { _newNegotiations, _acceptedNegotiations, _declinedNegotiations },
  };
}

export default VisitPropertiesPage;
