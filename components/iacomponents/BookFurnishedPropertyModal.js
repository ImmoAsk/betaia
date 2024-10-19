import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import CloseButton from "react-bootstrap/CloseButton";
import CardProperty from "./CardProperty";
import { createPropertyObject } from "../../utils/buildPropertiesArray";
import { useSession } from "next-auth/react";
import { DatePicker } from "antd";
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

  const { data: session } = useSession();
  const isFormValid =
    checkIn &&
    checkOut &&
    numberOfAdults !== "" &&
    numberOfChildren !== "" &&
    pickUpLocation !== "";

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
    if (!session) {
      alert("You need to sign in to book a room.");
      signIn(); 
      return;
    }

    if (!isFormValid || error) {
      setValidated(true);
      alert("Please fix errors before submitting.");
      return;
    }

    const formData = {
      checkInDate: checkIn,
      checkOutDate: checkOut,
      numberOfAdults: numberOfAdults,
      numberOfChildren: numberOfChildren,
      userId: session.user.id, // User ID from the session
    };

    // Prepare GraphQL mutation for rent negotiation
    
    const booking_data = {
      query: `mutation BookFurnishedProperty($input: BookingInput!) {
        createReservation(input: $input) {
          id
        }
      }`,
      variables: {
        input: {
          //email_reservateur: session ? "" : formData.,
          //phone_negociateur: session ? "" : formData.phone,
          //user_id: session ? session.user.id : 0,
          //date_arrive: "2024-09-10 14:40:30",
          //date_depart: Number(formData.offer),
          //propriete_id: Number(property.id),
          //proprietaire_id: Number(property?.user?.id),
          //fullname_reservateur: session ? "" : formData.firstName,
          //adulte:1,
          //enfant:1,
          //pickup_place:""
        }
      }
    };
    console.log(booking_data);
    try {
      const response = await axios.post('https://immoaskbetaapi.omnisoft.africa/public/api/v2', negotiation_data, {
        headers: { 'Content-Type': 'application/json' }
      });

      if (Number(response.data?.data?.createReservation?.id)>= 1) {
        setBookingNotification("Votre négociation a été envoyée avec succès. Vous serez contacté sous peu.");
        // Redirect or perform any other actions needed
        //router.push("/thank-you");
      }
    } catch (error) {
      console.error("Error during negotiation:", error);
    }
    console.log(formData);
    // For now, saving reservation to local storage
    localStorage.setItem("reservation", JSON.stringify(formData));
    alert("Booking successful!");
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
            <h2 className="h3 mb-2 mb-sm-2">Book a Property</h2>
            <div className="d-flex align-items-center py-3 mb-3">
              <CardProperty property={propertyCard} />
            </div>
            <div className="mt-2 mt-sm-2">
              Before booking,{" "}
              <a href="#" onClick={onSwap}>
                check availability
              </a>
              .
            </div>
          </div>

          <div className="col-md-6 p-4 p-sm-5">
            <h3 className="h4">Make a Reservation</h3>

            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formCheckIn">
                <Form.Label>Check-In Date</Form.Label>
                <Form.Control as={DatePicker}
                className="mb-2"
                getPopupContainer={(trigger) => trigger.parentNode}
                onChange={handleCheckInChange}
                disabledDate={disabledDate}
                required
                />
              
              </Form.Group>
              <Form.Group controlId="formCheckOut" >
                <Form.Label>Check-Out Date</Form.Label>
                <Form.Control as={DatePicker}
                  className="mb-2"
                  getPopupContainer={(trigger) => trigger.parentNode}
                  onChange={handleCheckOutChange}
                  disabledDate={disabledDate}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formNumberOfAdults">
                <Form.Label>Number of Adults:</Form.Label>
                <Form.Control
                  type="number"
                  name="numberOfAdults"
                  value={numberOfAdults}
                  placeholder="Adults"
                  onChange={(e) => setNumberOfAdults(e.target.value)}
                  min="1"
                  required
                />
              </Form.Group>
              <Form.Group controlId="formNumberOfChildren" className="mb-2">
                <Form.Label>Number of Children</Form.Label>
                <Form.Control
                  type="number"
                  name="numberOfChildren"
                  placeholder="Children"
                  value={numberOfChildren}
                  onChange={(e) => setNumberOfChildren(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formPickUpLocation" className="mb-2">
                <Form.Label>Pick Up Location</Form.Label>
                <Form.Control
                  type="text"
                  name="pickUpLocation"
                  placeholder="Location"
                  value={pickUpLocation}
                  onChange={(e) => setPickUpLocation(e.target.value)}
                  required
                />
              </Form.Group>
              {error && <p style={{ color: "red" }}>{error}</p>}
              <h3>Total Cost: ${totalCost}</h3>
              <Button variant="primary" type="submit" className="mt-3">
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
