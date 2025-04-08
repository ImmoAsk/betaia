import { useState } from 'react'
import Link from 'next/link'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Collapse from 'react-bootstrap/Collapse'


import CardNav from '../../CardNav'

import StarRating from '../../StarRating'
import Avatar from '../../Avatar'

const PublicBoardSideBar = ({ accountPageTitle, children }) => {

  // State to control Collapse
  const [open, setOpen] = useState(false)

  //const { data: session } = useSession();
  //console.log(session);
  //const roleId = Number(session && session.user?.roleId);
  //console.log(roleId);

  return (
    <Container fluid className='pt-5 pb-lg-4 mt-5 mb-sm-2'>

      <Row>

        {/* Sidebar (Account nav) */}
        <Col md={5} lg={3} className='pe-xl-4 mb-5'>
          <div className='card card-body border-0 shadow-sm pb-1 me-lg-1'>
            <div className='d-flex d-md-block d-lg-flex align-items-start pt-lg-2 mb-4'>
              <Avatar img={{ src: '/images/avatars/45.jpg', alt: 'ImmoAsk' }} size={[48, 48]} />
              <div className='pt-md-2 pt-lg-0 ps-3 ps-md-0 ps-lg-3'>
                <h2 className='fs-lg mb-0'>MAC Immobilier</h2>
                {/* <MediumRealEstateAgencyCard user={session ? session.user?.id:"1"} /> */}
                <StarRating rating={4.8} />
                <ul className='list-unstyled fs-sm mt-3 mb-0'>
                <li>
                    <a href='#' className='nav-link fw-normal p-0'>
                      <i className='fi-user opacity-60 me-2'></i>
                      Kossi ADANOU
                    </a>
                  </li>
                  <li>
                    <a href='tel:+22870453625' className='nav-link fw-normal p-0'>
                      <i className='fi-phone opacity-60 me-2'></i>
                      +22870453625
                    </a>
                  </li>
                  <li>
                    <a href='mailto:contact@immoask.com' className='nav-link fw-normal p-0'>
                      <i className='fi-mail opacity-60 me-2'></i>
                      contact@immoask.com
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            {/* Enroller une propriété */}
            <Button
              variant='outline-secondary'
              className='d-block d-md-none w-100 mb-3'
              onClick={() => setOpen(!open)}
              aria-controls='account-menu'
              aria-expanded={open}
            >
              <i className='fi-align-justify me-2'></i>
              Menu
            </Button>
            <Collapse in={open} className='d-md-block'>
              <div id='account-menu'>
                <CardNav className='pt-3'>
                  <CardNav.Item href='/tg/catalog' icon='fi-home'>
                    Sejours
                  </CardNav.Item>
                  <CardNav.Item href='/tg/catalog' icon='fi-apartment'>
                    Logements
                  </CardNav.Item>
                  <CardNav.Item href='/tg/catalog' icon='fi-home'>
                    Entreprises
                  </CardNav.Item>
                  <CardNav.Item href='/tg/catalog' icon='fi-apartment'>
                    Acquisitions
                  </CardNav.Item>
                </CardNav>
              </div>
            </Collapse>
          </div>
        </Col>

        {/* Page content */}
        <Col md={7} lg={9} className='mb-5'>
          {children}
        </Col>
      </Row>
    </Container>
  )
}


export default PublicBoardSideBar
