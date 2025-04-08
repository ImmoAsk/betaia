import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import CloseButton from 'react-bootstrap/CloseButton';
import CardProperty from './CardProperty';
import Link from 'next/link';
import { createPropertyObject } from '../../utils/buildPropertiesArray'
import { useSession } from 'next-auth/react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import axios from 'axios';
import { API_URL } from '../../utils/settings';

const AskNuiteePriceModal = ({ property, onSwap, pillButtons, ...props }) => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [requestAvailability, setRequestAvailability] = useState('');
  const [firstName, setFirstName] = useState('');
  const [validated, setValidated] = useState(false);
  const [disponibiliteNotification, setDisponibiliteNotification] = useState(null);

  const { data: session } = useSession();

  // Adjust validation logic based on session
  const isFormValid = session ? true : (email && phone  && firstName);

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
      firstName
    };
    console.log("Before Mutation: ", formData)
    // Prepare GraphQL mutation for rent disponibilite
    const disponibilite_data = {
      query: `mutation CheckAvailability($input: Verification_disponibiliteInput!) {
        createVerificationDisponibilite(input: $input) {
          id
        }
      }`,
      variables: {
        input: {
          user_id: session ? Number(session.user?.id) : 0,
          email_verificateur: formData.email,
          telephone_verificateur: formData.phone,
          propriete_id: Number(property.id),
          proprietaire_id: Number(property?.user?.id),
          fullname_verificateur: formData.firstName+"4040",
        }
      }
    };
    console.log("Before Mutation: ", disponibilite_data)
    try {
      const response = await axios.post(API_URL, disponibilite_data, {
        headers: { 'Content-Type': 'application/json' }
      });

      if (Number(response.data?.data?.createVerificationDisponibilite?.id) >= 1) {
        setDisponibiliteNotification("La demande de la nuitée est envoyée avec succes. Nous vous revenons sous peu.");
      }
    } catch (error) {
      console.error("Error during disponibilite:", error);
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
            <h2 className='h3 mb-2 mb-sm-2'>Prix de la nuitée du bien immobilier N° {property.nuo}</h2>

            <div className='d-flex align-items-center py-3 mb-3'>
              <CardProperty property={propertyCard} />
            </div>
            {/* <div className='mt-2 mt-sm-2'>
              Apres la disponibilité, <a href='#' onClick={onSwap}>Planifier la visite</a>
            </div> */}
          </div>

          <div className='col-md-6 p-4 p-sm-5'>
            <h3 className='h4'>
              Prix de la nuitée du bien immobilier N° {property.nuo}
            </h3>
            {!session && <i>✨ Astuce : Créez votre compte <Link href='/signup-light'>
              <a className='fs-sm'>ici</a>
            </Link> pour ne plus à remplir votre nom, prénom, email et numéro de téléphone 📱 à chaque fois. 😊</i>}
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              {!session && (
                <>
                  <Form.Group className='mb-2'>
                    <Form.Label>Numéro de téléphone</Form.Label>
                    <PhoneInput
                      country={'tg'}
                      value={phone}
                      onChange={(phone) => setPhone(phone)}
                      enableSearch={true}
                      inputProps={{
                        name: 'phone',
                        required: true,
                        autoFocus: true,
                        className: 'form-control w-100 form-control-lg',
                      }}
                    />
                    <Form.Control.Feedback type="invalid">
                      Veuillez saisir un numéro de téléphone valide.
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group controlId='si-email' className='mb-2'>
                    <Form.Label>Votre email ?</Form.Label>
                    <Form.Control
                      type='email'
                      name='email'
                      placeholder='Saisir votre email'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Veuillez saisir une adresse email valide.
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group controlId='si-firstname' className='mb-2'>
                    <Form.Label>Votre prénom ?</Form.Label>
                    <Form.Control
                      type='text'
                      name='firstname'
                      placeholder='Saisir votre prénom'
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Veuillez saisir votre prénom.
                    </Form.Control.Feedback>
                  </Form.Group>
                </>
              )}

              <Button
                type='submit'
                disabled={!isFormValid}
                size='lg'
                variant={`primary ${pillButtons ? 'rounded-pill' : ''} w-100`}
              >
                Demander le prix de la nuitée
              </Button>
              {disponibiliteNotification && <div className="alert alert-success mt-3">{disponibiliteNotification}</div>}
            </Form>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default AskNuiteePriceModal;