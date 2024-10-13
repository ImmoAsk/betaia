import { useState } from 'react';
import { Card, Badge, Button } from 'react-bootstrap';
import { formatDate } from '../../utils/generalUtils';

const getBadgeProps = (statut) => {
    switch (statut) {
        case 0:
            return { text: "Nouvelle", variant: "faded-accent" };
        case 1:
            return { text: "Acceptée", variant: "faded-accent success" };
        case 2:
            return { text: "Refusée", variant: "faded-accent danger" };
        default:
            return { text: "Negociation", variant: "faded-accent" };
    }
};

const updateNegotiation = async ({ negociationOffer, statut }) => {
    console.log("Update negociation statut:", negociationOffer.id, statut);
    try {
        const response = await fetch(
            `https://immoaskbetaapi.omnisoft.africa/public/api/v2?query=mutation{updateNegotiation(input:{id:${Number(negociationOffer.id)},statut:${statut}}){statut}}`
        );
        const responseData = await response.json();
        if (!responseData.data) {
            throw new Error("Failed to update negotiation.");
        }
        return responseData.data.updateNegotiation;
    } catch (error) {
        console.error("Error updating negotiation:", error);
        return null; // Handle error state as needed
    }
};

const RentingNegotiationOffer = ({ project }) => {
    const { text, variant } = getBadgeProps(project.statut);

    // Placeholder functions for the "Accept" and "Decline" buttons
    const handleAccept = async (event) => {
        event.preventDefault();
        const response = await updateNegotiation({ negociationOffer: project, statut: 1 });
        if (response) {
            console.log('Accepted the project:', project.id);
            // Handle successful acceptance (e.g., notification, refresh)
        }
    };

    const handleDecline = async (event) => {
        event.preventDefault();
        const response = await updateNegotiation({ negociationOffer: project, statut: 2 });
        if (response) {
            console.log('Declined the project:', project.id);
            // Handle successful decline (e.g., notification, refresh)
        }
    };

    return (
        <div className="pb-2">
            <Card className="bg-secondary card-hover">
                <Card.Body>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                        <div className="d-flex align-items-center">
                            <Badge bg={variant} className="rounded-pill fs-sm ms-2">{text}</Badge>
                        </div>
                    </div>
                    <h3 className="h6 card-title pt-1 mb-3">
                        <p className="text-nav stretched-link text-decoration-none">
                            Le locataire <strong>{project.fullname_negociateur}</strong> souhaite négocier la propriété
                            pour un montant de <strong>{project.montant}</strong>
                        </p>
                    </h3>
                    <div className="fs-sm">
                        <span className="text-nowrap me-3">
                            <i className="fi-calendar text-muted me-1"></i>
                            {formatDate(project.date_negociation)}
                        </span>
                    </div>

                    {/* Show Accept and Decline buttons when project.statut === 0 */}
                    {project.statut === 0 && (
                        <div className="d-flex justify-content-center mt-3">
                            <Button
                                as='a'
                                variant="outline-secondary"
                                className="me-2 flex-grow-1"
                                onClick={(e) => handleDecline(e)}
                            >

                                Decliner l'offre
                            </Button>
                            <Button
                                as='a'
                                variant="primary"
                                className="flex-grow-1"
                                onClick={(e) => handleAccept(e)}
                            >
                                Accepter l'offre
                            </Button>
                        </div>
                    )}
                </Card.Body>
            </Card>
        </div>
    );
};

export default RentingNegotiationOffer;