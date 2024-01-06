import React, { useState, useEffect } from 'react'
import { getCsrfToken, getProviders, useSession } from "next-auth/react"
import { useRouter } from "next/router";
import { ButtonGroup, Card, Button, Alert, Col, Container, Row } from 'react-bootstrap';

export default function signout() {
  const [csrfToken, setCsrfToken] = useState(null);
  const router = useRouter()

  useEffect(async() => {
    if (status !== 'loading') {
      if (csrfToken === null) {
        setCsrfToken(await getCsrfToken());
      }
    }
  });

  return (
    <>
    <div className="d-flex align-items-center min-vh-100 bg-auth border-top border-top-2 border-primary">
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} md={5} xl={4} className="my-5">
            <form action={`/api/auth/signout`} method='POST'>
              <h1 className="display-4 text-center mb-3">
              <div class="mb-5">
                <img className="navbar-brand-img" src="/img/logo-red.svg" height="70rem" alt="..." />
              </div>
                Se deconnecter
              </h1>
              <p className="text-muted text-center mb-5">Etes vous sur de se déconnecter?</p>
              <input type='hidden' name='csrfToken' value={csrfToken} />
                <Button className="w-100 mb-3" variant="primary" size="lg"  onClick={() => router.back()}>Revenir en arrière</Button>
                <Button className="w-100 mb-3" type='submit' variant='outline-primary' size="lg" >Se déconnecter</Button>
            </form>
          </Col>
        </Row>
      </Container>
    </div>
    </>
  )
}