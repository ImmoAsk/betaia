import { useState } from 'react'
import Link from 'next/link'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import CloseButton from 'react-bootstrap/CloseButton'
import ImageLoader from '../ImageLoader'
import PasswordToggle from '../PasswordToggle'
import IAPaginaation from './IAPagination'
import { useSession,getSession } from 'next-auth/react'
import { useUserProperties } from '../../customHooks/realEstateHooks'
import { buildPropertiesArray } from '../../utils/generalUtils'
const RProjectReplyModal = ({ project, onSwap, pillButtons, ...props }) => {

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
    const { data: session } = useSession();
    //const [userProperties, setUserProperties] = useState([]);
    //console.log(session?.user?.id);
    const { data: user_Properties }= useUserProperties(session?.user?.id)
  
    const userProperties = buildPropertiesArray(user_Properties?.data);
    return (
        <Modal {...props} className='signin-modal'>
            <Modal.Body className='px-0 py-2 py-sm-0'>
                <CloseButton
                    onClick={props.onHide}
                    aria-label='Close modal'
                    className='position-absolute top-0 end-0 mt-3 me-3'
                />
                <div className='row mx-0 align-items-center'>
                    <h2 className='h3 mb-4 mb-sm-5'>Participer à un projet immobilier</h2>
                    <div className='col-md-3 border-end-md p-4 p-sm-5'>
                        <div className='d-flex justify-content-center'>
                            Maitre d'ouvrage
                        </div>
                    </div>
                    <div className='col-md-6 border-end-md px-4 pt-2 pb-4 px-sm-5 pb-sm-5 pt-md-5'>
                     {project.description}
                    </div>
                    <div className='col-md-3 px-4 pt-2 pb-4 px-sm-5 pb-sm-5 pt-md-5'>
                        {project.final_date}
                    </div>
                </div>
                <div className='row mx-0 align-items-center'>
                    Sélectionner au moins un bien immobilier dans votre stock qui répond au projet immobilier du client
                </div>
                
                <IAPaginaation dataPagineted={userProperties}/>
                
                <div className='row mx-0 align-items-center'>
                    <Button variant={`outline-info ${pillButtons ? 'rounded-pill' : ''} w-100 mb-3`}>
                        <i className='fi-google fs-lg me-1'></i>
                        Participer
                    </Button>
                </div>
            </Modal.Body>
        </Modal>
    )
}
/* export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
          destination: '/auth/signin',
          permanent: false,
      }
    }
  }
  else{
    const { data: user_Properties }= useUserProperties(session?.user?.id)
    console.log(user_Properties);
    return { props: { session } };
  }
} */
export default RProjectReplyModal
