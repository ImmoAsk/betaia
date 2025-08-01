import { useState } from 'react'
import RealEstatePageLayout from '../partials/RealEstatePageLayout'
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
import ToggleButton from 'react-bootstrap/ToggleButton'
import Form from 'react-bootstrap/Form'
import { getSession, useSession } from "next-auth/react";
import { FilePond, registerPlugin } from 'react-filepond'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import FilePondPluginImageCrop from 'filepond-plugin-image-crop'
import FilePondPluginImageResize from 'filepond-plugin-image-resize'
import FilePondPluginImageTransform from 'filepond-plugin-image-transform'
//import NumberFormat from 'react-number-format'
import TownList from './TownList';
import QuarterList from './QuarterList';
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
    import('../partials/CustomMarker'),
    { ssr: false }
)
import 'leaflet/dist/leaflet.css'


const EditProperty = ({ propriete }) => {

    console.log(propriete);
    // Number of bedrooms radios buttons
    const [InsideBathRoomsValue, setInsideBathRooms] = useState('2')
    const Inbathrooms = [
        { name: '1', value: '1' },
        { name: '2', value: '2' },
        { name: '3', value: '3' },
        { name: '4', value: '4' },
        { name: '5', value: '5' },
        { name: '6', value: '6' }
    ]

    // Number of bathrooms radios buttons
    const [OutsideBathRoomsValue, setOutsideBathRooms] = useState('2')
    const outBathrooms = [
        { name: '0', value: '0' },
        { name: '1', value: '1' },
        { name: '2', value: '2' },
        { name: '3', value: '3' },
        { name: '4', value: '4' }
    ]

    // Number of bathrooms radios buttons
    const [parkingsValue, setParkingsValue] = useState('2')
    const parkings = [
        { name: '0', value: '0' },
        { name: '1', value: '1' },
        { name: '2', value: '2' },
        { name: '3', value: '3' },
        { name: '4', value: '4' }
    ]



    // Amenities (checkboxes)
    const amenities = [
        { value: 'Wifi', checked: true },
        { value: 'Place pour les animaux', checked: false },
        { value: 'Lave-vaiselle', checked: false },
        { value: 'Ventilateur', checked: true },
        { value: 'Fer à repasser', checked: true },
        { value: 'Bar', checked: false },
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

    // Gallery state
    const [gallery, setGallery] = useState([]);
    const [quartersList, setQuartersList] = useState([]);
    const [isFurnished, setIsFurnished] = useState(propriete.est_meuble);
    const [propertyTitle, setPropertyTitle] = useState(propriete.titre);
    const [propertyOwner, setPropertyOwner] = useState(session ? session.user.id : 0);
    const [propertyType, setPropertyType] = useState(propriete.categorie_propriete && propriete.categorie_propriete.id);
    const [propertyHouseHold, setPropertyHouseHold] = useState(0);

    //1 is realestate agent, 2 is realestate owner
    const [propertyUserRole, setpropertyUserRole] = useState(1);
    const [propertyOffer, setPropertyOffer] = useState(propriete.offre && propriete.offre.id);
    const [propertySecurity, setPropertySecurity] = useState(0);
    const [propertyCountry, setPropertyCountry] = useState(228);
    const [propertyTown, setPropertyTown] = useState('1');
    const [propertyQuarter, setPropertyQuarter] = useState(0);
    //const [propertyAdress, setPropertyAdress] = useState("");
    const [propertyFloor, setPropertyFloor] = useState(0);
    const [propertyWater, setPropertyWater] = useState(0);
    const [propertyElectricity, setPropertyElectricity] = useState(0);
    const [propertyPool, setPropertyPool] = useState(0);
    const [propertyLivingRooms, setPropertyLivingRooms] = useState(0);
    const [propertyBedRooms, setPropertyBedRooms] = useState(0);
    const [propertyCautionGuarantee, setCautionGuarantee] = useState(0);

    const [propertyTerraces, setPropertyTerraces] = useState('0');
    const [propertyBalcony, setPropertyBalcony] = useState('0');
    const [propertyVisitRight, setVisitRight] = useState(0);
    const [propertyHonorary, setPropertyHonorary] = useState(0);
    const [propertyMonthPrice, setPropertyMonthPrice] = useState(0);
    const [propertyDayPrice, setPropertyDayPrice] = useState(0);
    const [propertyInvestmentPrice, setPropertyInvestmentPrice] = useState(0);
    const [propertyKitchen, setPropertyKitchen] = useState(0);
    const [propertyBuyPrice, setPropertyBuyPrice] = useState(0);
    const [propertyDescription, setPropertyDescription] = useState(" ");
    const [propertyArea, setPropertyArea] = useState(10);
    const [propertyGarden, setPropertyGarden] = useState(0);
    const [imagesProperty, setImagesProperty] = useState([]);
    const { data: session } = useSession();

    const validationSchema = Yup.object().shape({
        propertyTown: Yup.string()
            .required('Préciser la ville svp'),
        propertyOffer: Yup.string()
            .required('Preciser l\'offre immobilière svp'),
        propertyType: Yup.string()
            .required('Selectionner le type du bien immobilier'),
        propertyQuarter: Yup.string()
            .required('Selectionner le quartier')

    });
    const formOptions = { resolver: yupResolver(validationSchema) };
    const { register, handleSubmit, reset, formState } = useForm(formOptions);
    const { errors } = formState;


    const buildAppendMapFileUpload = (event) => {
        event.stopPropagation();
        event.preventDefault();

        var _formData = `{descriptif:"${propertyDescription}",id:${Number(propriete.id)},piece:${Number(propertyBedRooms)},salon:${Number(propertyLivingRooms)},surface:${Number(propertyArea)},cout_mensuel:${Number(propertyMonthPrice)},cout_vente:${Number(propertyBuyPrice)},part_min_investissement:${Number(propertyInvestmentPrice)},garage:${Number(parkingsValue)},nuo:${propriete.nuo},eau:${Number(propertyWater)},electricite:${Number(propertyElectricity)},categorie_id:${Number(propertyType)},offre_id:${Number(propertyOffer)},ville_id:${Number(propertyTown)},quartier_id:${Number(propertyQuarter)},lat_long:"6.12564358,1.1568922",piscine:${Number(propertyPool)},gardien_securite:${Number(propertySecurity)},cuisine:${Number(propertyKitchen)},jardin:${Number(propertyGarden)},menage:${Number(propertyHouseHold)},etage:${Number(propertyFloor)},caution_avance:${Number(propertyCautionGuarantee)},honoraire:${Number(propertyHonorary)},balcon:${Number(propertyBalcony)},terrasse_balcon:${Number(propertyTerraces)},cout_visite:${Number(propertyVisitRight)},wc_douche_interne:${Number(InsideBathRoomsValue)},wc_douche_externe:${Number(OutsideBathRoomsValue)}}`
        alert(JSON.stringify(_formData));
        var updatedData = JSON.stringify({ query: `mutation{updatePropriete(input:${_formData}){descriptif}}`, variables: {} });
        var config = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            url: 'https://immoaskbetaapi.omnisoft.africa/public/api/v2',
            data: updatedData
        };

        axios.request(config)
            .then((response) => {
                console.log(JSON.stringify(JSON.parse(response.data)));
            })
            .catch((error) => {
                console.log(error);
            });

    }


    const onSubmit = (data, event) => {
        buildAppendMapFileUpload(event);
    }
    return (

        <Form onSubmit={handleSubmit(onSubmit)}>
            {/* Basic info */}
            <section id='basic-info' className='p-4 mb-4 border-0 shadow-sm card card-body'>
                <h2 className='mb-4 h4'>
                    <i className='fi-info-circle text-primary fs-5 mt-n1 me-2'></i>
                    Commencons par des informations basiques {propriete.nuo}
                </h2>
                <Row>
                    <Form.Group as={Col} md={6} controlId='propertyType' className='mb-3'>
                        <Form.Label className='pb-1 mb-2 d-block fw-bold'>Préciser le type de bien immobilier <span className='text-danger'>*</span></Form.Label>
                        <Form.Select {...register('propertyType')} name='propertyType' onChange={(e) => setPropertyType(e.target.value)} className={`form-control ${errors.propertyType ? 'is-invalid' : ''}`}>
                            <option defaultValue={propriete.categorie_propriete && propriete.categorie_propriete.id} value={propriete.categorie_propriete && propriete.categorie_propriete.id}>{propriete.categorie_propriete && propriete.categorie_propriete.denomination}</option>
                            <option value='1'>Villa</option>
                            <option value='2'>Appartement</option>
                            <option value='3'>Maison</option>
                            <option value='4'>Chambre(Pièce ou studio)</option>
                            <option value='5'>Chambre salon</option>
                            <option value='6'>Terrain rural</option>
                            <option value='7'>Terrain urbain</option>
                            <option value='8'>2 chambres salon</option>
                            <option value='9'>Bureau</option>
                            <option value='10'>Appartement meublé</option>
                            <option value='11'>3 chambres salon</option>
                            <option value='12'>Magasin</option>
                            <option value='13'>Terrain</option>
                            <option value='14'>Boutique</option>
                            <option value='15'>Studio</option>
                            <option value='17'>Studio meublé</option>
                            <option value='18'>Immeuble</option>
                            <option value='19'>Immeuble commercial</option>
                            <option value='20'>Espace coworking</option>
                            <option value='21'>Villa luxueuse</option>
                            <option value='22'>Appartement luxueux</option>
                            <option value='23'>Villa meublée</option>
                            <option value='24'>Bureau meublé</option>
                            <option value='25'>Hotel</option>
                            <option value='26'>Ecole</option>
                            <option value='27'>Chambre d'hotel</option>
                            <option value='28'>Bar-restaurant</option>
                            <option value='29'>Espace commercial</option>
                            <option value='30'>Garage</option>
                        </Form.Select>
                        <Form.Control.Feedback type="invalid" tooltip>
                            {errors.propertyType?.message}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md={6} controlId='propertyOffer' className='mb-3'>
                        <Form.Label className='pb-1 mb-2 d-block fw-bold'>Préciser l'offre que vous proposez <span className='text-danger'>*</span></Form.Label>
                        <Form.Select {...register('propertyOffer')} name='propertyOffer' onChange={e => setPropertyOffer(e.target.value)} className={`form-control ${errors.propertyOffer ? 'is-invalid' : ''}`}>
                            <option value={propriete.offre && propriete.offre.id}>A {propriete.offre && propriete.offre.denomination}</option>
                            <option value='1'>Mettre en location</option>
                            <option value='2'>Mettre en vente</option>
                            <option value='4'>Mettre en bail</option>
                            <option value='3'>Mettre en investissement</option>
                        </Form.Select>
                        <Form.Control.Feedback type="invalid" tooltip>
                            {errors.propertyOffer?.message}
                        </Form.Control.Feedback>
                        <Form.Control.Feedback type="valid" tooltip>L'offre immobilière est bien précisée</Form.Control.Feedback>
                    </Form.Group>

                </Row>
            </section>


            {/* Location */}
            <section id='location' className='p-4 mb-4 border-0 shadow-sm card card-body'>
                <h2 className='mb-4 h4'>
                    <i className='fi-map-pin text-primary fs-5 mt-n1 me-2'></i>
                    Situation géographique du bien immobilier
                </h2>
                <Row>
                    <Form.Group as={Col} sm={6} controlId='ap-city' className='mb-3'>
                        <Form.Label className='pb-1 mb-2 d-block fw-bold'>Préciser la ville<span className='text-danger'>*</span></Form.Label>
                        <Form.Select {...register('propertyTown')} name='propertyTown' onChange={(e) => setPropertyTown(e.target.value)} className={`form-control ${errors.propertyTown ? 'is-invalid' : 'success'}`}>
                            <option value={propriete.ville && propriete.ville.id}>{propriete.ville && propriete.ville.denomination}</option>
                            <TownList country_code={228} />
                        </Form.Select>
                    </Form.Group>
                    <Form.Group as={Col} sm={6} controlId='propertyQuarter' className='mb-3'>
                        <Form.Label className='pb-1 mb-2 d-block fw-bold'>Preciser le quartier <span className='text-danger'>*</span></Form.Label>
                        <Form.Select {...register('propertyQuarter')} defaultValue='' name='propertyQuarter' onChange={(e) => setPropertyQuarter(e.target.value)} className={`form-control ${errors.propertyQuarter ? 'is-invalid' : ''}`}>
                            <option value={propriete.quartier && propriete.quartier.id}>{propriete.quartier && propriete.quartier.denomination}</option>
                            <QuarterList town_code={Number(propertyTown)} />
                        </Form.Select>
                    </Form.Group>
                </Row>
                <Form.Label className='pt-3 pb-2 fw-bold'>Localiser le bien immobilier sur la carte ci-dessous</Form.Label>
                <MapContainer
                    center={[6.1611048, 1.1909014]}
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


            {/* Property details */}
            <section id='details' className='p-4 mb-4 border-0 shadow-sm card card-body'>
                <h2 className='mb-4 h4'>
                    <i className='fi-edit text-primary fs-5 mt-n1 me-2'></i>
                    Détails sur le bien immobilier
                </h2>
                <Row>
                    <Form.Group controlId='propertyArea' className='mb-4' as={Col} sm={4}>
                        <Form.Label className='pb-1 mb-2 d-block fw-bold'>Surface en m²</Form.Label>
                        <Form.Control {...register('propertyArea')} type='number' defaultValue={propriete.surface} min={9} placeholder='Surface en m²' onChange={(e) => setPropertyArea(e.target.value)} />
                    </Form.Group>
                    <Form.Group className='mb-4' as={Col} sm={4}>
                        <Form.Label className='pb-1 mb-2 d-block fw-bold'>Chambres à coucher</Form.Label>
                        <Form.Control {...register('propertyBedRooms')} type='number' defaultValue={propriete.piece} min={0} placeholder='propertyBedRooms' onChange={(e) => setPropertyBedRooms(e.target.value)} />
                    </Form.Group>
                    <Form.Group className='mb-4' as={Col} sm={4}>
                        <Form.Label className='pb-1 mb-2 d-block fw-bold'>Salons</Form.Label>
                        <Form.Control {...register('propertyLivingRooms')} type='number' defaultValue={propriete.salon} min={0} placeholder='Nombre de salons' name='propertyLivingRooms' onChange={(e) => setPropertyLivingRooms(e.target.value)} />
                    </Form.Group>
                    <Form.Group className='mb-4' as={Col} sm={4}>
                        <Form.Label className='pb-1 mb-2 d-block fw-bold'>Wc-douche internes</Form.Label>
                        <ButtonGroup size='sm'>
                            {Inbathrooms.map((bathroom, indx) => (
                                <ToggleButton
                                    key={indx}
                                    type='radio'
                                    id={`inbathrooms-${indx}`}
                                    name='Inbathrooms'
                                    {...register('InsideBathRooms')}
                                    value={bathroom.value}
                                    checked={InsideBathRoomsValue === bathroom.value}
                                    onChange={(e) => setInsideBathRooms(e.currentTarget.value)}
                                    variant='outline-secondary fw-normal'
                                >{bathroom.name}</ToggleButton>
                            ))}
                        </ButtonGroup>
                    </Form.Group>
                    <Form.Group className='mb-4' as={Col} sm={4}>
                        <Form.Label className='pb-1 mb-2 d-block fw-bold'>Wc-douche externe</Form.Label>
                        <ButtonGroup size='sm'>
                            {outBathrooms.map((bathroom, indx) => (
                                <ToggleButton
                                    key={indx}
                                    type='radio'
                                    id={`outbathrooms-${indx}`}
                                    name='outbathrooms'
                                    {...register('OutsideBathRooms')}
                                    value={bathroom.value}
                                    checked={OutsideBathRoomsValue === bathroom.value}
                                    onChange={(e) => setOutsideBathRooms(e.currentTarget.value)}
                                    variant='outline-secondary fw-normal'
                                >{bathroom.name}</ToggleButton>
                            ))}
                        </ButtonGroup>
                    </Form.Group>
                    <Form.Group className='mb-4' as={Col} sm={4}>
                        <Form.Label className='pb-1 mb-2 d-block fw-bold'>Garage</Form.Label>
                        <ButtonGroup size='sm' >
                            {parkings.map((parking, indx) => (
                                <ToggleButton
                                    key={indx}
                                    type='radio'
                                    id={`parkings-${indx}`}
                                    name='parkings'
                                    {...register('propertyGarage')}
                                    value={parking.value}
                                    checked={parkingsValue === parking.value}
                                    onChange={(e) => setParkingsValue(e.currentTarget.value)}
                                    variant='outline-secondary fw-normal'
                                >{parking.name}</ToggleButton>
                            ))}
                        </ButtonGroup>
                    </Form.Group>
                    <Form.Group as={Col} sm={3} controlId='ab-email' className='mb-3'>
                        <Form.Label className='pb-1 mb-2 d-block fw-bold'>Menages <span className='text-danger'>*</span></Form.Label>
                        <Form.Control {...register('propertyHouseHold')} type='number' min={0} defaultValue='0' placeholder='Honoraire' required onChange={(e) => setPropertyHouseHold(e.currentTarget.value)} />
                    </Form.Group>
                    <Form.Group as={Col} sm={3} controlId='propertyFloor' className='mb-3'>
                        <Form.Label className='pb-1 mb-2 d-block fw-bold'> Niveau d'étage </Form.Label>
                        <Form.Control {...register('propertyFloor')} type='number' defaultValue='0' min={0} placeholder='A quel enieme etage?' required onChange={(e) => setPropertyFloor(e.target.value)} />
                    </Form.Group>
                    <Form.Group as={Col} md={3} controlId='ab-email' className='mb-3'>
                        <Form.Label className='pb-1 mb-2 d-block fw-bold'>Terrasses<span className='text-danger'>*</span></Form.Label>
                        <Form.Control {...register('propertyTerraces')} type='number' min={0} defaultValue='0' placeholder='Nombres de terrases' required onChange={(e) => setPropertyTerraces(e.currentTarget.value)} />
                    </Form.Group>
                    <Form.Group as={Col} md={3} controlId='ab-email' className='mb-3'>
                        <Form.Label className='pb-1 mb-2 d-block fw-bold'>Balcons <span className='text-danger'>*</span></Form.Label>
                        <Form.Control {...register('propertyBalcony')} type='number' min={0} defaultValue='0' placeholder='Nombres de balcons' required onChange={(e) => setPropertyBalcony(e.currentTarget.value)} />
                    </Form.Group>
                    <Form.Group as={Col} md={4} controlId='propertyKitchen' className='mb-3'>
                        <Form.Label className='pb-1 mb-2 d-block fw-bold'>Cuisine <span className='text-danger'>*</span></Form.Label>
                        <Form.Select {...register('propertyKitchen')} defaultValue='rent' name='propertyKitchen' onChange={e => setPropertyKitchen(e.target.value)}>
                            <option value=''>Choisir le type de cuisine</option>
                            <option value='0'>Pas de cuisine</option>
                            <option value='1'>Cuisine interne normale</option>
                            <option value='2'>Cuisine américaine</option>
                            <option value='3'>Cuisine externe normale</option>
                            <option value='4'>Cuisine européeene</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group as={Col} md={4} controlId='propertyWater' className='mb-3'>
                        <Form.Label className='pb-1 mb-2 d-block fw-bold'>Eau <span className='text-danger'>*</span></Form.Label>
                        <Form.Select {...register('propertyWater')} defaultValue='rent' name='propertyWater' onChange={e => setPropertyWater(e.target.value)}>
                            <option value=''>Choisir le type d'eau</option>
                            <option value='0'>Pas d'eau à l'intérieur</option>
                            <option value='1'>TDE, Compteur personnel</option>
                            <option value='2'>TDE, Compteur commun</option>
                            <option value='3'>Forage, Compteur personnel</option>
                            <option value='4'>Forage, Compteur commun</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group as={Col} md={4} controlId='propertyElectricity' className='mb-3'>
                        <Form.Label className='pb-1 mb-2 d-block fw-bold'>Electricité <span className='text-danger'>*</span></Form.Label>
                        <Form.Select {...register('propertyElectricity')} defaultValue='rent' name='propertyElectricity' onChange={e => setPropertyElectricity(e.target.value)}>
                            <option value=''>Choisir le type d'electricité</option>
                            <option value='0'>Pas d'électricité</option>
                            <option value='1'>CEET, Compteur commun</option>
                            <option value='2'>CEET, Compteur personel</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group as={Col} sm={4} controlId='ab-email' className='mb-3'>
                        <Form.Label className='pb-1 mb-2 d-block fw-bold'>Jardin<span className='text-danger'>*</span></Form.Label>
                        <Form.Check
                            type='radio'
                            name='propertyGarden'
                            id='business'
                            value='1'
                            {...register('propertyGarden')}
                            label="Oui, il y a un jardin"
                            onChange={(e) => setPropertyGarden(e.target.value)}
                        />
                        <Form.Check
                            type='radio'
                            name='propertyGarden'
                            id='private'
                            value='0'
                            {...register('propertyGarden')}
                            label="Non, il n'y a pas de jardin"
                            defaultChecked
                            onChange={(e) => setPropertyGarden(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group as={Col} sm={4} controlId='ab-email' className='mb-3'>
                        <Form.Label className='pb-1 mb-2 d-block fw-bold'>Piscine<span className='text-danger'>*</span></Form.Label>
                        <Form.Check
                            type='radio'
                            name='propertyPool'
                            id='propertyPool'
                            value='1'
                            {...register('propertyPool')}
                            label="Oui, il y a une piscine"
                            onChange={(e) => setPropertyPool(e.target.value)}
                        />
                        <Form.Check
                            type='radio'
                            name='propertyPool'
                            id='propertyPool'
                            value='0'
                            {...register('propertyPool')}
                            label="Non, il n'y a pas de piscine"
                            defaultChecked
                            onChange={(e) => setPropertyPool(e.target.value)}
                        />
                    </Form.Group>

                </Row>
                <div className='pt-3 pb-2 form-label fw-bold'>Le bien immobilier est meublé?</div>
                <Form.Check
                    type='radio'
                    name='isFurnished'
                    id='business'
                    value='1'
                    {...register('propertyIsFurnished')}
                    label="Oui c'est meublé, et j'ajoute les meubles"
                    onChange={(e) => setIsFurnished(e.target.value)}
                />
                <Form.Check
                    type='radio'
                    name='isFurnished'
                    id='private'
                    value='0'
                    {...register('propertyIsFurnished')}
                    label="Non, ce n'est pas meublé"
                    defaultChecked
                    onChange={(e) => setIsFurnished(e.target.value)}
                />
                {isFurnished == '1' && <>
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

                <Form.Group controlId='ap-description'>
                    <Form.Label className='pb-1 mb-2 d-block fw-bold'>Description</Form.Label>
                    <Form.Control {...register('propertyDescription')} as='textarea' rows={5} defaultValue={propriete.descriptif} placeholder='Decrire le bien immobilier' name='propertyDescription' onChange={(e) => setPropertyDescription(e.currentTarget.value)} />
                    <Form.Text>1500 characters left</Form.Text>
                </Form.Group>
            </section>
            {/* Price */}
            <section id='price' className='p-4 mb-4 border-0 shadow-sm card card-body'>
                <h2 className='mb-4 h4'>
                    <i className='fi-cash text-primary fs-5 mt-n1 me-2'></i>
                    Preciser votre tarification immobilière
                </h2>
                {propertyOffer == '1' && <>
                    <Form.Label htmlFor='ap-price' className='pb-1 mb-2 d-block fw-bold'>
                        Loyer mensuel(si location)<span className='text-danger'>*</span>
                    </Form.Label>
                    <div className='d-sm-flex'>
                        <Form.Select className='mb-2 w-25 me-2'>
                            <option value='XOF'>FCFA</option>
                            <option value='GNS'>Franc Guinéén</option>
                        </Form.Select>
                        <Form.Control
                            id='ap-price'
                            type='number'
                            defaultValue={propriete.cout_mensuel}
                            name='propertyMonthPrice'
                            {...register('propertyMonthPrice')}
                            min={5000}
                            onChange={(e) => setPropertyMonthPrice(e.currentTarget.value)}
                            className='mb-2 w-50 me-2'
                        />
                    </div>
                </>}

                {isFurnished == '1' && <>
                    <Form.Label htmlFor='ap-price' className='pb-1 mb-2 d-block fw-bold'>
                        Nuitée(Par jour)<span className='text-danger'>*</span>
                    </Form.Label>
                    <div className='d-sm-flex'>
                        <Form.Select className='mb-2 w-25 me-2'>
                            <option value='XOF'>FCFA</option>
                            <option value='GNS'>Franc Guinéén</option>
                        </Form.Select>
                        <Form.Control
                            id='ap-price'
                            type='number'
                            defaultValue={propriete.nuitee}
                            name='propertyDayPrice'
                            {...register('propertyDayPrice')}
                            onChange={(e) => setPropertyDayPrice(e.currentTarget.value)}
                            min={200}
                            step={50}
                            className='mb-2 w-50 me-2'
                            required
                        />

                    </div>
                </>}


                {propertyOffer == '2' && <>
                    <Form.Label htmlFor='ap-price' className='pb-1 mb-2 d-block fw-bold'>
                        Prix d'achat <span className='text-danger'>*</span>
                    </Form.Label>
                    <div className='d-sm-flex'>
                        <Form.Select className='mb-2 w-25 me-2'>
                            <option value='XOF'>FCFA</option>
                            <option value='GNS'>Franc Guinéén</option>
                        </Form.Select>
                        <Form.Control
                            id='propertyBuyPrice'
                            type='number'
                            name='propertyBuyPrice'
                            {...register('propertyBuyPrice')}
                            min={200}
                            defaultValue={propriete.cout_vente}
                            step={50}
                            className='mb-2 w-50 me-2'
                            onChange={(e) => setPropertyBuyPrice(e.currentTarget.value)}
                            required
                        />
                    </div>
                </>}
            </section>

            {/* Informations supplémentaires */}
            <section id='contacts' className='p-4 mb-4 border-0 shadow-sm card card-body'>
                <h2 className='mb-4 h4'>
                    <i className='fi-phone text-primary fs-5 mt-n1 me-2'></i>
                    Conditions d'accès
                </h2>
                <Row>
                    <Form.Group as={Col} sm={4} controlId='ab-fn' className='mb-3'>
                        <Form.Label className='pb-1 mb-2 d-block fw-bold'>Caution & Avances <span className='text-danger'>*</span></Form.Label>
                        <Form.Control type='number' defaultValue='6' placeholder='Nombre de cautions plus Avances' required
                            {...register('propertyCautionGuarantee')} name='propertyCautionGuarantee' onChange={(e) => setCautionGuarantee(e.currentTarget.value)} />
                    </Form.Group>

                    {propertyUserRole == '1' && <>
                        <Form.Group as={Col} sm={4} controlId='ab-sn' className='mb-3'>
                            <Form.Label className='pb-1 mb-2 d-block fw-bold'>Droit de visite immobilière <span className='text-danger'>*</span></Form.Label>
                            <Form.Control type='number' defaultValue='2000' {...register('propertyVisitRight')} placeholder='Montant du droit de visite' required onChange={(e) => setVisitRight(e.currentTarget.value)} />
                        </Form.Group>
                        <Form.Group as={Col} sm={4} controlId='ab-email' className='mb-3'>
                            <Form.Label className='pb-1 mb-2 d-block fw-bold'>Honoraires <span className='text-danger'>*</span></Form.Label>
                            <Form.Control type='number' defaultValue='1' placeholder='Honoraire'
                                required {...register('propertyHonorary')} onChange={(e) => setPropertyHonorary(e.currentTarget.value)} />
                        </Form.Group>
                    </>}

                    <Form.Group as={Col} sm={4} controlId='ab-email' className='mb-3'>
                        <Form.Label className='pb-1 mb-2 d-block fw-bold'>Gardien de sécurité <span className='text-danger'>*</span></Form.Label>
                        <Form.Check
                            type='radio'
                            name='isFurnished'
                            id='business'
                            value='1'
                            {...register('propertySecurity')}
                            label="Oui, il ya un gardien de sécurité"
                            onChange={(e) => setPropertySecurity(e.target.value)}
                        />
                        <Form.Check
                            type='radio'
                            name='isFurnished'
                            id='private'
                            value='0'
                            label="Non, pas de gardien de securite"
                            {...register('propertySecurity')}
                            defaultChecked
                            onChange={(e) => setPropertySecurity(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group as={Col} sm={6} controlId='ab-email' className='mb-3'>
                        <Form.Label className='pb-1 mb-2 d-block fw-bold'>Présence du bailleur <span className='text-danger'>*</span></Form.Label>
                        <Form.Check
                            type='radio'
                            name='propertyOwner'
                            id='business'
                            value='1'
                            {...register('propertyOwner')}
                            label="Oui, le bailleur est l'interieur avec les locataire"
                            onChange={(e) => setPropertyOwner(e.target.value)}
                        />
                        <Form.Check
                            type='radio'
                            name='propertyOwner'
                            id='private'
                            value='0'
                            label="Non, le bailleur est à l'exterieur"
                            defaultChecked
                            {...register('propertyOwner')}
                            onChange={(e) => setPropertyOwner(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group as={Col} sm={12} controlId='ab-email' className='mb-3'>
                        <Form.Label className='pb-1 mb-2 d-block fw-bold'>Autres conditions d'accès <span className='text-danger'>*</span></Form.Label>
                        <Form.Control as='textarea' {...register('propertyOtherConditions')} rows={5} defaultValue='' placeholder='Par exemple: Pas de célibataires' />
                    </Form.Group>

                </Row>
            </section>


            {/* Action buttons */}
            <section className='pt-2 d-sm-flex justify-content-between'>
                <Button size='lg' variant='primary d-block w-100 w-sm-auto mb-2' type='submit'>Metter à jour maintenant</Button>

            </section>
        </Form>


    )
}


export async function getServerSideProps(context) {
    const session = await getSession(context);
    if (!session) {
        context.res.writeHead(302, { Location: "/auth/signin" });
        context.res.end();
        return { props: {} };
    }
    return { props: { session } };
}
export default EditProperty
