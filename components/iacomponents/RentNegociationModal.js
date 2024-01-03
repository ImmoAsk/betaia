import { useState } from 'react'
import Link from 'next/link'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import CloseButton from 'react-bootstrap/CloseButton'
import ImageLoader from '../ImageLoader'
import PasswordToggle from '../PasswordToggle'
import CardProperty from './CardProperty'
import { createPropertyObject } from '../../utils/buildPropertiesArray'
import { useSession } from 'next-auth/react'

const RentNegociationModal = ({ property, onSwap, pillButtons, ...props }) => {

  // Form validation
  const [validated, setValidated] = useState(false)
  const handleSubmit = (event) => {
    const form = event.currentTarget
    if (form.checkValidity() === false) {
      event.preventDefault()
      event.stopPropagation()
    }
    setValidated(true);
  }
  const propertyCard = createPropertyObject(property);
  const { data: session } = useSession();
  return (
    <Modal {...props} className='signin-modal'>
      <Modal.Body className='px-0 py-2 py-sm-0'>
        <CloseButton
          onClick={props.onHide}
          aria-label='Close modal'
          className='position-absolute top-0 end-0 mt-3 me-3'
        />
        <div className='row mx-0'>
          <div className='col-md-6 border-end-md p-4 p-sm-5'>
            <h2 className='h3 mb-2 mb-sm-2'>Negociation de loyer</h2>

            <div className='d-flex align-items-center py-3 mb-3'>
              <CardProperty property={propertyCard} />
            </div>
            <div className='mt-2 mt-sm-2'>Avant de negocier <a href='#' onClick={onSwap}>Vérifier la disponibilité</a></div>
          </div>
          <div className='col-md-6 p-4 p-sm-5'>
            <h3 className='h4'>
              Chere bien aimé, vous etes sur le point de negocier
              le loyer du bien immobilier N° {property.nuo}
            </h3>

            <p>
              10 personnes ont négocié le loyer de ce bien immobilier et
              l'offre moyenne calculée est 420 000 XOF.
            </p>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <Form.Group controlId='si-email' className='mb-2'>
                <Form.Label>Quelle est votre offre ?</Form.Label>
                <Form.Control
                  type='email'
                  placeholder='Saisir votre offre'
                  required
                />
              </Form.Group>
              {
                !session && (<><Form.Group controlId='si-email' className='mb-2'>
                  <Form.Label>Numero de télephone?</Form.Label>
                  <Form.Control
                    type='number'
                    placeholder='Saisir votre N. de telephone'
                    required
                  />
                </Form.Group>
                  <Form.Group controlId='si-email' className='mb-2'>
                    <Form.Label>Votre email ?</Form.Label>
                    <Form.Control
                      type='email'
                      placeholder='Saisir votre email'
                      required
                    />
                  </Form.Group>
                  <Form.Group controlId='si-email' className='mb-2'>
                    <Form.Label>Votre prenom ?</Form.Label>
                    <Form.Control
                      type='text'
                      placeholder='Saisir votre prénom'
                      required
                    />
                  </Form.Group></>)
              }

              <Button type='submit' size='lg' variant={`primary ${pillButtons ? 'rounded-pill' : ''} w-100`}>Négocier le loyer</Button>
            </Form>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default RentNegociationModal
