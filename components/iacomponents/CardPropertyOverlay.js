import PropertyCardOverlay from "../PropertyCardOverlay";

export default function CardPropertyOverlay({property}){

    return(
          <PropertyCardOverlay

            href={property.href}
            images={property.images}
            title={property.title}
            category={property.category}
            location={property.location}
            price={property.price}
            badges={property.badges}
            className='h-100'
            img={{
              src: '/images/tg/recent/02.jpg',
              alt: property.title
            }}
            overlay
            button={{
              href: property.href,
              title: property.price,
              variant: 'primary',
              wishlistProps: {
                onClick: () => console.log('You\'ve added Duplex with Garage property to your wishlist!')
              }
            }}

          />
      )
}