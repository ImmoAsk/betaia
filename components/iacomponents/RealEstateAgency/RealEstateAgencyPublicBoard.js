import { useState } from "react";

import { getSession, useSession } from "next-auth/react";
import RealEstatePageLayout from "../../partials/RealEstatePageLayout";
import PublicBoardSideBar from "./PublicBoardSideBar";
import { Button } from "react-bootstrap";
import InquiryFormModal from "./InquiryForm";

const RealEstateAgencyPublicBoard = ({
  orgStatistics,
  organisation,
  children,
  onSelectType,
}) => {
  // State to control Collapse
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();
  const accountPageTitle = "Tableau de bord de l'agence";
  //console.log(session);
  const roleId = Number(session && session.user?.roleId);
  //console.log(roleId);

  return (
    <RealEstatePageLayout pageTitle={accountPageTitle}>
      <PublicBoardSideBar
        onSelectType={onSelectType}
        orgStatistics={orgStatistics}
        organisation={organisation}
        accountPageTitle={accountPageTitle}
      >
        {children}
      </PublicBoardSideBar>
    </RealEstatePageLayout>
  );
};

export default RealEstateAgencyPublicBoard;
