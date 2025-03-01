import { useState } from 'react'
import RealEstatePageLayout from '../../components/partials/RealEstatePageLayout'
import RealEstateAccountLayout from '../../components/partials/RealEstateAccountLayout'
import Link from 'next/link'
import Nav from 'react-bootstrap/Nav'
import Button from 'react-bootstrap/Button'
import PropertyCard from '../../components/PropertyCard'
import EditPropertyModal from '../../components/iacomponents/EditPropertyModal'
import { buildPropertiesArray, getHumanReadablePrice } from '../../utils/generalUtils'
import { useSession, getSession } from 'next-auth/react'
import { Row, Col } from 'react-bootstrap';
import PropertiesList from '../../components/iacomponents/PropertiesList'
import { API_URL, BASE_URL, IMAGE_URL } from '../../utils/settings'
import DeletePropertyModal from '../../components/iacomponents/DeleteProperty/DeletePropertyModal'
import AddNewImagesModal from '../../components/iacomponents/AddNewImagesProperty/AddNewImagesModal'

const AccountPropertiesPage = ({ _userProperties, _handledProjets, _handlingProjets }) => {

  // Properties array
  _userProperties = buildPropertiesArray(_userProperties);
  _handledProjets = buildPropertiesArray(_handledProjets);
  _handlingProjets = buildPropertiesArray(_handlingProjets);

  const [editPropertyShow, setEditPropertyShow] = useState(false);
  const handleEditPropertyClose = () => setEditPropertyShow(false);
  const handleEditPropertyShow = () => setEditPropertyShow(true);

  const [deletePropertyShow, setDeletePropertyShow] = useState(false);
  const handleDeletePropertyClose = () => setDeletePropertyShow(false);
  const handleDeletePropertyShow = () => setDeletePropertyShow(true);

  const [newPropertyProjectsTab, setNewPropertyProjectsTab] = useState(false);
  const handledClickNewPropertyProjectsTab = () => setNewPropertyProjectsTab(true);

  const [newImagesPropertyShow, setNewImagesPropertyShow] = useState(false);
  const handleAddNewImagesPropertyClose = () => setNewImagesPropertyShow(false);
  const handleAddNewImagesPropertyShow = () => setNewImagesPropertyShow(true);

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

  const handleDeletePropertyModal = () => {
    //e.preventDefault();
    if (session) {
      handleDeletePropertyShow();
    } else {
      handleSignInToUp(e);
    }
  }

  const handleAddNewImagesPropertyModal = () => {
    //e.preventDefault();
    if (session) {
      handleAddNewImagesPropertyShow();
    } else {
      handleSignInToUp(e);
    }
  }

  //console.log(properties);
  const deleteAll = (e) => {
    e.preventDefault();
  }
  const columnStyle = {
    height: '650px', // Adjust the height as needed
    overflowY: 'scroll', // Enable vertical scrolling
  };
  return (
    <RealEstatePageLayout
      pageTitle='Portofolio immobilier'
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

      {
        deletePropertyShow && <DeletePropertyModal
          centered
          size='lg'
          show={deletePropertyShow}
          onHide={handleDeletePropertyClose}
          property={propertyModal}
        />
      }
      {
        newImagesPropertyShow && <AddNewImagesModal
          centered
          size='lg'
          show={newImagesPropertyShow}
          onHide={handleAddNewImagesPropertyClose}
          property={propertyModal}
        />
      }
      <RealEstateAccountLayout accountPageTitle='Portofolio immobilier' >
        <div className='d-flex align-items-center justify-content-between mb-3'>
          <h1 className='h2 mb-0'>Portofolio immobiliers</h1>
          <a href='#' className='fw-bold text-decoration-none' onClick={deleteAll}>
            <i className='fi-trash mt-n1 me-2'></i>
            Supprimer tout
          </a>
        </div>
        <p className='pt-1 mb-4'>Tous vos biens immobiliers en vente, location et ms en indisponibitlite....</p>
        <Nav
          variant='tabs'
          defaultActiveKey='published'
          className='border-bottom mb-2'
        >
          <Nav.Item className='mb-2' as={Col}>
            <Nav.Link eventKey='published'>
              <i className='fi-file fs-base me-2'></i>
              Mis en location
            </Nav.Link>
          </Nav.Item>
          <Nav.Item className='mb-2' as={Col}>
            <Nav.Link eventKey='drafts'>
              <i className='fi-archive fs-base me-2'></i>
              Mis en vente
            </Nav.Link>
          </Nav.Item>
          <Nav.Item className='mb-2' as={Col}>
            <Nav.Link eventKey='published'>
              <i className='fi-file-clean fs-base me-2'></i>
              Mis en indisponible
            </Nav.Link>
          </Nav.Item>
        </Nav>
        <Row>
          {/* First Column */}
          <Col style={columnStyle}>
            {_userProperties.length ? _userProperties.map((property, indx) => (
              <PropertyCard
                key={indx}
                href={property.href}
                images={property.images}
                category={property.category}
                title={property.title}
                location={property.location}
                price={property.price}
                badges={property.badges}
                footer={[
                  ['fi-bed', property.amenities[0]],
                  ['fi-bath', property.amenities[1]],
                  ['fi-car', property.amenities[2]]
                ]}
                horizontal
                dropdown={[
                  {
                    // href: '#', // Optionally pass href prop to convert dropdown item to Next link
                    icon: 'fi-edit',
                    label: 'Editer',
                    props: {
                      onClick: (event) => {
                        event.stopPropagation();
                        event.preventDefault();
                        setPropertyModal(property);
                        handleEditPropertyModal();
                      }
                    }
                  },
                  {
                    icon: 'fi-flame',
                    label: 'Promouvoir',
                    props: { onClick: () => console.log('Promote property') }
                  },
                  {
                    icon: 'fi-power',
                    label: 'Rendre invisible',
                    props: { onClick: () => console.log('Deactivate property') }
                  },
                  {
                    icon: 'fi-trash',
                    label: 'Rendre indisponible',
                    props: {
                      onClick: (event) => {
                        event.stopPropagation();
                        event.preventDefault();
                        setPropertyModal(property);
                        handleDeletePropertyModal();
                      }
                    }
                  },
                  {
                    icon: 'fi-image',
                    label: 'Ajouter de nouvelles images',
                    props: {
                      onClick: (event) => {
                        event.stopPropagation();
                        event.preventDefault();
                        setPropertyModal(property);
                        handleAddNewImagesPropertyModal();
                      }
                    }
                  }
                ]}
                className={indx === userProperties.length - 1 ? '' : 'mb-4'}
              />
            )) : <div className='text-center pt-2 pt-md-4 pt-lg-5 pb-2 pb-md-0'>
              <i className='fi-home display-6 text-muted mb-4'></i>
              <h2 className='h5 mb-4'>Aucun bien immobilier en location!</h2>
              <Link href='/tg/add-property' passHref>
                <Button variant='primary'>
                  <i className='fi-plus fs-sm me-2'></i>
                  Enroller un bien immobilier
                </Button>
              </Link>
            </div>}
          </Col>

          {/* Second Column */}
          <Col style={columnStyle}>
            {_handledProjets.length ? _handledProjets.map((property, indx) => (
              <PropertyCard
                key={indx}
                href={property.href}
                images={property.images}
                category={property.category}
                title={property.title}
                location={property.location}
                price={property.price}
                badges={property.badges}
                footer={[
                  ['fi-bed', property.amenities[0]],
                  ['fi-bath', property.amenities[1]],
                  ['fi-car', property.amenities[2]]
                ]}
                horizontal
                dropdown={[
                  {
                    // href: '#', // Optionally pass href prop to convert dropdown item to Next link
                    icon: 'fi-edit',
                    label: 'Editer',
                    props: {
                      onClick: (event) => {
                        event.stopPropagation();
                        event.preventDefault();
                        setPropertyModal(property);
                        handleEditPropertyModal();
                      }
                    }
                  },
                  {
                    icon: 'fi-flame',
                    label: 'Promouvoir',
                    props: { onClick: () => console.log('Promote property') }
                  },
                  {
                    icon: 'fi-power',
                    label: 'Rendre invisible',
                    props: { onClick: () => console.log('Deactivate property') }
                  },
                  {
                    icon: 'fi-trash',
                    label: 'Rendre indisponible',
                    props: {
                      onClick: (event) => {
                        event.stopPropagation();
                        event.preventDefault();
                        setPropertyModal(property);
                        handleDeletePropertyModal();
                      }
                    }
                  },
                  {
                    icon: 'fi-image',
                    label: 'Ajouter de nouvelles images',
                    props: {
                      onClick: (event) => {
                        event.stopPropagation();
                        event.preventDefault();
                        setPropertyModal(property);
                        handleAddNewImagesPropertyModal();
                      }
                    }
                  }
                ]}
                className={indx === userProperties.length - 1 ? '' : 'mb-4'}
              />
            )) : <div className='text-center pt-2 pt-md-4 pt-lg-5 pb-2 pb-md-0'>
              <i className='fi-home display-6 text-muted mb-4'></i>
              <h2 className='h5 mb-4'>Aucun bien immobilier en vente!</h2>
              <Link href='/tg/add-property' passHref>
                <Button variant='primary'>
                  <i className='fi-plus fs-sm me-2'></i>
                  Enroller un bien immobilier
                </Button>
              </Link>
            </div>}
          </Col>

          {/* Third Column */}
          <Col style={columnStyle}>
            {_handlingProjets.length ? _handlingProjets.map((property, indx) => (
              <PropertyCard
                key={indx}
                href={property.href}
                images={property.images}
                category={property.category}
                title={property.title}
                location={property.location}
                price={property.price}
                badges={property.badges}
                footer={[
                  ['fi-bed', property.amenities[0]],
                  ['fi-bath', property.amenities[1]],
                  ['fi-car', property.amenities[2]]
                ]}
                horizontal
                dropdown={[
                  {
                    icon: 'fi-power',
                    label: 'Remettre sur le marche immobilier',
                    props: { onClick: () => console.log('Deactivate property') }
                  },
                ]}
                className={indx === userProperties.length - 1 ? '' : 'mb-4'}
              />
            )) : <div className='text-center pt-2 pt-md-4 pt-lg-5 pb-2 pb-md-0'>
              <i className='fi-home display-6 text-muted mb-4'></i>
              <h2 className='h5 mb-4'>Aucun bien immobilier indisponible!</h2>
              <Link href='/tg/add-property' passHref>
                <Button variant='primary'>
                  <i className='fi-plus fs-sm me-2'></i>
                  Enroller un bien immobilier
                </Button>
              </Link>
            </div>}
          </Col>
        </Row>
      </RealEstateAccountLayout>
    </RealEstatePageLayout>
  )
}
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

  // Check if the user is an admin or property owner
  if (session?.user?.roleId == '1200' || session?.user?.roleId == '1231') {
    console.log(session?.user?.roleId)
    // Admin role
    var dataAPIresponse = await fetch(`${API_URL}?query={getPropertiesByKeyWords(orderBy:{order:DESC,column:NUO},offre_id:"1",statut:1,limit:50){surface,badge_propriete{badge{badge_name,badge_image}},id,nuo,usage,offre{denomination},categorie_propriete{denomination},pays{code},piece,titre,garage,nuitee,cout_mensuel,ville{denomination},wc_douche_interne,cout_vente,quartier{id,denomination,minus_denomination},visuels{uri,position}}}`);
    var _userProperties = await dataAPIresponse.json();

    var handledProjets = await fetch(`${API_URL}?query={getPropertiesByKeyWords(orderBy:{order:DESC,column:NUO},offre_id:"2",statut:1,limit:50){surface,badge_propriete{badge{badge_name,badge_image}},id,nuo,usage,offre{denomination},categorie_propriete{denomination},pays{code},piece,titre,garage,nuitee,cout_mensuel,ville{denomination},wc_douche_interne,cout_vente,quartier{denomination,id,minus_denomination},visuels{uri,position}}}`);
    var _handledProjets = await handledProjets.json();

    var handlingProjets = await fetch(`${API_URL}?query={getPropertiesByKeyWords(orderBy:{order:DESC,column:NUO},statut:2,limit:50){surface,badge_propriete{badge{badge_name,badge_image}},id,nuo,usage,offre{denomination},categorie_propriete{denomination},pays{code},piece,titre,garage,cout_mensuel,nuitee,ville{denomination},wc_douche_interne,cout_vente,quartier{denomination,id,minus_denomination},visuels{uri,position}}}`);
    var _handlingProjets = await handlingProjets.json();

    _userProperties = _userProperties.data.getPropertiesByKeyWords;
    _handledProjets = _handledProjets.data.getPropertiesByKeyWords;
    _handlingProjets = _handlingProjets.data.getPropertiesByKeyWords;
  } else {
    // Property owner
    var dataAPIresponse = await fetch(`${API_URL}?query={getPropertiesByKeyWords(orderBy:{order:DESC,column:NUO},user_id:${Number(session?.user?.id)},offre_id:"1",statut:1,limit:50){surface,badge_propriete{badge{badge_name,badge_image}},id,nuo,usage,offre{denomination},categorie_propriete{denomination},pays{code},piece,titre,garage,nuitee,cout_mensuel,ville{denomination},wc_douche_interne,cout_vente,quartier{id,denomination,minus_denomination},visuels{uri,position}}}`);
    var _userProperties = await dataAPIresponse.json();

    var handledProjets = await fetch(`${API_URL}?query={getPropertiesByKeyWords(orderBy:{order:DESC,column:NUO},user_id:${Number(session?.user?.id)},offre_id:"2",statut:1,limit:50){surface,badge_propriete{badge{badge_name,badge_image}},id,nuo,usage,offre{denomination},categorie_propriete{denomination},pays{code},piece,titre,garage,nuitee,cout_mensuel,ville{denomination},wc_douche_interne,cout_vente,quartier{denomination,id,minus_denomination},visuels{uri,position}}}`);
    var _handledProjets = await handledProjets.json();

    var handlingProjets = await fetch(`${API_URL}?query={getPropertiesByKeyWords(orderBy:{order:DESC,column:NUO},user_id:${Number(session?.user?.id)},statut:2,limit:50){surface,badge_propriete{badge{badge_name,badge_image}},id,nuo,usage,offre{denomination},categorie_propriete{denomination},pays{code},piece,titre,garage,cout_mensuel,nuitee,ville{denomination},wc_douche_interne,cout_vente,quartier{denomination,id,minus_denomination},visuels{uri,position}}}`);
    var _handlingProjets = await handlingProjets.json();

    _userProperties = _userProperties.data.getPropertiesByKeyWords;

    _handledProjets = _handledProjets.data.getPropertiesByKeyWords;
    _handlingProjets = _handlingProjets.data.getPropertiesByKeyWords;

  }
  //console.log(_userProperties);
  return {
    props: { _userProperties, _handledProjets, _handlingProjets },
  };
}

export default AccountPropertiesPage
