import { Col } from "react-bootstrap";
import PropertyContract from "./PropertyContract";

export default function PropertyContractList({ projects }) {
    return(
        projects && projects.map((project, indx) => (
            <>
                <PropertyContract project={project} key={indx} />
            </>
        )))
    



}