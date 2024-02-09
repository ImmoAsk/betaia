import { useState } from 'react'
import Link from 'next/link'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import CloseButton from 'react-bootstrap/CloseButton'
import ImageLoader from '../ImageLoader'
import PasswordToggle from '../PasswordToggle'

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

    return (
        <Modal {...props} className='signin-modal'>
            <Modal.Body className='px-0 py-2 py-sm-0'>
                <CloseButton
                    onClick={props.onHide}
                    aria-label='Close modal'
                    className='position-absolute top-0 end-0 mt-3 me-3'
                />
                <div className='row mx-0 align-items-center'>
                    <h2 className='h3 mb-4 mb-sm-5'>Participer a un projet immobilier</h2>
                    <div className='col-md-3 border-end-md p-4 p-sm-5'>
                        <div className='d-flex justify-content-center'>
                            Contact du Maitre doeuvre
                        </div>
                    </div>
                    <div className='col-md-6 border-end-md px-4 pt-2 pb-4 px-sm-5 pb-sm-5 pt-md-5'>
                     {project.description}
                    </div>
                    <div className='col-md-3 px-4 pt-2 pb-4 px-sm-5 pb-sm-5 pt-md-5'>
                        Echeance
                    </div>
                </div>
                <div className='row mx-0 align-items-center'>
                    Selectionner aumoins un bien immobilier dans votre stock
                    qui repond au prjet immobilierdu client
                </div>
                <div className='row mx-0 align-items-center'>
                    Listing des biens de l'agent avec la pagination
                </div>
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

export default RProjectReplyModal
