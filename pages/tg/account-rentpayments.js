import { useState } from 'react'
import RealEstatePageLayout from '../../components/partials/RealEstatePageLayout'
import RealEstateAccountLayout from '../../components/partials/RealEstateAccountLayout'
import Link from 'next/link'
import Nav from 'react-bootstrap/Nav'
import Button from 'react-bootstrap/Button'
import { Container, Row, Col, Form, Table } from 'react-bootstrap';
import PropertyCard from '../../components/PropertyCard'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import getPropertyFullUrl from '../../utils/getPropertyFullURL'
import getFirstImageArray from '../../utils/formatFirsImageArray'
import buildPropertyBadge from '../../utils/buildPropertyBadge'
import { useSession,getSession } from 'next-auth/react'

const AccountRentPaymentsPage = () => {

  // Properties array

  const [properties, setProperties] = useState([]);
  
  const { data: session } = useSession();
  const user_id = session ? session.user.id :0;
  useQuery(["RTProperties"],
  ()=> axios.get(`https://immoaskbetaapi.omnisoft.africa/public/api/v2?query={getUserProperties(user_id:${user_id},first:5){data{surface,badge_propriete{badge{badge_name,badge_image}},id,nuo,usage,offre{denomination},categorie_propriete{denomination},pays{code},piece,titre,garage,cout_mensuel,ville{denomination},wc_douche_interne,cout_vente,quartier{denomination},visuels{uri}}}}`).
  then((res)=>{
    setProperties(res.data.data.getUserProperties.data.map((property) =>{
      return {
        href: getPropertyFullUrl(property.pays.code,property.offre.denomination,property.categorie_propriete.denomination,property.ville.denomination,property.quartier.denomination,property.nuo),
        images: getFirstImageArray(property.visuels),
        title: 'N°'+property.nuo+': '+property.categorie_propriete.denomination+' à '+property.offre.denomination+' | '+property.surface+'m²',
        category: property.usage,
        location: property.quartier.denomination+", "+property.ville.denomination,
        price: property.cout_mensuel==0 ? property.cout_vente +" XOF":property.cout_mensuel+" XOF",
        badges: buildPropertyBadge(property.badge_propriete),
        amenities: [property.piece, property.wc_douche_interne, property.garage]
      }
    }));
  }));
  console.log(properties);
  const deleteAll = (e) => {
    e.preventDefault()
    setProperties([])
  }
  const [filters, setFilters] = useState({
    byMonth: '',
    status: '',
    dateOfPayment: ''
  });

  const [payments, setPayments] = useState([
    {
      status: 'Paid',
      property: 'Apartment A',
      month: 'January 2024',
      renter: 'Kossi A.',
      rentPaid: 45000,
      rentFront: 0,
      date: '05-01-2024',
      action: 'Invoice'
    },
    // Add more payment entries here if needed
  ]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  const filteredPayments = payments.filter(payment => {
    const { byMonth, status, dateOfPayment } = filters;
    return (
      (!byMonth || payment.month.includes(byMonth)) &&
      (!status || payment.status.includes(status)) &&
      (!dateOfPayment || payment.date.includes(dateOfPayment))
    );
  });

  const handleAddPayment = () => {
    // Logic to add a new rent payment (e.g., show a form)
    console.log("Add a new rent payment");
  };
  return (
    <RealEstatePageLayout
      pageTitle='Assurance immobilière'
      activeNav='Account'
      userLoggedIn
    >
      <RealEstateAccountLayout accountPageTitle='Assurance immobilière'>
        <div className='d-flex align-items-center justify-content-between mb-3'>
          <h1 className='h2 mb-0'>Etat de paiements de loyers mensuels</h1>
        </div>
        <p className='pt-1 mb-4'>Consulter ici tout ce qui concerne mes paiements de loyer</p>
        {/* List of properties or empty state */}
        {filteredPayments.length ? filteredPayments.map((payment, indx) => (
          <>
          
          <Row className="mb-4">
            <Col md={9}>
              <Form className="d-flex">
                <Form.Control
                  type="text"
                  name="byMonth"
                  placeholder="By Month"
                  value={filters.byMonth}
                  onChange={handleFilterChange}
                  className="me-2"
                />
                <Form.Control
                  type="text"
                  name="status"
                  placeholder="Status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="me-2"
                />
                <Form.Control
                  type="text"
                  name="dateOfPayment"
                  placeholder="Date of Payment"
                  value={filters.dateOfPayment}
                  onChange={handleFilterChange}
                />
              </Form>
            </Col>
            <Col md={3} className="d-flex justify-content-end">
              <Button onClick={handleAddPayment}>Add a rent payment</Button>
            </Col>
          </Row>
          <Table bordered hover>
            <thead>
              <tr>
                <th>Status</th>
                <th>Property</th>
                <th>Month</th>
                <th>Renter</th>
                <th>Rent Paid</th>
                <th>Rent Front</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment, index) => (
                <tr key={index}>
                  <td>{payment.status}</td>
                  <td>{payment.property}</td>
                  <td>{payment.month}</td>
                  <td>{payment.renter}</td>
                  <td>{payment.rentPaid}</td>
                  <td>{payment.rentFront}</td>
                  <td>{payment.date}</td>
                  <td>{payment.action}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
        )) : <div className='text-center pt-2 pt-md-4 pt-lg-5 pb-2 pb-md-0'>
          <i className='fi-home display-6 text-muted mb-4'></i>
          <h2 className='h5 mb-4'>Aucun loyer recu pour le moment</h2>
          <Link href='/tg/add-property' passHref>
            <Button variant='primary'>
              <i className='fi-plus fs-sm me-2'></i>
              Ajouter un loyer manuellement
            </Button>
          </Link>
        </div>}
      </RealEstateAccountLayout>
    </RealEstatePageLayout>
  )
}
export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
          destination: '/auth/signin',
          permanent: false,
      }
    }
  }
  else{
    return { props: { session } };
  }
}
export default AccountRentPaymentsPage
