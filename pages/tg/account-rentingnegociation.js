/* import { useState } from 'react'
import RealEstatePageLayout from '../../components/partials/RealEstatePageLayout'
import RealEstateAccountLayout from '../../components/partials/RealEstateAccountLayout'
import Nav from 'react-bootstrap/Nav'
import EditPropertyModal from '../../components/iacomponents/EditPropertyModal'
import { useSession, getSession } from 'next-auth/react'
import { Row, Col} from 'react-bootstrap';
import RentingNegotiationOfferList from '../../components/iacomponents/RentingNegotiationOfferList'
const RentingNegociationPage = ({ _userProperties, _handledNegotiations, _handlingNegotiations }) => {

  const [editPropertyShow, setEditPropertyShow] = useState(false);
  const handleEditPropertyClose = () => setEditPropertyShow(false);
  const handleEditPropertyShow = () => setEditPropertyShow(true);
  const [newPropertyProjectsTab, setNewPropertyProjectsTab] = useState(false);
  const handledClickNewPropertyProjectsTab = () => setNewPropertyProjectsTab(true);

  const [handlingPropertyProjectsTab, setHandlingPropertyProjectsTab] = useState(false);
  const handledClickHandlingPropertyProjectsTab = () => setHandlingPropertyProjectsTab(true);
  const [handledPropertyProjectsTab, setHandledPropertyProjectsTab] = useState(false);
  const handledClickHandledPropertyProjectsTab = () => setHandledPropertyProjectsTab(true);
  const [propertyModal, setPropertyModal] = useState({});

  const { data: session } = useSession();
  const userProperties = _userProperties;
  const handleEditPropertyModal = () => {
    if (session) {
      handleEditPropertyShow();
    } else {
      handleSignInToUp(e);
    }
  }

  //console.log(properties);
  const deleteAll = (e) => {
    e.preventDefault();
  }
  const getHandledNegotiationRentOffers = (projects) => {
    return (<RentingNegotiationOfferList projects={projects} />)
  }
  const columnStyle = {
    height: '650px', 
    overflowY: 'scroll',
  };
  const navComponent = (
    <Nav variant='tabs' defaultActiveKey='published' className='border-bottom mb-2'>
      <Nav.Item className='mb-2'>
        <Nav.Link eventKey='published'>
          <i className='fi-file fs-base me-2'></i>
          Negociations non traitees
        </Nav.Link>
      </Nav.Item>
    </Nav>
  );
  return (
    <RealEstatePageLayout
      pageTitle='Negotiations immobiliersS'
      activeNav='Account'
      userLoggedIn
    >
      {
        editPropertyShow && <EditPropertyModal
          centered
          size='lg'
          show={editPropertyShow}
          onHide={handleEditPropertyClose}
          property={propertyModal}
        />
      }
      <RealEstateAccountLayout accountPageTitle='Negotiations immobiliers' >
        <div className='d-flex align-items-center justify-content-between mb-3'>
          <h1 className='h2 mb-0'>Negociations de loyers</h1>
          <a href='#' className='fw-bold text-decoration-none' onClick={deleteAll}>
            <i className='fi-trash mt-n1 me-2'></i>
            Supprimer tout
          </a>
        </div>
        <p className='pt-1 mb-4'>Trouvez ici toutes les propositions de négociation de loyer envoyées par des locataires potentiels pour vos biens en location et séjours immobiliers.</p>

        <Nav
          variant='tabs'
          defaultActiveKey='published'
          className='border-bottom mb-2'
        >
          <Nav.Item className='mb-2' as={Col}>
            <Nav.Link eventKey='published'>
              <i className='fi-file fs-base me-2'></i>
              Negociations non traites
            </Nav.Link>
          </Nav.Item>
          <Nav.Item className='mb-2' as={Col}>
            <Nav.Link eventKey='drafts'>
              <i className='fi-archive fs-base me-2'></i>
              Negociations acceptees
            </Nav.Link>
          </Nav.Item>
          <Nav.Item className='mb-2' as={Col}>
            <Nav.Link eventKey='published'>
              <i className='fi-file-clean fs-base me-2'></i>
              Negociations declinees
            </Nav.Link>
          </Nav.Item>
        </Nav>
        <Row>
          <Col style={columnStyle}>
            {getHandledNegotiationRentOffers(_handlingNegotiations)}
          </Col>
          <Col style={columnStyle}>
            {getHandledNegotiationRentOffers(_handledNegotiations)}
          </Col>
          <Col style={columnStyle}>
            {getHandledNegotiationRentOffers(userProperties)}
          </Col>
        </Row>
      </RealEstateAccountLayout>
    </RealEstatePageLayout>
  )
}


export async function getServerSideProps(context) {
  const session = await getSession(context);
  console.log(session);
  if (session.user) {
    const userid = session ? session.user.id : 0;
    var dataAPIresponse = await fetch(`https://immoaskbetaapi.omnisoft.africa/public/api/v2?query={getNegotiatiionsByKeyWords(statut:2,orderBy:{order:DESC,column:ID}){id,date_negociation,statut,telephone_negociateur,fullname_negociateur,montant}}`);
    var _userProperties = await dataAPIresponse.json();
    var handledNegotiations = await fetch(`https://immoaskbetaapi.omnisoft.africa/public/api/v2?query={getNegotiatiionsByKeyWords(statut:1,orderBy:{order:DESC,column:ID}){id,date_negociation,statut,telephone_negociateur,fullname_negociateur,montant}}`);
    var _handledNegotiations = await handledNegotiations.json();

    var handlingNegotiations = await fetch(`https://immoaskbetaapi.omnisoft.africa/public/api/v2?query={getNegotiatiionsByKeyWords(statut:0,orderBy:{order:DESC,column:ID}){id,date_negociation,statut,telephone_negociateur,fullname_negociateur,montant}}`);
    var _handlingNegotiations = await handlingNegotiations.json();
    _userProperties = _userProperties.data.getNegotiatiionsByKeyWords;
    _handledNegotiations = _handledNegotiations.data.getNegotiatiionsByKeyWords;
    _handlingNegotiations = _handlingNegotiations.data.getNegotiatiionsByKeyWords;
    return {
      props: { _userProperties, _handledNegotiations, _handlingNegotiations },
    }

  } else {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      },
    };
  }
}
export default RentingNegociationPage
 */

import { useState } from 'react';
import RealEstatePageLayout from '../../components/partials/RealEstatePageLayout';
import RealEstateAccountLayout from '../../components/partials/RealEstateAccountLayout';
import Nav from 'react-bootstrap/Nav';
import EditPropertyModal from '../../components/iacomponents/EditPropertyModal';
import { useSession, getSession } from 'next-auth/react';
import { Row, Col } from 'react-bootstrap';
import RentingNegotiationOfferList from '../../components/iacomponents/RentingNegotiationOfferList';
// Helper function to fetch negotiations by statut
async function fetchNegotiationsByStatut(statut) {
  const dataAPIresponse = await fetch(
    `https://immoaskbetaapi.omnisoft.africa/public/api/v2?query={getNegotiatiionsByKeyWords(statut:${statut},orderBy:{order:DESC,column:ID}){id,date_negociation,statut,telephone_negociateur,fullname_negociateur,montant}}`
  );
  const responseData = await dataAPIresponse.json();
  if (!responseData.data) {
    return [];
  }

  return responseData.data.getNegotiatiionsByKeyWords;
}





const RentingNegociationPage = ({ _newNegotiations,_acceptedNegotiations, _declinedNegotiations }) => {
  const [editPropertyShow, setEditPropertyShow] = useState(false);
  const [activeTab, setActiveTab] = useState('published');
  const [propertyModal, setPropertyModal] = useState({});

  const { data: session } = useSession();

  const handleEditPropertyModal = (e) => {
    if (session) {
      setEditPropertyShow(true);
    } else {
      handleSignInToUp(e);
    }
  };

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
  };

  const getHandledNegotiationRentOffers = (projects) => {
    return <RentingNegotiationOfferList projects={projects} />;
  };

  const columnStyle = {
    height: '650px',
    overflowY: 'scroll',
  };

  return (
    <RealEstatePageLayout pageTitle='Negotiations immobilières' activeNav='Account' userLoggedIn>
      {editPropertyShow && (
        <EditPropertyModal centered size='lg' show={editPropertyShow} onHide={() => setEditPropertyShow(false)} property={propertyModal} />
      )}

      <RealEstateAccountLayout accountPageTitle='Negotiations immobilières'>
        <div className='d-flex align-items-center justify-content-between mb-3'>
          <h1 className='h2 mb-0'>Negociations de loyers</h1>
        </div>
        <p className='pt-1 mb-4'>
          Trouvez ici toutes les propositions de négociation de loyer envoyées par des locataires potentiels pour vos biens en location et séjours
          immobiliers.
        </p>
        <Nav variant='tabs' defaultActiveKey='published' onSelect={handleTabChange} className='border-bottom mb-2'>
          <Nav.Item as={Col}>
            <Nav.Link eventKey='published'>
              <i className='fi-file fs-base me-2'></i>
              Negociations non traitées
            </Nav.Link>
          </Nav.Item>
          <Nav.Item as={Col}>
            <Nav.Link eventKey='accepted'>
              <i className='fi-archive fs-base me-2'></i>
              Negociations acceptées
            </Nav.Link>
          </Nav.Item>
          <Nav.Item as={Col}>
            <Nav.Link eventKey='declined'>
              <i className='fi-file-clean fs-base me-2'></i>
              Negociations déclinées
            </Nav.Link>
          </Nav.Item>
        </Nav>

        <Row>
          {/* For small screens, display only one column based on activeTab */}
          {window.innerWidth < 992 && (
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
          )}

          {/* For large screens, display all three columns simultaneously */}
          {window.innerWidth >= 992 && (
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

  if (session?.user) {

    // Fetch negotiation data for different statuts
    const _newNegotiations = await fetchNegotiationsByStatut(0);
    const _acceptedNegotiations = await fetchNegotiationsByStatut(1);
    const _declinedNegotiations = await fetchNegotiationsByStatut(2);

    return {
      props: { _newNegotiations,_acceptedNegotiations, _declinedNegotiations },
    };
  } else {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      },
    };
  }
}

export default RentingNegociationPage;

