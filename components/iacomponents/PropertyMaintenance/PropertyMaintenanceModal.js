import { useState, useRef } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import CloseButton from "react-bootstrap/CloseButton";
import CardProperty from "../CardProperty";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import "react-phone-input-2/lib/style.css";
import axios from "axios";
import { API_URL } from "../../../utils/settings";
import { FileText, Upload, X } from "lucide-react";
import Select from "react-select";

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

// Mock maintenance types for dropdown
const maintenanceTypes = [
  { id: "plumbing", name: "Plumbing" },
  { id: "electrical", name: "Electrical" },
  { id: "hvac", name: "HVAC" },
  { id: "structural", name: "Structural" },
  { id: "roofing", name: "Roofing" },
  { id: "painting", name: "Painting" },
  { id: "flooring", name: "Flooring" },
  { id: "appliance-repair", name: "Appliance Repair" },
  { id: "landscaping", name: "Landscaping" },
  { id: "pest-control", name: "Pest Control" },
  { id: "security-system", name: "Security System" },
];

const PropertyMaintenanceModal = ({ onSwap, pillButtons, ...props }) => {
  // const [propertyModal, setPropertyModal] = useState(null);

  /* const { data, isLoading, isError } = useQuery(
      ['propertyModal', property.nuo],
      () => fetchPropertyData(property.nuo),
      {
        onSuccess: (data) => setPropertyModal(data),
        enabled: !!property.nuo, // Ensures that `nuo` exists before fetching
      }
    ); */

  // Form state
  const [formData, setFormData] = useState({
    maintenanceType: "",
    description: "",
    files: [],
  });

  const [requestAvailability, setRequestAvailability] = useState("");
  const [firstName, setFirstName] = useState("");

  // Form validation state
  const [validated, setValidated] = useState(false);
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const [disponibiliteNotification, setDisponibiliteNotification] =
    useState(null);

  // File input refs
  const fileInputRef = useRef();
  const dragAreaRef = useRef();

  const { data: session } = useSession();

  // Adjust validation logic based on session
  const isFormValid = true;

  // Prepare maintenance types for react-select format
  const maintenanceTypeOptions = maintenanceTypes.map((type) => ({
    value: type.id,
    label: type.name,
  }));

  const selectedMaintenanceType = maintenanceTypeOptions.find(
    (opt) => opt.value === formData.maintenanceType
  );

  // Handle text inputs change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear specific error when field is changed
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    console.log(e.target.value);

    // Validate file types (images & pdf)
    const validFiles = selectedFiles.filter(
      (file) =>
        file.type.startsWith("image/") || file.type === "application/pdf"
    );

    if (validFiles.length !== selectedFiles.length) {
      setErrors({
        ...errors,
        files: "Only image files and PDFS are allowed",
      });
    } else {
      setErrors({
        ...errors,
        files: "",
      });
    }

    setFormData({
      ...formData,
      files: [...formData.files, ...validFiles],
    });
  };

  // Remove file from selection
  const removeFile = (index) => {
    const updatedFiles = [...formData.files];
    updatedFiles.splice(index, 1);

    setFormData({
      ...formData,
      files: updatedFiles,
    });
    console.log(formData.files);
  };

  // Handle file drag events
  const handleDragOver = (e) => {
    e.preventDefault();
    dragAreaRef.current.classList.remove("bg-light");
  };

  const handleDragLeave = () => {
    dragAreaRef.current.classList.remove("bg-light");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    dragAreaRef.current.classList.remove("bg-light");
    const droppedFiles = Array.from(e.dataTransfer.files);
    const validFiles = droppedFiles.filter(
      (file) =>
        file.type.startsWith("image/") || file.type === "application/pdf"
    );

    if (validFiles.length !== droppedFiles.length) {
      setErrors({
        ...errors,
        files: "Only image files and PDFS are allowed",
      });
    } else {
      setErrors({
        ...errors,
        files: "",
      });
    }

    setFormData({
      ...formData,
      files: [...formData.files, ...validFiles],
    });
  };

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

  // Reset form
  const handleCancel = () => {
    setFormData({
      maintenanceType: "",
      description: "",
      files: [],
    });
    setErrors({});
    setValidated(false);
    setSearchTerm("");
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
          <div className="col-md-6 p-4 p-sm-5">
            <h3 className="h4">Maintenances immobilieres N°. Bonne chance !</h3>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              {/*Maintainence Type Dropdown */}
              <Form.Group className="mb-3" controlId="maintenanceType">
                <Form.Label>Maintenance Type</Form.Label>
                <Select
                  options={maintenanceTypeOptions}
                  value={selectedMaintenanceType}
                  onChange={(option) =>
                    setFormData({
                      ...formData,
                      maintenanceType: option?.value || "",
                    })
                  }
                  isSearchable
                />

                {errors.maintenanceType && (
                  <Form.Control.Feedback type="invalid" className="d-black">
                    {errors.maintenanceType}
                  </Form.Control.Feedback>
                )}
              </Form.Group>

              {/* Description */}
              <Form.Group className="mb-3" controlId="description">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  // isInValid={!!errors.description}
                  placeholder="Please describe the issue in detail..."
                />
                {errors.description && (
                  <Form.Control.Feedback type="inValid">
                    {errors.description}
                  </Form.Control.Feedback>
                )}
              </Form.Group>

              {/* File upload */}
              <Form.Group className="mb-3">
                <Form.Label>Attachments</Form.Label>
                <div
                  ref={dragAreaRef}
                  className="border rounded p-3 text-center"
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <Upload size={32} className="mb-2 text-primary" />
                  <p>Drag and Drop files here or</p>

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    multiple
                    style={{ display: "none" }}
                    accept="image/*,application/pdf"
                  />
                  <Button
                    variant="outline-primary"
                    onClick={() => fileInputRef.current.click()}
                  >
                    Browse files
                  </Button>
                  <p className="mt-2 text-muted small">
                    Accepted file types: Images & PDFs
                  </p>
                </div>
                {errors.files && (
                  <div className="text-danger small mt-1">{errors.files}</div>
                )}

                {/* File lists */}
                {formData.files.length > 0 && (
                  <div className="mt-3">
                    <p className="mb-2">Selected Files:</p>
                    <div
                      className="border rounded p-2"
                      style={{ maxHeight: "150px", overflow: "auto" }}
                    >
                      {formData.files.map((file, i) => (
                        <div
                          key={i}
                          className="d-flex align-items-center justify-content-between border-bottom py-2"
                        >
                          <div className="d-flex align-items-center">
                            <FileText size={16} className="mt-2" />
                            <span>
                              {file.name} ({(file.size / 1024).toFixed(2)} KB)
                            </span>
                          </div>
                          <Button
                            variant="link"
                            className="text-danger p-0"
                            onClick={() => removeFile(i)}
                          >
                            <X size={16} />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Form Buttons */}
                <div className="d-flex justify-content-between gap-2 mt-4">
                  <Button className="w-50" variant="primary" type="submit">
                    Submit request
                  </Button>
                  <Button
                    className="w-50"
                    variant="outline-secondary"
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                </div>
              </Form.Group>
              {disponibiliteNotification && (
                <div className="alert alert-success mt-3">
                  {disponibiliteNotification}
                </div>
              )}
            </Form>
          </div>
          <div className="col-md-6 border-end-md p-4 p-sm-5">
            <h2 className="h3 mb-2 mb-sm-2">
              Requete de maintenance sur la propriete N°{" "}
            </h2>
            <div className="card shadow-sm mb-4">
              <div className="card-header bg-light">
                <h5 className="card-title mb-0">Maintenance Request</h5>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <p className="card-text">
                    {formData.maintenanceType || "Not specified"}
                  </p>
                </div>

                <div className="mb-3">
                  <p className="card-text" style={{ whiteSpace: "pre-wrap" }}>
                    {formData.description || "No description provided"}
                  </p>
                </div>

                <div>
                  {formData.files.length === 0 ? (
                    <p className="text-muted fst-italic">No files attached</p>
                  ) : (
                    <div className="row row-cols-2 row-cols-md-4 g-3">
                      {formData.files.map((file, i) => (
                        <div key={i} className="col">
                          <div className="card h-100 border-light">
                            <div className="card-body text-center p-2">
                              {file.type.startsWith("image/") ? (
                                <img
                                  src={URL.createObjectURL(file)}
                                  alt={`Attachment ${i + 1}`}
                                  className="img-thumbnail mb-2"
                                  style={{
                                    maxHeight: "80px",
                                    objectFit: "contain",
                                  }}
                                />
                              ) : (
                                <i className="bi bi-file-text fs-2 text-secondary mb-2"></i>
                              )}
                              <p
                                className="small text-truncate mb-0"
                                title={file.name}
                              >
                                {file.name}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default PropertyMaintenanceModal;
