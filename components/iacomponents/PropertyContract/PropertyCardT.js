import { Card } from "react-bootstrap";

export default function PropertyCardT({ property, onSelect, selected }) {
  return (
    <Card
      className={`h-50 ${selected ? "border-primary" : ""}`}
      style={{ cursor: "pointer" }}
      onClick={() => onSelect(property)}
    >
      <Card.Img
        variant="top"
        src={property.property_image}
        alt={property.property_description}
      />
      <Card.Body>
        <Card.Title>{property.property_type}</Card.Title>
        <Card.Text>{property.property_description}</Card.Text>
        <ul className="list-unstyled">
          <li>
            <strong>Rent:</strong> {property.property_rent.toLocaleString()} CFA
          </li>
          <li>
            <strong>Offer:</strong> {property.property_offer}
          </li>
          <li>
            <strong>Location:</strong> {property.property_location}
          </li>
        </ul>
      </Card.Body>
    </Card>
  );
}
