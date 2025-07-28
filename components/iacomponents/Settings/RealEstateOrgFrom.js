import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

export default function RealEstateOrgForm() {
  const [form, setForm] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    logo: null
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Agency info submitted:', form);
  };

  return (
    <div>
      <h5>Mise à jour de l'agence immobilière</h5>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-2">
          <Form.Label>Nom</Form.Label>
          <Form.Control name="name" value={form.name} onChange={handleChange} required />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Adresse</Form.Label>
          <Form.Control name="address" value={form.address} onChange={handleChange} required />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Téléphone</Form.Label>
          <Form.Control name="phone" value={form.phone} onChange={handleChange} required />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" name="email" value={form.email} onChange={handleChange} required />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Logo</Form.Label>
          <Form.Control type="file" name="logo" onChange={handleChange} />
        </Form.Group>
        <Button variant="primary" type="submit">Mettre à jour</Button>
      </Form>
    </div>
  );
}
