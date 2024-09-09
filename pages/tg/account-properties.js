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
import { Row, Col } from 'react-bootstrap';
import PropertiesList from '../../components/iacomponents/PropertiesList'
const AccountPropertiesPage = ({ _userProperties, _handledProjets, _handlingProjets }) => {

  // Properties array
  _userProperties = buildPropertiesArray(_userProperties);
  _handledProjets = buildPropertiesArray(_handledProjets);
  _handlingProjets = buildPropertiesArray(_handlingProjets);
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
  const getNewPropertyProjects = (properties) => {
    return (<PropertiesList properties={properties} />)
  }
  const getHandledPropertyProjects = (properties) => {
    return (<PropertiesList properties={properties} />)
  }
  const getHandlingPropertyProjects = (properties) => {
    return (<PropertiesList properties={properties} />)
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
                    props: { onClick: () => console.log('Deactivate property') }
                  }
                ]}
                className={indx === userProperties.length - 1 ? '' : 'mb-4'}
              />
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
                    props: { onClick: () => console.log('Deactivate property') }
                  }
                ]}
                className={indx === userProperties.length - 1 ? '' : 'mb-4'}
              />
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
                    props: { onClick: () => console.log('Deactivate property') }
                  }
                ]}
                className={indx === userProperties.length - 1 ? '' : 'mb-4'}
              />
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
          </Col>
        </Row>
      </RealEstateAccountLayout>
    </RealEstatePageLayout>
  )
}


export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (session.user) {
    const userid = session ? session.user.id : 0;
    // Fetch data from external API
    var dataAPIresponse = await fetch(`https://immoaskbetaapi.omnisoft.africa/public/api/v2?query={getPropertiesByKeyWords(orderBy:{order:DESC,column:NUO},user_id:${userid},offre_id:"1",statut:1,limit:150){surface,badge_propriete{badge{badge_name,badge_image}},id,nuo,usage,offre{denomination},categorie_propriete{denomination},pays{code},piece,titre,garage,cout_mensuel,ville{denomination},wc_douche_interne,cout_vente,quartier{denomination},visuels{uri}}}`);
    var _userProperties = await dataAPIresponse.json();

    var handledProjets = await fetch(`https://immoaskbetaapi.omnisoft.africa/public/api/v2?query={getPropertiesByKeyWords(orderBy:{order:DESC,column:NUO},user_id:${userid},offre_id:"2",statut:1,limit:150){surface,badge_propriete{badge{badge_name,badge_image}},id,nuo,usage,offre{denomination},categorie_propriete{denomination},pays{code},piece,titre,garage,cout_mensuel,ville{denomination},wc_douche_interne,cout_vente,quartier{denomination},visuels{uri}}}`);
    var _handledProjets = await handledProjets.json();

    var handlingProjets = await fetch(`https://immoaskbetaapi.omnisoft.africa/public/api/v2?query={getPropertiesByKeyWords(orderBy:{order:DESC,column:NUO},user_id:${userid},statut:2,limit:150){surface,badge_propriete{badge{badge_name,badge_image}},id,nuo,usage,offre{denomination},categorie_propriete{denomination},pays{code},piece,titre,garage,cout_mensuel,ville{denomination},wc_douche_interne,cout_vente,quartier{denomination},visuels{uri}}}`);
    var _handlingProjets = await handlingProjets.json();

    _userProperties = _userProperties.data.getPropertiesByKeyWords;
    _handledProjets = _handledProjets.data.getPropertiesByKeyWords;
    _handlingProjets = _handlingProjets.data.getPropertiesByKeyWords;
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
export default AccountPropertiesPage
