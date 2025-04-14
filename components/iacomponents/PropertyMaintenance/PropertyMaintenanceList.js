import { Col } from "react-bootstrap";
import PropertyMaintenance from "./PropertyMaintenance";

export default function PropertyMaintenanceList({ projects }) {
    return(
        projects && projects.map((project, indx) => (
            <>
                <PropertyMaintenance project={project} key={indx} />
            </>
        )))
    



}