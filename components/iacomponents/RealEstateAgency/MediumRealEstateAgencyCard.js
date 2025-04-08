import React from "react";
import { Card } from "react-bootstrap";
import useOrganisation from "../../../customHooks/useOrganisation";
import LoadingSpinner from "../../LoadingSpinner";


export default function MediumRealEstateAgencyCard({ user }) {
    const { status, data: organisation, error, isFetching, isLoading, isError } = useOrganisation(user);
    if (isLoading) return <LoadingSpinner />
    if (organisation && organisation.organisation != null && organisation.organisation.name_organisation === "ACB Immobilier SARL") {
        return (
            <>
            </>
        )
    }

    if (organisation && organisation.organisation != null && organisation.organisation.name_organisation!= "ACB Immobilier SARL") {
        return (
            <>
                <div className='pe3'>
                    <h6 className='mb-0'>{organisation.organisation.name_organisation}</h6>
                </div>

            </>
        )
    }
    if (!organisation || organisation.organisation === null) return (<></>)
}

