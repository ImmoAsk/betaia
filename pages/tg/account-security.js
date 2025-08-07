import { useState } from 'react'
import RealEstatePageLayout from '../../components/partials/RealEstatePageLayout'
import RealEstateAccountLayout from '../../components/partials/RealEstateAccountLayout'
import Link from 'next/link'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import PasswordToggle from '../../components/PasswordToggle'
import { useSession, getSession } from 'next-auth/react'
import axios from 'axios'
import { API_URL } from '../../utils/settings'

const AccountSecurityPage = () => {
  const { data: session } = useSession()

  const [validated, setValidated] = useState(false)
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errorNotification, setErrorNotification] = useState('')
  const [successNotification, setSuccessNotification] = useState('')

  const handlePasswordSubmit = async (event) => {
    event.preventDefault()
    const form = event.currentTarget
    setValidated(true)

    // Basic validation
    if (!oldPassword || !newPassword || !confirmPassword) {
      setErrorNotification('Veuillez remplir tous les champs.')
      return
    }
    if (newPassword !== confirmPassword) {
      setErrorNotification('Les mots de passe ne correspondent pas.')
      return
    }

    setErrorNotification('')
    setSuccessNotification('')

    const query = `
      mutation UpdateUserProfile($input: UpdatePassword!) {
        updatePassword(input: $input) {
          status
          message
        }
      }
    `

    const variables = {
      input: {
        old_password: oldPassword,
        password: newPassword,
        password_confirmation: confirmPassword,
      }
    }

    try {
      const headers = {
        Authorization: `Bearer ${session?.user?.token}`,
        'Content-Type': 'application/json',
      }

      console.log('Headers:', headers)
      const response = await axios.post(
        API_URL,
        {
          query,
          variables,
        },
        {
          headers
        }
      )


      const result = response.data.data?.updatePassword
      console.log('Response2:', result)
      if (result?.status === 'PASSWORD_UPDATED') {
        setSuccessNotification('Mot de passe mis à jour avec succès.')
        setOldPassword('')
        setNewPassword('')
        setConfirmPassword('')
        setValidated(false)
      } else {
        setErrorNotification(result?.message || 'Une erreur est survenue.')
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour :', error)
      setErrorNotification("Erreur du serveur. Veuillez réessayer.")
    }
  }

  return (
    <RealEstatePageLayout
      pageTitle='Mot de passe & Sécurité'
      activeNav='Account'
      userLoggedIn={!!session}
    >
      <RealEstateAccountLayout accountPageTitle='Mot de passe & Sécurité'>
        <h1 className='h2'>Mot de passe & Sécurité</h1>
        <p className='pt-1'>Gérez vos paramètres et sécurisez votre compte.</p>

        <h2 className='h5 mt-4'>Modifier le mot de passe</h2>

        {errorNotification && (
          <div className='alert alert-danger'>{errorNotification}</div>
        )}

        {successNotification && (
          <div className='alert alert-success'>{successNotification}</div>
        )}

        <Form
          noValidate
          validated={validated}
          onSubmit={handlePasswordSubmit}
          className='pb-4'
        >
          <Row xs={1} sm={2} className='mb-3'>
            <Col className='mb-3'>
              <Form.Label htmlFor='current-password'>Mot de passe actuel</Form.Label>
              <PasswordToggle
                id='current-password'
                required
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </Col>
            <Col className='align-self-end'>
              <Link href='#' className='d-inline-block mb-2'>Mot de passe oublié ?</Link>
            </Col>
          </Row>

          <Row xs={1} sm={2} className='mb-3'>
            <Col className='mb-3'>
              <Form.Label htmlFor='new-password'>Nouveau mot de passe</Form.Label>
              <PasswordToggle
                id='new-password'
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </Col>
            <Col className='mb-3'>
              <Form.Label htmlFor='confirm-password'>Confirmation</Form.Label>
              <PasswordToggle
                id='confirm-password'
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Col>
          </Row>

          <Button type='submit' variant='outline-primary'>
            Mettre à jour le mot de passe
          </Button>
        </Form>
      </RealEstateAccountLayout>
    </RealEstatePageLayout>
  )
}

export async function getServerSideProps(context) {
  const session = await getSession(context)
  if (!session) {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      }
    }
  }
  return { props: { session } }
}

export default AccountSecurityPage
