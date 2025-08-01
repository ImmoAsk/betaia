import { useState, useEffect } from 'react'
import RealEstatePageLayout from '../../components/partials/RealEstatePageLayout'
import Link from 'next/link'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Modal from 'react-bootstrap/Modal'
import CloseButton from 'react-bootstrap/CloseButton'
import Form from 'react-bootstrap/Form'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import ToggleButton from 'react-bootstrap/ToggleButton'
import ImageLoader from '../../components/ImageLoader'
import IconBox from '../../components/IconBox'
import PropertyCard from '../../components/PropertyCard'
import SocialButton from '../../components/SocialButton'
import StarRating from '../../components/StarRating'
import { Navigation, Pagination, EffectFade, Autoplay } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import { useSession } from 'next-auth/react'
import axios from "axios";
//import 'nouislider/distribute/nouislider.css'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/effect-fade'
import styles from './Carousel.module.css'
import getPropertyFullUrl from '../../utils/getPropertyFullURL'
import getFirstImageArray from '../../utils/formatFirsImageArray'
import buildPropertyBadge from '../../utils/buildPropertyBadge'
import propertyCategories from '../../remoteAPI/propertyCategories.json'
import BgParallaxHeroMessage from '../../components/iacomponents/BgParallaxHeroMessage'
import { useRouter } from 'next/router';
import { getHumanReadablePrice } from '../../utils/generalUtils'
import { API_URL } from '../../utils/settings'
import SuperCategoryProperties from '../../components/iacomponents/SuperCategoryList/SuperCategoryProperties'
import ImageSized from '../../components/iacomponents/ImageSized'
const HomePage = () => {

  const router = useRouter();
  // Property cost calculator modal
  const [modalShow, setModalShow] = useState(false)
  const handleModalClose = () => setModalShow(false)
  const handleModalShow = () => setModalShow(true)
  // Form validation
  const [validated, setValidated] = useState(false)
  const [realTimeProperties, setRealTimeProperties] = useState([]);

  const handleSubmit = (event) => {
    const form = event.currentTarget
    if (form.checkValidity() === false) {
      event.preventDefault()
      event.stopPropagation()
    }
    setValidated(true);
  }

  // Number of rooms radios buttons (Cost calculator modal)
  const [roomsValue, setRoomsValue] = useState('')
  const rooms = [
    { name: '1', value: '1' },
    { name: '2', value: '2' },
    { name: '3', value: '3' },
    { name: '4', value: '4' },
    { name: '5+', value: '5+' }
  ]

  const { data: session } = useSession()
  //console.log(apiUrl);
  const getRTProperties = () => {

    axios.get(`${API_URL}?query={get5Properties(orderBy:{column:NUO,order:DESC},limit:5){surface,badge_propriete{badge{badge_name,badge_image}},nuitee,id,nuo,usage,offre{denomination},categorie_propriete{denomination},pays{code},piece,titre,garage,cout_mensuel,ville{denomination},wc_douche_interne,cout_vente,quartier{denomination,minus_denomination},visuels{uri,position}}}`).
      then((res) => {
        setRealTimeProperties(res.data?.data?.get5Properties.map((property) => {
          //const { status, data:badges_property, error, isFetching,isLoading,isError }  = usePropertyBadges(property.id);
          return {
            href: getPropertyFullUrl(property.pays.code, property.offre.denomination, property.categorie_propriete.denomination, property.ville.denomination, property.quartier.minus_denomination, property.nuo),
            images: [[getFirstImageArray(property.visuels), 467, 305, 'Image']],
            title: 'N°' + property.nuo + ': ' + property.categorie_propriete.denomination + ' à ' + property.offre.denomination + ' | ' + property.surface + 'm²',
            category: property.usage,
            location: property.quartier.denomination + ", " + property.ville.denomination,
            price: getHumanReadablePrice(property),
            badges: buildPropertyBadge(property.badge_propriete),
            footer: [property.piece, property.wc_douche_interne, property.garage],
          }
        }));
      });
  }


  // Function to handle redirection on button click
  const handleLogementRedirect = () => {
    router.push('/tg/catalog?usage=1');
  };

  const displayCreationAccountButton = () => {
    return (
      <Link href='/signup-light' passHref>
        {/* <Button size='sm' className='order-lg-3 ms-2'>
                  <i className='fi-plus me-2'></i>
                  Lancer <span className='d-none d-sm-inline'>un projet immobilier</span>
                </Button> */}
        <Button variant='outline-primary' size='lg'>
          <i className='fi-user me-2'></i>
          Créer <span className='d-none d-sm-inline'>votre compte</span>
        </Button>

      </Link>
    )
  };

  const displayCreationProjectButton = () => {
    return (
      <Link href='/tg/add-project' passHref>
        <Button variant='outline-primary' size='lg'>
          <i className='fi-file me-2'></i>
          Lancer <span className='d-none d-sm-inline'>un projet immobilier</span>
        </Button>

      </Link>
    )
  };
  const displayCreationContractButton = () => {
    return (
      <Link href="/tg/account-contracts" passHref>
        <Button
          size="lg"
          variant="outline-primary"
        >
          <i className="fi-file me-2"></i>
          Créer <span className='d-none d-sm-inline'>un contrat immobilier</span>
        </Button>
      </Link>
    );
  };
  const handleAcquisitionRedirect = () => {
    router.push('/tg/catalog?usage=7');
  };
  const handleEntrepriseRedirect = () => {
    router.push('/tg/catalog?usage=3');
  };
  const handleSejourRedirect = () => {
    router.push('/tg/catalog?usage=5');
  };
  useEffect(() => {
    getRTProperties();
  }, []);

  const carouselSlides = [
    {
      bgImage: '/images/tg/housing_welcome.png',
      title: 'Trouvez un logement ou achetez en toute sécurité',
      subtitle: 'Villas, appartements, terrains, bureaux et magasins disponibles auprès de propriétaires et agents certifiés.',
      buttonLabel: 'Explorer le catalogue',
      buttonLink: '/tg/catalog'
    },
    {
      bgImage: '/images/tg/sejour_welcome.png',
      title: 'Boostez votre visibilité immobilière',
      subtitle: 'Devenez agent immobilier et augmentez vos revenus jusqu’à 35 % grâce à notre marketing automatisé.',
      buttonLabel: 'Lister un immeuble',
      buttonLink: '/tg/add-property'
    },
    {
      bgImage: '/images/tg/vente_welcome.png',
      title: 'Gérez vos biens sans stress',
      subtitle: 'Contrats, états des lieux, paiements et maintenance centralisés sur une seule plateforme.',
      buttonLabel: 'Créer un contrat immobilier',
      buttonLink: '/tg/account-contracts'
    }
  ];


  return (
    <RealEstatePageLayout
      pageTitle='Trouver aisément un logement urbain ou rural et acheter en sécurité les terrains et immeubles et biens immobiliers au Togo'
      pageDescription='Découvrez les meilleures offres immobilières au Togo. Trouvez facilement un logement urbain ou rural à louer, ainsi que des terrains et immeubles à acheter en toute sécurité. ImmoAsk vous accompagne dans l&rsquo;achat, la vente, la location et la gestion de patrimoine immobilier.'
      pageKeywords='achat, vente, location, gestion de patrimoine, agent immobilier IA, tourisme, décoration, BTP'
      pageUrl='https://immoask.com/tg'
      activeNav='Home'
      userLoggedIn={session ? true : false}
    >

      {/* Property cost calculator modal */}
      <Modal
        centered
        show={modalShow}
        onHide={handleModalClose}
      >
        <Modal.Header className='d-block position-relative border-0 pb-0 px-sm-5 px-4'>
          <Modal.Title as='h4' className='mt-4 text-center'>Explore your property’s value</Modal.Title>
          <CloseButton
            onClick={handleModalClose}
            aria-label='Close modal'
            className='position-absolute top-0 end-0 mt-3 me-3'
          />
        </Modal.Header>
        <Modal.Body className='px-sm-5 px-4'>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group controlId='property-city' className='mb-3'>
              <Form.Label className='fw-bold mb-2'>
                Property location
              </Form.Label>
              <Form.Select required>
                <option value=''>Choose city</option>
                <option value='Chicago'>Chicago</option>
                <option value='Dallas'>Dallas</option>
                <option value='Los Angeles'>Los Angeles</option>
                <option value='New York'>New York</option>
                <option value='San Diego'>San Diego</option>
              </Form.Select>
              <Form.Control.Feedback type='invalid'>
                Please choose the city.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className='mb-3'>
              <Form.Select required>
                <option value=''>Choose district</option>
                <option value='Brooklyn'>Brooklyn</option>
                <option value='Manhattan'>Manhattan</option>
                <option value='Staten Island'>Staten Island</option>
                <option value='The Bronx'>The Bronx</option>
                <option value='Queens'>Queens</option>
              </Form.Select>
              <Form.Control.Feedback type='invalid'>
                Please choose the district.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId='property-address' className='pt-2 mb-3'>
              <Form.Label className='fw-bold mb-2'>Address</Form.Label>
              <Form.Control placeholder='Enter your address' required />
              <Form.Control.Feedback type='invalid'>
                Please provide your property&apos;s address.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className='pt-2 mb-3'>
              <Form.Label className='d-block fw-bold mb-2'>Number of rooms</Form.Label>
              <ButtonGroup>
                {rooms.map((room, indx) => (
                  <ToggleButton
                    key={indx}
                    type='radio'
                    id={`rooms-${indx}`}
                    name='rooms'
                    value={room.value}
                    checked={roomsValue === room.value}
                    onChange={(e) => setRoomsValue(e.currentTarget.value)}
                    variant='outline-secondary'
                  >{room.name}</ToggleButton>
                ))}
              </ButtonGroup>
            </Form.Group>
            <Form.Group controlId='property-area' className='pt-2 mb-4'>
              <Form.Label className='fw-bold mb-2'>Total area, sq.m.</Form.Label>
              <Form.Control placeholder='Enter your property area' required />
              <Form.Control.Feedback type='invalid'>
                Please enter your property&apos;s area.
              </Form.Control.Feedback>
            </Form.Group>
            <Button type='submit' variant='primary d-block w-100 mb-4'>
              <i className='fi-calculator me-2'></i>
              Calculate
            </Button>
          </Form>
        </Modal.Body>
      </Modal>


      {/* Hero */}
      <Container as='section' className='pt-5 my-5 pb-lg-0' fluid>
        {/* <Row className='pt-0 pt-md-2 pt-lg-0'>
          <Col md={{ span: 7, order: 1 }} lg={7} xl={7} className='pt-xl-5 pe-lg-0 mb-3 text-md-start text-center'>
            <h1 className='mt-lg-0 mb-md-4 mb-3 pt-md-4 pb-lg-2'>Trouver aisément un logement, et acheter en sécurité un immeuble</h1>
            <p className='display-relative lead me-lg-n5'>
              Trouver facilement en temps des logements urbains ou des baux commerciaux.<br />
              Acquérir un immeuble bâti ou non, avec une sécurité foncière garantie.<br />
              Investir dans des terrains et des appartements en cours de construction.<br />
              <b>Gérer. Investir. Louer. Vendre </b> <br />
            </p>

            {session ? (
              session.user.roleId === "1230" || session.user.roleId === "1200" ? displayCreationContractButton()
                : session.user.roleId === "1232" || session.user.roleId === "1200" ? displayCreationProjectButton()
                  : session.user.roleId === "151" ? displayCreationProjectButton()
                    : null
            ) : (
              displayCreationAccountButton()
            )}
    

            <Link href='/tg/add-property' passHref>
              <Button className='outline-primary order-lg-3 ms-2' size='lg'>
                <i className='fi-building me-2'></i>
                Lister <span className='d-none d-sm-inline'>votre immeuble</span>
              </Button>
            </Link>

          </Col>
          <Col md={{ span: 5, order: 2 }} lg={5} xl={5} className='mb-1 mb-lg-3'>
            <ImageSized
              imageUri='/images/tg/welcome_image.png'
              width={800}
              height={500}
              alt='Bienvenue sur ImmoAsk'
            />
          </Col>
        </Row> */}
        <Row className='pt-0 pt-md-2 pt-lg-0'>
          <Col lg={6} xs={12} className='mb-lg-0'>
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              navigation
              pagination={{ clickable: true }}
              loop
              grabCursor
              autoplay={{
                delay: 2000,         // Time between slides (in ms)
                disableOnInteraction: false // Keeps autoplay running after interaction
              }}
              //style={{ height: '750px' }}
              className={`swiper-nav-onhover  ${styles.carouselSlide}`}
            >
              {carouselSlides.map((slide, index) => (
                <SwiperSlide key={index} className='bg-light'>
                  <div
                    className={`d-flex flex-column justify-content-center align-items-center text-white text-center px-4 ${styles.carouselSlide}`}
                    style={{
                      backgroundImage: `url(${slide.bgImage})`,
                      backgroundSize: 'cover',
                      borderRadius: '0.5rem',
                      opacity: 0.85,
                      backgroundPosition: 'center'
                    }}
                  >
                    <h2 className="mb-2 h2 fw-bold text-white">{slide.title}</h2>
                    <p className="pb-2 h3 opacity-70 text-white">{slide.subtitle}</p>
                    <Link href={slide.buttonLink} passHref>
                      <a className="btn btn-primary">{slide.buttonLabel}</a>
                    </Link>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </Col>
          <Col lg={6} xs={12} className='mb-3 mb-lg-0'>
            <Row xs={2} sm={3} lg={4} className='g-3 g-xl-4'>
              {propertyCategories[0].map((category, indx) => (
                <Col key={indx}>
                  <IconBox
                    href={category.href}
                    media={category.media}
                    mediaShape='circle'
                    title={category.title}
                    type='card-shadow'
                    align='center'
                  />
                </Col>
              ))}
              {propertyCategories[1].map((category, indx) => (
                <Col key={indx}>
                  <IconBox
                    href={category.href}
                    media={category.media}
                    mediaShape='circle'
                    title={category.title}
                    type='card-shadow'
                    align='center'
                  />
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
        {/* The fixed height should be set to swiper container in order for vertical slider to work */}

      </Container>


      {/* Categories */}
      {/* <Container as='section' className='mb-2'>
        <Row xs={2} sm={3} lg={6} className='g-3 g-xl-4'>
          {propertyCategories[0].map((category, indx) => (
            <Col key={indx}>
              <IconBox
                href={category.href}
                media={category.media}
                mediaShape='circle'
                title={category.title}
                type='card-shadow'
                align='center'
              />
            </Col>
          ))}
        </Row>
        <Row xs={2} sm={3} lg={6} className='g-3 g-xl-4 mt-3'>
          {propertyCategories[1].map((category, indx) => (
            <Col key={indx}>
              <IconBox
                href={category.href}
                media={category.media}
                mediaShape='circle'
                title={category.title}
                type='card-shadow'
                align='center'
              />
            </Col>
          ))}
        </Row>
      </Container> */}


      {/* Services (carousel on screens < 992px) */}
      <Container as='section' className='mb-5 mt-n3 mt-lg-0'>
        <Swiper
          modules={[Pagination]}
          pagination={{
            el: '#paginationServices1',
            clickable: true
          }}
          spaceBetween={24}
          breakpoints={{
            0: { slidesPerView: 1 },
            500: { slidesPerView: 2 },
            768: { slidesPerView: 3 }
          }}
          className='py-3 mx-n2'
        >
          <SwiperSlide>
            <Card className='card-hover border-0 h-100 pb-2 pb-sm-3 px-sm-3 text-center mx-2'>
              <div className='d-flex justify-content-center my-3'>
                <ImageSized imageUri='/images/tg/illustrations/acheter_immeuble.png' width={256} height={190} alt={"Acheter un immeuble"} />
              </div>
              <Card.Body>
                <h2 className='h4 card-title'>Acheter un immeuble</h2>
                <p className='card-text fs-sm'>Un terrain rural ou urbain à acheter? Une maison ou villa à acquérir? Trouver
                  des villas, des appartements F3, F4, F5 avec jardin ou piscine biens construits et modernes en vente. Explorer notre
                  catalogue de biens immobiliers en vente librement</p>
              </Card.Body>
              <Card.Footer className='pt-0 border-0'>
                <Link href='/tg/catalog?offre=2' passHref>
                  <Button variant='outline-primary stretched-link'>Acheter un immeuble</Button>
                </Link>
              </Card.Footer>
            </Card>
          </SwiperSlide>
          <SwiperSlide>
            <Card className='card-hover border-0 h-100 pb-2 pb-sm-3 px-sm-3 text-center mx-2'>
              <div className='d-flex justify-content-center my-3'>
                <ImageSized imageUri="/images/tg/illustrations/lister_immeuble.png" width={256} height={190} alt={"Lister un immeuble sur ImmoAsk"} />
              </div>
              <Card.Body>
                <h2 className='h4 card-title'>Lister un immeuble</h2>
                <p className='card-text fs-sm'>Une maison délabrée, un terrain urbain ou rural,
                  un appartement moderne ou une villa F1,F2, ou une maison de n chambres salon. Ou les chambres salon, les appartement à mettre en location ?
                  Créer votre mise en vente ou location immobilière.</p>
              </Card.Body>
              <Card.Footer className='pt-0 border-0'>
                <Link href='/tg/add-property' passHref>
                  <Button variant='outline-primary stretched-link'>Lister un immeuble</Button>
                </Link>
              </Card.Footer>
            </Card>
          </SwiperSlide>
          <SwiperSlide>
            <Card className='card-hover border-0 h-100 pb-2 pb-sm-3 px-sm-3 text-center mx-2'>
              <div className='d-flex justify-content-center my-3'>
                <ImageSized imageUri='/images/tg/illustrations/lancer_requete_immobiliere.png' width={256} height={190} alt={"Lancer un projet immobilier"} />
              </div>
              <Card.Body>
                <h2 className='h4 card-title'>Lancer un projet immobilier</h2>
                <p className='card-text fs-sm'>Suivre l'exécution d'un chantier immobilier... Un projet de logement ou d'achat immobilier, Souhaitez vous
                  un séjour meublé? Vous recherchez une villa ou appartement spécifique pour habitation? Lancer votre projet immobilier!</p>
              </Card.Body>
              <Card.Footer className='pt-0 border-0'>
                <Link href='/tg/add-project' passHref>
                  <Button variant='outline-primary stretched-link'>Lancer un projet immobilier</Button>
                </Link>
              </Card.Footer>
            </Card>
          </SwiperSlide>

        </Swiper>
        <div id='paginationServices1' className='swiper-pagination position-relative bottom-0 d-md-none mt-2'></div>
        <Swiper
          modules={[Pagination]}
          pagination={{
            el: '#paginationServices',
            clickable: true
          }}
          spaceBetween={24}
          breakpoints={{
            0: { slidesPerView: 1 },
            500: { slidesPerView: 2 },
            768: { slidesPerView: 3 }
          }}
          className='py-3 mx-n2'
        >
          <SwiperSlide>
            <Card className='card-hover border-0 h-100 pb-2 pb-sm-3 px-sm-3 text-center mx-2'>
              <div className='d-flex justify-content-center my-3'>
                <ImageSized imageUri='/images/tg/illustrations/creer_experience.png' width={256} height={190} alt={"Créer de l'experience"} />
              </div>
              <Card.Body>
                <h2 className='h4 card-title'>Créer de l'experience</h2>
                <p className='card-text fs-sm'>Sejours, excursion ou voyages ou lunes de miel cette semaine ou ce weekend? Commencer votre experience
                  dans nos appartements et villas meublés sélectionnés avec soin : moins chers et plus confortables. </p>
              </Card.Body>
              <Card.Footer className='pt-0 border-0'>
                <Link href='/tg/catalog?usage=5' passHref>
                  <Button variant='outline-primary stretched-link'>Explorer nos immeubles meublés</Button>
                </Link>
              </Card.Footer>
            </Card>
          </SwiperSlide>
          <SwiperSlide>
            <Card className='card-hover border-0 h-100 pb-2 pb-sm-3 px-sm-3 text-center mx-2'>
              <div className='d-flex justify-content-center my-3'>
                <ImageSized imageUri='/images/tg/illustrations/lancer_entreprise.png' width={256} height={190} alt={"Lancer une entreprise"} />
              </div>
              <Card.Body>
                <h2 className='h4 card-title'>Lancer une entreprise</h2>
                <p className='card-text fs-sm'>Les entreprises se lancent ici. Vos bureaux, magasins et entrepots, et Boutiques
                  en location. Voulez-vous bailler plutot pour une longue durée? Découvrir les endroits à forte valeur commerciale et choisir le bon emplacement de votre entreprise.</p>
              </Card.Body>
              <Card.Footer className='pt-0 border-0'>
                <Link href='/tg/catalog?usage=3' passHref>
                  <Button variant='outline-primary stretched-link'>Explorer nos immeubles d'entreprise</Button>
                </Link>
              </Card.Footer>
            </Card>
          </SwiperSlide>
          <SwiperSlide>
            <Card className='card-hover border-0 h-100 pb-2 pb-sm-3 px-sm-3 text-center mx-2'>
              <div className='d-flex justify-content-center my-3'>
                <ImageSized imageUri='/images/tg/illustrations/trouver_logement.png' width={256} height={190} alt={"Trouver un logement"} />
              </div>
              <Card.Body>
                <h2 className='h4 card-title'>Trouver un logement</h2>
                <p className='card-text fs-sm'>Logement ancien ou moderne ?
                  Chambres salon, Villas, Appartements ou une chambre en location vous attendent..
                  Changez d'air. Commencer votre déménagement avec nous et découvrir d'autres quartiers ou villes</p>
              </Card.Body>
              <Card.Footer className='pt-0 border-0'>
                <Link href='/tg/catalog?usage=1' passHref>
                  <Button variant='outline-primary stretched-link'>Trouver un logement</Button>
                </Link>
              </Card.Footer>
            </Card>
          </SwiperSlide>

        </Swiper>

        {/* External pagination (bullets) */}
        <div id='paginationServices' className='swiper-pagination position-relative bottom-0 d-md-none mt-2'></div>
      </Container>
      {/* Top properties LOGEMENTS*/}
      <Container fluid className='px-xxl-4 pb-lg-4 pb-1 mb-3 mt-3'>
        <div className='d-flex align-items-center justify-content-between mb-3'>
          <h2 className='h3 mb-0'>Des logements uniques en location pour vous</h2>
          <Link href='/tg/catalog?usage=1' passHref>
            <Button size='md' variant='outline-primary' className='order-lg-3 ms-2'>
              Consulter tout
            </Button>
          </Link>
        </div>
        <div className='d-flex align-items-center justify-content-between'>
          <h3 className='h5'>Villas | Chambres salon | Appartements | Chambres </h3>
        </div>
        <SuperCategoryProperties usage={1} status={1} />
        {/* External Prev/Next buttons */}
        <div className='d-flex justify-content-center py-md-2 mt-4'>
          <Button id='prevProprties' variant='prev position-relative mx-2' />
          <Button id='nextProprties' variant='next position-relative mx-2' />
        </div>
      </Container>

      {/* Appel aux produits LOGEMENTS*/}
      <Container as='section' className='mb-5 mt-n3 mt-lg-0'>
        <BgParallaxHeroMessage image={'/images/tg/housing_welcome.png'} message={`Il est conseillé de changer d'air et de logements annuellement`} action={handleLogementRedirect} callAction={"Explorer les logements maintenant"} />
      </Container>
      {/* Appel au produit Expertim */}
      {/* <Container as='section' className='mb-5 pb-2 pb-lg-4'>
        <Row className='align-items-center'>
          <Col md={5}>
            <div className='d-flex justify-content-center justify-content-md-start mb-md-0 mb-4'>
              <ImageLoader
                src='/images/tg/illustrations/calculator.svg'
                width={416}
                height={400}
                alt='Illustration'
              />
            </div>
          </Col>
          <Col md={7} xxl={6} className='text-md-start text-center'>
            <h2>Estimation ou évaluation immobilière ?</h2>
            <p className='pb-3 fs-lg'>Avant de mettre en location, colocation ou en vente un immeuble, lancer notre outil Expertim et estimer votre immeuble. SI vous souhaiter un 
            service plus avancé afin d'eviter la surenchère ou la sous valorisation immobilière, notre ingénieur civil et commercial descent chez vous.</p>
            <Button size='lg' onClick={handleModalShow}>
              <i className='fi-calculator me-2'></i>
              Tester l'outil Expertim
            </Button>
          </Col>
        </Row>
      </Container> */}

      {/* Top properties ACQuisition */}
      <Container fluid className='px-xxl-4 pb-lg-4 pb-1 mb-3 mt-3'>
        <div className='d-flex align-items-center justify-content-between mb-3'>
          <h2 className='h3 mb-0'>Des terrains urbains et ruraux à vendre à votre portée</h2>
          <Link href='/tg/catalog?usage=7' passHref>
            <Button size='md' variant='outline-primary' className='order-lg-3 ms-2'>
              Consulter tout
            </Button>
          </Link>
        </div>
        <div className='d-flex align-items-center justify-content-between'>
          <h3 className='h5'>Terrains | Villas | Appartements | Maisons | Immeubles</h3>
        </div>

        <SuperCategoryProperties usage={7} status={1} />

        {/* External Prev/Next buttons */}
        <div className='d-flex justify-content-center py-md-2 mt-4'>
          <Button id='prevProprties2' variant='prev position-relative mx-2' />
          <Button id='nextProprties2' variant='next position-relative mx-2' />
        </div>
      </Container>
      <Container as='section' className='mb-5 mt-n3 mt-lg-0'>
        <BgParallaxHeroMessage image={'/images/tg/vente_welcome.png'} message={`
        C'est le meilleur moment pour commencer un projet d'achat immobilier.`} action={handleAcquisitionRedirect} callAction={"Consulter les immeubles en vente"} />

      </Container>
      {/* Appel au produit ImmoMag */}
      {/* <Container as='section' className='mb-5 pb-2 pb-lg-4'>
        <Row className='align-items-center'>
          <Col md={5}>
            <div className='d-flex justify-content-center justify-content-md-start mb-md-0 mb-4'>
              <ImageLoader
                src='/images/tg/illustrations/calculator.svg'
                width={416}
                height={400}
                alt='Illustration'
              />
            </div>
          </Col>
          <Col md={7} xxl={6} className='text-md-start text-center'>
            <h2>Support papier de l'immobilier ?</h2>
            <p className='pb-3 fs-lg'>L'immobilier, le foncier, la décoration intérieure, 
            les projets d'habitations...le tout dans une ambiance d'histoire sans fin de nos voisins. Tout cela 
            en support papier dans vos mains: exactement 20 pages</p>
            <Button size='lg' onClick={handleModalShow}>
              <i className='fi-calculator me-2'></i>
              Découvrir ImmoMag
            </Button>
          </Col>
        </Row>
      </Container> */}
      {/* Investissements immobiliers */}
      {/* <Container as='section' className='pb-4 mb-5'>
        <div className='d-flex align-items-end align-items-lg-center justify-content-between mb-4 pb-md-2'>
          <div className='d-flex w-100 align-items-center justify-content-between justify-content-lg-start'>
            <h2 className='h3 mb-0 me-md-4'>Placer votre économie en investissant dans des biens immobiliers</h2>
          </div>
          
          <Link href='/tg/catalog?category=rent' passHref>
            <Button variant='link fw-normal d-none d-lg-block p-0'>
              Consulter tout
              <i className='fi-arrow-long-right ms-2'></i>
            </Button>
          </Link>
        </div>
        <Row className='g-4'>
          <Col md={6}>
            <PropertyCardOverlay
              img={{
                src: '/images/tg/recent/01.jpg',
                alt: 'Background image'
              }}
              href='/tg/single-v1'
              title='Hotel 5 étages'
              category='En vente et Investir'
              location='118-11 Sutphin Blvd Jamaica, NY 11434'
              overlay
              badges={[['success', 'Verified'], ['info', 'New']]}
              button={{
                href: '/tg/single-v1',
                title: 'XOF140,000,000',
                variant: 'primary',
                wishlistProps: {
                  onClick: () => console.log('You\'ve added Luxury Rental Villa property to your wishlist!')
                }
              }}
              className='h-100'
            />
          </Col>
          <Col md={6}>
            <PropertyCardOverlay
              img={{
                src: '/images/tg/recent/02.jpg',
                alt: 'Background image'
              }}
              href='/tg/single-v1'
              title='Duplex with Garage'
              category='For sale'
              location='21 Pulaski Road Kings Park, NY 11754'
              overlay
              badges={[['info', 'New']]}
              button={{
                href: '/tg/single-v1',
                title: '$200,410',
                variant: 'primary',
                wishlistProps: {
                  onClick: () => console.log('You\'ve added Duplex with Garage property to your wishlist!')
                }
              }}
              className='mb-4'
            />
            <PropertyCardOverlay
              img={{
                src: '/images/tg/recent/03.jpg',
                alt: 'Background image'
              }}
              href='/tg/single-v1'
              title='Country House'
              category='For sale'
              location='6954 Grand AveMaspeth, NY 11378'
              overlay
              badges={[['info', 'New']]}
              button={{
                href: '/tg/single-v1',
                title: '$162,000',
                variant: 'primary',
                wishlistProps: {
                  onClick: () => console.log('You\'ve added Country House property to your wishlist!')
                }
              }}
            />
          </Col>
        </Row>
      </Container> */}
      {/* <Container as='section' className='mb-5 mt-n3 mt-lg-0'>
        
        <BgParallaxHeroMessage image={'/images/tg/hero-image-v2.jpg'} message={`
        Nous vous offrons plus que ce que les structures bancaires offrent.
              Gagner aumoins 20% sur votre investissement immobilier.`} action={handleModalShow} callAction={"Placer votre investissement immobilier"}/>
      </Container> */}
      {/* Appel au produit Timmo */}
      {/* <Container as='section' className='mb-5 pb-2 pb-lg-4'>
        <Row className='align-items-center'>
          <Col md={5}>
            <div className='d-flex justify-content-center justify-content-md-start mb-md-0 mb-4'>
              <ImageLoader
                src='/images/tg/illustrations/calculator.svg'
                width={416}
                height={400}
                alt='Illustration'
              />
            </div>
          </Col>
          <Col md={7} xxl={6} className='text-md-start text-center'>
            <h2>Tontine immobilière ? Ca vous dit</h2>
            <p className='pb-3 fs-lg'>Les terrains deviennent de plus en plus chers à cause du taux d'urbanisation et
            de l'evolution de vie. Participer avec nous à la réduction du prix d'acquisition en intégrant des groupes
            de tontine immobilière de 150 m², 300 m² , ou 600 m²</p>
            <Button size='lg' onClick={handleModalShow}>
              <i className='fi-calculator me-2'></i>
              En savoir plus
            </Button>
          </Col>
        </Row>
      </Container> */}

      {/* Top properties Experience et Sejours*/}
      <Container fluid className='px-xxl-4 pb-lg-4 pb-1 mb-3 mt-3'>
        <div className='d-flex align-items-center justify-content-between mb-3'>
          <h2 className='h3 mb-0'>Une experience unique et inoubliable! Un séjour confortable et abordable.</h2>
          <Link href='/tg/catalog?usage=5' passHref>
            <Button size='md' variant='outline-primary' className='order-lg-3 ms-2'>
              Consulter tout
            </Button>
          </Link>
        </div>
        <div className='d-flex align-items-center justify-content-between'>
          <h3 className='h5'>Séjour meublé | Appartement meublé | Villa meublées | Studio meublé </h3>
        </div>
        <SuperCategoryProperties usage={5} status={1} />
        {/* External Prev/Next buttons */}
        <div className='d-flex justify-content-center py-md-2 mt-4'>
          <Button id='prevProprties3' variant='prev position-relative mx-2' />
          <Button id='nextProprties3' variant='next position-relative mx-2' />
        </div>
      </Container>
      <Container as='section' className='mb-5 mt-n3 mt-lg-0'>
        <BgParallaxHeroMessage image={'/images/tg/sejour_welcome.png'} message={`Détente. Excursions. Voyages d'affaires moins chers. De nouvels horizons dans nos meublés.`} action={handleSejourRedirect} callAction={"Faire une expérience"} />
      </Container>
      {/* Appel au produit ImmoAsk Business */}
      {/* <Container as='section' className='mb-5 pb-2 pb-lg-4'>
        <Row className='align-items-center'>
          <Col md={5}>
            <div className='d-flex justify-content-center justify-content-md-start mb-md-0 mb-4'>
              <ImageLoader
                src='/images/tg/illustrations/calculator.svg'
                width={416}
                height={400}
                alt='Illustration'
              />
            </div>
          </Col>
          <Col md={7} xxl={6} className='text-md-start text-center'>
            <h2>Gérance immobilière 3.0 </h2>
            <p className='pb-3 fs-lg'>Vous etes propriétaire, un professionnel de l'immobilier
            et vous disposez plusieurs biens immobiliers à gérer. Créer les contrats, intégrer les locataires
            Un bilan financier de vos loyers, un suivi en temps réel de vos projets immobiliers?. Nous avons ImmoAsk Business pour vous</p>
            <Button size='lg' onClick={handleModalShow}>
              <i className='fi-calculator me-2'></i>
              Connaitre ImmoAsk Business
            </Button>
          </Col>
        </Row>
      </Container> */}

      {/* Biens Entreprise */}
      <Container fluid className='px-xxl-4 pb-lg-4 pb-1 mb-3 mt-3'>
        <div className='d-flex align-items-center justify-content-between mb-3'>
          <h2 className='h3 mb-0'>Commencer l'entrepreunariat ou accelerer avec nous</h2>
          <Link href='/tg/catalog?category=rent' passHref>
            <Button size='md' variant='outline-primary' className='order-lg-3 ms-2'>
              Consulter tout
            </Button>
          </Link>
        </div>
        <div className='d-flex align-items-center justify-content-between'>
          <h3 className='h5'>Bureaux | Magasins | Terrains à bailler | Espaces co-working</h3>
        </div>
        <SuperCategoryProperties usage={3} status={1} />

        {/* External Prev/Next buttons */}
        <div className='d-flex justify-content-center py-md-2 mt-4'>
          <Button id='prevProprties4' variant='prev position-relative mx-2' />
          <Button id='nextProprties4' variant='next position-relative mx-2' />
        </div>
      </Container>
      <Container as='section' className='mb-5 mt-n3 mt-lg-0'>
        <BgParallaxHeroMessage image={'/images/tg/entrepreneurs_welcome.png'} message={`Les bons emplacements pour vos entrepots et bureaus sont ici`} action={handleEntrepriseRedirect}
          callAction={"Explorer les immeubles d'entreprise"} />
      </Container>
      {/* Appel au produit LesVoisins */}
      {/* <Container as='section' className='mb-5 pb-2 pb-lg-4'>
        <Row className='align-items-center'>
          <Col md={5}>
            <div className='d-flex justify-content-center justify-content-md-start mb-md-0 mb-4'>
              <ImageLoader
                src='/images/tg/illustrations/calculator.svg'
                width={416}
                height={400}
                alt='Illustration'
              />
            </div>
          </Col>
          <Col md={7} xxl={6} className='text-md-start text-center'>
            <h2>Etes-vous membre de LesVoisins ?</h2>
            <p className='pb-3 fs-lg'>L'experientce clientele chez nous ne s'arrete pas 
            à la signature de l'acte de location, de réservation ou de vente. Vous devenez plutot membre de  LesVoisins.
            LesVoisins est une communauté des locataires qui souhaitent devenir propriétaires</p>
            <Button size='lg' onClick={handleModalShow}>
              <i className='fi-calculator me-2'></i>
              Comment devenir membre ?
            </Button>
          </Col>
        </Row>
      </Container> */}

      {/* Top property offers (carousel) */}
      <Container className='px-xxl-4 pb-lg-4 pb-1 mb-3 mt-3'>
        <div className='d-flex align-items-center justify-content-between mb-3'>
          <h2 className='h3 mb-0'>FlashImmo, des biens immobiliers en temps réel!</h2>
          <Link href='/tg/flashimmo' passHref>

            <Button size='md' variant='outline-primary' className='order-lg-3 ms-2'>
              Consulter tout
            </Button>
          </Link>
        </div>

        {/* Swiper slider */}
        <div className='position-relative'>
          <Swiper
            modules={[Navigation, Pagination]}
            navigation={{
              prevEl: '#prevProperties',
              nextEl: '#nextProperties'
            }}
            pagination={{
              el: '#paginationProperties',
              clickable: true
            }}
            loop
            spaceBetween={8}
            breakpoints={{
              0: { slidesPerView: 1 },
              500: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              992: { slidesPerView: 4 }
            }}
            className='pt-3 pb-4 mx-n2'
          >
            {realTimeProperties.map((property, indx) => (
              <SwiperSlide key={indx} className='h-auto'>
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
                      onClick: () => console.log('Bien immobilier bien ajouté!')
                    }
                  }}
                  footer={[
                    ['fi-bed', property.footer[0]],
                    ['fi-bath', property.footer[1]],
                    ['fi-car', property.footer[2]]
                  ]}
                  className='h-100 mx-2'
                />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* External Prev/Next buttons */}
          <Button id='prevProperties' variant='prev' className='d-none d-xxl-block mt-n5 ms-n5' />
          <Button id='nextProperties' variant='next' className='d-none d-xxl-block mt-n5 me-n5' />
        </div>

        {/* External pagination (bullets) buttons */}
        <div id='paginationProperties' className='swiper-pagination position-relative bottom-0 py-2 mt-1'></div>
      </Container>

      {/* Top agents (slider) */}
      <Container as='section' className='mb-5 pb-2 pb-lg-4'>
        <h2 className='h3 mb-0 pb-2 text-center text-md-start'>Propriétaires, professionnels immobiliers, huissiers et locataires temoignent</h2>
        <Swiper
          modules={[Navigation, EffectFade]}
          effect='fade'
          navigation={{
            prevEl: '#prevAgents',
            nextEl: '#nextAgents'
          }}
          loop
          autoHeight
          slidesPerView={1}
        >

          {/* Item */}
          <SwiperSlide className='bg-light py-4'>
            <Row className='align-items-center'>
              <Col xl={4} className='d-none d-xl-flex'>
                <ImageLoader
                  src='/images/tg/agents/01.jpg'
                  width={416}
                  height={400}
                  alt='Agent'
                  className='rounded-3'
                />
              </Col>
              <Col sm={4} md={5} xl={4} className='d-flex'>
                <ImageLoader
                  src='/images/tg/agents/02.jpg'
                  width={475}
                  height={457}
                  alt='Agent'
                  className='rounded-3'
                />
              </Col>
              <Col sm={8} md={7} xl={4} className='px-4 px-sm-3 px-md-0 ms-md-n4 mt-n5 mt-sm-0 py-3'>
                <Card className='border-0 shadow-sm ms-sm-n5'>
                  <Card.Body as='blockquote' className='blockquote'>
                    <h4 style={{ maxWidth: '22rem' }}>ImmoAsk a facilité mon paiement des cautions</h4>
                    <p className='d-sm-none d-lg-block'>
                      Grâce à ImmoAsk, j'ai pu sélectionner facilement les logements directement depuis mon téléphone. Après les visites, et malgré mes horaires de travail chargés, l'équipe commerciale d'ImmoAsk m'a aidé à finaliser rapidement le paiement des cautions.
                    </p>
                    <footer className='d-flex justify-content-between'>
                      <div className='pe3'>
                        <h6 className='mb-0'>E. Kossi</h6>
                        <div className='text-muted fw-normal fs-sm mb-3'>Locataire</div>
                        <SocialButton href='#' variant='solid' brand='facebook' roundedCircle className='mb-2 me-2' />
                        <SocialButton href='#' variant='solid' brand='twitter' roundedCircle className='mb-2 me-2' />
                        <SocialButton href='#' variant='solid' brand='linkedin' roundedCircle className='mb-2' />
                      </div>
                      <div>
                        <StarRating rating='4.9' />
                        <div className='text-muted fs-sm mt-1'>45 reviews</div>
                      </div>
                    </footer>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </SwiperSlide>

          {/* Item */}
          <SwiperSlide className='bg-light py-4'>
            <Row className='align-items-center'>
              <Col xl={4} className='d-none d-xl-flex'>
                <ImageLoader
                  src='/images/tg/agents/02.jpg'
                  width={416}
                  height={400}
                  alt='Agent'
                  className='rounded-3'
                />
              </Col>
              <Col sm={4} md={5} xl={4} className='d-flex'>
                <ImageLoader
                  src='/images/tg/agents/03.jpg'
                  width={475}
                  height={457}
                  alt='Agent'
                  className='rounded-3'
                />
              </Col>
              <Col sm={8} md={7} xl={4} className='px-4 px-sm-3 px-md-0 ms-md-n4 mt-n5 mt-sm-0 py-3'>
                <Card className='border-0 shadow-sm ms-sm-n5'>
                  <Card.Body as='blockquote' className='blockquote'>
                    <h4 style={{ maxWidth: '22rem' }}>ImmoAsk, la meilleure solution en gestion immobilière</h4>
                    <p className='d-sm-none d-lg-block'>
                      Nous avons fait confiance à ImmoAsk pour la gestion complète de notre parc immobilier, et en moins d'un an, notre chiffre d'affaires a augmenté de 20%.
                    </p>

                    <footer className='d-flex justify-content-between'>
                      <div className='pe3'>
                        <h6 className='mb-0'>William K.</h6>
                        <div className='text-muted fw-normal fs-sm mb-3'>Propriétaires de meubles</div>
                        <SocialButton href='#' variant='solid' brand='facebook' roundedCircle className='mb-2 me-2' />
                        <SocialButton href='#' variant='solid' brand='twitter' roundedCircle className='mb-2 me-2' />
                        <SocialButton href='#' variant='solid' brand='linkedin' roundedCircle className='mb-2' />
                      </div>
                    </footer>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </SwiperSlide>

          {/* Item */}
          <SwiperSlide className='bg-light py-4'>
            <Row className='align-items-center'>
              <Col xl={4} className='d-none d-xl-flex'>
                <ImageLoader
                  src='/images/tg/agents/03.jpg'
                  width={416}
                  height={400}
                  alt='Agent'
                  className='rounded-3'
                />
              </Col>
              <Col sm={4} md={5} xl={4} className='d-flex'>
                <ImageLoader
                  src='/images/tg/agents/01.jpg'
                  width={475}
                  height={457}
                  alt='Agent'
                  className='rounded-3'
                />
              </Col>
              <Col sm={8} md={7} xl={4} className='px-4 px-sm-3 px-md-0 ms-md-n4 mt-n5 mt-sm-0 py-3'>
                <Card className='border-0 shadow-sm ms-sm-n5'>
                  <Card.Body as='blockquote' className='blockquote'>
                    <h4 style={{ maxWidth: '22rem' }}>ImmoAsk, une plateforme immobilière complète</h4>
                    <p className='d-sm-none d-lg-block'>
                      Nous recevons des centaines de demandes immobilières chaque jour, et ImmoAsk nous a aidés à automatiser notre support client grâce à Realiti AI, offrant ainsi un service plus rapide et efficace.
                    </p>

                    <footer className='d-flex justify-content-between'>
                      <div className='pe3'>
                        <h6 className='mb-0'>Marc G.</h6>
                        <div className='text-muted fw-normal fs-sm mb-3'>Agent immobilier</div>
                        <SocialButton href='#' variant='solid' brand='facebook' roundedCircle className='mb-2 me-2' />
                        <SocialButton href='#' variant='solid' brand='twitter' roundedCircle className='mb-2 me-2' />
                        <SocialButton href='#' variant='solid' brand='linkedin' roundedCircle className='mb-2' />
                      </div>
                    </footer>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </SwiperSlide>
        </Swiper>

        {/* External Prev/Next buttons */}
        <div className='d-flex justify-content-center justify-content-md-start pb-2'>
          <Button id='prevAgents' variant='prev position-relative mx-2' />
          <Button id='nextAgents' variant='next position-relative mx-2' />
        </div>
      </Container>
    </RealEstatePageLayout>
  )
}

export default HomePage
