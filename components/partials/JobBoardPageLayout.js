import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import Dropdown from 'react-bootstrap/Dropdown'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import StickyNavbar from '../StickyNavbar'
import ImageLoader from '../ImageLoader'
import SocialButton from '../SocialButton'
import MarketButton from '../../components/MarketButton'
import SignInModalLight from '../partials/SignInModalLight'
import SignUpModalLight from '../partials/SignUpModalLight'

const JobBoardPageLayout = (props) => {

  // Sign in modal
  const [signinShow, setSigninShow] = useState(false)
  const handleSigninClose = () => setSigninShow(false)
  const handleSigninShow = () => setSigninShow(true)

  // Sign up modal
  const [signupShow, setSignupShow] = useState(false)
  const handleSignupClose = () => setSignupShow(false)
  const handleSignupShow = () => setSignupShow(true)

  // Swap modals
  const handleSignInToUp = (e) => {
    e.preventDefault()
    setSigninShow(false)
    setSignupShow(true)
  }
  const handleSignUpToIn = (e) => {
    e.preventDefault()
    setSigninShow(true)
    setSignupShow(false)
  }


  return (
    <>
      <Head>
        <title>Finder | Job Board | {props.pageTitle}</title>
      </Head>

      {/* Sign in modal */}
      {!props.userLoggedIn && <SignInModalLight
        centered
        size='lg'
        pillButtons
        show={signinShow}
        onHide={handleSigninClose}
        onSwap={handleSignInToUp}
      />}

      {/* Sign up modal */}
      {!props.userLoggedIn && <SignUpModalLight
        centered
        size='lg'
        pillButtons
        show={signupShow}
        onHide={handleSignupClose}
        onSwap={handleSignUpToIn}
      />}


      {/* Page wrapper for sticky footer
      Wraps everything except footer to push footer to the bottom of the page if there is little content */}
      <main className='page-wrapper'>

        {/* Navbar (main site header with branding and navigation) */}
        <Navbar as={StickyNavbar}
          expand='lg'
          className={`fixed-top${props.navbarExtraClass ? ` ${props.navbarExtraClass}` : ''} navbar-dark bg-dark`}
        >
          <Container>
            <Link href='/job-board' passHref>
              <Navbar.Brand className='me-3 me-xl-4'>
                <ImageLoader priority src='/images/logo/logo-light.svg' width={116} height={32} placeholder={false} alt='Finder' />
              </Navbar.Brand>
            </Link>
            <Navbar.Toggle aria-controls='navbarNav' className='ms-auto' />

            {/* Display content depending on user auth status  */}
            {props.userLoggedIn ? <Dropdown className='d-none d-lg-block order-lg-3 my-n2 me-3'>
              <Link href='/job-board/account-profile' passHref>
                <Dropdown.Toggle as={Nav.Link} className='dropdown-toggle-flush d-flex py-1 px-0' style={{width: '40px'}}>
                  <ImageLoader src='/images/avatars/35.png' width={80} height={80} placeholder={false} className='rounded-circle' alt='Annette Black' />
                </Dropdown.Toggle>
              </Link>
              <Dropdown.Menu variant='dark' renderOnMount align='end'>
                <div className='d-flex align-items-start border-bottom border-light px-3 py-1 mb-2' style={{width: '16rem'}}>
                  <ImageLoader src='/images/avatars/25.png' width={48} height={48} placeholder={false} className='rounded-circle' alt='Annette Black' />
                  <div className='ps-2'>
                    <h6 className='fs-base mb-0 text-light'>Annette Black</h6>
                    <div className='fs-xs py-2'>
                      (302) 555-0107<br/>annette_black@email.com
                    </div>
                  </div>
                </div>
                <Link href='/job-board/account-profile' passHref>
                  <Dropdown.Item>
                    <i className='fi-settings me-2'></i>
                    Profile Settings
                  </Dropdown.Item>
                </Link>
                <Link href='/job-board/account-resumes' passHref>
                  <Dropdown.Item>
                    <i className='fi-file me-2'></i>
                    My Resumes
                  </Dropdown.Item>
                </Link>
                <Link href='/job-board/account-saved-jobs' passHref>
                  <Dropdown.Item>
                    <i className='fi-heart me-2'></i>
                    Saved Jobs
                  </Dropdown.Item>
                </Link>
                <Link href='/job-board/account-notifications' passHref>
                  <Dropdown.Item>
                    <i className='fi-bell me-2'></i>
                    Notifications
                  </Dropdown.Item>
                </Link>
                <Dropdown.Divider as='div' />
                <Link href='/signin-light' passHref>
                  <Dropdown.Item>
                    <i className='fi-logout me-2'></i>
                    Sign Out
                  </Dropdown.Item>
                </Link>
              </Dropdown.Menu>
            </Dropdown> :
              <>
                <Button size='sm' variant='link btn-light d-none d-lg-block order-lg-3' onClick={handleSigninShow}>
                  <i className='fi-user me-2'></i>
                  Sign in
                </Button>
              </>
            }
            <Link href='/job-board/post-resume-1' passHref>
              <Button size='sm' className='rounded-pill order-lg-3 ms-2'>
                <i className='fi-plus me-2'></i>
                Post resume
              </Button>
            </Link>
            {props.pageTitle === 'Home v.2' ? <Link href='/job-board' passHref>
              <Button size='sm' variant='link btn-light d-none d-lg-block order-lg-3 ms-2 pe-0'>
                For job seekers
                <i className='fi-arrow-long-right ms-2'></i>
              </Button>
            </Link> : <Link href='/job-board/index-2' passHref>
              <Button size='sm' variant='link btn-light d-none d-lg-block order-lg-3 ms-2 pe-0'>
                For employers
                <i className='fi-arrow-long-right ms-2'></i>
              </Button>
            </Link>}

            <Navbar.Collapse id='navbarNav' className='order-md-2'>
              <Nav navbarScroll style={{maxHeight: '35rem'}}>
                <Nav.Item as={Dropdown} className='me-lg-2'>
                  <Dropdown.Toggle as={Nav.Link} className='align-items-center pe-lg-4'>
                    <i className='fi-layers me-2'></i>
                    Demos
                    <span className='d-none d-lg-block position-absolute top-50 end-0 translate-middle-y border-end border-light' style={{width: '1px', height: '30px'}}></span>
                  </Dropdown.Toggle>
                  <Dropdown.Menu variant='dark' renderOnMount>
                    <Link href='/real-estate' passHref>
                      <Dropdown.Item>
                        <i className='fi-building fs-base me-2'></i>
                        Real Estate Demo
                      </Dropdown.Item>
                    </Link>
                    <Dropdown.Divider as='div' />
                    <Link href='/car-finder' passHref>
                      <Dropdown.Item>
                        <i className='fi-car fs-base me-2'></i>
                        Car Finder Demo
                      </Dropdown.Item>
                    </Link>
                    <Dropdown.Divider as='div' />
                    <Link href='/job-board' passHref>
                      <Dropdown.Item>
                        <i className='fi-briefcase fs-base me-2'></i>
                        Job Board Demo
                      </Dropdown.Item>
                    </Link>
                    <Dropdown.Divider as='div' />
                    <Link href='/city-guide' passHref>
                      <Dropdown.Item>
                        <i className='fi-map-pin fs-bas me-2'></i>
                        City Guide Demo
                      </Dropdown.Item>
                    </Link>
                    <Dropdown.Divider as='div' />
                    <Link href='/' passHref>
                      <Dropdown.Item>
                        <i className='fi-home fs-base me-2'></i>
                        Main Page
                      </Dropdown.Item>
                    </Link>
                    <Link href='/components/typography' passHref>
                      <Dropdown.Item>
                        <i className='fi-list fs-base me-2'></i>
                        Components
                      </Dropdown.Item>
                    </Link>
                    <Link href='/docs' passHref>
                      <Dropdown.Item>
                        <i className='fi-file fs-base me-2'></i>
                        Documentation
                      </Dropdown.Item>
                    </Link>
                  </Dropdown.Menu>
                </Nav.Item>
                <Nav.Item as={Dropdown}>
                  <Dropdown.Toggle as={Nav.Link} active={props.activeNav==='Home'}>Home</Dropdown.Toggle>
                  <Dropdown.Menu variant='dark' renderOnMount>
                    <Link href='/job-board' passHref>
                      <Dropdown.Item>For Job Seekers</Dropdown.Item>
                    </Link>
                    <Link href='/job-board/index-2' passHref>
                      <Dropdown.Item>For Employers</Dropdown.Item>
                    </Link>
                  </Dropdown.Menu>
                </Nav.Item>
                <Nav.Item as={Dropdown}>
                  <Dropdown.Toggle as={Nav.Link} active={props.activeNav==='Catalog'}>Catalog</Dropdown.Toggle>
                  <Dropdown.Menu variant='dark' renderOnMount>
                    <Link href='/job-board/catalog' passHref>
                      <Dropdown.Item>List of Jobs</Dropdown.Item>
                    </Link>
                    <Link href='/job-board/single' passHref>
                      <Dropdown.Item>Single Job Page</Dropdown.Item>
                    </Link>
                  </Dropdown.Menu>
                </Nav.Item>
                <Nav.Item as={Dropdown}>
                  <Dropdown.Toggle as={Nav.Link} active={props.activeNav==='Account'}>Account</Dropdown.Toggle>
                  <Dropdown.Menu variant='dark' renderOnMount>
                    <Dropdown>
                      <Dropdown.Toggle as={Dropdown.Item}>Account Pages</Dropdown.Toggle>
                      <Dropdown.Menu variant='dark' renderOnMount>
                        <Link href='/job-board/account-profile' passHref>
                          <Dropdown.Item>Profile Settings</Dropdown.Item>
                        </Link>
                        <Link href='/job-board/account-resumes' passHref>
                          <Dropdown.Item>My Resumes</Dropdown.Item>
                        </Link>
                        <Link href='/job-board/account-saved-jobs' passHref>
                          <Dropdown.Item>Saved Jobs</Dropdown.Item>
                        </Link>
                        <Link href='/job-board/account-notifications' passHref>
                          <Dropdown.Item>Notifications</Dropdown.Item>
                        </Link>
                        <Link href='/signin-light' passHref>
                          <Dropdown.Item>Sign in</Dropdown.Item>
                        </Link>
                        <Link href='/signup-light' passHref>
                          <Dropdown.Item>Sign up</Dropdown.Item>
                        </Link>
                      </Dropdown.Menu>
                    </Dropdown>
                    <Dropdown>
                      <Dropdown.Toggle as={Dropdown.Item}>Post Resume</Dropdown.Toggle>
                      <Dropdown.Menu variant='dark' renderOnMount>
                        <Link href='/job-board/post-resume-1' passHref>
                          <Dropdown.Item>Step 1: Basic Info</Dropdown.Item>
                        </Link>
                        <Link href='/job-board/post-resume-2' passHref>
                          <Dropdown.Item>Step 2: Education</Dropdown.Item>
                        </Link>
                        <Link href='/job-board/post-resume-3' passHref>
                          <Dropdown.Item>Step 3: Work Experience</Dropdown.Item>
                        </Link>
                        <Link href='/job-board/post-resume-4' passHref>
                          <Dropdown.Item>Step 4: Skills</Dropdown.Item>
                        </Link>
                        <Link href='/job-board/post-resume-5' passHref>
                          <Dropdown.Item>Step 5: Review</Dropdown.Item>
                        </Link>
                      </Dropdown.Menu>
                    </Dropdown>
                    <Link href='/job-board/promotion' passHref>
                      <Dropdown.Item>Ad Promotion Page</Dropdown.Item>
                    </Link>
                    <Link href='/job-board/employer-single' passHref>
                      <Dropdown.Item>Employer / Company Page</Dropdown.Item>
                    </Link>
                  </Dropdown.Menu>
                </Nav.Item>
                <Nav.Item as={Dropdown}>
                  <Dropdown.Toggle as={Nav.Link} active={props.activeNav==='Pages'}>Pages</Dropdown.Toggle>
                  <Dropdown.Menu variant='dark' renderOnMount>
                    <Link href='/job-board/about' passHref>
                      <Dropdown.Item>About</Dropdown.Item>
                    </Link>
                    <Dropdown>
                      <Dropdown.Toggle as={Dropdown.Item}>Blog</Dropdown.Toggle>
                      <Dropdown.Menu variant='dark' renderOnMount>
                        <Link href='/job-board/blog' passHref>
                          <Dropdown.Item>Blog Grid</Dropdown.Item>
                        </Link>
                        <Link href='/job-board/blog-single' passHref>
                          <Dropdown.Item>Blog Single</Dropdown.Item>
                        </Link>
                      </Dropdown.Menu>
                    </Dropdown>
                    <Link href='/job-board/contacts' passHref>
                      <Dropdown.Item>Contacts</Dropdown.Item>
                    </Link>
                    <Dropdown>
                      <Dropdown.Toggle as={Dropdown.Item}>Help Center</Dropdown.Toggle>
                      <Dropdown.Menu variant='dark' renderOnMount>
                        <Link href='/job-board/help-center' passHref>
                          <Dropdown.Item>Help Topics</Dropdown.Item>
                        </Link>
                        <Link href='/job-board/help-center-single' passHref>
                          <Dropdown.Item>Single Topic</Dropdown.Item>
                        </Link>
                      </Dropdown.Menu>
                    </Dropdown>
                    <Link href='/job-board/404-not-found' passHref>
                      <Dropdown.Item>404 Not Found</Dropdown.Item>
                    </Link>
                  </Dropdown.Menu>
                </Nav.Item>

                {/* Display content depending on user auth satus  */}
                {props.userLoggedIn ?<Nav.Item as={Dropdown} className='d-lg-none'>
                  <Dropdown.Toggle as={Nav.Link} className='d-flex align-items-center'>
                    <ImageLoader src='/images/avatars/35.png' width={30} height={30} placeholder={false} className='rounded-circle' alt='Annette Black' />
                    <span className='ms-2'>Annette Black</span>
                  </Dropdown.Toggle>
                  <Dropdown.Menu variant='dark'>
                    <div className='fs-xs ps-3 py-2'>
                      (302) 555-0107<br/>annette_black@email.com
                    </div>
                    <Link href='/job-board/account-profile' passHref>
                      <Dropdown.Item>
                        <i className='fi-settings me-2'></i>
                        Profile Settings
                      </Dropdown.Item>
                    </Link>
                    <Link href='/job-board/account-resumes' passHref>
                      <Dropdown.Item>
                        <i className='fi-file me-2'></i>
                        My Resumes
                      </Dropdown.Item>
                    </Link>
                    <Link href='/job-board/account-saved-jobs' passHref>
                      <Dropdown.Item>
                        <i className='fi-heart me-2'></i>
                        Saved Jobs
                      </Dropdown.Item>
                    </Link>
                    <Link href='/job-board/account-notifications' passHref>
                      <Dropdown.Item>
                        <i className='fi-bell me-2'></i>
                        Notifications
                      </Dropdown.Item>
                    </Link>
                    <Dropdown.Divider as='div' />
                    <Link href='/signin-light' passHref>
                      <Dropdown.Item>Sign Out</Dropdown.Item>
                    </Link>
                  </Dropdown.Menu>
                </Nav.Item> : 

                <Nav.Item className='d-lg-none'>
                  <Nav.Link onClick={handleSigninShow}>
                    <i className='fi-user me-2'></i>
                    Sign in
                  </Nav.Link>
                </Nav.Item>}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>


        {/* Page content */}
        {props.children}
      </main>


      {/* Footer */}
      <footer className='footer bg-dark pt-5'>
        <Container className='pb-2'>
          <Row className='align-items-center pb-4'>
            <Col md={6} xl={5}>

              {/* Links */}
              <Row xs={1} sm={3} className='gy-4'>
                <Col>
                  <h3 className='h6 mb-2 pb-1 fs-base text-light'>Finder</h3>
                  <ul className='list-unstyled fs-sm'>
                    <li><Link href='#'><a className='nav-link-light'>About us</a></Link></li>
                    <li><Link href='#'><a className='nav-link-light'>News</a></Link></li>
                    <li><Link href='#'><a className='nav-link-light'>Contacts</a></Link></li>
                  </ul>
                </Col>
                <Col>
                  <h3 className='h6 mb-2 pb-1 fs-base text-light'>For Job Seekers</h3>
                  <ul className='list-unstyled fs-sm'>
                    <li><Link href='#'><a className='nav-link-light'>Find job</a></Link></li>
                    <li><Link href='#'><a className='nav-link-light'>Post a resume</a></Link></li>
                    <li><Link href='#'><a className='nav-link-light'>Vacancy mailing</a></Link></li>
                  </ul>
                </Col>
                <Col>
                  <h3 className='h6 mb-2 pb-1 fs-base text-light'>For Employers</h3>
                  <ul className='list-unstyled fs-sm'>
                    <li><Link href='#'><a className='nav-link-light'>Find resume</a></Link></li>
                    <li><Link href='#'><a className='nav-link-light'>Post a job</a></Link></li>
                    <li><Link href='#'><a className='nav-link-light'>Resume mailing</a></Link></li>
                  </ul>
                </Col>
              </Row>

              {/* Socials */}
              <div className='text-nowrap border-top border-light mt-3 py-4'>
                <SocialButton href='#' brand='facebook' variant='translucent' roundedCircle light className='me-2' />
                <SocialButton href='#' brand='twitter' variant='translucent' roundedCircle light className='me-2' />
                <SocialButton href='#' brand='messenger' variant='translucent' roundedCircle light className='me-2' />
                <SocialButton href='#' brand='telegram' variant='translucent' roundedCircle light className='me-2' />
                <SocialButton href='#' brand='whatsapp' variant='translucent' roundedCircle light />
              </div>
            </Col>
            <Col md={6} xl={{offset: 1}}>
              <div className='d-flex align-items-center'>
                <Card className='card-light w-100' style={{maxWidth: '526px'}}>
                  <Card.Body className='p-4 p-xl-5 my-2 my-md-0'>
                    <div style={{maxWidth: '380px'}}>
                      <h3 className='h4 text-light'>Download Our App</h3>
                      <p className='fs-sm text-light opacity-70 mb-2 mb-lg-3'>Now finding the new job just got even easier with our new app!</p>
                      <div className='d-flex flex-column flex-sm-row ms-n3'>
                        <MarketButton href='#' market='apple' target='_blank' className='mt-3 ms-3' />
                        <MarketButton href='#' market='google' target='_blank' className='mt-3 ms-3' />
                      </div>
                    </div>
                  </Card.Body>
                </Card>
                <div className='d-none d-xl-block ms-n4'>
                  <ImageLoader priority src='/images/job-board/footer-mobile.svg' width={116} height={233} alt='Mobile app' />
                </div>
              </div>
            </Col>
          </Row>

          {/* Copyright */}
          <p className='fs-sm text-center text-sm-start mb-4'>
            <span className='text-light opacity-50'>&copy; All rights reserved. Made by </span>
            <a href='https://createx.studio/' className='nav-link-light fw-bold' target='_blank' rel='noreferrer'>Createx Studio</a>
          </p>
        </Container>
      </footer>
    </>
  )
}

export default JobBoardPageLayout
