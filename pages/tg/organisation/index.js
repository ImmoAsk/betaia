import { useState } from "react";
import { useRouter } from "next/router";
import { useOrganisationStatistics } from "../../../customHooks/useOrganisation";
import RealEstateAgencyPublicBoard from "../../../components/iacomponents/RealEstateAgency/RealEstateAgencyPublicBoard";
import { Container, Spinner } from "react-bootstrap";
import RealEstateProperty from "../../../components/iacomponents/RealEstateAgency/newprop";
import PropertyAds from "../../../components/iacomponents/RealEstateAgency/PropertyAds";

const Organisation = () => {
  const router = useRouter();
  const { code_organisation } = router.query;

  // Fetch organisation stats from custom hook
  const { data: orgStatistics, isLoading, error } = useOrganisationStatistics(code_organisation);
  
  const [selectedType, setSelectedType] = useState("all");
  const [open, setOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "70vh" }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Chargement...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return <div className="text-center mt-5 text-danger">Erreur de chargement des données.</div>;
  }

  return (
    <RealEstateAgencyPublicBoard
      onSelectType={setSelectedType}
      orgStatistics={orgStatistics}
      organisation={orgStatistics ? orgStatistics.organisation : {}}
    >
      <PropertyAds />
      <Container fluid className="pb-lg-4 mb-sm-2">
        <RealEstateProperty selectedType={selectedType} />
      </Container>
    </RealEstateAgencyPublicBoard>
  );
};

export default Organisation;
