import React from "react";
import LoadingSpinner from "../LoadingSpinner";
import useOrganisation from "../../customHooks/useOrganisation";
import { Card, Alert, Button } from "react-bootstrap";
import SocialButton from "../SocialButton";
import StarRating from "../StarRating";
import { useSession, signIn } from 'next-auth/react';

export default function ProRealEstateAgency({ user }) {
  const { data: session } = useSession();
  const {
    status,
    data: organisationData,
    error,
    isFetching,
    isLoading,
    isError,
  } = useOrganisation(user);

  if (isLoading) return <LoadingSpinner />;

  const organisation = organisationData?.organisation;
  const proName = organisationData?.name || "Kossi ADANOU";
  const proTel = organisationData?.phone || "+228 91 84 90 90";


  // ❌ No organisation or not verified (status !== 4)
  if (!organisation || organisation.status !== 4) {
    return null;
  }

  // ✅ Render verified organisation
  return (
    <>
      <h2 className="h5">Fourni par {organisation.name_organisation}</h2>
      <Card className="card-horizontal">
        <div
          className="card-img-top bg-size-cover bg-position-center-x"
          style={{
            backgroundImage: `url(https://immoaskbetaapi.omnisoft.africa/public/storage/uploads/visuels/organisations/${organisation.logo || "immoask.png"})`,
          }}
        ></div>
        <Card.Body as="blockquote" className="blockquote">
          <p>{organisation.description}</p>
          <footer className="d-flex justify-content-between">
            <div className="pe-3">
              <h6 className="mb-0">{proName}</h6>
              <div className="text-muted fw-normal fs-sm mb-3">Agence immobilière</div>

              {organisation.facebook_url && (
                <SocialButton
                  href={`https://facebook.com/${organisation.facebook_url}`}
                  variant="solid"
                  brand="facebook"
                  roundedCircle
                  className="mb-2 me-2"
                />
              )}
              {organisation.twitter_url && (
                <SocialButton
                  href={`https://x.com/${organisation.twitter_url}`}
                  variant="solid"
                  brand="twitter"
                  roundedCircle
                  className="mb-2 me-2"
                />
              )}
              {organisation.linkedin_url && (
                <SocialButton
                  href={`https://linkedin.com/company/${organisation.linkedin_url}`}
                  variant="solid"
                  brand="linkedin"
                  roundedCircle
                  className="mb-2"
                />
              )}
              <div className="text-muted fw-normal fs-sm mb-3">
                <i className="fi-phone me-2 align-middle opacity-70"></i>{" "}
                {proTel}
              </div>
            </div>
            <div>
              <StarRating rating="4.8" />
              <div className="text-muted fs-sm mt-1">24 avis</div>
            </div>
          </footer>
        </Card.Body>
      </Card>
    </>
  );
}
