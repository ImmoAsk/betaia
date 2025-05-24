import { useState, useEffect, useCallback } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  ProgressBar,
  Alert,
} from "react-bootstrap";
import PropertyFormStep from "./steps/PropertyFormStep";
import SelectAgentsStep from "./steps/SelectAgentsStep";
import SocialMediaStep from "./steps/SocialMediaStep";
import CongratulationsStep from "./steps/CongratulationsStep";
import { useRouter } from "next/router";

const STEPS = {
  PROPERTY_FORM: 1,
  SELECT_AGENTS: 2,
  SOCIAL_MEDIA: 3,
  CONGRATULATIONS: 4,
};

const MultiStepPropertyForm = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(STEPS.PROPERTY_FORM);
  const [formData, setFormData] = useState({});
  const [propertyImages, setPropertyImages] = useState([]);
  const [selectedAgents, setSelectedAgents] = useState([]);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSocialConnections, setHasSocialConnections] = useState(false);

  // Helper functions for property categorizations (adapted from PropertyForm.js)
  const getPropertyUsage = (currentFormData) => {
    let usage = 0;
    switch (currentFormData.offer) {
      case "1": // Location
        if (currentFormData.furnished === "1") {
          usage = 5;
        } else if (
          ["8", "9", "10", "11", "12", "19", "20"].includes(
            currentFormData.type
          )
        ) {
          usage = 3;
        } else {
          usage = 1;
        }
        break;
      case "2":
        usage = 7;
        break; // Vente
      case "3":
        usage = 3;
        break; // Colocation
      default:
        usage = 1;
    }
    return usage;
  };

  const getPropertySuperCategorie = (currentFormData) => {
    let super_categorie = "logement";
    switch (currentFormData.offer) {
      case "1": // Location
        if (currentFormData.furnished === "1") {
          super_categorie = "sejour";
        } else if (
          ["8", "9", "11", "12", "19", "29", "30"].includes(
            currentFormData.type
          )
        ) {
          super_categorie = "commercial";
        } else {
          super_categorie = "logement";
        }
        break;
      case "2":
        super_categorie = "acquisition";
        break; // Vente
      case "3":
        super_categorie = "commercial";
        break; // Colocation
      default:
        super_categorie = "logement";
    }
    return super_categorie;
  };

  const getCurrentUserId = () => {
    // In a real application, this would come from a session or auth context.
    // For now, using the same mock user ID as in other API routes for consistency.
    return "mock-user-123";
  };

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem("propertyFormData");
    if (savedData) {
      try {
        setFormData(JSON.parse(savedData));
      } catch (e) {
        console.error("Error parsing formData", e);
        setFormData({});
      }
    }
    const savedImageMetadata = localStorage.getItem(
      "propertyFormImageMetadata"
    );
    if (savedImageMetadata) {
      // Only metadata, not actual files
    }
    const savedAgents = localStorage.getItem("selectedAgents");
    if (savedAgents) {
      try {
        setSelectedAgents(JSON.parse(savedAgents));
      } catch (e) {
        console.error("Error parsing agents", e);
        setSelectedAgents([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("propertyFormData", JSON.stringify(formData));
  }, [formData]);
  useEffect(() => {
    const imageMetadata = propertyImages.map((file) => ({
      name: file.name,
      type: file.type,
      size: file.size,
    }));
    localStorage.setItem(
      "propertyFormImageMetadata",
      JSON.stringify(imageMetadata)
    );
  }, [propertyImages]);
  useEffect(() => {
    localStorage.setItem("selectedAgents", JSON.stringify(selectedAgents));
  }, [selectedAgents]);

  const handleNext = () =>
    setCurrentStep((prev) => Math.min(prev + 1, Object.keys(STEPS).length));
  const handlePrevious = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handlePropertyFormSubmit = (data, images) => {
    setFormData(data);
    setPropertyImages(images);
    handleNext();
  };

  const handleAgentSelectSubmit = (agents) => {
    setSelectedAgents(agents);
    handleNext();
  };

  const handleSocialConnectionsChecked = useCallback((hasConnections) => {
    setHasSocialConnections(hasConnections);
  }, []);

  const handleFinalSubmit = async (
    connectedSocialAccounts,
    isSocialMockMode
  ) => {
    setIsLoading(true);
    setError(null);
    setSubmissionResult(null);

    // 1. Data Transformation (already exists)
    const propertyUsage = getPropertyUsage(formData);
    const propertySuperCategorie = getPropertySuperCategorie(formData);
    const transformedPropertyData = {
      titre: formData.title || "new property",
      offre_id: Number(formData.offer) || 0,
      categorie_id: Number(formData.type) || 0,
      user_id: Number(formData.user_id) || Number(getCurrentUserId()) || 1, // Use current user or default
      pays_id: Number(formData.country) || 228,
      ville_id: Number(formData.town) || 0,
      quartier_id: Number(formData.quarter) || 0,
      adresse_id: formData.address || "",
      piece: Number(formData.bedRooms) || 0,
      salon: Number(formData.livingRooms) || 0,
      surface: Number(formData.area) || 0,
      cout_mensuel: Number(formData.monthPrice) || 0,
      cout_vente: Number(formData.buyPrice) || 0,
      nuitee: Number(formData.dayPrice) || 0,
      part_min_investissement: Number(formData.investmentPrice) || 0,
      garage: Number(formData.parkings) || 0,
      eau: Number(formData.water) || 0,
      electricite: Number(formData.electricity) || 0,
      piscine: Number(formData.pool) || 0,
      gardien_securite: Number(formData.security) || 0,
      cuisine: Number(formData.kitchen) || 0,
      jardin: Number(formData.garden) || 0,
      menage: Number(formData.household) || 0,
      etage: Number(formData.floor) || 0,
      caution_avance: Number(formData.cautionGuarantee) || 0,
      honoraire: Number(formData.honorary) || 0,
      balcon: Number(formData.balcony) || 0,
      terrasse_balcon: Number(formData.terraces) || 0,
      cout_visite: Number(formData.visitRight) || 0,
      wc_douche_interne: String(formData.inBathRooms || "0"),
      wc_douche_externe: String(formData.outBathRooms || "0"),
      est_present_bailleur: Number(formData.owner) || 0,
      est_meuble: Number(formData.furnished) || 0,
      descriptif: formData.description || "",
      conditions_access: formData.otherConditions || "",
      url: null,
      usage: propertyUsage,
      super_categorie: propertySuperCategorie,
      duree_minimale: "180",
      nuo: 4040,
      papier_propriete: " ",
    };

    try {
      // 2. Actual Form Submission (Property Data)
      const submissionFormData = new FormData();
      Object.keys(transformedPropertyData).forEach((key) => {
        if (
          transformedPropertyData[key] !== undefined &&
          transformedPropertyData[key] !== null
        ) {
          submissionFormData.append(key, transformedPropertyData[key]);
        }
      });

      propertyImages.forEach((file, index) => {
        submissionFormData.append(`images[${index}]`, file, file.name);
      });

      const propertyResponse = await fetch("/api/properties", {
        method: "POST",
        body: submissionFormData,
      });

      if (!propertyResponse.ok) {
        const errorData = await propertyResponse
          .json()
          .catch(() => ({
            message: "Property submission failed with non-JSON response.",
          }));
        throw new Error(errorData.message || "Failed to save property.");
      }

      // MODIFIED: Parse property submission response to get ID and imageUrls
      const submissionResponseData = await propertyResponse.json();
      const savedProperty = submissionResponseData.property;

      if (!savedProperty || !savedProperty.id) {
        console.error(
          "Submission response missing property data or ID:",
          submissionResponseData
        );
        throw new Error("Property ID not found in submission response.");
      }
      const propertyId = savedProperty.id;
      const propertyImageUrls = savedProperty.imageUrls || []; // Array of image URLs from API

      // 3. Notify Agents (if submission successful) - Existing logic, ensure propertyDetails uses names
      if (selectedAgents.length > 0) {
        const agentEmails = selectedAgents
          .map((agent) => agent.email)
          .filter(Boolean);
        if (agentEmails.length > 0) {
          try {
            const priceStringForEmail =
              transformedPropertyData.offre_id === 1
                ? `${transformedPropertyData.cout_mensuel} FCFA/mois`
                : `${transformedPropertyData.cout_vente} FCFA`;

            await fetch("/api/notify-agents", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                agentEmails,
                propertyDetails: {
                  id: propertyId,
                  title: String(transformedPropertyData.titre || ""),
                  price: priceStringForEmail,
                  link: `${window.location.origin}/properties/${propertyId}`,
                  address: String(transformedPropertyData.adresse_id || ""),
                  // IMPORTANT: formData.townName and formData.quarterName should be populated by PropertyFormStep/PropertyForm
                  // if you want to display names instead of IDs in the email.
                  // For now, using what's available, which might be IDs if names aren't propagated.
                  town: String(transformedPropertyData.ville_id || ''),
                  quarter: String(transformedPropertyData.quartier_id || ''),
                },
              }),
            });
          } catch (notifyError) {
            console.warn(
              "Agent notification failed, but property was saved:",
              notifyError
            );
          }
        }
      }

      // 4. Social Media Posting (MODIFIED for rich content and new API payload)
      // isSocialMockMode is from SocialMediaStep. If true, it means we're in a UI mock mode for connections.
      // For actual posting, we always want to try real posting if accounts are connected.
      // The backend /api/social/post will handle its own mock state if ENV vars for real SDKs are missing.
      if (connectedSocialAccounts && connectedSocialAccounts.length > 0) {
        const bestFourImages = propertyImageUrls.slice(0, 4);
        const priceStringForSocial =
          transformedPropertyData.offre_id === 1
            ? `${transformedPropertyData.cout_mensuel} FCFA/mois`
            : `${transformedPropertyData.cout_vente} FCFA`;

        // Constructing a more detailed text content for social media
        let socialPostText = `✨ Nouvelle Annonce : ${transformedPropertyData.titre}! ✨\n`;
        socialPostText += `📍 Localisation : ${formData.quarterName || formData.quarter}, ${formData.townName || formData.town}\n`;
        socialPostText += `💰 Prix : ${priceStringForSocial}\n`;
        socialPostText += `🔗 Plus de détails et photos : ${window.location.origin}/properties/${propertyId}\n`;
        socialPostText += `#immobilier #${formData.townName || "propriété"} #${transformedPropertyData.offre_id === 1 ? "location" : "vente"}`;

        for (const account of connectedSocialAccounts) {
          // account from SocialMediaStep, has { id: 'platform_name', ... }
          try {
            const socialPostBody = {
              platform: account.id, // e.g., 'facebook', 'twitter'
              userId: getCurrentUserId(), // Pass the current user ID for the API to find the token
              contentDetails: {
                text: socialPostText,
                link: `${window.location.origin}/properties/${propertyId}`,
                imageUrls: bestFourImages,
                price: priceStringForSocial,
                // Ensure formData.quarterName and formData.townName are available from PropertyForm.js
                district: formData.quarterName || formData.quarter || "",
                town: formData.townName || formData.town || "",
              },
              propertyId: propertyId, // Keep for potential direct use by API or logging
            };

            console.log(
              "Attempting to post to social media:",
              socialPostBody.platform,
              socialPostBody.contentDetails
            );

            await fetch("/api/social/post", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(socialPostBody),
            });
            console.log(
              `Successfully initiated post to ${account.name || account.id}`
            );
          } catch (socialError) {
            console.warn(
              `Failed to initiate post to ${account.name || account.id}:`,
              socialError
            );
          }
        }
      }

      setSubmissionResult({ success: true, propertyId });
      handleNext(); // Move to CongratulationsStep

      localStorage.removeItem("propertyFormData");
      localStorage.removeItem("propertyFormImagesData"); // UPDATED KEY if you implement base64 image storage
      localStorage.removeItem("selectedAgents");
    } catch (err) {
      console.error("Final submission error:", err);
      setError(
        err.message || "An unexpected error occurred during submission."
      );
      setSubmissionResult({ success: false, message: err.message });
      // Don't automatically go to next step on error, stay on SocialMediaStep to show error.
      // setCurrentStep(STEPS.CONGRATULATIONS); // This was likely wrong for error case
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartOver = () => {
    setCurrentStep(STEPS.PROPERTY_FORM);
    setFormData({});
    setPropertyImages([]);
    setSelectedAgents([]);
    setSubmissionResult(null);
    setError(null);
    setHasSocialConnections(false);
    localStorage.removeItem("propertyFormData");
    localStorage.removeItem("propertyFormImageMetadata");
    localStorage.removeItem("selectedAgents");
  };

  const renderStep = () => {
    switch (currentStep) {
      case STEPS.PROPERTY_FORM:
        return (
          <PropertyFormStep
            initialData={formData}
            initialImages={propertyImages}
            onSubmit={handlePropertyFormSubmit}
          />
        );
      case STEPS.SELECT_AGENTS:
        return (
          <SelectAgentsStep
            currentPropertyData={formData}
            initialAgents={selectedAgents}
            onSubmit={handleAgentSelectSubmit}
            onBack={handlePrevious}
          />
        );
      case STEPS.SOCIAL_MEDIA:
        return (
          <SocialMediaStep
            propertyData={formData}
            onConnectionsChecked={handleSocialConnectionsChecked}
            onProceed={handleFinalSubmit}
            onBack={handlePrevious}
          />
        );
      case STEPS.CONGRATULATIONS:
        return (
          <CongratulationsStep
            propertyId={submissionResult?.propertyId}
            onViewProperties={() =>
              alert(
                `Would navigate to properties page. Property ID: ${submissionResult?.propertyId}`
              )
            }
            onCreateAnother={handleStartOver}
          />
        );
      default:
        return <p>Unknown step</p>;
    }
  };

  const totalSteps = Object.keys(STEPS).length;
  const progress = (currentStep / totalSteps) * 100;

  return (
    <Container fluid className="py-5 mt-5 mb-md-4">
      <Row className="justify-content-center">
        <Col md={10} lg={12}>
          <h2 className="mb-4 text-center">List Your Property</h2>
          {currentStep !== STEPS.CONGRATULATIONS && (
            <ProgressBar
              now={progress}
              label={`${Math.round(progress)}%`}
              className="mb-4"
            />
          )}
          {error && currentStep === STEPS.SOCIAL_MEDIA && (
            <Alert variant="danger" onClose={() => setError(null)} dismissible>
              <Alert.Heading>Submission Error</Alert.Heading>
              <p>{error}</p>
            </Alert>
          )}
          <div>{renderStep()}</div>
        </Col>
      </Row>
    </Container>
  );
};

export default MultiStepPropertyForm;
