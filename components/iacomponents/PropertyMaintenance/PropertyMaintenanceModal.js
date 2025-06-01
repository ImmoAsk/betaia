import { useState, useRef } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import CloseButton from "react-bootstrap/CloseButton";
import { useSession } from "next-auth/react";
import "react-phone-input-2/lib/style.css";
import axios from "axios";
import { API_URL } from "../../../utils/settings";
import { FileText, Upload, X } from "lucide-react";
import Select from "react-select";


// Mock maintenance types for dropdown
const maintenanceTypes = [
  { id: "plumbing", name: "Plomberie" },
  { id: "electrical", name: "Électricité" },
  { id: "hvac", name: "Chauffage, ventilation et climatisation" },
  { id: "structural", name: "Structure" },
  { id: "roofing", name: "Toiture" },
  { id: "painting", name: "Peinture" },
  { id: "flooring", name: "Revêtement de sol" },
  { id: "appliance-repair", name: "Réparation d’appareils" },
  { id: "landscaping", name: "Aménagement paysager" },
  { id: "pest-control", name: "Lutte antiparasitaire" },
  { id: "security-system", name: "Système de sécurité" },
];

const PropertyMaintenanceModal = ({ onSwap, pillButtons, ...props }) => {


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

  const [disponibiliteNotification, setDisponibiliteNotification] =useState(null);

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
      query: `mutation CreateMaintenanceRequest($input: MaintenanceInput!) {
        createMaintenance(input: $input) {
          status,message
        }
      }`,
      variables: {
        input: {
          user_id: Number(session?.user?.id),
          categorie: formData.maintenanceType,
          description : formData.description,
          images: formData.files[0].name,
        },
      },
    };
    console.log("Before Mutation: ", disponibilite_data);
    try {
      const response = await axios.post(API_URL, disponibilite_data, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.data?.data?.createMaintenance?.status ==="success") {

        setDisponibiliteNotification(
          "La demande de maintenance est envoyée avec succès. Nous vous revenons sous peu."
        );  
        console.log("Response: ", response.data?.data?.createMaintenance);
      } else {
        setDisponibiliteNotification(
          response.data?.data?.createMaintenance?.message ||
            "Une erreur s'est produite lors de l'envoi de la demande de maintenance."
        );
        console.log("Response: ", response.data?.data?.createMaintenance);
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
            <h3 className="h4">Maintenance immobiliere </h3>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              {/*Maintainence Type Dropdown */}
              <Form.Group className="mb-3" controlId="maintenanceType">
                <Form.Label>Type de maintenance</Form.Label>
                <Select
                  options={maintenanceTypeOptions}
                  value={selectedMaintenanceType}
                  onChange={(option) =>
                    setFormData({
                      ...formData,
                      maintenanceType: option?.label || "",
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
                  placeholder="Decrire un peu..."
                />
                {errors.description && (
                  <Form.Control.Feedback type="inValid">
                    {errors.description}
                  </Form.Control.Feedback>
                )}
              </Form.Group>

              {/* File upload */}
              <Form.Group className="mb-3">
                <Form.Label>Preuves</Form.Label>
                <div
                  ref={dragAreaRef}
                  className="border rounded p-3 text-center"
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <Upload size={32} className="mb-2 text-primary" />
                  <p>Cliquer et deposer ou</p>

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
                    Telecharger des fichiers
                  </Button>
                  <p className="mt-2 text-muted small">
                    Types de fichiers acceptes: Images & PDFs
                  </p>
                </div>
                {errors.files && (
                  <div className="text-danger small mt-1">{errors.files}</div>
                )}

                {/* File lists */}
                {formData.files.length > 0 && (
                  <div className="mt-3">
                    <p className="mb-2">Fichiers selectionnes:</p>
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
                    Soumettre
                  </Button>
                  <Button
                    className="w-50"
                    variant="outline-secondary"
                    onClick={handleCancel}
                  >
                    Annuler
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
                <h5 className="card-title mb-0">Requete de maintenance</h5>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <p className="card-text">
                    {formData.maintenanceType || "Not specified"}
                  </p>
                </div>

                <div className="mb-3">
                  <p className="card-text" style={{ whiteSpace: "pre-wrap" }}>
                    {formData.description || "Aucune description fournie"}
                  </p>
                </div>

                <div>
                  {formData.files.length === 0 ? (
                    <p className="text-muted fst-italic">Aucun fichier attache</p>
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
