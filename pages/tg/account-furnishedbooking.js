import { useState, useEffect } from 'react';
import RealEstatePageLayout from '../../components/partials/RealEstatePageLayout';
import RealEstateAccountLayout from '../../components/partials/RealEstateAccountLayout';
import Nav from 'react-bootstrap/Nav';
import { useSession, getSession } from 'next-auth/react';
import { Row, Col } from 'react-bootstrap';
import FurnishedBookingList from '../../components/iacomponents/FurnishedBookingList';

// Helper function to fetch negotiations by statut for property owner
async function fetchNegotiationsByStatut(statut, proprietaireID) {
  const dataAPIresponse = await fetch(
    `https://immoaskbetaapi.omnisoft.africa/public/api/v2?query={getReservationsByKeyWords(statut:${statut},proprietaire_id:${proprietaireID},orderBy:{order:DESC,column:ID}){id,date_arrive,date_depart,pickup_place,email_reservateur,statut,phone_reservateur,fullname_reservateur,propriete{id,nuo},client{id,name}}}`
  );
  const responseData = await dataAPIresponse.json();
  console.log(responseData)
  return responseData.data ? responseData.data.getReservationsByKeyWords : [];
}

// Helper function to fetch negotiations by statut for admin
async function fetchNegotiationsByStatutByRole(statut) {
  const dataAPIresponse = await fetch(
    `https://immoaskbetaapi.omnisoft.africa/public/api/v2?query={getReservationsByKeyWords(statut:${statut},orderBy:{order:DESC,column:ID}){id,date_arrive,date_depart,pickup_place,email_reservateur,statut,phone_reservateur,fullname_reservateur,propriete{id,nuo},client{id,name}}}`
  );
  const responseData = await dataAPIresponse.json();
  console.log(responseData)
  return responseData.data ? responseData.data.getReservationsByKeyWords : [];
}

const FurnishedBookingPage = ({ _newNegotiations, _acceptedNegotiations, _declinedNegotiations }) => {
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
    return <FurnishedBookingList projects={projects} />;
  };

  const columnStyle = {
    height: '650px',
    overflowY: 'scroll',
  };

  return (
    <RealEstatePageLayout pageTitle='Reservation de sejours' activeNav='FurnishedBooking' userLoggedIn>
      {/* {editPropertyShow && (
        <EditPropertyModal centered size='lg' show={editPropertyShow} onHide={() => setEditPropertyShow(false)} property={propertyModal} />
      )} */}

      <RealEstateAccountLayout accountPageTitle='Reservation de sejours' activeNav='FurnishedBooking'>
        <div className='d-flex align-items-center justify-content-between mb-3'>
          <h1 className='h2 mb-0'>Reservations de meubles</h1>
        </div>
        <p className='pt-1 mb-4'>
          Trouvez ici toutes les reservations de sejours envoyées par des locataires potentiels pour vos biens en location et séjours
          immobiliers.
        </p>
        <Nav variant='tabs' defaultActiveKey='published' onSelect={handleTabChange} className='border-bottom mb-2'>
          <Nav.Item as={Col}>
            <Nav.Link eventKey='published'>
              <i className='fi-file fs-base me-2'></i>
              Reservations nouvelles
            </Nav.Link>
          </Nav.Item>
          <Nav.Item as={Col}>
            <Nav.Link eventKey='accepted'>
              <i className='fi-archive fs-base me-2'></i>
              Reservations en cours
            </Nav.Link>
          </Nav.Item>
          <Nav.Item as={Col}>
            <Nav.Link eventKey='declined'>
              <i className='fi-file-clean fs-base me-2'></i>
              Reservations effectuees
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

export default FurnishedBookingPage;
