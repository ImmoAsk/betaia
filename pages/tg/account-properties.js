import { useState } from 'react'
import RealEstatePageLayout from '../../components/partials/RealEstatePageLayout'
import RealEstateAccountLayout from '../../components/partials/RealEstateAccountLayout'
import Link from 'next/link'
import Nav from 'react-bootstrap/Nav'
import Button from 'react-bootstrap/Button'
import PropertyCard from '../../components/PropertyCard'
import EditPropertyModal from '../../components/iacomponents/EditPropertyModal'
import { buildPropertiesArray } from '../../utils/generalUtils'
import { useSession,getSession } from 'next-auth/react'

const AccountPropertiesPage = ({_userProperties}) => {

  // Properties array
  const [editPropertyShow, setEditPropertyShow] = useState(false);
  const handleEditPropertyClose = () => setEditPropertyShow(false);
  const handleEditPropertyShow = () => setEditPropertyShow(true);


  const [propertyModal, setPropertyModal]=useState({});

  const { data: session } = useSession();
  const userProperties = buildPropertiesArray(_userProperties);
  const handleEditPropertyModal = (e) => {
    e.preventDefault()
    if (session) {
      handleEditPropertyShow();
    } else {
      handleSignInToUp(e);
    }
  }

  //console.log(properties);
  const deleteAll = (e) => {
    e.preventDefault()
    //userProperties=[];
    //setProperties([])
  }


  return (
    <RealEstatePageLayout
      pageTitle='Tableau immobilier'
      activeNav='Account'
      userLoggedIn={session ? true : false}
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
      <RealEstateAccountLayout accountPageTitle='Tableau immobilier'>
        <div className='d-flex align-items-center justify-content-between mb-3'>
          <h1 className='h2 mb-0'>Biens immobiliers de mes mandats</h1>
          <a href='#' className='fw-bold text-decoration-none' onClick={deleteAll}>
            <i className='fi-trash mt-n1 me-2'></i>
            Delete all
          </a>
        </div>
        <p className='pt-1 mb-4'>Trouver ici tous vos biens immobiliers mis en location ou vente. Et les mettre à jour aisément</p>

        {/* Nav tabs */}
        <Nav
          variant='tabs'
          defaultActiveKey='published'
          className='border-bottom mb-4'
        >
          <Nav.Item className='mb-3'>
            <Nav.Link eventKey='published'>
              <i className='fi-file fs-base me-2'></i>
              Mis en location ou vente
            </Nav.Link>
          </Nav.Item>
          <Nav.Item className='mb-3'>
            <Nav.Link eventKey='drafts'>
              <i className='fi-file-clean fs-base me-2'></i>
              Brouillons
            </Nav.Link>
          </Nav.Item>
          <Nav.Item className='mb-3'>
            <Nav.Link eventKey='archived'>
              <i className='fi-archive fs-base me-2'></i>
              Mis en indisponibilité
            </Nav.Link>
          </Nav.Item>
        </Nav>

        {/* List of properties or empty state */}
        {userProperties.length ? userProperties.map((property, indx) => (
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
            dropdown={[
              {
                // href: '#', // Optionally pass href prop to convert dropdown item to Next link
                icon: 'fi-edit',
                label: 'Editer',
                props: {
                  onClick: (e) => {
                    setPropertyModal(property); 
                    handleEditPropertyModal(e);
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
            horizontal
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
      </RealEstateAccountLayout>
    </RealEstatePageLayout>
  )
}


export async function getServerSideProps(context) {
  const session = await getSession(context);
  console.log(session);
  if (!session) {
    context.res.writeHead(302, { Location: "/auth/signin" });
    context.res.end();
    return { props: {} };
  }
  const userid = session ? session.user.id : 0;
  // Fetch data from external API
  let dataAPIresponse = await fetch(`https://immoaskbetaapi.omnisoft.africa/public/api/v2?query={getUserProperties(user_id:${userid},first:10,orderBy:{column:NUO,order:DESC}){data{surface,badge_propriete{badge{badge_name,badge_image}},id,nuo,usage,offre{denomination},categorie_propriete{denomination},pays{code},piece,titre,garage,cout_mensuel,ville{denomination},wc_douche_interne,cout_vente,quartier{denomination},visuels{uri}}}}`);
  let _userProperties = await dataAPIresponse.json();

  _userProperties = _userProperties.data.getUserProperties.data;
  console.log(_userProperties);
  return { props: { _userProperties} }
}
export default AccountPropertiesPage
