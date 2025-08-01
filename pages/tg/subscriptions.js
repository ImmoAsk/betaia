import RealEstatePageLayout from '../../components/partials/RealEstatePageLayout'
import Link from 'next/link'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Breadcrumb from 'react-bootstrap/Breadcrumb'
import Button from 'react-bootstrap/Button'
import FormCheck from 'react-bootstrap/FormCheck'
import Card from 'react-bootstrap/Card'
import PricingPlan from '../../components/PricingPlan'

const MarketplaceSubscriptionPage = () => {

  return (
    <RealEstatePageLayout
      pageTitle='Plan tarifaire des abonnements agents immobiliers sur ImmoAsk Marketplace'
      activeNav='Vendor'
      userLoggedIn
    >

      {/* Page container */}
      <Container className='mt-5 mb-md-4 py-5'>

        {/* Breadcrumb */}
        <Breadcrumb className='mb-3 pt-2 pt-lg-3'>
          <Link href='/tg' passHref>
            <Breadcrumb.Item>Accueil</Breadcrumb.Item>
          </Link>
          <Link href='/tg/add-property' passHref>
            <Breadcrumb.Item>Lister votre immeuble</Breadcrumb.Item>
          </Link>
          <Breadcrumb.Item active>Abonnements</Breadcrumb.Item>
        </Breadcrumb>

        {/* Page title */}
        <h1 className='h2 mb-4'>Tarification des abonnements agents immobiliers</h1>
        <p className='pb-2 mb-4'>
          Les 3 types d'abonnements s'adressent exclusivement aux agents immobiliers qui souhaitent : <br />
          Devenir de véritables professionnels du secteur. <br />
          Augmenter leur base clientèle d'au moins 35 %.<br />
          Tripler leur chiffre d'affaires.<br />
          Éliminer les tâches manuelles de marketing en ligne.<br />
          Tirer parti des avancées de l'IA dans l'immobilier.<br />
          Encaisser leurs revenus via des moyens de paiement modernes.
        </p>


        {/* Pricing plans */}
        <Row>
          <Col md={4} className='mb-4'>
            <PricingPlan
              image={{
                src: '/images/pricing/icon-3.svg',
                width: '72',
                height: '88',
                alt: 'Icon'
              }}
              title='Junior'
              price='XOF 63 665.99'
              period='an'
              options={[
                { title: 'Mise en location d\'au moins 25 biens immobiliers', available: true },
                { title: 'Mise en vente d\'au moins 25 biens immobiliers', available: true },
                { title: 'Mise en colocation d\'au moins 25 biens immobiliers', available: true },
                { title: 'Accès complet aux dossiers des futurs locataires et acquéreurs', available: true },
                { title: 'Encaissement des droits de visite si effectif (**)', available: true },
                { title: 'Accès de 1 semaine au social marketing automation', available: true },
                { title: 'Accès à toutes les notifications clientèle sur WhatsApp', available: true },
                { title: 'Sponsoriser 1 bien immobilier en une semaine par trimestre', available: true },
                { title: 'Accès en 1 semaine à ImmoAsk Intuition', available: true },
                { title: 'Accès total aux honoraires clients', available: true },
                { title: 'Gestion de compte propriétaire (*)', available: false },
                { title: 'Accès gratuit à ImmoAsk State', available: true },
                { title: 'Accompagnement général sur le marketing immobilier', available: true },
                { title: 'Accès partiel à ImmoAsk Business', available: true },
                { title: 'Encaissement des honoraires des séjours meublés', available: true },
                { title: 'Showcase de votre carte de professionnel immobilier', available: false },
                { title: 'Exposition de votre tableau immobilier au public		', available: false },
                { title: 'Traitement des demandes immobilières en exclusivité', available: false }
              ]}
              button={{
                href: '#',
                title: 'Souscrire maintenant',
                variant: 'outline-primary',
                props: {
                  onClick: () => console.log('You have chosen Turbo Boost plan')
                }
              }}
              className='shadow-sm'
            />
          </Col>
          <Col sm={6} md={4} className='mb-4'>


            <PricingPlan
              image={{
                src: '/images/pricing/icon-1.svg',
                width: '72',
                height: '88',
                alt: 'Icon'
              }}
              title='Senior'
              price='XOF 92 954.99'
              period='an'
              options={[
                { title: 'Mise en location d\'au moins 50 biens immobiliers', available: true },
                { title: 'Mise en vente d\'au moins 50 biens immobiliers', available: true },
                { title: 'Mise en colocation d\'au moins 50 biens immobiliers', available: true },
                { title: 'Accès complet aux dossiers des futurs locataires et acquéreurs', available: true },
                { title: 'Encaissement des droits de visite si effectif (**)', available: true },
                { title: 'Accès de 3 semaines au social marketing automation', available: true },
                { title: 'Accès à toutes les notifications clientèle sur WhatsApp', available: true },
                { title: 'Sponsoriser 3 biens immobiliers en une semaine par trimestre', available: true },
                { title: 'Accès en 3 semaines à ImmoAsk Intuition', available: true },
                { title: 'Accès total aux honoraires clients', available: true },
                { title: 'Accès gratuit à ImmoAsk State', available: true },
                { title: 'Accompagnement général sur le marketing immobilier', available: true },
                { title: 'Accès partiel à ImmoAsk Business', available: true },
                { title: 'Encaissement des honoraires des séjours meublés', available: true },
                { title: 'Showcase de votre carte de professionnel immobilier', available: true },
                { title: 'Exposition de votre tableau immobilier au public		', available: false },
                { title: 'Traitement des demandes immobilières en exclusivité (3)', available: true }
              ]}
              button={{
                href: '#',
                title: 'Souscrire maintenant',
                variant: 'outline-primary',
                props: {
                  onClick: () => console.log('You have chosen Easy Start plan')
                }
              }}
              className='shadow-sm'
            />
          </Col>
          <Col sm={6} md={4} className='mb-4'>
            <PricingPlan
              featured
              image={{
                src: '/images/pricing/icon-2.svg',
                width: '72',
                height: '88',
                alt: 'Icon'
              }}
              title='Guru'
              price='XOF 134 345.99'
              period='an'
              options={[
                { title: 'Mise en location d\'au moins 75 biens immobiliers', available: true },
                { title: 'Mise en vente d\'au moins 75 biens immobiliers', available: true },
                { title: 'Mise en colocation d\'au moins 75 biens immobiliers', available: true },
                { title: 'Accès complet aux dossiers des futurs locataires et acquéreurs', available: true },
                { title: 'Encaissement des droits de visite si effectif (**)', available: true },
                { title: 'Accès illimite au social marketing automation', available: true },
                { title: 'Accès à toutes les notifications clientèles sur WhatsApp', available: true },
                { title: 'Sponsoriser 5 biens immobiliers en une semaine par trimestre', available: true },
                { title: 'Accès illimite à ImmoAsk Intuition', available: true },
                { title: 'Accès total aux honoraires clients', available: true },
                { title: 'Accès gratuit à ImmoAsk State', available: true },
                { title: 'Accompagnement général sur le marketing immobilier', available: true },
                { title: 'Accès partiel à ImmoAsk Business', available: true },
                { title: 'Encaissement des honoraires des séjours meublés', available: true },
                { title: 'Showcase de votre carte de professionnel immobilier', available: true },
                { title: 'Exposition de votre tableau immobilier au public		', available: true },
                { title: 'Traitement des demandes immobilières en exclusivité (1)', available: true }
              ]}
              button={{
                href: '#',
                title: 'Souscrire maintenant',
                variant: 'primary',
                props: {
                  onClick: () => console.log('You have chosen Fast Sale plan')
                }
              }}
            />
          </Col>

        </Row>
        <div className='text-end pt-4 pb-2'>
          <Button size='lg' variant='primary btn-lg'>Acheter maintenant</Button>
        </div>
      </Container>
    </RealEstatePageLayout>
  )
}

export default MarketplaceSubscriptionPage
