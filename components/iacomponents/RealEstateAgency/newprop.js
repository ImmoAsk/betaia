"use client";
import React from "react";
import { Card, Row, Col, Form } from "react-bootstrap";
import properties from "./dummy data/propertyData.json";

export default function RealEstateProperty({ selectedType }) {
  const filteredProperties =
    selectedType === "all"
      ? properties
      : properties.filter(
          (p) =>
            p.property_type.toLowerCase().trim() ===
            selectedType.toLowerCase().trim()
        );

  return (
    <Row className="mt-4">
      <Col md={12}>
        <Form.Group className="mb-3">
          <Row xs={1} sm={2} md={4} className="g-4">
            {filteredProperties.length === 0 ? (
              <Col>
                <p>No properties found for this category.</p>
              </Col>
            ) : (
              filteredProperties.map((property) => (
                <Col key={property.property_id}>
                  <Card style={{ cursor: "pointer", height: "45vh" }}>
                    <Card.Img
                      variant="top"
                      src={property.property_image}
                      alt={property.property_description}
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
  );
}
