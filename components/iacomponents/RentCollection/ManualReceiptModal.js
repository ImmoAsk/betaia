import { useState } from "react";
import { Modal, Button, Form, Row, Col, Card } from "react-bootstrap";
import contracts from "./PropertyContract.json";
import axios from "axios";
import { API_URL } from "../../../utils/settings";

export default function ManualReceiptModal() {
  const [showModal, setShowModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [sending, setSending] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [formData, setFormData] = useState({
    contracts: "",
    dates: [{ id: Date.now(), value: "" }],
    file: null,
  });

  const resetForm = () => {
    setFormData({
      contracts: "",
      dates: [{ id: Date.now(), value: "" }],
      file: null,
    });
    setShowPreview(false);
    setShowModal(false);
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      setFormData((prev) => ({ ...prev, file: files[0] }));
    } else if (name === "contract") {
      const selectedIndex = parseInt(value, 10);
      const selectedContract = contracts[selectedIndex];

      if (selectedContract) {
        setFormData((prev) => ({
          ...prev,
          contracts: value,
          tenant_fullname: selectedContract.tenant_fullname,
          tenant_email: selectedContract.tenant_email,
          tenant_phoneNumber: selectedContract.tenant_phoneNumber,
          tenant_address: selectedContract.tenant_address,
          landlord_fullname: selectedContract.landlord_fullname,
          landlord_address: selectedContract.landlord_address,
          property_location: selectedContract.property_location,
          property_rent: selectedContract.property_rent,
          property_type: selectedContract.property_type,
          leaseStart: selectedContract.leaseStart,
          leaseEnd: selectedContract.leaseEnd,
          property_image: selectedContract.property_image,
        }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleDateChange = (id, value) => {
    const updatedDates = formData.dates.map((date) =>
      date.id === id ? { ...date, value } : date
    );
    setFormData((prev) => ({
      ...prev,
      dates: updatedDates,
    }));
  };

  const formatDatesList = (datesArray) => {
    const values = datesArray.map((d) => d.value).filter(Boolean);
    if (values.length === 0) return "N/A";
    if (values.length === 1) return values[0];
    if (values.length === 2) return `${values[0]} et ${values[1]}`;
    return `${values.slice(0, -1).join(", ")} et ${values[values.length - 1]}`;
  };

  const addDateField = () => {
    setFormData((prev) => ({
      ...prev,
      dates: [...prev.dates, { id: Date.now(), value: "" }],
    }));
  };

  const removeDateField = (id) => {
    const updatedDates = formData.dates.filter((date) => date.id !== id);
    setFormData((prev) => ({
      ...prev,
      dates: updatedDates,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form data submitted:", formData);
    setShowPreview(true);
  };

  const sendEmail = () => {
    if (!formData.file) {
      alert("Veuillez télécharger un fichier");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = async () => {
      const base64File = reader.result;
      setSending(true);
      const formData = new FormData();
      const encaissementPayload = {
        user_id: Number(property.id),
        dates_paiement: formData.dates.map((date) => date.value).join(', '),
        recu: null,
        contrat_id: Number(formData.contracts),
      };
      //console.log(propertyPayload);
      //alert(propertyPayload);
      formData.append(
        'operations',
        JSON.stringify({
          query: 'mutation ManualRentCollection($data: EncaissementInput!) { createEncaissement(input: $data) }',
          variables: { data: encaissementPayload },
        })
      );

      let appendMap = '';
      formData.append(`0`, formData.file);
      appendMap += `"0":["variables.data.recu.0"]`;
      formData.append('map', `{${appendMap}}`);
      try {
        const response = await axios.post(API_URL, formData, {
          headers: { 'Content-Type': 'application/json' }
        });
        if (response.data?.data?.createEncaissement !== null) {
          console.log("Les encaissements ont ete pris en compte avec succes.");
        }
      } catch (error) {
        console.error("Error during disponibilite:", error);
      }

      setValidated(true);
    
    try {
      const res = await fetch("/api/sendEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenant_fullname: formData.tenant_fullname,
          dates: formData.dates,
          tenant_email: formData.tenant_email,
          landlord_fullname: formData.landlord_fullname,
          landlord_address: formData.landlord_address,
          fileName: formData.file.name,
          fileBase64: base64File,
          fileType: formData.file.type,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur inconnue");
      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
      }, 1500);

      resetForm();
    } catch (err) {
      console.error("Échec de l'envoi de l'email:", err.message);
      alert(`Échec de l'envoi de l'email : ${err.message}`);
    } finally {
      setSending(false);
    }
  };

  reader.readAsDataURL(formData.file);
};

return (
  <>
    <a
      href="#"
      className="fw-bold text-decoration-none"
      onClick={() => {
        setShowModal(true);
        setShowPreview(false);
      }}
    >
      <i className="fi-cash mt-n1 me-2"></i>
      Ajouter un encaissement
    </a>

    <Modal show={showModal} onHide={() => setShowModal(false)} centered size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Ajouter un encaissement</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col md={6}>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mt-3">
                <Form.Label>Sélectionner un contrat de location</Form.Label>
                <Form.Select
                  name="contract"
                  value={formData.contracts}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Choisir un contrat
                  </option>
                  {contracts.map((contract, index) => (
                    <option key={index} value={index.toString()}>
                      {contract.tenant_fullname} | {contract.property_location} | {contract.leaseStart} → {contract.leaseEnd}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              {formData.contracts !== "" && contracts[parseInt(formData.contracts, 10)] && (
                <div className="mt-4 d-flex gap-3">
                  <Card style={{ width: "45%", height: "50vh" }}>
                    <Card.Img
                      variant="top"
                      src={formData.property_image}
                      alt={formData.property_description}
                      style={{ height: "120px", objectFit: "cover" }}
                    />
                    <Card.Body>
                      <ul className="list-unstyled">
                        <li><strong>Loyer :</strong> {formData.property_rent} CFA</li>
                        <li><strong>Type :</strong> {formData.property_type}</li>
                        <li><strong>Emplacement :</strong> {formData.property_location}</li>
                        <li><strong>Début du bail :</strong> {formData.leaseStart}</li>
                      </ul>
                    </Card.Body>
                  </Card>

                  <Card style={{ width: "45%", height: "50vh" }}>
                    <Card.Body>
                      <Card.Title>Informations du locataire</Card.Title>
                      <Card.Text><strong>Nom :</strong> {formData.tenant_fullname}</Card.Text>
                      <Card.Text><strong>Téléphone :</strong> {formData.tenant_phoneNumber}</Card.Text>
                      <Card.Text><strong>Adresse :</strong> {formData.tenant_address}</Card.Text>
                      <Card.Text><strong>Email :</strong> {formData.tenant_email}</Card.Text>
                    </Card.Body>
                  </Card>
                </div>
              )}

              <Form.Group className="mt-4">
                <Form.Label>Date(s) de paiement</Form.Label>
                {formData.dates.map((date) => (
                  <div key={date.id} className="d-flex align-items-center mb-2">
                    <Form.Control
                      type="date"
                      value={date.value}
                      onChange={(e) => handleDateChange(date.id, e.target.value)}
                      required
                    />
                    {formData.dates.length > 1 && (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => removeDateField(date.id)}
                        className="ms-2"
                      >
                        Supprimer
                      </Button>
                    )}
                  </div>
                ))}
                <Button variant="secondary" size="sm" onClick={addDateField} className="mt-2">
                  Ajouter une date
                </Button>
              </Form.Group>

              <Form.Group className="mt-3">
                <Form.Label>Télécharger un reçu (PDF ou image)</Form.Label>
                <Form.Control
                  type="file"
                  name="file"
                  onChange={handleChange}
                  accept=".pdf,image/*"
                />
              </Form.Group>

              <Row className="mt-4 text-center">
                <Col>
                  <Button variant="primary" type="submit" className="w-100">
                    Créer
                  </Button>
                </Col>
                <Col>
                  <Button variant="secondary" onClick={() => setShowModal(false)} className="w-100">
                    Annuler
                  </Button>
                </Col>
              </Row>
            </Form>
          </Col>

          {showPreview && (
            <Col md={6}>
              <div className="p-3 border rounded bg-light h-100">
                <h5 className="mb-3">Aperçu du reçu</h5>
                <p><strong>Bonjour {formData.tenant_fullname},</strong></p>
                <p>Votre paiement de loyer pour les dates <strong>{formatDatesList(formData.dates)}</strong> a bien été ajouté dans notre système.</p>
                <p>Une copie du reçu est jointe à cet email.</p>
                <p>Merci pour votre confiance.</p>

                {formData.file && (
                  <div className="mt-3">
                    <strong>Fichier téléchargé :</strong>
                    <p>{formData.file.name}</p>
                  </div>
                )}

                <div className="mt-4 text-center">
                  <Button variant="primary" onClick={sendEmail} disabled={sending}>
                    {sending ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Envoi en cours...
                      </>
                    ) : (
                      "Envoyer"
                    )}
                  </Button>
                </div>
              </div>
            </Col>
          )}
        </Row>
      </Modal.Body>
    </Modal>

    <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>Email envoyé</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>L'email a été envoyé avec succès.</p>
        <Button variant="primary" onClick={() => setShowSuccessModal(false)}>
          Fermer
        </Button>
      </Modal.Body>
    </Modal>
  </>
);
}
