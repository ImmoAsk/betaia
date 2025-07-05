import { Col } from "react-bootstrap";
import PropertyAccounting from "./PropertyAccounting";

export default function PropertyAccountingList({ rents_collection }) {
    return (
        rents_collection && rents_collection.map((rent_collection, indx) => (
            <>
                <PropertyAccounting rent_collection={rent_collection} key={indx} />
            </>
        )))




}