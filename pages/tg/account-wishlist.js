import { useState } from 'react'
import RealEstatePageLayout from '../../components/partials/RealEstatePageLayout'
import RealEstateAccountLayout from '../../components/partials/RealEstateAccountLayout'
import Link from 'next/link'
import Button from 'react-bootstrap/Button'
import PropertyCard from '../../components/PropertyCard'
import { getSession,useSession } from "next-auth/react";
const AccountWishlistPage = () => {

  // Properties array
  const initialProperties = [
    {
      href: '/tg/single-v1',
      images: [['/images/tg/catalog/16.jpg', 'Image']],
      category: 'For sale',
      title: '3-bed Apartment | 67 sq.m',
      location: '3811 Ditmars Blvd Astoria, NY 11105',
      price: '$94,000',
      badges: [['success', 'Verified'], ['info', 'New']],
      amenities: [3, 2, 2]
    },
    {
      href: '/tg/single-v1',
      images: [['/images/tg/catalog/09.jpg', 'Image']],
      category: 'For rent',
      title: 'Terra Nova Apartments | 85 sq.m',
      location: '21 India St Brooklyn, NY 11222',
      price: '$2,400',
      badges: [['success', 'Verified']],
      amenities: [5, 2, 2]
    },
    {
      href: '/tg/single-v1',
      images: [['/images/tg/catalog/19.jpg', 'Image']],
      category: 'For sale',
      title: 'Country House | 120 sq.m',
      location: '6954 Grand AveMaspeth, NY 11378',
      price: '$162,000',
      badges: [],
      amenities: [5, 3, 2]
    },
    {
      href: '/tg/single-v1',
      images: [['/images/tg/catalog/17.jpg', 'Image']],
      category: 'For rent',
      title: 'Crystal Apartment| 60 sq.m',
      location: '495 Henry St Brooklyn, NY 11231',
      price: '$1,500',
      badges: [['info', 'New']],
      amenities: [4, 1, 2]
    }
  ]

  const [properties, setProperties] = useState(initialProperties)

  const clearAll = (e) => {
    e.preventDefault()
    setProperties([])
  }

  return (
    <RealEstatePageLayout
      pageTitle='Biens immobiliers à visiter'
      activeNav='Account'
      userLoggedIn
    >
      <RealEstateAccountLayout accountPageTitle='Biens immobiliers à visiter'>
        <div className='pb-2 mb-4 d-flex align-items-center justify-content-between'>
          <h1 className='mb-0 h2'>
            Biens immobiliers à visiter
            <span className='align-middle badge bg-secondary fs-base ms-3'>{properties.length}</span>
          </h1>
          <a href='#' className='fw-bold text-decoration-none' onClick={clearAll}>
            <i className='fi-x fs-xs mt-n1 me-2'></i>
            Effacer tous
          </a>
        </div>

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
            wishlistButton={{
              tooltip: 'Remove from Wishlist',
              active: true,
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
            }}
            footer={[
              ['fi-bed', property.amenities[0]],
              ['fi-bath', property.amenities[1]],
              ['fi-car', property.amenities[2]]
            ]}
            horizontal
            className={indx === properties.length - 1 ? '' : 'mb-4' }
          />
        )) : 
            
          // Empty state
          <div className='pt-2 pb-2 text-center pt-md-4 pt-lg-5 pb-md-0'>
            <i className='mb-4 fi-heart display-6 text-muted'></i>
            <h2 className='mb-2 h5'>Vous n'avez aucun bien immobilier à visiter!</h2>
            <p className='pb-1'>Trouver dans notre catalogue immobilier des offres convenables et ajouter les à votre liste immobilière à visiter plus tard.</p>
            <Link href='/tg/catalog?category=rent' passHref>
              <Button>Consulter le catalogue</Button>
            </Link>
          </div>
        }
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
export default AccountWishlistPage
