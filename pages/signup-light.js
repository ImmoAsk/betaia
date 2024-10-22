import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ImageLoader from '../components/ImageLoader';
import PasswordToggle from '../components/PasswordToggle';
import Alert from 'react-bootstrap/Alert';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import axios from 'axios';

const SignupLightPage = () => {
  // Router
  const router = useRouter();

  // Form state management
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsChecked, setTermsChecked] = useState(false);
  const [validated, setValidated] = useState(false);
  const [accountCreatedNotification, setAccountCreatedNotification] = useState(null);

  // Check if the form is valid
  const isFormValid = phone && name && email && password && confirmPassword && password === confirmPassword && termsChecked;

  // Form submission handler
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate form inputs
    if (!isFormValid) {
      console.log("Le formulaire n'est pas valide. Verifier les champs");
      setValidated(true);
      return;
    }

    // Collect form data
    const formData = {
      name,
      email,
      password,
      confirmPassword,
      termsChecked,
      phone
    };

    // Prepare GraphQL mutation
    const user_creation_data = {
      query: `mutation Register($input: RegisterInput!) {
        register(input: $input) {
          status
          tokens {
            access_token
          }
        }
      }`,
      variables: {
        input: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          password_confirmation: formData.confirmPassword
        }
      }
    };

    try {
      const response = await axios.post('https://immoaskbetaapi.omnisoft.africa/public/api/v2', user_creation_data, {
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.data?.data?.register?.status === "SUCCESS") {
        setAccountCreatedNotification("Votre compte a bien été créé. Vous pouvez maintenant vous connecter.");
        router.push("/auth/signin");
      }
    } catch (error) {
      console.error(error);
    }

    setValidated(true);
  };

  useEffect(() => {
    document.body.classList.add('bg-secondary');
    return () => document.body.classList.remove('bg-secondary');
  }, []);

  return (
    <>
      {/* Custom page title */}
      <Head>
        <title>ImmoAsk | Créer votre compte</title>
      </Head>

      {/* Page content */}
      <main className="page-wrapper">
        <div className="container-fluid d-flex h-100 align-items-center justify-content-center py-4 py-sm-5">
          <div className="card card-body" style={{ maxWidth: '940px' }}>
            <div className="position-absolute top-0 end-0 nav-link fs-sm py-1 px-2 mt-3 me-3" onClick={() => router.back()}>
              <i className="fi-arrow-long-left fs-base me-2"></i>
              Précédent
            </div>
            <div className="row mx-0 align-items-center">
              <div className="col-md-6 border-end-md p-2 p-sm-5">
                <h2 className="h3 mb-4 mb-sm-5">Chez vous, c'est ici.<br />Faire l'immobilier que vous voulez:</h2>
                <ul className="list-unstyled mb-4 mb-sm-5">
                  {/* Bullet points */}
                </ul>
                <div className="d-flex justify-content-center">
                  <ImageLoader src="/images/signin-modal/signup.svg" width={344} height={404} alt="Illustration" />
                </div>
                <div className="mt-sm-4 pt-md-3">Vous avez déja un compte? <Link href="/auth/signin"><a>Se connecter</a></Link></div>
              </div>
              <div className="col-md-6 px-2 pt-2 pb-4 px-sm-5 pb-sm-5 pt-md-5">
                <Button variant="outline-info w-100 mb-3">
                  <i className="fi-google fs-lg me-1"></i> Se connecter avec Google
                </Button>
                <Button variant="outline-info w-100 mb-3">
                  <i className="fi-facebook fs-lg me-1"></i> Se connecter avec Facebook
                </Button>
                <div className="d-flex align-items-center py-3 mb-3">
                  <hr className="w-100" />
                  <div className="px-3">Ou</div>
                  <hr className="w-100" />
                </div>

                {accountCreatedNotification && (
                  <Alert variant="success" className="d-flex mb-4">
                    <i className="fi-alert-circle me-2 me-sm-3"></i>
                    <p className="fs-sm mb-1">{accountCreatedNotification}</p>
                  </Alert>
                )}

                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                  <Form.Group controlId="su-name" className="mb-4">
                    <Form.Label>Nom et prenom</Form.Label>
                    <Form.Control
                      placeholder="Entrer votre nom et prenom"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group controlId="su-email" className="mb-4">
                    <Form.Label>Adresse email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Entrer votre adresse email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className='mb-2'>
                    <Form.Label>Numéro de téléphone</Form.Label>
                    <PhoneInput
                      country={'tg'}
                      value={phone}
                      onChange={(phone) => setPhone(phone)}
                      enableSearch={true}
                      inputProps={{
                        name: 'phone',
                        required: true,
                        autoFocus: true,
                        className: 'form-control w-100 form-control-lg',
                      }}
                    />
                    <Form.Control.Feedback type="invalid">
                      Veuillez saisir un numéro de téléphone valide.
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-4">
                    <Form.Label htmlFor="su-password">Mot de passe <span className="fs-sm text-muted">min. 8 caracteres</span></Form.Label>
                    <PasswordToggle
                      id="su-password"
                      minLength="8"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className="mb-4">
                    <Form.Label htmlFor="su-confirm-password">Confirmation de mot de passe</Form.Label>
                    <PasswordToggle
                      id="su-confirm-password"
                      minLength="8"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Check
                    type="checkbox"
                    id="terms-agree"
                    label={[
                      <span key={1}>En créant votre compte, vous acceptez </span>,
                      <Link key={2} href="#"><a>Termes et Conditions</a></Link>,
                      <span key={3}> et </span>,
                      <Link key={4} href="#"><a>Politique de confidentialité</a></Link>
                    ]}
                    required
                    checked={termsChecked}
                    onChange={(e) => setTermsChecked(e.target.checked)}
                    className="mb-4"
                  />
                  <Button type="submit" size="lg" variant="primary w-100" disabled={!isFormValid}>
                    Créer mon compte
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
