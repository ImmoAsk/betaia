// components/OffCanvasFilter.js
import React, { useState, useRef, useEffect } from 'react';
import { Offcanvas, Button, Form, Col, Nav} from 'react-bootstrap';
import useFilterSubmit from '../../../customHooks/useFilterSubmit';
import Select from 'react-select';
import useListTowns from '../../../customHooks/useListTowns';
import useListQuarters from '../../../customHooks/useListQuarters';
import { formatDistrictsOptions, formatTownsOptions } from '../../../utils/generalUtils';
const OffCanvasFilter = ({ show, handleClose, isDesktop, onFilterSubmit }) => {
    const offcanvasContainer = useRef(null);
    const [city, setCity] = useState('');
    const [categoryParamValue, setCategoryParamValue] = useState('');
    const [district, setDistrict] = useState('');
    const [propertyTypeSelected, setPropertyTypeSelected] = useState('');
    const [bedroomsValue, setBedroomsValue] = useState('');
    const [bathroomsValue, setBathroomsValue] = useState('');
    const [selectedAmenities, setSelectedAmenities] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [surfaceMin, setSurfaceMin] = useState('');
    const [surfaceMax, setSurfaceMax] = useState('');
    const propertyTypeOptions = [
        { value: '', label: 'Selectionner la propriete' },
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
    const propertyTypeSelectedOption = propertyTypeOptions.find((option) => option.value === propertyTypeSelected);

    const { status: villesStatus, data: villes } = useListTowns(228);
    const { status: quartiersStatus, data: quartiers } = useListQuarters(Number(city));
    const townList = formatTownsOptions(villes)
    const quarterList = formatDistrictsOptions(quartiers)

    const townSelectedOption = townList.find((option) => option.value === city);
    const quarterSelectedOption = quarterList.find((option) => option.value === district);

    const { submitFilters, loading } = useFilterSubmit();

    useEffect(() => {
        if (categoryParamValue) {
            setCategoryParamValue(categoryParamValue);
        }
    }, [categoryParamValue]);

    const handleCheckboxChange = (value, selected, setSelected) => {
        if (selected.includes(value)) {
            setSelected(selected.filter((item) => item !== value));
        } else {
            setSelected([...selected, value]);
        }
    };

    const handleSubmit = async () => {
        const data = {
            city,
            district,
            category: categoryParamValue,
            propertyType: propertyTypeSelected,
            bedrooms: bedroomsValue,
            bathrooms: bathroomsValue,
            surfaceMin,
            surfaceMax,
            amenities: selectedAmenities,
            options: selectedOptions,
        };

        try {
            const response = await submitFilters(data);
            console.log('Data sent to server:', data);
            console.log('Filter results:', response);
            if (onFilterSubmit) {
                onFilterSubmit(response); // send data to parent
            }
        } catch (err) {
            console.error('Filter submission failed', err);
        }
    };

    return (
        <Col ref={offcanvasContainer} as='aside' lg={4} xl={3} className='shadow-sm px-1 px-xl-2 px-xxl-3 pt-lg-2'>
            <Offcanvas
                show={isDesktop ? true : show}
                onHide={handleClose}
                backdrop={!isDesktop}
                scroll={isDesktop}
                container={offcanvasContainer}
                className='offcanvas-expand-lg'
            >
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title as='h5'>Filtres</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body className='py-lg-4'>
                    <h3 className='h6'>Quelle est votre demande ? </h3>
                    <Nav variant='pills' className='mb-3'>
                        <Nav.Item>
                            <Nav.Link as="span" active={categoryParamValue === '1'} onClick={() => setCategoryParamValue('1')} className="border rounded-pill px-3">
                                <i className='fi-rent fs-base me-2'></i>
                                Louer
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link as="span" active={categoryParamValue === '2'} onClick={() => setCategoryParamValue('2')} className="border rounded-pill px-3">
                                <i className='fi-home fs-base me-2'></i>
                                Acheter
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item className='mt-1'>
                            <Nav.Link as="span" active={categoryParamValue === '4'} onClick={() => setCategoryParamValue('4')} className="border rounded-pill px-3">
                                <i className='fi-home fs-base me-2'></i>
                                Bailler
                            </Nav.Link>
                        </Nav.Item>
                    </Nav>
                    <h3 className='h6'>Situation géographique</h3>
                    <label className='d-block fs-sm mb-1'>Quelle ville ?</label>
                    <Select
                        name="city"
                        value={townSelectedOption} // Pre-select based on propertyData
                        onChange={(selected) => setCity(selected.value)}
                        options={townList}
                        isSearchable
                        isClearable
                        placeholder="Preciser la ville"
                        className={`react-select-container mb-2`}
                        classNamePrefix="react-select"
                    />
                    <label className='d-block fs-sm mb-1'>Quel quartier ?</label>
                    <Select
                        name="district"
                        value={quarterSelectedOption} // Pre-select based on propertyData
                        onChange={(selected) => setDistrict(selected.value)}
                        isDisabled={!city} // Disable if no city is selected
                        options={quarterList}
                        isSearchable
                        isClearable
                        placeholder="Preciser le quartier"
                        className={`react-select-container mb-2`}
                        classNamePrefix="react-select"
                    />

                    <h3 className='h6'>Type de biens immobiliers</h3>
                    <Select
                        name="propertyType"
                        value={propertyTypeSelectedOption} // Pre-select based on propertyData
                        onChange={(selected) => setPropertyTypeSelected(selected.value)}
                        options={propertyTypeOptions}
                        placeholder="Preciser type"
                        isSearchable
                        isClearable
                        className={`react-select-container`}
                        classNamePrefix="react-select"
                    />

                    <h3 className='h6 pt-3'>Chambres & Salles de bain</h3>
                    <div className='d-flex'>
                        <Form.Control
                            type='number'
                            min={1}
                            max={10}
                            placeholder='Chambres'
                            value={bedroomsValue}
                            onChange={(e) => setBedroomsValue(e.target.value)}
                            className='me-2'
                        />
                        <Form.Control
                            type='number'
                            min={0}
                            max={10}
                            placeholder='Bains'
                            value={bathroomsValue}
                            onChange={(e) => setBathroomsValue(e.target.value)}
                        />
                    </div>

                    {/* <h3 className='h6 pt-3'>Surface en m²</h3>
                    <div className='d-flex'>
                        <Form.Control
                            type='number'
                            placeholder='Min'
                            value={surfaceMin}
                            onChange={(e) => setSurfaceMin(e.target.value)}
                            className='me-2'
                        />
                        <Form.Control
                            type='number'
                            placeholder='Max'
                            value={surfaceMax}
                            onChange={(e) => setSurfaceMax(e.target.value)}
                        />
                    </div>

                    <h3 className='h6 pt-3'>Intérieur & Extérieur</h3>
                    <SimpleBar autoHide={false} style={{ maxHeight: '11rem' }}>
                        {amenities.map(({ value }, indx) => (
                            <Form.Check
                                key={indx}
                                id={`amenity-${indx}`}
                                value={value}
                                label={<span className='fs-sm'>{value}</span>}
                                checked={selectedAmenities.includes(value)}
                                onChange={() => handleCheckboxChange(value, selectedAmenities, setSelectedAmenities)}
                            />
                        ))}
                    </SimpleBar>

                    <h3 className='h6 pt-3'>Options additionnelles</h3>
                    {options.map(({ value }, indx) => (
                        <Form.Check
                            key={indx}
                            id={`option-${indx}`}
                            value={value}
                            label={<span className='fs-sm'>{value}</span>}
                            checked={selectedOptions.includes(value)}
                            onChange={() => handleCheckboxChange(value, selectedOptions, setSelectedOptions)}
                        />
                    ))} */}

                    <div className='border-top mt-4 pt-3'>
                        <Button onClick={handleSubmit} variant='primary' disabled={loading}>
                            {loading ? 'Chargement...' : 'Appliquer les filtres'}
                        </Button>
                    </div>
                </Offcanvas.Body>
            </Offcanvas>
        </Col>
    );
};

export default OffCanvasFilter;