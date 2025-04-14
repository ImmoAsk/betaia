import { Col } from "react-bootstrap";
import PropertyInventory from "./PropertyInventory";

export default function PropertyInventoryList({ projects }) {
    return(
        projects && projects.map((project, indx) => (
            <>
                <PropertyInventory project={project} key={indx} />
            </>
        )))
    



}