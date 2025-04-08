import { useState,useEffect } from 'react'
import RealEstatePageLayout from '../components/partials/RealEstatePageLayout'
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
import ImageLoader from '../components/ImageLoader'
import FormGroup from '../components/FormGroup'
import DropdownSelect from '../components/DropdownSelect'
import IconBox from '../components/IconBox'
import PropertyCard from '../components/PropertyCard'
import PropertyCardOverlay from '../components/PropertyCardOverlay'
import SocialButton from '../components/SocialButton'
import StarRating from '../components/StarRating'
import Nouislider from 'nouislider-react'
import { Navigation, Pagination, EffectFade } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import { useSession } from 'next-auth/react'
import axios from "axios";
import 'nouislider/distribute/nouislider.css'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/effect-fade'
import getPropertyFullUrl from '../utils/getPropertyFullURL'
import getFirstImageArray from '../utils/formatFirsImageArray'
import buildPropertyBadge from '../utils/buildPropertyBadge'
import { PropertyListSwiper } from '../components/iacomponents/PropertyListSwiper'
import topPropertiesLogement from '../remoteAPI/topPropertiesLogement.json'
import topPropertiesSejour from '../remoteAPI/topPropertiesSejour.json'
import topPropertiesAcquisition from '../remoteAPI/topPropertiesAcquisition.json'
import topPropertiesEntrepreneuriat from '../remoteAPI/topPropertiesEntrepreneuriat.json'
import propertyCategories from '../remoteAPI/propertyCategories.json'
import BgParallaxHeroMessage from '../components/iacomponents/BgParallaxHeroMessage'
import { getHumanReadablePrice } from '../utils/generalUtils'
import { API_URL } from '../utils/settings'
const IndexPage = () => {
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
    {name: '1', value: '1'},
    {name: '2', value: '2'},
    {name: '3', value: '3'},
    {name: '4', value: '4'},
    {name: '5+', value: '5+'}
  ]

  const { data: session } = useSession()

  const getRTProperties = () =>{

    axios.get(`${API_URL}?query={get5Properties(orderBy:{column:NUO,order:DESC},limit:5){surface,badge_propriete{badge{badge_name,badge_image}},id,nuitee,nuo,usage,offre{denomination},categorie_propriete{denomination},pays{code},piece,titre,garage,cout_mensuel,ville{denomination},wc_douche_interne,cout_vente,quartier{denomination},visuels{uri,position}}}`).
    then((res)=>{
      setRealTimeProperties(res.data.data.get5Properties.map((property) =>{
        //const { status, data:badges_property, error, isFetching,isLoading,isError }  = usePropertyBadges(property.id);
        return {
          href: getPropertyFullUrl(property.pays.code,property.offre.denomination,property.categorie_propriete.denomination,property.ville.denomination,property.quartier.denomination,property.nuo),
          images: [[getFirstImageArray(property.visuels), 467, 305, 'Image']],
          title: 'N°'+property.nuo+': '+property.categorie_propriete.denomination+' à '+property.offre.denomination+' | '+property.surface+'m²',
          category: property.usage,
          location: property.quartier.denomination+", "+property.ville.denomination,
          price: getHumanReadablePrice(property),
          badges: buildPropertyBadge(property.badge_propriete),
          footer: [property.piece, property.wc_douche_interne, property.garage],
        }
      }));
    });
  }
  useEffect(() => { 
    getRTProperties();
  },[]); 
    
  

  return (
    <RealEstatePageLayout
      pageTitle='Trouver aisément un logement urbain ou rural et acheter en sécurité les terrains et immeubles'
      activeNav='Home'
      userLoggedIn={session?true:false}
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
      <Container as='section' className='pt-5 my-5 pb-lg-4'>
        <Row className='pt-0 pt-md-2 pt-lg-0'>
          <Col md={{span: 7, order: 1}} lg={7} xl={7} className='pt-xl-5 pe-lg-0 mb-3 text-md-start text-center'>
            <h1 className='mt-lg-0 mb-md-4 mb-3 pt-md-4 pb-lg-2'>Trouver aisément un logement, et acheter en sécurité un immeuble</h1>
            <p className='display-relative lead me-lg-n5'>
              Trouver facilement en temps réel des logements urbains ou des baux commerciaux.<br/>
              Acquérir un immeuble bâti ou non, avec une sécurité foncière garantie.<br/>
              Investir dans des terrains et des appartements en cours de construction.<br/>
              Gérer. Investir. Louer. Vendre  <br/>
            </p>
            
              <Link href='/tg/add-property' passHref>
                {/* <Button size='sm' className='order-lg-3 ms-2'>
                  <i className='fi-plus me-2'></i>
                  Lancer <span className='d-none d-sm-inline'>un projet immobilier</span>
                </Button> */}
                <Button variant='outline-primary' size='lg'>
                  <i className='fi-plus me-2'></i>
                  Lancer <span className='d-none d-sm-inline'>un projet immobilier</span>
                </Button>
               
              </Link>
              {/* <span className='d-none d-lg-block position-absolute top-50 end-0 translate-middle-y border-end' style={{width: '1px', height: '30px'}}></span> */}
              
              <Link href='/tg/add-property' passHref>
                <Button className='outline-primary order-lg-3 ms-2' size='lg'>
                  <i className='fi-plus me-2'></i>
                  Enroller <span className='d-none d-sm-inline'>un immeuble</span>
                </Button>
               
              </Link>
            
          </Col>
          <Col md={{span: 5, order: 2}} lg={5} xl={5} className='mb-1 mb-lg-3'>
            <ImageLoader
              src='/images/tg/hero-image.jpg'
              width={600}
              height={500}
              alt='Hero image'
            />
          </Col>
        </Row>
        <Row className='mt-lg-1'>
          
          <Col lg={12} xl={2}></Col>
          <Col lg={12} xl={8} className='zindex-2 justify-content-center'>
            <FormGroup className='d-block'>
              <Row className='g-0 ms-sm-n2'>
                <Col md={8} className='d-sm-flex align-items-center'>
                  <DropdownSelect
                      defaultValue='Type du bien immobilier'
                      icon='fi-list'
                      options={[
                        [null, 'Maison'],
                        [null, 'Apartement'],
                        [null, 'Immeuble commercial'],
                        [null, 'Studio meublé'],
                        [null, 'Chambre salon'],
                        [null, 'Chambre(Pièce)'],
                        [null, 'Appartement meublé'],
                        [null, 'Villa meublée'],
                        [null, 'Terrain'],
                        [null, 'Boutique'],
                        [null, 'Bureau'],
                        [null, 'Espace-coworking'],
                        [null, 'Magasins'],
                      ]}
                      variant='link ps-2 ps-sm-3'
                      className='w-sm-50 border-end-md'
                  />
                  <hr className='d-sm-none my-2' />
                  <DropdownSelect
                    defaultValue='A louer'
                    icon='fi-home'
                    options={[
                      [null, 'A louer'],
                      [null, 'A vendre'],
                      [null, 'A colouer'],
                      [null, 'A hypothéquer'],
                      [null, 'A investir'],
                    ]}
                    variant='link ps-2 ps-sm-3'
                    className='w-sm-50 border-end-sm'
                  />
                  <hr className='d-sm-none my-2' />
                  <DropdownSelect
                    defaultValue='Emplacement'
                    icon='fi-map-pin'
                    options={[
                      [null, 'Lome'],
                      [null, 'Aneho'],
                      [null, 'Kpalime'],
                      [null, 'Tsevie']
                    ]}
                    variant='link ps-2 ps-sm-3'
                    className='w-sm-50 border-end-sm'
                  />
                </Col>
                <hr className='d-md-none mt-2' />
                <Col md={4} className='d-sm-flex align-items-center pt-4 pt-md-0'>
                  <div className='d-flex align-items-center w-100 pt-2 pb-4 py-sm-0 ps-2 ps-sm-3'>
                    <i className='fi-cash fs-lg text-muted me-2'></i>
                    <span className='text-muted'>Budget</span>
                    <div className='range-slider pe-0 pe-sm-3'>
                      <Nouislider
                        range={{min: 20000, max: 1500000000}}
                        start={1000}
                        format={{
                          to: value => 'XOF' + parseInt(value, 10),
                          from: value => Number(value)
                        }}
                        connect={`lower`}
                        tooltips
                        className='range-slider-ui'
                      />
                    </div>
                  </div>
                  <Button variant='primary btn-icon px-3 w-100 w-sm-auto flex-shrink-0'>
                    <i className='fi-search'></i>
                    <span className='d-sm-none d-inline-block ms-2'>Trouver</span>
                  </Button>
                </Col>
              </Row>
            </FormGroup>
          </Col>
          <Col lg={12} xl={2}></Col>
        </Row>
      </Container>


      {/* Categories */}
      <Container as='section' className='mb-2'>
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
      </Container>


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
                <ImageLoader src='/images/tg/illustrations/buy.svg' width={256} height={201} alt='Image' />
              </div>
              <Card.Body>
                <h2 className='h4 card-title'>Acheter un immeuble</h2>
                <p className='card-text fs-sm'>Un terrain rural ou urbain à acheter? Une maison ou villa à acquérir? Trouver
                des villas, des appartements F3, F4, F5 avec jardin ou piscine biens construits et modernes en vente. Explorer notre 
                catalogue de biens immobiliers en vente librement</p>
              </Card.Body>
              <Card.Footer className='pt-0 border-0'>
                <Link href='/tg/catalog?category=sale' passHref>
                  <Button variant='outline-primary stretched-link'>Acheter un immeuble</Button>
                </Link>
              </Card.Footer>
            </Card>
          </SwiperSlide>
          <SwiperSlide>
            <Card className='card-hover border-0 h-100 pb-2 pb-sm-3 px-sm-3 text-center mx-2'>
              <div className='d-flex justify-content-center my-3'>
                <ImageLoader src='/images/tg/illustrations/sell.svg' width={256} height={201} alt='Image' />
              </div>
              <Card.Body>
                <h2 className='h4 card-title'>Enroller un immeuble</h2>
                <p className='card-text fs-sm'>Une maison délabrée, un terrain urbain ou rural, 
                un appartement moderne ou une villa F1,F2, ou une maison de n chambres salon. Ou les chambres salon, les appartement à mettre en location ?
                Créer votre mise en vente ou location immobilière.</p>
              </Card.Body>
              <Card.Footer className='pt-0 border-0'>
                <Link href='/tg/add-property' passHref>
                  <Button variant='outline-primary stretched-link'>Enroller un immeuble</Button>
                </Link>
              </Card.Footer>
            </Card>
          </SwiperSlide>
          <SwiperSlide>
            <Card className='card-hover border-0 h-100 pb-2 pb-sm-3 px-sm-3 text-center mx-2'>
              <div className='d-flex justify-content-center my-3'>
                <ImageLoader src='/images/tg/illustrations/rent.svg' width={256} height={201} alt='Image' />
              </div>
              <Card.Body>
                <h2 className='h4 card-title'>Lancer un projet immobilier</h2>
                <p className='card-text fs-sm'>Suivre l'exécution d'un chantier immobilier... Un projet de logement ou d'achat immobilier, Souhaitez vous
                un séjour meublé? Vous recherchez une villa ou appartement spécifique pour habitation? Lancer votre projet immobilier!</p>
              </Card.Body>
              <Card.Footer className='pt-0 border-0'>
                <Link href='/tg/catalog?category=rent' passHref>
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
                <ImageLoader src='/images/tg/illustrations/buy.svg' width={256} height={201} alt='Image' />
              </div>
              <Card.Body>
                <h2 className='h4 card-title'>Créer de l'experience</h2>
                <p className='card-text fs-sm'>Sejours, excursion ou voyages ou lunes de miel cette semaine ou ce weekend? Commencer votre experience
                dans nos appartements et villas meublés sélectionnés avec soin : moins chers et plus confortables. </p>
              </Card.Body>
              <Card.Footer className='pt-0 border-0'>
                <Link href='/tg/catalog?category=sale' passHref>
                  <Button variant='outline-primary stretched-link'>Explorer nos immeubles meublés</Button>
                </Link>
              </Card.Footer>
            </Card>
          </SwiperSlide>
          <SwiperSlide>
            <Card className='card-hover border-0 h-100 pb-2 pb-sm-3 px-sm-3 text-center mx-2'>
              <div className='d-flex justify-content-center my-3'>
                <ImageLoader src='/images/tg/illustrations/sell.svg' width={256} height={201} alt='Image' />
              </div>
              <Card.Body>
                <h2 className='h4 card-title'>Lancer une entreprise</h2>
                <p className='card-text fs-sm'>Les entreprises se lancent ici. Vos bureaux, magasins et entrepots, et Boutiques
                en location. Voulez-vous bailler plutot pour une longue durée? Découvrir les endroits à forte valeur commerciale et choisir le bon emplacement de votre entreprise.</p>
              </Card.Body>
              <Card.Footer className='pt-0 border-0'>
                <Link href='/tg/add-property' passHref>
                  <Button variant='outline-primary stretched-link'>Explorer nos immeubles d'entreprise</Button>
                </Link>
              </Card.Footer>
            </Card>
          </SwiperSlide>
          <SwiperSlide>
            <Card className='card-hover border-0 h-100 pb-2 pb-sm-3 px-sm-3 text-center mx-2'>
              <div className='d-flex justify-content-center my-3'>
                <ImageLoader src='/images/tg/illustrations/rent.svg' width={256} height={201} alt='Image' />
              </div>
              <Card.Body>
                <h2 className='h4 card-title'>Trouver un logement</h2>
                <p className='card-text fs-sm'>Logement ancien ou moderne ? 
                Chambres salon, Villas, Appartements ou une chambre en location vous attendent.. 
                Changez d'air. Commencer votre déménagement avec nous et découvrir d'autres quartiers ou villes</p>
              </Card.Body>
              <Card.Footer className='pt-0 border-0'>
                <Link href='/tg/catalog?category=rent' passHref>
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
          <Link href='/tg/catalog?category=rent' passHref>
            <Button variant='link fw-normal ms-sm-3 p-0'>
              Consulter tout
              <i className='fi-arrow-long-right ms-2'></i>
            </Button>
          </Link>
        </div>
        <div className='d-flex align-items-center justify-content-between'>
          <h3 className='h5'>Villas | Chambres salon | Appartements | Chambres </h3>
        </div>
        <PropertyListSwiper propertyList={topPropertiesLogement}/>
        {/* External Prev/Next buttons */}
        <div className='d-flex justify-content-center py-md-2 mt-4'>
          <Button id='prevProprties' variant='prev position-relative mx-2' />
          <Button id='nextProprties' variant='next position-relative mx-2' />
        </div>
      </Container>

      {/* Appel aux produits LOGEMENTS*/}
      <Container as='section' className='mb-5 mt-n3 mt-lg-0'>
      <BgParallaxHeroMessage image={'/images/tg/hero-image-v2.jpg'} message={`
        Il est conseillé de changer d'air et de logements annuellement`} action={handleModalShow} callAction={"Explorer les logements maintenant"}/>
      </Container>
      {/* Appel au produit Expertim */}
      <Container as='section' className='mb-5 pb-2 pb-lg-4'>
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
      </Container>
      
      {/* Top properties ACQuisition */}
      <Container fluid className='px-xxl-4 pb-lg-4 pb-1 mb-3 mt-3'>
        <div className='d-flex align-items-center justify-content-between mb-3'>
          <h2 className='h3 mb-0'>Des terrains urbains et moins ruraux à vendre à votre portée</h2>
          <Link href='/tg/catalog?category=rent' passHref>
            <Button variant='link fw-normal ms-sm-3 p-0'>
              Consulter tout
              <i className='fi-arrow-long-right ms-2'></i>
            </Button>
          </Link>
        </div>
        <div className='d-flex align-items-center justify-content-between'>
          <h3 className='h5'>Terrains | Villas | Appartements | Maisons | Immeubles</h3>
        </div>
        
        <PropertyListSwiper propertyList={topPropertiesAcquisition}/>
        
        {/* External Prev/Next buttons */}
        {/* <div className='d-flex justify-content-center py-md-2 mt-4'>
          <Button id='prevProprties' variant='prev position-relative mx-2' />
          <Button id='nextProprties' variant='next position-relative mx-2' />
        </div> */}
      </Container>
      <Container as='section' className='mb-5 mt-n3 mt-lg-0'>
      <BgParallaxHeroMessage image={'/images/tg/hero-image-v2.jpg'} message={`
        C'est le meilleur moment pour commencer un projet d'achat immobiliers.`} action={handleModalShow} callAction={"Consulter les immeubles en vente"}/>
        
      </Container>
      {/* Appel au produit ImmoMag */}
      <Container as='section' className='mb-5 pb-2 pb-lg-4'>
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
      </Container>
      {/* Investissements immobiliers */}
      <Container as='section' className='pb-4 mb-5'>
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

        {/* Grid of properties */}
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
      </Container>
      <Container as='section' className='mb-5 mt-n3 mt-lg-0'>
        
        <BgParallaxHeroMessage image={'/images/tg/hero-image-v2.jpg'} message={`
        Nous vous offrons plus que ce que les structures bancaires offrent.
              Gagner aumoins 20% sur votre investissement immobilier.`} action={handleModalShow} callAction={"Placer votre investissement immobilier"}/>
      </Container>
      {/* Appel au produit Timmo */}
      <Container as='section' className='mb-5 pb-2 pb-lg-4'>
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
      </Container>
      
      {/* Top properties Experience et Sejours*/}
      <Container fluid className='px-xxl-4 pb-lg-4 pb-1 mb-3 mt-3'>
        <div className='d-flex align-items-center justify-content-between mb-3'>
          <h2 className='h3 mb-0'>Une experience uniques et inoubliable! Un séjour confortable et moins cher.</h2>
          <Link href='/tg/catalog?category=rent' passHref>
            <Button variant='link fw-normal ms-sm-3 p-0'>
              Consulter tout
              <i className='fi-arrow-long-right ms-2'></i>
            </Button>
          </Link>
        </div>
        <div className='d-flex align-items-center justify-content-between'>
          <h3 className='h5'>Séjour meublé | Appartement meublé | Biens immobiliers meublés | Studio meublé </h3>
        </div>
        <PropertyListSwiper propertyList={topPropertiesSejour}/>
      </Container>
      <Container as='section' className='mb-5 mt-n3 mt-lg-0'>
        <BgParallaxHeroMessage image={'/images/tg/hero-image-v2.jpg'} message={`Détente. Excursions. Voyages d'affaires moins chers. De nouvels horizons dans nos meublés.`} action={handleModalShow} callAction={"Faire une expérience meublée"}/>
      </Container>
      {/* Appel au produit ImmoAsk Business */}
      <Container as='section' className='mb-5 pb-2 pb-lg-4'>
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
      </Container>
      
      {/* Biens Entreprise */}
      <Container fluid className='px-xxl-4 pb-lg-4 pb-1 mb-3 mt-3'>
        <div className='d-flex align-items-center justify-content-between mb-3'>
          <h2 className='h3 mb-0'>Commencer l'entrepreunariat ou accelerer avec nous</h2>
          <Link href='/tg/catalog?category=rent' passHref>
            <Button variant='link fw-normal ms-sm-3 p-0'>
              Consulter tout
              <i className='fi-arrow-long-right ms-2'></i>
            </Button>
          </Link>
        </div>
        <div className='d-flex align-items-center justify-content-between'>
          <h3 className='h5'>Bureaux | Magasins | Terrains à bailler | Espaces co-working</h3>
        </div>
        <PropertyListSwiper propertyList={topPropertiesEntrepreneuriat}/>

        {/* External Prev/Next buttons */}
        {/* <div className='d-flex justify-content-center py-md-2 mt-4'>
          <Button id='prevProprties' variant='prev position-relative mx-2' />
          <Button id='nextProprties' variant='next position-relative mx-2' />
        </div> */}
      </Container>
      <Container as='section' className='mb-5 mt-n3 mt-lg-0'>
        <BgParallaxHeroMessage image={'/images/tg/hero-image-v2.jpg'} message={`Les bons emplacements pour vos entrepots et bureaus sont ici`} action={handleModalShow} 
        callAction={"Explorer les biens immobiliers d'entreprise"}/>
      </Container>
      {/* Appel au produit LesVoisins */}
      <Container as='section' className='mb-5 pb-2 pb-lg-4'>
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
      </Container>

       {/* Top property offers (carousel) */}
       <Container as='section' className='mb-5 pb-md-4'>
        <div className='d-flex align-items-center justify-content-between mb-3'>
          <h2 className='h3 mb-0'>FlashImmo, des biens immobiliers en temps réel!</h2>
          <Link href='/tg/catalog?category=rent' passHref>
            <Button variant='link fw-normal ms-sm-3 p-0'>
              Consulter tout
              <i className='fi-arrow-long-right ms-2'></i>
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
        <h2 className='h3 mb-0 pb-2 text-center text-md-start'>Témoignages des propriétaires, agents immobiliers et locataires</h2>
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
                    <h4 style={{maxWidth: '22rem'}}>&quot;I will select the best accommodation for you&quot;</h4>
                    <p className='d-sm-none d-lg-block'>Amet libero morbi venenatis ut est. Iaculis leo ultricies nunc id ante adipiscing. Vel metus odio at faucibus ac. Neque id placerat et id ut. Scelerisque eu mi ullamcorper sit urna. Est volutpat dignissim elementum nec.</p>
                    <footer className='d-flex justify-content-between'>
                      <div className='pe3'>
                        <h6 className='mb-0'>Floyd Miles</h6>
                        <div className='text-muted fw-normal fs-sm mb-3'>Imperial Property Group Agent</div>
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
                    <h4 style={{maxWidth: '22rem'}}>&quot;I don&apos;t say no, I just figure out a way to make it work&quot;</h4>
                    <p className='d-sm-none d-lg-block'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.</p>
                    <footer className='d-flex justify-content-between'>
                      <div className='pe3'>
                        <h6 className='mb-0'>Guy Hawkins</h6>
                        <div className='text-muted fw-normal fs-sm mb-3'>Imperial Property Group Agent</div>
                        <SocialButton href='#' variant='solid' brand='facebook' roundedCircle className='mb-2 me-2' />
                        <SocialButton href='#' variant='solid' brand='twitter' roundedCircle className='mb-2 me-2' />
                        <SocialButton href='#' variant='solid' brand='linkedin' roundedCircle className='mb-2' />
                      </div>
                      <div>
                        <StarRating rating='4.7' />
                        <div className='text-muted fs-sm mt-1'>16 reviews</div>
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
                    <h4 style={{maxWidth: '22rem'}}>&quot;Over 10 years of experience as a real estate agent&quot;</h4>
                    <p className='d-sm-none d-lg-block'>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae.</p>
                    <footer className='d-flex justify-content-between'>
                      <div className='pe3'>
                        <h6 className='mb-0'>Kristin Watson</h6>
                        <div className='text-muted fw-normal fs-sm mb-3'>Imperial Property Group Agent</div>
                        <SocialButton href='#' variant='solid' brand='facebook' roundedCircle className='mb-2 me-2' />
                        <SocialButton href='#' variant='solid' brand='twitter' roundedCircle className='mb-2 me-2' />
                        <SocialButton href='#' variant='solid' brand='linkedin' roundedCircle className='mb-2' />
                      </div>
                      <div>
                        <StarRating rating='4.8' />
                        <div className='text-muted fs-sm mt-1'>24 reviews</div>
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

export default IndexPage
