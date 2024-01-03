import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
//import PasswordToggle from '../components/PasswordToggle'
import { getCsrfToken, signIn,useSession } from "next-auth/react"
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import ImageLoader from '../../components/ImageLoader'
const SigninLightPage = ({ ...props }) => {

  // Add class to body to enable gray background
  useEffect(() => {
    const body = document.querySelector('body')
    document.body.classList.add('bg-secondary')
    return () => body.classList.remove('bg-secondary')
  })

  // Router
  //const router = useRouter()

  // Form validation
  const [validated, setValidated] = useState(false)
  /*  const handleSubmit =  (event) => {
     const form = event.currentTarget
     if (form.checkValidity() === false) {
       event.preventDefault()
       event.stopPropagation()
     } else {
       setValidated(true);
       const userCredential= { username: "kossi@omnisoft.africa", password: "toto2468" }
       console.log(userCredential);
       signIn("credentials",userCredential );
       
     }
   } */

  const { data: session, status } = useSession()

  const [showPassword, setShowPassword] = useState(false);
  const [disabledSubmit, setDisabledSubmit] = useState(false);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter()
  const { query } = useRouter();

  function togglePassword() {
    setPassword(document.querySelector("[name='password']").value);
    setConfirmPassword(document.querySelector("[name='confirmPassword']")?.value);

    setShowPassword(!showPassword);
  }

  function hidePasswordOnSubmit() {
    if (showPassword)
      togglePassword();
  }

  const validationSchema = props.signup ? Yup.object().shape({
    firstName: Yup.string()
      .required('First Name is required'),
    lastName: Yup.string()
      .required('Last name is required'),
    email: Yup.string(),
    password: Yup.string()
      .min(6, 'Le mot de passe doit etre d\'aumoins 6')
      .required('Le mot de passe est obligatoire'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Please confirm your required'),
  }) : Yup.object().shape({
    email: Yup.string()
      .required('Email est obligatoire')
      .email('Email est invalide'),
    password: Yup.string()
      .min(6, 'Le mot de passe doit etre aumoins 6')
      .required('Le mot de passe est obligatoire'),
  });

  const formOptions = {
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    resolver: yupResolver(validationSchema)
  };
  const { register, handleSubmit, reset, formState } = useForm(formOptions);
  const { dirtyFields, errors, touchedFields } = formState;

  const onSubmit = (data, e) => {
    setDisabledSubmit(true);
    hidePasswordOnSubmit();
    e.target.submit();
  };

  const onBlur = (data, e) => {
    if (!props.signup && data.target.value !== '') {
      (async (value, testContext) => {
        const fetcher = await fetch(`https://immoask.com/tg?email=${encodeURIComponent(data.target.value)}`);
        const result = await fetcher.json();
        if (result.available === true)
          router.push(`/auth/signup?email=${encodeURIComponent(data.target.value)}`);
      })()
    }
  };

  var emailInputProps = {
    onBlur: onBlur,
  };

  if (props.signup)
    delete emailInputProps.onBlur;

  return (
    <>
      {/* Custom page title attribute */}
      <Head>
        <title>ImmoAsk | Se connecter</title>
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
                <h2 className='h3 mb-4 mb-sm-5'>Chez vous, c'est ici !<br />Bon retour chez vous.</h2>
                <div className='d-flex justify-content-center'>
                  <ImageLoader
                    src='/images/signin-modal/signin.svg'
                    width={344}
                    height={292}
                    alt='Illusration'
                  />
                </div>
                <div className='mt-4 mt-sm-5'>Vous n'avez pas de compte? <Link href='/signup-light'><a>Créez-en un ici</a></Link></div>
              </div>


              {(props.providers && props.csrfToken !== null && props.providers['credentials'] && status !== "loading") && (


                <div className='col-md-6 px-2 pt-2 pb-4 px-sm-5 pb-sm-5 pt-md-5'>
                  {/* Creation of ImmoAsk accounts with existing social account */}
                  {!props.signup && Object.keys(props.providers).map((providerKey, i) => (
                    <>
                      {
                        props.providers[providerKey].type !== "credentials" && (
                          <><Form action={props.providers[providerKey].signinUrl} method="POST">
                            <input type="hidden" name="csrfToken" value={props.csrfToken} />
                            {props.providers[providerKey].callbackUrl && (
                              <input type="hidden" name="callbackUrl" value={props.query.callbackUrl} />
                            )}
                            <Button variant='outline-info w-100 mb-3' type="submit" className="w-100 mb-3" size="lg">
                              S'inscrire avec {props.providers[providerKey].name} <i className={"fs-lg me-1 fi-" + props.providers[providerKey].id} role="img" aria-label="Facebook" style={{ "marginLeft": "0.5em" }}></i>
                            </Button>
                          </Form>
                            <div className='d-flex align-items-center py-3 mb-3'>
                              <hr className='w-100' />
                              <div className='px-3'>Ou</div>
                              <hr className='w-100' />
                            </div></>
                        )
                      }
                    </>
                  ))}

                  
                    <Form action={props.providers['credentials'].callbackUrl} method="post" onSubmit={handleSubmit(onSubmit)}>
                      <input type="hidden" name="csrfToken" value={props.csrfToken} />
                      <Form.Group className='mb-4'>
                        <Form.Label>Adresse e-mail</Form.Label>
                        <Form.Control required type="email" name="email" {...register('email')} isValid={touchedFields.email && !errors.email} isInvalid={errors.email} defaultValue={query.email} placeholder="Votre email" />
                        <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
                        <Form.Control.Feedback type="valid">{props.signup && "Email is not taken"}</Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group className='mb-4'>
                        <div className='d-flex align-items-center justify-content-between mb-2'>
                          <Form.Label htmlFor='si-password' className='mb-0'>Mot de passe</Form.Label>
                          {!props.signup && (
                            <Link href="/password-reset" passHref>
                              <Form.Text as="a" className="fs-sm small text-muted">
                                Mot de passe oublié?
                              </Form.Text>
                            </Link>
                          )}
                        </div>
                        <Form.Control
                          type='password'
                          tabIndex="4" name="password"  {...register('password')}
                          defaultValue={password}
                          isValid={touchedFields.password && !errors.password}
                          isInvalid={errors.password}
                          placeholder="Enter your password"
                        />
                        <Form.Control.Feedback type="invalid">{errors.password?.message}</Form.Control.Feedback>
                        {/* <PasswordToggle id='si-password' placeholder='Enter password' required/> */}
                      </Form.Group>
                      <Button disabled={disabledSubmit ? true : false} type="submit" size="lg" className="primary w-100">
                        {props.signup ? "Ouvrir un compte" : "Se connecter"}
                      </Button>

                    </Form>
                </div>
              )}

            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default SigninLightPage
