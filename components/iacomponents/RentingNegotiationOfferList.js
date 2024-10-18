import { Col } from "react-bootstrap";
import CardProperty from "./CardProperty";
import RentingNegotiationOffer from "./RentingNegotiationOffer";

export default function RentingNegotiationOfferList({ projects }) {
    return(
        projects && projects.map((project, indx) => (
            <>
                <RentingNegotiationOffer project={project} key={indx} />
            </>
        )))
    



}