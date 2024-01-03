import { Col } from "react-bootstrap";
import CardProperty from "./CardProperty";

export default function PropertiesList({properties}){

    return(properties && properties.map((property, indx) => (
        <Col key={indx}>
          <CardProperty property={property}/>
        </Col>
      ))
      )
}