import { useState } from 'react'
import RealEstatePageLayout from '../../../../../../components/partials/RealEstatePageLayout'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Breadcrumb from 'react-bootstrap/Breadcrumb'
import Button from 'react-bootstrap/Button'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import Dropdown from 'react-bootstrap/Dropdown'
import Badge from 'react-bootstrap/Badge'
import Card from 'react-bootstrap/Card'
import ImageLoader from '../../../../../../components/ImageLoader'
import PropertyCard from '../../../../../../components/PropertyCard'
import { Navigation, Pagination } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import axios from 'axios'
import { useEffect } from 'react'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import getPropertyFullUrl from '../../../../../../utils/getPropertyFullURL'
import getFirstImageArray from '../../../../../../utils/formatFirsImageArray'
import buildPropertyBadge from '../../../../../../utils/buildPropertyBadge'
import { useSession } from 'next-auth/react'
import ProRealEstateAgency from '../../../../../../components/iacomponents/ProRealEstateAgency'
import FurnishedEquipmentList from '../../../../../../components/iacomponents/FurnishedEquipmentList'
import NearestInfrastructureList from '../../../../../../components/iacomponents/NearestInfrastructureList'
import RecommendPropertyList from '../../../../../../components/iacomponents/RecommendPropertyList'

import PayVisitModal from '../../../../../../components/iacomponents/PayVisitModal'
import CheckAvailabilityModal from '../../../../../../components/iacomponents/CheckAvailabilityModal'
import RentNegociationModal from '../../../../../../components/iacomponents/RentNegociationModal'
import AskNuiteePriceModal from '../../../../../../components/iacomponents/AskNuiteePriceModal'
import { API_URL } from '../../../../../../utils/settings'

function SinglePropertyAltPage({ property }) {

  // Sign in modal
  const [signinShow, setSigninShow] = useState(false)

  const handleSigninClose = () => setSigninShow(false)
  const handleSigninShow = () => setSigninShow(true)

  // Sign up modal
  const [signupShow, setSignupShow] = useState(false)

  const handleSignupClose = () => setSignupShow(false)
  const handleSignupShow = () => setSignupShow(true)

  const [rentNegociationShow, setRentNegociationShow] = useState(false)
  const handleRentNegociationClose = () => setRentNegociationShow(false)
  const handleRentNegociationShow = () => setRentNegociationShow(true)


  const [askNuiteePriceShow, setAskNuiteePriceShow] = useState(false)
  const handleAskNuiteePriceClose = () => setAskNuiteePriceShow(false)
  const handleAskNuiteePriceShow = () => setAskNuiteePriceShow(true)
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

  const handleRentNegociationModal = (e) => {
    e.preventDefault()
    if (session) {
      handleRentNegociationShow();
    } else {
      handleSignInToUp(e);
    }
  }

  const handleNuiteePriceModal = (e) => {
    e.preventDefault()
    handleAskNuiteePriceShow()
  }

  const { data: session } = useSession();
  const router = useRouter()
  const { nuo, bien, quartier, ville } = router.query;

  const myQuartier = quartier.charAt(0).toUpperCase() + quartier.slice(1);
  const myVille = ville.charAt(0).toUpperCase() + ville.slice(1);
  const myBien = bien.charAt(0).toUpperCase() + bien.slice(1);
  // Message modal state
  const [messageModalShow, setMessageModalShow] = useState(false)
  const handleMessageModalClose = () => setMessageModalShow(false)
  const handleMessageModalShow = () => setMessageModalShow(true)
  const [messageValidated, setMessageValidated] = useState(false)
  const handleMessageSubmit = (event) => {
    const form = event.currentTarget
    if (form.checkValidity() === false) {
      event.preventDefault()
      event.stopPropagation()
    }
    setMessageValidated(true);
  }

  const [thumbnails, setThumbnails] = useState([]);
  const [Unconnectedhumbnails, setUnconnectedhumbnails] = useState([]);
  const [recommendProperties, setRecommendProperties] = useState([]);
  const defineThumbNails = () => {
    property && property.visuels.map((imgproperty) => {
      setThumbnails(thumbnails => [...thumbnails, 'https://immoaskbetaapi.omnisoft.africa/public/storage/uploads/visuels/proprietes/' + imgproperty.uri]);
    })
  }

  const defineUnauthenticatedThumbNails = () => {
    setUnconnectedhumbnails([property && property.visuels[0].uri]);
    setUnconnectedhumbnails(Unconnectedhumbnails => [...Unconnectedhumbnails, 'create-account-more-images.png'])
  }

  useEffect(() => {
    defineThumbNails();
    defineUnauthenticatedThumbNails();
  }, []);
  const getRecommendProperties = () => {
    axios.get(`${API_URL}?query={getRecommendProperties(first:5,offre_id:"1",nuo:${property.nuo},quartier_id:"${property.quartier.id}",categorie_id:"${property.categorie_propriete.id}"){data{surface,badge_propriete{badge{badge_name,badge_image}},id,nuo,usage,offre{denomination},categorie_propriete{denomination},pays{code},piece,titre,garage,cout_mensuel,ville{denomination},wc_douche_interne,cout_vente,quartier{denomination},visuels{uri}}}}`).
      then((res) => {
        setRecommendProperties(res.data.data.getRecommendProperties.data.map((propertyr) => {
          //const { status, data:badges_property, error, isFetching,isLoading,isError }  = usePropertyBadges(property.id);
          return {
            href: getPropertyFullUrl(propertyr.pays.code, propertyr.offre.denomination, propertyr.categorie_propriete.denomination, propertyr.ville.denomination, propertyr.quartier.denomination, propertyr.nuo),
            images: getFirstImageArray(propertyr.visuels),
            title: 'N°' + propertyr.nuo + ': ' + propertyr.categorie_propriete.denomination + ' à ' + propertyr.offre.denomination + ' | ' + propertyr.surface + 'm²',
            category: propertyr.usage,
            location: propertyr.quartier.denomination + ", " + propertyr.ville.denomination,
            price: propertyr.cout_mensuel == 0 ? propertyr.cout_vente : propertyr.cout_mensuel + " XOF",
            badges: buildPropertyBadge(propertyr.badge_propriete),
            footer: [propertyr.piece, propertyr.wc_douche_interne, propertyr.garage],
          }
        }));
      });
  }


  useEffect(() => {
    getRecommendProperties();
  }, []);
  // Gallery component (Swiper slider with custom thumbnails and slides count)  
  const SwiperGallery = () => {

    const [currentSlide, setCurrentSlide] = useState();
    const [totalSlides, setTotalSlides] = useState();
    const thumbnailSize = property.visuels.length;
    const unconnectedThumbnailSize = Unconnectedhumbnails.length;
    const SlidesCount = () => (
      <div className='swiper-slides-count text-light'>
        <i className='fi-image fs-lg me-2'></i>
        <div className='fs-5 fw-bold ps-1'>
          <span>{currentSlide}</span>
          <span>/</span>
          <span>{totalSlides}</span>
        </div>
      </div>
    )

    return (
      <>
        <Swiper
          modules={[Navigation, Pagination]}
          onSlideChange={(swiper) => {
            setCurrentSlide(swiper.realIndex + 1)
          }}
          onInit={(swiper) => {
            setCurrentSlide(swiper.realIndex + 1)
            setTotalSlides(swiper.slides.length - 2)
          }}
          pagination={{
            el: '.swiper-thumbnails',
            clickable: true,
            renderBullet: (index, className) => {
              //console.log("Index: " + index)
              session ? thumbnailSize = thumbnailSize : thumbnailSize = unconnectedThumbnailSize;
              if (index === thumbnailSize) {
                return `<li class='swiper-thumbnail ${className}'>
                  <div class='d-flex flex-column align-items-center justify-content-center h-100'>
                    <i class='fi-play-circle fs-4 mb-1'></i>
                    <span>Lancer la vidéo</span>
                  </div>
                </li>`
              } else {
                return `<li class='swiper-thumbnail ${className}'>
                  <img src=${session ? thumbnails[index] : 'https://immoaskbetaapi.omnisoft.africa/public/storage/uploads/visuels/proprietes/' + Unconnectedhumbnails[index]} alt='Thumbnail'/>
                </li>`
              }
            }
          }}
          navigation
          spaceBetween={12}
          loop
          grabCursor
          className='swiper-nav-onhover rounded-3'
        >
          {
            session && property && property.visuels.map((imgproperty) => {

              return (
                <SwiperSlide className='d-flex'>
                  <ImageLoader className='rounded-3' src={'https://immoaskbetaapi.omnisoft.africa/public/storage/uploads/visuels/proprietes/' + imgproperty.uri} width={967} height={545} alt='Image' />
                </SwiperSlide>
              )
            })
          }
          {!session &&
            (
              <>
                <SwiperSlide className='d-flex'>
                  <ImageLoader className='rounded-3' src={'https://immoaskbetaapi.omnisoft.africa/public/storage/uploads/visuels/proprietes/' + Unconnectedhumbnails[0]} width={967} height={545} alt='Image' />
                </SwiperSlide>
                <SwiperSlide className='d-flex'>
                  <ImageLoader className='rounded-3' src={'https://immoaskbetaapi.omnisoft.africa/public/storage/uploads/visuels/proprietes/' + Unconnectedhumbnails[1]} width={967} height={545} alt='Image' />
                </SwiperSlide>

              </>
            )
          }
          <SwiperSlide>
            <div className='ratio ratio-16x9'>
              <iframe src='https://www.youtube.com/embed/1oVncb5hke0?autoplay=1' className='rounded-3' allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
            </div>
          </SwiperSlide>

          <SlidesCount />
        </Swiper>
        <ul className='swiper-thumbnails'></ul>
      </>
    )
  }



  { !property && <h4 className='mt-5 mb-lg-5 mb-4 pt-5 pb-lg-5'>Ce bien immobilier n'existe pas encore</h4> }
  //{isError && <h4 className='mt-5 mb-lg-5 mb-4 pt-5 pb-lg-5'>Une erreur: {error.message}</h4>}

  return (
    <RealEstatePageLayout
      pageTitle={`${property.categorie_propriete.denomination} à louer, ${property.ville.denomination}, ${property.quartier.denomination} | No. ${nuo} | Togo`}
      userLoggedIn={session ? true : false}
    >


      {/* Sign in modal */}
      {signinShow && <PayVisitModal
        centered
        size='lg'
        show={signinShow}
        onHide={handleSigninClose}
        onSwap={handleSignInToUp}
        property={property}
      />}

      {/* Sign up modal */}
      {signupShow && <CheckAvailabilityModal
        centered
        size='lg'
        show={signupShow}
        onHide={handleSignupClose}
        onSwap={handleSignUpToIn}
        property={property}
      />}

      {/* Sign up modal */}
      {rentNegociationShow && <RentNegociationModal
        centered
        size='lg'
        show={rentNegociationShow}
        onHide={handleRentNegociationClose}
        property={property}
      />}


      {askNuiteePriceShow && <AskNuiteePriceModal
        centered
        size='lg'
        show={askNuiteePriceShow}
        onHide={handleAskNuiteePriceClose}
        property={property}
      />}
      {/* Post content */}
      {property && (
        <Container as='section'>
          <Container as='section' className='mt-5 mb-lg-5 mb-4 pt-5 pb-lg-5'>
            {/* Breadcrumb */}
            <Breadcrumb className='mb-3 pt-md-3'>
              <Link href='/tg/catalog' passHref>
                <Breadcrumb.Item>Catalogue immobilier</Breadcrumb.Item>
              </Link>
              <Link href='/tg/investissements-immobiliers' passHref>
                <Breadcrumb.Item>{"Investissements immobiliers"}</Breadcrumb.Item>
              </Link>
              <Link href={`/tg/investissements-immobiliers/${bien}`} passHref>
                <Breadcrumb.Item>{property.categorie_propriete.denomination}</Breadcrumb.Item>
              </Link>
              <Link href={`/tg/investissements-immobiliers/${bien}/${ville}`} passHref>
                <Breadcrumb.Item>{property.ville.denomination}</Breadcrumb.Item>
              </Link>
              <Link href={`/tg/investissements-immobiliers/${bien}/${ville}/${quartier}`} passHref>
                <Breadcrumb.Item>{property.quartier.denomination}</Breadcrumb.Item>
              </Link>
              <Breadcrumb.Item active>{nuo}</Breadcrumb.Item>
            </Breadcrumb>
            <Row>
              <Col lg={7} className='pt-lg-2 mb-5 mb-lg-0'>
                <div className='d-flex flex-column'>

                  {/* Gallery */}
                  <div className='order-lg-1 order-2'>
                    <SwiperGallery />
                  </div>

                  {/* Page title + Amenities */}
                  <div className='order-lg-2 order-1 pt-lg-2'>
                    <h1 className='h2 mb-2'> No. {property.nuo} | {property.categorie_propriete.denomination} à louer, {property.ville.denomination}, {property.quartier.denomination} {" "}{property && property.titre == 'undefined' ? '' : property.titre}</h1>
                    <p className='mb-2 pb-1 fs-lg'>{property && property.adresse.libelle}</p>
                    <ul className='d-flex mb-4 pb-lg-2 list-unstyled'>
                      <li className='me-3 pe-3 border-end'>
                        <b className='me-1'>{property && property.piece}+{property && property.salon}</b>
                        <i className='fi-bed mt-n1 lead align-middle text-muted'></i>
                      </li>
                      <li className='me-3 pe-3 border-end'>
                        <b className='me-1'>{property && property.piece}</b>
                        <i className='fi-bath mt-n1 lead align-middle text-muted'></i>
                      </li>
                      <li className='me-3 pe-3 border-end'>
                        <b className='me-1'>{property && property.garage}</b>
                        <i className='fi-car mt-n1 lead align-middle text-muted'></i>
                      </li>
                      <li>
                        <b>{property && property.surface} </b>
                        m²
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Overview */}
                <h2 className='h5'>Descriptif immobilier</h2>
                <p className='mb-4 pb-2'>

                  {property && property.descriptif}

                </p>

                <ProRealEstateAgency user={property.user.id} />
              </Col>


              {/* Sidebar with details */}
              <Col as='aside' lg={5}>
                <div className='ps-lg-5'>
                  <div className='d-flex align-items-center justify-content-between mb-3'>
                    <div>
                      <Badge bg='success' className='me-2 mb-2'>Vérifié</Badge>
                      <Badge bg='info' className='me-2 mb-2'>Nouvel</Badge>
                    </div>

                    {/* Wishlist + Sharing */}
                    <div className='text-nowrap'>
                      <OverlayTrigger
                        placement='top'
                        overlay={<Tooltip>Ajouter aux biens à visiter</Tooltip>}
                      >
                        <Button size='xs' variant='icon btn-light-primary shadow-sm rounded-circle ms-2 mb-2'>
                          <i className='fi-heart'></i>
                        </Button>
                      </OverlayTrigger>
                      <Dropdown className='d-inline-block'>
                        <OverlayTrigger
                          placement='top'
                          overlay={<Tooltip>Share</Tooltip>}
                        >
                          <Dropdown.Toggle variant='icon btn-light-primary btn-xs shadow-sm rounded-circle ms-2 mb-2'>
                            <i className='fi-share'></i>
                          </Dropdown.Toggle>
                        </OverlayTrigger>
                        <Dropdown.Menu align='end' className='my-1'>
                          <Dropdown.Item as="button">
                            <Link
                              href={`https://www.facebook.com/sharer/sharer.php?u=${typeof window !== 'undefined' ? window.location.href : ''}`}
                              passHref
                            >
                              <a target="_blank" rel="noopener noreferrer">
                                <i className="fi-facebook fs-base opacity-75 me-2"></i>
                                Facebook
                              </a>
                            </Link>
                          </Dropdown.Item>

                          <Dropdown.Item as="button">
                            <Link
                              href={`https://api.whatsapp.com/send?text=${typeof window !== 'undefined' ? window.location.href : ''}`}
                              passHref
                            >
                              <a target="_blank" rel="noopener noreferrer">
                                <i className="fi-whatsapp fs-base opacity-75 me-2"></i>
                                WhatsApp
                              </a>
                            </Link>
                          </Dropdown.Item>

                          <Dropdown.Item as="button">
                            <Link
                              href={`https://twitter.com/intent/tweet?url=${typeof window !== 'undefined' ? window.location.href : ''}`}
                              passHref
                            >
                              <a target="_blank" rel="noopener noreferrer">
                                <i className="fi-x fs-base opacity-75 me-2"></i>
                                Twitter
                              </a>
                            </Link>
                          </Dropdown.Item>

                          <Dropdown.Item as="button">
                            <Link
                              href={`https://www.linkedin.com/shareArticle?mini=true&url=${typeof window !== 'undefined' ? window.location.href : ''}`}
                              passHref
                            >
                              <a target="_blank" rel="noopener noreferrer">
                                <i className="fi-linkedin fs-base opacity-75 me-2"></i>
                                LinkedIn
                              </a>
                            </Link>
                          </Dropdown.Item>

                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                  </div>

                  {/* Price */}

                  <ul className='d-flex mb-4 list-unstyled fs-sm'>
                    <li className='me-3 pe-3 border-end'>
                      {!property ? <span className="sr-only">En chargement...</span>
                        : <>
                          {property.cout_mensuel > 0 &&
                            <>
                              <h3 className='h5 mb-2'>Loyer mensuel</h3>
                              <h2 className='h3 mb-4 pb-2'>
                                {property && property.cout_mensuel} <sup>XOF/mois</sup>

                              </h2>
                              <Button size='md' className='w-100' variant='outline-primary' onClick={handleRentNegociationModal}>Negocier le loyer</Button>
                            </>
                          }
                        </>
                      }
                    </li>
                    <li className='me-3 pe-3'>
                      {!property ? <span className="sr-only">En chargement...</span>
                        : <>
                          {property.part_min_investissement > 0 &&
                            <>
                              <h3 className='h5 mb-2'>Part minimal d'investi</h3>
                              <h2 className='h6 mb-4 pb-2'>
                                {property && property.part_min_investissement}<sup>XOF</sup>
                                <span className='d-inline-block ms-1 fs-base fw-normal text-body'>/pierre</span>
                              </h2>
                              <Button size='md' className='w-100' variant='outline-primary' onClick={handleRentNegociationModal}>Réserver maintenant</Button>
                            </>
                          }
                        </>
                      }
                    </li>

                  </ul>



                  {/* Property details card */}
                  <Card className='border-0 bg-secondary mb-4'>
                    <Card.Body>
                      <h5 className='mb-0 pb-3'>Détails clés du bien immobilier</h5>
                      <ul className='list-unstyled mt-n2 mb-0'>
                        <li className='mt-2 mb-0'><b>Type: </b>{property && property.categorie_propriete.denomination}</li>
                        <li className='mt-2 mb-0'><b>Surface: </b>{property && property.surface} m²</li>
                        <li className='mt-2 mb-0'><b>Salon: </b>{property && property.salon}</li>
                        <li className='mt-2 mb-0'><b>Chambres+salon: </b>{property && property.piece}+{property && property.salon}</li>
                        <li className='mt-2 mb-0'><b>Douches: </b>{property && property.wc_douche_interne}</li>
                        {/* <li className='mt-2 mb-0'><b>Parking places: </b>2</li>
                        <li className='mt-2 mb-0'><b>Pets allowed: </b>cats only</li> */}
                      </ul>
                    </Card.Body>
                  </Card>
                  <div className='justify-content-between mb-2'>
                    <Button size='lg' className='w-100' variant='outline-primary' onClick={handleSigninShow}>Planifier une visite avec l'agent immobilier</Button>
                  </div>
                  <div className='justify-content-between mb-2'>
                    <Button size='lg' className='w-100 outline-primary' onClick={handleSignupShow}>Vérifier la disponibilité</Button>
                  </div>
                  <Link href='#'>
                    <a className='d-inline-block mb-4 pb-2 text-decoration-none'>
                      <i className='fi-help me-2 mt-n1 align-middle'></i>
                      FAQ
                    </a>
                  </Link>
                  {property.est_meuble > 0 &&
                    <>
                      <Card className='border-0 bg-secondary mb-4'>
                        <Card.Body>
                          <h5>Interieur & Extérieur</h5>
                          <Row as='ul' xs={1} md={2} className='list-unstyled gy-2 mb-0 text-nowrap'>
                            <FurnishedEquipmentList furnishedEquipments={property.meubles} />
                          </Row>
                        </Card.Body>
                      </Card>
                    </>
                  }
                  {/* Amenities card */}


                  {/*Infrastructures card */}

                  {property.infrastructures.length > 0 &&
                    <>
                      <Card className='border-0 bg-secondary mb-4'>
                        <Card.Body>
                          <h5>Infrastructures proches</h5>
                          <Row as='ul' xs={1} md={2} className='list-unstyled gy-2 mb-0 text-nowrap'>
                            <NearestInfrastructureList nearestinfrastructures={property.infrastructures} />
                          </Row>
                        </Card.Body>
                      </Card>
                    </>
                  }

                  {/* Post meta */}
                  {/* <ul className='d-flex mb-4 list-unstyled fs-sm'>
                    <li className='me-3 pe-3 border-end'>Published: <b>Dec 9, 2021</b></li>
                    <li className='me-3 pe-3 border-end'>Ad number: <b>681013232</b></li>
                    <li className='me-3 pe-3'>Views: <b>48</b></li>
                  </ul> */}
                </div>
              </Col>
            </Row>
          </Container>
          {/* Recently viewed properties (carousel) */}
          <Container as='section' className='mb-5 pb-2 pb-lg-4'>
            <div className='d-flex align-items-center justify-content-between mb-3'>
              <h2 className='h3 mb-0'>Autour du quartier, voici nos recommandations</h2>
              {/* <Link href='/tg/catalog?category=rent' passHref>
                <Button variant='link fw-normal p-0'>
                  Consulter tout
                  <i className='fi-arrow-long-right ms-2'></i>
                </Button>
              </Link> */}
            </div>

            {/* Swiper slider */}
            <div className='position-relative'>
              <RecommendPropertyList propertyList={recommendProperties} />

              {/* External Prev/Next buttons */}
              <Button id='prevProperties' variant='prev' className='d-none d-xxl-block mt-n5 ms-n5' />
              <Button id='nextProperties' variant='next' className='d-none d-xxl-block mt-n5 me-n5' />
            </div>

            {/* External pagination (bullets) buttons */}
            <div id='paginationProperties' className='swiper-pagination position-relative bottom-0 py-2 mt-1'></div>
          </Container>

        </Container>)}

    </RealEstatePageLayout>
  )
}

export async function getServerSideProps(context) {
  let { nuo } = context.query;

  // Check if nuo is provided
  if (!nuo) {
    return {
      notFound: true, // Return 404 if `nuo` is missing
    };
  }

  try {
    // Fetch data from external API
    const dataAPIresponse = await fetch(
      `${API_URL}?query={propriete(nuo:${nuo}){tarifications{id,mode,currency,montant},id,cout_visite,est_disponible,nuo,garage,est_meuble,titre,descriptif,surface,usage,cuisine,salon,piece,wc_douche_interne,cout_mensuel,nuitee,cout_vente,categorie_propriete{denomination,id},infrastructures{denomination,icone},meubles{libelle,icone},badge_propriete{id,date_expiration,badge{id,badge_name,badge_image}},pays{id,code,denomination},ville{denomination,id},quartier{id,denomination,minus_denomination},adresse{libelle},offre{denomination},visuels{uri,position},user{id}}}`
    );

    // Check if the response is OK (status 200-299)
    if (!dataAPIresponse.ok) {
      console.error("Failed to fetch data:", dataAPIresponse.statusText);
      return {
        notFound: true, // Return 404 if API call fails
      };
    }

    // Parse the JSON data
    const jsonResponse = await dataAPIresponse.json();
    console.log("Propriete en JSON: ", jsonResponse);
    // Check if property data exists
    const property = jsonResponse?.data?.propriete;
    if (!property) {
      console.error("Property data not found in the response.");
      return {
        notFound: true, // Return 404 if property is not found
      };
    }

    // Log the property for debugging
    console.log("Propriete:", property);

    // Pass data to the page via props
    return { props: { property } };
  } catch (error) {
    // Handle any errors during fetch or JSON parsing
    console.error("Error fetching property data:", error);
    return {
      props: { property: null }, // Pass null property if there's an error
    };
  }
}
export default SinglePropertyAltPage