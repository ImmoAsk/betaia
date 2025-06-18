import { useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import CloseButton from 'react-bootstrap/CloseButton'
import CardProperty from './CardProperty'
import Link from 'next/link';
import { createPropertyObject } from '../../utils/buildPropertiesArray'
import { getSession, useSession } from 'next-auth/react'
import PhoneInput from 'react-phone-input-2';
import { DatePicker } from "antd";
import 'react-phone-input-2/lib/style.css';
import axios from 'axios';
import moment from 'moment';
import { now } from 'moment/moment'
import { API_URL } from '../../utils/settings'
import EmbedSigninForm from './EmbedSignIn/EmbedSigninForm'

const PayVisitModal = ({ property, onSwap, pillButtons, ...props }) => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [visitDate, setVisitDate] = useState(moment());
  const [hourVisit, setHourVisit] = useState('');
  const [firstName, setFirstName] = useState('');
  const [validated, setValidated] = useState(false);
  const [visiteNotification, setVisiteNotification] = useState(null);

  const { data: session } = useSession();


  const handleVisitDateTimeChange = (date) => {
    if (date) {
        // Extract the date and time separately
        const selectedDate = date.format('YYYY-MM-DD'); // Get only the date
        const selectedTime = date.format('HH:mm:ss'); // Get only the time

        setVisitDate(selectedDate); // Update state with date
        setHourVisit(selectedTime); // Update state with time

        console.log("Selected Date:", selectedDate);
        console.log("Selected Time:", selectedTime);
    }
};
 
  // Adjust validation based on session status
  const isFormValid = session && visitDate && hourVisit 

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
      visitDate,
      hourVisit,
      firstName
    };
    console.log("Visite: ", formData)
    const visite_data = {
      query: `mutation PayVisite($input: VisiteInput!) {
        createVisite(input: $input) {
          id
        }
      }`,
      variables: {
        input: {
          email_visitor: session ? "" : formData.email,
          telephone_visitor: session ? "" : formData.phone,
          user_id: session ? Number(session.user.id) : 0,
          date_visite: formData.visitDate,
          heure_visite: formData.hourVisit,
          propriete_id: Number(property.id),
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

      if (Number(response.data?.data?.createVisite?.id) >= 1) {
        setVisiteNotification("Votre visite a été envoyée avec succès. Vous serez contacté sous peu.");
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
            <h3 className='h4 mb-2 mb-sm-2'>Visite d'un bien immobilier</h3>
            <div className='d-flex align-items-center py-3 mb-3'>
              <CardProperty property={propertyCard} />
            </div>
            <div className='mt-2 mt-sm-2'>
              Avant de visiter, <a href='#' onClick={onSwap}>Vérifier la disponibilité</a>
            </div>
          </div>

          <div className='col-md-6 p-4 p-sm-5'>
            <h4 className='h5'>
              Vous planifiez une visite pour le bien immobilier N° {property.nuo}.
            </h4>
            {session && (
              <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <Form.Group controlId='si-offer' className='mb-2'>
                <Form.Label>Date et Heure de visite ?</Form.Label>
                <Form.Control
                  as={DatePicker}
                  showTime
                  selected={visitDate}
                  minDate={moment(now)}
                  onChange={handleVisitDateTimeChange}
                  getPopupContainer={(trigger) => trigger.parentNode}
                  placeholderText='Selectionner une date'
                />
                <Form.Control.Feedback type="invalid">
                  Preciser une date svp.
                </Form.Control.Feedback>
              </Form.Group>
              <Button
                type='submit'
                disabled={!isFormValid}
                size='lg'
                variant={`primary ${pillButtons ? 'rounded-pill' : ''} w-100`}
              >
                Planifier la visite
              </Button>
              {visiteNotification && <div className="alert alert-success mt-3">{visiteNotification}</div>}
            </Form>
            )}
            {!session && (
              <>
              <h5 className='h6 mb-3'>Connectez-vous pour planifier une visite</h5>
              <EmbedSigninForm/>
              </>
            )}
          </div>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default PayVisitModal;