import { useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";

export default function InquiryFormModal({organisation}) {
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    date: "",
    description: "",
    image: null,
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);

    setShowModal(false);
  };

  return (
    <>
      <Button variant="primary" onClick={() => setShowModal(true)}>
        Envoyer votre demande immobilière
      </Button>

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        size="xl"
      >
        <Modal.Header closeButton>
          <Modal.Title>Soumettre une demande immobilière pour {organisation?.name_organisation}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={6}>
              <Form onSubmit={handleSubmit}>
                <Row className="mt-3">
                  <Col>
                    <Form.Group controlId="formCategory">
                      <Form.Label>Categorie</Form.Label>
                      <Form.Select
                        as="select"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Selectionner la categorie</option>
                        <option value="general">Requete generale</option>
                        <option value="location">Location immobilière</option>
                        <option value="vente">Achat immobilier</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col>
                    <Form.Group controlId="formDate">
                      <Form.Label>Date</Form.Label>
                      <Form.Control
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group controlId="formDescription" className="mt-3">
                  <Form.Label>Description </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group controlId="formImage" className="mt-3">
                  <Form.Label>
                    Une image (optionnelle) pour illiuster votre demande
                  </Form.Label>
                  <Form.Control
                    type="file"
                    name="image"
                    onChange={handleChange}
                  />
                </Form.Group>
                <div className="mt-4 text-center">
                  <Button variant="primary" type="submit">
                    Prochaine etape
                  </Button>
                </div>
              </Form>
            </Col>

            <Col md={6}>
              <div className="p-3 border rounded bg-light h-100">
                <h5 className="mb-3">Inquiry Preview</h5>
                <p>
                  <strong>Hello </strong> {formData.name}
                </p>
                <p>
                  <strong>Description:</strong> {formData.description || "N/A"}
                </p>
                <p>
                  <strong>Date Delivery</strong> {formData.date}
                </p>

                {formData.image && (
                  <div>
                    <strong>Image Preview:</strong>
                    <br />
                    <img
                      src={URL.createObjectURL(formData.image)}
                      alt="Preview"
                      style={{
                        maxWidth: "100%",
                        maxHeight: "150px",
                        marginTop: "0.5rem",
                      }}
                    />
                  </div>
                )}
              </div>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    </>
  );
}
