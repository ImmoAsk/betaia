import { useRef, useEffect, useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import RealEstatePageLayout from '../../../components/partials/RealEstatePageLayout'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Offcanvas from 'react-bootstrap/Offcanvas'
import Nav from 'react-bootstrap/Nav'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import ToggleButton from 'react-bootstrap/ToggleButton'
import Breadcrumb from 'react-bootstrap/Breadcrumb'
import Pagination from 'react-bootstrap/Pagination'
import ImageLoader from '../../../components/ImageLoader'
import PropertyCard from '../../../components/PropertyCard'
import SimpleBar from 'simplebar-react'
//import Nouislider from 'nouislider-react'
import 'simplebar/dist/simplebar.min.css'
//import 'nouislider/distribute/nouislider.css'

const MapContainer = dynamic(() => 
  import('react-leaflet').then(mod => mod.MapContainer),
  { ssr: false }
)
const TileLayer = dynamic(() => 
  import('react-leaflet').then(mod => mod.TileLayer),
  { ssr: false }
)
const CustomMarker = dynamic(() => 
  import('../../../components/partials/CustomMarker'),
  { ssr: false }
)
const Popup = dynamic(() => 
  import('react-leaflet').then(mod => mod.Popup),
  { ssr: false }
)
import 'leaflet/dist/leaflet.css'
import RentingList from '../../../components/iacomponents/RentingList'
import {buildPropertiesArray} from '../../../utils/generalUtils'
import { capitalizeFirstLetter } from '../../../utils/generalUtils'



const CatalogPage = ({_rentingProperties}) => {
  
  // Add extra class to body
  useEffect(() => {
    const body = document.querySelector('body')
    document.body.classList.add('fixed-bottom-btn')
    return () => body.classList.remove('fixed-bottom-btn')
  })

  // Query param (Switch between Rent and Sale category)
  const router = useRouter()
        // categoryParam = router.query.category === 'sale' ? 'sale' : 'rent'
        const {bien} = router.query
      
        // categoryParam = router.query.category === 'sale' ? 'sale' : 'rent'
        const categoryParam ='investir';
        //immeubleType= router.query.type
        // Media query for displaying Offcanvas on screens larger than 991px
  const isDesktop = useMediaQuery({ query: '(min-width: 992px)' })

  // Offcanvas container
  const offcanvasContainer = useRef(null)

  // Offcanvas show/hide
  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  // Property type checkboxes
  const propertyType = [
    {value: 'Chambre salon', checked: false},
    {value: 'Appartement', checked: true},
    {value: 'Chambre', checked: false},
    {value: 'Bureau', checked: false},
    {value: 'Immeuble commercial', checked: false},
    {value: 'Terrain', checked: false},
    {value: 'Mur commercial', checked: false},
    {value: 'Espace co-working', checked: false},
    {value: 'Villa', checked: false}
  ]

  // Price range slider
  /* const PriceRange = () => {
    const [minRange, setMinRange] = useState(categoryParam === 'sale' ? 90000 : 1100)
    const [maxRange, setMaxRange] = useState(categoryParam === 'sale' ? 250000 : 3000)

    const handleInputChange = e => {
      if (e.target.name === 'minRange') {
        setMinRange(e.target.value)
      } else {
        setMaxRange(e.target.value)
      }
    }

    const handleSliderChange = sliderVal => {
      let sliderMinVal = Math.round(sliderVal[0].replace(/\D/g,''))
      let sliderMaxVal = Math.round(sliderVal[1].replace(/\D/g,''))
      setMinRange(sliderMinVal)
      setMaxRange(sliderMaxVal)
    }

    return (
      <>
        <Nouislider
          range={{min: categoryParam === 'sale' ? 30000 : 200, max: categoryParam === 'sale' ? 500000 : 5000}}
          start={[minRange, maxRange]}
          format={{
            to: value => 'XOF ' + parseInt(value, 10),
            from: value => Number(value)
          }}
          connect
          tooltips
          className='range-slider-ui'
          onChange={handleSliderChange}
        />
        <div className='d-flex align-items-center'>
          <div className='w-100 pe-2'>
            <InputGroup>
              <InputGroup.Text className='fs-base'>XOF</InputGroup.Text>
              <Form.Control
                name='minRange'
                value={minRange}
                onChange={handleInputChange}
              />
            </InputGroup>
          </div>
          <div className='text-muted'>—</div>
          <div className='w-100 ps-2'>
            <InputGroup>
              <InputGroup.Text className='fs-base'>XOF</InputGroup.Text>
              <Form.Control
                name='maxRange'
                value={maxRange}
                onChange={handleInputChange}
              />
            </InputGroup>
          </div>
        </div>
      </>
    )
  } */

  // Bedrooms number
  const [bedroomsValue, setBedroomsValue] = useState('')
  const bedrooms = [
    {name: 'Studio', value: 'studio'},
    {name: '1', value: '1'},
    {name: '2', value: '2'},
    {name: '3', value: '3'},
    {name: '4+', value: '4+'}
  ]

  // Bathrooms number
  const [bathroomsValue, setBathroomsValue] = useState('')
  const bathrooms = [
    {name: '1', value: '1'},
    {name: '2', value: '2'},
    {name: '3', value: '3'},
    {name: '4', value: '4'}
  ]

  // Amenities checkboxes
  const amenities = [
    {value: 'Air conditioning', checked: true},
    {value: 'Balcony', checked: false},
    {value: 'Garage', checked: true},
    {value: 'Gym', checked: false},
    {value: 'Parking', checked: false},
    {value: 'Pool', checked: false},
    {value: 'Security cameras', checked: false},
    {value: 'WiFi', checked: true},
    {value: 'Laundry', checked: false},
    {value: 'Dishwasher', checked: false}
  ]

  // Pets checkboxes
  const pets = [
    {value: 'Cats allowed', checked: false},
    {value: 'Dogs allowed', checked: false}
  ]

  // Additional options checkboxes
  const options = [
    {value: 'Verified', checked: false},
    {value: 'Featured', checked: false}
  ]

  // Map popup state
  const [showMap, setShowMap] = useState(false)

  // Map markers
  const markers = [
    {
      position: [40.72, -73.996],
      popup: {
        href: '/real-estate/single-v1',
        img: categoryParam === 'sale' ? '/images/real-estate/catalog/18.jpg' : '/images/real-estate/catalog/06.jpg',
        title: categoryParam === 'sale' ? 'Ellis Studio | 40 sq.m' : '3-bed Apartment | 67 sq.m',
        address: '365 Broome Street, NY 11105',
        price: categoryParam === 'sale' ? '$50,000' : '$1,650',
        amenities: categoryParam === 'sale' ? [3, 2, 1] : [3, 2, 1]
      }
    },
    {
      position: [40.7225, -73.998],
      popup: {
        href: '/real-estate/single-v1',
        img: categoryParam === 'sale' ? '/images/real-estate/catalog/19.jpg' : '/images/real-estate/catalog/07.jpg',
        title: categoryParam === 'sale' ? 'Country House | 120 sq.m' : 'Pine Apartments | 56 sq.m',
        address: '72 Crosby Street, NY 11105',
        price: categoryParam === 'sale' ? '$162,000' : '$2,000',
        amenities: categoryParam === 'sale' ? [2, 1, 1] : [4, 2, 2]
      }
    },
    {
      position: [40.723, -73.990],
      popup: {
        href: '/real-estate/single-v1',
        img: categoryParam === 'sale' ? '/images/real-estate/catalog/20.jpg' : '/images/real-estate/catalog/08.jpg',
        title: categoryParam === 'sale' ? 'Condo | 70 sq.m' : 'Greenpoint Rentals | 85 sq.m',
        address: '143 E-Houston Street, NY 11105',
        price: categoryParam === 'sale' ? '$85,000' : '$1,350',
        amenities: categoryParam === 'sale' ? [2, 1, 1] : [2, 1, 0]
      }
    },
    {
      position: [40.7176, -74],
      popup: {
        href: '/real-estate/single-v1',
        img: categoryParam === 'sale' ? '/images/real-estate/catalog/21.jpg' : '/images/real-estate/catalog/09.jpg',
        title: categoryParam === 'sale' ? 'Luxury Rental Villa | 180 sq.m' : 'Terra Nova Apartments | 85 sq.m',
        address: '109 Walker Street, NY 11105',
        price: categoryParam === 'sale' ? '$300,500' : '$2,400',
        amenities: categoryParam === 'sale' ? [4, 2, 2] : [5, 2, 2]
      }
    },
    {
      position: [40.7279, -74],
      popup: {
        href: '/real-estate/single-v1',
        img: categoryParam === 'sale' ? '/images/real-estate/catalog/22.jpg' : '/images/real-estate/catalog/10.jpg',
        title: categoryParam === 'sale' ? 'Cottage | 120 sq.m' : 'O’Farrell Rooms | 40 sq.m',
        address: '180 Thompson Street, NY 11105',
        price: categoryParam === 'sale' ? '$184,000' : 'From $550',
        amenities: categoryParam === 'sale' ? [3, 1, 1] : [2, 1, 0]
      }
    },
    {
      position: [40.7282, -73.996],
      popup: {
        href: '/real-estate/single-v1',
        img: categoryParam === 'sale' ? '/images/real-estate/catalog/23.jpg' : '/images/real-estate/catalog/11.jpg',
        title: categoryParam === 'sale' ? 'Modern House | 170 sq.m' : 'Studio | 32 sq.m',
        address: '561 West 3rd Street, NY 11105',
        price: categoryParam === 'sale' ? '$620,400' : '$680',
        amenities: categoryParam === 'sale' ? [5, 2, 2] : [1, 1, 1]
      }
    },
    {
      position: [40.7264, -73.994],
      popup: {
        href: '/real-estate/single-v1',
        img: categoryParam === 'sale' ? '/images/real-estate/catalog/24.jpg' : '/images/real-estate/catalog/12.jpg',
        title: categoryParam === 'sale' ? 'Duplex with Garage | 200 sq.m' : 'Mason House | 150 sq.m',
        address: '19 Bond Street, NY 11105',
        price: categoryParam === 'sale' ? 'From $200,670' : 'From $4,000',
        amenities: categoryParam === 'sale' ? [4, 2, 3] : [3, 2, 2]
      }
    },
    {
      position: [40.724, -74.001],
      popup: {
        href: '/real-estate/single-v1',
        img: categoryParam === 'sale' ? '/images/real-estate/catalog/25.jpg' : '/images/real-estate/catalog/13.jpg',
        title: categoryParam === 'sale' ? 'Studio | 40 sq.m' : 'Office | 320 sq.m',
        address: '138 Spring Street, NY 11105',
        price: categoryParam === 'sale' ? '$92,000' : '$8,000',
        amenities: categoryParam === 'sale' ? [1, 1, 1] : [2, 1, 8]
      }
    }
  ]


  const categoryParamTitle = categoryParam => {
    let titleFromCategory
    switch (categoryParam) {
      case 'bailler':
        titleFromCategory="Baux immobiliers"
        return titleFromCategory
        break
      case 'sale':
        titleFromCategory="vente immobilière"
        return titleFromCategory
        break
      case 'rent':
        titleFromCategory="location immobilière"
        return titleFromCategory
        break
      case 'invest':
        titleFromCategory="investissement immobilier"
        return titleFromCategory
        break
      default:
        titleFromCategory="location immobilière"
        return titleFromCategory
        break
    }
  }

  const humanOfferTitle = categoryParamTitle(categoryParam);
  const pageTitle = capitalizeFirstLetter(bien) + " en " + humanOfferTitle;
  //const { status, data:propertiesByOCTD, error, isFetching,isLoading,isError }  = usePropertiesByOCTD("1","1","5","2" );
  console.log(_rentingProperties);
  const rentingProperties = buildPropertiesArray(_rentingProperties);
  return (
    <RealEstatePageLayout
      pageTitle={pageTitle}
      activeNav='Catalog'
    >

      {/* Page container */}
      <Container fluid className='mt-5 pt-5 p-0'>
        <Row className='g-0 mt-n3'>
          {/* Filters sidebar (Offcanvas on screens < 992px) */}
          <Col
            ref={offcanvasContainer}
            as='aside'
            lg={4}
            xl={3}
            className='border-top-lg border-end-lg shadow-sm px-3 px-xl-4 px-xxl-5 pt-lg-2'
          >
            <Offcanvas
              show={isDesktop ? true : show}
              onHide={handleClose}
              backdrop={isDesktop ? false : true}
              scroll={isDesktop ? true : false}
              container={offcanvasContainer}
              className='offcanvas-expand-lg'
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title as='h5'>Filtres</Offcanvas.Title>
              </Offcanvas.Header>

              {/* Nav (switch between Rent / Sale) */}
              {/* <Offcanvas.Header className='d-block border-bottom pt-0 pt-lg-4 px-lg-0'>
                <Nav variant='tabs' className='mb-0'>
                  <Nav.Item>
                    <Link href='/real-estate/catalog?category=rent' passHref>
                      <Nav.Link active={categoryParam === 'rent' ? true : false}>
                        <i className='fi-rent fs-base me-2'></i>
                        A louer
                      </Nav.Link>
                    </Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Link href='/real-estate/catalog?category=sale' passHref>
                      <Nav.Link active={categoryParam === 'sale' ? true : false}>
                        <i className='fi-home fs-base me-2'></i>
                        A vendre
                      </Nav.Link>
                    </Link>
                  </Nav.Item>
          
                <Nav.Item className='mt-1'>
                    <Link href='/real-estate/catalog?category=invest' passHref>
                      <Nav.Link active={categoryParam === 'invest' ? true : false}>
                        <i className='fi-home fs-base me-2'></i>
                        A investir
                      </Nav.Link>
                    </Link>
                  </Nav.Item>
                  <Nav.Item className='mt-1'>
                    <Link href='/real-estate/catalog?category=bailler' passHref>
                      <Nav.Link active={categoryParam === 'bailler' ? true : false}>
                        <i className='fi-home fs-base me-2'></i>
                        A bailler
                      </Nav.Link>
                    </Link>
                  </Nav.Item>
                  
                </Nav>
              </Offcanvas.Header> */}

              {/* Offcanvas body */}
              <Offcanvas.Body className='py-lg-4'>
                <div className='pb-4 mb-2'>
                  <h3 className='h6'>Situation géographique</h3>
                  <Form.Select defaultValue='Lome' className='mb-2'>
                    <option value='default' disabled>Choisir la ville</option>
                    <option value='Tsevie'>Tsevie</option>
                    <option value='Kpalime'>Kpalime</option>
                    <option value='Notse'>Notse</option>
                    <option value='Lome'>Lome</option>
                    <option value='Aneho'>Aneho</option>
                  </Form.Select>
                  <Form.Select defaultValue='default'>
                    <option value='default' disabled>Choisir le quartier</option>
                    <option value='Kagome'>Kagome</option>
                    <option value='Adakpame'>Adakpame</option>
                    <option value='Bè'>Bè</option>
                    <option value='Be Kpota'>Be-Kpota</option>
                    <option value='Decon'>Decon</option>
                  </Form.Select>
                </div>
                <div className='pb-4 mb-2'>
                  <h3 className='h6'>Type de biens immobiliers</h3>
                  <SimpleBar autoHide={false} className='simplebar-no-autohide' style={{maxHeight: '11rem'}}>
                    {propertyType.map(({value, checked}, indx) => (
                      <Form.Check
                        key={indx}
                        id={`type-${indx}`}
                        value={value}
                        defaultChecked={checked}
                        label={<><span className='fs-sm'>{value}</span></>}  
                      />
                    ))}
                  </SimpleBar>
                </div>
                <div className='pb-4 mb-2'>
                  <h3 className='h6'>Budget prévu</h3>
                  <PriceRange />
                </div>
                <div className='pb-4 mb-2'>
                  <h3 className='h6 pt-1'>Chambres à coucher &amp; Salles de douche</h3>
                  <label className='d-block fs-sm mb-1'>Chambres à coucher</label>
                  <ButtonGroup size='sm'>
                    {bedrooms.map((bedroom, indx) => (
                      <ToggleButton
                        key={indx}
                        type='radio'
                        id={`bedrooms-${indx}`}
                        name='bedrooms'
                        value={bedroom.value}
                        checked={bedroomsValue === bedroom.value}
                        onChange={(e) => setBedroomsValue(e.currentTarget.value)}
                        variant='outline-secondary fw-normal'
                      >{bedroom.name}</ToggleButton>
                    ))}
                  </ButtonGroup>
                  <label className='d-block fs-sm pt-2 my-1'>Salles de douche</label>
                  <ButtonGroup size='sm'>
                    {bathrooms.map((bathroom, indx) => (
                      <ToggleButton
                        key={indx}
                        type='radio'
                        id={`bathrooms-${indx}`}
                        name='bathrooms'
                        value={bathroom.value}
                        checked={bathroomsValue === bathroom.value}
                        onChange={(e) => setBathroomsValue(e.currentTarget.value)}
                        variant='outline-secondary fw-normal'
                      >{bathroom.name}</ToggleButton>
                    ))}
                  </ButtonGroup>
                </div>
                <div className='pb-4 mb-2'>
                  <h3 className='h6 pt-1'>Surface en m²</h3>
                  <div className='d-flex align-items-center'>
                    <Form.Control type='number' min={20} max={500} step={10} placeholder='Min' className='w-100' />
                    <div className='mx-2'>&mdash;</div>
                    <Form.Control type='number' min={20} max={500} step={10} placeholder='Max' className='w-100' />
                  </div> 
                </div>
                <div className='pb-4 mb-2'>
                  <h3 className='h6'>Intérieur & Exterieur</h3>
                  <SimpleBar autoHide={false} className='simplebar-no-autohide' style={{maxHeight: '11rem'}}>
                    {amenities.map(({value, checked}, indx) => (
                      <Form.Check
                        key={indx}
                        id={`amenity-${indx}`}
                        value={value}
                        defaultChecked={checked}
                        label={<><span className='fs-sm'>{value}</span></>}  
                      />
                    ))}
                  </SimpleBar>
                </div>
                {/* <div className='pb-4 mb-2'>
                  <h3 className='h6'>Pets</h3>
                  {pets.map(({value, checked}, indx) => (
                    <Form.Check
                      key={indx}
                      id={`pets-${indx}`}
                      value={value}
                      defaultChecked={checked}
                      label={<><span className='fs-sm'>{value}</span></>}  
                    />
                  ))}
                </div> */}
                <div className='pb-4 mb-2'>
                  <h3 className='h6'>Options additionnelles</h3>
                  {options.map(({value, checked}, indx) => (
                    <Form.Check
                      key={indx}
                      id={`options-${indx}`}
                      value={value}
                      defaultChecked={checked}
                      label={<><span className='fs-sm'>{value}</span></>}  
                    />
                  ))}
                </div>
                <div className='border-top py-4'>
                  <Button variant='outline-primary'>
                    <i className='fi-rotate-right me-2'></i>
                    Reinititialiser les filtres
                  </Button>
                </div>
              </Offcanvas.Body>
            </Offcanvas>
          </Col>


          {/* Content */}
          <Col lg={8} xl={9} className='position-relative overflow-hidden pb-5 pt-4 px-3 px-xl-4 px-xxl-5'>

            {/* Map popup */}
            <div className={`map-popup${showMap ? ' show': ''}`}>
              <Button
                size='sm'
                variant='light btn-icon shadow-sm rounded-circle'
                onClick={() => setShowMap(false)}
              >
                <i className='fi-x fs-xs'></i>
              </Button>
              <MapContainer
                center={isDesktop ? [40.708, -73.997] : [40.724, -73.997]}
                zoom={15}
                scrollWheelZoom={false}
              >
                <TileLayer
                  url='https://api.maptiler.com/maps/pastel/{z}/{x}/{y}.png?key=BO4zZpr0fIIoydRTOLSx'
                  tileSize={512}
                  zoomOffset={-1}
                  minZoom={1}
                  attribution={'\u003ca href=\'https://www.maptiler.com/copyright/\' target=\'_blank\'\u003e\u0026copy; MapTiler\u003c/a\u003e \u003ca href=\'https://www.openstreetmap.org/copyright\' target=\'_blank\'\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e'}
                />
                {markers.map((marker, indx) => {
                  return <CustomMarker
                    key={indx}
                    position={marker.position}
                    icon='dot'
                  >
                    <Popup>
                      <Link href={marker.popup.href}>
                        <a className='d-block'>
                          <ImageLoader src={marker.popup.img} width={280} height={128} alt='Image' />
                        </a>
                      </Link>
                      <div className='card-body position-relative pb-3'>
                        <h6 className='fs-xs fw-normal text-uppercase text-primary mb-1'>For {categoryParam === 'sale' ? 'sale' : 'rent'}</h6>
                        <h5 className='h6 mb-1 fs-sm'>
                          <Link href={marker.popup.href}>
                            <a className='nav-link stretched-link'>{marker.popup.title}</a>
                          </Link>
                        </h5>
                        <p className='mt-0 mb-2 fs-xs text-muted'>{marker.popup.address}</p>
                        <div className='fs-sm fw-bold'>
                          <i className='fi-cash me-2 fs-base align-middle opacity-70'></i>
                          {marker.popup.price}
                        </div>
                      </div>
                      <div className='card-footer d-flex align-items-center justify-content-center mx-2 pt-2 text-nowrap'>
                        <span className='d-inline-block px-2 fs-sm'>
                          {marker.popup.amenities[0]}
                          <i className='fi-bed ms-1 fs-base text-muted'></i>
                        </span>
                        <span className='d-inline-block px-2 fs-sm'>
                          {marker.popup.amenities[1]}
                          <i className='fi-bath ms-1 fs-base text-muted'></i>
                        </span>
                        <span className='d-inline-block px-2 fs-sm'>
                          {marker.popup.amenities[2]}
                          <i className='fi-car ms-1 fs-base text-muted'></i>
                        </span>
                      </div>
                    </Popup>
                  </CustomMarker>
                })}
              </MapContainer>
            </div>

            {/* Breadcrumb */}
            <Breadcrumb className='mb-3 pt-md-2'>
                <Link href='/tg/catalog' passHref>
                  <Breadcrumb.Item>Catalogue immobilier</Breadcrumb.Item>
                </Link>
                {
                  categoryParam && 
                  <Link href={`/tg/baux-immobiliers`} passHref>
                    <Breadcrumb.Item>{categoryParamTitle(categoryParam)}</Breadcrumb.Item>
                  </Link>
                }
                {
                  bien && 
                  <Link href={`/tg/baux-immobiliers/${bien}`} passHref>
                    <Breadcrumb.Item active>{bien}</Breadcrumb.Item>
                  </Link>
                }
                
            </Breadcrumb>

            {/* Title + Map toggle */}
            <div className='d-sm-flex align-items-center justify-content-between pb-3 pb-sm-4'>
              <h1 className='h2 mb-sm-0'>{bien +" en " +categoryParamTitle(categoryParam)}</h1>
              <a
                href='#'
                className='d-inline-block fw-bold text-decoration-none py-1'
                onClick={(e) => {
                  e.preventDefault()
                  setShowMap(true)
                }}
              >
                <i className='fi-map me-2'></i>
                Vue carte
              </a>
            </div>

            {/* Sorting */}
            <div className='d-flex flex-sm-row flex-column align-items-sm-center align-items-stretch my-2'>
              <Form.Group controlId='sortby' className='d-flex align-items-center flex-shrink-0'>
                <Form.Label className='text-body fs-sm me-2 mb-0 pe-1 text-nowrap'>
                  <i className='fi-arrows-sort text-muted mt-n1 me-2'></i>
                  Classer par:
                </Form.Label>
                <Form.Select size='sm'>
                  <option value='Newest'>Nouvels</option>
                  <option value='Popularity'>Populaires</option>
                  <option value='Low - Hight Price'>Prix croissant</option>
                  <option value='High - Low Price'>Prix décroissant</option>
                </Form.Select>
              </Form.Group>
              <hr className='d-none d-sm-block w-100 mx-4' />
              <div className='d-none d-sm-flex align-items-center flex-shrink-0 text-muted'>
                <i className='fi-check-circle me-2'></i>
                <span className='fs-sm mt-n1'>148 résultats</span>
              </div>
            </div>

            {/* Catalog grid */}
            <Row xs={1} sm={2} xl={3} className='g-4 py-4'>
              <RentingList rentingProperties={rentingProperties}/>
            </Row>

            {/* Pagination */}
            <nav className='border-top pb-md-4 pt-4' aria-label='Pagination'>
              <Pagination className='mb-1'>
                <Pagination.Item active>{1}</Pagination.Item>
                <Pagination.Item>{2}</Pagination.Item>
                <Pagination.Item>{3}</Pagination.Item>
                <Pagination.Ellipsis />
                <Pagination.Item>{8}</Pagination.Item>
                <Pagination.Item>
                  <i className='fi-chevron-right'></i>
                </Pagination.Item>
              </Pagination>
            </nav>
          </Col>
        </Row>
      </Container>

      {/* Filters sidebar toggle button (visible < 991px) */}
      <Button size='sm' className='w-100 rounded-0 fixed-bottom d-lg-none' onClick={handleShow}>
        <i className='fi-filter me-2'></i>
        Filtres
      </Button>
    </RealEstatePageLayout>
  )
}

export async function getServerSideProps(context) {

  const { bien } = context.query;
  console.log("Bien: "+ bien);
  const _bien = await fetch(`https://immoaskbetaapi.omnisoft.africa/public/api/v2?query={getCategoryIdByCategorieName(minus_denomination:"${bien}"){denomination,id,code}}`);
  const _jsonbien= await _bien.json();

  const bienId=_jsonbien.data.getCategoryIdByCategorieName.id;
  console.log("BienId: "+ bienId);
  
  const offreId="3";
  // Fetch data from external API
  let dataAPIresponse = await fetch(`https://immoaskbetaapi.omnisoft.africa/public/api/v2?query={getPropertiesByKeyWords(limit:10,orderBy:{column:NUO,order:DESC},offre_id:"3",categorie_id:"${bienId}")
  {badge_propriete{badge{badge_name,badge_image}},visuels{uri,position},id,surface,lat_long,nuo,usage,offre{denomination},categorie_propriete{denomination},pays{code},piece,titre,garage,cout_mensuel,ville{denomination},wc_douche_interne,cout_vente,quartier{denomination}}}`);
  let _rentingProperties = await dataAPIresponse.json();
  //console.log(_rentingProperties.data.getPropertiesByKeyWords);
  _rentingProperties = _rentingProperties.data.getPropertiesByKeyWords;
  return { props: { _rentingProperties } }
}

export default CatalogPage
