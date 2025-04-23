import { useState, useRef, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import CloseButton from "react-bootstrap/CloseButton";
import CardProperty from "../CardProperty";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import "react-phone-input-2/lib/style.css";
import axios from "axios";
import { API_URL } from "../../../utils/settings";
import { Container, Form, Button, Row, Col, Card } from "react-bootstrap";
import leaseData from "./dummydata/leaseData.json";
import landlords from "./dummydata/landlords.json";
import tenants from "./dummydata/tenants.json";
import properties from "./dummydata/propdata.json";
import LeasePreview from "./leasepreview";
import dynamic from "next/dynamic";

const fetchPropertyData = async (nuo) => {
  const query = `
    query GetProperty($nuo: Int!) {
      propriete(nuo: $nuo) {
        id
        nuo
        garage
        est_meuble
        titre
        descriptif
        surface
        usage
        cuisine
        salon
        piece
        wc_douche_interne
        cout_mensuel
        nuitee
        cout_vente
        tarifications {
          id
          mode
          currency
          montant
        }
        categorie_propriete {
          denomination
          id
        }
        infrastructures {
          id
          denomination
          icone
        }
        meubles {
          libelle
          icone
        }
        badge_propriete {
          id
          date_expiration
          badge {
            id
            badge_name
            badge_image
          }
        }
        pays {
          id
          code
          denomination
        }
        ville {
          denomination
          id
        }
        quartier {
          id
          denomination
        }
        adresse {
          libelle
          id
        }
        offre {
          id
          denomination
        }
        visuels {
          uri
        }
        user {
          id
        }
      }
    }
  `;

  const response = await axios.post(API_URL, {
    query,
    variables: { nuo },
  });

  if (response.data.errors) {
    throw new Error("Failed to fetch property data");
  }

  return response.data.data.propriete;
};

export default function PropertyContractModal({
  onSwap,
  pillButtons,
  ...props
}) {
  const [propertyModal, setPropertyModal] = useState(null);

  const [formData, setFormData] = useState(leaseData);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const previewRef = useRef();

  /* const { data, isLoading, isError } = useQuery(
      ['propertyModal', property.nuo],
      () => fetchPropertyData(property.nuo),
      {
        onSuccess: (data) => setPropertyModal(data),
        enabled: !!property.nuo, // Ensures that `nuo` exists before fetching
      }
    ); */

  const [requestAvailability, setRequestAvailability] = useState("");
  const [firstName, setFirstName] = useState("");
  const [validated, setValidated] = useState(false);
  const [disponibiliteNotification, setDisponibiliteNotification] =
    useState(null);

  // Adjust validation logic based on session
  const isFormValid = true;

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
      query: `mutation UpdatePropertyStatus($input: UpdateProprieteStatusInput!) {
        updateProprieteStatus(input: $input) {
          id
        }
      }`,
      variables: {
        input: {
          id: 1,
          statut: 2,
        },
      },
    };
    console.log("Before Mutation: ", disponibilite_data);
    try {
      const response = await axios.post(API_URL, disponibilite_data, {
        headers: { "Content-Type": "application/json" },
      });

      if (Number(response.data?.data?.updateProprieteStatus?.id) >= 1) {
        setDisponibiliteNotification(
          "Le biens immobiler est bien rendu indisponible. Mettez en vente ou en location d'autres biens immobiliers."
        );
      }
    } catch (error) {
      console.error("Error during disponibilite:", error);
    }

    setValidated(true);
  };
  //console.log("Property In Delete Modal: ", property);
  //const propertyCard = createPropertyObject(property);

  const scrollRef = useRef(null);
  const scrollReftenant = useRef(null);

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({
      left: -scrollRef.current.offsetWidth / 2,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({
      left: scrollRef.current.offsetWidth / 2,
      behavior: "smooth",
    });
  };

  // ✅ Handle arrow key events
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") {
        scrollLeft();
      } else if (e.key === "ArrowRight") {
        scrollRight();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleLandlordSelect = (e) => {
    const selectedId = e.target.value;
    const selectedLandlord = landlords.find(
      (l) => l.landlord_id === selectedId
    );
    if (selectedLandlord) {
      setFormData((prev) => ({
        ...prev,
        landlord_fullname: selectedLandlord.landlord_fullname,
        landlord_address: selectedLandlord.landlord_address,
        landlord_id: selectedLandlord.landlord_id,
        landlord_phoneNumber: selectedLandlord.landlord_phoneNumber,
        landlord_pobox: selectedLandlord.landlord_pobox,
        landlord_nationality: selectedLandlord.landlord_nationality,
      }));
    }
  };

  const handlePropertySelect = (property) => {
    setSelectedProperty(property);
    setFormData((prev) => ({
      ...prev,
      property_location: property.property_location,
      property_description: property.property_description,
      property_id: property.property_id,
      property_offer: property.property_offer,
      property_rent: property.property_rent,
      property_type: property.property_type,
    }));
  };

  const handleTenantSelect = (tenant) => {
    setSelectedTenant(tenant);
    setFormData((prev) => ({
      ...prev,
      tenant_address: tenant.tenant_address,
      tenant_dateofbirth: tenant.tenant_dateofbirth,
      tenant_fullname: tenant.tenant_fullname,
      tenant_hometown: tenant.tenant_hometown,
      tenant_id: tenant.tenant_id,
      tenant_idissueddate: tenant.tenant_idissueddate,
      tenant_nationality: tenant.tenant_nationality,
      tenant_phoneNumber: tenant.tenant_phoneNumber,
    }));
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

  return (
    <Modal {...props} className="signin-modal">
      <Modal.Body className="px-0 py-2 py-sm-0">
        <CloseButton
          onClick={props.onHide}
          aria-label="Close modal"
          className="position-absolute top-0 end-0 mt-3 me-3"
        />
        <div className="row mx-0">
          <div className="col-md-6 border-end-md p-4 p-sm-5">
            <h2 className="h3 mb-2 mb-sm-2">
              Creation du contrat immobiler N°{" "}
            </h2>

            <div className="d-flex align-items-center py-3 mb-3">
              <>
                <Container className="my-5">
                  <Form>
                    <Form.Group className="mb-4">
                      <Form.Label>Select Landlord</Form.Label>
                      <Form.Select
                        onChange={handleLandlordSelect}
                        defaultValue=""
                      >
                        <option value="" disabled>
                          Select a landlord
                        </option>
                        {landlords.map((l) => (
                          <option key={l.landlord_id} value={l.landlord_id}>
                            {l.landlord_fullname}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>

                    <Row>
                      <Row />
                      <Row>
                        <Col md={25}>
                          <Form.Group className="mb-3">
                            <Form.Label>Select Property</Form.Label>

                            <div style={{ position: "relative" }}>
                              {/* Scrollable row */}
                              <div
                                ref={scrollRef}
                                style={{
                                  display: "flex",
                                  overflowX: "auto",
                                  gap: "1rem",
                                  scrollSnapType: "x mandatory",
                                  padding: "0 1rem",
                                  scrollbarWidth: "none",
                                }}
                              >
                                {properties.map((property) => (
                                  <div
                                    key={property.property_id}
                                    style={{
                                      flex: "0 0 50%",
                                      scrollSnapAlign: "start",
                                    }}
                                  >
                                    <Card
                                      className={`h-100 ${
                                        selectedProperty?.property_id ===
                                        property.property_id
                                          ? "border-primary"
                                          : ""
                                      }`}
                                      style={{ cursor: "pointer" }}
                                      onClick={() =>
                                        handlePropertySelect(property)
                                      }
                                    >
                                      <Card.Img
                                        variant="top"
                                        src={property.property_image}
                                        alt={property.property_description}
                                        style={{
                                          height: "200px",
                                          objectFit: "cover",
                                        }}
                                      />
                                      <Card.Body>
                                        <Card.Text>
                                          {property.property_type}
                                        </Card.Text>
                                        <ul className="list-unstyled">
                                          <li>
                                            <strong>Rent:</strong>{" "}
                                            {property.property_rent.toLocaleString()}{" "}
                                            CFA
                                          </li>
                                        </ul>
                                      </Card.Body>
                                    </Card>
                                  </div>
                                ))}
                              </div>

                              {/* Scroll buttons at the edges */}
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={scrollLeft}
                                style={{
                                  position: "absolute",
                                  top: "50%",
                                  left: 0,
                                  transform: "translateY(-50%)",
                                  zIndex: 1,
                                }}
                              >
                                &larr;
                              </Button>

                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={scrollRight}
                                style={{
                                  position: "absolute",
                                  top: "50%",
                                  right: 0,
                                  transform: "translateY(-50%)",
                                  zIndex: 1,
                                }}
                              >
                                &rarr;
                              </Button>
                            </div>
                          </Form.Group>
                        </Col>
                      </Row>

                      <Row>
                        <Col md={25}>
                          <Form.Group className="mb-3">
                            <Form.Label>Select Tenant</Form.Label>

                            <div style={{ position: "relative" }}>
                              <div
                                ref={scrollRef}
                                style={{
                                  display: "flex",
                                  overflowX: "auto",
                                  gap: "1rem",
                                  scrollSnapType: "x mandatory",
                                  padding: "0 1rem",
                                  scrollbarWidth: "none",
                                }}
                              >
                                {tenants.map((tenant) => (
                                  <div
                                    key={tenants.tenant_id}
                                    style={{
                                      flex: "0 0 50%",
                                      scrollSnapAlign: "start",
                                    }}
                                  >
                                    <Card
                                      className={`h-50 ${
                                        selectedTenant?.tenant_id ===
                                        tenant.tenant_id
                                          ? "border-primary"
                                          : ""
                                      }`}
                                      style={{ cursor: "pointer" }}
                                      onClick={() => handleTenantSelect(tenant)}
                                    >
                                      <Card.Img
                                        variant="top"
                                        src={tenant.tenant_picture}
                                        alt={tenant.tenant_fullname}
                                        style={{
                                          height: "200px",
                                          objectFit: "cover",
                                        }}
                                      />
                                      <Card.Body>
                                        <Card.Text>
                                          {tenant.tenant_fullname}
                                        </Card.Text>
                                      </Card.Body>
                                    </Card>
                                  </div>
                                ))}
                              </div>

                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={scrollLeft}
                                style={{
                                  position: "absolute",
                                  top: "50%",
                                  left: 0,
                                  transform: "translateY(-50%)",
                                  zIndex: 1,
                                }}
                              >
                                &larr;
                              </Button>

                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={scrollRight}
                                style={{
                                  position: "absolute",
                                  top: "50%",
                                  right: 0,
                                  transform: "translateY(-50%)",
                                  zIndex: 1,
                                }}
                              >
                                &rarr;
                              </Button>
                            </div>
                          </Form.Group>
                        </Col>
                      </Row>

                      <Form.Group className="mb-3">
                        <Form.Label>Monthly Rent (CFA)</Form.Label>
                        <Form.Control
                          name="monthlyRent"
                          value={formData.monthlyRent}
                          onChange={handleChange}
                          type="number"
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Lease Start Date</Form.Label>
                        <Form.Control
                          name="leaseStart"
                          value={formData.leaseStart}
                          onChange={handleChange}
                          type="date"
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Lease End Date</Form.Label>
                        <Form.Control
                          name="leaseEnd"
                          value={formData.leaseEnd}
                          onChange={handleChange}
                          type="date"
                        />
                      </Form.Group>
                    </Row>
                  </Form>

                  <hr className="my-4" />
                </Container>
              </>
            </div>
          </div>

          <div className="col-md-6 p-4 p-sm-5">
            <h3 className="h4">Bail a usage d'habitation N°. Bonne chance !</h3>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <>
                {" "}
                <div className="border p-4 mb-4 bg-light">
                  <LeasePreview data={formData} previewRef={previewRef} />
                </div>
                {/* Download PDF button */}
                <div className="text-end">
                  <Button variant="primary" onClick={handleDownload}>
                    Download PDF
                  </Button>
                </div>
              </>

              {disponibiliteNotification && (
                <div className="alert alert-success mt-3">
                  {disponibiliteNotification}
                </div>
              )}
            </Form>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

// export default PropertyContractModal;
