
import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import CloseButton from 'react-bootstrap/CloseButton';
import CardProperty from './CardProperty'; // Assuming the CardProperty component is located here
import { createPropertyObject } from '../../utils/buildPropertiesArray'; // Assuming the utility function is located here
import { useSession } from 'next-auth/react'; // For authentication check
import { DatePicker } from 'antd'; // Ant Design for date range picker
import moment from 'moment'; // Moment.js for date manipulation

const { RangePicker } = DatePicker;

const BookFurnishedPropertyModal = ({ property, onSwap, pillButtons, ...props }) => {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [totalCost, setTotalCost] = useState(0);
  const [error, setError] = useState('');
  const [bookingNotification, setBookingNotification] = useState(null);
  const [dateRange, setDateRange] = useState([]);
  const [validated, setValidated] = useState(false);

  const { data: session } = useSession(); // Simulating login check
  const isFormValid = checkIn && checkOut && guests;

  // Calculate total cost when check-in/out or guests change
  useEffect(() => {
    if (checkIn && checkOut) {
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      const days = (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24);
      const costPerDay = 100; // Example rate per night
      if (days > 0) {
        setTotalCost(days * costPerDay);
        setError(''); // Clear error if dates are valid
      } else {
        setTotalCost(0);
        setError('Check-out date must be after the check-in date.');
      }
    }
  }, [checkIn, checkOut, guests]);

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!session) {
      alert('Please sign in to book a room');
      // Redirect to sign-in/sign-up page logic
      return;
    }

    if (!isFormValid || error) {
      setValidated(true);
      alert('Please fix errors before submitting.');
      return;
    }

    const formData = {
      checkInDate: checkIn,
      checkOutDate: checkOut,
      guests,
      userId: session.user.id, // User ID from the session
    };

    // Display form data (you can send this data to your backend)
    console.log(formData);

    // For now, saving reservation to local storage
    localStorage.setItem('reservation', JSON.stringify(formData));
    alert('Booking successful!');
  };

  // Restrict date selection to today or later
  const today = new Date().toISOString().split('T')[0];

  // Create property card object for CardProperty component
  const propertyCard = createPropertyObject(property);

  return (
    <Modal {...props} className='signin-modal'>
      <Modal.Body className='px-0 py-2 py-sm-0'>
        <CloseButton
          onClick={props.onHide}
          aria-label='Close modal'
          className='position-absolute top-0 end-0 mt-3 me-3'
        />
        <div className='row mx-0'>
          <div className='col-md-6 border-end-md p-4 p-sm-5'>
            <h2 className='h3 mb-2 mb-sm-2'>Book a Property</h2>
            <div className='d-flex align-items-center py-3 mb-3'>
              <CardProperty property={propertyCard} />
            </div>
            <div className='mt-2 mt-sm-2'>
              Before booking, <a href='#' onClick={onSwap}>check availability</a>.
            </div>
          </div>

          <div className='col-md-6 p-4 p-sm-5'>
            <h3 className='h4'>Make a Reservation</h3>
            
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId='formDateRange'>
                <Form.Label>Choose Date Range</Form.Label>
                <RangePicker
                  getPopupContainer={(trigger) => trigger.parentNode}
                  onChange={(dates) => {
                    setDateRange(dates);
                    if (dates) {
                      setCheckIn(dates[0].format('YYYY-MM-DD'));
                      setCheckOut(dates[1].format('YYYY-MM-DD'));
                    }
                  }}
                  format='YYYY-MM-DD'
                  disabledDate={(current) => current && current < moment().endOf('day')}
                />
              </Form.Group>

              <Form.Group controlId='formGuests'>
                <Form.Label>Number of Guests:</Form.Label>
                <Form.Control
                  type="number"
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  min="1"
                  max="5" // Max limit to 5 guests
                  required
                />
              </Form.Group>

              {error && <p style={{ color: 'red' }}>{error}</p>} {/* Error display */}
              <h3>Total Cost: ${totalCost}</h3>

              <Button variant='primary' type='submit' className='mt-3'>
                Book Now
              </Button>
            </Form>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default BookFurnishedPropertyModal;
