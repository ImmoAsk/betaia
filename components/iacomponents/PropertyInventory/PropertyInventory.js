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
  if (!negociationOffer || !negociationOffer.id) {
    console.error("inventoryalid negotiation offer.");
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

const Propertyinventoryentory = ({ inventory }) => {
//   const { text, variant } = getBadgeProps(project?.statut);
  const { data: session } = useSession();
  const role = session?.user?.roleId;
  // Placeholder functions for the "Accept" and "Decline" buttons
  const handleAccept = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    const response = await updateNegotiation({
      negociationOffer: project,
      statut: 1,
    });
    if (response) {
      console.log("Accepted the project:", project.id);
      // Handle successful acceptance (e.g., notification, refresh)
    }
  };

  const handleDecline = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    const response = await updateNegotiation({
      negociationOffer: project,
      statut: 2,
    });
    if (response) {
      console.log("Declined the project:", project.id);
      // Handle successful decline (e.g., notification, refresh)
    }
  };

  return (
    <div className="card-hover">
      <Card key={inventory.property.id} className="mb-3 shadow-sm">
        <Card.Header className="d-flex align-items-center gap-2 bg-light">
          <img
            src={inventory.property.image_url}
            alt={inventory.property.title}
            style={{
              width: 32,
              height: 32,
              objectFit: "cover",
              borderRadius: 4,
            }}
          />
          <span className="fw-bold">{inventory.property.title}</span>
        </Card.Header>
        <Card.Body>
          <ListGroup variant="flush">
            {inventory.items.map((it) => (
              <ListGroup.Item
                key={it.id}
                className="d-flex justify-content-between align-items-center"
              >
                <span>{it.itemName}</span>
                <div className="text-end">
                  <Badge
                    bg={it.state === "good" ? "success" : "warning"}
                    className="me-2"
                  >
                    {it.state}
                  </Badge>
                  <div className="text-muted small">
                    {it.quantity} × {formatCurrency(it.value)} ={" "}
                    <strong>{formatCurrency(it.quantity * it.value)}</strong>
                  </div>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card.Body>
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

export default Propertyinventoryentory;
