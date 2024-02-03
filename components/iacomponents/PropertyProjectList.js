import { Col } from "react-bootstrap";
import CardProperty from "./CardProperty";
import PropertyProject from "./PropertyProject";

export default function PropertyProjectList({ projects }) {
    return(
        projects && projects.map((project, indx) => (
            <>
                <PropertyProject project={project} key={indx} />
            </>
        )))
    



}