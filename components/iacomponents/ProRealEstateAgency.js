import React from "react";
import LoadingSpinner from "../LoadingSpinner";
import useOrganisation from "../../customHooks/useOrganisation";
import { Card } from "react-bootstrap";
import SocialButton from "../SocialButton";
import StarRating from "../StarRating";
import RealEstateAgency from "./RealEstateAgency";

export default function ProRealEstateAgency({user}) {
    const { status, data:organisation, error, isFetching,isLoading,isError }  = useOrganisation(user);
    //console.log(organisation);
    
    //console.log(organisation && organisation.organisation);
    if(isLoading) return <LoadingSpinner/>

    if(organisation && organisation.organisation!=null) {return(
    <>
        <h2 className='h5'>Fourni par {organisation.organisation.name_organisation}</h2>
        <Card className='card-horizontal'>
            <div className='card-img-top bg-size-cover bg-position-center-x' style={{ backgroundImage: `url(https://immoaskbetaapi.omnisoft.africa/public/storage/uploads/visuels/organisations/${organisation.organisation.logo})` }}></div>
            <Card.Body as='blockquote' className='blockquote'>
                <p>{organisation.organisation.description}</p>
                <footer className='d-flex justify-content-between'>
                    <div className='pe3'>
                        <h6 className='mb-0'>{organisation.name}</h6>
                        <div className='text-muted fw-normal fs-sm mb-3'>Promoteur immobilier</div>
                        <SocialButton href={`https://facebook.com/${organisation.organisation.facebook_url}`} variant='solid' brand='facebook' roundedCircle className='mb-2 me-2' />
                        <SocialButton href={`https://x.com/${organisation.organisation.twitter_url}`} variant='solid' brand='twitter' roundedCircle className='mb-2 me-2' />
                        <SocialButton href={`https://linkedin.com/company/${organisation.organisation.linkedin_url}`} variant='solid' brand='linkedin' roundedCircle className='mb-2' />
                    </div>
                    <div>
                        <StarRating rating='4.8' />
                        <div className='text-muted fs-sm mt-1'>24 reviews</div>
                    </div>
                </footer>
            </Card.Body>
        </Card>
    </>
    )}
    if(!organisation || organisation.organisation===null) return (<RealEstateAgency/>)
}

