import { useState } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import Select from "react-select";
import styles from "./InventoryForm.module.css";

const properties = [
  {
    id: 1,
    title: "Villa Moderne à Lomé",
    image_url:
      "https://immoaskbetaapi.omnisoft.africa/public/storage/uploads/visuels/proprietes/rhfxcIo8hvLIGRMllttUj74tUhMddIxz64OdKsfM.png",
  },
  {
    id: 2,
    title: "Appartement Chic à Kara",
    image_url:
      "https://immoaskbetaapi.omnisoft.africa/public/storage/uploads/visuels/proprietes/rhfxcIo8hvLIGRMllttUj74tUhMddIxz64OdKsfM.png",
  },
  {
    id: 3,
    title: "Maison Traditionnelle à Aného",
    image_url:
      "https://immoaskbetaapi.omnisoft.africa/public/storage/uploads/visuels/proprietes/rhfxcIo8hvLIGRMllttUj74tUhMddIxz64OdKsfM.png",
  },
  {
    id: 4,
    title: "Studio Confort à Sokodé",
    image_url:
      "https://immoaskbetaapi.omnisoft.africa/public/storage/uploads/visuels/proprietes/rhfxcIo8hvLIGRMllttUj74tUhMddIxz64OdKsfM.png",
  },
  {
    id: 5,
    title: "Studio Confort à Sokodé",
    image_url:
      "https://immoaskbetaapi.omnisoft.africa/public/storage/uploads/visuels/proprietes/rhfxcIo8hvLIGRMllttUj74tUhMddIxz64OdKsfM.png",
  },
  {
    id: 6,
    title: "Studio Confort à Sokodé",
    image_url:
      "https://immoaskbetaapi.omnisoft.africa/public/storage/uploads/visuels/proprietes/rhfxcIo8hvLIGRMllttUj74tUhMddIxz64OdKsfM.png",
  },
  {
    id: 7,
    title: "Studio Confort à Sokodé",
    image_url:
      "https://immoaskbetaapi.omnisoft.africa/public/storage/uploads/visuels/proprietes/rhfxcIo8hvLIGRMllttUj74tUhMddIxz64OdKsfM.png",
  },
];

const defaultInventoryItems = [
  { id: "chaise", name: "Chaise" },
  { id: "table", name: "Table" },
  { id: "lit", name: "Lit" },
  { id: "armoire", name: "Armoire" },
  { id: "canapé", name: "Canapé" },
  { id: "bureau", name: "Bureau" },
  { id: "placard", name: "Placard" },
  { id: "commode", name: "Commode" },
  { id: "étagère", name: "Étagère" },
  { id: "tabouret", name: "Tabouret" },
  { id: "pouf", name: "Pouf" },
  { id: "fauteuil", name: "Fauteuil" }, // armchair
  { id: "buffet", name: "Buffet" }, // sideboard
  { id: "coiffeuse", name: "Coiffeuse" }, // vanity/dressing table
  { id: "paravent", name: "Paravent" }, // folding screen
  { id: "guéridon", name: "Guéridon" }, // pedestal table
  { id: "console", name: "Console" }, // console table
  { id: "banquette", name: "Banquette" }, // bench seat
  { id: "bibliothèque", name: "Bibliothèque" }, // bookshelf
  { id: "secrétaire", name: "Secrétaire" }, // writing desk
  { id: "chevet", name: "Chevet" }, // bedside table
  { id: "vaisselier", name: "Vaisselier" }, // china cabinet
  { id: "penderie", name: "Penderie" }, // wardrobe
  { id: "meuble_tv", name: "Meuble TV" }, // TV stand
  { id: "table_basse", name: "Table basse" }, // coffee table
  { id: "table_chevet", name: "Table de chevet" }, // nightstand
  { id: "table_d_appoint", name: "Table d'appoint" }, // side table
  { id: "table_d_extérieur", name: "Table d'extérieur" }, // outdoor table
  { id: "chariot", name: "Chariot" }, // serving cart
  { id: "présentoir", name: "Présentoir" }, // display stand
]

const itemState = [
  {id: "good", name: "Good"},
  {id: "damaged", name: "Damaged"}
]

export default function PropertyInventoryForm({ formData, setFormData }) {
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  // const [formData, setFormData] = useState({
  //   item: defaultInventoryItems[0],
  //   state: "",
  //   quantity: 1,
  //   image: null,
  // });
  

  console.log(selectedPropertyId);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    console.log(name, type)
    setFormData({
      ...formData,
      [name]: type === "file" ? files[0] : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(
      "Submitting inventory for property:",
      selectedPropertyId,
      formData
    );
  };

  const handleCancel = () => {
    setSelectedPropertyId(null);
    setFormData({
      ...formData,
      item: "",
      state: "",
      quantity: 1,
      value: 1,
      image: null,
    });
  };

  // Prepare maintenance types for react-select format
  const inventoryItemOptions = defaultInventoryItems.map((type) => ({
    value: type.id,
    label: type.name,
  }));

  const itemStateOptions = itemState.map((state) => ({
    value: state.id,
    label: state.name,
  }));

  const selectedInventoryItem = inventoryItemOptions.find(
    (opt) => opt.value === formData.item
  );
  const selectedItemState = itemStateOptions.find((opt) => opt.value === formData.state)

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
              <Card.Img
                variant="top"
                src={property.image_url}
                alt={property.title}
              />
              <Card.Body>
                <Card.Text className="text-left">{property.title}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {selectedPropertyId && (
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>
              Selectionner un a un les elements a inventorier
            </Form.Label>
            <Select
              name="item"
              options={inventoryItemOptions}
              value={selectedInventoryItem}
              onChange={(option) =>
                setFormData({
                  ...formData,
                  item: option?.value || "",
                })
              }
              isSearchable
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>État</Form.Label>
            <Select
              name="state"
              options={itemStateOptions}
              value={selectedItemState}
              onChange={(option) =>
                setFormData({
                  ...formData,
                  state: option?.value || "",
                })
              }
              isSearchable
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Quantité</Form.Label>
            <Form.Control
              type="number"
              name="quantity"
              min="1"
              value={formData.quantity}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Current Value</Form.Label>
            <Form.Control
              type="number"
              name="value"
              min="1"
              value={formData.value}
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

          <div className="d-flex justify-content-between gap-2 mt-4">
            {/* <Button className="w-40" variant="primary" type="submit">
              Enregistrer l'inventaire
            </Button> */}
            <Button className="w-50" variant="secondary" type="button">
              Add new record
            </Button>
            <Button
              className="w-50"
              variant="outline-secondary"
              onClick={handleCancel}
            >
              Annuler
            </Button>
          </div>
        </Form>
      )}
    </Container>
  );
}
