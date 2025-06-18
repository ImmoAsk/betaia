import { useState } from 'react'
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import CloseButton from 'react-bootstrap/CloseButton'
import CardProperty from './CardProperty'
import { createPropertyObject } from '../../utils/buildPropertiesArray'
import { useSession } from "next-auth/react"
import 'react-phone-input-2/lib/style.css';
import axios from 'axios';
import EmbedSigninForm from './EmbedSignIn/EmbedSigninForm';
import { API_URL } from '../../utils/settings';

const RentNegociationModal = ({ property, onSwap, pillButtons, ...props }) => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [offer, setOffer] = useState('');
  const [firstName, setFirstName] = useState('');
  const [validated, setValidated] = useState(false);
  //const [csrfToken, setCsrfToken] = useState(null);
  const [negotiationNotification, setNegotiationNotification] = useState(null);
  //const [providers, setProviders] = useState(null);
  const { data: session, status } = useSession();

  // Adjust validation logic based on session
  const isFormValid = session && Number(offer) >= 1 ;

  // Form submission handler
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate form inputs
    if (!isFormValid) {
      console.log("Le formulaire n'est pas valide. Veuillez vérifier les champs.");
      setValidated(true);
      return;
    }

    // Collect form data
    const formData = {
      email,
      phone,
      offer,
      firstName
    };
    console.log("Before Mutation: ", formData)
    // Prepare GraphQL mutation for rent negotiation
    const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const negotiation_data = {
      query: `mutation RentNegotiation($input: NegotiationInput!) {
        createNegotiation(input: $input) {
          id
        }
      }`,
      variables: {
        input: {
          email_negociateur: session ? "" : formData.email,
          telephone_negociateur: session ? "" : formData.phone,
          user_id: session ? Number(session.user?.id) : 0,
          date_negociation: currentDate,
          montant: Number(formData.offer),
          propriete_id: Number(property.id),
          proprietaire_id: Number(property?.user?.id),
          fullname_negociateur: session ? "" : formData.firstName,
        }
      }
    };
    console.log("Before Mutation: ", negotiation_data)
    try {
      const response = await axios.post(API_URL, negotiation_data, {
        headers: { 'Content-Type': 'application/json' }
      });

      if (Number(response.data?.data?.createNegotiation?.id) >= 1) {
        setNegotiationNotification("Votre négociation a été envoyée avec succès. Vous serez contacté sous peu.");
      }
    } catch (error) {
      console.error("Error during negotiation:", error);
    }

    setValidated(true);
  };

  const propertyCard = createPropertyObject(property);

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
            <h3 className='h4 mb-2 mb-sm-2'>Négociation de loyer</h3>

            <div className='d-flex align-items-center py-3 mb-3'>
              <CardProperty property={propertyCard} />
            </div>
            <div className='mt-2 mt-sm-2'>
              Avant de négocier, <a href='#' onClick={onSwap}>Vérifier la disponibilité</a>
            </div>
          </div>

          <div className='col-md-6 p-4 p-sm-5'>
            <h4 className='h5'>
              Vous êtes sur le point de négocier le loyer du bien immobilier N° {property.nuo} 
            </h4>
            {session && (
              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Group controlId='si-offer' className='mb-2'>
                  <Form.Label>Quelle est votre offre ?</Form.Label>
                  <Form.Control
                    type='number'
                    name='offer'
                    required
                    value={offer}
                    placeholder='Saisir votre offre'
                    onChange={(e) => setOffer(e.target.value)}
                  />
                  <Form.Control.Feedback type="invalid">
                    Veuillez saisir une offre valide.
                  </Form.Control.Feedback>
                </Form.Group>

                <Button
                  type='submit'
                  disabled={!isFormValid}
                  size='lg'
                  variant={`primary ${pillButtons ? 'rounded-pill' : ''} w-100`}
                >
                  Négocier le loyer
                </Button>
                {negotiationNotification && <div className="alert alert-success mt-3">{negotiationNotification}</div>}
              </Form>
            )}

             {!session && (
              <>
              <h5 className='h6 mb-3'>Connectez-vous pour négocier le loyer</h5>
              <EmbedSigninForm/>
              </>
              
            )}

          </div>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default RentNegociationModal;