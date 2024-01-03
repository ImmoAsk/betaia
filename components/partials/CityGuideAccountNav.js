import { useState } from 'react'
import Link from 'next/link'
import Collapse from 'react-bootstrap/Collapse'
import Nav from 'react-bootstrap/Nav'
import Button from 'react-bootstrap/Button'

const CityGuideAccountNav = ({ activeNav }) => {

  // Collapse state
  const [open, setOpen] = useState(false)


  return (
    <div className='mt-md-n3 mb-4'>
      <Button
        size='lg'
        variant='outline-primary rounded-pill w-100 d-md-none'
        onClick={(e) => {
          e.preventDefault()
          setOpen(!open)
        }}
        aria-controls='accountNav'
        aria-expanded={open}
      >
        <i className='fi-align-justify me-2'></i>
        Account Menu
      </Button>
      <Collapse in={open} className='d-md-block'>
        <div id='accountNav'>
          <Nav variant='pills flex-column flex-md-row pt-3 pt-md-0 pb-md-4 border-bottom-md' defaultActiveKey={activeNav}>
            <Nav.Item className='mb-md-0 me-md-2 pe-md-1'>
              <Link href='/city-guide/account-info' passHref>
                <Nav.Link>
                  <i className='fi-user mt-n1 me-2 fs-base'></i>
                  Personal Info
                </Nav.Link>
              </Link>
            </Nav.Item>
            <Nav.Item className='mb-md-0 me-md-2 pe-md-1'>
              <Link href='/city-guide/account-favorites' passHref>
                <Nav.Link>
                  <i className='fi-heart mt-n1 me-2 fs-base'></i>
                  Favorites
                </Nav.Link>
              </Link>
            </Nav.Item>
            <Nav.Item className='mb-md-0 me-md-2 pe-md-1'>
              <Link href='/city-guide/account-reviews' passHref>
                <Nav.Link>
                  <i className='fi-star mt-n1 me-2 fs-base'></i>
                  Reviews
                </Nav.Link>
              </Link>
            </Nav.Item>
            <Nav.Item className='mb-md-0'>
              <Link href='/city-guide/account-notifications' passHref>
                <Nav.Link>
                  <i className='fi-bell mt-n1 me-2 fs-base'></i>
                  Notifications
                </Nav.Link>
              </Link>
            </Nav.Item>
            <Nav.Item className='d-md-none'>
              <Link href='/signin-light' passHref>
                <Nav.Link>
                  <i className='fi-logout mt-n1 me-2 fs-base'></i>
                  Sign Out
                </Nav.Link>
              </Link>
            </Nav.Item>
          </Nav>
        </div>
      </Collapse>
    </div>
  )
}

export default CityGuideAccountNav
