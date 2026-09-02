import axios from 'axios';
import React, { useState } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { API_URL } from '../../../utils/settings';
import { useSession } from 'next-auth/react';
export default function RealEstateOrgForm() {
  const [agenceNotification, setAgenceNotification] = useState(null);
  const [form, setForm] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    logo: null,
    facebook: '',
    youtube: '',
    linkedin: '',
    description: '',
  });
  const { data: session } = useSession();
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Agency info submitted:', form);
    const agencyPayload = {
      facebook_url: form.facebook,
      youtube_url: form.youtube,
      linkedin_url: form.linkedin,
      description: form.description,
      name_organisation: form.name,
      adresse_commune: form.address,
      user_id: Number(session?.user?.id), // Remplacer par l'ID utilisateur approprié session?.user?.id, // Remplacer par l'ID utilisateur approprié
    };

    const sendingFormData = new FormData();

    // Construction du payload GraphQL
    sendingFormData.append(
      'operations',
      JSON.stringify({
        query: `
      mutation UpdateRealEstateAgency($data: OrganisationInput!) {
        updateOrCreateOrganisation(input: $data) {
          status
          message
          organisation {
            name_organisation
            description
            adresse_commune
          }
        }
      }
    `,
        variables: { data: agencyPayload },
      })
    );

    // Lier le fichier logo (upload) si présent
    if (form.logo) {
      sendingFormData.append('0', form.logo);
      sendingFormData.append('map', '{"0": ["variables.data.logo"]}');
    }

    try {
      const response = axios.post(API_URL, sendingFormData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data?.data?.updateOrCreateOrganisation) {
        setAgenceNotification("L'agence immobilière a été mise à jour avec succès.");
        setForm({
          name: '',
          address: '',
          phone: '',
          email: '',
          logo: null,
          facebook: '',
          youtube: '',
          linkedin: '',
          description: '',
        });
        console.log("Mise à jour réussie :", response.data.data.updateOrCreateOrganisation);
      } else {
        console.warn("Réponse inattendue :", response.data);
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l’agence :", error);
    }

  };

  return (
    <Card>
      {agenceNotification && <div className="alert alert-success mt-3">{agenceNotification}</div>}
      <Card.Header>
        <h5 className="mb-0">Mise à jour de l'agence immobilière</h5>
      </Card.Header>

      <Form onSubmit={handleSubmit}>
        <Card.Body>
          <Form.Group className="mb-3">
            <Form.Label>Nom de la société immobilière</Form.Label>
            <Form.Control
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Adresse</Form.Label>
            <Form.Control
              name="address"
              value={form.address}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Décrire votre activité immobilière</Form.Label>
            <Form.Control
              name="description"
              as="textarea"
              rows={3}
              placeholder="Décrivez votre agence immobilière"
              value={form.description}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Logo</Form.Label>
            <Form.Control
              type="file"
              name="logo"
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Lien Facebook de votre agence</Form.Label>
            <Form.Control
              type="text"
              name="facebook"
              value={form.facebook}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Lien Youtube de votre agence</Form.Label>
            <Form.Control
              type="text"
              name="youtube"
              value={form.youtube}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Lien Linkedin de votre agence</Form.Label>
            <Form.Control
              type="text"
              name="linkedin"
              value={form.linkedin}
              onChange={handleChange}
            />
          </Form.Group>
        </Card.Body>

        <Card.Footer className="d-flex justify-content-end gap-2">
          <Button variant="secondary" type="reset">Annuler</Button>
          <Button variant="primary" type="submit">Mettre à jour</Button>
        </Card.Footer>
      </Form>
    </Card>
  );
}
