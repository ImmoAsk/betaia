import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Spinner } from 'react-bootstrap';
import { useRessourceByRole } from '../../../customHooks/realEstateHooks';
import { useSession } from 'next-auth/react';
import { API_URL } from '../../../utils/settings';

export default function FeaturesToggle() {
  const { data: session } = useSession();
  const roleId = Number(session?.user?.roleId);
  const userId = session?.user?.id;

  const { data: ressources, isLoading, error } = useRessourceByRole(roleId);

  const [features, setFeatures] = useState({});

  useEffect(() => {
    if (ressources) {
      const initialState = {};
      ressources.forEach(({ ressource }) => {
        const key = ressource.id;
        if (ressource.statut > 0) {
          initialState[key] = true; // ou false selon la logique par défaut
        }
      });
      setFeatures(initialState);
    }
  }, [ressources]);

  const handleToggle = (key) => {
    setFeatures((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const ressourcesPayload = ressources
    .filter(r => r.ressource.statut > 0)
    .map((r) => ({
      ressource_id: r.ressource.id,
      status: features[r.ressource.id] ? 1 : 0
    }));

    const visibleRessourceIds = ressourcesPayload
      .filter((r) => r.status === 1)
      .map((r) => r.ressource_id);

    const query = `
      mutation SaveRessourceVisibilite($input: RessourceVisibiliteInput!) {
        saveRessourceVisibilite(input: $input) {
          status
          message
        }
      }
    `;

    const variables = {
      input: {
        user_id: Number(userId),
        ressources: ressourcesPayload,
      }
    };
    console.log(JSON.stringify({ query, variables }, null, 2));

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query, variables })
      });

      const result = await response.json();
      const feedback = result?.data?.saveRessourceVisibilite;

      if (feedback?.status) {
        console.log('✅ Visibilité enregistrée avec succès.');
      } else {
        console.warn('⚠️', feedback?.message || 'Erreur lors de l’enregistrement.');
      }
    } catch (error) {
      console.error('❌ Erreur GraphQL :', error);
    }
  };

  const handleCancel = () => {
    console.log('❎ Changements annulés');
    // Optionnel : reset state ou fermeture modal
  };

  return (
    <Card>
      <Card.Header>
        <h5 className="mb-0">Visibilité des fonctionnalités</h5>
      </Card.Header>

      <Card.Body>
        {isLoading ? (
          <div className="text-center">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : error ? (
          <p className="text-danger">Erreur lors du chargement des fonctionnalités disponibles.</p>
        ) : (
          <Form onSubmit={handleSubmit}>
            {ressources?.map(({ ressource }) => {
              const key = ressource.id;

              if (ressource.statut > 0) {
                return (
                  <div key={key} className="d-flex align-items-center justify-content-between mb-3">
                    <div className="d-flex align-items-center gap-2">
                      <i className={ressource.icone} style={{ fontSize: '1.2rem' }}></i>
                      <span>{ressource.ressourceName}</span>
                    </div>
                    <Form.Check
                      type="switch"
                      id={`switch-${key}`}
                      checked={features[key] || false}
                      onChange={() => handleToggle(key)}
                    />
                  </div>
                );
              }

              return null;
            })}
          </Form>
        )}
      </Card.Body>

      <Card.Footer className="d-flex justify-content-end gap-2">
        <Button variant="secondary" onClick={handleCancel}>Annuler</Button>
        <Button variant="primary" type="submit" onClick={handleSubmit}>Enregistrer</Button>
      </Card.Footer>
    </Card>
  );
}
