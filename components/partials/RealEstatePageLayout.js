import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
//Les composants Bootstrap
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav";
import { Alert } from "react-bootstrap";
import Navbar from "react-bootstrap/Navbar";
import Dropdown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/Button";
//Des composants personnalisés
import ImageLoader from "../ImageLoader";
import StickyNavbar from "../StickyNavbar";
import StarRating from "../StarRating";
import SocialButton from "../SocialButton";
import MarketButton from "../MarketButton";
import SignInModalLight from "../partials/SignInModalLight";
import SignUpModalLight from "../partials/SignUpModalLight";
//Gestion de la sesssion
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useRessourceByRole } from "../../customHooks/realEstateHooks";

const RealEstatePageLayout = (props) => {
  // Sign in modal
  const [signinShow, setSigninShow] = useState(false);

  const handleSigninClose = () => setSigninShow(false);
  const handleSigninShow = () => setSigninShow(true);

  // Sign up modal
  const [signupShow, setSignupShow] = useState(false);

  const handleSignupClose = () => setSignupShow(false);
  const handleSignupShow = () => setSignupShow(true);

  // Swap modals
  const handleSignInToUp = (e) => {
    e.preventDefault();
    setSigninShow(false);
    setSignupShow(true);
  };
  const handleSignUpToIn = (e) => {
    e.preventDefault();
    setSigninShow(true);
    setSignupShow(false);
  };
  const router = useRouter();

  // Footer recent blog posts array
  const footerPosts = [
    {
      href: "https://www.linkedin.com/pulse/ce-quil-faut-faire-avant-la-mise-en-vente-de-votre-bien-immobilier/",
      img: "/images/tg/blog/th01.jpg",
      category: "Logement",
      title:
        "Ce qu'il faut faire avant la mise en vente de votre bien immobilier...",
      text: "Vous avez un terrain ou une maison à vendre, une parcelle au Togo en vente, voici l'histoire à connaître...",
      date: "Mar 10",
      comments: "2",
    },
    {
      href: "https://www.linkedin.com/pulse/la-gouvernance-fonci%C3%A8re-au-togo-prend-une-autre-tournure-immoask/?",
      img: "/images/tg/blog/th02.jpg",
      category: "Foncier",
      title: "La gouvernance foncière au Togo prend une autre tournure",
      text: "Avant d'acheter un lot sur ImmoAsk ou avec nos propriétaires ou agents immobiliers, il y a cette étape de vérification de la surface...",
      date: "Fev 23",
      comments: "No",
    },
  ];

  const { data: session, status } = useSession();

  const roleId = Number(session && session.user.roleId);
  //console.log(roleId);
  const {
    data: ressources,
    isLoading,
    error,
  } = useRessourceByRole(session ? roleId : 0);

  const OpenSignInOrRedirectToProjectForm = () => {
    if (!session) {
      //handleSigninShow();
      //handleSignupShow();
      router.push("/signup-light");
    } else {
      handleSigninClose();
      handleSignupClose();
      router.push("/tg/add-project");
    }
  };

  const OpenSignInOrRedirectToPropertyForm = () => {
    if (!session) {
      handleSigninShow();
      handleSignupShow();
    } else {
      handleSigninClose();
      handleSignupClose();
      router.push("/tg/add-property");
    }
  };

  const displayCreationAccountButton = () => {
    return (
      <Link href="/auth/signin" passHref>
        <Button
          size="sm"
          variant="outline-primary d-none d-lg-block order-lg-3"
        >
          <i className="fi-user me-2"></i>
          Se connecter | Créer un compte
        </Button>
      </Link>
    );
  };

  const displayCreationContractButton = () => {
    return (
      <Link href="/tg/account-contracts" passHref>
        <Button
          size="sm"
          variant="outline-primary d-none d-lg-block order-lg-3"
        >
          <i className="fi-file me-2"></i>
          Créer un contrat immobilier
        </Button>
      </Link>
    );
  };

  const displayCreationProjectButton = () => {
    return (
      <Link href="/tg/add-project" passHref>
        <Button
          size="sm"
          variant="outline-primary d-none d-lg-block order-lg-3"
        >
          <i className="fi-file me-2"></i>
          Lancer un projet immobilier
        </Button>
      </Link>
    );
  };
  return (
    <>
      <Head>
        <title>
          {props.pageTitle} | ImmoAsk: Immobilier, Foncier, BTP, Tourisme | Chez
          vous, c'est ici
        </title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content={props.pageDescription} />
        <meta name="keywords" content={props.pageKeywords} />
        <meta name="robots" content="index, follow" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta property="og:title" content={props.pageTitle} />
        <meta property="og:description" content={props.pageDescription} />
        <meta property="og:image" content={props.pageCoverImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={props.pageUrl} />
        <meta name="author" content="Omnisoft Africa" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicon/apple-icon-180x180.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon/favicon-32x32.png"
        />
        <link rel="icon" type="image/x-icon" href="/favicon/favicon.ico" />
        <link rel="manifest" href="/favicon/site.webmanifest" />
        <link
          rel="mask-icon"
          color="#5bbad5"
          href="/favicon/safari-pinned-tab.svg"
        />
        <meta name="msapplication-TileColor" content="#766df4" />
        <meta name="theme-color" content="#ffffff" />
        <meta property="og:site_name" content="ImmoAsk" />
        <meta property="fb:app_id" content="2049277298731648" />
        <meta property="fb:pages" content="431591890524770,322098734581229" />
        <meta property="og:locale" content="fr_TG" />
        <meta property="og:rich_attachment" content="true" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@immoask" />
        <meta name="twitter:creator" content="@immoask" />
        <meta name="twitter:title" content={props.pageTitle} />
        <meta name="twitter:url" content={props.pageUrl} />
        <meta name="twitter:description" content={props.pageDescription} />
        <meta name="twitter:image" content={props.pageCoverImage} />
      </Head>

      {/* Sign in modal */}
      {signinShow && (
        <SignInModalLight
          centered
          size="lg"
          show={signinShow}
          onHide={handleSigninClose}
          onSwap={handleSignInToUp}
        />
      )}

      {/* Sign up modal */}
      {signupShow && (
        <SignUpModalLight
          centered
          size="lg"
          show={signupShow}
          onHide={handleSignupClose}
          onSwap={handleSignUpToIn}
        />
      )}

      {/* Page wrapper for sticky footer
      Wraps everything except footer to push footer to the bottom of the page if there is little content */}

      <main className="page-wrapper">
        {/* Navbar (main site header with branding and navigation) */}

        <Navbar
          as={StickyNavbar}
          expand="lg"
          bg="light"
          className={`fixed-top${props.navbarExtraClass ? ` ${props.navbarExtraClass}` : ""
            }`}
        >
          <Container fluid>
            <Link href="/tg" passHref>
              <Navbar.Brand className="me-3 me-xl-4">
                <ImageLoader
                  priority
                  src="/images/logo/immoask-logo-cropped.png"
                  width={124}
                  height={52}
                  placeholder={false}
                  alt="ImmoAsk"
                />
              </Navbar.Brand>
            </Link>
            <Navbar.Toggle aria-controls="navbarNav" className="ms-auto" />

            {/* Display content depending on user auth satus  */}

            {props.userLoggedIn ? (
              <Dropdown className="d-none d-lg-block order-lg-3 my-n2 me-3">
                <Link href="/tg/account-properties" passHref>
                  <Dropdown.Toggle
                    as={Nav.Link}
                    className="dropdown-toggle-flush d-flex py-1 px-0"
                    style={{ width: "40px" }}
                  >
                    <ImageLoader
                      src="/images/avatars/45.jpg"
                      width={80}
                      height={80}
                      placeholder={false}
                      className="rounded-circle"
                      alt="ImmoAsk"
                    />
                  </Dropdown.Toggle>
                </Link>
                <Dropdown.Menu renderOnMount align="end">
                  <div
                    className="d-flex align-items-start border-bottom px-3 py-1 mb-2"
                    style={{ width: "16rem" }}
                  >
                    <ImageLoader
                      src="/images/avatars/45.jpg"
                      width={48}
                      height={48}
                      placeholder={false}
                      className="rounded-circle"
                      alt="ImmoAsk"
                    />
                    <div className="ps-2">
                      <h6 className="fs-base mb-0">
                        {session ? session.user.name : " "}
                      </h6>
                      <StarRating size="sm" rating={5} />
                      <div className="fs-xs py-2">
                        {session && session.user.phone
                          ? session.user.phone
                          : " "}
                        <br />
                        {session && session.user.email
                          ? session.user.email
                          : ""}
                      </div>
                    </div>
                  </div>
                  {session && session.user.roleId === "1232" && (
                    <Link href="/tg/subscriptions" passHref>
                      <Dropdown.Item>
                        <i className="fi-star me-2"></i>
                        Votre{" "}
                        <span className="d-none d-sm-inline">abonnement</span>
                      </Dropdown.Item>
                    </Link>
                  )}
                  {ressources &&
                    ressources.map((ressource) => {
                      if (ressource.ressource.statut > 0) {
                        return (
                          <Link
                            href={ressource.ressource.ressourceLink}
                            passHref
                          >
                            <Dropdown.Item key={ressource.ressource.id}>
                              <i
                                className={
                                  ressource.ressource.icone + " opacity-60 me-2"
                                }
                              ></i>
                              {ressource.ressource.ressourceName}
                            </Dropdown.Item>
                          </Link>
                        );
                      }
                    })}

                  <Link href="/tg/settings" passHref>
                    <Dropdown.Item>
                      <i className="fi-settings opacity-60 me-2"></i>
                      Paramètres
                    </Dropdown.Item>
                  </Link>
                  <Link href="/tg/account-info" passHref>
                    <Dropdown.Item>
                      <i className="fi-user opacity-60 me-2"></i>
                      Informations personnelles
                    </Dropdown.Item>
                  </Link>
                  <Link href="/tg/account-security" passHref>
                    <Dropdown.Item>
                      <i className="fi-lock opacity-60 me-2"></i>
                      Mot de passe &amp; Sécurité
                    </Dropdown.Item>
                  </Link>
                  <Dropdown.Divider />
                  <Link href="/tg/help-center" passHref>
                    <Dropdown.Item>Aide</Dropdown.Item>
                  </Link>
                  <Link href="/api/auth/signout" passHref>
                    <Dropdown.Item>Se déconnecter</Dropdown.Item>
                  </Link>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <></>
            )}
            {session ? (
              session.user.roleId === "1230" || session.user.roleId === "1200"
                ? displayCreationContractButton()
                : session.user.roleId === "1232" || session.user.roleId === "151"
                  ? displayCreationProjectButton()
                  : null
            ) : (
              displayCreationAccountButton()
            )}

            <Link href="/tg/add-property" passHref>
              <Button
                size="sm"
                className="order-lg-3 ms-2"
                onClick={OpenSignInOrRedirectToPropertyForm}
              >
                <i className="fi-building me-2"></i>
                Lister{" "}
                <span className="d-none d-sm-inline">un immeuble</span>
              </Button>
            </Link>

            <Navbar.Collapse id="navbarNav" className="order-md-2">
              <Nav navbarScroll style={{ maxHeight: "35rem" }}>
                <Nav.Item as={Dropdown}>
                  <Dropdown.Toggle
                    as={Nav.Link}
                    active={props.activeNav === "Home"}
                  >
                    Séjourner
                  </Dropdown.Toggle>
                  <Dropdown.Menu renderOnMount>
                    <Link
                      href="/tg/locations-immobilieres/appartement-meuble"
                      passHref
                    >
                      <Dropdown.Item>
                        Appartements meublés à louer
                      </Dropdown.Item>
                    </Link>
                    <Link
                      href="/tg/locations-immobilieres/villa-meublee"
                      passHref
                    >
                      <Dropdown.Item>Villas meublées à louer</Dropdown.Item>
                    </Link>
                    <Link
                      href="/tg/locations-immobilieres/studio-meuble"
                      passHref
                    >
                      <Dropdown.Item>Studios meublés à louer</Dropdown.Item>
                    </Link>
                  </Dropdown.Menu>
                </Nav.Item>
                <Nav.Item as={Dropdown}>
                  <Dropdown.Toggle
                    as={Nav.Link}
                    active={props.activeNav === "Catalog"}
                  >
                    Entreprendre
                  </Dropdown.Toggle>
                  <Dropdown.Menu renderOnMount>
                    <Link href="/tg/locations-immobilieres/bureau" passHref>
                      <Dropdown.Item>Bureaux à louer</Dropdown.Item>
                    </Link>
                    <Link href="/tg/locations-immobilieres/magasin" passHref>
                      <Dropdown.Item>
                        Magasins ou Entrepots à louer
                      </Dropdown.Item>
                    </Link>
                    <Link
                      href="/tg/locations-immobilieres/espace-coworking"
                      passHref
                    >
                      <Dropdown.Item>Espaces co-working à louer</Dropdown.Item>
                    </Link>
                    <Link href="/tg/locations-immobilieres/boutique" passHref>
                      <Dropdown.Item>Boutiques à louer</Dropdown.Item>
                    </Link>
                    <Link href="/tg/baux-immobiliers/terrain" passHref>
                      <Dropdown.Item>Terrains à bailler</Dropdown.Item>
                    </Link>
                  </Dropdown.Menu>
                </Nav.Item>
                <Nav.Item as={Dropdown}>
                  <Dropdown.Toggle
                    as={Nav.Link}
                    active={props.activeNav === "Account"}
                  >
                    Acquérir
                  </Dropdown.Toggle>
                  <Dropdown.Menu renderOnMount>
                    <Link href="/tg/ventes-immobilieres/terrain" passHref>
                      <Dropdown.Item>Terrains à vendre</Dropdown.Item>
                    </Link>
                    <Link
                      href="/tg/ventes-immobilieres/terrain-urbain"
                      passHref
                    >
                      <Dropdown.Item>Terrains urbains à vendre</Dropdown.Item>
                    </Link>
                    <Link href="/tg/ventes-immobilieres/villa" passHref>
                      <Dropdown.Item>Villas à vendre</Dropdown.Item>
                    </Link>
                    <Link href="/tg/ventes-immobilieres/maison" passHref>
                      <Dropdown.Item>Maisons à vendre</Dropdown.Item>
                    </Link>
                    <Link href="/tg/ventes-immobilieres/appartement" passHref>
                      <Dropdown.Item>Appartements à vendre</Dropdown.Item>
                    </Link>
                    <Link href="/tg/ventes-immobilieres/immeuble" passHref>
                      <Dropdown.Item>Immeubles à vendre</Dropdown.Item>
                    </Link>
                    <Dropdown.Divider />
                    <Link
                      href="/tg/ventes-immobilieres/villa-luxueuse"
                      passHref
                    >
                      <Dropdown.Item>Villas luxueuses à vendre</Dropdown.Item>
                    </Link>
                    <Link
                      href="/tg/ventes-immobilieres/appartement-luxueux"
                      passHref
                    >
                      <Dropdown.Item>
                        Appartements luxueux à vendre
                      </Dropdown.Item>
                    </Link>
                  </Dropdown.Menu>
                </Nav.Item>

                <Nav.Item as={Dropdown}>
                  <Dropdown.Toggle
                    as={Nav.Link}
                    active={props.activeNav === "Pages"}
                  >
                    Se loger
                  </Dropdown.Toggle>
                  <Dropdown.Menu renderOnMount>
                    <Link
                      href="/tg/locations-immobilieres/appartement"
                      passHref
                    >
                      <Dropdown.Item>Appartements à louer</Dropdown.Item>
                    </Link>
                    <Link href="/tg/locations-immobilieres/villa" passHref>
                      <Dropdown.Item>Villas à louer</Dropdown.Item>
                    </Link>
                    <Link href="/tg/locations-immobilieres/maison" passHref>
                      <Dropdown.Item>Maison à louer</Dropdown.Item>
                    </Link>
                    <Link
                      href="/tg/locations-immobilieres/chambre-salon"
                      passHref
                    >
                      <Dropdown.Item>Chambres salon à louer</Dropdown.Item>
                    </Link>
                    <Link href="/tg/locations-immobilieres/studio" passHref>
                      <Dropdown.Item>Studio à louer</Dropdown.Item>
                    </Link>
                    <Link href="/tg/locations-immobilieres/chambre" passHref>
                      <Dropdown.Item>Chambre à louer</Dropdown.Item>
                    </Link>
                  </Dropdown.Menu>
                </Nav.Item>
                {props.userLoggedIn ? (
                  <Nav.Item as={Dropdown} className="d-lg-none">
                    <Dropdown.Toggle
                      as={Nav.Link}
                      className="d-flex align-items-center"
                    >
                      <ImageLoader
                        src="/images/avatars/45.jpg"
                        width={30}
                        height={30}
                        placeholder={false}
                        className="rounded-circle"
                        alt="ImmoAsk"
                      />
                      <span className="ms-2">
                        {session ? session.user.name : "Connectez-vous"}
                      </span>
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <div className="ps-3">
                        <StarRating size="sm" rating={5} />
                        <div className="fs-xs py-2">
                          {session && session.user.phone
                            ? session.user.phone
                            : " "}
                          <br />
                          {session && session.user.email
                            ? session.user.email
                            : ""}
                        </div>
                      </div>
                      {session && session.user.roleId === "1232" && (
                        <Link href="/tg/subscriptions" passHref>
                          <Dropdown.Item>
                            <i className="fi-star"></i>
                            Votre abonnement
                          </Dropdown.Item>
                        </Link>
                      )}
                      {ressources &&
                        ressources.map((ressource) => {
                          if (ressource.ressource.statut > 0) {
                            return (
                              <Link
                                href={ressource.ressource.ressourceLink}
                                passHref
                              >
                                <Dropdown.Item key={ressource.ressource.id}>
                                  <i
                                    className={
                                      ressource.ressource.icone +
                                      " opacity-60 me-2"
                                    }
                                  ></i>
                                  {ressource.ressource.ressourceName}
                                </Dropdown.Item>
                              </Link>
                            );
                          }
                        })}
                      <Link href="/tg/account-info" passHref>
                        <Dropdown.Item>
                          <i className="fi-user opacity-60 me-2"></i>
                          Informations personnelles
                        </Dropdown.Item>
                      </Link>
                      <Link href="/tg/account-security" passHref>
                        <Dropdown.Item>
                          <i className="fi-lock opacity-60 me-2"></i>
                          Mot de passe &amp; Sécurité
                        </Dropdown.Item>
                      </Link>
                      <Dropdown.Divider />
                      <Link href="/tg/help-center" passHref>
                        <Dropdown.Item>Aide</Dropdown.Item>
                      </Link>
                      <Link href="/api/auth/signout" passHref>
                        <Dropdown.Item>Se déconnecter</Dropdown.Item>
                      </Link>
                    </Dropdown.Menu>
                  </Nav.Item>
                ) : (
                  <Nav.Item className="d-lg-none">
                    <Nav.Link onClick={handleSigninShow}>
                      <i className="fi-user me-2"></i>
                      Se connecter
                    </Nav.Link>
                  </Nav.Item>
                )}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        {/*         <Alert
          variant="info"
          className="alert-text"
          style={{
            position: 'fixed',
            top: 0,
            width: '100%',
            zIndex: 1000,
            textAlign: 'left',
            padding: '10px 15px',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
            overflowWrap: 'break-word'
          }}
        >
          <div className="container-fluid">
            <p className="mb-0">
              Nouvelle version de <strong>ImmoAsk</strong>!
              Si vous rencontrez un problème, merci de nous le signaler sur
              <a href="https://wa.me/22870453625" target="_blank" rel="noopener noreferrer"> (+228 7045 3625)</a>
              ou <a href="https://linkedin.com/company/immoask" target="_blank" rel="noopener noreferrer"> ici </a>.
            </p>
          </div>
        </Alert> */}
        {/* Page content */}
        {props.children}
      </main>

      {/* Footer */}
      <footer className="footer bg-secondary pt-5">
        <Container className="pt-lg-4 pb-4">
          <Row className="mb-5 pb-md-3 pb-lg-4">
            {/* Column 1: Logo + Contacts */}
            <Col md={3} className="mb-lg-0 mb-4">
              <div className="mb-sm-0 mb-4">
                <Link href="/tg">
                  <a className="d-inline-flex mb-4">
                    <ImageLoader
                      priority
                      src="/images/logo/immoask-logo-cropped.png"
                      width={124}
                      height={52}
                      placeholder={false}
                      alt="ImmoAsk"
                    />
                  </a>
                </Link>
                <p>
                  ImmoAsk est un marketplace immobilier et foncier avec un CRM
                  de gestion immobiliere boosté par une intelligence
                  artificielle.
                </p>
                {/*  <Nav className='flex-column mb-sm-4 mb-2'>
                  <Nav.Item className='mb-2'>
                    <Nav.Link href='mailto:contact@immoask.com' className='p-0 fw-normal'>
                      <i className='fi-mail me-2 align-middle opacity-70'></i>contact@immoask.com
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link href='tel:0022870453625' className='p-0 fw-normal'>
                      <i className='fi-device-mobile me-2 align-middle opacity-70'></i>(+228) 7045-3625
                    </Nav.Link>
                  </Nav.Item>
                </Nav> */}
                <div className="pt-2">
                  <SocialButton
                    href="https://facebook.com/immoask"
                    variant="solid"
                    brand="facebook"
                    roundedCircle
                    className="me-2 mb-2"
                  />
                  <SocialButton
                    href="https://twitter.com/immoask"
                    variant="solid"
                    brand="twitter"
                    roundedCircle
                    className="me-2 mb-2"
                  />
                  <SocialButton
                    href="https://linkedin.com/in/immoask"
                    variant="solid"
                    brand="linkedin"
                    roundedCircle
                    className="mb-2"
                  />
                </div>
              </div>
            </Col>

            {/* Column 2: Quick Links */}
            <Col md={3} className="mb-lg-0 mb-4">
              <h4 className="h5">Produits</h4>
              <Nav className="flex-column">
                <Nav.Item className="mb-2">
                  <Link href="/tg/catalog?usage=3" passHref>
                    <Nav.Link className="p-0 fw-normal">
                      Acquérir un immeuble en securite
                    </Nav.Link>
                  </Link>
                </Nav.Item>
                <Nav.Item className="mb-2">
                  <Link href="/tg/add-property" passHref>
                    <Nav.Link className="p-0 fw-normal">
                      Lister un bien immobilier
                    </Nav.Link>
                  </Link>
                </Nav.Item>
                <Nav.Item className="mb-2">
                  <Link href="/tg/catalog?usage=1" passHref>
                    <Nav.Link className="p-0 fw-normal">
                      Trouver un logement en temps
                    </Nav.Link>
                  </Link>
                </Nav.Item>
                <Nav.Item className="mb-2">
                  <Link href="/tg/catalog?usage=5" passHref>
                    <Nav.Link className="p-0 fw-normal">
                      Reserver un séjour meublé
                    </Nav.Link>
                  </Link>
                </Nav.Item>
                <Nav.Item className="mb-2">
                  <Link href="/tg/catalog?usage=3" passHref>
                    <Nav.Link active={false} className="p-0 fw-normal">
                      Trouver un emplacement entreprise
                    </Nav.Link>
                  </Link>
                </Nav.Item>
                <Nav.Item className="mb-2">
                  <Link href="/tg/account-properties" passHref>
                    <Nav.Link active={false} className="p-0 fw-normal">
                      Gerer votre bien immobilier
                    </Nav.Link>
                  </Link>
                </Nav.Item>
                <Nav.Item className="mb-2">
                  <Link href="/tg/account-rentpayments" passHref>
                    <Nav.Link active={false} className="p-0 fw-normal">
                      Payer le loyer autrement
                    </Nav.Link>
                  </Link>
                </Nav.Item>
              </Nav>
            </Col>

            {/* Column 3: About Links */}
            <Col md={3} className="mb-lg-0 mb-4">
              <h4 className="h5">Nous rejoindre</h4>
              <Nav className="flex-column">
                <Nav.Item className="mb-2">
                  <Link
                    href="https://whatsapp.com/channel/0029Va8UsGT6mYPQ1aIvdm25"
                    passHref
                  >
                    <Nav.Link className="p-0 fw-normal">
                      Souscrire à la chaîne FlashImmo
                    </Nav.Link>
                  </Link>
                </Nav.Item>
                <Nav.Item className="mb-2">
                  <Link href="#" passHref>
                    <Nav.Link className="p-0 fw-normal">
                      Rejoindre l'elite des guru immobiliers
                    </Nav.Link>
                  </Link>
                </Nav.Item>
                {/* <Nav.Item className='mb-2'>
                  <Link href='#' passHref>
                    <Nav.Link className='p-0 fw-normal'>Assistance client</Nav.Link>
                  </Link>
                </Nav.Item> */}
                <Nav.Item className="mb-2">
                  <Link href="#" passHref>
                    <Nav.Link className="p-0 fw-normal">
                      Devenir membre de LesVoisins
                    </Nav.Link>
                  </Link>
                </Nav.Item>
              </Nav>
            </Col>

            {/* Column 4: Recent Posts */}
            <Col md={3}>
              <h4 className="h5">Notre blog immobilier</h4>
              {footerPosts.map((post, indx) => (
                <div key={indx}>
                  <article className="d-flex align-items-start">
                    <Link href={post.href}>
                      <a
                        className="d-none d-sm-flex flex-shrink-0 mb-sm-0 mb-3"
                        style={{ width: "100px", height: "100px" }}
                      >
                        <ImageLoader
                          src={post.img}
                          width={200}
                          height={200}
                          className="rounded-3"
                          alt="Thumbnail"
                        />
                      </a>
                    </Link>
                    <div className="ps-sm-4">
                      <h6 className="mb-1 fs-xs fw-normal text-uppercase text-primary">
                        {post.category}
                      </h6>
                      <h5 className="mb-2 fs-base">
                        <Link href={post.href}>
                          <a className="nav-link">{post.title}</a>
                        </Link>
                      </h5>
                      <p className="mb-2 fs-sm">{post.text}</p>
                      <Link href="#">
                        <a className="nav-link nav-link-muted d-inline-block me-3 p-0 fs-xs fw-normal">
                          <i className="fi-calendar mt-n1 me-1 fs-sm align-middle opacity-70"></i>
                          {post.date}
                        </a>
                      </Link>
                    </div>
                  </article>
                  {indx < footerPosts.length - 1 && (
                    <hr className="text-dark opacity-10 my-4" />
                  )}
                </div>
              ))}
            </Col>
          </Row>
          {/* <div className='bg-dark rounded-3'>
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
          </div> */}
        </Container>
      </footer>
    </>
  );
};

export default RealEstatePageLayout;
{
  /* Footer */
}
{
  /* <footer className='footer bg-secondary pt-5'>
        <Container className='pt-lg-4 pb-4'>
          <Row className='mb-5 pb-md-3 pb-lg-4'>
            <Col lg={4} className='mb-lg-0 mb-4'>
              <div className='d-flex flex-sm-row flex-column justify-content-between mx-n2'>

               
                <div className='mb-sm-0 mb-4 px-2'>
                  <Link href='/tg'>
                    <a className='d-inline-flex mb-4'>
                      <ImageLoader priority src='/images/logo/immoask-logo-removebg.png' width={116} height={112} placeholder={false} alt='ImmoAsk' />
                    </a>
                  </Link>
                  <div className='pt-2'>
                    ImmoAsk est un marketplace immobilier et foncier avec un CRM de gestion immobiliere booste par une intelligence artificielle.
                  </div>
                  <Nav className='flex-column mb-sm-4 mb-2'>
                    <Nav.Item className='mb-2'>
                      <Nav.Link href='mailto:example@email.com' active={false} className='p-0 fw-normal'>
                        <i className='fi-mail me-2 align-middle opacity-70'></i>
                        contact@immoask.com
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link href='tel:0022870453625' active={false} className='p-0 fw-normal'>
                        <i className='fi-device-mobile me-2 align-middle opacity-70'></i>
                        (+228) 7045-3625
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>
                  <div className='pt-2'>
                    <SocialButton href='https://facebook.com/immoask' variant='solid' brand='facebook' roundedCircle className='me-2 mb-2' />
                    <SocialButton href='https://twitter.com/immoask' variant='solid' brand='twitter' roundedCircle className='me-2 mb-2' />
                    <SocialButton href='https://linkedin.com/in/immoask' variant='solid' brand='linkedin' roundedCircle className='mb-2' />
                  </div>
                </div>

                
                <div className='mb-sm-0 mb-4 px-2'>
                  <h4 className='h5'>Produits</h4>
                  <Nav className='flex-column'>
                    <Nav.Item className='mb-2'>
                      <Link href='/tg/catalog?usage=3' passHref>
                        <Nav.Link active={false} className='p-0 fw-normal'>Acquérir un immeuble en securite</Nav.Link>
                      </Link>
                    </Nav.Item>
                    <Nav.Item className='mb-2'>
                      <Link href='/tg/add-property' passHref>
                        <Nav.Link active={false} className='p-0 fw-normal'>Lister un bien immobilier</Nav.Link>
                      </Link>
                    </Nav.Item>
                    <Nav.Item className='mb-2'>
                      <Link href='/tg/catalog?usage=1' passHref>
                        <Nav.Link active={false} className='p-0 fw-normal'>Trouver un logement en temps</Nav.Link>
                      </Link>
                    </Nav.Item>
                    <Nav.Item className='mb-2'>
                      <Link href='/tg/catalog?usage=5' passHref>
                        <Nav.Link active={false} className='p-0 fw-normal'>Reserver un sejour meublé</Nav.Link>
                      </Link>
                    </Nav.Item>
                    <Nav.Item className='mb-2'>
                      <Link href='/tg/catalog?usage=3' passHref>
                        <Nav.Link active={false} className='p-0 fw-normal'>Trouver un emplacement entreprise</Nav.Link>
                      </Link>
                    </Nav.Item>
                    <Nav.Item className='mb-2'>
                      <Link href='/tg/account-properties' passHref>
                        <Nav.Link active={false} className='p-0 fw-normal'>Gerer votre bien immobilier</Nav.Link>
                      </Link>
                    </Nav.Item>
                    <Nav.Item className='mb-2'>
                      <Link href='/tg/account-rentpayments' passHref>
                        <Nav.Link active={false} className='p-0 fw-normal'>Payer le loyer autrement</Nav.Link>
                      </Link>
                    </Nav.Item>
                  </Nav>
                </div>

               
                <div className='px-2'>
                  <h4 className='h5'>Nous rejoindre</h4>
                  <Nav className='flex-column'>
                    <Nav.Item className='mb-2'>
                      <Link href='#' passHref>
                        <Nav.Link active={false} className='p-0 fw-normal'>Souscrire a notre chaine FlashImmo</Nav.Link>
                      </Link>
                    </Nav.Item>
                    <Nav.Item className='mb-2'>
                      <Link href='#' passHref>
                        <Nav.Link active={false} className='p-0 fw-normal'>Rejoindre notre reseau de professionnels immobiliers</Nav.Link>
                      </Link>
                    </Nav.Item>
                    <Nav.Item className='mb-2'>
                      <Link href='#' passHref>
                        <Nav.Link active={false} className='p-0 fw-normal'>Assistance client</Nav.Link>
                      </Link>
                    </Nav.Item>
                    <Nav.Item className='mb-2'>
                      <Link href='#' passHref>
                        <Nav.Link active={false} className='p-0 fw-normal'>A propos de nous</Nav.Link>
                      </Link>
                    </Nav.Item>
                    <Nav.Item className='mb-2'>
                      <Link href='#' passHref>
                        <Nav.Link active={false} className='p-0 fw-normal'>Soumettre un projet immobilier</Nav.Link>
                      </Link>
                    </Nav.Item>
                  </Nav>
                </div>
              </div>
            </Col>

            
            <Col lg={4} xl={{ span: 5, offset: 1 }}>
              <h4 className='h5'>Notre blog immobilier</h4>
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

          

        </Container>
      </footer> */
}
