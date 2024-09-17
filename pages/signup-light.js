import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ImageLoader from '../components/ImageLoader';
import PasswordToggle from '../components/PasswordToggle';
import axios from 'axios';
const SignupLightPage = () => {

  // Add class to body to enable gray background
  useEffect(() => {
    const body = document.querySelector('body');
    document.body.classList.add('bg-secondary');
    return () => body.classList.remove('bg-secondary');
  }, []);

  // Router
  const router = useRouter();

  // Form state management
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsChecked, setTermsChecked] = useState(false);
  const [validated, setValidated] = useState(false);

  // Button is enabled if all inputs are filled and valid
  const isFormValid = name && email && password && confirmPassword === password && termsChecked;

  const handleSubmit = (event) => {
    // Prevent the default form submission behavior
    event.preventDefault();

    const form = event.currentTarget;

    // Validate form inputs
    if (form.checkValidity() === false || password !== confirmPassword) {
      event.stopPropagation();
      console.log("Form is invalid. Please check your inputs.");
    } else {
      // Collect form data
      const formData = {
        name,
        email,
        password,
        confirmPassword,
        termsChecked
      };

      // Print collected data to the console
      console.log("Collected Form Data:", formData);
      var _formData = `{name:"${formData.name}",email:"${formData.email}",password:"${formData.password}",password_confirmation:"${formData.confirmPassword}"}`;

      var user_creation_data = JSON.stringify({ query: `mutation{register(input:${_formData}){status,tokens{access_token}}}`, variables: {} });
      var config = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        url: 'https://immoaskbetaapi.omnisoft.africa/public/api/v2',
        data: user_creation_data
      };

      axios.request(config)
        .then((response) => {
          console.log(JSON.stringify(JSON.parse(response.data)));
        })
        .catch((error) => {
          console.log(error);
        });
    }

    setValidated(true);
  };

  return (
    <>
      {/* Custom page title attribute */}
      <Head>
        <title>ImmoAsk | Creer votre compte</title>
      </Head>

      {/* Page wrapper */}
      <main className='page-wrapper'>
        <div className='container-fluid d-flex h-100 align-items-center justify-content-center py-4 py-sm-5'>

          {/* Sign in card */}
          <div className='card card-body' style={{ maxWidth: '940px' }}>
            <div
              className="position-absolute top-0 end-0 nav-link fs-sm py-1 px-2 mt-3 me-3"
              onClick={() => router.back()}
            >
              <i className="fi-arrow-long-left fs-base me-2"></i>
              Precedent
            </div>
            <div className='row mx-0 align-items-center'>
              <div className='col-md-6 border-end-md p-2 p-sm-5'>
                <h2 className='h3 mb-4 mb-sm-5'>Chez vous, c'est ici.<br />Faire l'immobilier que vous voulez:</h2>
                <ul className='list-unstyled mb-4 mb-sm-5'>
                  <li className='d-flex mb-2'>
                    <i className='fi-check-circle text-primary mt-1 me-2'></i>
                    <span>Lister et promouvoir vos bien immobiliers</span>
                  </li>
                  <li className='d-flex mb-2'>
                    <i className='fi-check-circle text-primary mt-1 me-2'></i>
                    <span>Integrer votre logement et payer plus tard</span>
                  </li>
                  <li className='d-flex mb-0'>
                    <i className='fi-check-circle text-primary mt-1 me-2'></i>
                    <span>Automatiser votre experience clientele en immobilier avec notre IA</span>
                  </li>
                  <li className='d-flex mb-0'>
                    <i className='fi-check-circle text-primary mt-1 me-2'></i>
                    <span>Gerer vos biens immobiliers ou que vous soyez</span>
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
                <div className='mt-sm-4 pt-md-3'>Vous avez deja un compte? <Link href='/signin-light'><a>Creer en ici</a></Link></div>
              </div>
              <div className='col-md-6 px-2 pt-2 pb-4 px-sm-5 pb-sm-5 pt-md-5'>
                <Button variant='outline-info w-100 mb-3'>
                  <i className='fi-google fs-lg me-1'></i>
                  Se connecter avec Google
                </Button>
                <Button variant='outline-info w-100 mb-3'>
                  <i className='fi-facebook fs-lg me-1'></i>
                  Se connecter avec Facebook
                </Button>
                <div className='d-flex align-items-center py-3 mb-3'>
                  <hr className='w-100' />
                  <div className='px-3'>Ou</div>
                  <hr className='w-100' />
                </div>
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                  <Form.Group controlId='su-name' className='mb-4'>
                    <Form.Label>Nom et prenom</Form.Label>
                    <Form.Control
                      placeholder='Entrer votre nom et prenom'
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group controlId='su-email' className='mb-4'>
                    <Form.Label>Adresse email</Form.Label>
                    <Form.Control
                      type='email'
                      placeholder='Entrer votre adresse email'
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className='mb-4'>
                    <Form.Label htmlFor='su-password'>
                      Mot de passe <span className='fs-sm text-muted'>min. 8 char</span>
                    </Form.Label>
                    <PasswordToggle
                      id='su-password'
                      minLength='8'
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className='mb-4'>
                    <Form.Label htmlFor='su-confirm-password'>Confirmation de mot de passe</Form.Label>
                    <PasswordToggle
                      id='su-confirm-password'
                      minLength='8'
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Check
                    type='checkbox'
                    id='terms-agree'
                    label={[
                      <span key={1}>En creant votre compte, vous acceptez </span>,
                      <Link key={2} href='#'><a>Termes et conditions</a></Link>,
                      <span key={3}> et </span>,
                      <Link key={4} href='#'><a>Politique de confidentialite</a></Link>
                    ]}
                    required
                    checked={termsChecked}
                    onChange={(e) => setTermsChecked(e.target.checked)}
                    className='mb-4'
                  />
                  <Button type='submit' size='lg' variant='primary w-100' disabled={!isFormValid}>
                    Creer mon compte
                  </Button>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default SignupLightPage;