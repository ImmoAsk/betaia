import { useState } from 'react'
import RealEstatePageLayout from '../../components/partials/RealEstatePageLayout'
import RealEstateAccountLayout from '../../components/partials/RealEstateAccountLayout'
import Link from 'next/link'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Dropdown from 'react-bootstrap/Dropdown'
import PasswordToggle from '../../components/PasswordToggle'
import { useSession,getSession } from 'next-auth/react'
const AccountSecurityPage = () => {

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
    <RealEstatePageLayout
      pageTitle='Account Password &amp; Security'
      activeNav='Account'
      userLoggedIn
    >
      <RealEstateAccountLayout accountPageTitle='Mot de passe & Sécurité'>
        <h1 className='h2'>Mot de passe &amp; Sécurité</h1>
        <p className='pt-1'>Gérer vos parametres et securiser votre compte.</p>
        <h2 className='h5'>Mot de passe</h2>
        <Form
          noValidate
          validated={validated}
          onSubmit={handleSubmit}
          className='pb-4'
        >
          <Row xs={1} sm={2} className='mb-2 align-items-end'>
            <Col className='mb-2'>
              <Form.Label htmlFor='account-password'>Mot de passe actuel</Form.Label>
              <PasswordToggle id='account-password' required />
            </Col>
            <Col className='mb-2'>
              <Link href='#'>
                <a className='mb-2 d-inline-block'>Mot de passe oublié?</a>
              </Link>
            </Col>
          </Row>
          <Row xs={1} sm={2} className='mb-2 align-items-end'>
            <Col className='mb-3'>
              <Form.Label htmlFor='account-password-new'>Nouvel mot de passe</Form.Label>
              <PasswordToggle id='account-password-new' required />
            </Col>
            <Col className='mb-3'>
              <Form.Label htmlFor='account-password-confirm'>Confirm password</Form.Label>
              <PasswordToggle id='account-password-confirm' required />
            </Col>
          </Row>
          <Button type='submit' variant='outline-primary'>Mettre à jour le mot de passe</Button>
        </Form>
        <div className='pt-4 mt-3 border-top'></div>
        <h2 className='pt-2 mb-4 h5'>Liste des sessions ouvertes ou fermées</h2>

        {/* Device */}
        <div className='pb-3 mb-3 d-flex border-bottom'>
          <i className='fi-device-desktop fs-5 text-muted me-1'></i>
          <div className='ps-2'>
            <div className='mb-1 fw-bold'>Mac &mdash; New York, USA</div>
            <span className='d-inline-block fs-sm border-end pe-2 me-2'>Chrome</span>
            <span className='fs-sm fw-bold text-success'>Active now</span>
          </div>
        </div>

        {/* Device */}
        <div className='pb-3 mb-3 d-flex border-bottom'>
          <i className='fi-device-mobile fs-5 text-muted me-1'></i>
          <div className='ps-2'>
            <div className='mb-1 fw-bold'>iPhone 12 &mdash; New York, USA</div>
            <span className='d-inline-block fs-sm border-end pe-2 me-2'>Finder App</span>
            <span className='fs-sm'>20 hours ago</span>
          </div>
          <div className='align-self-center ms-auto'>
            <Dropdown>
              <Dropdown.Toggle size='xs' variant='light btn-icon rounded-circle shadow-sm'>
                <i className='fi-dots-vertical'></i>
              </Dropdown.Toggle>
              <Dropdown.Menu align='end' className='pb-3 my-1'>
                <Dropdown.Item>Not you?</Dropdown.Item>
                <a href='#' className='px-3 d-block'>Sign out</a>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>

        {/* Device */}
        <div className='pb-3 mb-3 d-flex border-bottom'>
          <i className='fi-device-desktop fs-5 text-muted me-1'></i>
          <div className='ps-2'>
            <div className='mb-1 fw-bold'>Windows 10.1 &mdash; New York, USA</div>
            <span className='d-inline-block fs-sm border-end pe-2 me-2'>Chrome</span>
            <span className='fs-sm'>November 15 at 8:42 AM</span>
          </div>
          <div className='align-self-center ms-auto'>
            <Dropdown>
              <Dropdown.Toggle size='xs' variant='light btn-icon rounded-circle shadow-sm'>
                <i className='fi-dots-vertical'></i>
              </Dropdown.Toggle>
              <Dropdown.Menu align='end' className='pb-3 my-1'>
                <Dropdown.Item>Not you?</Dropdown.Item>
                <a href='#' className='px-3 d-block'>Sign out</a>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
        <a href='#' className='mt-3 d-inline-block fw-bold text-decoration-none'>Se déconnecter de toutes les sessions</a>
      </RealEstateAccountLayout>
    </RealEstatePageLayout>
  )
}
export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) {
    context.res.writeHead(302, { Location: "/auth/signin" });
    context.res.end();
    return { props: {} };
  }
  return { props: { session } };
}
export default AccountSecurityPage
