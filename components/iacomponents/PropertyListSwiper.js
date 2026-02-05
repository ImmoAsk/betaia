import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import PropertySlideCard from "./PropertySlideCard";
import { Navigation } from "swiper/modules";

export function PropertyListSwiper({ propertyList }) {
    // Desactiver loop si pas assez de slides (besoin de plus que slidesPerView)
    const enableLoop = propertyList && propertyList.length > 2;
    
    if (!propertyList || propertyList.length === 0) {
        return <p className="text-muted">Aucun bien immobilier disponible.</p>;
    }
    
    return (<Swiper
        modules={[Navigation]}
        navigation={{
            prevEl: '#prevProprties',
            nextEl: '#nextProprties'
        }}
        loop={enableLoop}
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