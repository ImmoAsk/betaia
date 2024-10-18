import { useState } from 'react';
import RealEstatePageLayout from '../../components/partials/RealEstatePageLayout';
import RealEstateAccountLayout from '../../components/partials/RealEstateAccountLayout';
import Link from 'next/link';
import { Button, Modal, Form, Table, Row, Col,Card } from 'react-bootstrap';
import { useSession, getSession } from 'next-auth/react';
import Nav from 'react-bootstrap/Nav'
import PropertyCard from '../../components/PropertyCard'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import getPropertyFullUrl from '../../utils/getPropertyFullURL'
import getFirstImageArray from '../../utils/formatFirsImageArray'
import buildPropertyBadge from '../../utils/buildPropertyBadge'



const AccountRentPaymentsPage = () => {

  //Properties array

  const [properties, setProperties] = useState([]);

  const { data: session } = useSession();

  const user_id = session ? session.user.id : 0;
  useQuery(["RTProperties"],
    () => axios.get(`https://immoaskbetaapi.omnisoft.africa/public/api/v2?query={getUserProperties(user_id:${user_id},first:5){data{surface,badge_propriete{badge{badge_name,badge_image}},id,nuo,usage,offre{denomination},categorie_propriete{denomination},pays{code},piece,titre,garage,cout_mensuel,ville{denomination},wc_douche_interne,cout_vente,quartier{denomination},visuels{uri}}}}`).
      then((res) => {
        setProperties(res.data.data.getUserProperties.data.map((property) => {
          return {
            href: getPropertyFullUrl(property.pays.code, property.offre.denomination, property.categorie_propriete.denomination, property.ville.denomination, property.quartier.denomination, property.nuo),
            images: getFirstImageArray(property.visuels),
            title: 'N°' + property.nuo + ': ' + property.categorie_propriete.denomination + ' à ' + property.offre.denomination + ' | ' + property.surface + 'm²',
            category: property.usage,
            location: property.quartier.denomination + ", " + property.ville.denomination,
            price: property.cout_mensuel == 0 ? property.cout_vente + " XOF" : property.cout_mensuel + " XOF",
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

  const [payments, setPayments] = useState([
    {
      status: 'Paid',
      property: 'Apartment A',
      month: 'January 2024',
      renter: 'Kossi A.',
      rentPaid: 45000,
      rentFront: 0,
      date: '05-01-2024',
      action: 'Invoice',
    }, {
      status: 'Paid',
      property: 'Apartment A',
      month: 'January 2024',
      renter: 'Kossi A.',
      rentPaid: 45000,
      rentFront: 0,
      date: '05-01-2024',
      action: 'Invoice'
    },
    {
      status: 'Paid',
      property: 'Apartment b',
      month: 'February 2024',
      renter: 'Alberta Duma',
      rentPaid: 75000,
      rentFront: 0,
      date: '10-03-2024',
      action: 'Invoice'
    },
    {
      status: 'Paid',
      property: 'Apartment C',
      month: 'March 2024',
      renter: 'Phyllis Goma',
      rentPaid: 98000,
      rentFront: 0,
      date: '15-03-2024',
      action: 'Invoice'
    }
    // Additional payments...
  ]);

  const [filters, setFilters] = useState({
    byMonth: '',
    status: '',
    dateOfPayment: '',
  });

  const [newPayment, setNewPayment] = useState({
    status: '',
    property: '',
    month: '',
    renter: '',
    rentPaid: '',
    rentFront: '',
    date: '',
    action: '',
  });

  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  // Filter the payments based on the filter inputs
  const filteredPayments = payments.filter((payment) => {
    const { byMonth, status, dateOfPayment } = filters;
    return (
      (!byMonth || payment.month.toLowerCase().includes(byMonth.toLowerCase())) &&
      (!status || payment.status.toLowerCase().includes(status.toLowerCase())) &&
      (!dateOfPayment || payment.date.toLowerCase().includes(dateOfPayment.toLowerCase()))
    );
  });

  // Function to add a new payment to the list with validation logic
  const handleAddPayment = () => {
    // Input validation
    const { status, property, month, renter, rentPaid, rentFront, date, action } = newPayment;

    if (!status || !property || !month || !renter || !rentPaid || !date || !action) {
      alert('Please fill in all required fields.');
      return;
    }

    // Validate if rentPaid and rentFront are numbers and positive
    if (isNaN(rentPaid) || rentPaid <= 0) {
      alert('Please enter a valid Rent Paid amount.');
      return;
    }

    if (isNaN(rentFront) || rentFront < 0) {
      alert('Please enter a valid Rent Front amount (it can be 0).');
      return;
    }

    // Retrieve existing payments from localStorage
    const existingPayments = JSON.parse(localStorage.getItem('payments')) || [];

    // Add the new payment to the existing list
    const updatedPayments = [...existingPayments, newPayment];

    // Store the updated payment list in localStorage
    localStorage.setItem('payments', JSON.stringify(updatedPayments));

    // Add the new payment to the existing list
    setPayments([...payments, newPayment]);

    // Reset form values
    setNewPayment({
      status: '',
      property: '',
      month: '',
      renter: '',
      rentPaid: '',
      rentFront: '',
      date: '',
      action: '',
    });

    // Close modal after adding
    setShowAddPaymentModal(false);
  };

  return (
    <RealEstatePageLayout pageTitle="Assurance immobilière" activeNav="Account" userLoggedIn>
      <RealEstateAccountLayout accountPageTitle="Assurance immobilière">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h1 className="h2 mb-0">Etat de paiements de loyers mensuels</h1>
        </div>
        <p className="pt-1 mb-4">Consulter ici tout ce qui concerne mes paiements de loyer</p>

        {/* Filters and Add Payment button */}
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
            <Button onClick={() => setShowAddPaymentModal(true)}>Add a rent payment</Button>
          </Col>
        </Row>

        {/* Payment Table */}
        {/* <Table bordered hover>
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
            {filteredPayments.length ? (
              filteredPayments.map((payment, index) => (
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
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center">
                  No rent payments found.
                </td>
              </tr>
            )}
          </tbody>
        </Table> */}
        <Card className="shadow-sm p-3 mb-5 bg-white rounded">
          <Card.Body>
            <Table bordered hover className="text-center table-sm" responsive>
              <thead className="thead-dark">
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
                {filteredPayments.length ? (
                  filteredPayments.map((payment, index) => (
                    <tr key={index} className={payment.status === 'Paid' ? 'table-success' : 'table-warning'}>
                      <td>{payment.status}</td>
                      <td>{payment.property}</td>
                      <td>{payment.month}</td>
                      <td>{payment.renter}</td>
                      <td>{payment.rentPaid}</td>
                      <td>{payment.rentFront}</td>
                      <td>{payment.date}</td>
                      <td>{payment.action}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center">
                      No rent payments found.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Card.Body>
        </Card>

        {/* Modal for Adding New Payment */}
        <Modal show={showAddPaymentModal} onHide={() => setShowAddPaymentModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Add a New Rent Payment</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Control
                  type="text"
                  value={newPayment.status}
                  onChange={(e) => setNewPayment({ ...newPayment, status: e.target.value })}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Property</Form.Label>
                <Form.Control
                  type="text"
                  value={newPayment.property}
                  onChange={(e) => setNewPayment({ ...newPayment, property: e.target.value })}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Month</Form.Label>
                <Form.Control
                  type="text"
                  value={newPayment.month}
                  onChange={(e) => setNewPayment({ ...newPayment, month: e.target.value })}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Renter</Form.Label>
                <Form.Control
                  type="text"
                  value={newPayment.renter}
                  onChange={(e) => setNewPayment({ ...newPayment, renter: e.target.value })}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Rent Paid</Form.Label>
                <Form.Control
                  type="number"
                  value={newPayment.rentPaid}
                  onChange={(e) => setNewPayment({ ...newPayment, rentPaid: e.target.value })}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Rent Front</Form.Label>
                <Form.Control
                  type="number"
                  value={newPayment.rentFront}
                  onChange={(e) => setNewPayment({ ...newPayment, rentFront: e.target.value })}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Date</Form.Label>
                <Form.Control
                  type="date"
                  value={newPayment.date}
                  onChange={(e) => setNewPayment({ ...newPayment, date: e.target.value })}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Action</Form.Label>
                <Form.Control
                  type="text"
                  value={newPayment.action}
                  onChange={(e) => setNewPayment({ ...newPayment, action: e.target.value })}
                />
              </Form.Group>

              <Button variant="primary" onClick={handleAddPayment}>
                Save Payment
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </RealEstateAccountLayout>
    </RealEstatePageLayout>
  );
};

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      },
    };
  }
  return { props: { session } };
}

export default AccountRentPaymentsPage;
