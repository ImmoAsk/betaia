import { useState } from "react";
import { Modal, Button, Form, Row, Col, Card } from "react-bootstrap";
import contracts from "./PropertyContract.json";

export default function AddManualReceipt() {
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
    if (values.length === 2) return `${values[0]} and ${values[1]}`;
    return `${values.slice(0, -1).join(", ")} and ${values[values.length - 1]}`;
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
    setShowPreview(true);
  };

  const sendEmail = () => {
    if (!formData.file) {
      alert("Please upload a file");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = async () => {
      const base64File = reader.result;
      setSending(true);

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
        if (!res.ok) throw new Error(data.error || "Unknown error");

        setShowSuccessModal(true);
        setTimeout(() => {
          setShowSuccessModal(false);
        }, 1500);

        resetForm();
      } catch (err) {
        console.error("Failed to send email:", err.message);
        alert(`Failed to send email: ${err.message}`);
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

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        size="xl"
      >
        <Modal.Header closeButton>
          <Modal.Title>Ajouter un encaissement</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={6}>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mt-3">
                  <Form.Label>Select Property Contract</Form.Label>
                  <Form.Select
                    name="contract"
                    value={formData.contracts}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>
                      Select a contract
                    </option>
                    {contracts.map((contract, index) => (
                      <option key={index} value={index.toString()}>
                        {contract.tenant_fullname} |{" "}
                        {contract.property_location} | {contract.leaseStart} →{" "}
                        {contract.leaseEnd}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                {formData.contracts !== "" &&
                  contracts[parseInt(formData.contracts, 10)] && (
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
                            <li>
                              <strong>Rent:</strong> {formData.property_rent}{" "}
                              CFA
                            </li>
                            <li>
                              <strong>Type:</strong> {formData.property_type}
                            </li>
                            <li>
                              <strong>Location:</strong>{" "}
                              {formData.property_location}
                            </li>
                            <li>
                              <strong>Lease Start:</strong>{" "}
                              {formData.leaseStart}
                            </li>
                          </ul>
                        </Card.Body>
                      </Card>

                      <Card style={{ width: "45%", height: "50vh" }}>
                        <Card.Body>
                          <Card.Title>Tenant Details</Card.Title>
                          <Card.Text>
                            <strong>Name:</strong> {formData.tenant_fullname}
                          </Card.Text>
                          <Card.Text>
                            <strong>Phone:</strong>{" "}
                            {formData.tenant_phoneNumber}
                          </Card.Text>
                          <Card.Text>
                            <strong>Address:</strong> {formData.tenant_address}
                          </Card.Text>
                          <Card.Text>
                            <strong>Email:</strong> {formData.tenant_email}
                          </Card.Text>
                        </Card.Body>
                      </Card>
                    </div>
                  )}

                <Form.Group className="mt-4">
                  <Form.Label>Select Payment Date(s)</Form.Label>
                  {formData.dates.map((date) => (
                    <div
                      key={date.id}
                      className="d-flex align-items-center mb-2"
                    >
                      <Form.Control
                        type="date"
                        value={date.value}
                        onChange={(e) =>
                          handleDateChange(date.id, e.target.value)
                        }
                        required
                      />
                      {formData.dates.length > 1 && (
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => removeDateField(date.id)}
                          className="ms-2"
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={addDateField}
                    className="mt-2"
                  >
                    Add Date
                  </Button>
                </Form.Group>

                <Form.Group className="mt-3">
                  <Form.Label>Upload Payment Receipt (PDF or Image)</Form.Label>
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
                      Create
                    </Button>
                  </Col>
                  <Col>
                    <Button
                      variant="secondary"
                      onClick={() => setShowModal(false)}
                      className="w-100"
                    >
                      Cancel
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Col>

            {showPreview && (
              <Col md={6}>
                <div className="p-3 border rounded bg-light h-100">
                  <h5 className="mb-3">Payment Receipt</h5>
                  <p>
                    <strong>Dear {formData.tenant_fullname},</strong>
                  </p>
                  <p>
                    Your rent payments for the dates{" "}
                    <strong>{formatDatesList(formData.dates)}</strong> have been
                    successfully added to our system.
                  </p>
                  <p>Attached to this email is a copy of your receipt.</p>
                  <p>Thank you.</p>

                  {formData.file && (
                    <div className="mt-3">
                      <strong>Uploaded File:</strong>
                      <p>{formData.file.name}</p>
                    </div>
                  )}

                  <div className="mt-4 text-center">
                    <Button
                      variant="primary"
                      onClick={sendEmail}
                      disabled={sending}
                    >
                      {sending ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Sending...
                        </>
                      ) : (
                        "Submit"
                      )}
                    </Button>
                  </div>
                </div>
              </Col>
            )}
          </Row>
        </Modal.Body>
      </Modal>

      <Modal
        show={showSuccessModal}
        onHide={() => setShowSuccessModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Email Sent</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>Email has been sent successfully</p>
          <Button variant="primary" onClick={() => setShowSuccessModal(false)}>
            Close
          </Button>
        </Modal.Body>
      </Modal>
    </>
  );
}
