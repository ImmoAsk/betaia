import React from "react";
import Link from 'next/link'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import ImageLoader from '../../components/ImageLoader'


export default function PropertySlideCard({property}){
    return(
    
        <Row className='gy-md-0 gy-sm-4 gy-3 gx-sm-4 gx-0'>
          <Col md={7}>
            <Link href={property[0].href} passHref>
              <Card
                as='a'
                className='text-decoration-none text-light bg-size-cover bg-position-center border-0 overflow-hidden h-100'
                style={{minHeight: '18.75rem', backgroundImage: `url(${property[0].img[0]})`}}
              >
                <span className='img-gradient-overlay'></span>
                <Card.Body className='pb-0'></Card.Body>
                <Card.Footer className='d-block content-overlay border-0 pt-5 pb-4 mt-2'>
                  <div className='fs-sm text-uppercase pt-2 mb-1'>{property[0].category}</div>
                  <h3 className='h5 text-light mb-1'>{property[0].title}</h3>
                  <div className='fs-sm opacity-70'>
                    <i className='fi-map-pin me-1'></i>
                    {property[0].location}
                  </div>
                </Card.Footer>
              </Card>
            </Link>
          </Col>
          <Col md={5}>
            <Link href={property[1].href} passHref>
              <Card
                as='a'
                className='border-0 overflow-hidden text-decoration-none text-light mb-sm-4 mb-3'
              >
                <Card.Body className='d-flex p-0 position-relative'>
                  <ImageLoader
                    src={property[1].img[0]}
                    width={property[1].img[1]}
                    height={property[1].img[2]}
                    alt='Image'
                  />
                  <span className='img-gradient-overlay zindex-1'></span>
                  <div className='position-absolute start-0 bottom-0 m-n1 p-4 zindex-5'>
                    <div className='fs-sm text-uppercase pt-2 mb-1'>{property[1].category}</div>
                    <h3 className='h5 text-light mb-1'>{property[1].title}</h3>
                    <div className='fs-sm opacity-70'>
                      <i className='fi-map-pin me-1'></i>
                      {property[1].location}
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Link>
            <Link href={property[1].href} passHref>
              <Card
                as='a'
                className='border-0 overflow-hidden text-decoration-none text-light'
              >
                <Card.Body className='d-flex p-0 position-relative'>
                  <ImageLoader
                    src={property[2].img[0]}
                    width={property[2].img[1]}
                    height={property[2].img[2]}
                    alt='Image'
                  />
                  <span className='img-gradient-overlay zindex-1'></span>
                  <div className='position-absolute start-0 bottom-0 m-n1 p-4 zindex-5'>
                    <div className='fs-sm text-uppercase pt-2 mb-1'>{property[2].category}</div>
                    <h3 className='h5 text-light mb-1'>{property[2].title}</h3>
                    <div className='fs-sm opacity-70'>
                      <i className='fi-map-pin me-1'></i>
                      {property[2].location}
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Link>
          </Col>
        </Row>
      
    )
}