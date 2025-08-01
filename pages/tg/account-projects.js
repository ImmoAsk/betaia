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
import { API_URL } from '../../utils/settings'
const AccountProjectsPage = ({ _userProperties, _handledProjets, _handlingProjets }) => {

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
    return (<PropertyProjectList projects={projects} />)
  }
  const getHandledPropertyProjects = (projects) => {
    return (<PropertyProjectList projects={projects} />)
  }
  const getHandlingPropertyProjects = (projects) => {
    return (<PropertyProjectList projects={projects} />)
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
          Nouvels non traites
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
          <h1 className='h2 mb-0'>Projets immobiliers</h1>
          <a href='#' className='fw-bold text-decoration-none' onClick={deleteAll}>
            <i className='fi-trash mt-n1 me-2'></i>
            Supprimer tout
          </a>
        </div>
        <p className='pt-1 mb-4'>Trouver ici tous les projets immobiliers des clients
          comme recherche de logememt, achat....</p>

        {/* Nav tabs */}
        {/* <Nav
          variant='tabs'
          defaultActiveKey='published'
          className='border-bottom mb-4'
        >
          <Nav.Item className='mb-3'>
            <Nav.Link eventKey='published' onClick={handledClickNewPropertyProjectsTab}>
              <i className='fi-file fs-base me-2'></i>
              Nouvels non traites
            </Nav.Link>
          </Nav.Item>
          <Nav.Item className='mb-3'>
            <Nav.Link eventKey='drafts' onClick={handledClickHandlingPropertyProjectsTab}>
              <i className='fi-file-clean fs-base me-2'></i>
              En traitement
            </Nav.Link>
          </Nav.Item>
          <Nav.Item className='mb-3'>
            <Nav.Link eventKey='archived' onClick={handledClickHandledPropertyProjectsTab}>
              <i className='fi-archive fs-base me-2'></i>
              Deja traite
            </Nav.Link>
          </Nav.Item>
        </Nav> */}

        <Nav
          variant='tabs'
          defaultActiveKey='published'
          className='border-bottom mb-2'
        >
          <Nav.Item className='mb-2' as={Col}>
            <Nav.Link eventKey='published'>
              <i className='fi-file fs-base me-2'></i>
              Nouvels non traites
            </Nav.Link>
          </Nav.Item>
          <Nav.Item className='mb-2' as={Col}>
            <Nav.Link eventKey='drafts'>
              <i className='fi-archive fs-base me-2'></i>
              En traitement
            </Nav.Link>
          </Nav.Item>
          <Nav.Item className='mb-2' as={Col}>
            <Nav.Link eventKey='published'>
              <i className='fi-file-clean fs-base me-2'></i>
              Deja traites
            </Nav.Link>
          </Nav.Item>
        </Nav>
        <Row>
          {/* First Column */}
          <Col style={columnStyle}>
            {getNewPropertyProjects(userProperties)}
          </Col>
          

          {/* Second Column */}
          <Col style={columnStyle}>
            {getHandledPropertyProjects(_handledProjets)}
          </Col>
          <Col style={columnStyle}>
            {getHandledPropertyProjects(_handlingProjets)}
          </Col>

          {/* Third Column */}
          
        </Row>


        {/* List of properties or empty state */}
        {/* {newPropertyProjectsTab && getNewPropertyProjects(userProperties)}
        {handledPropertyProjectsTab && getHandledPropertyProjects(_handledProjets)}
        {handlingPropertyProjectsTab && getHandlingPropertyProjects(userProperties)} */}


        {/* <div className='text-center pt-2 pt-md-4 pt-lg-5 pb-2 pb-md-0'>

          <i className='fi-home display-6 text-muted mb-4'></i>
          <h2 className='h5 mb-4'>Vous n'avez pas encore soumis un projet immobilier!</h2>
          <Link href='/tg/add-property' passHref>
            <Button variant='primary'>
              <i className='fi-plus fs-sm me-2'></i>
              Enroller un bien immobilier
            </Button>
          </Link>
        </div> */}
      </RealEstateAccountLayout>
    </RealEstatePageLayout>
  )
}



export async function getServerSideProps(context) {
  const session = await getSession(context);

  console.log("Session data:", session); // Check if the session data is correct

  if (!session) {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      },
    };
  }

  // Check if the user is an admin or property owner
  if (session?.user?.roleId == '1200' || session?.user?.roleId == '1231'|| session?.user?.roleId == '1232') {
    console.log(session?.user?.roleId)
    // Admin role
    var dataAPIresponse = await fetch(`${API_URL}?query={getProjectsByKeyWords(statut:0,orderBy:{order:DESC,column:ID}){project_category,project_name,project_document,description,statut,final_date,start_date}}`);
    var _userProperties = await dataAPIresponse.json();

    var handledProjets = await fetch(`${API_URL}?query={getProjectsByKeyWords(statut:2,orderBy:{order:DESC,column:ID}){project_category,project_name,project_document,description,statut,final_date,start_date}}`);
    var _handledProjets = await handledProjets.json();

    var handlingProjets = await fetch(`${API_URL}?query={getProjectsByKeyWords(statut:1,orderBy:{order:DESC,column:ID}){project_category,project_name,project_document,description,statut,final_date,start_date}}`);
    var _handlingProjets = await handlingProjets.json();

    _userProperties = _userProperties.data.getProjectsByKeyWords;
    _handledProjets = _handledProjets.data.getProjectsByKeyWords;
    _handlingProjets = _handlingProjets.data.getProjectsByKeyWords;
  } else {
    // Property owner
    console.log("Proprietair ID: ",session?.user?.id)
    var dataAPIresponse = await fetch(`${API_URL}?query={getProjectsByKeyWords(statut:0,user_id:${session?.user?.id},orderBy:{order:DESC,column:ID}){project_category,project_name,project_document,description,statut,final_date,start_date}}`);
    var _userProperties = await dataAPIresponse.json();

    var handledProjets = await fetch(`${API_URL}?query={getProjectsByKeyWords(statut:2,user_id:${session?.user?.id},orderBy:{order:DESC,column:ID}){project_category,project_name,project_document,description,statut,final_date,start_date}}`);
    var _handledProjets = await handledProjets.json();

    var handlingProjets = await fetch(`${API_URL}?query={getProjectsByKeyWords(statut:1,user_id:${session?.user?.id},orderBy:{order:DESC,column:ID}){project_category,project_name,project_document,description,statut,final_date,start_date}}`);
    var _handlingProjets = await handlingProjets.json();

    _userProperties = _userProperties.data.getProjectsByKeyWords;
    _handledProjets = _handledProjets.data.getProjectsByKeyWords;
    _handlingProjets = _handlingProjets.data.getProjectsByKeyWords;
  }

  return {
    props: { _userProperties, _handledProjets, _handlingProjets },
  };
}
export default AccountProjectsPage
