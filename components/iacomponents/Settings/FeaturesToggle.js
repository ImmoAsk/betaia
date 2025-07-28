import React, { useState } from 'react';
import { Form } from 'react-bootstrap';

export default function FeaturesToggle() {
  const [features, setFeatures] = useState({
    rent: true,
    visits: true,
    reservations: false,
    projects: true
  });

  const handleToggle = (key) => {
    setFeatures((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div>
      <h5>Visibilité des fonctionnalités</h5>
      <Form>
        <Form.Check 
          type="switch"
          id="rent-switch"
          label={<><i className="fi-settings opacity-60 me-2"></i>Encaissements de locataire</>}
          checked={features.rent}
          onChange={() => handleToggle('rent')}
        />
        <Form.Check 
          type="switch"
          id="visits-switch"
          label={<><i className="fi-settings opacity-60 me-2"></i>Visites de biens immobiliers</>}
          checked={features.visits}
          onChange={() => handleToggle('visits')}
        />
        <Form.Check 
          type="switch"
          id="reservations-switch"
          label={<><i className="fi-settings opacity-60 me-2"></i>Réservation de séjours</>}
          checked={features.reservations}
          onChange={() => handleToggle('reservations')}
        />
        <Form.Check 
          type="switch"
          id="projects-switch"
          label={<><i className="fi-settings opacity-60 me-2"></i>Projets immobiliers</>}
          checked={features.projects}
          onChange={() => handleToggle('projects')}
        />
      </Form>
    </div>
  );
}