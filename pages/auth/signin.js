import React, { useState, useEffect } from 'react'
import { getCsrfToken, getProviders, useSession } from "next-auth/react"
import { useRouter } from "next/router";
import { Alert } from 'react-bootstrap';
import SigninLightPage from './signin-light';

export default function signin({ ...props }) {
  const [providers, setProviders] = useState(null);
  const [csrfToken, setCsrfToken] = useState(null);
  const router = useRouter();
  const { data: session, status } = useSession();

  if (session && status === 'authenticated') {
    router.push('/tg/account-properties');
  }

  useEffect(async () => {
    if (!session && status !== 'loading') {
      if (providers === null) {
        console.log(providers);
        setProviders(await getProviders());
        console.log(providers);
        if (csrfToken === null) {
          console.log(csrfToken);
          setCsrfToken(await getCsrfToken());
          console.log(csrfToken);
        }
      }
    }

    return () => {
      // cleanup
    }
  });

  const { query } = useRouter();

  return (

    <>
      {query.error && (
        <>
          <Alert variant="danger">
            Connexion impossible. Verifier votre email ou mot de passe!.
          </Alert>
        </>
      )}

      <SigninLightPage providers={providers} csrfToken={csrfToken} query={query} signup={props.signup ? true : false} />


    </>
  )
}