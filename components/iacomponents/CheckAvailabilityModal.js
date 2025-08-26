import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import CloseButton from 'react-bootstrap/CloseButton';
import CardProperty from './CardProperty';
import { createPropertyObject } from '../../utils/buildPropertiesArray'
import { useSession } from 'next-auth/react';
import 'react-phone-input-2/lib/style.css';
import axios from 'axios';
import { min } from 'moment'
import { API_URL, BASE_URL, IMAGE_URL, RESEND_API_KEY } from '../../utils/settings';
import EmbedSigninForm from './EmbedSignIn/EmbedSigninForm';
import { get } from 'http';
import getPropertyFullUrl from '../../utils/getPropertyFullURL';

const CheckAvailabilityModal = ({ property, onSwap, pillButtons, ...props }) => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  //const [requestAvailability, setRequestAvailability] = useState('');
  const [firstName, setFirstName] = useState('');
  const [validated, setValidated] = useState(false);
  const [disponibiliteNotification, setDisponibiliteNotification] = useState(null);

  const { data: session } = useSession();

  // Adjust validation logic based on session
  const isFormValid = session && true;

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
          fullname_verificateur: formData.firstName,
        }
      }
    };
    console.log("Before Mutation: ", disponibilite_data)
    console.log("Property info: ", property)
    try {
      const response = await axios.post(API_URL, disponibilite_data, {
        headers: { 'Content-Type': 'application/json' }
      });

      if (Number(response.data?.data?.createVerificationDisponibilite?.id) >= 1) {
        setDisponibiliteNotification("La verification de disponibilité a été envoyée avec succès. Le propritaire vous confirme sous peu.");
      }
    } catch (error) {
      console.error("Error during disponibilite:", error);
    }

    console.log("Form Data Submitted:", {
      agentName: property?.user?.name,
      agentEmail: property?.user?.email,
      customerName: session?.user?.name || formData.firstName,
      propertyNuo: property.nuo,
      propertyLink: property.href,
      propertyImage: property.visuels && property.visuels.length > 0 ? property.visuels[0]?.uri : null,
    });
    try {
      const res = await fetch("/api/sendVerificationDisponibiliteEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentName: property?.user?.name,
          agentEmail: property?.user?.email || 'immoaskimmobilier@gmail.com',
          customerName: session?.user?.name || formData.firstName,
          propertyNuo: property?.nuo,
          propertyLink: BASE_URL+getPropertyFullUrl(
            property?.pays?.code || 'tg',
            property?.offre?.denomination,
            property?.categorie_propriete?.denomination,
            property?.ville?.denomination,
            property?.quartier?.denomination,
            property?.nuo || ''
          ),
          //propertyLink: `${BASE_URL}/tg/${}/${property?.categorie_propriete?.minus_denomination}/${property?.ville?.denomination.toLowerCase()}/${property?.quartier?.minus_denomination}/${property?.nuo}`,
          propertyImage: property.visuels && property.visuels.length > 0 ? IMAGE_URL+'/'+property.visuels[0]?.uri : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur inconnue");
      console.log("Email sent successfully:", data);
    } catch (err) {
      console.error("Échec de l'envoi de l'email:", err.message);
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
            <h2 className='h3 mb-2 mb-sm-2'>Disponibilité du bien immobilier N° {property.nuo}</h2>

            <div className='d-flex align-items-center py-3 mb-3'>
              <CardProperty property={propertyCard} />
            </div>
            <div className='mt-2 mt-sm-2'>
              Apres la disponibilité, <a href='#' onClick={onSwap}>Planifier la visite</a>
            </div>
          </div>

          <div className='col-md-6 p-4 p-sm-5'>
            <h3 className='h4'>
              Verification de disponibilité du bien immobilier N° {property.nuo}. Bonne chance !
            </h3>
            {session ? (
              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Button
                  type='submit'
                  disabled={!isFormValid}
                  size='lg'
                  variant={`primary ${pillButtons ? 'rounded-pill' : ''} w-100`}
                >
                  Vérifier la disponibilité
                </Button>
                {disponibiliteNotification && <div className="alert alert-success mt-3">{disponibiliteNotification}</div>}
              </Form>
            ) : (

              <>
                <h5 className='h6 mb-3'>Connectez-vous pour vérifier la disponibilité</h5>
                <EmbedSigninForm />
              </>
            )}
          </div>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default CheckAvailabilityModal;