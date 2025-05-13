import Nouislider from "nouislider-react";
import { Col, FormGroup, Row ,DropdownSelect,Button} from "react-bootstrap";

export default function RealEstateSearchBar({townkeyw,disctrictkeyw,offerkeyw,categorykeyw,rangekeyw}){
    return(
        <Row className='mt-lg-1'>
          {/* Search property form group */}
          <Col lg={12} xl={2}></Col>
          <Col lg={12} xl={8} className='zindex-2 justify-content-center'>
            <FormGroup className='d-block'>
              <Row className='g-0 ms-sm-n2'>
                <Col md={8} className='d-sm-flex align-items-center'>
                  <DropdownSelect
                      defaultValue='Type du bien immobilier'
                      icon='fi-list'
                      options={[
                        [null, 'Maison'],
                        [null, 'Apartement'],
                        [null, 'Immeuble commercial'],
                        [null, 'Studio meublé'],
                        [null, 'Chambre salon'],
                        [null, 'Chambre(Pièce)'],
                        [null, 'Appartement meublé'],
                        [null, 'Villa meublée'],
                        [null, 'Terrain'],
                        [null, 'Boutique'],
                        [null, 'Bureau'],
                        [null, 'Espace-coworking'],
                        [null, 'Magasins'],
                      ]}
                      variant='link ps-2 ps-sm-3'
                      className='w-sm-50 border-end-md'
                  />
                  <hr className='d-sm-none my-2' />
                  <DropdownSelect
                    defaultValue='A louer'
                    icon='fi-home'
                    options={[
                      [null, 'A louer'],
                      [null, 'A vendre'],
                      [null, 'A colouer'],
                      [null, 'A hypothéquer'],
                      [null, 'A investir'],
                    ]}
                    variant='link ps-2 ps-sm-3'
                    className='w-sm-50 border-end-sm'
                  />
                  <hr className='d-sm-none my-2' />
                  <DropdownSelect
                    defaultValue='Emplacement'
                    icon='fi-map-pin'
                    options={[
                      [null, 'Lome'],
                      [null, 'Aneho'],
                      [null, 'Kpalime'],
                      [null, 'Tsevie']
                    ]}
                    variant='link ps-2 ps-sm-3'
                    className='w-sm-50 border-end-sm'
                  />
                </Col>
                <hr className='d-md-none mt-2' />
                <Col md={4} className='d-sm-flex align-items-center pt-4 pt-md-0'>
                  <div className='d-flex align-items-center w-100 pt-2 pb-4 py-sm-0 ps-2 ps-sm-3'>
                    <i className='fi-cash fs-lg text-muted me-2'></i>
                    <span className='text-muted'>Budget</span>
                    <div className='range-slider pe-0 pe-sm-3'>
                      <Nouislider
                        range={{min: 20000, max: 1500000000}}
                        start={1000}
                        format={{
                          to: value => 'XOF' + parseInt(value, 10),
                          from: value => Number(value)
                        }}
                        connect={`lower`}
                        tooltips
                        className='range-slider-ui'
                      />
                    </div>
                  </div>
                  <Button variant='primary btn-icon px-3 w-100 w-sm-auto flex-shrink-0'>
                    <i className='fi-search'></i>
                    <span className='d-sm-none d-inline-block ms-2'>Trouver</span>
                  </Button>
                </Col>
              </Row>
            </FormGroup>
          </Col>
          <Col lg={12} xl={2}></Col>
        </Row>
    )
}