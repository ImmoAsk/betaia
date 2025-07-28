import { useState } from "react";
import { Card } from "react-bootstrap";
import { API_URL, BASE_URL, IMAGE_URL } from "../../../utils/settings";
import { formatDate } from "../../../utils/generalUtils";
import { useSession } from "next-auth/react";

const updateNegotiation = async ({ negociationOffer, statut }) => {
  if (!negociationOffer?.id) {
    console.error("Invalid negotiation offer.");
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

    const data = await response.json();

    if (!data.data) {
      throw new Error("Failed to update negotiation.");
    }

    return data.data.updateNegotiation;
  } catch (error) {
    console.error("Error updating negotiation:", error);
    return null;
  }
};

const PropertyAccounting = ({ rent_collection }) => {
  const { data: session } = useSession();
  const role = session?.user?.roleId;

  const renderCardBody = () => {
    const { type_mouvement, source_mouvement, montant, created_at, contrat } = rent_collection;
    const prop = contrat?.propriete;
    const locataire = contrat?.locataire;

    const formattedDate = formatDate(created_at);

    switch (true) {
      case type_mouvement === "entree" && source_mouvement === "loyer":
        return (
          <Card.Body>
            Revenus locatifs de {montant} XOF collectés pour la location du bien
            ({prop?.categorie_propriete?.denomination} No. {prop?.nuo}) loué par {locataire?.name}, enregistrés le {formattedDate}.
          </Card.Body>
        );

      case type_mouvement === "sortie" && source_mouvement === "commission":
        return (
          <Card.Body>
            Frais d’assistance de {montant} XOF pour la gestion du bien
            ({prop?.categorie_propriete?.denomination} No. {prop?.nuo}), enregistrés le {formattedDate}.
          </Card.Body>
        );

      case type_mouvement === "sortie" && source_mouvement === "reparation":
        return (
          <Card.Body>
            Dépenses de réparation de {montant} XOF pour le bien
            ({prop?.categorie_propriete?.denomination} No. {prop?.nuo}), enregistrées le {formattedDate}.
          </Card.Body>
        );

      case type_mouvement === "sortie" && source_mouvement === "depot":
        return (
          <Card.Body>
            Dépôt bancaire de {montant} XOF provenant des revenus locatifs, enregistré le {formattedDate}.
          </Card.Body>
        );

      case type_mouvement === "sortie" && source_mouvement === "autre":
        return (
          <Card.Body>
            Entretien mensuel des espaces communs pour un montant de {montant} XOF, enregistré le {formattedDate}.
          </Card.Body>
        );

      default:
        return null;
    }
  };

  const renderReceiptLink = () => {
    if (rent_collection.type_mouvement === "sortie" && rent_collection.recu && role === "1200") {
      return (
        <Card.Footer>
          <a
            href={`${IMAGE_URL}/recus_encaissements/${rent_collection.recu}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline-primary btn-sm w-100"
          >
            Voir le reçu
          </a>
        </Card.Footer>
      );
    }
    return null;
  };

  return (
    <div className="card-hover">
      <Card key={rent_collection.id} className="mb-3 shadow-sm">
        {renderCardBody()}
        {renderReceiptLink()}
      </Card>
    </div>
  );
};

export default PropertyAccounting;
