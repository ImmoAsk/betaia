import { useState } from 'react'
import RealEstatePageLayout from '../../components/partials/RealEstatePageLayout'
import RealEstateAccountLayout from '../../components/partials/RealEstateAccountLayout'
import Link from 'next/link'
import Nav from 'react-bootstrap/Nav'
import Button from 'react-bootstrap/Button'
import PropertyCard from '../../components/PropertyCard'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import getPropertyFullUrl from '../../utils/getPropertyFullURL'
import getFirstImageArray from '../../utils/formatFirsImageArray'
import buildPropertyBadge from '../../utils/buildPropertyBadge'
import { useSession,getSession } from 'next-auth/react'

const AccountTenantPaymentsPage = () => {

  // Properties array

  const [properties, setProperties] = useState([]);
  
  const { data: session } = useSession();
  const user_id = session ? session.user.id :0;
  useQuery(["RTProperties"],
  ()=> axios.get(`https://immoaskbetaapi.omnisoft.africa/public/api/v2?query={getUserProperties(user_id:${user_id},first:5){data{surface,badge_propriete{badge{badge_name,badge_image}},id,nuo,usage,offre{denomination},categorie_propriete{denomination},pays{code},piece,titre,garage,cout_mensuel,ville{denomination},wc_douche_interne,cout_vente,quartier{denomination},visuels{uri}}}}`).
  then((res)=>{
    setProperties(res.data.data.getUserProperties.data.map((property) =>{
      return {
        href: getPropertyFullUrl(property.pays.code,property.offre.denomination,property.categorie_propriete.denomination,property.ville.denomination,property.quartier.denomination,property.nuo),
        images: getFirstImageArray(property.visuels),
        title: 'N°'+property.nuo+': '+property.categorie_propriete.denomination+' à '+property.offre.denomination+' | '+property.surface+'m²',
        category: property.usage,
        location: property.quartier.denomination+", "+property.ville.denomination,
        price: property.cout_mensuel==0 ? property.cout_vente +" XOF":property.cout_mensuel+" XOF",
        badges: buildPropertyBadge(property.badge_propriete),
        amenities: [property.piece, property.wc_douche_interne, property.garage]
      }
    }));
  }));
  console.log(properties);
  const deleteAll = (e) => {
    e.preventDefault()
    setProperties([])
  }

  return (
    <RealEstatePageLayout
      pageTitle='Assurance immobilière'
      activeNav='Account'
      userLoggedIn={session ? true : false}
    >
      <RealEstateAccountLayout accountPageTitle='Assurance immobilière'>
        <div className='d-flex align-items-center justify-content-between mb-3'>
          <h1 className='h2 mb-0'>Etat de paiements de loyers mensuels</h1>
          <a href='#' className='fw-bold text-decoration-none' onClick={deleteAll}>
            <i className='fi-trash mt-n1 me-2'></i>
            Delete all
          </a>
        </div>
        <p className='pt-1 mb-4'>Consulter ici tout ce qui concerne mes paiements de loyer</p>

        {/* Nav tabs */}
        <Nav
          variant='tabs'
          defaultActiveKey='published'
          className='border-bottom mb-4'
        >
          <Nav.Item className='mb-3'>
            <Nav.Link eventKey='published'>
              <i className='fi-file fs-base me-2'></i>
              Paiements de loyers à jour
            </Nav.Link>
          </Nav.Item>
          <Nav.Item className='mb-3'>
            <Nav.Link eventKey='drafts'>
              <i className='fi-file-clean fs-base me-2'></i>
              Paiements de loyer en retard
            </Nav.Link>
          </Nav.Item>
        </Nav>

        {/* List of properties or empty state */}
        {properties.length ? properties.map((property, indx) => (
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
                props: {onClick: () => console.log('Edit property')}
              },
              {
                icon: 'fi-flame',
                label: 'Promouvoir',
                props: {onClick: () => console.log('Promote property')}
              },
              {
                icon: 'fi-power',
                label: 'Rendre invisible',
                props: {onClick: () => console.log('Deactivate property')}
              },
              {
                icon: 'fi-trash',
                label: 'Rendre indisponible',
                props: {
                  'data-index': indx,
                  onClick:  (e) => {
                    let index = e.currentTarget.dataset.index
                    let newProperties = [...properties]
                    if (index !== -1) {
                      newProperties.splice(index, 1)
                      setProperties(newProperties)
                    }
                  }
                }
              }
            ]}
            horizontal
            className={indx === properties.length - 1 ? '' : 'mb-4' }
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
  if (!session) {
    context.res.writeHead(302, { Location: "/auth/signin" });
    context.res.end();
    return { props: {} };
  }
  return { props: { session } };
}
export default AccountTenantPaymentsPage
