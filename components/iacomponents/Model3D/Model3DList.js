import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper";
import Model3D from "./Model3D";

export default function Model3DList({propertyList}) {
  
  
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
    {propertyList.map((propertyi, indx) => (
      <SwiperSlide key={indx} className='h-auto'>
        <Model3D
          description={propertyi.description}
          image={propertyi.uri}
          className='h-100 mx-2'
        />
      </SwiperSlide>
    ))}
  </Swiper>)
  ;
}