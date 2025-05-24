import { useState, useEffect } from 'react';
import PropertyForm from '../PropertyForm'; // Adjust path as necessary
import PropertyPreviewCard from "../PropertyPreviewCard"; // Adjust path as necessary
import { Row, Col, Button } from 'react-bootstrap';

const PropertyFormStep = ({ initialData, initialImages, onSubmit, onBack }) => {
  const [formData, setFormData] = useState(initialData || {});
  const [formImages, setFormImages] = useState(initialImages || []);

  // Update local state if initialData or initialImages props change (e.g., when navigating back)
  useEffect(() => {
    setFormData(initialData || {});
  }, [initialData]);

  useEffect(() => {
    setFormImages(initialImages || []);
  }, [initialImages]);

  const handleDataChange = (currentData, currentImages) => {
    setFormData(currentData);
    setFormImages(currentImages);
  };

  const handleSaveAndContinue = () => {
    // Add any validation logic here if needed before submitting
    onSubmit(formData, formImages);
  };

  return (
    <>
      <Row>
        <Col lg={8} className="mb-4 mb-md-0">
          <PropertyForm
            onDataChange={handleDataChange}
            initialData={formData}
          />
        </Col>
        <Col lg={{ span: 4 }}>
          <div style={{ position: "sticky", top: "20px" }}>
            <PropertyPreviewCard property={formData} images={formImages} />
          </div>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col className="d-flex justify-content-between">
          {onBack && (
            <Button variant="secondary" onClick={onBack} disabled={!onBack}>
              Previous
            </Button>
          )}
          {!onBack && <div />}
          <Button variant="primary" onClick={handleSaveAndContinue}>
            Save and Continue
          </Button>
        </Col>
      </Row>
    </>
  );
};

export default PropertyFormStep;
