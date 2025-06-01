import PropertyCard from "../PropertyCard";

export default function CardProperty({property}){

    return(
          <PropertyCard
            href={property.href}
            images={property.images}
            title={property.title}
            category={property.category}
            location={property.location}
            price={property.price}
            badges={property.badges}
            wishlistButton={{
              tooltip: 'Bien favori à visiter',
              props: {
                onClick: () => console.log('Property added to your Wishlist!')
              }
            }}
            footer={[
              ['fi-bed', property?.amenities[0]],
              ['fi-bath', property?.amenities[1]],
              ['fi-car', property?.amenities[2]],
            ]}
            className='h-100'
          />
      )
}