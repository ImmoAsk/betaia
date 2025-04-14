import { useState } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import styles from "./InventoryForm.module.css";


const properties = [
  {
    id: 1,
    title: "Villa Moderne à Lomé",
    image_url: "https://immoaskbetaapi.omnisoft.africa/public/storage/uploads/visuels/proprietes/rhfxcIo8hvLIGRMllttUj74tUhMddIxz64OdKsfM.png"
  },
  {
    id: 2,
    title: "Appartement Chic à Kara",
    image_url: "https://immoaskbetaapi.omnisoft.africa/public/storage/uploads/visuels/proprietes/rhfxcIo8hvLIGRMllttUj74tUhMddIxz64OdKsfM.png"
  },
  {
    id: 3,
    title: "Maison Traditionnelle à Aného",
    image_url: "https://immoaskbetaapi.omnisoft.africa/public/storage/uploads/visuels/proprietes/rhfxcIo8hvLIGRMllttUj74tUhMddIxz64OdKsfM.png"
  },
  {
    id: 4,
    title: "Studio Confort à Sokodé",
    image_url: "https://immoaskbetaapi.omnisoft.africa/public/storage/uploads/visuels/proprietes/rhfxcIo8hvLIGRMllttUj74tUhMddIxz64OdKsfM.png"
  },
  {
    id: 5,
    title: "Studio Confort à Sokodé",
    image_url: "https://immoaskbetaapi.omnisoft.africa/public/storage/uploads/visuels/proprietes/rhfxcIo8hvLIGRMllttUj74tUhMddIxz64OdKsfM.png"
  },
  {
    id: 6,
    title: "Studio Confort à Sokodé",
    image_url: "https://immoaskbetaapi.omnisoft.africa/public/storage/uploads/visuels/proprietes/rhfxcIo8hvLIGRMllttUj74tUhMddIxz64OdKsfM.png"
  },
  {
    id: 7,
    title: "Studio Confort à Sokodé",
    image_url: "https://immoaskbetaapi.omnisoft.africa/public/storage/uploads/visuels/proprietes/rhfxcIo8hvLIGRMllttUj74tUhMddIxz64OdKsfM.png"
  }
];

const defaultInventoryItems = ["Chaise", "Table", "Lit", "Armoire", "Canapé"];

export default function PropertyInventoryForm() {
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const [formData, setFormData] = useState({
    item: defaultInventoryItems[0],
    state: "",
    amount: 1,
    image: null
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === "file" ? files[0] : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting inventory for property:", selectedPropertyId, formData);
  };

  return (
    <Container className="my-4">
      <h2 className="mb-4">Pour quelle propriete ?</h2>
      <Row className={`${styles.horizontalScroll} mb-4`}>
        {properties.map((property) => (
          <Col xs={6} md={3} key={property.id} className="mb-3">
            <Card
              onClick={() => setSelectedPropertyId(property.id)}
              border={selectedPropertyId === property.id ? "primary" : "light"}
              className={`${styles.propertyCard} mx-2`}
            >
              <Card.Img variant="top" src={property.image_url} alt={property.title} />
              <Card.Body>
                <Card.Text className="text-center">{property.title}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {selectedPropertyId && (
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Selectionner un a un les elements a inventorier</Form.Label>
            <Form.Select
              name="item"
              value={formData.item}
              onChange={handleChange}
              required
            >
              {defaultInventoryItems.map((item, index) => (
                <option key={index} value={item}>{item}</option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>État</Form.Label>
            <Form.Select
              name="state"
              value={formData.state}
              onChange={handleChange}
              required
            >
              <option value="">Sélectionner l'état</option>
              <option value="Neuf">Neuf</option>
              <option value="Bon">Bon</option>
              <option value="Usé">Usé</option>
              <option value="Endommagé">Endommagé</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Quantité</Form.Label>
            <Form.Control
              type="number"
              name="amount"
              min="1"
              value={formData.amount}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Image</Form.Label>
            <Form.Control
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Enregistrer l'inventaire
          </Button>
        </Form>
      )}
    </Container>
  );
}

