import React from "react";
import { Col } from "react-bootstrap";

export default function FurnishedEquipment({indx,icon,title}) {
    return (
        <Col key={indx} as='li'>
            <i className={`${icon} mt-n1 me-2 fs-lg align-middle`}></i>
            {title}
        </Col>)
        ;
}