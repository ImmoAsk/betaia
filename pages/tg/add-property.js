import { useState, useEffect } from 'react'
import RealEstatePageLayout from '../../components/partials/RealEstatePageLayout'
import dynamic from 'next/dynamic'
import { useForm } from 'react-hook-form';
import Link from 'next/link'
import axios from 'axios'
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Breadcrumb from 'react-bootstrap/Breadcrumb'
import ProgressBar from 'react-bootstrap/ProgressBar'
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Form from 'react-bootstrap/Form'
import Alert from 'react-bootstrap/Alert'
import { getSession, useSession } from "next-auth/react";
import { FilePond, registerPlugin } from 'react-filepond'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import FilePondPluginImageCrop from 'filepond-plugin-image-crop'
import FilePondPluginImageResize from 'filepond-plugin-image-resize'
import FilePondPluginImageTransform from 'filepond-plugin-image-transform'
import Select from 'react-select';
var FormData = require('form-data');
var formData = new FormData();
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
import { useLandLord } from '../../customHooks/usePropertyOwner';
import { format } from 'path';
import { formatDistrictsOptions, formatPropertyOwners,formatRealEstateAgents, formatTownsOptions } from '../../utils/generalUtils';
import { API_URL } from '../../utils/settings';
import useListTowns from '../../customHooks/useListTowns';
import useListQuarters from '../../customHooks/useListQuarters';


const AddPropertyPage = () => {
  // State to store the user's location
  const [userLocation, setUserLocation] = useState([6.1611048, 1.1909014]); // Default location (Togo)

  // On component mount, get the user's geolocation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]); // Update state with user's location
        },
        (error) => {
          console.error('Error getting location:', error); // Handle error
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, []); // Runs only once on component mount

  // Preview modal
  const [previewShow, setPreviewShow] = useState(false);
  const handlePreviewClose = () => { setPreviewShow(false) };
  const handlePreviewShow = () => { setPreviewShow(true) }
  // Overview collapse state
  const [overviewOpen, setOverviewOpen] = useState(false);

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
    { to: 'basic-info', label: 'Informations basiques', completed: true },
    { to: 'location', label: 'Stuation géographique', completed: true },
    { to: 'details', label: 'Détails sur le bien immobilier', completed: true },
    { to: 'price', label: 'Tarification', completed: false },
    { to: 'photos', label: 'Photos / video', completed: false },
    { to: 'contacts', label: 'Conditions d\'accès', completed: true }
  ]


  // Amenities (checkboxes)
  const amenities = [
    { value: 'Wifi', checked: true },
    { value: 'Place pour les animaux', checked: false },
    { value: 'Lave-vaiselle', checked: false },
    { value: 'Ventilateur', checked: true },
    { value: 'Fer à repasser', checked: true },
    { value: 'Bar', checked: false },
    { value: 'Ascenseur', checked: false },
    { value: 'Seche cheveux', checked: true },
    { value: 'Télévision', checked: true },
    { value: 'Salle de gym', checked: false },
    { value: 'Tables à manger', checked: false },
    { value: 'Stationnement externe', checked: true },
    { value: 'Chauffage', checked: true },
    { value: 'Cameras de sécurités', checked: false }
  ]

  // Pets (checkboxes)
  const pets = [
    { value: 'Cats allowed', checked: false },
    { value: 'Dogs allowed', checked: false }
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

  const { data: session } = useSession();

  // State declarations
  const [imagesProperty, setImagesProperty] = useState([]);
  const [propertyCreatedNotification, setPropertyCreatedNotification] = useState(null);
  // Form values
  const [propertyData, setPropertyData] = useState({
    title: '',
    user_id: session?.user?.id || 1,
    type: 0,
    offer: 0,
    address: '',
    country: 228,
    town: '',
    quarter: 0,
    floor: 0,
    water: 0,
    electricity: 0,
    pool: 0,
    livingRooms: 0,
    bedRooms: 0,
    cautionGuarantee: 0,
    terraces: 0,
    balcony: 0,
    visitRight: 0,
    honorary: 0,
    monthPrice: 0,
    dayPrice: 0,
    buyPrice: 0,
    investmentPrice: 0,
    kitchen: 0,
    description: '',
    area: 10,
    garden: 0,
    security: 0,
    otherConditions: '',
    owner: 0,
    household: 0,
    furnished: 0,
    userRole: 1,
    inBathRooms: 0,
    outBathRooms: 0,
    parkings: 0,
    super_categorie: "logement"
  });

  // Form validation schema using Yup
  const validationSchema = Yup.object().shape({
    town: Yup.string().required('SVP indiquer la ville'),
    offer: Yup.string().required('SVP indiquer l\'offre immobilière'),
    address: Yup.string().required('SVP indiquer une adresse commune de sélection'),
    type: Yup.string().required('SVP choisir le type du bien immobilier'),
    quarter: Yup.string().required('SVP choisir un quartier'),
    user_id: Yup.string().required('Preciser le proprietaire'),
  });

  // Use Form options
  const formOptions = { resolver: yupResolver(validationSchema) };
  const { register, handleSubmit, setValue,formState } = useForm(formOptions);
  const { errors } = formState;
  const get_property_usage = () => {
    let usage = 0;

    switch (propertyData.offer) {
      case '1':
        if (propertyData.furnished === '1') {
          usage = 5;
        } else if (['8', '9', '10', '11', '12', '19', '20'].includes(propertyData.type)) {
          usage = 3;
        } else {
          usage = 1;
        }
        break;
      case '2':
        usage = 7;
        break;
      case '3':
        usage = 3;
        break;
      default:
        usage = 1;
    }
    return usage;
  };

  const updatePropertyData = (newUsage, newSuperCategorie) => {
    setPropertyData((prevData) => ({
      ...prevData, // Keep existing properties
      usage: newUsage, // Update usage
      super_categorie: newSuperCategorie, // Update super_categorie
    }));
  };
  const get_property_super_categorie = () => {
    let super_categorie = "";

    switch (propertyData.offer) {
      case '1':
        if (propertyData.furnished === '1') {
          super_categorie = "sejour";
        } else if (['8', '9', '11', '12', '19', '29', '30'].includes(propertyData.type)) {
          super_categorie = "commercial";
        } else {
          super_categorie = "logement";
        }
        break;
      case '2':
        super_categorie = "acquisition";
        break;
      case '3':
        super_categorie = "commercial";
        break;
      default:
        super_categorie = "logement";
    }

    return super_categorie;
  };
  const buildAppendMapFileUpload = (event) => {
    event.preventDefault();
    const formData = new FormData();
    const propertyUsage = get_property_usage(); // Get usage
    const propertySuperCategorie = get_property_super_categorie();
    updatePropertyData(propertyUsage, propertySuperCategorie);
    const propertyPayload = {
      descriptif: propertyData.description,
      piece: Number(propertyData.bedRooms),
      salon: Number(propertyData.livingRooms),
      titre: propertyData.title,
      pays_id: propertyData.country,
      papier_propriete: ' ',
      duree_minimale: '180',
      surface: Number(propertyData.area),
      cout_mensuel: Number(propertyData.monthPrice),
      cout_vente: Number(propertyData.buyPrice),
      nuitee: Number(propertyData.dayPrice),
      part_min_investissement: Number(propertyData.investmentPrice),
      usage: propertyUsage,
      garage: Number(propertyData.parkings),
      nuo: 4040,
      eau: Number(propertyData.water),
      electricite: Number(propertyData.electricity),
      categorie_id: Number(propertyData.type),
      user_id: Number(propertyData.user_id), // Static, should be dynamic if required session?.user?.id || 1,
      offre_id: Number(propertyData.offer),
      ville_id: Number(propertyData.town),
      quartier_id: Number(propertyData.quarter),
      adresse_id: propertyData.address,
      lat_long: `${userLocation}`, // Static, should be dynamic if required
      piscine: Number(propertyData.pool),
      gardien_securite: Number(propertyData.security),
      cuisine: Number(propertyData.kitchen),
      jardin: Number(propertyData.garden),
      menage: Number(propertyData.household),
      etage: Number(propertyData.floor),
      caution_avance: Number(propertyData.cautionGuarantee),
      honoraire: Number(propertyData.honorary),
      balcon: Number(propertyData.balcony),
      terrasse_balcon: Number(propertyData.terraces),
      cout_visite: Number(propertyData.visitRight),
      wc_douche_interne: `${propertyData.inBathRooms}` || "1",
      wc_douche_externe: `${propertyData.outBathRooms}` || "0",
      conditions_access: propertyData.otherConditions,
      est_present_bailleur: Number(propertyData.owner),
      super_categorie: propertySuperCategorie,
      est_meuble: Number(propertyData.furnished),
      url: null,
    };
    //console.log(propertyPayload);
    //alert(propertyPayload);
    formData.append(
      'operations',
      JSON.stringify({
        query: 'mutation AddPropertyImage($data: ProprieteInput!) { enrollProperty(input: $data) }',
        variables: { data: propertyPayload },
      })
    );

    let appendMap = '';
    imagesProperty.forEach((image, index) => {
      formData.append(`${index}`, image.file);
      appendMap += `"${index}":["variables.data.url.${index}"]`;
      if (index !== imagesProperty.length - 1) appendMap += ',';
    });

    formData.append('map', `{${appendMap}}`);

    axios
      .post(API_URL, formData)
      .then((response) => {
        console.log('Response:', response.data);
        if (response.data?.data?.enrollProperty) {
          setPropertyCreatedNotification("Le bien immobilier a été listé avec succès. Consultez votre portofolio immobilier pour détails.");
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  // Form submission handler
  const onSubmit = (data, event) => {
    const propertyUsage = get_property_usage(); // Get usage
    const propertySuperCategorie = get_property_super_categorie();
    updatePropertyData(propertyUsage, propertySuperCategorie);
    buildAppendMapFileUpload(event);
  };



  const handleChange = (e) => {
    const { name, value } = e.target;
    setPropertyData(prevData => ({
      ...prevData,
      [name]: value, // Update the specific property
    }));
    setValue(name, value);
  };

  const propertyTypeOptions = [
    { value: '', label: 'Selectionner le proprietaire' },
    { value: '1', label: 'Villa' },
    { value: '2', label: 'Appartement' },
    { value: '3', label: 'Maison' },
    { value: '4', label: 'Chambre (Pièce ou studio)' },
    { value: '5', label: 'Chambre salon' },
    { value: '6', label: 'Terrain rural' },
    { value: '7', label: 'Terrain urbain' },
    { value: '14', label: 'Boutique' },
    { value: '9', label: 'Bureau' },
    { value: '10', label: 'Appartement meublé' },
    { value: '11', label: 'Espace coworking' },
    { value: '12', label: 'Magasin' },
    { value: '14', label: 'Villa meublée' },
    { value: '15', label: 'Studio meublé' },
    { value: '16', label: 'Hotel' },
    { value: '17', label: 'Ecole' },
    { value: '18', label: 'Bar-restaurant' },
    { value: '19', label: 'Immeuble commercial' },
    { value: '29', label: 'Mur commercial' },
    { value: '30', label: 'Garage' },
    { value: '21', label: "Chambre d'hotel" },
    { value: '22', label: 'Immeuble' },
    { value: '31', label: 'Salle de Conference' },
  ];

  const propertyOfferOptions = [
    { value: '', label: 'Selectionner le proprietaire' },
    { value: '1', label: 'Mettre en location' },
    { value: '2', label: 'Mettre en vente' },
    { value: '3', label: 'Mettre en colocation' },
    { value: '4', label: 'Mettre en bail' },
    { value: '5', label: 'Mettre en investissement' }
  ];

  const propertyManagerOptions = [
    { value: `${session?.user?.id}`, label: 'Je suis le gestionnaire ou proprietaire' },
  ];
  
  const { status: villesStatus,data: villes } = useListTowns(228);
  const { status: quartiersStatus,data: quartiers} = useListQuarters(Number(propertyData?.town));

  const { status, data: landlords1230, error, isFetching, isLoading, isError } = useLandLord(1230);
  const { status: status1232, data: landlords1232, error: error1232, isFetching: isFetching1232, isLoading: isLoading1232, isError: isError1232 } = useLandLord(1232);
  const propertyOwners= formatPropertyOwners(landlords1230)
  const realEstateAgents= formatRealEstateAgents(landlords1232)
  const townList = formatTownsOptions(villes)
  const quarterList = formatDistrictsOptions(quartiers)
  const propertyOwnerOptions = [...new Set([...realEstateAgents, ...propertyOwners])];


  // Get the selected option value from propertyData
  const propertyOwnerSelectedOption = propertyOwnerOptions.find((option) => option.value === propertyData?.user_id);
  const propertyTypeSelectedOption = propertyTypeOptions.find((option) => option.value === propertyData?.type);
  const propertyOfferSelectedOption = propertyOfferOptions.find((option) => option.value === propertyData?.offer);

  const townSelectedOption = townList.find((option) => option.value === propertyData?.town);
  const quarterSelectedOption = quarterList.find((option) => option.value === propertyData?.quarter);
  return (
    <RealEstatePageLayout
      pageTitle='Lister un bien immobilier'
      activeNav='Vendor'
      userLoggedIn={session ? true : false}
    >
      {/* Preview modal */}

      {/* Page container */}
      <Container className='py-5 mt-5 mb-md-4'>
        <Row>
          {/* Page content */}
          <Col lg={8}>

            {/* Breadcrumb */}
            <Breadcrumb className='pt-2 mb-3 pt-lg-3'>
              <Link href='/tg' passHref>
                <Breadcrumb.Item>Accueil</Breadcrumb.Item>
              </Link>
              <Breadcrumb.Item active>Lister un bien immobilier</Breadcrumb.Item>
            </Breadcrumb>

            {/* Title */}
            <div className='mb-4'>
              <h1 className='mb-0 h2'>Lister un bien immobilier</h1>
              <div className='pt-3 mb-2 d-lg-none'>En progression...</div>
              <ProgressBar variant='warning' now={65} style={{ height: '.25rem' }} className='mb-4 d-lg-none' />
              {propertyCreatedNotification && (
                <Alert variant="success" className="d-flex mb-4">
                  <i className="fi-alert-circle me-2 me-sm-3"></i>
                  <p className="fs-sm mb-1">{propertyCreatedNotification}</p>
                </Alert>
              )}
            </div>

            <Form onSubmit={handleSubmit(onSubmit)}>
              {/* Basic info */}

              <section id='basic-info' className='p-4 mb-4 border-0 shadow-sm card card-body'>
                <h2 className='mb-4 h4'>
                  <i className='fi-info-circle text-primary fs-5 mt-n1 me-2'></i>
                  Commencons par des informations basiques
                </h2>
                {session && session.user && (session.user.roleId === '1200' || session.user.roleId === '1231') ? (
                  <Row>
                    <Form.Group as={Col} md={4} controlId="offer" className="mb-3">
                      <Form.Label className="pb-1 mb-2 d-block fw-bold">
                        Préciser l'offre <span className="text-danger">*</span>
                      </Form.Label>
                      <Select
                        {...register('offer')}
                        name="offer"
                        value={propertyOfferSelectedOption} // Pre-select based on propertyData
                        onChange={(selected) => handleChange({ target: { name: 'offer', value: selected?.value || '' } })}
                        options={propertyOfferOptions}
                        placeholder="Preciser l'offre"
                        className={`react-select-container ${errors.offer ? 'is-invalid' : ''}`}
                        classNamePrefix="react-select"
                      />
                      {errors.offer ? (
                        <Form.Control.Feedback type="invalid" tooltip>
                          {errors.offer.message}
                        </Form.Control.Feedback>
                      ) : (
                        <Form.Control.Feedback type="valid" tooltip>
                          L'offre immobilière est bien précisée
                        </Form.Control.Feedback>
                      )}
                    </Form.Group>
                    <Form.Group as={Col} md={4} controlId="type" className="mb-3">
                      <Form.Label className="pb-1 mb-2 d-block fw-bold">
                        Préciser le type<span className="text-danger">*</span>
                      </Form.Label>
                      <Select
                        {...register('type')}
                        name="type"
                        value={propertyTypeSelectedOption} // Pre-select based on propertyData
                        onChange={(selected) => handleChange({ target: { name: 'type', value: selected?.value || '' } })}
                        options={propertyTypeOptions}
                        placeholder="Preciser type"
                        className={`react-select-container ${errors.type ? 'is-invalid' : ''}`}
                        classNamePrefix="react-select"
                      />
                      {errors.type ? (
                        <Form.Control.Feedback type="invalid" tooltip>
                          {errors.type.message}
                        </Form.Control.Feedback>
                      ) : (
                        <Form.Control.Feedback type="valid" tooltip>
                          Le type immobilier est bien précisé
                        </Form.Control.Feedback>
                      )}
                    </Form.Group>
                    <Form.Group as={Col} md={4} controlId="user_id" className="mb-3">
                      <Form.Label className="pb-1 mb-2 d-block fw-bold">
                        Preciser le proprietaire <span className="text-danger">*</span>
                      </Form.Label>
                      <Select
                        {...register('user_id')}
                        name="user_id"
                        value={propertyOwnerSelectedOption} // Pre-select based on propertyData
                        onChange={(selected) => handleChange({ target: { name: 'user_id', value: selected?.value || '' } })}
                        options={propertyOwnerOptions}
                        placeholder="Preciser le proprietaire"
                        className={`react-select-container ${errors.user_id ? 'is-invalid' : ''}`}
                        classNamePrefix="react-select"
                      />
                      {errors.user_id ? (
                        <Form.Control.Feedback type="invalid" tooltip>
                          {errors.user_id.message}
                        </Form.Control.Feedback>
                      ) : (
                        <Form.Control.Feedback type="valid" tooltip>
                          Le proprietaire est bien précisé
                        </Form.Control.Feedback>
                      )}
                    </Form.Group>
                    <style jsx>{`
        .react-select-container {
  width: 100%;
}
.react-select__control {
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  min-height: calc(1.5em + 0.75rem + 2px);
  box-shadow: none;
}
.react-select__control--is-invalid {
  border-color: #dc3545;
}
.react-select__menu {
  z-index: 1050; /* Ensures dropdown is above other elements */
}
.invalid-feedback {
  display: block;
  font-size: 0.875em;
  color: #dc3545;
}
      `}</style>
                  </Row>
                ) : (
                  <Row>
                    <Form.Group as={Col} md={4} controlId="offer" className="mb-3">
                      <Form.Label className="pb-1 mb-2 d-block fw-bold">
                        Préciser l'offre <span className="text-danger">*</span>
                      </Form.Label>
                      <Select
                        {...register('offer')}
                        name="offer"
                        value={propertyOfferSelectedOption} // Pre-select based on propertyData
                        onChange={(selected) => handleChange({ target: { name: 'offer', value: selected?.value || '' } })}
                        options={propertyOfferOptions}
                        placeholder="Preciser l'offre"
                        className={`react-select-container ${errors.offer ? 'is-invalid' : ''}`}
                        classNamePrefix="react-select"
                      />
                      

                      {errors.offer ? (
                        <Form.Control.Feedback type="invalid" tooltip>
                          {errors.offer.message}
                        </Form.Control.Feedback>
                      ) : (
                        <Form.Control.Feedback type="valid" tooltip>
                          L'offre immobilière est bien précisée
                        </Form.Control.Feedback>
                      )}
                    </Form.Group>
                    <Form.Group as={Col} md={4} controlId="type" className="mb-3">
                      <Form.Label className="pb-1 mb-2 d-block fw-bold">
                        Préciser le type <span className="text-danger">*</span>
                      </Form.Label>
                      <Select
                        {...register('type')}
                        name="type"
                        value={propertyTypeSelectedOption} // Pre-select based on propertyData
                        onChange={(selected) => handleChange({ target: { name: 'type', value: selected?.value || '' } })}
                        options={propertyTypeOptions}
                        placeholder="Preciser type"
                        className={`react-select-container ${errors.type ? 'is-invalid' : ''}`}
                        classNamePrefix="react-select"
                      />

                      {errors.type ? (
                        <Form.Control.Feedback type="invalid" tooltip>
                          {errors.type.message}
                        </Form.Control.Feedback>
                      ) : (
                        <Form.Control.Feedback type="valid" tooltip>
                          Le type immobilier est bien précisé
                        </Form.Control.Feedback>
                      )}
                    </Form.Group>
                    <Form.Group as={Col} md={4} controlId="user_id" className="mb-3">
                      <Form.Label className="pb-1 mb-2 d-block fw-bold">
                        Preciser le proprietaire <span className="text-danger">*</span>
                      </Form.Label>
                      <Select
                        {...register('user_id')}
                        name="user_id"
                        value={propertyManagerOptions.find((option) => option.value === propertyData?.user_id)} // Pre-select based on propertyData
                        onChange={(selected) => handleChange({ target: { name: 'user_id', value: selected?.value || '' } })}
                        options={propertyManagerOptions}
                        className={`react-select-container ${errors.user_id ? 'is-invalid' : ''}`}
                        classNamePrefix="react-select"
                      />
                      {errors.user_id ? (
                        <Form.Control.Feedback type="invalid" tooltip>
                          {errors.user_id.message}
                        </Form.Control.Feedback>
                      ) : (
                        <Form.Control.Feedback type="valid" tooltip>
                          Le propriétaire est bien précisé
                        </Form.Control.Feedback>
                      )}
                    </Form.Group>
                  </Row>
                )}

                <h2 className='mb-4 h4'>
                  <i className='fi-image text-primary fs-5 mt-n1 me-2'></i>
                  Photos et vidéos du bien immobilier
                </h2>
                <Alert variant='info' className='mb-4 d-flex'>
                  <i className='fi-alert-circle me-2 me-sm-3'></i>
                  <p className='mb-1 fs-sm'>La taille maximale des images est 8M de formats: jpeg, jpg, png. L'image principale  d'abord.<br />
                    La taille max des videos est 10M de formats: mp4, mov.</p>
                </Alert>
                <FilePond
                  onupdatefiles={setImagesProperty}
                  allowMultiple={true}
                  dropOnPage
                  name="imagesProperty"
                  instantUpload={true}
                  maxFiles={20}
                  labelMaxFileSizeExceeded={"La taille maximale des fichiers est 10M"}
                  labelMaxTotalFileSizeExceeded={"Uniquement 20 fichiers"}
                  dropValidation
                  required={true}
                  labelIdle='<div class="btn btn-primary mb-3"><i class="fi-cloud-upload me-1"></i>Télécharger des photos ou vidéos</div>'
                  acceptedFileTypes={['image/png', 'image/jpeg', 'video/mp4', 'video/mov']}
                  className='file-uploader file-uploader-grid'
                />
              </section>


              {/* Location */}
              <section id='location' className='p-4 mb-4 border-0 shadow-sm card card-body'>
                <h2 className='mb-4 h4'>
                  <i className='fi-map-pin text-primary fs-5 mt-n1 me-2'></i>
                  Situation géographique du bien immobilier
                </h2>
                <Row>
                  <Form.Group as={Col} sm={4} controlId="town" className="mb-3">
                    <Form.Label className="pb-1 mb-2 d-block fw-bold">
                      Préciser la ville<span className="text-danger">*</span>
                    </Form.Label>

                    <Select
                        {...register('town')}
                        name="town"
                        value={townSelectedOption} // Pre-select based on propertyData
                        onChange={(selected) => handleChange({ target: { name: 'town', value: selected?.value || '' } })}
                        options={townList}
                        placeholder="Preciser la ville"
                        className={`react-select-container ${errors.offer ? 'is-invalid' : ''}`}
                        classNamePrefix="react-select"
                      />

                    {errors.town && (
                      <Form.Control.Feedback type="invalid" tooltip>
                        {errors.town?.message}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>

                  <Form.Group as={Col} sm={4} controlId="quarter" className="mb-3">
                    <Form.Label className="pb-1 mb-2 d-block fw-bold">
                      Préciser le quartier<span className="text-danger">*</span>
                    </Form.Label>

                    <Select
                        {...register('quarter')}
                        name="quarter"
                        value={quarterSelectedOption} // Pre-select based on propertyData
                        onChange={(selected) => handleChange({ target: { name: 'quarter', value: selected?.value || '' } })}
                        options={quarterList}
                        placeholder="Preciser le quartier"
                        className={`react-select-container ${errors.offer ? 'is-invalid' : ''}`}
                        classNamePrefix="react-select"
                      />

                    {errors.quarter && (
                      <Form.Control.Feedback type="invalid" tooltip>
                        {errors.quarter?.message}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>

                  <Form.Group as={Col} sm={4} controlId="address" className="mb-3">
                    <Form.Label className="pb-1 mb-2 d-block fw-bold">
                      Préciser l'adresse de référence <span className="text-danger">*</span>
                    </Form.Label>

                    <Form.Control
                      {...register('address')}
                      placeholder="Par exemple: Non loin de Omnisoft Africa"
                      name="address"
                      value={propertyData?.address}
                      onChange={handleChange}
                      className={`form-control ${errors.address ? 'is-invalid' : 'is-valid'}`}
                    />

                    {errors.address && (
                      <Form.Control.Feedback type="invalid" tooltip>
                        {errors.address?.message}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>

                </Row>
                <Form.Label className='pt-3 pb-2 fw-bold'>Localiser le bien immobilier sur la carte ci-dessous</Form.Label>
                <MapContainer
                  center={userLocation}
                  zoom={13}
                  scrollWheelZoom={true}
                  style={{ height: '250px' }}
                >
                  <TileLayer
                    url='https://api.maptiler.com/maps/pastel/{z}/{x}/{y}.png?key=BO4zZpr0fIIoydRTOLSx'
                    tileSize={512}
                    zoomOffset={-1}
                    minZoom={1}
                    attribution={'\u003ca href=\'https://www.maptiler.com/copyright/\' target=\'_blank\'\u003e\u0026copy; MapTiler\u003c/a\u003e \u003ca href=\'https://www.openstreetmap.org/copyright\' target=\'_blank\'\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e'}
                  />
                  <CustomMarker position={[6.1611048, 1.1909014]} icon='dot'>
                    <Popup>
                      <div className='p-3'>
                        <h6>Non loin de Oasis Zener Agoe 2 Lions</h6>
                        <p className='pt-1 mb-0 fs-xs text-muted mt-n3'>Non loin de Oasis Zener Agoe 2 Lions</p>
                      </div>
                    </Popup>
                  </CustomMarker>
                </MapContainer>
              </section>

              <section id='details' className='p-4 mb-4 border-0 shadow-sm card card-body'>
                <h2 className='mb-4 h4'>
                  <i className='fi-edit text-primary fs-5 mt-n1 me-2'></i>
                  Détails sur le bien immobilier
                </h2>

                <Row>
                  <Form.Group controlId='area' className='mb-4' as={Col} sm={4}>
                    <Form.Label className='pb-1 mb-2 d-block fw-bold'>Surface en m²</Form.Label>
                    <Form.Control {...register('area')}
                      type='number' defaultValue={56}
                      min={9}
                      placeholder='Surface en m²'
                      onChange={handleChange}
                      name="area"
                      value={propertyData?.area}
                      className={`form-control ${errors.area ? 'is-invalid' : 'is-valid'}`}
                    />
                    {errors.area && (
                      <Form.Control.Feedback type="invalid" tooltip>
                        {errors.area?.message}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>

                  <Form.Group className='mb-4' as={Col} sm={4} controlId='bedRooms'>
                    <Form.Label className='pb-1 mb-2 d-block fw-bold'>Chambres à coucher</Form.Label>
                    <Form.Control
                      {...register('bedRooms')}
                      type='number'
                      defaultValue={0}
                      min={0}
                      value={propertyData?.bedRooms}
                      placeholder='Nombre de chambres'
                      name='bedRooms'
                      onChange={handleChange}
                      className={`form-control ${errors.bedRooms ? 'is-invalid' : 'is-valid'}`}
                    />
                    {errors.bedRooms && (
                      <Form.Control.Feedback type="invalid" tooltip>
                        {errors.bedRooms?.message}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>
                  <Form.Group className='mb-4' as={Col} sm={4} controlId='livingRooms'>
                    <Form.Label className='pb-1 mb-2 d-block fw-bold'>Salons</Form.Label>
                    <Form.Control
                      {...register('livingRooms')}
                      type='number'
                      defaultValue={0}
                      value={propertyData?.livingRooms}
                      min={0}
                      placeholder='Nombre de salons'
                      name='livingRooms'
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Form.Group className='mb-4' as={Col} sm={4}>
                    <Form.Label className='pb-1 mb-2 d-block fw-bold'>Wc-douche internes</Form.Label>
                    <Form.Control
                      {...register('inBathRooms')}
                      type='number'
                      defaultValue={0}
                      min={0}
                      placeholder='Nbre de wc-douche internes'
                      value={propertyData?.inBathRooms}
                      name='inBathRooms'
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Form.Group className='mb-4' as={Col} sm={4}>
                    <Form.Label className='pb-1 mb-2 d-block fw-bold'>Wc-douche externe</Form.Label>
                    <Form.Control
                      {...register('outBathRooms')}
                      type='number'
                      defaultValue={0}
                      min={0}
                      value={propertyData?.outBathRooms}
                      placeholder='Nbre de wc-douche externes'
                      name='outBathRooms'
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Form.Group className='mb-4' as={Col} sm={4}>
                    <Form.Label className='pb-1 mb-2 d-block fw-bold'>Garage</Form.Label>
                    <ButtonGroup size='sm' >
                      <Form.Control
                        {...register('parkings')}
                        type='number'
                        defaultValue={0}
                        value={propertyData?.parkings}
                        min={0}
                        placeholder='Nbre de garages'
                        name='parkings'
                        onChange={handleChange}
                      />
                    </ButtonGroup>
                  </Form.Group>
                  <Form.Group as={Col} sm={3} controlId='ab-email' className='mb-3'>
                    <Form.Label className='pb-1 mb-2 d-block fw-bold'>Menages <span className='text-danger'>*</span></Form.Label>
                    <Form.Control
                      {...register('household')}
                      type='number'
                      min={0}
                      defaultValue='0'
                      value={propertyData?.household}
                      placeholder='Menages'
                      name='household'
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group as={Col} sm={3} controlId='floor' className='mb-3'>
                    <Form.Label className='pb-1 mb-2 d-block fw-bold'> Niveau d'étage </Form.Label>
                    <Form.Control {...register('floor')}
                      type='number'
                      defaultValue='0'
                      min={0}
                      placeholder='A quel enieme etage?'
                      value={propertyData.floor}
                      required
                      name='floor'
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Form.Group as={Col} md={3} controlId='ab-email' className='mb-3'>
                    <Form.Label className='pb-1 mb-2 d-block fw-bold'>Terrasses<span className='text-danger'>*</span></Form.Label>
                    <Form.Control
                      {...register('terraces')}
                      type='number'
                      min={0}
                      value={propertyData.terraces}
                      defaultValue='0'
                      name='terraces'
                      onChange={handleChange}
                      placeholder='Nombres de terrases'
                      required
                    />
                  </Form.Group>
                  <Form.Group as={Col} md={3} controlId='ab-email' className='mb-3'>
                    <Form.Label className='pb-1 mb-2 d-block fw-bold'>Balcons <span className='text-danger'>*</span></Form.Label>
                    <Form.Control
                      {...register('balcony')}
                      type='number'
                      name='balcony'
                      value={propertyData.balcony}
                      min={0}
                      defaultValue='0'
                      placeholder='Nombres de balcons'
                      required
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Form.Group as={Col} md={4} controlId='kitchen' className='mb-3'>
                    <Form.Label className='pb-1 mb-2 d-block fw-bold'>Cuisine <span className='text-danger'>*</span></Form.Label>
                    <Form.Select
                      {...register('kitchen')}
                      defaultValue='0'
                      name='kitchen'
                      value={propertyData.kitchen}
                      onChange={handleChange}>
                      <option value=''>Choisir le type de cuisine</option>
                      <option value='0'>Pas de cuisine</option>
                      <option value='1'>Cuisine interne normale</option>
                      <option value='2'>Cuisine américaine</option>
                      <option value='3'>Cuisine externe normale</option>
                      <option value='4'>Cuisine européeene</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group as={Col} md={4} controlId='water' className='mb-3'>
                    <Form.Label className='pb-1 mb-2 d-block fw-bold'>Eau <span className='text-danger'>*</span></Form.Label>
                    <Form.Select
                      {...register('water')}
                      defaultValue='0'
                      name='water'
                      value={propertyData.water}
                      onChange={handleChange}
                    >
                      <option value=''>Choisir le type d'eau</option>
                      <option value='0'>Pas d'eau à l'intérieur</option>
                      <option value='1'>TDE, Compteur personnel</option>
                      <option value='2'>TDE, Compteur commun</option>
                      <option value='3'>Forage, Compteur personnel</option>
                      <option value='4'>Forage, Compteur commun</option>
                    </Form.Select>
                  </Form.Group>
                  <Form.Group as={Col} md={4} controlId='electricity' className='mb-3'>
                    <Form.Label className='pb-1 mb-2 d-block fw-bold'>Electricité <span className='text-danger'>*</span></Form.Label>
                    <Form.Select
                      {...register('electricity')}
                      defaultValue='0'
                      name='electricity'
                      value={propertyData.electricity}
                      onChange={handleChange}>
                      <option value=''>Choisir le type d'electricité</option>
                      <option value='0'>Pas d'électricité</option>
                      <option value='1'>CEET, Compteur commun</option>
                      <option value='2'>CEET, Compteur personel</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group as={Col} sm={4} controlId='garden' className='mb-3'>
                    <Form.Label className='pb-1 mb-2 d-block fw-bold'>Jardin<span className='text-danger'>*</span></Form.Label>
                    <Form.Check
                      type='radio'
                      name='garden'
                      id='business'
                      value='1'
                      {...register('garden')}
                      label="Oui, il y a un jardin"
                      onChange={handleChange}
                    />
                    <Form.Check
                      type='radio'
                      name='garden'
                      id='private'
                      value='0'
                      {...register('garden')}
                      label="Non, il n'y a pas de jardin"
                      defaultChecked
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Form.Group as={Col} sm={4} controlId='pool' className='mb-3'>
                    <Form.Label className='pb-1 mb-2 d-block fw-bold'>Piscine<span className='text-danger'>*</span></Form.Label>
                    <Form.Check
                      type='radio'
                      name='pool'
                      id='pool'
                      value='1'
                      {...register('pool')}
                      label="Oui, il y a une piscine"
                      onChange={handleChange}
                    />
                    <Form.Check
                      type='radio'
                      name='pool'
                      id='pool'
                      value='0'
                      {...register('pool')}
                      label="Non, il n'y a pas de piscine"
                      defaultChecked
                      onChange={handleChange}
                    />
                  </Form.Group>

                </Row>
                <div className='pt-3 pb-2 form-label fw-bold'>Le bien immobilier est meublé?</div>
                <Form.Check
                  type='radio'
                  name='furnished'
                  id='business'
                  value='1'
                  {...register('furnished')}
                  label="Oui c'est meublé, et j'ajoute les meubles"
                  onChange={handleChange}
                />
                <Form.Check
                  type='radio'
                  name='furnished'
                  id='private'
                  value='0'
                  {...register('furnished')}
                  label="Non, ce n'est pas meublé"
                  defaultChecked
                  onChange={handleChange}
                />
                {propertyData.furnished == '1' && <>
                  <Form.Group className='mb-4'>
                    <Form.Label className='pb-1 mb-2 d-block fw-bold'>Meubles internes & externe</Form.Label>
                    <Row xs={1} sm={3}>
                      {amenities.map((amenity, indx) => (
                        <Col key={indx}>
                          <Form.Check
                            type='checkbox'
                            id={`amenities-${indx}`}
                            value={amenity.value}
                            label={amenity.value}
                            defaultChecked={amenity.checked}
                          />
                        </Col>
                      ))}
                    </Row>
                  </Form.Group>
                </>}

                <Form.Group controlId='description'>
                  <Form.Label className='pb-1 mb-2 d-block fw-bold'>Description</Form.Label>
                  <Form.Control
                    {...register('description')}
                    as='textarea'
                    rows={5}
                    placeholder='Decrire le bien immobilier'
                    name='description'
                    value={propertyData.description}
                    required
                    onChange={handleChange} />
                  <Form.Text>1000 caractères aumoins</Form.Text>
                </Form.Group>
              </section>

              <section id='price' className='p-4 mb-4 border-0 shadow-sm card card-body'>
                <h2 className='mb-4 h4'>
                  <i className='fi-cash text-primary fs-5 mt-n1 me-2'></i>
                  Preciser votre tarification immobilière
                </h2>

                {propertyData.offer == '1' && <>
                  <Form.Label htmlFor='monthPrice' className='pb-1 mb-2 d-block fw-bold'>
                    Loyer mensuel(si location)<span className='text-danger'>*</span>
                  </Form.Label>
                  <div className='d-sm-flex'>
                    <Form.Select className='mb-2 w-25 me-2'>
                      <option value='XOF'>FCFA</option>
                      <option value='GNS'>Franc Guinéén</option>
                    </Form.Select>
                    <Form.Control
                      id='monthPrice'
                      type='number'
                      name='monthPrice'
                      {...register('monthPrice')}
                      min={5000}
                      value={propertyData.monthPrice}
                      onChange={handleChange}
                      className='mb-2 w-50 me-2'
                    />
                  </div>
                </>}

                {propertyData.furnished == '1' && <>
                  <Form.Label htmlFor='dayPrice' className='pb-1 mb-2 d-block fw-bold'>
                    Nuitée(Par jour)<span className='text-danger'>*</span>
                  </Form.Label>
                  <div className='d-sm-flex'>
                    <Form.Select className='mb-2 w-25 me-2'>
                      <option value='XOF'>FCFA</option>
                      <option value='GNS'>Franc Guinéén</option>
                    </Form.Select>
                    <Form.Control
                      id='dayPrice'
                      type='number'
                      name='dayPrice'
                      {...register('dayPrice')}
                      onChange={handleChange}
                      min={5000}
                      value={propertyData.dayPrice}
                      className='mb-2 w-50 me-2'
                      required
                    />

                  </div>
                </>}


                {propertyData.offer == '2' && <>
                  <Form.Label htmlFor='buyPrice' className='pb-1 mb-2 d-block fw-bold'>
                    Prix d'achat <span className='text-danger'>*</span>
                  </Form.Label>
                  <div className='d-sm-flex'>
                    <Form.Select className='mb-2 w-25 me-2'>
                      <option value='XOF'>FCFA</option>
                      <option value='GNS'>Franc Guinéén</option>
                    </Form.Select>
                    <Form.Control
                      id='buyPrice'
                      type='number'
                      name='buyPrice'
                      {...register('buyPrice')}
                      value={propertyData.buyPrice}
                      className='mb-2 w-50 me-2'
                      onChange={handleChange}
                      required
                    />
                  </div>
                </>}
              </section>


              <section id='contacts' className='p-4 mb-4 border-0 shadow-sm card card-body'>
                <h2 className='mb-4 h4'>
                  <i className='fi-phone text-primary fs-5 mt-n1 me-2'></i>
                  Conditions d'accès
                </h2>
                <Row>
                  <Form.Group as={Col} sm={4} controlId='cautionGuarantee' className='mb-3'>
                    <Form.Label className='pb-1 mb-2 d-block fw-bold'>Caution & Avances <span className='text-danger'>*</span></Form.Label>
                    <Form.Control
                      type='number'
                      defaultValue='6' placeholder='Nombre de cautions plus Avances'
                      required
                      {...register('cautionGuarantee')}
                      value={propertyData.cautionGuarantee}
                      name='cautionGuarantee'
                      min={0}
                      onChange={handleChange} />
                  </Form.Group>
                  <Form.Group as={Col} sm={4} controlId='ab-sn' className='mb-3'>
                    <Form.Label className='pb-1 mb-2 d-block fw-bold'>Droit de visite immobilière <span className='text-danger'>*</span></Form.Label>
                    <Form.Control type='number'
                      defaultValue='2000'
                      {...register('visitRight')}
                      placeholder='Montant du droit de visite'
                      value={propertyData.visitRight}
                      required
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group as={Col} sm={4} controlId='ab-email' className='mb-3'>
                    <Form.Label className='pb-1 mb-2 d-block fw-bold'>Honoraires <span className='text-danger'>*</span></Form.Label>
                    <Form.Control
                      type='number'
                      defaultValue='1'
                      placeholder='Honoraire'
                      value={propertyData.honorary}
                      required {...register('honorary')}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group as={Col} sm={4} controlId='ab-email' className='mb-3'>
                    <Form.Label className='pb-1 mb-2 d-block fw-bold'>Gardien de sécurité <span className='text-danger'>*</span></Form.Label>
                    <Form.Check
                      type='radio'
                      name='security'
                      id='business'
                      value='1'
                      {...register('security')}
                      label="Oui, il ya un gardien de sécurité"
                      onChange={handleChange}
                    />
                    <Form.Check
                      type='radio'
                      name='security'
                      id='private'
                      value='0'
                      label="Non, pas de gardien de securite"
                      {...register('security')}
                      defaultChecked
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group as={Col} sm={6} controlId='ab-email' className='mb-3'>
                    <Form.Label className='pb-1 mb-2 d-block fw-bold'>Présence du bailleur <span className='text-danger'>*</span></Form.Label>
                    <Form.Check
                      type='radio'
                      name='owner'
                      id='business'
                      value='1'
                      {...register('owner')}
                      label="Oui, le bailleur est l'interieur avec les locataire"
                      onChange={handleChange}
                    />
                    <Form.Check
                      type='radio'
                      name='owner'
                      id='private'
                      value='0'
                      label="Non, le bailleur est à l'exterieur"
                      defaultChecked
                      {...register('owner')}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Form.Group as={Col} sm={12} controlId='ab-email' className='mb-3'>
                    <Form.Label className='pb-1 mb-2 d-block fw-bold'>Autres conditions d'accès <span className='text-danger'>*</span></Form.Label>
                    <Form.Control as='textarea' {...register('otherConditions')} rows={5} defaultValue='' placeholder='Par exemple: Pas de célibataires' />
                  </Form.Group>

                </Row>
              </section>

              <Form.Control
                type="hidden"
                {...register('super_categorie')}
                name="super_categorie"
                value={propertyData.super_categorie}
              />
              <Form.Control
                type="hidden"
                {...register('usage')}
                name="usage"
                value={propertyData.usage}
              />
              {propertyCreatedNotification && (
                <Alert variant="success" className="d-flex mb-4">
                  <i className="fi-alert-circle me-2 me-sm-3"></i>
                  <p className="fs-sm mb-1">{propertyCreatedNotification}</p>
                </Alert>
              )}
              {/* Action buttons */}
              <section className='pt-2 d-sm-flex justify-content-between'>
                <Button size='lg' variant='primary d-block w-100 w-sm-auto mb-2' type='submit'>Enregistrer et Continuer</Button>

              </section>
            </Form>

          </Col>
          {/* Sidebar (Progress of completion) */}
          <Col lg={{ span: 3, offset: 1 }} className='d-none d-lg-block'>
            <div className='pt-5 sticky-top'>
              {/* <h6 className='pt-5 mt-3 mb-2'>65% content filled</h6>
              <ProgressBar variant='warning' now={65} style={{ height: '.25rem' }} className='mb-4' />
              <ul className='list-unstyled'>
                {anchors.map((anchor, indx) => (
                  <li key={indx} className='d-flex align-items-center'>
                    <i className={`fi-check text-${anchor.completed ? 'primary' : 'muted'} me-2`}></i>
                    <ScrollLink to={anchor.to} smooth='easeInOutQuart' duration={600} offset={-95} className='p-0 nav-link fw-normal ps-1'>
                      {anchor.label}
                    </ScrollLink>
                  </li>
                ))}
              </ul> */}
            </div>
          </Col>
        </Row>
      </Container>
    </RealEstatePageLayout>
  )
}


export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      }
    }
  } else {
    return { props: { session } };
  }
}
export default AddPropertyPage
