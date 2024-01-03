import { useState } from 'react'
import Link from 'next/link'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import CloseButton from 'react-bootstrap/CloseButton'
import ImageLoader from '../ImageLoader'
import PasswordToggle from '../PasswordToggle'

const SignUpModalLight = ({ onSwap, pillButtons, ...props }) => {

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
    <Modal {...props} className='signup-modal'>
      <Modal.Body className='px-0 py-2 py-sm-0'>
        <CloseButton
          onClick={props.onHide}
          aria-label='Close modal'
          className='position-absolute top-0 end-0 mt-3 me-3'
        />
        <div className='row mx-0 align-items-center'>
          <div className='col-md-6 border-end-md p-4 p-sm-5'>
            <h2 className='h3 mb-4 mb-sm-5'>Chez vous, c'est ici !<br />Nous joindre:</h2>
            <ul className='list-unstyled mb-4 mb-sm-5'>
              <li className='d-flex mb-2'>
                <i className='fi-check-circle text-primary mt-1 me-2'></i>
                <span>Lister et promouvoir vos biens immobiliers</span>
              </li>
              <li className='d-flex mb-2'>
                <i className='fi-check-circle text-primary mt-1 me-2'></i>
                <span>Collecter vos loyers à l'ère 3.0</span>
              </li>
              <li className='d-flex mb-0'>
                <i className='fi-check-circle text-primary mt-1 me-2'></i>
                <span>Gérer les biens immobilier par un clic</span>
              </li>
              <li className='d-flex mb-0'>
                <i className='fi-check-circle text-primary mt-1 me-2'></i>
                <span>Placer une pierre dans les immeubles</span>
              </li>
              <li className='d-flex mb-0'>
                <i className='fi-check-circle text-primary mt-1 me-2'></i>
                <span>Pre-verifier la disponibilité </span>
              </li>
            </ul>
            <div className='d-flex justify-content-center'>
              <ImageLoader
                src='/images/signin-modal/signup.svg'
                width={344}
                height={404}
                alt='Illusration'
              />
            </div>
            <div className='mt-sm-4 pt-md-3'>Vous avez déjà un compte ici ? <a href='#' onClick={onSwap}>Se connecter plutot</a></div>
          </div>
          <div className='col-md-6 px-4 pt-2 pb-4 px-sm-5 pb-sm-5 pt-md-5'>
            <Button variant={`outline-info ${pillButtons ? 'rounded-pill' : ''} w-100 mb-3`}>
              <i className='fi-google fs-lg me-1'></i>
              Continuer avec un compte Gmail
            </Button>
            <Button variant={`outline-info ${pillButtons ? 'rounded-pill' : ''} w-100 mb-3`}>
              <i className='fi-facebook fs-lg me-1'></i>
              Continuer avec un compte Facebook
            </Button>
            <div className='d-flex align-items-center py-3 mb-3'>
              <hr className='w-100' />
              <div className='px-3'>Ou</div>
              <hr className='w-100' />
            </div>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <Form.Group controlId='su-name' className='mb-4'>
                <Form.Label>Nom complet</Form.Label>
                <Form.Control
                  placeholder='Entrer votre nom complet'
                  required
                />
              </Form.Group>
              <Form.Group controlId='su-email' className='mb-4'>
                <Form.Label>Adresse e-mail</Form.Label>
                <Form.Control
                  type='email'
                  placeholder='Entrer votre e-mail'
                  required
                />
              </Form.Group>
              <Form.Group className='mb-4'>
                <Form.Label htmlFor='su-password'>
                  Mot de passe <span className='fs-sm text-muted'>min. 8 char</span>
                </Form.Label>
                <PasswordToggle id='su-password' minLength='8' required />
              </Form.Group>
              <Form.Group className='mb-4'>
                <Form.Label htmlFor='su-confirm-password'>Confirmer le mot de passe</Form.Label>
                <PasswordToggle id='su-confirm-password' minLength='8' required />
              </Form.Group>
              <Form.Check
                type='checkbox'
                id='terms-agree'
                label={[<span key={1}>En ouvrant ce compte, J'accepte </span>, <Link key={2} href='#'><a>Les Conditions d'Utilisations</a></Link>, <span key={3}> et </span>, <Link key={4} href='#'><a>la Sécurité des données</a></Link>]}
                required
                className='mb-4'
              />
              <Button type='submit' size='lg' variant={`primary ${pillButtons ? 'rounded-pill' : ''} w-100`}>Souscrire maintenant</Button>
            </Form>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default SignUpModalLight
