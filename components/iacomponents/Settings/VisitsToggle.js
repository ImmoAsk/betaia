// components/settings/VisitsToggle.js
import React, { useState } from 'react';
import { Form } from 'react-bootstrap';

export default function VisitsToggle() {
  const [enabled, setEnabled] = useState(true);

  return (
    <div>
      <h5>Disponibilité des visites immobilières</h5>
      <Form>
        <Form.Check 
          type="switch" 
          id="visits-switch" 
          label={enabled ? 'Disponibles' : 'Indisponibles'} 
          checked={enabled} 
          onChange={() => setEnabled(!enabled)} 
        />
      </Form>
    </div>
  );
}