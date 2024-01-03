import { useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import CloseButton from 'react-bootstrap/CloseButton'
import EditProperty from './EditProperty'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

const EditPropertyModal = ({ property, onSwap, pillButtons, ...props }) => {

  // Form validation
  console.log(property);
  const [propertyModal, setPropertyModal] = useState({});

  useQuery(["propertyModal"],
    () => axios.get(`http://127.0.0.1:8000/api/v2?query={propriete(nuo:${property.nuo}){tarifications{id,mode,currency,montant},id,nuo,garage,est_meuble,titre,descriptif,surface,usage,cuisine,salon,piece,wc_douche_interne,cout_mensuel,nuitee,cout_vente,categorie_propriete{denomination,id},infrastructures{id,denomination,icone},meubles{libelle,icone},badge_propriete{id,date_expiration,badge{id,badge_name,badge_image}},pays{id,code,denomination},ville{denomination,id},quartier{id,denomination},adresse{libelle,id},offre{id,denomination},visuels{uri},user{id}}}`).
      then((res) => {
        setPropertyModal(res.data.data.propriete);
        console.log(propertyModal);
      }));
  return (
    <Modal {...props} className='signin-modal'>
      <Modal.Body className='px-0 py-2 py-sm-0'>
        <CloseButton
          onClick={props.onHide}
          aria-label='Close modal'
          className='position-absolute top-0 end-0 mt-3 me-3'
        />
        <div className='row mx-0'>
          <div className='col-md-12 border-end-md p-4 p-sm-5'>
            <h2 className='h3 mb-2 mb-sm-2'>Mise à jour du bien immobilier : {property.nuo}</h2>
            <EditProperty propriete={propertyModal}/>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  )
}
export async function getServerSideProps(context) {
  let { propertyNuo } = context.query;
  // Fetch data from external API
  let dataAPIresponse = await fetch(`http://127.0.0.1:8000/api/v2?query={propriete(nuo:${propertyNuo}){tarifications{id,mode,currency,montant},nuo,garage,est_meuble,titre,descriptif,surface,usage,cuisine,salon,piece,wc_douche_interne,cout_mensuel,nuitee,cout_vente,categorie_propriete{denomination,id},infrastructures{denomination,icone},meubles{libelle,icone},badge_propriete{id,date_expiration,badge{id,badge_name,badge_image}},pays{id,code,denomination},ville{denomination,id},quartier{id,denomination},adresse{libelle},offre{denomination},visuels{uri},user{id}}}`)
  let property = await dataAPIresponse.json()
  property = property.data.propriete;
  console.log(property);
  // Pass data to the page via props
  return { props: { property } }
}
export default EditPropertyModal
