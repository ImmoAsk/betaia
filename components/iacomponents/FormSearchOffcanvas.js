import { useState } from 'react'
import { Offcanvas, Form, Button, ButtonGroup, ToggleButton } from "react-bootstrap";
import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'
import TownList from './TownList';
import QuarterList from './QuarterList';
export default function FormSearchOffcanvas({ oville, oquartier, ocategory, ooffre, parentData, onChildDataChange, handleClose, bathroomsValue, bedroomsValue, PriceRange, amenities, bathrooms, options, bedrooms, propertyType, isDesktop, offcanvasContainer }) {

  const [childData, setChildData] = useState('Kara');

  const handleChildDataChange = (newChildData) => {
    //   const newChildData = 'Aneho';
    //setChildData(newChildData);

    // Pass the updated child data back to the parent
    onChildDataChange(newChildData);
  };
  return (<Offcanvas
    show={isDesktop ? true : false}
    onHide={handleClose}
    backdrop={isDesktop ? false : true}
    scroll={isDesktop ? true : false}
    container={offcanvasContainer}
    className='offcanvas-expand-lg'
  >
    <Offcanvas.Header closeButton>
      <Offcanvas.Title as='h5'>Filtres</Offcanvas.Title>
    </Offcanvas.Header>
    <Offcanvas.Body className='py-lg-4'>
      {/* Body for filter about geographic situation */}
      {oville ? <></> : <div className='pb-4 mb-2'>
        <h3 className='h6'>Situation géographique</h3>
        <Form.Select defaultValue='Lome' className='mb-2' onChange={(e) => handleChildDataChange(e.target.value)}>
          <option value='default' disabled>Choisir la ville</option>
          <option value={oville.id}>{oville.denomination}</option>
        </Form.Select>
        <Form.Select defaultValue='default'>
          <option value='default' disabled>Choisir le quartier</option>
          <QuarterList town_code={Number(oville.id)} />
        </Form.Select>
      </div>}
      {/* Body for filter about property category */}
      {ocategory ? <></> :<div className='pb-4 mb-2'>
        <h3 className='h6'>Type de biens immobiliers</h3>
        <SimpleBar autoHide={false} className='simplebar-no-autohide' style={{ maxHeight: '11rem' }}>
          {propertyType.map(({ value, checked }, indx) => (
            <Form.Check
              key={indx}
              id={`type-${indx}`}
              value={value}
              defaultChecked={checked}
              label={<><span className='fs-sm'>{value}</span></>}
            />
          ))}
        </SimpleBar>
      </div> }
      
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
        <SimpleBar autoHide={false} className='simplebar-no-autohide' style={{ maxHeight: '11rem' }}>
          {amenities.map(({ value, checked }, indx) => (
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
      <div className='pb-4 mb-2'>
        <h3 className='h6'>Options additionnelles</h3>
        {options.map(({ value, checked }, indx) => (
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
  </Offcanvas>)
}