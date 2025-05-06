"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import RealEstateAgencyPublicBoard from "../../../components/iacomponents/RealEstateAgency/RealEstateAgencyPublicBoard";
import { Container } from "react-bootstrap";
import RealEstateProperty from "../../../components/iacomponents/RealEstateAgency/newprop";
import PropertyAds from "../../../components/iacomponents/RealEstateAgency/PropertyAds";

const Organisation = ({
  accountPageTitle,
  organisationName,
  organisationCode,
  children,
}) => {
  const [selectedType, setSelectedType] = useState("all");
  // State to control Collapse
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();
  //console.log(session);
  const roleId = Number(session && session.user?.roleId);
  //console.log(roleId);
  //const accountPageTitle = 'Mon organisation';
  return (
    <RealEstateAgencyPublicBoard
      accountPageTitle="Mon organisation"
      onSelectType={setSelectedType}
    >
      <PropertyAds />
      <Container fluid className=" pb-lg-4 mb-sm-2">
        <RealEstateProperty selectedType={selectedType} />
      </Container>
    </RealEstateAgencyPublicBoard>
  );
};

export default Organisation;
