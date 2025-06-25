import { useState, useEffect } from "react";
import RealEstatePageLayout from "../../components/partials/RealEstatePageLayout";
import RealEstateAccountLayout from "../../components/partials/RealEstateAccountLayout";
import Nav from "react-bootstrap/Nav";
import { useSession, getSession } from "next-auth/react";
import { Row, Col } from "react-bootstrap";
import { API_URL } from "../../utils/settings";
import RentPaymentList from "../../components/iacomponents/RentPayment/RentPaymentList";
import { useTenantContract } from "../../customHooks/usePropertyOwner";

// Helper function to fetch RentPayments by statut for property owner
async function fetchRentPaymentsByStatut(statut, locataireID) {
  console.log("URL", `${API_URL}?query={getPaiementsLoyersByKeyWords(statut:${statut},user_id:${locataireID},orderBy:{order:DESC,column:ID}){id,client{name,id},date_transaction,statut,type_transaction,contrat{id,montant_final,locataire{id,name}}}}`)
  const dataAPIresponse = await fetch(
    `${API_URL}?query={getPaiementsLoyersByKeyWords(type_transaction:"loyer",statut:${statut},user_id:${locataireID},orderBy:{order:DESC,column:ID}){id,client{name,id},date_transaction,montant,statut,type_transaction,contrat{id,propriete{nuo,categorie_propriete{denomination}},montant_final,locataire{id,name}}}}`
  );
  const responseData = await dataAPIresponse.json();
  console.log(responseData);
  return responseData.data
    ? responseData.data.getPaiementsLoyersByKeyWords
    : [];
}

// Helper function to fetch RentPayments by statut for admin
async function fetchRentPaymentsByStatutByRole(statut) {
  const endpoint = `${API_URL}?query={getPaiementsLoyersByKeyWords(type_transaction:"loyer",statut:${statut},orderBy:{order:DESC,column:ID}){id,client{name,id},date_transaction,montant,statut,type_transaction,contrat{id,propriete{nuo,categorie_propriete{denomination}},montant_final,locataire{id,name}}}}`;
  const dataAPIresponse = await fetch(endpoint);
  const responseData = await dataAPIresponse.json();
  console.log(responseData);
  return responseData.data
    ? responseData.data.getPaiementsLoyersByKeyWords
    : [];
}
async function promptOrCreatePendingRentPayments(renterContractID) {
  const query = `mutation { promptOrCreatePendingEncaissement(contrat_id: ${renterContractID}) { status message } }`;
  const encodedQuery = encodeURIComponent(query);
  const fullEncodedUrl = `${API_URL}?query=${encodedQuery}`;

  console.log("GraphQL Encoded URL (GET-style):", fullEncodedUrl); // for debugging

  const mutation = {
    query: `mutation { promptOrCreatePendingEncaissement(contrat_id: ${renterContractID}) { status message } }`,
  };

  const dataAPIresponse = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(mutation),
  });


  const responseData = await dataAPIresponse.json();
  return responseData.data?.promptOrCreatePendingEncaissement;
}


async function promptOrCreatePendingPaiementLoyer(renterContractID) {
  const query = `mutation { createPendingPaiementLoyer(contrat_id: ${renterContractID}) { status message } }`;
  const encodedQuery = encodeURIComponent(query);
  const fullEncodedUrl = `${API_URL}?query=${encodedQuery}`;

  console.log("GraphQL Encoded URL (GET-style):", fullEncodedUrl); // for debugging

  const mutation = {
    query: `mutation { createPendingPaiementLoyer(contrat_id: ${renterContractID}) { status message } }`,
  };

  const dataAPIresponse = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(mutation),
  });


  const responseData = await dataAPIresponse.json();
  return responseData.data?.createPendingPaiementLoyer;
}
const AccountRentPaymentsPage = ({
  _newRentPayments,
  _acceptedRentPayments,
  _declinedRentPayments,
}) => {
  const [editPropertyShow, setEditPropertyShow] = useState(false);
  const [activeTab, setActiveTab] = useState("published");
  const [propertyModal, setPropertyModal] = useState({});
  const [isMobile, setIsMobile] = useState(false);

  const { data: session } = useSession();
  const user_id = session ? session.user.id : 0;
  const [renterContractID, setRenterContractID] = useState(0);

  const { data: tenantContracts, isLoading } = useTenantContract(user_id);

  useEffect(() => {
    if (!isLoading && Array.isArray(tenantContracts) && tenantContracts.length > 0) {
      // Automatically select the first available contract
      setRenterContractID(tenantContracts[0].id);
      console.log("Renter Contract ID set to:", tenantContracts[0].id);
    }
  }, [tenantContracts, isLoading]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 992);
    };

    handleResize(); // Call once to set initial state
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleEditPropertyModal = (e) => {
    if (session) {
      setEditPropertyShow(true);
    } else {
      console.log("Sign in needed");
    }
  };

  const handleTabChange = (tabKey) => {
    if (["published", "accepted", "declined"].includes(tabKey)) {
      setActiveTab(tabKey);
    } else {
      setActiveTab("published"); // Fallback to default tab
    }
  };

  const getHandledRentPayments = (projects) => {
    return <RentPaymentList rents_collection={projects} />;
  };

  const columnStyle = {
    height: "650px",
    overflowY: "scroll",
  };

  return (
    <RealEstatePageLayout
      pageTitle="Paiement de loyers"
      activeNav="CheckingAvailability"
      userLoggedIn
    >
      {/* {editPropertyShow && (
        <EditPropertyModal centered size='lg' show={editPropertyShow} onHide={() => setEditPropertyShow(false)} property={propertyModal} />
      )} */}

      <RealEstateAccountLayout accountPageTitle="Paiement de loyers">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h1 className="h2 mb-0">Paiements de loyers</h1>
        </div>
        <p className="pt-1 mb-4">
          Consulter ici tous les paiements de loyers effectués et en attente.
        </p>
        <Nav
          variant="tabs"
          defaultActiveKey="published"
          onSelect={handleTabChange}
          className="border-bottom mb-2"
        >
          <Nav.Item as={Col}>
            <Nav.Link eventKey="published">
              <i className="fi-file fs-base me-2"></i>
              Paiements de loyers non faits
            </Nav.Link>
          </Nav.Item>
          <Nav.Item as={Col}>
            <Nav.Link eventKey="accepted">
              <i className="fi-archive fs-base me-2"></i>
              Paiements de loyers partiels
            </Nav.Link>
          </Nav.Item>
          <Nav.Item as={Col}>
            <Nav.Link eventKey="declined">
              <i className="fi-file-clean fs-base me-2"></i>
              Paiements de loyers complets
            </Nav.Link>
          </Nav.Item>
        </Nav>

        <Row>
          {/* For small screens, display only one column based on activeTab */}
          {isMobile ? (
            <>
              {activeTab === "published" && (
                <Col xs={12} style={columnStyle}>
                  {getHandledRentPayments(_newRentPayments)}
                </Col>
              )}
              {activeTab === "accepted" && (
                <Col xs={12} style={columnStyle}>
                  {getHandledRentPayments(_acceptedRentPayments)}
                </Col>
              )}
              {activeTab === "declined" && (
                <Col xs={12} style={columnStyle}>
                  {getHandledRentPayments(_declinedRentPayments)}
                </Col>
              )}
            </>
          ) : (
            <>
              <Col xs={12} lg={4} style={columnStyle}>
                {getHandledRentPayments(_newRentPayments)}
              </Col>
              <Col xs={12} lg={4} style={columnStyle}>
                {getHandledRentPayments(_acceptedRentPayments)}
              </Col>
              <Col xs={12} lg={4} style={columnStyle}>
                {getHandledRentPayments(_declinedRentPayments)}
              </Col>
            </>
          )}
        </Row>
      </RealEstateAccountLayout>
    </RealEstatePageLayout>
  );
};

// Fetch data from API in getServerSideProps using statut as an input variable
export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }
  console.log("Session data:", session);
  let _newRentPayments, _acceptedRentPayments, _declinedRentPayments;

  // Check if the user is an admin or property owner
  if (session?.user?.roleId == "1200") {
    // Admin role
    console.log(session?.user?.roleId);
    _newRentPayments = await fetchRentPaymentsByStatutByRole(0);
    console.log(_newRentPayments);
    _acceptedRentPayments = await fetchRentPaymentsByStatutByRole(1);
    _declinedRentPayments = await fetchRentPaymentsByStatutByRole(2);
  } else {
    // Property owner
    const tenantContractsEndpoint = `${API_URL}?query={getContractsByKeyWords(locataire_id:${session.user.id},statut:1){id}}`;
    const contractsRes = await fetch(tenantContractsEndpoint);
    const contractsJson = await contractsRes.json();
    const tenantContracts = contractsJson?.data?.getContractsByKeyWords || [];
    const _renterContractID = tenantContracts.length > 0 ? tenantContracts[0].id : 0;

    console.log("Renter Contract IDD:", _renterContractID);
    const _pendingRentPayment = await promptOrCreatePendingPaiementLoyer(_renterContractID);
    console.log("Pending Rent Payment:", _pendingRentPayment);
    const _pendingRentCollection = await promptOrCreatePendingRentPayments(_renterContractID);
    console.log("Pending Rent Collection:", _pendingRentCollection);

    _newRentPayments = await fetchRentPaymentsByStatut(0, session.user.id);
    _acceptedRentPayments = await fetchRentPaymentsByStatut(1, session.user.id);
    _declinedRentPayments = await fetchRentPaymentsByStatut(2, session.user.id);
  }

  return {
    props: { _newRentPayments, _acceptedRentPayments, _declinedRentPayments },
  };
}

export default AccountRentPaymentsPage;

























































































