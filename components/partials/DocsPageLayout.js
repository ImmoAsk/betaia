import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Offcanvas from 'react-bootstrap/Offcanvas'
import Button from 'react-bootstrap/Button'
import Badge from 'react-bootstrap/Badge'
import CloseButton from 'react-bootstrap/CloseButton'
import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'

const DocsPageLayout = (props) => {

  const [show, setShow] = useState(false)

  // Functions to handle Offcanvas show / close state
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  return (
    <>
      <Head>
        <title>Finder Docs | {props.pageTitle}</title>
      </Head>

      <Container fluid className='px-xl-4 pb-3 pb-lg-4'>
        <Row className='container-fixed-nav-start'>
          <Col xxl={9}>

            {/* Navbar */}
            <Navbar as='header' bg='light' className='justify-content-end fixed-top shadow-sm px-3 px-xl-4'>
              <Link href='/docs' passHref>
                <Navbar.Brand className='d-lg-none'>
                  <Image priority src='/images/logo/logo-dark.svg' width={116} height={32} alt='Finder' />
                </Navbar.Brand>
              </Link>
              <Navbar.Toggle className='d-block d-lg-none me-3 ms-auto border-0' onClick={handleShow} />
              <Nav as='ul' className='ms-auto d-none d-lg-flex'>
                <Nav.Item as='li'>
                  <Link href='/' passHref>
                    <Nav.Link active={false}>
                      <i className='fi-device-desktop align-middle fs-base me-2'></i>
                      Live demo
                    </Nav.Link>
                  </Link>
                </Nav.Item>
                <Nav.Item as='li' className='mx-2 border-end' />
                <Nav.Item as='li'>
                  <Link href='/components/typography' passHref>
                    <Nav.Link active={false}>
                      <i className='fi-list align-middle fs-base me-2'></i>
                      Components
                    </Nav.Link>
                  </Link>
                </Nav.Item>
                <Nav.Item as='li' className='mx-2 border-end' />
              </Nav>
              <Button href='#' variant='primary' className='ms-lg-3' target='_blank' rel='noreferrer'>
                <i className='fi-cart me-2 d-none d-sm-inline-block fs-lg'></i>
                Buy now
              </Button>
            </Navbar>

            {/* Side navigation (Wide screens) */}
            <aside className='fixed-nav-start bg-dark'>
              <div className='d-flex align-items-center p-4'>
                <Link href='/components/typography' passHref>
                  <Navbar.Brand>
                    <Image priority src='/images/logo/logo-light.svg' width={116} height={32} alt='Finder' />
                  </Navbar.Brand>
                </Link>
                <Badge bg='info'>Docs</Badge>
              </div>
              <SimpleBar className='fixed-nav-body simplebar-light pt-2 pb-4'>
                <h6 className='fs-base text-light mb-1 py-2'>Contents</h6>
                <Nav as='nav' className='nav-light flex-column' activeKey={props.activeNav}>
                  <Link href='/docs' passHref>
                    <Nav.Link className='fs-sm'>Getting started</Nav.Link>
                  </Link>
                  <Link href='/docs/project-structure' passHref>
                    <Nav.Link className='fs-sm'>Project structure</Nav.Link>
                  </Link>
                  <Link href='/docs/using-sass' passHref>
                    <Nav.Link className='fs-sm'>Using Sass (Scss) instead of CSS</Nav.Link>
                  </Link>
                  <Link href='/docs/browser-support' passHref>
                    <Nav.Link className='fs-sm'>Browser support</Nav.Link>
                  </Link>
                  <Link href='/docs/global-colors' passHref>
                    <Nav.Link className='fs-sm'>Global colors</Nav.Link>
                  </Link>
                  <Link href='/docs/components' passHref>
                    <Nav.Link className='fs-sm'>Components</Nav.Link>
                  </Link>
                  <Link href='/docs/utilities' passHref>
                    <Nav.Link className='fs-sm'>Utility classes</Nav.Link>
                  </Link>
                  <Link href='/docs/ui-icons' passHref>
                    <Nav.Link className='fs-sm'>UI icons (Icon font)</Nav.Link>
                  </Link>
                  <Link href='/docs/mailchimp' passHref>
                    <Nav.Link className='fs-sm'>Mailchimp subscription form</Nav.Link>
                  </Link>
                  <Link href='/docs/credits' passHref>
                    <Nav.Link className='fs-sm'>Sources and credits</Nav.Link>
                  </Link>
                </Nav>
              </SimpleBar>
            </aside>

            {/* Side navigation (Offcanvas - narrow screens) */}
            <Offcanvas placement='start' className='bg-dark' show={show} onHide={handleClose}>
              <Offcanvas.Header className='justify-content-start align-items-center'>
                <h5 className='offcanvas-title text-white me-3'>Menu</h5>
                <Badge bg='info'>Docs</Badge>
                <CloseButton variant='white' className='ms-auto' onClick={handleClose} />
              </Offcanvas.Header>
              <div className='d-flex d-lg-none align-items-center py-4 px-3 border-top border-bottom border-light'>
                <Link href='/' passHref>
                  <Button variant='light' size='sm' className='d-block w-100 me-2'>
                    <i className='fi-device-desktop me-2 fs-base'></i>
                    Demo
                  </Button>
                </Link>
                <Link href='/components/typography' passHref>
                  <Button variant='success' size='sm' className='d-block w-100 me-2'>
                    <i className='fi-list me-2 fs-base'></i>
                    Components
                  </Button>
                </Link>
              </div>
              <SimpleBar className='offcanvas-body simplebar-light pb-4'>
                <h6 className='fs-base text-light mb-1 py-2'>Contents</h6>
                <Nav as='nav' className='nav-light flex-column' activeKey={props.activeNav}>
                  <Link href='/docs' passHref>
                    <Nav.Link className='fs-sm'>Getting started</Nav.Link>
                  </Link>
                  <Link href='/docs/project-structure' passHref>
                    <Nav.Link className='fs-sm'>Project structure</Nav.Link>
                  </Link>
                  <Link href='/docs/using-sass' passHref>
                    <Nav.Link className='fs-sm'>Using Sass (Scss) instead of CSS</Nav.Link>
                  </Link>
                  <Link href='/docs/browser-support' passHref>
                    <Nav.Link className='fs-sm'>Browser support</Nav.Link>
                  </Link>
                  <Link href='/docs/global-colors' passHref>
                    <Nav.Link className='fs-sm'>Global colors</Nav.Link>
                  </Link>
                  <Link href='/docs/components' passHref>
                    <Nav.Link className='fs-sm'>Components</Nav.Link>
                  </Link>
                  <Link href='/docs/utilities' passHref>
                    <Nav.Link className='fs-sm'>Utility classes</Nav.Link>
                  </Link>
                  <Link href='/docs/ui-icons' passHref>
                    <Nav.Link className='fs-sm'>UI icons (Icon font)</Nav.Link>
                  </Link>
                  <Link href='/docs/mailchimp' passHref>
                    <Nav.Link className='fs-sm'>Mailchimp subscription form</Nav.Link>
                  </Link>
                  <Link href='/docs/credits' passHref>
                    <Nav.Link className='fs-sm'>Sources and credits</Nav.Link>
                  </Link>
                </Nav>
              </SimpleBar>
            </Offcanvas>

            {/* Page title */}
            <div className='border-bottom mb-5 pt-5'>
              <h1 className='mt-5 pt-4 pb-2'>{props.pageTitle}</h1>
            </div>

            {/* Page content */}
            {props.children}
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default DocsPageLayout
