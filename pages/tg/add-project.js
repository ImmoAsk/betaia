import { useState,useImperativeHandle,useRef } from 'react'
import RealEstatePageLayout from '../../components/partials/RealEstatePageLayout'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import axios from 'axios'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Breadcrumb from 'react-bootstrap/Breadcrumb'
import ProgressBar from 'react-bootstrap/ProgressBar'
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import ToggleButton from 'react-bootstrap/ToggleButton'
import Form from 'react-bootstrap/Form'
import Collapse from 'react-bootstrap/Collapse'
import Alert from 'react-bootstrap/Alert'
import Modal from 'react-bootstrap/Modal'
import Badge from 'react-bootstrap/Badge'

import ImageLoader from '../../components/ImageLoader'
import ScrollLink from '../../components/ScrollLink'
//Use of FIlePond
import {FilePond,registerPlugin} from 'react-filepond'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import FilePondPluginImageCrop from 'filepond-plugin-image-crop'
import FilePondPluginImageResize from 'filepond-plugin-image-resize'
import FilePondPluginImageTransform from 'filepond-plugin-image-transform'
import { getSession, useSession } from 'next-auth/react'

import NumberFormat from 'react-number-format'
import 'filepond/dist/filepond.min.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'

const MapContainer = dynamic(() => 
  import('react-leaflet').then(mod => mod.MapContainer),
  { ssr: false }
)
const TileLayer = dynamic(() => 
  import('react-leaflet').then(mod => mod.TileLayer),
  { ssr: false }
)
const Popup = dynamic(() => 
  import('react-leaflet').then(mod => mod.Popup),
  { ssr: false }
)
const CustomMarker = dynamic(() => 
  import('../../components/partials/CustomMarker'),
  { ssr: false }
)
import 'leaflet/dist/leaflet.css'


const AddProjectPage = (props) => {

  // Preview modal
  const [previewShow, setPreviewShow] = useState(false)
  const handlePreviewClose = () => setPreviewShow(false)
  const handlePreviewShow = () => setPreviewShow(true)

  // Overview collapse state
  const [overviewOpen, setOverviewOpen] = useState(false)

  // Amenities collapse state
  const [amenitiesOpen, setAmenitiesOpen] = useState(false)

  // Amenities array
  const amenitiesPreview = [
    [
      { icon: 'fi-wifi', title: 'Free WiFi' },
      { icon: 'fi-thermometer', title: 'Heating' },
      { icon: 'fi-dish', title: 'Dishwasher' },
      { icon: 'fi-parking', title: 'Parking place' },
      { icon: 'fi-snowflake', title: 'Air conditioning' },
      { icon: 'fi-iron', title: 'Iron' },
      { icon: 'fi-tv', title: 'TV' },
      { icon: 'fi-laundry', title: 'Laundry' },
      { icon: 'fi-cctv', title: 'Security cameras' }
    ],
    [
      { icon: 'fi-no-smoke', title: 'No smocking' },
      { icon: 'fi-pet', title: 'Cats' },
      { icon: 'fi-swimming-pool', title: 'Swimming pool' },
      { icon: 'fi-double-bed', title: 'Double bed' },
      { icon: 'fi-bed', title: 'Single bed' }
    ]
  ]
  // Anchor lnks
  const anchors = [
    {to: 'basic-info', label: 'Basic info', completed: true},
    {to: 'location', label: 'Location', completed: true},
    {to: 'details', label: 'Property details', completed: true},
    {to: 'price', label: 'Price range', completed: false},
    {to: 'photos', label: 'Photos / video', completed: false},
    {to: 'contacts', label: 'Contacts', completed: true}
  ]

  // Number of bedrooms radios buttons
  const [bedroomsValue, setBedroomsValue] = useState('4')
  const bedrooms = [
    {name: 'Studio', value: 'studio'},
    {name: '1', value: '1'},
    {name: '2', value: '2'},
    {name: '3', value: '3'},
    {name: '4', value: '4'},
    {name: '5+', value: '5+'}
  ]

  // Number of bathrooms radios buttons
  const [bathroomsValue, setBathroomsValue] = useState('2')
  const bathrooms = [
    {name: '1', value: '1'},
    {name: '2', value: '2'},
    {name: '3', value: '3'},
    {name: '4', value: '4'}
  ]

  // Number of bathrooms radios buttons
  const [parkingsValue, setParkingsValue] = useState('2')
  const parkings = [
    {name: '1', value: '1'},
    {name: '2', value: '2'},
    {name: '3', value: '3'},
    {name: '4', value: '4'}
  ]

  // Amenities (checkboxes)
  const amenities = [
    {value: 'WiFi', checked: true},
    {value: 'Pets-friendly', checked: false},
    {value: 'Dishwasher', checked: false},
    {value: 'Air conditioning', checked: true},
    {value: 'Pool', checked: false},
    {value: 'Iron', checked: true},
    {value: 'Balcony', checked: false},
    {value: 'Bar', checked: false},
    {value: 'Hair dryer', checked: true},
    {value: 'Garage', checked: false},
    {value: 'TV', checked: true},
    {value: 'Kitchen', checked: true},
    {value: 'Gym', checked: false},
    {value: 'Linens', checked: true},
    {value: 'Breakfast', checked: false},
    {value: 'Free parking', checked: true},
    {value: 'Heating', checked: true},
    {value: 'Security cameras', checked: false}
  ]

  // Pets (checkboxes)
  const pets = [
    {value: 'Cats allowed', checked: false},
    {value: 'Dogs allowed', checked: false}
  ]

  // Register Filepond plugins
  registerPlugin(
    FilePondPluginFileValidateType,
    FilePondPluginFileValidateSize,
    FilePondPluginImagePreview,
    FilePondPluginImageCrop,
    FilePondPluginImageResize,
    FilePondPluginImageTransform
  )
  
  // Gallery state
  const [gallery, setGallery] = useState([])
  const [files, setFiles] = useState([]);
  const [descriptionProjet, setDescriptionProjet] = useState("");
  const [categorieProjet, setCategorieProjet] = useState("");
  const [dateLivrable, setDateLivrable] = useState("");

  const [validated, setValidated] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);

	const [isFilePicked, setIsFilePicked] = useState(false);

  const [image, setImage] = useState(null);
  //const [files, setFiles] = useState<File[]>([]);
  const [createObjectURL, setCreateObjectURL] = useState(null);

  const uploadToClient = (event) => {
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];

      //setFiles(i);
      setCreateObjectURL(URL.createObjectURL(i));
      console.log("Full url of image: ",createObjectURL);
      console.log(event.target.files[0]);
    }
  };
  var FormData=require('form-data');

  //const filePondRef = useRef(null);
  var formData = new FormData();
  //return <input ref={inputRef} ... />
  const uploadToServer = async (event) => {
    
    event.stopPropagation();
    event.preventDefault();
    //var formData = new FormData();
		//formData.append('file', image);
    console.log("Image from c to s:",files[0].filename);
  //const [createObjectURL, setCreateObjectURL] = useState(null);
  console.log("Full url: ",createObjectURL);
  //console.log(this.pond.getFiles());
    formData.append('map','{"0": ["variables.file"]}');
    formData.append('operations', `{"query":"mutation($file:Upload!){Upload(file: $file)}"}`)
    formData.append("0",files);
		await fetch(
			"https://immoaskbetaapi.omnisoft.africa/public/api/v2",{method: "POST",body:formData}).then((response) => response.json())
      .then((result) => {
        console.log('Success:', result)}).
        catch((error) => {
        console.error('Error:', error)
      });
  }

  const { data: session } = useSession()

  return (
    <RealEstatePageLayout
      pageTitle='Lancer un projet immobilier'
      userLoggedIn={session ? true : false}
    >
      {/* Preview modal */}
      <Modal
        fullscreen
        show={previewShow}
        onHide={handlePreviewClose}
      >
        <Modal.Header closeButton>
          <h3 className='h5 text-muted fw-normal modal-title d-none d-sm-block text-nowrap'>Property preview</h3>
          <div className='d-flex align-items-center justify-content-sm-end w-100 ms-sm-auto'>
            <Link href='/tg/property-promotion' passHref>
              <Button size='sm' className='me-4'>Save and continue</Button>
            </Link>
            <span className='fs-xs text-muted ms-auto ms-sm-0 me-2'>[ESC]</span>
          </div>
        </Modal.Header>
        <Modal.Body className='p-0'>
          <Container className='mt-2 mt-sm-0 py-4 py-sm-5'>

            {/* Title */}
            <h1 className='h2 mb-2'>Pine Apartments</h1>
            <p className='mb-2 pb-1 fs-lg'>28 Jackson Ave Long Island City, NY 67234</p>
            <ul className='d-flex mb-4 list-unstyled'>
              <li className='me-3 pe-3 border-end'>
                <b className='me-1'>4</b>
                <i className='fi-bed mt-n1 lead align-middle text-muted'></i>
              </li>
              <li className='me-3 pe-3 border-end'>
                <b className='me-1'>2</b>
                <i className='fi-bath mt-n1 lead align-middle text-muted'></i>
              </li>
              <li className='me-3 pe-3 border-end'>
                <b className='me-1'>2</b>
                <i className='fi-car mt-n1 lead align-middle text-muted'></i>
              </li>
              <li>
                <b>56 </b>
                sq.m
              </li>
            </ul>

            {/* Gallery preview */}
            <div className='overflow-auto pb-3 px-2 mx-n2 mb-4'>
              <Row className='row g-2 g-md-3' style={{minWidth: '30rem'}}>
                <Col xs={8} className='d-flex'>
                  <ImageLoader
                    src='/images/tg/single/01.jpg'
                    width={859}
                    height={606}
                    alt='Gallery thumbnail'
                    className='rounded rounded-md-3'
                  />
                </Col>
                <Col xs={4}>
                  <div className='d-flex mb-2 mb-md-3'>
                    <ImageLoader
                      src='/images/tg/single/02.jpg'
                      width={421}
                      height={296}
                      alt='Gallery thumbnail'
                      className='rounded rounded-md-3'
                    />
                  </div>
                  <div className='d-flex'>
                    <ImageLoader
                      src='/images/tg/single/03.jpg'
                      width={421}
                      height={296}
                      alt='Gallery thumbnail'
                      className='rounded rounded-md-3'
                    />
                  </div>
                </Col>
              </Row>
            </div>
            <Row>

              {/* Content */}
              <Col md={7} className='mb-md-0 mb-4'>
                <Badge bg='success' className='me-2 mb-3'>Verified</Badge>
                <Badge bg='info' className='me-2 mb-3'>New</Badge>

                {/* Price */}
                <h2 className='h3 mb-4 pb-4 border-bottom'>
                  $2,000
                  <span className='d-inline-block ms-1 fs-base fw-normal text-body'>/month</span>
                </h2>

                {/* Overview */}
                <div className='mb-4 pb-md-3'>
                  <h3 className='h4'>Overview</h3>
                  <p className='mb-1'>Lorem tincidunt lectus vitae id vulputate diam quam. Imperdiet non scelerisque turpis sed etiam ultrices. Blandit mollis dignissim egestas consectetur porttitor. Vulputate dolor pretium, dignissim eu augue sit ut convallis. Lectus est, magna urna feugiat sed ultricies sed in lacinia. Fusce potenti sit id pharetra vel ornare. Vestibulum sed tellus ullamcorper arcu.</p>
                  <Collapse in={overviewOpen}>
                    <div id='moreOverview'>
                      <p className='mb-1'>Asperiores eos molestias, aspernatur assumenda vel corporis ex, magni excepturi totam exercitationem quia inventore quod amet labore impedit quae distinctio? Officiis blanditiis consequatur alias, atque, sed est incidunt accusamus repudiandae tempora repellendus obcaecati delectus ducimus inventore tempore harum numquam autem eligendi culpa.</p>
                    </div>
                  </Collapse>
                  <a
                    href='#'
                    onClick={(e) => {
                      e.preventDefault()
                      setOverviewOpen(!overviewOpen)
                    }}
                    aria-controls='moreOverview'
                    aria-expanded={overviewOpen}
                    className={`collapse-label${overviewOpen ? '' : ' collapsed'}`}
                  >
                    {overviewOpen ? 'Show less' : 'Show more'}
                  </a>
                </div>

                {/* Property details list */}
                <div className='mb-4 pb-md-3'>
                  <h3 className='h4'>Property Details</h3>
                  <ul className='list-unstyled mb-0'>
                    <li><b>Type: </b>apartment</li>
                    <li><b>Apartment area: </b>56 sq.m</li>
                    <li><b>Built: </b>2015</li>
                    <li><b>Bedrooms: </b>4</li>
                    <li><b>Bathrooms: </b>2</li>
                    <li><b>Parking places: </b>2</li>
                    <li><b>Pets allowed: </b>cats only</li>
                  </ul>
                </div>

                {/* Amenities */}
                <div className='mb-sm-3'>
                  <h3 className='h4'>Amenities</h3>
                  <Row as='ul' xs={1} md={2} lg={3} className='list-unstyled gy-1 mb-1 text-nowrap'>
                    {amenitiesPreview[0].map(({icon, title}, indx) => (
                      <Col key={indx} as='li'>
                        <i className={`${icon} mt-n1 me-2 fs-lg align-middle`}></i>
                        {title}
                      </Col>
                    ))}
                  </Row>
                  <Collapse in={amenitiesOpen}>
                    <div id='moreAmenities'>
                      <Row as='ul' xs={1} md={2} lg={3} className='list-unstyled gy-1 mb-1 text-nowrap'>
                        {amenitiesPreview[1].map(({icon, title}, indx) => (
                          <Col key={indx} as='li'>
                            <i className={`${icon} mt-n1 me-2 fs-lg align-middle`}></i>
                            {title}
                          </Col>
                        ))}
                      </Row>
                    </div>
                  </Collapse>
                  <a
                    href='#'
                    onClick={(e) => {
                      e.preventDefault()
                      setAmenitiesOpen(!amenitiesOpen)
                    }}
                    aria-controls='moreAmenities'
                    aria-expanded={amenitiesOpen}
                    className={`collapse-label${amenitiesOpen ? '' : ' collapsed'}`}
                  >
                    {amenitiesOpen ? 'Show less' : 'Show more'}
                  </a>
                </div>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
      </Modal>

      
      {/* Page container */}
      <Container className='mt-5 mb-md-4 py-5'>
        <Row>
          {/* Page content */}
          <Col lg={8}>

            {/* Breadcrumb */}
            <Breadcrumb className='mb-3 pt-2 pt-lg-3'>
              <Link href='/tg' passHref>
                <Breadcrumb.Item>Home</Breadcrumb.Item>
              </Link>
              <Breadcrumb.Item active>Lancer un projet immobilier</Breadcrumb.Item>
            </Breadcrumb>

            {/* Title */}
            <div className='mb-4'>
              <h1 className='h2 mb-0'>Lancer un projet immobilier</h1>
              <div className='d-lg-none pt-3 mb-2'>65% content filled</div>
              <ProgressBar variant='warning' now={65} style={{height: '.25rem'}} className='d-lg-none mb-4' />
            </div>
            <Form noValidate validated={validated} name="project-form" method="POST" encType="multipart/form-data">
              {/* Property details */}
              <section id='details' className='card card-body border-0 shadow-sm p-4 mb-4'>
                <h2 className='h4 mb-4'>
                  <i className='fi-edit text-primary fs-5 mt-n1 me-2'></i>
                  Détails sur le projet immobilier
                </h2>

                <Row>
                  <Form.Group as={Col} sm={6} controlId='ap-country' className='mb-3'>
                      <Form.Label>Catégorie du projet immobilier<span className='text-danger'>*</span></Form.Label>
                      <Form.Select defaultValue='' required onChange={(value)=>{setCategorieProjet(value)}}>
                        <option value='' disabled>Quel type de projet immobilier</option>
                        <option value='Australia'>Suivi d'un chantier</option>
                        <option value='Belgium'>Construction d'une habitation</option>
                        <option value='Germany'>Construction d'un immeuble commercial</option>
                        <option value='Canada'>Construction d'un hotel</option>
                        <option value='US'>Location d'un logement</option>
                        <option value='US'>Achat d'un terrain rural</option>
                        <option value='US'>Achat d'un terrain urbain</option>
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        Préciser la catégorie du projet immobilier, svp
                      </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} sm={6} controlId='ap-city' className='mb-3'>
                      <Form.Label>Délai d'urgence <span className='text-danger'>*</span></Form.Label>
                      <Form.Select defaultValue='' required>
                        <option value='' disabled>Date de livraison au plus tard</option>
                        <option value='Chicago'>Chicago</option>
                        <option value='Dallas'>Dallas</option>
                        <option value='Los Angeles'>Los Angeles</option>
                        <option value='New York' >New York</option>
                        <option value='San Diego'>San Diego</option>
                      </Form.Select>
                      <Form.Control.Feedback type="invalid" tooltip>
                        Indiquez nous un délai d'urgence
                      </Form.Control.Feedback>
                  </Form.Group>       
                </Row>
                
                <Form.Group controlId='ap-description'>
                  <Form.Label>Description <span className='text-danger'>*</span></Form.Label>
                  <Form.Control as='textarea' rows={5} required placeholder='Décrire votre projet immobilier'/>
                  <Form.Text>1500 characters left</Form.Text>
                  <Form.Control.Feedback type="invalid" tooltip>
                SVP, décrivez légèrement votre projet immobilier
                </Form.Control.Feedback>
                </Form.Group>
              </section>
            {/* Photos / video */}
            <section id='photos' className='card card-body border-0 shadow-sm p-4 mb-4'>
              <h2 className='h4 mb-4'>
                <i className='fi-image text-primary fs-5 mt-n1 me-2'></i>
                Esquisses ou plan et copie des documents légaux
              </h2>
              <Alert variant='info' className='d-flex mb-4'>
                <i className='fi-alert-circle me-2 me-sm-3'></i>
                <p className='fs-sm mb-1'>The maximum photo size is 8 MB. Formats: jpeg, jpg, png. Put the main picture first.<br />
                The maximum video size is 10 MB. Formats: mp4, mov.</p>
              </Alert>
              <FilePond
              files={files}
              onupdatefiles={setFiles}
              allowMultiple={false}
              dropOnPage
              server={{
                process: {
                  url: `http://127.0.0.1:8000/graphql`,
                  ondata:()=>{
                    formData.append('operations', `{"query":"mutation($file:Upload!){Upload(file: $file)}"}`)
                    formData.append('map','{"0": ["variables.file"]}')
                    formData.append("0",files[0].file);
                    //console.log(files)
                    return formData;
                  }
                }
              }}
              
              name="files"
              dropValidation
              labelIdle='<div class="btn btn-primary mb-3"><i class="fi-cloud-upload me-1"></i>Upload photos / video</div><div>or drag them in</div>'
              //labelIdle={`<span class="filepond--label-action"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24" height="24" viewBox="0 0 24 24"><defs><path id="a" d="M24 24H0V0h24v24z"/></defs><clipPath id="b"><use xlink:href="#a" overflow="visible"/></clipPath><path clip-path="url(#b)" d="M3 4V1h2v3h3v2H5v3H3V6H0V4h3zm3 6V7h3V4h7l1.83 2H21c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V10h3zm7 9c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-3.2-5c0 1.77 1.43 3.2 3.2 3.2s3.2-1.43 3.2-3.2-1.43-3.2-3.2-3.2-3.2 1.43-3.2 3.2z"/></svg><span>Add an image</span></span>`}
              acceptedFileTypes={['image/png', 'image/jpeg', 'video/mp4', 'video/mov']}
              maxFileSize='2MB'
              className='file-uploader file-uploader-grid'
              />
              {/* <Form.Group className="position-relative mb-3">
                <Form.Control
                  type="file"
                  required
                  name="image"
                  onChange={uploadToClient}
                />
              </Form.Group> */}
             
            </section>

            
            {/* Contacts */}


            {/* Action buttons */}
            <section className='d-sm-flex justify-content-between pt-2'>
              <Button size='lg' variant='outline-primary d-block w-100 w-sm-auto mb-3 mb-sm-2' onClick={handlePreviewShow}>
                <i className='fi-eye-on ms-n1 me-2'></i>
                Apercu
              </Button>
              <Button size='lg' variant='primary d-block w-100 w-sm-auto mb-2' type="submit" onClick={uploadToServer}>Enregistrer et soumettre</Button>
              {/* <Button size='lg' variant='primary d-block w-100 w-sm-auto mb-2' type="submit" onClick={uploadToServer}>Enregistrer et soumettre</Button> */}
            </section>
            </Form>
            
          </Col>
        </Row>
      </Container>
    </RealEstatePageLayout>
  )
}

export async function getServerSideProps(context) {

  const session = await getSession(context);
  //const session = null;
  //console.log(session);
  if (!session) {
    //if not exists, return a temporary 302 and replace the url with the given in Location.
    context.res.writeHead(302, { Location: "/auth/signin" });
    context.res.end();

    //do not return any session.
    return { props: {} };
  }
  return {props:{session}};
}
export default AddProjectPage
