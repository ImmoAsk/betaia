import { useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import CloseButton from 'react-bootstrap/CloseButton'

import Link from 'next/link';
import { getSession, useSession } from 'next-auth/react'
import PhoneInput from 'react-phone-input-2';
import { DatePicker } from "antd";
import 'react-phone-input-2/lib/style.css';
import axios from 'axios';
import moment from 'moment';
import { now } from 'moment/moment'

import CardProperty from '../CardProperty'
import { createPropertyObject } from '../../../utils/buildPropertiesArray'
import { API_URL } from '../../../utils/settings'
import { type } from 'os'

const PreSellingModal = ({ property, onSwap, pillButtons, ...props }) => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [pmontant, setPMontant] = useState(25000);
  const [firstName, setFirstName] = useState('');
  const [validated, setValidated] = useState(false);
  const [visiteNotification, setVisiteNotification] = useState(null);

  const { data: session } = useSession();
 
  // Adjust validation based on session status
  const isFormValid = session 
    ? pmontant  // Only date and hour if session is valid
    : email && phone && pmontant && firstName;  // Require all fields for non-session users

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isFormValid) {
      console.log("Le formulaire n'est pas valide. Veuillez vérifier les champs.");
      setValidated(true);
      return;
    }

    const formData = {
      email,
      phone,
      pmontant,
      firstName
    };
    console.log("Visite: ", formData)
    const visite_data = {
      query: `mutation PaySouscription($input: Payment_transactionInput!) {
        createPaymentTransaction(input: $input) {
          id
        }
      }`,
      variables: {
        input: {
          email_visitor: session ? "" : formData.email,
          telephone_visitor: session ? "" : formData.phone,
          user_id: session ? Number(session.user.id) : 0,
          montant: Number(formData.pmontant),
          propriete_id: Number(property.id),
          description: `Paiement de souscription pour la propriété ${property.nuo}`,
          type_transaction: "souscription",
          proprietaire_id: Number(property?.user?.id),
          fullname_visitor: session ? "" : formData.firstName,
        }
      }
    };
    console.log("Visite: ", visite_data)
    try {
      const response = await axios.post(API_URL, visite_data, {
        headers: { 'Content-Type': 'application/json' }
      });

      if (Number(response.data?.data?.createPaymentTransaction?.id) >= 1) {
        setVisiteNotification("Votre intention de souscription a été enregistrée avec succès. Vous serez contacté par le propriétaire pour la suite de la procédure. Merci.");
      }
    } catch (error) {
      console.error("Error during visite:", error);
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
            <h2 className='h3 mb-2 mb-sm-2'>Paiement de souscription</h2>

            <div className='d-flex align-items-center py-3 mb-3'>
              <CardProperty property={propertyCard} />
            </div>
          </div>

          <div className='col-md-6 p-4 p-sm-5'>
            <h3 className='h4'>
              Vous procedez au paiement de la souscription pour le bien immobilier N° {property.nuo}.
            </h3>
            {!session && <i>✨ Astuce : Créez votre compte <Link href='/signup-light'>
              <a className='fs-sm'>ici</a>
            </Link> pour ne plus à remplir votre nom, prénom, email et numéro de téléphone 📱 à chaque fois. 😊</i>}
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <Form.Group controlId='si-offer' className='mb-2'>
                <Form.Label>Montant de la souscription</Form.Label>
                <Form.Control
                      type='number'
                      name='pmontant'
                      value={25000}
                      required
                    />
              </Form.Group>

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
                    <Form.Label>Nom et prénom ?</Form.Label>
                    <Form.Control
                      type='text'
                      name='firstname'
                      placeholder='Saisir votre nom complet'
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
                Proceder au paiement
              </Button>
              {visiteNotification && <div className="alert alert-success mt-3">{visiteNotification}</div>}
            </Form>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default PreSellingModal;