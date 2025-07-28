//create a Nextjs component for the settings page of a Telegram bot
//this component should have 3 card section per row
//Section 1: Mise a jour de l'agence immobilière
//Section 2: Visibilite des fonctionnalités
//Section 3: Disonibilité des visites immobilières
//Section 1 is a form to update the agency information: name, address, phone number, email,logo
//Section 2 is a toggle to enable or disable features
//Section 3 is a toggle to enable or disable property visits
// pages/settings.js
import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

import RealEstateOrgForm from '../../components/iacomponents/Settings/RealEstateOrgFrom';
import FeaturesToggle from '../../components/iacomponents/Settings/FeaturesToggle';
import VisitsToggle from '../../components/iacomponents/Settings/VisitsToggle';
import RealEstateAccountLayout from '../../components/partials/RealEstateAccountLayout';
import RealEstatePageLayout from '../../components/partials/RealEstatePageLayout';
export default function SettingsPage() {
  return (
    <RealEstatePageLayout pageTitle='Paramètres' activeNav='VisitProperties' userLoggedIn>
        <RealEstateAccountLayout accountPageTitle='Paramètres'>
            <Container className="py-4">
            <Row>
                <Col md={4} className="mb-4">
                <Card>
                    <Card.Body>
                    <RealEstateOrgForm />
                    </Card.Body>
                </Card>
                </Col>
                <Col md={4} className="mb-4">
                <Card>
                    <Card.Body>
                    <FeaturesToggle />
                    </Card.Body>
                </Card>
                </Col>
                <Col md={4} className="mb-4">
                <Card>
                    <Card.Body>
                    <VisitsToggle />
                    </Card.Body>
                </Card>
                </Col>
            </Row>
            </Container>
        </RealEstateAccountLayout>
    </RealEstatePageLayout>
  );
}
