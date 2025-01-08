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

const REInquiryModal = ({ property, onSwap, pillButtons, ...props }) => {
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
  const isFormValid = session 
    ? visitDate && hourVisit  // Only date and hour if session is valid
    : email && phone && visitDate && hourVisit && firstName;  // Require all fields for non-session users

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
            <h2 className='h3 mb-2 mb-sm-2'>Visite d'un bien immobilier</h2>

            <div className='d-flex align-items-center py-3 mb-3'>
              <CardProperty property={propertyCard} />
            </div>
            <div className='mt-2 mt-sm-2'>
              Avant de visiter, <a href='#' onClick={onSwap}>Vérifier la disponibilité</a>
            </div>
          </div>

          <div className='col-md-6 p-4 p-sm-5'>
            <h3 className='h4'>
              Soumission d'une requete immobiliere .
            </h3>
            {!session && <i>✨ Astuce : Créez votre compte <Link href='/signup-light'>
              <a className='fs-sm'>ici</a>
            </Link> pour ne plus à remplir votre nom, prénom, email et numéro de téléphone 📱 à chaque fois. 😊</i>}
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <Form.Group controlId='si-offer' className='mb-2'>
                <Form.Label>Quel est votre delai au plus tard ?</Form.Label>
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
                  Preciser le delai au plus tard.
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId='description'>
                  <Form.Label className='pb-1 mb-2 d-block fw-bold'>Decrivez nous exactement la demande ?</Form.Label>
                  <Form.Control
                    as='textarea'
                    rows={5}
                    placeholder='Decrire votre demande immobiliere'
                    name='description'
                    required
                    />
                  <Form.Text>1000 caractères aumoins</Form.Text>
                </Form.Group>
                <Form.Group as={Col} sm={6} controlId='categorieProjet' className='mb-3'>
                    <Form.Label>Catégorie du projet immobilier<span className='text-danger'>*</span></Form.Label>
                    <Form.Select defaultValue='' required name='categorieProjet'>
                      <option value='' disabled>Quel type de projet immobilier</option>
                      <option value='Suivi,Chantier'>Suivi d'un chantier</option>
                      <option value='Construction,Habitation personnelle'>Construction d'une habitation perso</option>
                      <option value='Construction,Immeuble commercial'>Construction d'un immeuble commercial</option>
                      <option value='Consruction, Hotel'>Construction d'un hotel</option>
                      <option value="Logement,Location d'appartement">Location d'appartement</option>
                      <option value="Logement,Location de villa">Location de villa</option>
                      <option value="Bail,Location de bureau">Location de bureau</option>
                      <option value="Bail,Location de magasin">Location de magasin</option>
                      <option value="Bail,Location de boutique">Location de boutique</option>
                      <option value="Bail,Location de Salle de Conference">Location de de salle de conference</option>
                      <option value="Bail,Location de terrain">Location de terrain</option>
                      <option value="Sejour,Reservation de sejour">Reservation de sejour meuble</option>
                      <option value='Achat,Terrain rural'>Achat d'un terrain rural</option>
                      <option value='Achat,Terrain urbain'>Achat d'un terrain urbain</option>
                      <option value='Achat,Achat de Villa'>Achat de villa</option>
                      <option value="Achat,Achat d\'appartement">Achat d'appartement</option>
                      <option value='Accompagnement,Titre foncier'>Obtention de titre foncier</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      Préciser la catégorie du projet immobilier, svp
                    </Form.Control.Feedback>
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
                Soumettre le projet immobilier
              </Button>
              {visiteNotification && <div className="alert alert-success mt-3">{visiteNotification}</div>}
            </Form>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default REInquiryModal;