import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import ImageLoader from "../ImageLoader";
export default function ImagesPropertySwiperSlide({ property, session }) {

    const unauthencicatedImages=[];

    if (session) {
        {
            property && property.data.propriete.visuels.map((imgproperty) => {
                
                return (
                <SwiperSlide className='d-flex'>
                    <ImageLoader className='rounded-3' src={'https://immoaskbetaapi.omnisoft.africa/public/storage/uploads/visuels/proprietes/' + imgproperty.uri} width={967} height={545} alt='Image' />
                </SwiperSlide>
                )
            })
        }
    } else {
        unauthencicatedImages[0]= property && property.data.propriete.visuels[0].uri;
        unauthencicatedImages[1]='create-account-more-images.jpg';
        
        unauthencicatedImages.map((imgproperty) => {  
            return (
            <SwiperSlide className='d-flex'>
                <ImageLoader className='rounded-3' src={'https://immoaskbetaapi.omnisoft.africa/public/storage/uploads/visuels/proprietes/' + imgproperty} width={967} height={545} alt='Image' />
            </SwiperSlide>)
        })
    }

}