import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import CloseButton from 'react-bootstrap/CloseButton';
import CardProperty from '../CardProperty'
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import 'react-phone-input-2/lib/style.css';
import axios from 'axios';
import { API_URL } from '../../../utils/settings';


const fetchPropertyData = async (nuo) => {
  const query = `
    query GetProperty($nuo: Int!) {
      propriete(nuo: $nuo) {
        id
        nuo
        garage
        est_meuble
        titre
        descriptif
        surface
        usage
        cuisine
        salon
        piece
        wc_douche_interne
        cout_mensuel
        nuitee
        cout_vente
        tarifications {
          id
          mode
          currency
          montant
        }
        categorie_propriete {
          denomination
          id
        }
        infrastructures {
          id
          denomination
          icone
        }
        meubles {
          libelle
          icone
        }
        badge_propriete {
          id
          date_expiration
          badge {
            id
            badge_name
            badge_image
          }
        }
        pays {
          id
          code
          denomination
        }
        ville {
          denomination
          id
        }
        quartier {
          id
          denomination
        }
        adresse {
          libelle
          id
        }
        offre {
          id
          denomination
        }
        visuels {
          uri
        }
        user {
          id
        }
      }
    }
  `;
  
  const response = await axios.post(
    API_URL,
    {
      query,
      variables: { nuo },
    }
  );

  if (response.data.errors) {
    throw new Error('Failed to fetch property data');
  }

  return response.data.data.propriete;
};
const PropertyContractModal = ({onSwap, pillButtons, ...props }) => {


  const [propertyModal, setPropertyModal] = useState(null);
  
    /* const { data, isLoading, isError } = useQuery(
      ['propertyModal', property.nuo],
      () => fetchPropertyData(property.nuo),
      {
        onSuccess: (data) => setPropertyModal(data),
        enabled: !!property.nuo, // Ensures that `nuo` exists before fetching
      }
    ); */
  

  const [requestAvailability, setRequestAvailability] = useState('');
  const [firstName, setFirstName] = useState('');
  const [validated, setValidated] = useState(false);
  const [disponibiliteNotification, setDisponibiliteNotification] = useState(null);

  const { data: session } = useSession();

  // Adjust validation logic based on session
  const isFormValid = true;

  // Form submission handler
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate form inputs
    if (!isFormValid) {
      console.log("Le formulaire n'est pas valide. Veuillez vérifier les champs.");
      setValidated(true);
      return;
    }
    // Prepare GraphQL mutation for rent disponibilite
    const disponibilite_data = {
      query: `mutation UpdatePropertyStatus($input: UpdateProprieteStatusInput!) {
        updateProprieteStatus(input: $input) {
          id
        }
      }`,
      variables: {
        input: {
          id: 1,
          statut: 2,
        }
      }
    };
    console.log("Before Mutation: ", disponibilite_data)
    try {
      const response = await axios.post(API_URL, disponibilite_data, {
        headers: { 'Content-Type': 'application/json' }
      });

      if (Number(response.data?.data?.updateProprieteStatus?.id) >= 1) {
        setDisponibiliteNotification("Le biens immobiler est bien rendu indisponible. Mettez en vente ou en location d'autres biens immobiliers.");
      }
    } catch (error) {
      console.error("Error during disponibilite:", error);
    }

    setValidated(true);
  };
  //console.log("Property In Delete Modal: ", property);
  //const propertyCard = createPropertyObject(property);

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
            <h2 className='h3 mb-2 mb-sm-2'>Creattion du contrat immobiler N° </h2>

            <div className='d-flex align-items-center py-3 mb-3'>
              <>Formulaire ici</>
            </div>
          </div>

          <div className='col-md-6 p-4 p-sm-5'>
            <h3 className='h4'>
              Bail a usage d'habitation N°. Bonne chance !
            </h3>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <>Formulaire se remplis automatiquement</>
              {disponibiliteNotification && <div className="alert alert-success mt-3">{disponibiliteNotification}</div>}
            </Form>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default PropertyContractModal;