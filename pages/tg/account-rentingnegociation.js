import { useState } from 'react'
import RealEstatePageLayout from '../../components/partials/RealEstatePageLayout'
import RealEstateAccountLayout from '../../components/partials/RealEstateAccountLayout'
import Link from 'next/link'
import Nav from 'react-bootstrap/Nav'
import Button from 'react-bootstrap/Button'
import PropertyCard from '../../components/PropertyCard'
import EditPropertyModal from '../../components/iacomponents/EditPropertyModal'
import { buildPropertiesArray } from '../../utils/generalUtils'
import { useSession, getSession } from 'next-auth/react'
import PropertyProjectList from '../../components/iacomponents/PropertyProjectList'
import { Row, Col} from 'react-bootstrap';
import RentingNegotiationOfferList from '../../components/iacomponents/RentingNegotiationOfferList'
const RentingNegociationPage = ({ _userProperties, _handledProjets, _handlingProjets }) => {

  // Properties array
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
    //e.preventDefault();
    if (session) {
      handleEditPropertyShow();
    } else {
      handleSignInToUp(e);
    }
  }

  //console.log(properties);
  const deleteAll = (e) => {
    e.preventDefault();
    //userProperties=[];
    //setProperties([])
  }
  const getNewPropertyProjects = (projects) => {
    return (<RentingNegotiationOfferList projects={projects} />)
  }
  const getHandledPropertyProjects = (projects) => {
    return (<RentingNegotiationOfferList projects={projects} />)
  }
  const getHandlingPropertyProjects = (projects) => {
    return (<RentingNegotiationOfferList projects={projects} />)
  }
  const columnStyle = {
    height: '650px', // Adjust the height as needed
    overflowY: 'scroll', // Enable vertical scrolling
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
      pageTitle='Projets immobiliersS'
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
      <RealEstateAccountLayout accountPageTitle='Projets immobiliers' >
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
          {/* First Column */}
          <Col style={columnStyle}>
            {getHandledPropertyProjects(_handlingProjets)}
          </Col>

          {/* Second Column */}
          <Col style={columnStyle}>
            {getHandledPropertyProjects(_handledProjets)}
          </Col>

          {/* Third Column */}
          <Col style={columnStyle}>
            {getNewPropertyProjects(userProperties)}
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
    // Fetch data from external API
    var dataAPIresponse = await fetch(`https://immoaskbetaapi.omnisoft.africa/public/api/v2?query={getNegotiatiionsByKeyWords(statut:2,orderBy:{order:DESC,column:ID}){id,date_negociation,statut,telephone_negociateur,fullname_negociateur,montant}}`);
    var _userProperties = await dataAPIresponse.json();
    var handledProjets = await fetch(`https://immoaskbetaapi.omnisoft.africa/public/api/v2?query={getNegotiatiionsByKeyWords(statut:1,orderBy:{order:DESC,column:ID}){id,date_negociation,statut,telephone_negociateur,fullname_negociateur,montant}}`);
    var _handledProjets = await handledProjets.json();

    var handlingProjets = await fetch(`https://immoaskbetaapi.omnisoft.africa/public/api/v2?query={getNegotiatiionsByKeyWords(statut:0,orderBy:{order:DESC,column:ID}){id,date_negociation,statut,telephone_negociateur,fullname_negociateur,montant}}`);
    var _handlingProjets = await handlingProjets.json();
    _userProperties = _userProperties.data.getNegotiatiionsByKeyWords;
    _handledProjets = _handledProjets.data.getNegotiatiionsByKeyWords;
    _handlingProjets = _handlingProjets.data.getNegotiatiionsByKeyWords;
    return {
      props: { _userProperties, _handledProjets, _handlingProjets },
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
