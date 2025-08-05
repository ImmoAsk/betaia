import { useState } from 'react';
import { Card, Badge, Button } from 'react-bootstrap';
import { formatDate } from '../../utils/generalUtils';
import { useSession, getSession } from 'next-auth/react';
import Link from 'next/link'
const getBadgeProps = (statut) => {
    switch (statut) {
        case 0:
            return { text: "Nouvelle", variant: "faded-accent" };
        case 1:
            return { text: "Acceptée", variant: "faded-accent success" };
        case 2:
            return { text: "Effectuée", variant: "faded-accent danger" };
            case 3:
                return { text: "Reportée", variant: "faded-accent danger" };
                case 4:
            return { text: "Refusée", variant: "faded-accent danger" };
        default:
            return { text: "Visite", variant: "faded-accent" };
    }
};

const updateNegotiation = async ({ negociationOffer, statut }) => {
    console.log("Update negociation statut:", negociationOffer.id, statut);
    if (!negociationOffer || !negociationOffer.id) {
        console.error("Invalid negotiation offer.");
        return null;
    }

    try {
        const response = await fetch(
            `https://immoaskbetaapi.omnisoft.africa/public/api/v2?query=mutation{updateVisitationRequest(input:{id:${Number(negociationOffer.id)},statut:${statut}}){statut}}`
        );
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const responseData = await response.json();
        if (!responseData.data) {
            throw new Error("Failed to update negotiation.");
        }

        return responseData.data.updateVisitationRequest;
    } catch (error) {
        console.error("Error updating negotiation:", error);
        return null; // Handle error state as needed
    }
};


const PropertyVisit = ({ project }) => {
    const { text, variant } = getBadgeProps(project?.statut);
    const { data: session } = useSession();
    const role = session?.user?.roleId
    console.log("RoleId: ", role)
    // Placeholder functions for the "Accept" and "Decline" buttons
    const handleAccept = async (event) => {
        event.preventDefault();
        event.stopPropagation();
        const response = await updateNegotiation({ negociationOffer: project, statut: 1 });
        if (response) {
            console.log('Accepted the project:', project.id);
            // Handle successful acceptance (e.g., notification, refresh)
        }
    };

    const handleVisitDone = async (event) => {
        event.preventDefault();
        event.stopPropagation();
        const response = await updateNegotiation({ negociationOffer: project, statut: 2 });
        if (response) {
            console.log('Accepted the project:', project.id);
            // Handle successful acceptance (e.g., notification, refresh)
        }
    };

    const handleRefusedVisit = async (event) => {
        event.preventDefault();
        event.stopPropagation();
        const response = await updateNegotiation({ negociationOffer: project, statut: 4 });
        if (response) {
            console.log('Accepted the project:', project.id);
            // Handle successful acceptance (e.g., notification, refresh)
        }
    };

    const handleReportedVisit = async (event) => {
        event.preventDefault();
        event.stopPropagation();
        const response = await updateNegotiation({ negociationOffer: project, statut: 3 });
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
                        <p className="text-nav ext-decoration-none">
                            <strong>
                                {project.fullname_visitor ? project.fullname_visitor : project.visiteur?.name}
                            </strong> {role === '1200' || role === '1233' || role === '1234' || role === '1235' && (project.telephone_visitor ? project.telephone_visitor : project.visiteur?.phone)} souhaite visiter la propriété No. {project.propriete.nuo} le <strong>{formatDate(project.date_visite)}</strong> a <strong>{project.heure_visite}</strong>
                        </p>
                    </h3>
                    <div className="fs-sm">
                        <span className="text-nowrap me-3">
                            <i className="fi-calendar text-muted me-1"></i>
                            {formatDate(project.date_visite)}
                        </span>
                    </div>

                    {/* Show Accept and Decline buttons when project.statut === 0 */}
                    {(role === '1230' || role === '1200' || role === '1233' || role === '1234' || role === '1235') && project.statut === 0 && (
                        <>
                        <div className="d-flex justify-content-center mt-3">
                            <button
                                className="btn btn-outline-secondary me-2 flex-grow-1"
                                onClick={handleReportedVisit}
                            >
                                Reporter
                            </button>
                            <button
                                className="btn btn-primary flex-grow-1"
                                onClick={handleAccept}
                            >
                                Confirmer
                            </button>
                            
                        </div>
                        <div className="d-flex justify-content-center mt-3">
                            <button
                                className="btn btn-outline-danger flex-grow-1"
                                onClick={handleRefusedVisit}
                            >
                                Refuser
                            </button>
                            
                        </div>
                        </>
                        
                        
                    )}

                    {(role === '1230' || role === '1200') && project.statut === 1 && (
                        <div className="d-flex justify-content-center mt-3">
                            <button
                                className="btn btn-outline-info me-2 flex-grow-1"
                                onClick={handleVisitDone}
                            >
                                Visite realisee
                            </button>
                        </div>
                    )}
                </Card.Body>
            </Card>
        </div>
    );
};

export default PropertyVisit;