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
import { Navigation, Pagination } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import axios from 'axios'
import { useEffect } from 'react'
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
import ImageComponent from "../../../../../../components/iacomponents/ImageComponent";
import { canAccessMoreOptionsProperty, getHumanReadablePrice, createPropertyObject } from '../../../../../../utils/generalUtils'
import DetailRealEstateAgency from '../../../../../../components/iacomponents/DetailRealEstateAgency'
import { API_URL, BASE_URL } from '../../../../../../utils/settings'
import PreSellingModal from '../../../../../../components/iacomponents/PreSelling/PreSellingModal'
import Model3DList from '../../../../../../components/iacomponents/Model3D/Model3DList'
import DeletePropertyModal from '../../../../../../components/iacomponents/DeleteProperty/DeletePropertyModal'
import EditPropertyModal from '../../../../../../components/iacomponents/EditPropertyModal'
import AddNewImagesModal from '../../../../../../components/iacomponents/AddNewImagesProperty/AddNewImagesModal'
import RePostPropertyModal from "../../../../../../components/iacomponents/RePost/RePostPropertyModal";
import { Alert } from 'react-bootstrap'
function SinglePropertyAltPage({ property }) {
  const { data: session } = useSession();
  const router = useRouter()
  const { nuo, bien, quartier, ville } = router.query;


  // Message modal state
  // Sign in modal
  //const propertyCard= createPropertyObject(property);
  const [signinShow, setSigninShow] = useState(false)
  const handleSigninClose = () => setSigninShow(false)
  const handleSigninShow = () => setSigninShow(true)


  const [preventeShow, setPreventeShow] = useState(false);
  const handlePreventeClose = () => setPreventeShow(false);
  const handlePreventeShow = () => setPreventeShow(true);

  const [newImagesPropertyShow, setNewImagesPropertyShow] = useState(false);
  const handleAddNewImagesPropertyClose = () => setNewImagesPropertyShow(false);
  const handleAddNewImagesPropertyShow = () => setNewImagesPropertyShow(true);

  const [editPropertyShow, setEditPropertyShow] = useState(false);
  const handleEditPropertyClose = () => setEditPropertyShow(false);
  const handleEditPropertyShow = () => setEditPropertyShow(true);

  const [deletePropertyShow, setDeletePropertyShow] = useState(false);
  const handleDeletePropertyClose = () => setDeletePropertyShow(false);
  const handleDeletePropertyShow = () => setDeletePropertyShow(true);
  // Sign up modal
  const [signupShow, setSignupShow] = useState(false)
  const handleSignupClose = () => setSignupShow(false)
  const handleSignupShow = () => setSignupShow(true)

  const [repostPropertyShow, setRepostPropertyRepostShow] = useState(false);
  const handlePropertyRepostClose = () => setRepostPropertyRepostShow(false);
  const handlePropertyRepostShow = () => setRepostPropertyRepostShow(true);



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
  const [model3dImages, setModel3dImages] = useState([]);
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
    axios.get(`${API_URL}?query={getRecommendProperties(first:5,offre_id:"2",nuo:${property.nuo},quartier_id:"${property.quartier.id}",categorie_id:"${property.categorie_propriete.id}"){data{surface,badge_propriete{badge{badge_name,badge_image}},id,nuo,usage,offre{denomination},categorie_propriete{denomination},pays{code},piece,titre,garage,cout_mensuel,ville{denomination},wc_douche_interne,cout_vente,quartier{denomination,minus_denomination,id},visuels{uri,position}}}}`).
      then((res) => {
        setRecommendProperties(res.data.data.getRecommendProperties.data.map((propertyr) => {
          //const { status, data:badges_property, error, isFetching,isLoading,isError }  = usePropertyBadges(property.id);
          return {
            href: getPropertyFullUrl(propertyr.pays.code, propertyr.offre.denomination, propertyr.categorie_propriete.denomination, propertyr.ville.denomination, propertyr.quartier.minus_denomination, propertyr.nuo),
            images: [[getFirstImageArray(propertyr.visuels), 467, 305, 'Image']],
            title: 'N°' + propertyr.nuo + ': ' + propertyr.categorie_propriete.denomination + ' à ' + propertyr.offre.denomination + ' | ' + propertyr.surface + 'm²',
            category: propertyr.usage,
            location: propertyr.quartier.denomination + ", " + propertyr.ville.denomination,
            price: getHumanReadablePrice(propertyr),
            badges: buildPropertyBadge(propertyr.badge_propriete),
            footer: [propertyr.piece, propertyr.wc_douche_interne, propertyr.garage],
          }
        }));
      });
  }
  const handleAddNewImagesPropertyModal = () => {
    //e.preventDefault();
    if (session) {
      handleAddNewImagesPropertyShow();
    } else {
      handleSignInToUp(e);
    }
  }

  const handleEditPropertyModal = () => {
    //e.preventDefault();
    if (session) {
      handleEditPropertyShow();
    } else {
      handleSignInToUp(e);
    }
  }
  const handleDeletePropertyModal = () => {
    //e.preventDefault();
    if (session) {
      handleDeletePropertyShow();
    } else {
      handleSignInToUp(e);
    }
  }
  const handlePropertyRepostModal = () => {
    //e.preventDefault();
    if (session) {
      handlePropertyRepostShow();
    } else {
      handleSignInToUp(e);
    }
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
              if (index === thumbnailSize) {
                return `<li class='swiper-thumbnail ${className}'>
                  <div class='d-flex flex-column align-items-center justify-content-center h-100'>
                    <i class='fi-play-circle fs-4 mb-1'></i>
                    <span>Lancer la vidéo</span>
                  </div>
                </li>`
              } else {
                return `<li class='swiper-thumbnail ${className}'>
                  <img src=${thumbnails[index]} alt='Thumbnail'/>
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
          {property &&
            property.visuels.map((imgproperty) => {
              return (
                <SwiperSlide className="d-flex">
                  <ImageComponent imageUri={imgproperty.uri} />
                </SwiperSlide>
              );
            })}
          {/* {!session && (
            <>
              <SwiperSlide className="d-flex">
                <ImageComponent imageUri={Unconnectedhumbnails[0]} />
              </SwiperSlide>
              <SwiperSlide className="d-flex">
                <Link href="/signup-light">
                  <a>
                    <ImageComponent imageUri={Unconnectedhumbnails[1]} />
                  </a>
                </Link>
              </SwiperSlide>

            </>
          )} */}
          {/* <SwiperSlide>
            <div className='ratio ratio-16x9'>
              <iframe src='https://www.youtube.com/embed/1oVncb5hke0?autoplay=1' className='rounded-3' allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
            </div>
          </SwiperSlide> */}

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
      pageTitle={`${property.categorie_propriete.denomination} à vendre, ${property.ville.denomination}, ${property.quartier.denomination} | No. ${nuo} | Togo`}
      userLoggedIn={session ? true : false}
      pageDescription={`${property.categorie_propriete.denomination} à vendre, ${property.ville.denomination}, ${property.quartier.denomination}, Togo. ${property.descriptif}`}
      pageKeywords={`vente immobiliere, ${property.categorie_propriete.denomination},immeuble, achat immobilier,foncier,investissemt,acquisition,${property.ville.denomination}, ${property.quartier.denomination},Togo`}
      pageCoverImage={`${getFirstImageArray(property.visuels)}`}
      pageUrl={`${BASE_URL}/tg/ventes-immobilieres/${bien}/${ville}/${quartier}/${nuo}`}
    >
      {/* Message modal */}
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

      {preventeShow && <PreSellingModal
        centered
        size='lg'
        show={preventeShow}
        onHide={handlePreventeClose}
        onSwap={handlePreventeShow}
        property={property}
      />}

      {
        newImagesPropertyShow && <AddNewImagesModal
          centered
          size='lg'
          show={newImagesPropertyShow}
          onHide={handleAddNewImagesPropertyClose}
          property={createPropertyObject(property)} // Pass the property object to the modal component as a propproperty}
        />
      }

      {
        editPropertyShow && <EditPropertyModal
          centered
          size='lg'
          show={editPropertyShow}
          onHide={handleEditPropertyClose}
          property={createPropertyObject(property)}
        />
      }

      {
        deletePropertyShow && <DeletePropertyModal
          centered
          size='lg'
          show={deletePropertyShow}
          onHide={handleDeletePropertyClose}
          property={createPropertyObject(property)}
        />
      }

      {
        repostPropertyShow && <RePostPropertyModal
          centered
          size='lg'
          show={repostPropertyShow}
          onHide={handlePropertyRepostClose}
          property={createPropertyObject(property)}
        />
      }
      {/* Post content */}
      {property && (
        <Container as='section'>
          <Container as='section' className='mt-5 mb-lg-5 mb-4 pt-5 pb-lg-5'>
            {/* Breadcrumb */}
            <Breadcrumb className='mb-3 pt-md-3'>
              <Link href='/tg/catalog' passHref>
                <Breadcrumb.Item>Catalogue immobilier</Breadcrumb.Item>
              </Link>
              <Link href='/tg/ventes-immobilieres' passHref>
                <Breadcrumb.Item>{"Ventes immobilières"}</Breadcrumb.Item>
              </Link>
              <Link href={`/tg/ventes-immobilieres/${bien}`} passHref>
                <Breadcrumb.Item>{property.categorie_propriete.denomination}</Breadcrumb.Item>
              </Link>
              <Link href={`/tg/ventes-immobilieres/${bien}/${ville}`} passHref>
                <Breadcrumb.Item>{property.ville.denomination}</Breadcrumb.Item>
              </Link>
              <Link href={`/tg/ventes-immobilieres/${bien}/${ville}/${quartier}`} passHref>
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
                    <h1 className='h2 mb-2'> No. {property.nuo} | {property.categorie_propriete.denomination} à vendre, {property.ville.denomination}, {property.quartier.denomination} {" "}{property && property.titre == 'undefined' ? '' : property.titre}</h1>
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

                {!session || !session.user ? (
                  <Alert variant="info" className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-1">Connectez-vous pour en savoir plus</h6>
                      <p className="mb-0">
                        Vous êtes agent immobilier professionnel ? Créez votre compte dès aujourd’hui et choisissez l’abonnement qui vous correspond. Accédez en toute simplicité aux coordonnées exclusives des propriétaires et agences. Cet accès réservé aux abonnés vous permet de conserver l’intégralité de vos commissions, de multiplier vos opportunités et de conclure davantage de ventes.
                      </p>
                    </div>
                    <Button variant="primary" onClick={() => signIn()}>
                      Se connecter
                    </Button>
                  </Alert>
                ) : (session.user.roleId === '1200' || session.user.roleId === '1231') ? (
                  <DetailRealEstateAgency user={property.user.id} />
                ) : (session.user.roleId === '1233' || session.user.roleId === '1234' || session.user.roleId === '1235' || session.user.roleId === '1236' || session.user.roleId === '152') ? (
                  <ProRealEstateAgency user={property.user.id} />
                ) : null}
              </Col>


              {/* Sidebar with details */}
              <Col as='aside' lg={5}>
                <div className='ps-lg-5'>
                  <div className='d-flex align-items-center justify-content-between mb-3'>
                    <div>
                      <Badge bg='success' className='me-2 mb-2'>Vérifié</Badge>
                      {property && property.statut === 2 && (
                        <Badge bg="danger" className="me-2 mb-2">
                          Il est vendu actuellement
                        </Badge>
                      )}
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
                          overlay={<Tooltip>Partager</Tooltip>}
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
                      {canAccessMoreOptionsProperty(session?.user, property.user.id) && (
                        <Dropdown className="d-inline-block">
                          <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip>Gerer plus d'options</Tooltip>}
                          >
                            <Dropdown.Toggle variant="icon btn-light-primary btn-xs shadow-sm rounded-circle ms-2 mb-2">
                              <i className="fi-dots-vertical"></i>
                            </Dropdown.Toggle>
                          </OverlayTrigger>
                          <Dropdown.Menu align="end" className="my-1">
                            <Dropdown.Item as="button">

                              <a target="_blank" rel="noopener noreferrer" onClick={handleAddNewImagesPropertyModal}>
                                <i className="fi-image fs-base opacity-75 me-2"></i>
                                Mettre plus d'images
                              </a>

                            </Dropdown.Item>

                            <Dropdown.Item as="button">

                              <a target="_blank" rel="noopener noreferrer" onClick={console.log("Mettre en avant")}>
                                <i className="fi-flame fs-base opacity-75 me-2"></i>
                                Mettre en avant
                              </a>

                            </Dropdown.Item>

                            <Dropdown.Item as="button">

                              <a target="_blank" rel="noopener noreferrer" onClick={handleEditPropertyModal}>
                                <i className="fi-edit fs-base opacity-75 me-2"></i>
                                Editer
                              </a>

                            </Dropdown.Item>

                            <Dropdown.Item as="button">

                              <a target="_blank" rel="noopener noreferrer" onClick={handleDeletePropertyModal}>
                                <i className="fi-trash fs-base opacity-75 me-2"></i>
                                Rendre indisponible
                              </a>

                            </Dropdown.Item>
                            <Dropdown.Item as="button">

                              <a target="_blank" rel="noopener noreferrer" onClick={handlePropertyRepostModal}>
                                <i className="fi-trash fs-base opacity-75 me-2"></i>
                                Remettre en location ou vente
                              </a>

                            </Dropdown.Item>

                          </Dropdown.Menu>
                        </Dropdown>
                      )}
                    </div>
                  </div>

                  {/* Price */}
                  <ul className='d-flex mb-2 list-unstyled fs-sm'>
                    <li className='me-3 pe-3 border-end'>
                      {!property ? <span className="sr-only">En chargement...</span>
                        : <>
                          {property.cout_vente > 0 &&
                            <>
                              <h3 className='h5 mb-2'>Prix d'achat:</h3>
                              <h2 className='h5 mb-4 pb-2'>
                                XOF {property && property.cout_vente}
                                <span className='d-inline-block ms-1 fs-base fw-normal text-body'>/vie</span>
                              </h2>

                              {property.prevente === 0 && property.statut === 2 ? (
                                <>
                                </>
                              ) : (<Button
                                size="md"
                                className="w-100"
                                variant="outline-primary"
                                onClick={handleSigninShow}
                              >
                                Planifier une visite
                              </Button>)}
                            </>
                          }
                        </>
                      }
                    </li>
                    {property.prevente > 0 &&
                      <li className='me-3 pe-3'>
                        {!property ? <span className="sr-only">En chargement...</span>
                          : <>
                            {property.cout_vente > 0 &&
                              <>
                                <h3 className='h5 mb-2'>Souscription :</h3>
                                <h2 className='h5 mb-4 pb-2'>
                                  XOF 25000
                                </h2>

                              </>
                            }
                          </>
                        }
                      </li>}

                    <li className='me-3 pe-3'>
                      {!property ? <span className="sr-only">En chargement...</span>
                        : <>
                          {property.part_min_investissement > 0 &&
                            <>
                              <h3 className='h5 mb-2'>Investissement min:</h3>
                              <h2 className='h5 mb-4 pb-2'>
                                XOF {property && property.part_min_investissement}
                                <span className='d-inline-block ms-1 fs-base fw-normal text-body'>/pierre</span>
                              </h2>

                              <Button size='md' className='w-100' variant='outline-primary'>Placer une pierre</Button>
                            </>
                          }
                        </>
                      }
                    </li>

                  </ul>
                  <div className='justify-content-between mb-2'>
                    {property.prevente > 0 && property.statut != 2 &&
                      <Button size='md' className='w-100' variant='outline-primary' onClick={handlePreventeShow}>Payer la souscription</Button>}
                  </div>

                  {property && property.statut === 2 && (
                    <div className="justify-content-between mb-2">


                      <Link href='/tg/add-project' passHref>

                        <Button size='lg' variant='outline-primary' className='w-100'>
                          Soumettre plutot votre requete
                        </Button>
                      </Link>
                    </div>
                  )}
                  {/* Property details card */}
                  <Card className='border-0 bg-secondary mb-2'>
                    <Card.Body>
                      <h5 className='mb-0 pb-3'>Détails clés du bien immobilier</h5>
                      <ul className='list-unstyled mt-n2 mb-0'>
                        <li className='mt-2 mb-0'><b>Type: </b>{property && property.categorie_propriete.denomination}</li>
                        <li className='mt-2 mb-0'><b>Surface: </b>{property && property.surface} m²</li>
                        <li className='mt-2 mb-0'><b>Document de propriété: </b>{property && property.papier_propriete}</li>
                        {property.salon > 0 &&
                          <>
                            <li className='mt-2 mb-0'><b>Salon: </b>{property && property.salon}</li>
                          </>
                        }
                        {property.prevente > 0 &&
                          <>
                            <li className='mt-2 mb-0'><b>Disponibilité: </b>1er Mai 2025, En prevente</li>
                          </>
                        }

                        {property.piece > 0 &&
                          <>
                            <li className='mt-2 mb-0'><b>Chambres+salon: </b>{property && property.piece}+{property && property.salon}</li>
                          </>
                        }
                        {property.wc_douche_interne > 0 &&
                          <>
                            <li className='mt-2 mb-0'><b>Douches: </b>{property && property.wc_douche_interne}</li>
                          </>
                        }
                        {property && property.prevente === 0 && property.est_meuble === 0 && property.super_categorie === "acquisition" && (
                          <li className="mt-2 mb-0">
                            <b>Frais d'assistance: </b>
                            {property && property.cout_assistance_client * 100} % du prix de vente
                          </li>
                        )}
                      </ul>
                    </Card.Body>
                  </Card>
                  {property.prevente > 0 &&
                    <Card className='border-0 bg-secondary mb-2'>
                      <Card.Body>
                        <h5 className='mb-0 pb-3'>Modalité de paiements</h5>
                        <ul className='list-unstyled mt-n2 mb-0'>
                          <li className='mt-2 mb-0'><b>Apport initial: </b>20 % du prix initial</li>
                          <li className='mt-2 mb-0'><b>Echelonnement: </b> 15 ans</li>
                          <li className='mt-2 mb-0'><b>Pret immobilier: </b>Accord de pret immobilier possible</li>
                          <li className='mt-2 mb-0'><b>Disponibilité: </b>1er Mai 2025, En prevente</li>
                        </ul>
                      </Card.Body>
                    </Card>

                  }
                  {property.prevente > 0 && property.statut != 2 &&
                    <Button size='md' className='w-100' variant='outline-primary' onClick={handlePreventeShow}>Payer la souscription</Button>}

                  {property.prevente == 0 && property.statut != 2 &&
                    <div className='justify-content-between mb-2'>
                      <Button size='lg' className='w-100' variant='outline-primary' onClick={handleSigninShow}>Planifier une visite</Button>
                    </div>
                  }

                  {property.prevente == 0 && property.statut != 2 &&
                    <div className='justify-content-between mb-2'>
                      <Button size='lg' className='w-100 outline-primary' onClick={handleSignupShow}>Vérifier la disponibilité</Button>
                    </div>
                  }
                  {property && property.statut === 2 && (
                    <div className="justify-content-between mb-2">


                      <Link href='/tg/add-project' passHref>

                        <Button size='lg' variant='outline-primary' className='w-100'>
                          Soumettre plutot votre requete
                        </Button>
                      </Link>
                    </div>
                  )}

                  <Link href="https://www.whatsapp.com/channel/0029Va8UsGT6mYPQ1aIvdm25">
                    <a className="d-inline-block mb-4 pb-2 text-decoration-none">
                      <i className="fi-help me-2 mt-n1 align-middle"></i>
                      Abonnez-vous à FlashImmo sur WhatsApp – Gratuit et instantané
                    </a>
                  </Link>
                  {property.meubles.length > 0 &&
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
          {recommendProperties.length > 0 && (
            <Container as='section' className='mb-5 pb-2 pb-lg-4'>
              <div className='d-flex align-items-center justify-content-between mb-3'>
                <h2 className='h3 mb-0'>D'autres biens immobiliers similaires autour du quartier</h2>
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
          )}
          {model3dImages.length > 0 && (
            <Container as='section' className='mb-5 pb-2 pb-lg-4'>
              <div className='d-flex align-items-center justify-content-between mb-3'>
                <h2 className='h3 mb-0'>Des modèles 3D à adopter sur ce terrain après achat</h2>
              </div>
              {/* Swiper slider */}
              <div className='position-relative'>
                <Model3DList propertyList={model3dImages} />
                <Button id='prevProperties' variant='prev' className='d-none d-xxl-block mt-n5 ms-n5' />
                <Button id='nextProperties' variant='next' className='d-none d-xxl-block mt-n5 me-n5' />
              </div>

              {/* External pagination (bullets) buttons */}
              <div id='paginationProperties' className='swiper-pagination position-relative bottom-0 py-2 mt-1'></div>
            </Container>
          )}

        </Container>
      )}

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
      `${API_URL}?query={propriete(nuo:${nuo}){tarifications{id,mode,currency,montant},id,cout_visite,cout_assistance_client,statut,super_categorie,prevente,est_disponible,papier_propriete,nuo,garage,est_meuble,titre,descriptif,surface,usage,cuisine,salon,piece,wc_douche_interne,cout_mensuel,nuitee,cout_vente,categorie_propriete{denomination,id},infrastructures{denomination,icone},meubles{libelle,icone},badge_propriete{id,date_expiration,badge{id,badge_name,badge_image}},pays{id,code,denomination},ville{denomination,id},quartier{id,denomination,minus_denomination},adresse{libelle},offre{denomination,id},visuels{uri,position},user{id}}}`
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