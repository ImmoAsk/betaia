import React from "react";
import LoadingSpinner from "../LoadingSpinner";
import useOrganisation from "../../customHooks/useOrganisation";
import { Card } from "react-bootstrap";
import SocialButton from "../SocialButton";
import StarRating from "../StarRating";

export default function RealEstateAgency() {
    //const { status, data:organisation, error, isFetching,isLoading,isError }  = useOrganisation(user);
    //console.log(organisation);
    const organisation={
        facebook_url:"immoask",
        name_organisation:"ACB Immobilier SARL",
        twitter_url:"immoask",
        linkedin_url:"immoask",
        logo:"acbimmo.png",
        name:"Kossi ADANOU",
        description:"Depuis 2016, ACB Immobilier accompagne dans la location de logements, l'achat de biens immobilier, le placement d'un investissement immobilier, la gestion immobilière complète"
    }
    // if(isLoading) return <LoadingSpinner/>
    return(
    <>
        <h2 className='h5'>En partenariat avec {organisation.name_organisation}</h2>
        <Card className='card-horizontal'>
            <div className='card-img-top bg-size-cover bg-position-center-x' style={{ backgroundImage: `url(https://immoaskbetaapi.omnisoft.africa/public/storage/uploads/visuels/organisations/${organisation.logo})` }}></div>
            <Card.Body as='blockquote' className='blockquote'>
                <p>{organisation.description}</p>
                <footer className='d-flex justify-content-between'>
                    <div className='pe3'>
                        <h6 className='mb-0'>{organisation.name}</h6>
                        <div className='text-muted fw-normal fs-sm mb-3'>Expert immobilier</div>
                        <SocialButton href={`https://facebook.com/${organisation.facebook_url}`} variant='solid' brand='facebook' roundedCircle className='mb-2 me-2' />
                        <SocialButton href={`https://x.com/${organisation.twitter_url}`} variant='solid' brand='twitter' roundedCircle className='mb-2 me-2' />
                        <SocialButton href={`https://linkedin.com/company/${organisation.linkedin_url}`} variant='solid' brand='linkedin' roundedCircle className='mb-2' />
                    </div>
                    <div>
                        <StarRating rating='4.8' />
                        <div className='text-muted fs-sm mt-1'>1500 avis</div>
                    </div>
                </footer>
            </Card.Body>
        </Card>
    </>)
}

