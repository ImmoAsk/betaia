import { useState } from "react";
import { Modal, Button, Form, Row, Col, Card } from "react-bootstrap";
import axios from "axios";
import Select from "react-select";
import { API_URL } from "../../../utils/settings";
import { useSession } from 'next-auth/react';
import { useLandLord, useLandlordContract } from "../../../customHooks/usePropertyOwner";
import { formatPropertyOwners } from "../../../utils/generalUtils";
import { set } from "nprogress";
export default function ManualExitMovementModal() {
  const [showModal, setShowModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [sending, setSending] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedLandlord, setSelectedLandlord] = useState(null);
  const [selectedSourceMouvementLabel, setSelectedSourceMouvementLabel] = useState("");
  const { data: session } = useSession();
  // Assuming session.user.id is available and contains the user ID
  const userId = selectedLandlord?.id || session?.user?.id;

  const { data: landlords } = useLandLord(1230);
  const propertyOwners = formatPropertyOwners(landlords)
  const propertyOwnerSelectedOption = propertyOwners.find((option) => option.value === selectedLandlord?.value);
  const [formData, setFormData] = useState({
    contracts: "",
    dates: [{ id: Date.now(), value: "" }],
    file: null,
  });
  const { data: landlord_contracts, isLoading, error } = useLandlordContract(userId);
  const resetForm = () => {
    setFormData({
      contracts: "",
      dates: [{ id: Date.now(), value: "" }],
      file: null,
    });
    setShowPreview(false);
    setShowModal(false);
  };

  const handleSelectedLabelChange = (e) => {
    const selectedText = e.target.options[e.target.selectedIndex].text;
    setSelectedSourceMouvementLabel(selectedText);
    setFormData((prev) => ({
      ...prev,
      source_mouvement: e.target.value,
    }));
    console.log("Selected source mouvement value:", e.target.value);
    console.log("Selected source mouvement label:", selectedText);
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
        console.log("Selected contract landlord email:", selectedContract.landlord?.email);
        const updatedFormData = {
          ...formData,
          contracts: selectedContract.id || "",
          tenant_fullname: selectedContract.tenant?.name || "",
          tenant_email: selectedContract.landlord?.email || "kossi@omnisoft.africa",
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

        setFormData((prev) => ({
              ...prev,
              landlord_fullname: propertyOwnerSelectedOption.fullName || "",
              tenant_email: propertyOwnerSelectedOption.ownerEmail || "kossi@omnisoft.africa",
              tenant_phoneNumber: propertyOwnerSelectedOption.phone || "",
            }));
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
      const sendingFormData = new FormData();
      const mouvementPayload = {
        proprietaire_id: Number(userId || 1), // Assuming session.user.id is available
        propriete_id: null, // Assuming no property is selected
        description: `Mouvement de sortie de ${selectedSourceMouvementLabel} de ${formData.amount} CFA pour ${formatDatesList(formData.dates)}`,
        montant: Number(formData.amount),
        type_mouvement: formData.source_mouvement === "depot" ? "bilan" : "sortie",
        source_mouvement: formData.source_mouvement,
        date_paiement: formData.dates[0].value,
        recu: null,
        contrat_id: Number(formData.contracts),
      };
      //console.log(propertyPayload);
      //alert(propertyPayload);
      sendingFormData.append(
        'operations',
        JSON.stringify({
          query: 'mutation ManualMouvementSortie($data: Mouvement_comptableInput!) { createMouvement(input: $data) { id } }',
          variables: { data: mouvementPayload },
        })
      );

      let appendMap = '';
      sendingFormData.append(`0`, formData.file);
      appendMap += `"0":["variables.data.recu"]`;
      sendingFormData.append('map', `{${appendMap}}`);
      console.log("Sending form data as JSON:", JSON.stringify(sendingFormData));
      try {
        const response = await axios.post(API_URL, sendingFormData, {
          headers: { 'Content-Type': 'application/json' }
        });
        if (response.data?.data?.createMouvement !== null) {
          console.log("Le mouvement de sortie a ete pris en compte avec succes.");
        }
      } catch (error) {
        console.error("Une erreur lors de l'enregistrement du mouvement:", error);
      }

      try {
        const res = await fetch("/api/sendMouvementSortieEmail", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            landlord_fullname: formData.landlord_fullname,
            dates: formData.dates,
            tenant_email: formData.tenant_email,
            source_mouvement: selectedSourceMouvementLabel,
            montant_mouvement: formData.amount,
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
        Ajouter un mouvement de sortie
      </a>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Ajouter un mouvement de sortie</Modal.Title>
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
                      placeholder="Sélectionner le propriétaire ou le gestionnaire immobilier"
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
                    <option value="NULL">
                      Sortie sans contrat
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
                      {/* <Card.Img
                        variant="top"
                        src={formData.property_image}
                        alt={formData.property_description}
                        style={{ height: "120px", objectFit: "cover" }}
                      /> */}
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
                          <li><strong>Nom :</strong> {formData.landlord_fullname}</li>
                          <li><strong>Téléphone :</strong> {formData.tenant_phoneNumber}</li>
                          <li><strong>Adresse :</strong> {formData.property_location}</li>
                          <li><strong>Email :</strong> {formData.tenant_email}</li>
                        </ul>

                      </Card.Body>
                    </Card>
                  </div>
                )}

                <Form.Group className="mt-3">
                  <Form.Label>Quelle est la source du mouvement ?</Form.Label>
                  <Form.Select
                    name="source_mouvement"
                    onChange={handleSelectedLabelChange}
                    required
                  >
                    <option value="" disabled selected>
                      Selectionner une source
                    </option>
                    <option value="reparation">
                      Maintenance
                    </option>
                    <option value="entretien">
                      Entretien des espaces communs
                    </option>
                    <option value="commission">
                      Frais d'assistance de gestion
                    </option>
                    <option value="depot">
                      Depot a la banque
                    </option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mt-3">
                  <Form.Label>Montant du mouvement</Form.Label>
                  <Form.Control
                    name="amount"
                    type="number"
                    placeholder="Entrez le montant en CFA"
                    value={formData.amount || ""}
                    onChange={handleChange}
                    required
                  >

                  </Form.Control>
                </Form.Group>
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
                  <p><strong>Bonjour {propertyOwnerSelectedOption.fullName},</strong></p>
                  <p>Nous venons de créer un mouvement de sortie de <strong>{selectedSourceMouvementLabel}</strong> de <strong>{formData.amount} CFA</strong> pour <strong>{formatDatesList(formData.dates)}</strong> a bien été ajouté dans notre système.</p>
                  <p>La piece jointe ci-dessous contient le recu de ce mouvement.</p>
                  <p>Merci pour votre confiance.</p>

                  {formData.file && (
                    <div className="mt-3">
                      <strong>Fichier téléchargé :</strong>
                      <p>{formData.file.name}</p>
                    </div>
                  )}

                  <div className="mt-4">
                    <Button variant="primary" onClick={sendEmail} disabled={sending} className="w-100">
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