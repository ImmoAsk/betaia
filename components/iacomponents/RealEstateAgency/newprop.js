"use client";
import React, { useState, useEffect } from "react";
import { Card, Row, Col, Form, Button } from "react-bootstrap";
import properties from "./dummy data/propertyData.json";

const ITEMS_PER_PAGE = 8;

export default function RealEstateProperty({ selectedType }) {
  const [currentPage, setCurrentPage] = useState(1);

  const filteredProperties =
    selectedType === "all"
      ? properties
      : properties.filter(
          (p) =>
            p.property_type.toLowerCase().trim() ===
            selectedType.toLowerCase().trim()
        );

  const totalPages = Math.ceil(filteredProperties.length / ITEMS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedType]);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentProperties = filteredProperties.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <>
      <Row className="mt-4">
        <Col md={12}>
          <Form.Group className="mb-3">
            <Row xs={1} sm={2} md={4} className="g-4">
              {currentProperties.length === 0 ? (
                <Col>
                  <p>No properties found for this category.</p>
                </Col>
              ) : (
                currentProperties.map((property) => (
                  <Col key={property.property_id}>
                    <Card style={{ cursor: "pointer", height: "55vh" }}>
                      <Card.Img
                        variant="top"
                        src={property.property_image}
                        alt={property.property_description}
                        style={{ height: "150px", objectFit: "cover" }}
                      />
                      <Card.Body>
                        <Card.Text>{property.property_type}</Card.Text>
                        <ul className="list-unstyled">
                          <li>
                            <strong>Rent:</strong> {property.property_rent} CFA
                          </li>
                          <li>
                            <strong>Type:</strong> {property.property_type}
                          </li>
                          <li>
                            <strong>Location:</strong>{" "}
                            {property.property_location}
                          </li>
                        </ul>
                      </Card.Body>
                    </Card>
                  </Col>
                ))
              )}
            </Row>
          </Form.Group>
        </Col>
      </Row>

      {totalPages > 1 && (
        <Row className="mt-3">
          <Col className="d-flex justify-content-center">
            <Button
              variant="secondary"
              onClick={() => setCurrentPage((prev) => prev - 1)}
              disabled={currentPage === 1}
              className="me-2"
            >
              Previous
            </Button>
            <span className="align-self-center">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="secondary"
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={currentPage === totalPages}
              className="ms-2"
            >
              Next
            </Button>
          </Col>
        </Row>
      )}
    </>
  );
}
