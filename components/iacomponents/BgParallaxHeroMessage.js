import { Button } from "react-bootstrap";
import dynamic from 'next/dynamic'
import React from "react";
const BgParallax = dynamic(() => import('../../components/BgParallax'), { ssr: false });


export default function BgParallaxHeroMessage({message,image,action,callAction}){
    return(
    <BgParallax
        imgSrc={image}
        type='scroll' // scale, opacity, scroll-opacity, scale-opacity
        speed={0.5} // from -1.0 to 2.0
        overlay={45} // from 0 to 100 or 'gradient' to apply gradient overlay
        contentWrapper={{
          style: {maxWidth: '856px'}
        }}
        className='card align-items-center justify-content-center border-0 p-md-5 p-4 bg-secondary overflow-hidden mt-n3'
        style={{minHeight: '65vh'}}
      >
        <h1 className='display-5 text-white text-left'>
          {message}
        </h1>
        <Button size='lg' onClick={action}>
          {callAction}
        </Button>
    </BgParallax>)
}