import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { API_URL } from '../../../utils/settings';
const AddTenantModal = ({ show, onClose, onSubmit, tenantData, setTenantData ,landlordId}) => {
  const {tenantNotification, setTenantNotification} = useState(null);
  const { data: session } = useSession();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTenantData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    const { fullName, email, phone } = tenantData;
    console.log('Tenant Data:', { fullName, email, phone });
    e.preventDefault();

    const tenant_data = {
          query: `mutation CreationRenter($input: LocataireInput!) {
            createLocataire(input: $input) {
              id
            }
          }`,
          variables: {
            input: {
              proprietaire_id: Number(landlordId) > 0 ? Number(landlordId) : session?.user?.id,
              nom_locataire: tenantData.fullName,
              email_locataire: tenantData.email,
              phone_locataire: tenantData.phone,
            }
          }
        };

        console.log("Before Mutation: ", tenant_data)
        try {
          const response = axios.post(API_URL, tenant_data, {
            headers: { 'Content-Type': 'application/json' }
          });
    
          if (Number(response.data?.data?.createLocataire?.id) >= 1) {
            setTenantNotification("La demande de la nuitée est envoyée avec succes. Nous vous revenons sous peu.");
          }
        } catch (error) {
          console.error("Error during disponibilite:", error);
        }
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
          {tenantNotification && <div className="alert alert-success mt-3">{tenantNotification}</div>}
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddTenantModal;
