import { Col } from "react-bootstrap";
import RentPayment from "./RentPayment";

export default function RentPaymentList({ rents_collection }) {
    return (
        rents_collection && rents_collection.map((rent_collection, indx) => (
            <>
                <RentPayment rent_collection={rent_collection} key={indx} />
            </>
        )))




}