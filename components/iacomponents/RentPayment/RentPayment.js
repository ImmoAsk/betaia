import { useState } from "react";
import { Card, ListGroup, Badge, Button } from "react-bootstrap";
import { API_URL } from "../../../utils/settings";
import { formatDate, formatDateToFrenchMonthYear } from "../../../utils/generalUtils";
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

const RentPayment = ({ rent_collection }) => {
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
            <Card key={rent_collection.id} className="mb-3 shadow-sm">
                {rent_collection.statut === 0 && (
                    <Card.Body>
                        Le locataire {rent_collection?.contrat?.locataire?.name} de {rent_collection?.contrat?.propriete?.categorie_propriete?.denomination} No. {rent_collection?.contrat?.propriete?.nuo} <strong>doit payer</strong>  {rent_collection?.contrat?.montant_final} XOF pour le loyer du {formatDateToFrenchMonthYear(rent_collection?.date_transaction)} au plus tard le {formatDate(rent_collection?.date_transaction)}.
                    </Card.Body>
                )}

                {rent_collection.statut === 1 && (
                    <Card.Body>
                        Le locataire {rent_collection?.contrat?.locataire?.name} de {rent_collection?.contrat?.propriete?.categorie_propriete?.denomination} No. {rent_collection?.contrat?.propriete?.nuo} <strong>a paye partiellement</strong> {rent_collection?.contrat?.montant_final} XOF pour le loyer du {formatDateToFrenchMonthYear(rent_collection?.date_paiement)} ce {formatDate(rent_collection?.date_transaction)}. Il reste un montant de <strong>{rent_collection?.contrat?.montant_final - rent_collection?.montant} XOF</strong> à payer.
                    </Card.Body>
                )}

                {rent_collection.statut === 2 && (
                    <Card.Body>
                        Le locataire <strong>{rent_collection?.contrat?.locataire?.name}</strong> du <strong>{rent_collection?.contrat?.propriete?.categorie_propriete?.denomination} N° {rent_collection?.contrat?.propriete?.nuo}</strong> a <strong>entièrement réglé</strong> la somme de <strong>{rent_collection?.contrat?.montant_final} XOF</strong> au titre du loyer du mois de <strong>{formatDateToFrenchMonthYear(rent_collection?.date_transaction)}</strong>, le <strong>{formatDate(rent_collection?.date_transaction)}</strong>.
                    </Card.Body>
                )}

                 {role === "151" && rent_collection.statut === 0 && (
                    <Card.Footer className="d-flex justify-content-center mt-3">
                        <Button
                            variant="outline-primary"
                            className="me-2 flex-grow-1"
                            onClick={handleDecline}
                        >
                            Proceder au paiement
                        </Button>
                    </Card.Footer>
                )}
            </Card>
        </div>
    );
};

export default RentPayment;
