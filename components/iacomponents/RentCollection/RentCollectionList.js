import { Col } from "react-bootstrap";
import RentCollection from "./RentCollection";

export default function RentCollectionList({ rents_collection }) {
    return (
        rents_collection && rents_collection.map((rent_collection, indx) => (
            <>
                <RentCollection rent_collection={rent_collection} key={indx} />
            </>
        )))




}