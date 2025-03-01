import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import PropertyCard from "../PropertyCard";
import { Navigation, Pagination } from "swiper";

export default function RecommendPropertyList({propertyList}) {
  
  
  return (<Swiper
    modules={[Navigation, Pagination]}
    navigation={{
      prevEl: '#prevProperties',
      nextEl: '#nextProperties'
    }}
    pagination={{
      el: '#paginationProperties',
      clickable: true
    }}
    loop
    spaceBetween={8}
    breakpoints={{
      0: { slidesPerView: 1 },
      500: { slidesPerView: 2 },
      768: { slidesPerView: 3 },
      992: { slidesPerView: 4 }
    }}
    className='pt-3 pb-4 mx-n2'
  >
    {propertyList.map((propertyr, indx) => (
      <SwiperSlide key={indx} className='h-auto'>
        <PropertyCard
          href={propertyr.href}
          images={propertyr.images}
          title={propertyr.title}
          category={propertyr.category}
          location={propertyr.location}
          price={propertyr.price}
          badges={propertyr.badges}
          wishlistButton={{
            tooltip: 'Ajouter à la liste de visite',
            props: {
              onClick: () => console.log('Property added to your Wishlist!')
            }
          }}
          footer={[
            ['fi-bed', propertyr.footer[0]],
            ['fi-bath', propertyr.footer[1]],
            ['fi-car', propertyr.footer[2]]
          ]}
          className='h-100 mx-2'
        />
      </SwiperSlide>
    ))}
  </Swiper>)
  ;
}