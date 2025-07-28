import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { getCsrfToken, getProviders, useSession, signIn } from "next-auth/react"
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import * as Yup from 'yup'
import Link from 'next/link'

const EmbedSigninForm = () => {
  const router = useRouter()
  const [disabledSubmit, setDisabledSubmit] = useState(false)
  const [errorNotification, setErrorNotification] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const togglePasswordVisibility = () => setShowPassword((prev) => !prev)
  const [csrfToken, setCsrfToken] = useState(null);
  const [providers, setProviders] = useState(null);
  const { data: session, status } = useSession();
  useEffect(async () => {
    if (!session && status !== 'loading') {
      if (providers === null) {
        //console.log(providers);
        setProviders(await getProviders());
        //console.log(providers);
        if (csrfToken === null) {
          //console.log(csrfToken);
          setCsrfToken(await getCsrfToken());
          //console.log(csrfToken);
        }
      }
    }

    return () => {
      // cleanup
    }
  });
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .required('Email est obligatoire')
      .email('Email est invalide'),
    password: Yup.string()
      .min(6, 'Le mot de passe doit être au moins 6 caractères')
      .required('Le mot de passe est obligatoire'),
  })

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields }
  } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(validationSchema),
  })

  const onSubmit = async (data) => {
    setDisabledSubmit(true)

    const result = await signIn('credentials', {
      redirect: false,
      email: data.email,
      password: data.password,
    })

    if (result?.ok && !result?.error) {
      router.reload() // ⬅️ Reload the current page after login
    } else {
      setErrorNotification("Mot de passe ou email incorrect. Veuillez essayer de nouveau.")
      setDisabledSubmit(false)
    }
  }

  return (<>
    {errorNotification && (
      <div className="alert alert-danger" role="alert">
        {errorNotification}</div>
    )}
    <Form method="post" onSubmit={handleSubmit(onSubmit)}>
      <input type="hidden" name="csrfToken" value={csrfToken} />

      <Form.Group className='mb-4'>
        <Form.Label>Adresse e-mail</Form.Label>
        <Form.Control
          type="email"
          {...register('email')}
          isValid={touchedFields.email && !errors.email}
          isInvalid={!!errors.email}
          placeholder="Votre email"
        />
        <Form.Control.Feedback type="invalid">
          {errors.email?.message}
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group className='mb-4'>
        <Form.Label>Mot de passe</Form.Label>
        <div className="input-group">
          <Form.Control
            type={showPassword ? 'text' : 'password'}
            {...register('password')}
            isValid={touchedFields.password && !errors.password}
            isInvalid={!!errors.password}
            placeholder="Votre mot de passe"
          />
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={togglePasswordVisibility}
            tabIndex={-1}
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
        </div>
        <Form.Control.Feedback type="invalid">
          {errors.password?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Button
        disabled={disabledSubmit}
        type="submit"
        size="lg"
        className="primary w-100"
      >
        Se connecter
      </Button>
      <div className="text-left mt-3">
        Vous n'avez pas de compte ?{' '}
        <Link href="/signup-light" className="fw-semibold text-decoration-underline">
          Créez-en un ici
        </Link>
      </div>
    </Form>
  </>

  )
}

export default EmbedSigninForm
