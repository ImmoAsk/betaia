import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const AddTenantModal = ({ show, onClose, onSubmit, tenantData, setTenantData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTenantData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(); // submit logic passed from parent
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Ajouter un nouveau locataire</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Nom complet</Form.Label>
            <Form.Control
              type="text"
              name="fullName"
              value={tenantData.fullName || ''}
              onChange={handleChange}
              placeholder="Entrez le nom du locataire"
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={tenantData.email || ''}
              onChange={handleChange}
              placeholder="Entrez l'email du locataire"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Téléphone</Form.Label>
            <Form.Control
              type="tel"
              name="phone"
              value={tenantData.phone || ''}
              onChange={handleChange}
              placeholder="Entrez le numéro de téléphone"
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Ajouter le locataire
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddTenantModal;
