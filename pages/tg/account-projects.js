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

const AccountProjectsPage = ({ _userProperties }) => {

  // Properties array
  const [editPropertyShow, setEditPropertyShow] = useState(false);
  const handleEditPropertyClose = () => setEditPropertyShow(false);
  const handleEditPropertyShow = () => setEditPropertyShow(true);


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
        <Nav
          variant='tabs'
          defaultActiveKey='published'
          className='border-bottom mb-4'
        >
          <Nav.Item className='mb-3'>
            <Nav.Link eventKey='published'>
              <i className='fi-file fs-base me-2'></i>
              Nouvels non traites
            </Nav.Link>
          </Nav.Item>
          <Nav.Item className='mb-3'>
            <Nav.Link eventKey='drafts'>
              <i className='fi-file-clean fs-base me-2'></i>
              En traitement
            </Nav.Link>
          </Nav.Item>
          <Nav.Item className='mb-3'>
            <Nav.Link eventKey='archived'>
              <i className='fi-archive fs-base me-2'></i>
              Deja traite
            </Nav.Link>
          </Nav.Item>
        </Nav>

        {/* List of properties or empty state */}
        {userProperties.length ? userProperties.map((project, indx) => (
          <div class="pb-2">
            <div class="card bg-secondary card-hover">
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-start mb-2">
                  <div class="d-flex align-items-center">
                    <span class="fs-sm text-dark opacity-80 px-1">{project.project_name}</span>
                    <span class="badge bg-faded-accent rounded-pill fs-sm ms-2">{project.project_category}</span>
                  </div>
                  <div class="dropdown content-overlay">
                    <button type="button" class="btn btn-icon btn-light btn-xs rounded-circle shadow-sm" id="contextMenu" data-bs-toggle="dropdown" aria-expanded="false">
                      <i class="fi-dots-vertical"></i>
                    </button>
                    <ul class="dropdown-menu my-1" aria-labelledby="contextMenu">
                      <li>
                        <button type="button" class="dropdown-item">
                          <i class="fi-heart opacity-60 me-2"></i>
                          Traiter 
                        </button>
                      </li>
                      <li>
                        <button type="button" class="dropdown-item">
                          <i class="fi-x-circle opacity-60 me-2"></i>
                          Archiver
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
                <h3 class="h6 card-title pt-1 mb-3">
                  <a href="#" class="text-nav stretched-link text-decoration-none">{project.description}</a>
                </h3>
                <div class="fs-sm">
                  <span class="text-nowrap me-3">
                    <i class="fi-calendar text-muted me-1"> </i>
                    {project.start_date}
                  </span>
                  <span class="text-nowrap me-3">
                    <i class="fi-cash fs-base text-muted me-1"></i>
                    {project.statut}
                  </span>
                </div>
              </div>
            </div>
          </div>

        )) : <div className='text-center pt-2 pt-md-4 pt-lg-5 pb-2 pb-md-0'>
          <i className='fi-home display-6 text-muted mb-4'></i>
          <h2 className='h5 mb-4'>Vous n'avez aucun bien immobilier enrollé!</h2>
          <Link href='/tg/add-property' passHref>
            <Button variant='primary'>
              <i className='fi-plus fs-sm me-2'></i>
              Enroller un bien immobilier
            </Button>
          </Link>
        </div>}
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
    var dataAPIresponse = await fetch(`https://immoaskbetaapi.omnisoft.africa/public/api/v2?query={getProjectsByKeyWords(statut:2){project_category,project_name,project_document,description,statut,final_date,start_date}}`);
    var _userProperties = await dataAPIresponse.json();

    _userProperties = _userProperties.data.getProjectsByKeyWords;
    console.log(_userProperties);
    return {
      props: { _userProperties },
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
export default AccountProjectsPage
