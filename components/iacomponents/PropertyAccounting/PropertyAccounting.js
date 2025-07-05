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

const PropertyAccounting = ({ rent_collection }) => {
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
                {rent_collection.type_mouvement === "entree" && rent_collection.source_mouvement === "loyer" && (
                    <Card.Body>
                        Revenus locatifs de {rent_collection?.montant} XOF collectés pour la location du bien
                        ({rent_collection?.contrat?.propriete?.categorie_propriete?.denomination} No. {rent_collection?.contrat?.propriete?.nuo}), enregistrés le {formatDate(rent_collection?.created_at)}.
                    </Card.Body>
                )}

                {rent_collection.type_mouvement === "sortie" && rent_collection.source_mouvement === "commission" && (
                    <Card.Body>
                        Frais d’assistance de {rent_collection?.montant} XOF pour la gestion du bien
                        ({rent_collection?.contrat?.propriete?.categorie_propriete?.denomination} No. {rent_collection?.contrat?.propriete?.nuo}), enregistrés le {formatDate(rent_collection?.created_at)}.
                    </Card.Body>
                )}

                {rent_collection.type_mouvement === "sortie" && rent_collection.source_mouvement === "reparation" && (
                    <Card.Body>
                        Dépenses de réparation de {rent_collection?.montant} XOF pour le bien
                        ({rent_collection?.contrat?.propriete?.categorie_propriete?.denomination} No. {rent_collection?.contrat?.propriete?.nuo}), enregistrées le {formatDate(rent_collection?.created_at)}.
                    </Card.Body>
                )}

                {rent_collection.type_mouvement === "sortie" && rent_collection.source_mouvement === "autre" && (
                    <Card.Body>
                        Entretien mensuel des espaces communs pour un montant de {rent_collection?.montant} XOF, enregistré le {formatDate(rent_collection?.created_at)}.
                    </Card.Body>
                )}

            </Card>
        </div>
    );
};

export default PropertyAccounting;
