"use client";
import React, { useState, useEffect } from "react";
import {  Row, Col, Button } from "react-bootstrap";
import PropertyCard from "../../PropertyCard";
import { buildPropertiesArray } from "../../../utils/generalUtils";

const ITEMS_PER_PAGE = 8;

export default function RealEstateProperty({ selectedType, orgProperties }) {
  const [currentPage, setCurrentPage] = useState(1);

  const formattedProperties = buildPropertiesArray(orgProperties);
  const filteredProperties =
    selectedType === "all"
      ? formattedProperties
      : formattedProperties.filter(
        (p) =>
          p.category.toLowerCase().trim() ===
          selectedType.toLowerCase().trim()
      );

  const totalPages = Math.ceil(orgProperties.length / ITEMS_PER_PAGE);

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
      <Row className="mt-2">
        <Col md={12}>
         
            <Row xs={1} sm={2} md={4} className="g-4">
              {currentProperties.length === 0 ? (
                <Col>
                  <p>Aucun bien immobilier disponible.</p>
                </Col>
              ) : (
                currentProperties.map((property) => (
                  <Col key={property.id}>
                    <PropertyCard
                      href={property.href}
                      images={property.images}
                      title={property.title}
                      category={property.category}
                      location={property.location}
                      price={property.price}
                      badges={property.badges}
                      wishlistButton={{
                        tooltip: 'Ajouter à la liste de visite',
                        props: {
                          onClick: () => console.log('Property added to your Wishlist!')
                        }
                      }}
                      footer={[
                        ['fi-bed', property.amenities[0]],
                        ['fi-bath',property.amenities[1]],
                        ['fi-car', property.amenities[2]]
                      ]}
                      className='h-100 mx-2'
                    />
                  </Col>
                ))
              )}
            </Row>
          
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
              Precedent
            </Button>
            <span className="align-self-center">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="secondary"
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={currentPage === totalPages}
              className="ms-2"
            >
              Suivant
            </Button>
          </Col>
        </Row>
      )}
    </>
  );
}
