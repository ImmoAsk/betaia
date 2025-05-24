import { useState, useEffect } from 'react';
import { Button, Form, Card, Alert, Row, Col } from 'react-bootstrap';
import axios from 'axios';

const SelectAgentsStep = ({ currentPropertyData, initialAgents, onSubmit, onBack }) => {
  const [selectedAgents, setSelectedAgents] = useState(initialAgents || []);
  const [availableAgents, setAvailableAgents] = useState([]);
  const [agentsLoading, setAgentsLoading] = useState(true);
  const [agentsError, setAgentsError] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // For the submit button of this step

  useEffect(() => {
    setSelectedAgents(initialAgents || []);
  }, [initialAgents]);

  useEffect(() => {
    const fetchAgents = async () => {
      setAgentsLoading(true);
      try {
        const response = await axios.get('/api/agents');
        setAvailableAgents(response.data || []);
        setAgentsError(null);
      } catch (err) {
        console.error("Error fetching agents:", err.response ? err.response.data : err.message);
        setAgentsError(err.response?.data?.error || "Impossible de charger la liste des agents.");
        setAvailableAgents([]);
      }
      setAgentsLoading(false);
    };
    fetchAgents();
  }, []);

  const handleAgentSelection = (agentId) => {
    setSelectedAgents((prevSelected) => {
      const newSelected = prevSelected.find(a => a.id === agentId)
        ? prevSelected.filter((agent) => agent.id !== agentId)
        : [...prevSelected, availableAgents.find(a => a.id === agentId)];

      if (newSelected.length >= 3) {
        setError(''); // Clear error when condition is met
      }
      return newSelected;
    });
  };

  const handleProceed = () => {
    if (selectedAgents.length < 3) {
      setError('Veuillez sélectionner au moins trois (3) agents immobiliers.');
      return;
    }
    setError('');
    setIsLoading(true); // Should be brief as we are just passing data to parent
    onSubmit(selectedAgents);
    // setIsLoading(false); // Parent component will handle navigation, so loading state might not be needed here for long
  };

  return (
    <Card>
      <Card.Header as="h4" className="text-center">Sélectionner des Agents Immobiliers</Card.Header>
      <Card.Body>
        <p className="text-muted text-center">
          Propriété: {currentPropertyData?.title || 'Détails non disponibles'}<br/>
          Veuillez sélectionner au moins trois (3) agents immobiliers à notifier.
        </p>

        {error && <Alert variant="danger">{error}</Alert>}
        {agentsError && <Alert variant="danger">{agentsError}</Alert>}

        {agentsLoading ? (
          <p className="text-center">Chargement des agents...</p>
        ) : availableAgents.length === 0 && !agentsError ? (
          <p className="text-center">Aucun agent disponible pour le moment.</p>
        ) : (
          <Form>
            {availableAgents.map((agent) => (
              <Form.Group key={agent.id} controlId={`agent-${agent.id}`} className="mb-3 p-2 border rounded">
                <Form.Check
                  type="checkbox"
                  id={`agent-checkbox-${agent.id}`}
                  label={
                    <div>
                      <strong>{agent.name}</strong>
                      <small className="d-block text-muted">Email: {agent.email} | Propriétés gérées: {agent.propertiesManaged}</small>
                    </div>
                  }
                  checked={selectedAgents.some(a => a.id === agent.id)}
                  onChange={() => handleAgentSelection(agent.id)}
                  className="agent-checkbox"
                  disabled={isLoading}
                />
              </Form.Group>
            ))}
          </Form>
        )}
      </Card.Body>
      <Card.Footer>
        <Row>
          <Col className="d-flex justify-content-between">
            <Button variant="secondary" onClick={onBack} disabled={isLoading}>
              Précédent
            </Button>
            <Button
              variant="primary"
              onClick={handleProceed}
              disabled={selectedAgents.length < 3 || isLoading || agentsLoading}
            >
              {isLoading ? 'Chargement...' : 'Valider et Continuer'}
            </Button>
          </Col>
        </Row>
      </Card.Footer>
      <style jsx>{`
        .agent-checkbox .form-check-label {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          width: 100%; /* Ensure label takes full width for better clickability */
        }
        .agent-checkbox .form-check-label strong {
          margin-bottom: 0.25rem;
        }
      `}</style>
    </Card>
  );
};

export default SelectAgentsStep;
