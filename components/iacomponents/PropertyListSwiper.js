import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import PropertySlideCard from "./PropertySlideCard";
import { Navigation } from "swiper";

export function PropertyListSwiper({ propertyList }) {
    return (<Swiper
                modules={[Navigation]}
                navigation={{
                    prevEl: '#prevProprties',
                    nextEl: '#nextProprties'
                }}
                loop
                spaceBetween={24}
                breakpoints={{
                    0: { slidesPerView: 1 },
                    1320: { slidesPerView: 2 }
                }}
            >
            {
                propertyList.map((property, indx) => (
                    <SwiperSlide key={indx}>
                        <PropertySlideCard property={property} />
                    </SwiperSlide>
                ))
            }
    </Swiper>
)
}