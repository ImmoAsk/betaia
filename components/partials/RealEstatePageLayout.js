import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
//Les composants Bootstrap
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import Dropdown from 'react-bootstrap/Dropdown'
import Button from 'react-bootstrap/Button'
//Des composants personnalisés
import ImageLoader from '../ImageLoader'
import StickyNavbar from '../StickyNavbar'
import StarRating from '../StarRating'
import SocialButton from '../SocialButton'
import MarketButton from '../MarketButton'
import SignInModalLight from '../partials/SignInModalLight'
import SignUpModalLight from '../partials/SignUpModalLight'
//Gestion de la sesssion
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router'
import { useRessourceByRole } from '../../customHooks/realEstateHooks'

const RealEstatePageLayout = (props) => {

  // Sign in modal
  const [signinShow, setSigninShow] = useState(false)

  const handleSigninClose = () => setSigninShow(false)
  const handleSigninShow = () => setSigninShow(true)

  // Sign up modal
  const [signupShow, setSignupShow] = useState(false)

  const handleSignupClose = () => setSignupShow(false)
  const handleSignupShow = () => setSignupShow(true)

  // Swap modals
  const handleSignInToUp = (e) => {
    e.preventDefault()
    setSigninShow(false)
    setSignupShow(true)
  }
  const handleSignUpToIn = (e) => {
    e.preventDefault()
    setSigninShow(true)
    setSignupShow(false)
  }
  const router = useRouter();

  // Footer recent blog posts array
  const footerPosts = [
    {
      href: '/tg/blog-single',
      img: '/images/tg/blog/th01.jpg',
      category: 'Home Improvement',
      title: 'Your Guide to a Smart Apartment Searching',
      text: 'Mi justo, varius vitae cursus ipsum sem massa amet pellentesque. Ipsum enim sit nulla ridiculus semper nam...',
      date: 'Dec 4',
      comments: '2'
    },
    {
      href: '/tg/blog-single',
      img: '/images/tg/blog/th02.jpg',
      category: 'Tips & Advice',
      title: 'Top 10 Ways to Refresh Your Space',
      text: 'Volutpat, orci, vitae arcu feugiat vestibulum ultricies nisi, aenean eget. Vitae enim, tellus tempor consequat mi vitae...',
      date: 'Nov 23',
      comments: 'No'
    }
  ]

  const { data: session, status } = useSession()


  const roleId = Number(session && session.user.roleId);
  //console.log(roleId);
  const { data: ressources, isLoading, error } = useRessourceByRole(session ? roleId : 0);

  const OpenSignInOrRedirectToProjectForm = () => {
    if (!session) {
      handleSigninShow();
      handleSignupShow();
    } else {
      handleSigninClose();
      handleSignupClose();
      router.push('/tg/add-project');
    }
  }

  const OpenSignInOrRedirectToPropertyForm = () => {
    if (!session) {
      handleSigninShow();
      handleSignupShow();
    } else {
      handleSigninClose();
      handleSignupClose();
      router.push('/tg/add-property');
    }
  }

  return (
    <>
      <Head>
        <title>{props.pageTitle} | ImmoAsk: Immobilier, Foncier, BTP, Tourisme | Chez vous, c'est ici</title>
      </Head>

      {/* Sign in modal */}
      {signinShow && <SignInModalLight
        centered
        size='lg'
        show={signinShow}
        onHide={handleSigninClose}
        onSwap={handleSignInToUp}
      />}

      {/* Sign up modal */}
      {signupShow && <SignUpModalLight
        centered
        size='lg'
        show={signupShow}
        onHide={handleSignupClose}
        onSwap={handleSignUpToIn}
      />}


      {/* Page wrapper for sticky footer
      Wraps everything except footer to push footer to the bottom of the page if there is little content */}
      <main className='page-wrapper'>

        {/* Navbar (main site header with branding and navigation) */}
        <Navbar as={StickyNavbar}
          expand='lg'
          bg='light'
          className={`fixed-top${props.navbarExtraClass ? ` ${props.navbarExtraClass}` : ''}`}
        >
          <Container>
            <Link href='/tg' passHref>
              <Navbar.Brand className='me-3 me-xl-4'>
                <ImageLoader priority src='/images/logo/logo-dark.png' width={124} height={42} placeholder={false} alt='ImmoAsk' />
              </Navbar.Brand>
            </Link>
            <Navbar.Toggle aria-controls='navbarNav' className='ms-auto' />

            {/* Display content depending on user auth satus  */}
            {props.userLoggedIn ?
              <Dropdown className='d-none d-lg-block order-lg-3 my-n2 me-3'>
                <Link href='/tg/account-info' passHref>
                  <Dropdown.Toggle as={Nav.Link} className='dropdown-toggle-flush d-flex py-1 px-0' style={{ width: '40px' }}>
                    <ImageLoader src='/images/avatars/30.jpg' width={80} height={80} placeholder={false} className='rounded-circle' alt='Annette Black' />
                  </Dropdown.Toggle>
                </Link>
                <Dropdown.Menu renderOnMount align='end'>
                  <div className='d-flex align-items-start border-bottom px-3 py-1 mb-2' style={{ width: '16rem' }}>
                    <ImageLoader src='/images/avatars/03.jpg' width={48} height={48} placeholder={false} className='rounded-circle' alt='Annette Black' />
                    <div className='ps-2'>
                      <h6 className='fs-base mb-0'>{session ? session.user.name : " "}</h6>
                      <StarRating size='sm' rating={5} />
                      <div className='fs-xs py-2'>
                        (302) 555-0107<br />annette_black@email.com
                      </div>
                    </div>
                  </div>
                  {
                    ressources && ressources.map((ressource) => {

                      if (ressource.ressource.statut > 0) {
                        return (
                          <Link href={ressource.ressource.ressourceLink} passHref>
                            <Dropdown.Item key={ressource.ressource.id}>
                              <i className={ressource.ressource.icone + ' opacity-60 me-2'}></i>
                              {ressource.ressource.ressourceName}
                            </Dropdown.Item>
                          </Link>
                        )
                      }

                    }
                    )
                  }
                  <Link href='/tg/account-info' passHref>
                    <Dropdown.Item>
                      <i className='fi-user opacity-60 me-2'></i>
                      Informations personnelles
                    </Dropdown.Item>
                  </Link>
                  <Link href='/tg/account-security' passHref>
                    <Dropdown.Item>
                      <i className='fi-lock opacity-60 me-2'></i>
                      Mot de passe &amp; Sécurité
                    </Dropdown.Item>
                  </Link>
                  <Dropdown.Divider />
                  <Link href='/tg/help-center' passHref>
                    <Dropdown.Item>Aide</Dropdown.Item>
                  </Link>
                  <Link href='/api/auth/signout' passHref>
                    <Dropdown.Item>Se déconnecter</Dropdown.Item>
                  </Link>
                </Dropdown.Menu>
              </Dropdown> :
              <>


              </>


            }
            <Link href='#' passHref>
              <Button size='sm' variant='outline-primary d-none d-lg-block order-lg-3' onClick={OpenSignInOrRedirectToProjectForm}>
                {/* <i className='fi-user me-2'></i> */}
                Lancer un projet immobilier
              </Button>
            </Link>

            <Link href='/tg/add-property' passHref>
              <Button size='sm' className='order-lg-3 ms-2' onClick={OpenSignInOrRedirectToPropertyForm}>
                <i className='fi-plus me-2'></i>
                Lister <span className='d-none d-sm-inline'>un immeuble</span>
              </Button>
            </Link>


            <Navbar.Collapse id='navbarNav' className='order-md-2'>
              <Nav navbarScroll style={{ maxHeight: '35rem' }}>
                {/* <Nav.Item as={Dropdown} className='me-lg-2'>
                  <Dropdown.Toggle as={Nav.Link} className='align-items-center pe-lg-4'>
                    <i className='fi-layers me-2'></i>
                    FlashImmo
                    <span className='d-none d-lg-block position-absolute top-50 end-0 translate-middle-y border-end' style={{width: '1px', height: '30px'}}></span>
                  </Dropdown.Toggle>
                  <Dropdown.Menu renderOnMount>
                    <Link href='/tg' passHref>
                      <Dropdown.Item>
                        <i className='fi-building fs-base opacity-50 me-2'></i>
                        Real Estate Demo
                      </Dropdown.Item>
                    </Link>
                    <Dropdown.Divider />
                    <Link href='/car-finder' passHref>
                      <Dropdown.Item>
                        <i className='fi-car fs-base opacity-50 me-2'></i>
                        Car Finder Demo
                      </Dropdown.Item>
                    </Link>
                    <Dropdown.Divider />
                    <Link href='/job-board' passHref>
                      <Dropdown.Item>
                        <i className='fi-briefcase fs-base opacity-50 me-2'></i>
                        Job Board Demo
                      </Dropdown.Item>
                    </Link>
                    <Dropdown.Divider />
                    <Link href='/city-guide' passHref>
                      <Dropdown.Item>
                        <i className='fi-map-pin fs-base opacity-50 me-2'></i>
                        City Guide Demo
                      </Dropdown.Item>
                    </Link>
                    <Dropdown.Divider />
                    <Link href='/' passHref>
                      <Dropdown.Item>
                        <i className='fi-home fs-base opacity-50 me-2'></i>
                        Main Page
                      </Dropdown.Item>
                    </Link>
                    <Link href='/components/typography' passHref>
                      <Dropdown.Item>
                        <i className='fi-list fs-base opacity-50 me-2'></i>
                        Components
                      </Dropdown.Item>
                    </Link>
                    <Link href='/docs' passHref>
                      <Dropdown.Item>
                        <i className='fi-file fs-base opacity-50 me-2'></i>
                        Documentation
                      </Dropdown.Item>
                    </Link>
                  </Dropdown.Menu>
                </Nav.Item> */}
                <Nav.Item as={Dropdown}>
                  <Dropdown.Toggle as={Nav.Link} active={props.activeNav === 'Home'}>Expérimenter</Dropdown.Toggle>
                  <Dropdown.Menu renderOnMount>
                    <Link href='/tg/locations-immobilieres/appartement-meuble' passHref>
                      <Dropdown.Item>Appartements meublés à louer</Dropdown.Item>
                    </Link>
                    <Link href='/tg/locations-immobilieres/villa-meublee' passHref>
                      <Dropdown.Item>Villas meublées à louer</Dropdown.Item>
                    </Link>
                    <Link href='/tg/locations-immobilieres/studio-meuble' passHref>
                      <Dropdown.Item>Studios meublés à louer</Dropdown.Item>
                    </Link>
                  </Dropdown.Menu>
                </Nav.Item>
                <Nav.Item as={Dropdown}>
                  <Dropdown.Toggle as={Nav.Link} active={props.activeNav === 'Catalog'}>Entreprendre</Dropdown.Toggle>
                  <Dropdown.Menu renderOnMount>
                    <Link href='/tg/locations-immobilieres/bureau' passHref>
                      <Dropdown.Item>Bureaux à louer</Dropdown.Item>
                    </Link>
                    <Link href='/tg/locations-immobilieres/magasin' passHref>
                      <Dropdown.Item>Magasins ou Entrepots à louer</Dropdown.Item>
                    </Link>
                    <Link href='/tg/locations-immobilieres/espace-coworking' passHref>
                      <Dropdown.Item>Espaces co-working à louer</Dropdown.Item>
                    </Link>
                    <Link href='/tg/locations-immobilieres/boutique' passHref>
                      <Dropdown.Item>Boutiques à louer</Dropdown.Item>
                    </Link>
                    <Link href='/tg/baux-immobiliers/terrain' passHref>
                      <Dropdown.Item>Terrains à bailler</Dropdown.Item>
                    </Link>
                  </Dropdown.Menu>
                </Nav.Item>
                <Nav.Item as={Dropdown}>
                  <Dropdown.Toggle as={Nav.Link} active={props.activeNav === 'Account'}>Acquérir</Dropdown.Toggle>
                  <Dropdown.Menu renderOnMount>
                    <Link href='/tg/ventes-immobilieres/terrain' passHref>
                      <Dropdown.Item>Terrains à vendre</Dropdown.Item>
                    </Link>
                    <Link href='/tg/ventes-immobilieres/villa' passHref>
                      <Dropdown.Item>Villas à vendre</Dropdown.Item>
                    </Link>
                    <Link href='/tg/ventes-immobilieres/maison' passHref>
                      <Dropdown.Item>Maisons à vendre</Dropdown.Item>
                    </Link>
                    <Link href='/tg/ventes-immobilieres/appartement' passHref>
                      <Dropdown.Item>Appartements à vendre</Dropdown.Item>
                    </Link>
                    <Link href='/tg/ventes-immobilieres/immeuble' passHref>
                      <Dropdown.Item>Immeubles à vendre</Dropdown.Item>
                    </Link>
                    <Dropdown.Divider />
                    <Link href='/tg/ventes-immobilieres/villa-luxueuse' passHref>
                      <Dropdown.Item>Villas luxueuses à vendre</Dropdown.Item>
                    </Link>
                    <Link href='/tg/ventes-immobilieres/appartement-luxueux' passHref>
                      <Dropdown.Item>Appartements luxueux à vendre</Dropdown.Item>
                    </Link>
                  </Dropdown.Menu>
                </Nav.Item>
                <Nav.Item as={Dropdown}>
                  <Dropdown.Toggle as={Nav.Link} active={props.activeNav === 'Vendor'}>Investir</Dropdown.Toggle>
                  <Dropdown.Menu renderOnMount>
                    <Link href='/tg/investissements-immobiliers/immeuble-commercial' passHref>
                      <Dropdown.Item>Investir en immeuble commercial</Dropdown.Item>
                    </Link>
                    <Link href='/tg/investissements-immobiliers/immeuble-meuble-locatif' passHref>
                      <Dropdown.Item>Investir en immeuble meublé locatif</Dropdown.Item>
                    </Link>
                    <Link href='/tg/investissements-immobiliers/immeuble-acquis' passHref>
                      <Dropdown.Item>Investir en immeuble d'acquisitions</Dropdown.Item>
                    </Link>
                    <Link href='/tg/investissements-immobiliers/immeuble-locatif' passHref>
                      <Dropdown.Item>Investir en immeuble de logements</Dropdown.Item>
                    </Link>
                    <Link href='/tg/investissements-immobiliers/terrain-rural' passHref>
                      <Dropdown.Item>Investir en terrains ruraux et agricoles</Dropdown.Item>
                    </Link>
                    <Link href='/tg/investissements-immobiliers/projet-agricol' passHref>
                      <Dropdown.Item>Investir en projets agricoles</Dropdown.Item>
                    </Link>
                  </Dropdown.Menu>
                </Nav.Item>
                <Nav.Item as={Dropdown}>
                  <Dropdown.Toggle as={Nav.Link} active={props.activeNav === 'Pages'}>Se loger</Dropdown.Toggle>
                  <Dropdown.Menu renderOnMount>
                    <Link href='/tg/locations-immobilieres/appartement' passHref>
                      <Dropdown.Item>Appartements à louer</Dropdown.Item>
                    </Link>
                    {/*  <Dropdown>
                      <Dropdown.Toggle as={Dropdown.Item}>Blog</Dropdown.Toggle>
                      <Dropdown.Menu renderOnMount>
                        <Link href='/tg/blog' passHref>
                          <Dropdown.Item>Blog Grid</Dropdown.Item>
                        </Link>
                        <Link href='/tg/blog-single' passHref>
                          <Dropdown.Item>Single Post</Dropdown.Item>
                        </Link>
                      </Dropdown.Menu>
                    </Dropdown> */}
                    <Link href='/tg/locations-immobilieres/villa' passHref>
                      <Dropdown.Item>Villas à louer</Dropdown.Item>
                    </Link>
                    <Link href='/tg/locations-immobilieres/maison' passHref>
                      <Dropdown.Item>Maison à louer</Dropdown.Item>
                    </Link>
                    <Link href='/tg/locations-immobilieres/chambre-salon' passHref>
                      <Dropdown.Item>Chambres salon à louer</Dropdown.Item>
                    </Link>
                    <Link href='/tg/locations-immobilieres/studio' passHref>
                      <Dropdown.Item>Studio(Chambre ou pièce) à loeur</Dropdown.Item>
                    </Link>
                  </Dropdown.Menu>
                </Nav.Item>

                {/* Display content depending on user auth satus mobilier menu */}
                {props.userLoggedIn ? <Nav.Item as={Dropdown} className='d-lg-none'>
                  <Dropdown.Toggle as={Nav.Link} className='d-flex align-items-center'>
                    <ImageLoader src='/images/avatars/30.jpg' width={30} height={30} placeholder={false} className='rounded-circle' alt='Annette Black' />
                    <span className='ms-2'>{session ? true : false}</span>
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <div className='ps-3'>
                      <StarRating size='sm' rating={5} />
                      <div className='fs-xs py-2'>
                        (302) 555-0107<br />annette_black@email.com
                      </div>
                    </div>
                    {
                      ressources && ressources.map((ressource) => {

                        if (ressource.ressource.statut > 0) {
                          return (
                            <Link href={ressource.ressource.ressourceLink} passHref>
                              <Dropdown.Item key={ressource.ressource.id}>
                                <i className={ressource.ressource.icone + ' opacity-60 me-2'}></i>
                                {ressource.ressource.ressourceName}
                              </Dropdown.Item>
                            </Link>
                          )
                        }

                      }
                      )
                    }
                    <Link href='/tg/account-info' passHref>
                      <Dropdown.Item>
                        <i className='fi-user opacity-60 me-2'></i>
                        Informations personnelles
                      </Dropdown.Item>
                    </Link>
                    <Link href='/tg/account-security' passHref>
                      <Dropdown.Item>
                        <i className='fi-lock opacity-60 me-2'></i>
                        Mot de passe &amp; Sécurité
                      </Dropdown.Item>
                    </Link>
                    <Dropdown.Divider />
                    <Link href='/tg/help-center' passHref>
                      <Dropdown.Item>Aide</Dropdown.Item>
                    </Link>
                    <Link href='/api/auth/signout' passHref>
                      <Dropdown.Item>Se déconnecter</Dropdown.Item>
                    </Link>
                  </Dropdown.Menu>
                </Nav.Item> :

                  <Nav.Item className='d-lg-none'>
                    <Nav.Link onClick={handleSigninShow}>
                      <i className='fi-user me-2'></i>
                      Se connecter
                    </Nav.Link>
                  </Nav.Item>}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        {/* Page content */}
        {props.children}
      </main>


      {/* Footer */}
      <footer className='footer bg-secondary pt-5'>
        <Container className='pt-lg-4 pb-4'>
          <Row className='mb-5 pb-md-3 pb-lg-4'>
            <Col lg={6} className='mb-lg-0 mb-4'>
              <div className='d-flex flex-sm-row flex-column justify-content-between mx-n2'>

                {/* Logo + contacts */}
                <div className='mb-sm-0 mb-4 px-2'>
                  <Link href='/tg'>
                    <a className='d-inline-flex mb-4'>
                      <ImageLoader priority src='/images/logo/immoask-logo-removebg.png' width={116} height={112} placeholder={false} alt='ImmoAsk' />
                    </a>
                  </Link>
                  <Nav className='flex-column mb-sm-4 mb-2'>
                    <Nav.Item className='mb-2'>
                      <Nav.Link href='mailto:example@email.com' active={false} className='p-0 fw-normal'>
                        <i className='fi-mail me-2 align-middle opacity-70'></i>
                        contact@immoask.com
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link href='tel:4065550120' active={false} className='p-0 fw-normal'>
                        <i className='fi-device-mobile me-2 align-middle opacity-70'></i>
                        (228) 7045-3625
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>
                  <div className='pt-2'>
                    <SocialButton href='#' variant='solid' brand='facebook' roundedCircle className='me-2 mb-2' />
                    <SocialButton href='#' variant='solid' brand='twitter' roundedCircle className='me-2 mb-2' />
                    {/* <SocialButton href='#' variant='solid' brand='viber' roundedCircle className='me-2 mb-2' /> */}
                    <SocialButton href='#' variant='solid' brand='telegram' roundedCircle className='mb-2' />
                  </div>
                </div>

                {/* Quick links */}
                <div className='mb-sm-0 mb-4 px-2'>
                  <h4 className='h5'>Quick Links</h4>
                  <Nav className='flex-column'>
                    <Nav.Item className='mb-2'>
                      <Link href='#' passHref>
                        <Nav.Link active={false} className='p-0 fw-normal'>Acheter un immeuble</Nav.Link>
                      </Link>
                    </Nav.Item>
                    <Nav.Item className='mb-2'>
                      <Link href='#' passHref>
                        <Nav.Link active={false} className='p-0 fw-normal'>Vendre un bien immobilier</Nav.Link>
                      </Link>
                    </Nav.Item>
                    <Nav.Item className='mb-2'>
                      <Link href='#' passHref>
                        <Nav.Link active={false} className='p-0 fw-normal'>Louer un bien immobilier</Nav.Link>
                      </Link>
                    </Nav.Item>
                    <Nav.Item className='mb-2'>
                      <Link href='#' passHref>
                        <Nav.Link active={false} className='p-0 fw-normal'>Calculate  your property</Nav.Link>
                      </Link>
                    </Nav.Item>
                    <Nav.Item className='mb-2'>
                      <Link href='#' passHref>
                        <Nav.Link active={false} className='p-0 fw-normal'>Top offers</Nav.Link>
                      </Link>
                    </Nav.Item>
                    <Nav.Item className='mb-2'>
                      <Link href='#' passHref>
                        <Nav.Link active={false} className='p-0 fw-normal'>Top cities</Nav.Link>
                      </Link>
                    </Nav.Item>
                  </Nav>
                </div>

                {/* About links */}
                <div className='px-2'>
                  <h4 className='h5'>About</h4>
                  <Nav className='flex-column'>
                    <Nav.Item className='mb-2'>
                      <Link href='#' passHref>
                        <Nav.Link active={false} className='p-0 fw-normal'>About us</Nav.Link>
                      </Link>
                    </Nav.Item>
                    <Nav.Item className='mb-2'>
                      <Link href='#' passHref>
                        <Nav.Link active={false} className='p-0 fw-normal'>Our agents</Nav.Link>
                      </Link>
                    </Nav.Item>
                    <Nav.Item className='mb-2'>
                      <Link href='#' passHref>
                        <Nav.Link active={false} className='p-0 fw-normal'>Help &amp; support</Nav.Link>
                      </Link>
                    </Nav.Item>
                    <Nav.Item className='mb-2'>
                      <Link href='#' passHref>
                        <Nav.Link active={false} className='p-0 fw-normal'>Contacts</Nav.Link>
                      </Link>
                    </Nav.Item>
                    <Nav.Item className='mb-2'>
                      <Link href='#' passHref>
                        <Nav.Link active={false} className='p-0 fw-normal'>News</Nav.Link>
                      </Link>
                    </Nav.Item>
                  </Nav>
                </div>
              </div>
            </Col>

            {/* Recent posts */}
            <Col lg={6} xl={{ span: 5, offset: 1 }}>
              <h4 className='h5'>Recent Posts</h4>
              {footerPosts.map((post, indx) => (
                <div key={indx}>
                  <article className='d-flex align-items-start' style={{ maxWidth: '640px' }}>
                    <Link href={post.href}>
                      <a className='d-none d-sm-flex flex-shrink-0 mb-sm-0 mb-3' style={{ width: '100px', height: '100px' }}>
                        <ImageLoader src={post.img} width={200} height={200} className='rounded-3' alt='Thumbnail' />
                      </a>
                    </Link>
                    <div className='ps-sm-4'>
                      <h6 className='mb-1 fs-xs fw-normal text-uppercase text-primary'>{post.category}</h6>
                      <h5 className='mb-2 fs-base'>
                        <Link href={post.href}>
                          <a className='nav-link'>{post.title}</a>
                        </Link>
                      </h5>
                      <p className='mb-2 fs-sm'>{post.text}</p>
                      <Link href='#'>
                        <a className='nav-link nav-link-muted d-inline-block me-3 p-0 fs-xs fw-normal'>
                          <i className='fi-calendar mt-n1 me-1 fs-sm align-middle opacity-70'></i>
                          {post.date}
                        </a>
                      </Link>
                      <Link href='#'>
                        <a className='nav-link nav-link-muted d-inline-block p-0 fs-xs fw-normal'>
                          <i className='fi-chat-circle mt-n1 me-1 fs-sm align-middle opacity-70'></i>
                          {`${post.comments} comments`}
                        </a>
                      </Link>
                    </div>
                  </article>
                  {indx < footerPosts.length - 1 && <hr className='text-dark opacity-10 my-4' />}
                </div>
              ))}
            </Col>
          </Row>

          {/* Mobile app CTA */}
          <div className='bg-dark rounded-3'>
            <Col xs={10} md={11} xxl={10} className='d-flex flex-md-row flex-column-reverse align-items-md-end align-items-center mx-auto px-0'>
              <div className='d-flex flex-shrink-0 mt-md-n5 me-md-5'>
                <ImageLoader
                  priority
                  src='/images/tg/illustrations/mobile.svg'
                  width={240}
                  height={237}
                  alt='Illustration' />
              </div>
              <div className='align-self-center d-flex flex-lg-row flex-column align-items-lg-center pt-md-3 pt-5 ps-xxl-4 text-md-start text-center'>
                <div className='me-md-5'>
                  <h4 className='text-light'>Télécharger notre appli</h4>
                  <p className='mb-lg-0 text-light'>Se loger, Investir, Acquérir, Experimenter</p>
                </div>
                <div className='flex-shrink-0'>
                  <MarketButton href='#' market='apple' className='mx-2 ms-sm-0 me-sm-4 mb-3' />
                  <MarketButton href='#' market='google' className='mb-3' />
                </div>
              </div>
            </Col>
          </div>

          {/* Copyright */}

        </Container>
      </footer>
    </>
  )
}

export default RealEstatePageLayout