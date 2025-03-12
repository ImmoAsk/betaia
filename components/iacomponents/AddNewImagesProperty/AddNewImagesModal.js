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
import { set } from 'nprogress';
import { FilePond, registerPlugin } from 'react-filepond'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import FilePondPluginImageCrop from 'filepond-plugin-image-crop'
import FilePondPluginImageResize from 'filepond-plugin-image-resize'
import FilePondPluginImageTransform from 'filepond-plugin-image-transform'
import 'filepond/dist/filepond.min.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'
import { Alert } from 'react-bootstrap';
var FormData = require('form-data');
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
const AddNewImagesModal = ({ property, onSwap, pillButtons, ...props }) => {


  const [propertyModal, setPropertyModal] = useState(null);
  
    const { data, isLoading, isError } = useQuery(
      ['propertyModal', property.nuo],
      () => fetchPropertyData(property.nuo),
      {
        onSuccess: (data) => setPropertyModal(data),
        enabled: !!property.nuo, // Ensures that `nuo` exists before fetching
      }
    );
  

  const [requestAvailability, setRequestAvailability] = useState('');
  const [newImages, setNewImages] = useState([]);
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

    const formData = new FormData();
    const propertyPayload = {
      propriete_id: Number(property.id),
      url: null,
    };
    //console.log(propertyPayload);
    //alert(propertyPayload);
    formData.append(
      'operations',
      JSON.stringify({
        query: 'mutation UpdatePropertyImage($data: UpdateImageInput!) { updatePropertyImages(input: $data) }',
        variables: { data: propertyPayload },
      })
    );

    let appendMap = '';
    newImages.forEach((image, index) => {
      formData.append(`${index}`, image.file);
      appendMap += `"${index}":["variables.data.url.${index}"]`;
      if (index !== newImages.length - 1) appendMap += ',';
    });

    formData.append('map', `{${appendMap}}`);
    try {
      const response = await axios.post(API_URL, formData, {
        headers: { 'Content-Type': 'application/json' }
      });
      if (response.data?.data?.updatePropertyImages !== null) {
        setDisponibiliteNotification("Les nouvelles images ont bien été ajoutées avec succès.");
      }
    } catch (error) {
      console.error("Error during disponibilite:", error);
    }

    setValidated(true);
  };
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
            <h2 className='h3 mb-2 mb-sm-2'>Ajout de nouvelles images pour le bien immobilier N° {property.nuo}</h2>

            <div className='d-flex align-items-center py-3 mb-3'>
              <CardProperty property={property} />
            </div>
          </div>

          <div className='col-md-6 p-4 p-sm-5'>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <h2 className='mb-4 h5'>
                  <i className='fi-image text-primary fs-5 mt-n1 me-2'></i>
                  Photos du bien immobilier N° {property.nuo}
                </h2>
                <Alert variant='info' className='mb-4 d-flex'>
                  <i className='fi-alert-circle me-2 me-sm-3'></i>
                  <p className='mb-1 fs-sm'>La taille maximale des images est 8M de formats: jpeg, jpg, png. L'image principale  d'abord.<br />
                    La taille max des videos est 10M de formats: mp4, mov.</p>
                </Alert>
                <FilePond
                  onupdatefiles={setNewImages}
                  allowMultiple={true}
                  dropOnPage
                  name="newImages"
                  instantUpload={true}
                  maxFiles={20}
                  labelMaxFileSizeExceeded={"La taille maximale des fichiers est 10M"}
                  labelMaxTotalFileSizeExceeded={"Uniquement 20 fichiers"}
                  dropValidation
                  required={true}
                  labelIdle='<div class="btn btn-primary mb-3"><i class="fi-cloud-upload me-1"></i>Télécharger des photos ou vidéos</div>'
                  acceptedFileTypes={['image/png', 'image/jpeg', 'video/mp4', 'video/mov']}
                  className='file-uploader file-uploader-grid'
                />
                <div className='mt-4'>
                <Button
                type='submit'
                disabled={newImages.length === 0}
                size='lg'
                variant={`primary ${pillButtons ? 'rounded-pill' : ''} w-100`}
              >
                Ajouter maintenant
              </Button>
                </div>
              
              {disponibiliteNotification && <div className="alert alert-success mt-3">{disponibiliteNotification}</div>}
            </Form>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default AddNewImagesModal;