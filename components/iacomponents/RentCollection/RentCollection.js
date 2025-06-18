import { useState } from "react";
import { Card, ListGroup, Badge, Button } from "react-bootstrap";
import { API_URL } from "../../../utils/settings";
import { formatDate } from "../../../utils/generalUtils";
import { useSession } from "next-auth/react";

const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "GHS",
    }).format(amount);


const getBadgeProps = (statut) => {
    switch (statut) {
        case 0:
            return { text: "En cours", variant: "faded-accent" };
        case 1:
            return { text: "Payé", variant: "faded-accent success" };
        case 2:
            return { text: "Partiel", variant: "faded-accent danger" };
        default:
            return { text: "En cours", variant: "faded-accent" };
    }
};

const updateNegotiation = async ({ negociationOffer, statut }) => {
    console.log("Update negociation statut:", negociationOffer.id, statut);
    if (!negociationOffer || !negociationOffer.id) {
        console.error("rent_collectionalid negotiation offer.");
        return null;
    }

    try {
        const response = await fetch(
            `${API_URL}?query=mutation{updateNegotiation(input:{id:${Number(
                negociationOffer.id
            )},statut:${statut}}){statut}}`
        );
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

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

const RentCollection = ({ rent_collection }) => {
    //   const { text, variant } = getBadgeProps(rent_collection?.statut);
    const { data: session } = useSession();
    const role = session?.user?.roleId;
    // Placeholder functions for the "Accept" and "Decline" buttons
    const handleAccept = async (event) => {
        event.preventDefault();
        event.stopPropagation();
        const response = await updateNegotiation({
            negociationOffer: rent_collection,
            statut: 1,
        });
        if (response) {
            console.log("Accepted the rent_collection:", rent_collection.id);
            // Handle successful acceptance (e.g., notification, refresh)
        }
    };

    const handleDecline = async (event) => {
        event.preventDefault();
        event.stopPropagation();
        const response = await updateNegotiation({
            negociationOffer: rent_collection,
            statut: 2,
        });
        if (response) {
            console.log("Declined the rent_collection:", rent_collection.id);
            // Handle successful decline (e.g., notification, refresh)
        }
    };

    return (
        <div className="card-hover">
            <Card key={rent_collection.property.id} className="mb-3 shadow-sm">
                <Card.Header className="d-flex align-items-center gap-2 bg-light">
                    <img
                        src={rent_collection.property.image_url}
                        alt={rent_collection.property.title}
                        style={{
                            width: 32,
                            height: 32,
                            objectFit: "cover",
                            borderRadius: 4,
                        }}
                    />
                    <span className="fw-bold">{rent_collection.property.title}</span>
                </Card.Header>
                {rent_collection.statut === 0 && (
                    <Card.Body>
                    Le locataire {} de la propriété{" "} doit payer le loyer de{" "}
                    pour le mois de{" "}. 
                    </Card.Body>
                )}

                {rent_collection.statut === 1 && (
                    <Card.Body>
                    Le locataire {} de la propriété{" "} a paye partiellement le loyer de{" "}
                    pour le mois de{" "}. 
                    </Card.Body>
                )}

                {rent_collection.statut === 2 && (
                    <Card.Body>
                    Le locataire {} de la propriété{" "} a paye totalement le loyer de{" "}
                    pour le mois de{" "}. 
                    </Card.Body>
                )}
                
                {role === "1230" || role === "1200" && (
                    <Card.Footer className="d-flex justify-content-center mt-3">
                        <Button
                            variant="outline-secondary"
                            className="me-2 flex-grow-1"
                            onClick={handleDecline}
                        >
                            Decliner
                        </Button>
                        <Button
                            variant="primary"
                            className="flex-grow-1"
                            onClick={handleAccept}
                        >
                            Accepter
                        </Button>
                    </Card.Footer>
                )}
            </Card>
        </div>
    );
};

export default RentCollection;
