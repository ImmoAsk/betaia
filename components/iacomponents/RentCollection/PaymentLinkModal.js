import { useState } from "react";
import { Modal, Button, Form, Row, Col, Card } from "react-bootstrap";
import Select from "react-select";
import { useSession } from 'next-auth/react';
import { useLandLord, useLandlordContract } from "../../../customHooks/usePropertyOwner";
import { formatPropertyOwners } from "../../../utils/generalUtils";

export default function PaymentLinkModal() {
  const [showModal, setShowModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [sending, setSending] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedLandlord, setSelectedLandlord] = useState(null);
  const { data: session } = useSession();
  // Assuming session.user.id is available and contains the user ID
  const userId = selectedLandlord?.id || session?.user?.id;

  const { data: landlords } = useLandLord(1230);
  const propertyOwners = formatPropertyOwners(landlords)
  const propertyOwnerSelectedOption = propertyOwners.find((option) => option.value === selectedLandlord?.value);
  const [formData, setFormData] = useState({
    contracts: "",
    dates: [{ id: Date.now(), value: "" }],
  });
  const { data: landlord_contracts, isLoading, error } = useLandlordContract(userId);
  const resetForm = () => {
    setFormData({
      contracts: "",
      dates: [{ id: Date.now(), value: "" }],
    });
    setShowPreview(false);
    setShowModal(false);
  };

   const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      setFormData((prev) => ({ ...prev, file: files[0] }));
      return;
    }

    if (name === "contract") {
      const selectedIndex = parseInt(value, 10);
      console.log("Selected contract index:", selectedIndex);
      // Sanity check for landlord_contracts array
      if (!Array.isArray(landlord_contracts) || landlord_contracts.length === 0) {
        console.warn("No contracts available to select.");
        return;
      }

      const selectedContract = landlord_contracts[selectedIndex];
      console.log("Selected contract:", selectedContract);
      if (selectedContract) {
        const updatedFormData = {
          ...formData,
          contracts: selectedContract.id || "",
          tenant_fullname: selectedContract.tenant?.name || "",
          tenant_email: selectedContract.tenant?.email || "",
          tenant_phoneNumber: selectedContract.tenant?.phone || "",
          tenant_address: selectedContract.tenant?.address || "",
          landlord_fullname: selectedContract.landlord?.name || "",
          landlord_address: selectedContract.landlord?.address || "",
          property_location: selectedContract.property?.address || "",
          property_rent: selectedContract.amount || "",
          property_type: selectedContract.property?.category || "",
          leaseStart: selectedContract.startDate || "",
          leaseEnd: selectedContract.endDate || "",
          property_image: "/images/default-property.jpg",
        };

        setFormData(updatedFormData);
        console.log("✅ Form data updated with selected contract:", updatedFormData);
      } else {
        console.warn("⚠️ No contract found for index:", selectedIndex);
      }

      return;
    }

    // Default update
    setFormData((prev) => ({ ...prev, [name]: value }));
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

  const totalRent = () => {
    const rent = parseFloat(formData.property_rent || 0);
    const numberOfDates = formData.dates.filter((d) => d.value).length;
    return rent * numberOfDates;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowPreview(true);
  };

  const sendEmail = async () => {
    setSending(true);

    try {
      const res = await fetch("/api/sendPaymentLinkEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenant_fullname: formData.tenant_fullname,
          dates: formData.dates,
          tenant_email: formData.tenant_email,
          landlord_fullname: formData.landlord_fullname,
          landlord_address: formData.landlord_address,
          monthlyRent: formData.property_rent,
          landlord_phoneNumber: formData.landlord_phoneNumber,
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
      console.error("Échec de l'envoi de l'e-mail:", err.message);
      alert(`Échec de l'envoi de l'e-mail: ${err.message}`);
    } finally {
      setSending(false);
    }
  };

  const sendWhatsAppMessage = async () => {
    try {
      const res = await fetch("/api/sendWhatsApp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenant_fullname: formData.tenant_fullname,
          tenant_phoneNumber: formData.tenant_phoneNumber,
          dates: formData.dates,
          property_rent: formData.property_rent,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Échec de l'envoi WhatsApp");
      alert("Message WhatsApp envoyé avec succès !");
    } catch (err) {
      alert(`Erreur lors de l'envoi du message WhatsApp: ${err.message}`);
    }
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
        Créer un rappel de paiement
      </a>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Créer un lien de paiement</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={6}>
              <Form onSubmit={handleSubmit}>

                {session?.user?.roleId === "1200" && (
                  <Form.Group className="mb-4 mt-2">
                    <Form.Label>Qui est le propriétaire ou le gestionnaire immobilier ?</Form.Label>
                    <Select
                      name="selectedLandlord"
                      value={propertyOwnerSelectedOption}
                      onChange={(landlord) => {
                        setSelectedLandlord(landlord);
                        console.log(landlord);
                      }}
                      options={propertyOwners}
                      isSearchable
                      isClearable
                      placeholder="Sélectionnez le propriétaire ou le gestionnaire immobilier"
                      className={`react-select-container ${selectedLandlord?.id === propertyOwnerSelectedOption?.value ? "border-primary" : ""}`}
                      classNamePrefix="react-select"
                    />
                  </Form.Group>
                )}
                <Form.Group className="mt-3">
                  <Form.Label>Sélectionner un contrat de location</Form.Label>
                  <Form.Select
                    name="contract"
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled selected>
                      Choisir un contrat
                    </option>
                    {Array.isArray(landlord_contracts) && landlord_contracts.map((contract, index) => (
                      <option key={contract.id} value={index}>
                        {contract.tenant?.name || "Locataire inconnu"} | {contract.property?.address || "Adresse indisponible"} | {contract.startDate || "Date inconnue"} → {contract.endDate || "…"} | {contract.amount || "0"} XOF/mois
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                {formData.contracts !== "" && landlord_contracts[parseInt(formData.contracts, 10)] && (
                  <div className="mt-4 d-flex gap-3">
                    <Card>
                      <Card.Body>
                        <Card.Title>Sur le logement</Card.Title>
                        <ul className="list-unstyled">
                          <li><strong>Loyer :</strong> {formData.property_rent} CFA</li>
                          <li><strong>Type :</strong> {formData.property_type}</li>
                          <li><strong>Emplacement :</strong> {formData.property_location}</li>
                          <li><strong>Début du bail :</strong> {formData.leaseStart}</li>
                        </ul>
                      </Card.Body>
                    </Card>

                    <Card>
                      <Card.Body>
                        <Card.Title>Sur le locataire</Card.Title>
                        <ul className="list-unstyled">
                          <li><strong>Nom :</strong> {formData.tenant_fullname}</li>
                          <li><strong>Téléphone :</strong> {formData.tenant_phoneNumber}</li>
                          <li><strong>Adresse :</strong> {formData.property_location}</li>
                          <li><strong>Email :</strong> {formData.tenant_email}</li>
                        </ul>

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
              <h5 className="mb-3">Aperçu du rappelde paiement</h5>
              <p><strong>Bonjour {formData.tenant_fullname},</strong></p>
              <p>
                Ceci est un rappel qu’un montant de <strong>{totalRent()} CFA</strong> est dû pour le(s) mois suivant(s) :
                <strong> {formatDatesList(formData.dates)}</strong>
              </p>
              <p>
                Merci de visiter immoask.com pour régler cette somme ou contacter votre gestionnaire immobilier
              </p>
              <p>Merci.</p>

              <div className="mt-4">
                <Button
                  variant="primary"
                  className="w-100"
                  onClick={async () => {
                    setSending(true);
                    let emailSuccess = false;
                    let whatsappSuccess = false;

                    try {
                      await sendEmail();
                      emailSuccess = true;
                    } catch (error) {
                      console.error("Échec de l'envoi de l'e-mail:", error.message);
                      alert("Échec de l'envoi de l'e-mail.");
                    }

                    try {
                      await sendWhatsAppMessage();
                      whatsappSuccess = true;
                    } catch (error) {
                      console.error("Échec de l'envoi WhatsApp:", error.message);
                      alert("Échec de l'envoi du message WhatsApp.");
                    }

                    setSending(false);

                    if (emailSuccess && whatsappSuccess) {
                      setShowSuccessModal(true);
                      setTimeout(() => setShowSuccessModal(false), 1500);
                      resetForm();
                    } else if (emailSuccess) {
                      alert("E-mail envoyé, mais WhatsApp a échoué.");
                    } else if (whatsappSuccess) {
                      alert("WhatsApp envoyé, mais e-mail a échoué.");
                    } else {
                      alert("Échec de l'envoi des deux messages.");
                    }
                  }}
                  disabled={sending}
                >
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
        <Modal.Title>E-mail envoyé</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>L’e-mail a été envoyé avec succès</p>
        <Button variant="primary" onClick={() => setShowSuccessModal(false)}>
          Fermer
        </Button>
      </Modal.Body>
    </Modal>
  </>);
}