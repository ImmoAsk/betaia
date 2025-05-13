"use client";
import React from "react";
import { Card, Row, Col } from "react-bootstrap";
import properties from "./dummy data/propertyData.json";

export default function PropertyAds() {
  const getAdProperties = () => {
    const adsMap = new Map();
    for (const property of properties) {
      const type = property.property_type.toLowerCase().trim();
      if (!adsMap.has(type)) {
        adsMap.set(type, property);
      }
    }
    return Array.from(adsMap.values());
  };

  const adProperties = getAdProperties();

  return (
    <>
      <Row>
        <Col md={12}>
          <h5>popular properties</h5>
          <Row xs={1} sm={2} md={4} className="g-4 mb-3">
            {adProperties.map((property) => (
              <Col key={`ad-${property.property_id}`}>
                <Card
                  style={{
                    cursor: "pointer",
                    height: "25vh",
                    border: "1px solid rgb(10, 252, 252)",
                  }}
                >
                  <Card.Img
                    variant="top"
                    src={property.property_image}
                    alt={property.property_description}
                    style={{
                      height: "80px",
                      objectFit: "cover",
                    }}
                  />
                  <Card.Body>
                    <Card.Text
                      style={{
                        color: "rgb(6, 212, 212)",
                        fontWeight: "bold",
                      }}
                    >
                      {property.property_type} (Ad)
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </>
  );
}
