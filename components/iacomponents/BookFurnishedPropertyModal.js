import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import CloseButton from "react-bootstrap/CloseButton";
import CardProperty from "./CardProperty";
import { createPropertyObject } from "../../utils/buildPropertiesArray";
import { useSession } from "next-auth/react";
import { DatePicker } from "antd";
import axios from 'axios';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import moment from "moment";

const onChange = (date, dateString) => {
  console.log(date, dateString);
};

const BookFurnishedPropertyModal = ({
  property,
  onSwap,
  pillButtons,
  ...props
}) => {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [totalCost, setTotalCost] = useState(0);
  const [error, setError] = useState("");
  const [validated, setValidated] = useState(false);
  const [numberOfChildren, setNumberOfChildren] = useState("");
  const [numberOfAdults, setNumberOfAdults] = useState("");
  const [pickUpLocation, setPickUpLocation] = useState("");
  const [bookingNotification, setBookingNotification] = useState(null);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [firstName, setFirstName] = useState('');

  const { data: session } = useSession();
  const isFormValid = session ? (checkIn && checkOut) : (checkIn && checkOut && firstName !== "" && email !== "" && phone !== "")

  // Handle date changes for check-in and check-out
  const handleCheckInChange = (date, dateString) => {
    setCheckIn(dateString);
  };

  const handleCheckOutChange = (date, dateString) => {
    setCheckOut(dateString);
  };

  // Calculate total cost when check-in/out or guests change
  useEffect(() => {
    if (checkIn && checkOut) {
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      const days = (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24);
      const costPerDay = 100; // Make this dynamic
      if (days > 0) {
        setTotalCost(days * costPerDay);
        setError(""); // Clear error if dates are valid
      } else {
        setTotalCost(0);
        setError("Check-out date must be after the check-in date.");
      }
    }
  }, [checkIn, checkOut]);

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Redirect to sign-in page if user is not authenticated
    /* if (!session) {
      alert("You need to sign in to book a room.");
      signIn(); 
      return;
    } */
    if (!isFormValid || error) {
      console.log("Le formulaire n'est pas valide. Veuillez vérifier les champs.");
      setValidated(true);
      return;
    }

    const formData = {
      checkInDate: checkIn,
      checkOutDate: checkOut,
      firstName: firstName,
      email: session ? "" : email,
      phone: session ? "" : phone,
      firstName: firstName,
      pickUpLocation: pickUpLocation,
      userId: session ? Number(session.user.id) : 0, // User ID from the session
    };
    // Prepare GraphQL mutation for rent negotiation
    const booking_data = {
      query: `mutation BookFurnishedProperty($input: ReservationInput!) {
        createReservation(input: $input) {
          id
        }
      }`,
      variables: {
        input: {
          email_reservateur: formData.email,
          phone_reservateur: formData.phone,
          user_id: formData.userId,
          date_arrive: formData.checkInDate,
          date_depart: formData.checkOutDate,
          propriete_id: Number(property.id),
          proprietaire_id: Number(property?.user?.id),
          fullname_reservateur: formData.firstName,
          adulte: 1,
          enfant: 1,
          pickup_place: formData.pickUpLocation
        }
      }
    };
    console.log(booking_data);
    try {
      const response = await axios.post('https://immoaskbetaapi.omnisoft.africa/public/api/v2', booking_data, {
        headers: { 'Content-Type': 'application/json' }
      });

      if (Number(response.data?.data?.createReservation?.id) >= 1) {
        setBookingNotification("Votre réservation a été envoyée avec succès. Vous serez contacté sous peu.");
        // Redirect or perform any other actions needed
        //router.push("/thank-you");
      }
    } catch (error) {
      console.error("Error during negotiation:", error);
    }
    console.log(formData);
    // For now, saving reservation to local storage
    localStorage.setItem("reservation", JSON.stringify(formData));
    const reservation = localStorage.getItem("reservation");
    setValidated(true);
  };

  // Restrict date selection to today or later
  const disabledDate = (current) => {
    return current && current < moment().endOf("day");
  };

  // Create property card object for CardProperty component
  const propertyCard = createPropertyObject(property);

  return (
    <Modal {...props} className="signin-modal">
      <Modal.Body className="px-0 py-2 py-sm-0">
        <CloseButton
          onClick={props.onHide}
          aria-label="Close modal"
          className="position-absolute top-0 end-0 mt-3 me-3"
        />
        <div className="row mx-0">
          <div className="col-md-6 border-end-md p-4 p-sm-5">
            <h2 className="h3 mb-2 mb-sm-2">Reservation d'un sejour</h2>
            <div className="d-flex align-items-center py-3 mb-3">
              <CardProperty property={propertyCard} />
            </div>
            <div className="mt-2 mt-sm-2">
              Avant de réserver,{" "}
              <a href="#" onClick={onSwap}>
                Vérifier la disponibilité
              </a>
            </div>
          </div>

          <div className="col-md-6 p-4 p-sm-5">
            <h3 className="h4">Faire une réservation</h3>
            {bookingNotification && <div className="alert alert-success mt-3">{bookingNotification}</div>}
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <Form.Group controlId="formCheckIn">
                <Form.Label>Date d'arrivée</Form.Label>
                <Form.Control as={DatePicker}
                  className="mb-2"
                  showTime
                  getPopupContainer={(trigger) => trigger.parentNode}
                  onChange={handleCheckInChange}
                  disabledDate={disabledDate}
                  required
                />

              </Form.Group>
              <Form.Group controlId="formCheckOut" >
                <Form.Label>Date de départ</Form.Label>
                <Form.Control as={DatePicker}
                  className="mb-2"
                  showTime
                  getPopupContainer={(trigger) => trigger.parentNode}
                  onChange={handleCheckOutChange}
                  disabledDate={disabledDate}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formPickUpLocation" className="mb-2">
                <Form.Label>Ou viendrons-nous vous chercher?</Form.Label>
                <Form.Control
                  type="text"
                  name="pickUpLocation"
                  placeholder="Ou viendrons-nous vous chercher"
                  value={pickUpLocation}
                  onChange={(e) => setPickUpLocation(e.target.value)}
                />
              </Form.Group>
              {!session && (
                <>
                  <Form.Group className='mb-2'>
                    <Form.Label>Numéro de téléphone</Form.Label>
                    <PhoneInput
                      country={'tg'}
                      value={phone}
                      onChange={(phone) => setPhone(phone)}
                      enableSearch={true}
                      inputProps={{
                        name: 'phone',
                        required: true,
                        autoFocus: true,
                        className: 'form-control w-100 form-control-lg',
                      }}
                    />
                    <Form.Control.Feedback type="invalid">
                      Veuillez saisir un numéro de téléphone valide.
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group controlId='si-email' className='mb-2'>
                    <Form.Label>Votre email ?</Form.Label>
                    <Form.Control
                      type='email'
                      name='email'
                      placeholder='Saisir votre email'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Veuillez saisir une adresse email valide.
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group controlId='si-firstname' className='mb-2'>
                    <Form.Label>Votre prénom ?</Form.Label>
                    <Form.Control
                      type='text'
                      name='firstname'
                      placeholder='Saisir votre prénom'
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Veuillez saisir votre prénom.
                    </Form.Control.Feedback>
                  </Form.Group>
                </>
              )}

              {error && <p style={{ color: "red" }}>{error}</p>}
              {/* <h3>Total Cost: ${totalCost}</h3> */}
              <Button
                type='submit'
                disabled={!isFormValid}
                size='lg'
                variant={`primary ${pillButtons ? 'rounded-pill' : ''} w-100`}
              >
                Réserver maintenant
              </Button>

            </Form>
            {bookingNotification && <div className="alert alert-success mt-3">{bookingNotification}</div>}
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default BookFurnishedPropertyModal;
