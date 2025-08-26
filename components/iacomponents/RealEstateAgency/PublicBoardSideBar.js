import { useState } from "react";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Collapse from "react-bootstrap/Collapse";
import CardNav from "../../CardNav";
import StarRating from "../../StarRating";
import Avatar from "../../Avatar";
import InquiryFormModal from "./InquiryForm";
import PropertyTypeCounter from "./propertyTypeCounter";

const PublicBoardSideBar = ({
  orgStatistics,
  organisation,
  children,
  onSelectType = () => {},
}) => {
  // State to control Collapse
  const [open, setOpen] = useState(false);

  return (
    <Container fluid className="pt-5 pb-lg-4 mt-5 mb-sm-2">
      <Row>
        {/* Sidebar (Account nav) */}
        <Col md={5} lg={3} className="pe-xl-4 mb-5">
          <div className="card card-body border-0 shadow-sm pb-1 me-lg-1">
            <div className="d-flex d-md-block d-lg-flex align-items-start pt-lg-2 mb-4">
              <Avatar
                // img={{ src: organisation?.logo, alt: organisation.name_organisation }}
                size={[48, 48]}
              />
              <div className="pt-md-2 pt-lg-0 ps-3 ps-md-0 ps-lg-3">
                <h2 className="fs-lg mb-0">{organisation?.name_organisation}</h2>
                {/* <MediumRealEstateAgencyCard user={session ? session.user?.id:"1"} /> */}
                <StarRating rating={4.8} />
                <ul className="list-unstyled fs-sm mt-3 mb-0">
                  <li>
                    <a href="#" className="nav-link fw-normal p-0">
                      <i className="fi-user opacity-60 me-2"></i>
                      {organisation?.proprietaire?.name || "Kossi ADANOU"}
                    </a>
                  </li>
                  <li>
                    <a
                      href={"tel:" + (organisation?.proprietaire?.phone || "+22891849090")}
                      className="nav-link fw-normal p-0"
                    >
                      <i className="fi-phone opacity-60 me-2"></i>
                      {organisation?.proprietaire?.phone || "+228 91 84 90 90"}
                    </a>
                  </li>
                  <li>
                    <a
                      href={"mailto:" + (organisation?.proprietaire?.email || "contact@immoask.com")}
                      className="nav-link fw-normal p-0"
                    >
                      <i className="fi-mail opacity-60 me-2"></i>
                      {organisation?.proprietaire?.email || "contact@immoask.com"}
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <Row className="mb-4">
              <InquiryFormModal organisation={organisation}/>
            </Row>
            {/* Enroller une propriété */}
            <Button
              variant="outline-secondary"
              className="d-block d-md-none w-100 mb-3"
              onClick={() => setOpen(!open)}
              aria-controls="account-menu"
              aria-expanded={open}
            >
              <i className="fi-align-justify me-2"></i>
              Menu
            </Button>
            <div>
              <PropertyTypeCounter countAcquisitions={orgStatistics?.acquisition} countEntreprises={orgStatistics?.entreprise} countLogements={orgStatistics?.logement} countSejours={orgStatistics?.sejour} />
            </div>{" "}
            <Collapse in={open} className="d-md-block">
              <div id="account-menu">
                <CardNav className="pt-3">
                  <CardNav.Item
                    icon="fi-home"
                    onClick={() => onSelectType("sejour")}
                  >
                    Sejours
                  </CardNav.Item>
                  <CardNav.Item
                    icon="fi-apartment"
                    onClick={() => onSelectType("logement")}
                  >
                    Logements
                  </CardNav.Item>
                  <CardNav.Item
                    icon="fi-home"
                    onClick={() => onSelectType("entreprise")}
                  >
                    Entreprises
                  </CardNav.Item>
                  <CardNav.Item
                    icon="fi-apartment"
                    onClick={() => onSelectType("acquisition")}
                  >
                    Acquisitions
                  </CardNav.Item>
                  <CardNav.Item>
                    <div className="d-flex flex-column mt-3 gap-3">
                      <a
                        href={organisation?.facebook_url || "https://facebook.com"}
                        target="_blank"
                        className="text-primary fs-5 text-decoration-none"
                      >
                        <i className="fi-facebook me-2"></i>Facebook
                      </a>
                      <a
                        href={organisation?.twitter_url || "https://x.com"}
                        target="_blank"
                        className="text-info fs-5 text-decoration-none"
                      >
                        <i className="fi-twitter me-2"></i>X
                      </a>
                      <a
                        href={organisation?.linkedin_url || "https://linkedin.com"}
                        className="text-primary fs-5 text-decoration-none"
                      >
                        <i className="fi-instagram me-2"></i>LinkedIn
                      </a>
                    </div>
                  </CardNav.Item>
                </CardNav>
              </div>
            </Collapse>
          </div>
          <Row className="mt-4 p-2">
            <InquiryFormModal organisation={organisation}/>
          </Row>
        </Col>

        {/* Page content */}
        <Col md={7} lg={9} className="mb-5">
          {children}
        </Col>
      </Row>
    </Container>
  );
};

export default PublicBoardSideBar;