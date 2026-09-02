
import React from 'react';
import { Row, Col } from 'react-bootstrap';

import RealEstateOrgForm from '../../components/iacomponents/Settings/RealEstateOrgFrom';
import FeaturesToggle from '../../components/iacomponents/Settings/FeaturesToggle';
import VisitsToggle from '../../components/iacomponents/Settings/VisitsToggle';
import RealEstateAccountLayout from '../../components/partials/RealEstateAccountLayout';
import RealEstatePageLayout from '../../components/partials/RealEstatePageLayout';
import { useSession, getSession } from 'next-auth/react';
export default function SettingsPage() {
    const { data: session } = useSession();
    const role = session?.user?.roleId;
  return (
    <RealEstatePageLayout pageTitle='Paramètres' activeNav='VisitProperties' userLoggedIn>
        <RealEstateAccountLayout accountPageTitle='Paramètres'>
            
            <Row>
                {(role === '1200' || role === '1233' || role === '1234' || role === '1235' || role === '1232') && (
                <Col md={4} className="mb-4">
                    <RealEstateOrgForm />
                </Col>)}
                <Col md={4} className="mb-4">
     
                    <FeaturesToggle />
                   
                </Col>
                <Col md={4} className="mb-4">
                
                    <VisitsToggle />
                    
                </Col>
            </Row>
            
        </RealEstateAccountLayout>
    </RealEstatePageLayout>
  );
}
