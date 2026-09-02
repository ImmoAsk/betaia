import { useState } from "react";
import RealEstatePageLayout from "../../partials/RealEstatePageLayout";
import PublicBoardSideBar from "./PublicBoardSideBar";

const RealEstateAgencyPublicBoard = ({
  orgStatistics,
  organisation,
  children,
  onSelectType,
}) => {

  const accountPageTitle = "Agence immobilière " + organisation?.name_organisation+" | No. "+organisation?.code_organisation;

  return (
    <RealEstatePageLayout pageTitle={accountPageTitle}>
      <PublicBoardSideBar
        onSelectType={onSelectType}
        orgStatistics={orgStatistics}
        organisation={organisation}
      >
        {children}
      </PublicBoardSideBar>
    </RealEstatePageLayout>
  );
};

export default RealEstateAgencyPublicBoard;
