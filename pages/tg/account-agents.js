import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Alert from "react-bootstrap/Alert";
import Modal from "react-bootstrap/Modal";
import { getSession } from "next-auth/react";
import Link from "next/link";
import axios from "axios";
import { API_URL } from '../../utils/settings';
import RealEstatePageLayout from '../../components/partials/RealEstatePageLayout'
import RealEstateAccountLayout from '../../components/partials/RealEstateAccountLayout'

// Mock function to simulate checking social media connections
// In a real app, this would involve an API call or checking localStorage/context
const checkSocialMediaConnections = async () => {
  console.log("Checking social media connections (mock)...");
  await new Promise((resolve) => setTimeout(resolve, 300)); // Simulate delay
  // Change this to false to test the modal
  const isConnected = true; // Math.random() > 0.5;
  console.log("Social media connected (mock):", isConnected);
  return isConnected;
};

// Mock database for agents
const agentsStore = [
  { id: 'agent1', name: 'Alice Immobilier', email: 'alice@example.com', propertiesManaged: 120, specialty: ['Location', 'Vente'] },
  { id: 'agent2', name: 'Bob Conseil Agence', email: 'bob@example.com', propertiesManaged: 95, specialty: ['Vente'] },
  { id: 'agent3', name: 'Charlie Logements', email: 'charlie@example.com', propertiesManaged: 200, specialty: ['Location', 'Gestion'] },
  { id: 'agent4', name: 'Diana Biens & Services', email: 'diana@example.com', propertiesManaged: 75, specialty: ['Location'] },
  { id: 'agent5', name: 'Eva Propriétés', email: 'eva@example.com', propertiesManaged: 150, specialty: ['Vente', 'Luxe'] },
  { id: 'agent6', name: 'Franco Services Immo', email: 'franco@example.com', propertiesManaged: 110, specialty: ['Location', 'Vente', 'Commercial'] },
  { id: 'agent7', name: 'Gaston Gestion Locative', email: 'gaston@example.com', propertiesManaged: 180, specialty: ['Gestion'] },
  { id: 'agent8', name: 'Hélène Habitat Conseil', email: 'helene@example.com', propertiesManaged: 130, specialty: ['Vente', 'Neuf'] },
];

const SelectAgentsPage = () => {
  const router = useRouter();
  const { propertyId } = router.query; // Get propertyId from query

  const [selectedAgents, setSelectedAgents] = useState([]);
  const [availableAgents, setAvailableAgents] = useState(agentsStore); // To store fetched agents
  const [agentsLoading, setAgentsLoading] = useState(false);
  const [agentsError, setAgentsError] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSocialModal, setShowSocialModal] = useState(false);

  const [propertyDetails, setPropertyDetails] = useState(null); // State for property details
  const [propertyLoading, setPropertyLoading] = useState(true);
  const [propertyError, setPropertyError] = useState(null);

  const handleAgentSelection = (agentId) => {
    setSelectedAgents((prevSelected) =>
      prevSelected.includes(agentId)
        ? prevSelected.filter((id) => id !== agentId)
        : [...prevSelected, agentId]
    );
    if (
      error &&
      selectedAgents.length + (prevSelected.includes(agentId) ? -1 : 1) >= 2
    ) {
      setError("");
    }
  };

  const proceedToCongratulations = () => {
    router.push(`/tg/account-propertycongrats?propertyId=${propertyId}`);
  };

  const handleCompleteProcess = async () => {
    if (selectedAgents.length < 3) {
      setError("Veuillez sélectionner au moins trois (3) agents immobiliers.");
      return;
    }
    setError("");
    setIsLoading(true);

    if (!propertyDetails) {
      setError(
        "Les détails de la propriété n'ont pas pu être chargés. Veuillez réessayer."
      );
      setIsLoading(false);
      return;
    }

    try {
      // 1. Notify agents
      const agentEmailsToNotify = selectedAgents
        .map((agentId) => {
          const agent = availableAgents.find((a) => a.id === agentId);
          return agent?.email;
        })
        .filter((email) => email);

      if (agentEmailsToNotify.length > 0) {
        console.log("Notifying agents:", agentEmailsToNotify);
        // Use actual property details for email if available
        const emailPropertyDetails = {
          title:
            propertyDetails.title || `Propriété ID: ${propertyId || "N/A"}`,
          price:
            propertyDetails.offerType === "1"
              ? `${Number(
                  propertyDetails.monthPrice || 0
                ).toLocaleString()} FCFA/mois`
              : `${Number(
                  propertyDetails.buyPrice || 0
                ).toLocaleString()} FCFA`,
          district:
            propertyDetails.quarterName ||
            propertyDetails.quarter ||
            "Quartier non spécifié",
          town:
            propertyDetails.townName ||
            propertyDetails.town ||
            "Ville non spécifiée",
          link: `${window.location.origin}/properties/${propertyId || "view"}`,
        };

        await fetch("/api/notify-agents", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            agentEmails: agentEmailsToNotify,
            propertyDetails: emailPropertyDetails,
          }),
        });
        console.log("Agent notification API call made.");
      }

      // 2. Check social media connections
      const socialConnected = await checkSocialMediaConnections();

      if (!socialConnected) {
        setShowSocialModal(true);
        setIsLoading(false);
        return; // Stop here, user needs to connect social media
      }

      // 3. Generate and (Mock) Post to social media
      const emailPropertyDetails = {
        title: propertyDetails.title || `Propriété ID: ${propertyId || "N/A"}`,
        price:
          propertyDetails.offerType === "1"
            ? `${Number(
                propertyDetails.monthPrice || 0
              ).toLocaleString()} FCFA/mois`
            : `${Number(propertyDetails.buyPrice || 0).toLocaleString()} FCFA`,
        district:
          propertyDetails.quarterName ||
          propertyDetails.quarter ||
          "Quartier non spécifié",
        town:
          propertyDetails.townName ||
          propertyDetails.town ||
          "Ville non spécifiée",
        link: `${window.location.origin}/properties/${propertyId || "view"}`,
      };

      const socialMediaContent = {
        message: `Nouvelle propriété disponible ! ${
          propertyDetails.title
        }. Située à ${
          propertyDetails.townName || propertyDetails.town
        }, quartier ${
          propertyDetails.quarterName || propertyDetails.quarter
        }. Prix: ${emailPropertyDetails.price}. Plus de détails ici: ${
          emailPropertyDetails.link
        }`,
        images: propertyDetails.images?.slice(0, 4) || [
          "https://via.placeholder.com/600x400.png?text=Image+Propriété+1",
          "https://via.placeholder.com/600x400.png?text=Image+Propriété+2",
          "https://via.placeholder.com/600x400.png?text=Image+Propriété+3",
          "https://via.placeholder.com/600x400.png?text=Image+Propriété+4",
        ],
        price: emailPropertyDetails.price,
        location: `${propertyDetails.quarterName || propertyDetails.quarter}, ${
          propertyDetails.townName || propertyDetails.town
        }`,
        link: emailPropertyDetails.link,
      };

      console.log("Simulating social media post for property:", propertyId);
      console.log("Generated Content for social media:", socialMediaContent);
      await new Promise((resolve) => setTimeout(resolve, 700)); // Simulate social media posting delay

      // 4. Navigate to congratulations page
      proceedToCongratulations();
    } catch (err) {
      console.error("Error during complete process:", err);
      setError("Une erreur est survenue. Veuillez réessayer.");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (router.isReady && !propertyId) {
      console.warn("Property ID is missing from query params.");
    }
  }, [router.isReady, propertyId]);

  // Fetch property details when propertyId is available
  useEffect(() => {
    const fetchPropertyDetails = async () => {
      if (propertyId) {
        setPropertyLoading(true);
        try {
          const response = await axios.get(`/api/properties/${propertyId}`);
          setPropertyDetails(response.data);
          setPropertyError(null);
        } catch (err) {
          console.error(
            "Error fetching property details:",
            err.response ? err.response.data : err.message
          );
          setPropertyError(
            err.response?.data?.error ||
              "Impossible de charger les détails de la propriété."
          );
          setPropertyDetails(null);
        }
        setPropertyLoading(false);
      }
    };
    fetchPropertyDetails();
  }, [propertyId]);

  // Fetch agents on component mount
  useEffect(() => {
    const fetchAgents = async () => {
      setAgentsLoading(true);
      try {
        console.log("Fetching agents from /api/agents...");
        const response = await axios.get("/api/agents");
        setAvailableAgents(response.data || []);
        setAgentsError(null);
      } catch (err) {
        console.error(
          "Error fetching agents:",
          err.response ? err.response.data : err.message
        );
        setAgentsError(
          err.response?.data?.error ||
            "Impossible de charger la liste des agents."
        );
        setAvailableAgents([]);
      }
      setAgentsLoading(false);
    };

    // fetchAgents();
  }, []);

  return (
    <RealEstatePageLayout
      pageTitle="Select Agents"
      activeNav="Account"
      userLoggedIn
    >
      <RealEstateAccountLayout accountPageTitle="Select Agents">
        <Container className="py-5 mt-5 mb-md-4">
          <Row className="justify-content-center">
            <Col md={10} lg={8}>
              <Card>
                <Card.Header as="h2" className="text-center">
                  Sélectionner des Agents Immobiliers
                </Card.Header>
                <Card.Body>
                  <p className="text-muted text-center">
                    ID de la propriété: {propertyId || "Chargement..."}
                    <br />
                    Veuillez sélectionner au moins trois (3) agents immobiliers
                    à notifier pour votre nouvelle propriété.
                  </p>
                  {propertyLoading && (
                    <Alert variant="info">
                      Chargement des détails de la propriété...
                    </Alert>
                  )}
                  {propertyError && (
                    <Alert variant="danger">{propertyError}</Alert>
                  )}
                  {propertyDetails && (
                    <Alert variant="success" className="mb-3">
                      <Alert.Heading>
                        Détails de la propriété: {propertyDetails.title}
                      </Alert.Heading>
                      <p>
                        <strong>Prix:</strong>{" "}
                        {propertyDetails.offerType === "1"
                          ? `${Number(
                              propertyDetails.monthPrice || 0
                            ).toLocaleString()} FCFA/mois`
                          : `${Number(
                              propertyDetails.buyPrice || 0
                            ).toLocaleString()} FCFA`}
                        <br />
                        <strong>Lieu:</strong>{" "}
                        {propertyDetails.townName || propertyDetails.town},{" "}
                        {propertyDetails.quarterName || propertyDetails.quarter}
                      </p>
                    </Alert>
                  )}
                  {error && <Alert variant="danger">{error}</Alert>}
                  {agentsError && <Alert variant="danger">{agentsError}</Alert>}
                  {agentsLoading ? (
                    <p className="text-center">Chargement des agents...</p>
                  ) : availableAgents.length === 0 && !agentsError ? (
                    <p className="text-center">
                      Aucun agent disponible pour le moment.
                    </p>
                  ) : (
                    <Form>
                      {availableAgents.map((agent) => (
                        <Form.Group
                          key={agent.id}
                          controlId={`agent-${agent.id}`}
                          className="mb-3"
                        >
                          <Form.Check
                            type="checkbox"
                            id={`agent-checkbox-${agent.id}`}
                            label={
                              <div>
                                <strong>{agent.name}</strong>
                                <small className="d-block text-muted">
                                  Email: {agent.email} | Propriétés gérées:{" "}
                                  {agent.propertiesManaged}
                                </small>
                              </div>
                            }
                            checked={selectedAgents.includes(agent.id)}
                            onChange={() => handleAgentSelection(agent.id)}
                            className="agent-checkbox"
                            disabled={isLoading}
                          />
                        </Form.Group>
                      ))}
                      <div className="d-grid gap-2 mt-4">
                        <Button
                          variant="primary"
                          size="lg"
                          onClick={handleCompleteProcess}
                          disabled={selectedAgents.length < 3 || isLoading}
                        >
                          {isLoading
                            ? "Traitement en cours..."
                            : "Terminer le processus"}
                        </Button>
                      </div>
                    </Form>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Social Media Connection Modal */}
          <Modal
            show={showSocialModal}
            onHide={() => setShowSocialModal(false)}
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>Connecter un Compte Social</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>
                Pour compléter le processus et publier votre propriété sur les
                réseaux sociaux, veuillez connecter au moins un compte social.
              </p>
              <p>Vous serez redirigé pour connecter vos comptes.</p>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => setShowSocialModal(false)}
              >
                Plus tard
              </Button>
              <Link href="/tg/account-socialmedia" passHref legacyBehavior>
                <Button variant="primary" as="a">
                  Connecter Maintenant
                </Button>
              </Link>
            </Modal.Footer>
          </Modal>

          <style jsx>{`
            .agent-checkbox .form-check-label {
              display: flex;
              flex-direction: column;
              align-items: flex-start;
            }
            .agent-checkbox .form-check-label strong {
              margin-bottom: 0.25rem;
            }
          `}</style>
        </Container>
      </RealEstateAccountLayout>
    </RealEstatePageLayout>
  );
};

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }
  return {
    props: { session, query: context.query },
  };
}

export default SelectAgentsPage;