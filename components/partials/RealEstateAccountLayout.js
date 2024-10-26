import { useState } from 'react'
import Link from 'next/link'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Breadcrumb from 'react-bootstrap/Breadcrumb'
import Button from 'react-bootstrap/Button'
import Collapse from 'react-bootstrap/Collapse'
import Avatar from '../Avatar'
import StarRating from '../StarRating'
import CardNav from '../CardNav'
import { getSession, useSession } from 'next-auth/react'
import { useRessourceByRole } from '../../customHooks/realEstateHooks'

const RealEstateAccountLayout = ({ accountPageTitle, children }) => {

  // State to control Collapse
  const [open, setOpen] = useState(false)

  const locataire = [
    {
      id: 1,
      accessStatut: 1,
      ressourceName: 'Paiement de loyers',
      resourcelink: '/tg/account-help',
      icon: 'fi-help'
    },
    {
      id: 2,
      accessStatut: 1,
      ressourceName: 'Tableau immobilier',
      resourcelink: '/tg/account-properties',
      icon: 'fi-home'
    },
    {
      id: 3,
      accessStatut: 1,
      ressourceName: 'Notifications',
      resourcelink: '/tg/account-notifications',
      icon: 'fi-bell'
    },
    {
      id: 4,
      accessStatut: 1,
      ressourceName: 'Biens immobiliers à visiter',
      resourcelink: '/tg/account-wishlist',
      icon: 'fi-heart'
    },
    {
      id: 5,
      accessStatut: 1,
      ressourceName: 'Mon logement actuel',
      resourcelink: '/tg/account-location',
      icon: 'fi-home'
    },
    {
      id: 6,
      accessStatut: 1,
      ressourceName: 'Assurance immobilière',
      resourcelink: '/tg/account-insurance',
      icon: 'fi-home'
    }
  ];
  const { data: session } = useSession();
  //console.log(session);
  const roleId = Number(session && session.user?.roleId);
  //console.log(roleId);
  const { data: ressources, isLoading, error } = useRessourceByRole(session ? roleId : 0);
  //console.log(session);

  return (
    <Container fluid className='pt-5 pb-lg-4 mt-5 mb-sm-2'>

      {/* Breadcrumb */}
      <Breadcrumb className='mb-4 pt-md-3'>
        <Link href='/tg' passHref>
          <Breadcrumb.Item>Accueil</Breadcrumb.Item>
        </Link>
        <Link href='/tg/account-info' passHref>
          <Breadcrumb.Item>Compte</Breadcrumb.Item>
        </Link>
        <Breadcrumb.Item active>{accountPageTitle}</Breadcrumb.Item>
      </Breadcrumb>

      <Row>

        {/* Sidebar (Account nav) */}
        <Col md={5} lg={3} className='pe-xl-4 mb-5'>
          <div className='card card-body border-0 shadow-sm pb-1 me-lg-1'>
            <div className='d-flex d-md-block d-lg-flex align-items-start pt-lg-2 mb-4'>
              <Avatar img={{ src: '/images/avatars/45.jpg', alt: 'ImmoAsk' }} size={[48, 48]} />
              <div className='pt-md-2 pt-lg-0 ps-3 ps-md-0 ps-lg-3'>
                <h2 className='fs-lg mb-0'>{session ? session.user?.name : " "}</h2>
                <StarRating rating={4.8} />
                <ul className='list-unstyled fs-sm mt-3 mb-0'>
                  <li>
                    <a href='tel:+22870453625' className='nav-link fw-normal p-0'>
                      <i className='fi-phone opacity-60 me-2'></i>
                      {session ? session.user?.phone : "(+228) 7045 3625"}
                    </a>
                  </li>
                  <li>
                    <a href='mailto:contact@immoask.com' className='nav-link fw-normal p-0'>
                      <i className='fi-mail opacity-60 me-2'></i>
                      {session ? session.user?.email : "contact@immoask.com"}
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            {
              roleId === 1 &&
              <Link href='/tg/add-project' passHref>
                <Button as='a' size='lg' className='w-100 mb-3'>
                  <i className='fi-plus me-2'></i>
                  Lancer un projet immobilier
                </Button>
              </Link>
            }
            {
              roleId > 1 &&
              <Link href='/tg/add-property' passHref>
                <Button as='a' size='lg' className='w-100 mb-3'>
                  <i className='fi-plus me-2'></i>
                  Lister un immeuble
                </Button>
              </Link>
            }



            {/* Enroller une propriété */}
            <Button
              variant='outline-secondary'
              className='d-block d-md-none w-100 mb-3'
              onClick={() => setOpen(!open)}
              aria-controls='account-menu'
              aria-expanded={open}
            >
              <i className='fi-align-justify me-2'></i>
              Menu
            </Button>
            <Collapse in={open} className='d-md-block'>
              <div id='account-menu'>
                <CardNav className='pt-3'>

                  {
                    ressources && ressources.map((ressource) => {

                      if (ressource.ressource.statut > 0) {
                        return (<CardNav.Item
                          key={ressource.ressource.id}
                          href={ressource.ressource.ressourceLink}
                          icon={ressource.ressource.icone}
                          active={accountPageTitle === ressource.ressource.ressourceName ? true : false}
                        >
                          {ressource.ressource.ressourceName}
                        </CardNav.Item>)
                      }

                    }
                    )
                  }
                  {/* <CardNav.Item
                    href='/tg/account-properties'
                    icon='fi-home'
                    active={accountPageTitle === 'My Properties' ? true : false}
                  >
                    Tableau immobilier
                  </CardNav.Item>
                  <CardNav.Item
                    href='/tg/account-wishlist'
                    icon='fi-heart'
                    active={accountPageTitle === 'Wishlist' ? true : false}
                  >
                    Biens immobiliers à visiter: Favoris
                    <span className='badge bg-faded-light ms-2'>4</span>
                  </CardNav.Item>
                  <CardNav.Item
                    href='/tg/account-reviews'
                    icon='fi-star'
                    active={accountPageTitle === 'Reviews' ? true : false}
                  >
                    Avis
                  </CardNav.Item>
                  <CardNav.Item
                    href='/tg/account-notifications'
                    icon='fi-bell'
                    active={accountPageTitle === 'Notifications' ? true : false}
                  >
                    Notifications
                  </CardNav.Item>
                  <CardNav.Item
                    href='/tg/help-center'
                    icon='fi-help'>
                    Aide
                  </CardNav.Item>
                  <CardNav.Item
                    href='/tg/help-center'
                    icon='fi-help'>
                    Paiements
                  </CardNav.Item>
                  <CardNav.Item href='/tg/help-center' icon='fi-help'>
                    Paiements de loyers
                  </CardNav.Item>
                  <CardNav.Item href='/tg/help-center' icon='fi-help'>
                    Assurance
                  </CardNav.Item>
                  <CardNav.Item href='/tg/help-center' icon='fi-help'>
                    Là ou je vis actuellement
                  </CardNav.Item>
                  <CardNav.Item href='/tg/help-center' icon='fi-help'>
                    Contrats
                  </CardNav.Item>
                  <CardNav.Item href='/tg/help-center' icon='fi-help'>
                    Notation des locataires
                  </CardNav.Item>
                  <CardNav.Item href='/tg/help-center' icon='fi-help'>
                    Adresses des propriétés
                  </CardNav.Item> */}
                  <CardNav.Item
                    href='/tg/account-info'
                    icon='fi-user'
                    active={accountPageTitle === 'Informations personnelles' ? true : false}
                  >
                    Informations personnelles
                  </CardNav.Item>
                  <CardNav.Item
                    href='/tg/account-security'
                    icon='fi-lock'
                    active={accountPageTitle === 'Mot de passe & Sécurité' ? true : false}
                  >
                    Mot de passe &amp; Sécurité
                  </CardNav.Item>
                  <CardNav.Item href='/signin-light' icon='fi-logout'>
                    Se déconnecter
                  </CardNav.Item>
                </CardNav>
              </div>
            </Collapse>
          </div>
        </Col>

        {/* Page content */}
        <Col md={7} lg={9} className='mb-5'>
          {children}
        </Col>
      </Row>
    </Container>
  )
}


export default RealEstateAccountLayout
