import React from "react";
import { Card, Alert, Button } from "react-bootstrap";
import { useSession, signIn } from "next-auth/react";
import LoadingSpinner from "../LoadingSpinner";
import useOrganisation from "../../customHooks/useOrganisation";
import StarRating from "../StarRating";
import SocialButton from "../SocialButton";

export default function DetailRealEstateAgency({ user }) {
  const { data: session } = useSession();
  const {
    data: organisationData,
    isLoading,
    isError,
    error
  } = useOrganisation(user);

  if (isLoading) return <LoadingSpinner />;

  const organisation = organisationData?.organisation;

  // 🔐 If user is not logged in
  if (!session?.user) {
    return (
      <Alert variant="info" className="d-flex justify-content-between align-items-center">
        <div>
          <h6 className="mb-1">Accès réservé</h6>
          <p className="mb-0">Créez un compte ou connectez-vous pour consulter les détails de cette agence immobilière.</p>
        </div>
        <Button variant="primary" onClick={() => signIn()}>
          Se connecter
        </Button>
      </Alert>
    );
  }

  // ❌ No organisation or not approved
  if (!organisation || organisation.status !== 4) return null;

  return (
    <div className="my-4">
      <h2 className="h5">Fourni par {organisation.name_organisation}</h2>
      <Card className="card-horizontal">
        <div
          className="card-img-top bg-size-cover bg-position-center-x"
          style={{
            backgroundImage: `url(https://immoaskbetaapi.omnisoft.africa/public/storage/uploads/visuels/organisations/${organisation.logo || "immoask.png"})`
          }}
        ></div>
        <Card.Body>
          <p>{organisation.description}</p>
          <footer className="d-flex justify-content-between mt-4">
            <div className="pe-3">
              <h6 className="mb-0">{organisation.name}</h6>
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
            </div>
            <div>
              <StarRating rating="4.6" />
              <div className="text-muted fs-sm mt-1">24 avis</div>
            </div>
          </footer>
        </Card.Body>
      </Card>
    </div>
  );
}
