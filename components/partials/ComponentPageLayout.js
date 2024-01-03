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
import ScrollLink from '../ScrollLink'
import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'

const ComponentPageLayout = (props) => {

  const [show, setShow] = useState(false)

  // Functions to handle Offcanvas show / close state
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  return (
    <>
      <Head>
        <title>Finder UI Kit | {props.pageTitle}</title>
      </Head>

      <Container fluid className='px-xl-4 pb-3 pb-lg-4'>
        <Row className='container-fixed-nav-start'>
          <Col xl={9}>

            {/* Navbar */}
            <Navbar as='header' bg='light' className='justify-content-end fixed-top shadow-sm px-3 px-xl-4'>
              <Link href='/components/typography' passHref>
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
                  <Link href='/docs' passHref>
                    <Nav.Link active={false}>
                      <i className='fi-file align-middle fs-base me-2'></i>
                      Documentation
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
                <Badge bg='success'>UI Kit</Badge>
              </div>
              <SimpleBar className='fixed-nav-body simplebar-light pt-2 pb-4'>
                <h6 className='fs-base text-light mb-1 py-2'>Content</h6>
                <Nav as='nav' className='nav-light flex-column' activeKey={props.activeNav}>
                  <Link href='/components/typography' passHref>
                    <Nav.Link className='fs-sm'>Typography</Nav.Link>
                  </Link>
                  <Link href='/components/icon-font' passHref>
                    <Nav.Link className='fs-sm'>Icon font</Nav.Link>
                  </Link>
                  <Link href='/components/code' passHref>
                    <Nav.Link className='fs-sm'>Code</Nav.Link>
                  </Link>
                  <Link href='/components/images' passHref>
                    <Nav.Link className='fs-sm'>Images &amp; figures</Nav.Link>
                  </Link>
                  <Link href='/components/tables' passHref>
                    <Nav.Link className='fs-sm'>Tables</Nav.Link>
                  </Link>
                </Nav>
                <hr className='text-light opacity-15 mx-n4 mt-4' />
                <h6 className='fs-base text-light mx-n4 mb-1 pt-4 pb-2 px-4'>Components</h6>
                <Nav as='nav' className='nav-light flex-column' activeKey={props.activeNav}>
                  <Link href='/components/accordion' passHref>
                    <Nav.Link className='fs-sm'>Accordion</Nav.Link>
                  </Link>
                  <Link href='/components/alerts' passHref>
                    <Nav.Link className='fs-sm'>Alerts</Nav.Link>
                  </Link>
                  <Link href='/components/badge' passHref>
                    <Nav.Link className='fs-sm'>Badges</Nav.Link>
                  </Link>
                  <Link href='/components/breadcrumb' passHref>
                    <Nav.Link className='fs-sm'>Breadcrumb</Nav.Link>
                  </Link>
                  <Link href='/components/buttons' passHref>
                    <Nav.Link className='fs-sm'>Buttons</Nav.Link>
                  </Link>
                  <Link href='/components/button-group' passHref>
                    <Nav.Link className='fs-sm'>Button group</Nav.Link>
                  </Link>
                  <Link href='/components/cards-basic' passHref>
                    <Nav.Link className='fs-sm'>Cards: Basic</Nav.Link>
                  </Link>
                  <Link href='/components/cards-advanced' passHref>
                    <Nav.Link className='fs-sm'>Cards: Advanced</Nav.Link>
                  </Link>
                  <Link href='/components/carousel' passHref>
                    <Nav.Link className='fs-sm'>Carousel (Slider)</Nav.Link>
                  </Link>
                  <Link href='/components/date-picker' passHref>
                    <Nav.Link className='fs-sm'>Date / time picker</Nav.Link>
                  </Link>
                  <Link href='/components/dropdowns' passHref>
                    <Nav.Link className='fs-sm'>Dropdowns</Nav.Link>
                  </Link>
                  <Link href='/components/file-uploader' passHref>
                    <Nav.Link className='fs-sm'>File uploader</Nav.Link>
                  </Link>
                  <Link href='/components/forms' passHref>
                    <Nav.Link className='fs-sm'>Forms</Nav.Link>
                  </Link>
                  <Link href='/components/form-group' passHref>
                    <Nav.Link className='fs-sm'>Form group</Nav.Link>
                  </Link>
                  <Link href='/components/gallery' passHref>
                    <Nav.Link className='fs-sm'>Gallery</Nav.Link>
                  </Link>
                  <Link href='/components/input-group' passHref>
                    <Nav.Link className='fs-sm'>Input group</Nav.Link>
                  </Link>
                  <Link href='/components/icon-box' passHref>
                    <Nav.Link className='fs-sm'>Icon box</Nav.Link>
                  </Link>
                  <Link href='/components/maps' passHref>
                    <Nav.Link className='fs-sm'>Interactive maps</Nav.Link>
                  </Link>
                  <Link href='/components/list-group' passHref>
                    <Nav.Link className='fs-sm'>List group</Nav.Link>
                  </Link>
                  <Link href='/components/modal' passHref>
                    <Nav.Link className='fs-sm'>Modal</Nav.Link>
                  </Link>
                  <Link href='/components/navbar' passHref>
                    <Nav.Link className='fs-sm'>Navbar</Nav.Link>
                  </Link>
                  <Link href='/components/offcanvas' passHref>
                    <Nav.Link className='fs-sm'>Offcanvas</Nav.Link>
                  </Link>
                  <Link href='/components/pagination' passHref>
                    <Nav.Link className='fs-sm'>Pagination</Nav.Link>
                  </Link>
                  <Link href='/components/parallax' passHref>
                    <Nav.Link className='fs-sm'>Parallax</Nav.Link>
                  </Link>
                  <Link href='/components/pills' passHref>
                    <Nav.Link className='fs-sm'>Pills</Nav.Link>
                  </Link>
                  <Link href='/components/placeholders' passHref>
                    <Nav.Link className='fs-sm'>Placeholders</Nav.Link>
                  </Link>
                  <Link href='/components/popovers' passHref>
                    <Nav.Link className='fs-sm'>Popovers</Nav.Link>
                  </Link>
                  <Link href='/components/pricing' passHref>
                    <Nav.Link className='fs-sm'>Pricing</Nav.Link>
                  </Link>
                  <Link href='/components/progress' passHref>
                    <Nav.Link className='fs-sm'>Progress</Nav.Link>
                  </Link>
                  <Link href='/components/social-buttons' passHref>
                    <Nav.Link className='fs-sm'>Social buttons</Nav.Link>
                  </Link>
                  <Link href='/components/spinners' passHref>
                    <Nav.Link className='fs-sm'>Spinners</Nav.Link>
                  </Link>
                  <Link href='/components/steps' passHref>
                    <Nav.Link className='fs-sm'>Steps</Nav.Link>
                  </Link>
                  <Link href='/components/tabs' passHref>
                    <Nav.Link className='fs-sm'>Tabs</Nav.Link>
                  </Link>
                  <Link href='/components/testimonials' passHref>
                    <Nav.Link className='fs-sm'>Testimonials / reviews</Nav.Link>
                  </Link>
                  <Link href='/components/toasts' passHref>
                    <Nav.Link className='fs-sm'>Toasts</Nav.Link>
                  </Link>
                  <Link href='/components/tooltips' passHref>
                    <Nav.Link className='fs-sm'>Tooltips</Nav.Link>
                  </Link>
                </Nav>
                <hr className='text-light opacity-15 mx-n4 mt-4' />
                <h6 className='fs-base text-light mx-n4 mb-1 pt-4 pb-2 px-4'>Utilities</h6>
                <Nav as='nav' className='nav-light flex-column' activeKey={props.activeNav}>
                  <Nav.Link href='https://getbootstrap.com/docs/5.1/utilities/background/' className='fs-sm' target='_blank' rel='noreferrer'>Bootstrap CSS Classes</Nav.Link>
                  <Nav.Link href='https://react-bootstrap.github.io/utilities/transitions/' className='fs-sm' target='_blank' rel='noreferrer'>React Bootstrap</Nav.Link>
                  <Link href='/components/utilities' passHref>
                    <Nav.Link className='fs-sm'>Finder</Nav.Link>
                  </Link>
                </Nav>
              </SimpleBar>
            </aside>

            {/* Side navigation (Offcanvas - narrow screens) */}
            <Offcanvas placement='start' className='bg-dark' show={show} onHide={handleClose}>
              <Offcanvas.Header className='justify-content-start align-items-center'>
                <h5 className='offcanvas-title text-white me-3'>Menu</h5>
                <Badge bg='success'>UI Kit</Badge>
                <CloseButton variant='white' className='ms-auto' onClick={handleClose} />
              </Offcanvas.Header>
              <div className='d-flex d-lg-none align-items-center py-4 px-3 border-top border-bottom border-light'>
                <Link href='/' passHref>
                  <Button variant='light' size='sm' className='d-block w-100 me-2'>
                    <i className='fi-device-desktop me-2 fs-base'></i>
                    Demo
                  </Button>
                </Link>
                <Link href='/docs' passHref>
                  <Button variant='info' size='sm' className='d-block w-100 me-2'>
                    <i className='fi-file me-2 fs-base'></i>
                    Documentation
                  </Button>
                </Link>
              </div>
              <SimpleBar className='offcanvas-body simplebar-light pb-4'>
                <h6 className='fs-base text-light mb-1 py-2'>Content</h6>
                <Nav as='nav' className='nav-light flex-column' activeKey={props.activeNav}>
                  <Link href='/components/typography' passHref>
                    <Nav.Link className='fs-sm'>Typography</Nav.Link>
                  </Link>
                  <Link href='/components/icon-font' passHref>
                    <Nav.Link className='fs-sm'>Icon font</Nav.Link>
                  </Link>
                  <Link href='/components/code' passHref>
                    <Nav.Link className='fs-sm'>Code</Nav.Link>
                  </Link>
                  <Link href='/components/images' passHref>
                    <Nav.Link className='fs-sm'>Images &amp; figures</Nav.Link>
                  </Link>
                  <Link href='/components/tables' passHref>
                    <Nav.Link className='fs-sm'>Tables</Nav.Link>
                  </Link>
                </Nav>
                <hr className='text-light opacity-15 mx-n4 mt-4' />
                <h6 className='fs-base text-light mx-n4 mb-1 pt-4 pb-2 px-4'>Components</h6>
                <Nav as='nav' className='nav-light flex-column' activeKey={props.activeNav}>
                  <Link href='/components/accordion' passHref>
                    <Nav.Link className='fs-sm'>Accordion</Nav.Link>
                  </Link>
                  <Link href='/components/alerts' passHref>
                    <Nav.Link className='fs-sm'>Alerts</Nav.Link>
                  </Link>
                  <Link href='/components/badge' passHref>
                    <Nav.Link className='fs-sm'>Badges</Nav.Link>
                  </Link>
                  <Link href='/components/breadcrumb' passHref>
                    <Nav.Link className='fs-sm'>Breadcrumb</Nav.Link>
                  </Link>
                  <Link href='/components/buttons' passHref>
                    <Nav.Link className='fs-sm'>Buttons</Nav.Link>
                  </Link>
                  <Link href='/components/button-group' passHref>
                    <Nav.Link className='fs-sm'>Button group</Nav.Link>
                  </Link>
                  <Link href='/components/cards-basic' passHref>
                    <Nav.Link className='fs-sm'>Cards: Basic</Nav.Link>
                  </Link>
                  <Link href='/components/cards-advanced' passHref>
                    <Nav.Link className='fs-sm'>Cards: Advanced</Nav.Link>
                  </Link>
                  <Link href='/components/carousel' passHref>
                    <Nav.Link className='fs-sm'>Carousel</Nav.Link>
                  </Link>
                  <Link href='/components/date-picker' passHref>
                    <Nav.Link className='fs-sm'>Date / time picker</Nav.Link>
                  </Link>
                  <Link href='/components/dropdowns' passHref>
                    <Nav.Link className='fs-sm'>Dropdowns</Nav.Link>
                  </Link>
                  <Link href='/components/file-uploader' passHref>
                    <Nav.Link className='fs-sm'>File uploader</Nav.Link>
                  </Link>
                  <Link href='/components/forms' passHref>
                    <Nav.Link className='fs-sm'>Forms</Nav.Link>
                  </Link>
                  <Link href='/components/form-group' passHref>
                    <Nav.Link className='fs-sm'>Form group</Nav.Link>
                  </Link>
                  <Link href='/components/gallery' passHref>
                    <Nav.Link className='fs-sm'>Gallery</Nav.Link>
                  </Link>
                  <Link href='/components/input-group' passHref>
                    <Nav.Link className='fs-sm'>Input group</Nav.Link>
                  </Link>
                  <Link href='/components/icon-box' passHref>
                    <Nav.Link className='fs-sm'>Icon box</Nav.Link>
                  </Link>
                  <Link href='/components/maps' passHref>
                    <Nav.Link className='fs-sm'>Interactive maps</Nav.Link>
                  </Link>
                  <Link href='/components/list-group' passHref>
                    <Nav.Link className='fs-sm'>List group</Nav.Link>
                  </Link>
                  <Link href='/components/modal' passHref>
                    <Nav.Link className='fs-sm'>Modal</Nav.Link>
                  </Link>
                  <Link href='/components/navbar' passHref>
                    <Nav.Link className='fs-sm'>Navbar</Nav.Link>
                  </Link>
                  <Link href='/components/offcanvas' passHref>
                    <Nav.Link className='fs-sm'>Offcanvas</Nav.Link>
                  </Link>
                  <Link href='/components/pagination' passHref>
                    <Nav.Link className='fs-sm'>Pagination</Nav.Link>
                  </Link>
                  <Link href='/components/parallax' passHref>
                    <Nav.Link className='fs-sm'>Parallax</Nav.Link>
                  </Link>
                  <Link href='/components/pills' passHref>
                    <Nav.Link className='fs-sm'>Pills</Nav.Link>
                  </Link>
                  <Link href='/components/placeholders' passHref>
                    <Nav.Link className='fs-sm'>Placeholders</Nav.Link>
                  </Link>
                  <Link href='/components/popovers' passHref>
                    <Nav.Link className='fs-sm'>Popovers</Nav.Link>
                  </Link>
                  <Link href='/components/pricing' passHref>
                    <Nav.Link className='fs-sm'>Pricing</Nav.Link>
                  </Link>
                  <Link href='/components/progress' passHref>
                    <Nav.Link className='fs-sm'>Progress</Nav.Link>
                  </Link>
                  <Link href='/components/social-buttons' passHref>
                    <Nav.Link className='fs-sm'>Social buttons</Nav.Link>
                  </Link>
                  <Link href='/components/spinners' passHref>
                    <Nav.Link className='fs-sm'>Spinners</Nav.Link>
                  </Link>
                  <Link href='/components/steps' passHref>
                    <Nav.Link className='fs-sm'>Steps</Nav.Link>
                  </Link>
                  <Link href='/components/tabs' passHref>
                    <Nav.Link className='fs-sm'>Tabs</Nav.Link>
                  </Link>
                  <Link href='/components/testimonials' passHref>
                    <Nav.Link className='fs-sm'>Testimonials / reviews</Nav.Link>
                  </Link>
                  <Link href='/components/toasts' passHref>
                    <Nav.Link className='fs-sm'>Toasts</Nav.Link>
                  </Link>
                  <Link href='/components/tooltips' passHref>
                    <Nav.Link className='fs-sm'>Tooltips</Nav.Link>
                  </Link>
                </Nav>
                <hr className='text-light opacity-15 mx-n4 mt-4' />
                <h6 className='fs-base text-light mx-n4 mb-1 pt-4 pb-2 px-4'>Utilities</h6>
                <Nav as='nav' className='nav-light flex-column' activeKey={props.activeNav}>
                  <Nav.Link href='https://getbootstrap.com/docs/5.1/utilities/background/' className='fs-sm' target='_blank' rel='noreferrer'>Bootstrap CSS Classes</Nav.Link>
                  <Nav.Link href='https://react-bootstrap.github.io/utilities/transitions/' className='fs-sm' target='_blank' rel='noreferrer'>React Bootstrap</Nav.Link>
                  <Link href='/components/utilities' passHref>
                    <Nav.Link className='fs-sm'>Finder</Nav.Link>
                  </Link>
                </Nav>
              </SimpleBar>
            </Offcanvas>

            {/* Page title + description */}
            <div className='border-bottom mb-5 pt-5'>
              <h1 className='mt-5 pt-4'>{props.pageTitle}</h1>
              <div className='d-flex flex-wrap flex-md-nowrap justify-content-between'>
                <p className='text-muted'>{props.pageDescription}</p>
                {props.docsLink ? 
                  <p className='pt-1 fs-sm fw-bold ps-md-4'>
                    <a href={props.docsLink} className='text-decoration-none text-nowrap' target='_blank' rel='noreferrer'>
                      {props.docsLinkLabel}
                      <i className='fi-external-link align-middle ms-2 mt-n1'></i>
                    </a>
                  </p> :
                  <div className='ps-md-4 mb-3'>
                    <Badge bg='success'>Finder component</Badge>
                  </div>
                }
              </div>
            </div>

            {/* Page content */}
            {props.children}
          </Col>

          {/* Quick (anchor) navigation */}
          {props.anchorLinks && <Col xl={3} className='d-none d-xl-block ps-4 ps-xxl-5'>
            <aside className='sticky-top pt-5'>
              <div className='pt-5 mt-5'>
                <div className='ps-4 border-start'>
                  <h3 className='h6'>Jump to</h3>
                  {props.anchorLinks.map((link, index) => <ScrollLink to={link.anchor} spy={true} smooth='easeInOutQuart' duration={600} offset={-110} className='nav-link scroll-link py-1 px-0 fs-sm fw-normal' key={index}>{link.label}</ScrollLink>)}
                </div>
              </div>
            </aside>
          </Col>}
        </Row>
      </Container>
    </>
  )
}

export default ComponentPageLayout
