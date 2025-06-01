import { useState, useRef, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import CloseButton from "react-bootstrap/CloseButton";
import { useSession } from "next-auth/react";
import axios from "axios";
import { Form, Button, Card, Row, Col } from "react-bootstrap";
import Select from "react-select";
import leaseData from "./dummydata/leaseData.json";
import LeasePreview from "./leasepreview";
import LandlordPropertyCard from "./LandlordPropertyCard";
import { useUserProperties } from "../../../customHooks/realEstateHooks";
import {
  buildPropertiesArray,
  formatLandlordPropertiesOptions,
  formatLandlordTenants,
  formatPropertyOwners,
} from "../../../utils/generalUtils";
import { API_URL } from "../../../utils/settings";
import { useLandLord, useLandlordTenant, useTenant } from "../../../customHooks/usePropertyOwner";
import AddTenantModal from "../Tenants/AddTenantModal";


export default function PropertyContractModal({
  onSwap,
  pillButtons,
  ...props
}) {
  const [propertyModal, setPropertyModal] = useState(null);

  const [formData, setFormData] = useState(leaseData);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [lease_type, setLeaseType] = useState(null);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [selectedLandlord, setSelectedLandlord] = useState(null);
  const previewRef = useRef();

  const [requestAvailability, setRequestAvailability] = useState("");
  const [firstName, setFirstName] = useState("");
  const [validated, setValidated] = useState(false);
  const [disponibiliteNotification, setDisponibiliteNotification] = useState(null);

  // Adjust validation logic based on session
  const isFormValid = true;
  const { data: session } = useSession();
  //const userId = session?.user?.id ?? 0;
  // Add this computed value after defining selectedProperty and session
  const dynamicUserId = selectedLandlord?.id || session?.user?.id || 0;
  // With this:
  const { data: landlordPropertiesData } = useUserProperties(dynamicUserId);



  const { data: tenants } = useLandlordTenant(dynamicUserId);

  const [landlordProperties, setLandlordProperties] = useState([]);

  useEffect(() => {
    if (landlordPropertiesData) {
      const initialProperties = buildPropertiesArray(landlordPropertiesData.data);
      setLandlordProperties(initialProperties);
    }
  }, [landlordPropertiesData]);
  // Form submission handler
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate form inputs
    if (!isFormValid) {
      console.log(
        "Le formulaire n'est pas valide. Veuillez vérifier les champs."
      );
      setValidated(true);
      return;
    }
    // Prepare GraphQL mutation for rent disponibilite
    const disponibilite_data = {
      query: `mutation CreationPropertyAgreement($input: ContratInput!) {
        createContrat(input: $input) {
          id
        }
      }`,
      variables: {
        input: {
          propriete_id: Number(selectedProperty?.id),
          type_contrat: Number(formData.lease_type),
          date_debut: formData.leaseStart,
          montant_final: Number(formData.monthlyRent),
          locataire_id: Number(selectedTenant?.id),
          proprietaire_id: Number(dynamicUserId),
        },
      },
    };
    console.log("Before Mutation: ", disponibilite_data);
    try {
      const response = await axios.post(API_URL, disponibilite_data, {
        headers: { "Content-Type": "application/json" },
      });

      if (Number(response.data?.data?.createContrat?.id) >= 1) {
        setDisponibiliteNotification(
          "Le contrat de location a été créé avec succès."
        );
      }
    } catch (error) {
      console.error("Error during disponibilite:", error);
    }

    setValidated(true);
  };


  const customStyles = {
    menu: (provided) => ({
      ...provided,
      border: '0px solid white', // 👈 White border for the dropdown box
      backgroundColor: 'white',   // 👈 White background
      marginTop: 0,               // Optional: remove gap if you want it tighter
      zIndex: 9999,
    }),
    menuList: (provided) => ({
      ...provided,
      padding: 0,  // Optional: removes default padding inside the list
    }),
  };



  const handleLandlordSelect = (landlord) => {
    setSelectedLandlord(landlord);
    if (landlord) {
      setFormData((prev) => ({
        ...prev,
        landlord_fullname: landlord.fullName,
        landlord_address: landlord.landlord_address,
        landlord_id: landlord.id,
        landlord_phoneNumber: landlord.phoneNumber,
        landlord_pobox: landlord.landlord_pobox,
        landlord_nationality: landlord.landlord_nationality,
      }));
    }
  };

  const handlePropertySelect = (property) => {
    setSelectedProperty(property);
    if (property) {
      setFormData((prev) => ({
        ...prev,
        property_location: property.location,
        property_description: property.label,
        property_id: property.id,
        property_offer: property.offer,
        property_rent: property.price,
        property_type: property.category,
      }));
    }

  };

  const handleTenantSelect = (tenant) => {
    setSelectedTenant(tenant);
    if (tenant) {
      setFormData((prev) => ({
        ...prev,
        tenant_address: tenant.tenant_address,
        tenant_dateofbirth: tenant.tenant_dateofbirth,
        tenant_fullname: tenant.fullName,
        tenant_hometown: tenant.tenant_hometown,
        tenant_id: tenant.id,
        tenant_idissueddate: tenant.tenant_idissueddate,
        tenant_nationality: tenant.tenant_nationality,
        tenant_phoneNumber: tenant.phoneNumber,
      }))
    };
  };

  // Handle changes in other form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  // Handle PDF generation
  const handleDownload = async () => {
    const html2pdf = (await import("html2pdf.js")).default;

    html2pdf()
      .set({
        margin: 0.5,
        filename: "Residential_Lease_Agreement.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      })
      .from(previewRef.current)
      .save();
  };
  const propertyOfferOptions = formatLandlordPropertiesOptions(landlordProperties)
  const propertyOfferSelectedOption = propertyOfferOptions.find((option) => option.value === String(selectedProperty?.id));
  const { data: landlords } = useLandLord(1230);
  const propertyOwners = formatPropertyOwners(landlords)
  const propertyOwnerSelectedOption = propertyOwners.find((option) => option.value === selectedLandlord?.value);





  const housingTenants = formatLandlordTenants(tenants);
  const tenantsSelectedOption = housingTenants.find((option) => option.value === selectedTenant?.value);
  const [showModal, setShowModal] = useState(false);
  const [tenantData, setTenantData] = useState({});

  const handleAddTenant = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setTenantData({});
  };

  const handleTenantSubmit = () => {
    console.log('New tenant:', tenantData);
    // Add saving logic here
    handleModalClose();
  };
  return (
    <Modal {...props} size="lg" fullscreen scrollable>
      <Modal.Body className="px-0 py-2 py-sm-0">
        <CloseButton
          onClick={props.onHide}
          aria-label="Close modal"
          className="position-absolute top-0 end-0 mt-3 me-3"
        />
        <div className="row mx-0">
          <div className="col-md-1"></div>
          <div className="col-md-5 border-end-md p-4 p-sm-5">
            <h2 className="h3 mb-4 mb-sm-2">
              Création du contrat immobiler N° {selectedProperty?.nuo}
            </h2>
            {disponibiliteNotification && (
                <div className="alert alert-success mt-3">
                  {disponibiliteNotification}
                </div>
              )}
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <Form.Group className="mb-4 mt-2">
                <Form.Label>Quel est le type de contrat immobilier ?</Form.Label>
                <div className="d-flex">
                  <Form.Check
                    inline
                    type="radio"
                    label="Résidentiel"
                    name="lease_type"
                    value="1"
                    checked={formData.lease_type === "1"}
                    onChange={handleChange}
                  />
                  <Form.Check
                    inline
                    type="radio"
                    label="Commercial"
                    name="lease_type"
                    value="2"
                    checked={formData.lease_type === "2"}
                    onChange={handleChange}
                  />

                </div>
              </Form.Group>
              {session?.user?.roleId === "1200" && (
                <Form.Group className="mb-4 mt-2">
                  <Form.Label>Qui est le propriétaire ou le gestionnaire immobilier ?</Form.Label>
                  <Select
                    name="selectedLandlord"
                    value={propertyOwnerSelectedOption}
                    onChange={(landlord) => handleLandlordSelect(landlord)}
                    options={propertyOwners}
                    isSearchable
                    isClearable
                    placeholder="Sélectionnez le propriétaire ou le gestionnaire immobilier"
                    className={`react-select-container ${selectedLandlord?.id === propertyOwnerSelectedOption?.value ? "border-primary" : ""}`}
                    classNamePrefix="react-select"
                  />
                </Form.Group>
              )}

              <Form.Group className="mb-4 mt-2">
                <Form.Label>Quelle est la propriété concernée ?</Form.Label>
                <Select
                  name="selectedProperty"
                  value={propertyOfferSelectedOption}
                  onChange={(property) => handlePropertySelect(property)}
                  options={propertyOfferOptions}
                  isSearchable
                  isClearable
                  placeholder="Sélectionnez la propriété"
                  className={`react-select-container ${selectedProperty?.id === propertyOfferSelectedOption?.value ? "border-primary" : ""}`}
                  classNamePrefix="react-select"
                  components={{ Option: LandlordPropertyCard }}
                  styles={customStyles}
                />
              </Form.Group>
              <Row className="mb-4 mt-2">
                <Col md={6} sm={12}>
                  <Form.Label>Qui est le locataire ?</Form.Label>
                  <Select
                    name="selectedTenant"
                    value={tenantsSelectedOption}
                    onChange={(tenant) => handleTenantSelect(tenant)}
                    options={housingTenants}
                    isSearchable
                    isClearable
                    placeholder="Sélectionnez le locataire"
                    className={`react-select-container ${selectedTenant?.id === tenantsSelectedOption?.id ? "border-primary" : ""}`}
                    classNamePrefix="react-select"
                  />
                </Col>
                <Col md={6} sm={12}>
                  <Form.Label>Nouveau locataire ?</Form.Label>
                  <>
                    <Button variant="outline-primary" onClick={handleAddTenant}>
                      <i className="fi-user me-2 fs-base align-middle opacity-70"></i>
                      Ajouter un nouveau locataire
                    </Button>
                    <AddTenantModal
                      show={showModal}
                      onClose={handleModalClose}
                      onSubmit={handleTenantSubmit}
                      tenantData={tenantData}
                      landlordId={selectedLandlord?.id}
                      setTenantData={setTenantData}
                    />
                  </>
                </Col>
              </Row>
              <Form.Group className="mb-4 mt-2">
                <Form.Label>Quel est le montant final du loyer convenu ? (CFA)</Form.Label>
                <Form.Control
                  name="monthlyRent"
                  value={formData.monthlyRent}
                  onChange={handleChange}
                  type="number"
                />
              </Form.Group>
              <Row className="mb-4 mt-2">
                <Col md={6} sm={12}>
                  <Form.Group>
                    <Form.Label>Date de début du contrat</Form.Label>
                    <Form.Control
                      name="leaseStart"
                      value={formData.leaseStart}
                      onChange={handleChange}
                      type="date"
                    />
                  </Form.Group>
                </Col>

                <Col md={6} sm={12}>
                  <Form.Group>
                    <Form.Label>Date de fin du contrat</Form.Label>
                    <Form.Control
                      name="leaseEnd"
                      value={formData.leaseEnd}
                      onChange={handleChange}
                      type="date"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <div className="d-flex justify-content-between gap-2 mt-4">
                <Button className="w-50" variant="primary" type="submit">
                  Créer le contrat
                </Button>
                <Button
                  className="w-50"
                  variant="outline-secondary"
                  onClick={console.log("Cancel")}
                >
                  Annuler
                </Button>
              </div>
              {disponibiliteNotification && (
                <div className="alert alert-success mt-3">
                  {disponibiliteNotification}
                </div>
              )}
            </Form>
          </div>
          <div className="col-md-5 p-4 p-sm-5">
              <>
                {" "}
                <LeasePreview data={formData} previewRef={previewRef} />
                {/* Download PDF button */}
                <div className="text-end">
                  <Button variant="primary" onClick={handleDownload}>
                    Télécharger le contrat en PDF
                  </Button>
                </div>
              </>
              {disponibiliteNotification && (
                <div className="alert alert-success mt-3">
                  {disponibiliteNotification}
                </div>
              )}
          </div>
          <div className="col-md-1"></div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

// export default PropertyContractModal;
