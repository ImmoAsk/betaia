import { useState, useEffect } from 'react';
import RealEstatePageLayout from '../../components/partials/RealEstatePageLayout';
import RealEstateAccountLayout from '../../components/partials/RealEstateAccountLayout';
import Nav from 'react-bootstrap/Nav';
import { useSession, getSession } from 'next-auth/react';
import { Row, Col } from 'react-bootstrap';
import { API_URL } from '../../utils/settings';
import PropertyInventoryList from '../../components/iacomponents/PropertyInventory/PropertyInventoryList';
import PropertyInventoryModal from '../../components/iacomponents/PropertyInventory/PropertyInventoryModal';
import PropertyInventoryCompare from '../../components/iacomponents/PropertyInventory/PropertyInventoryCompare';

// Helper function to fetch Inventory by statut for property owner
async function fetchInventoryByStatut(statut, proprietaireID) {
  const dataAPIresponse = await fetch(
    `${API_URL}?query={getInventoryByKeyWords(statut:${statut},proprietaire_id:${proprietaireID},orderBy:{order:DESC,column:ID}){id,statut,,montant_final,propriete{id,nuo}}}`
  );
  const responseData = await dataAPIresponse.json();
  return responseData.data ? responseData.data.getInventoryByKeyWords : [];
}

async function fetchRenterInventoryByStatut(statut, userID) {
  const dataAPIresponse = await fetch(
    `${API_URL}?query={getInventoryByKeyWords(statut:${statut},locataire_id:${userID},orderBy:{order:DESC,column:ID}){id,statut,montant_final,propriete{id,nuo}}}`
  );
  const responseData = await dataAPIresponse.json();
  return responseData.data ? responseData.data.getInventoryByKeyWords : [];
}

// Helper function to fetch Inventory by statut for admin
async function fetchInventoryByStatutByRole(statut) {
  const dataAPIresponse = await fetch(
    `${API_URL}?query={getInventoryByKeyWords(statut:${statut},orderBy:{order:DESC,column:ID}){id,statut,montant_final,propriete{id,nuo}}}`
  );
  const responseData = await dataAPIresponse.json();
  return responseData.data ? responseData.data.getInventoryByKeyWords : [];
}


const PropertyInventoryPage = ({ _newInventory, _acceptedInventory, _declinedInventory }) => {
  const [PropertyInventoryShow, setPropertyInventoryShow] = useState(false);
  const [activeTab, setActiveTab] = useState("published");
  const [propertyModal, setPropertyModal] = useState({});
  const [isMobile, setIsMobile] = useState(false);

  const [modalType, setModalType] = useState("entry");
  const [entryInventories, setEntryInventories] = useState([]); // [{property, items}]
  const [exitInventories, setExitInventories] = useState([]);
  const [comparativeInventories, setComparativeInventories] = useState([]);

  const { data: session } = useSession();

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


  useEffect(() => {
    setEntryInventories(JSON.parse(localStorage.getItem("entryInventories")) || []);
    setExitInventories(JSON.parse(localStorage.getItem("exitInventories")) || []);
    setComparativeInventories(
      JSON.parse(localStorage.getItem("comparativeInventories"))
    || []);
  }, []);

  useEffect(() => {
    localStorage.setItem("entryInventories", JSON.stringify(entryInventories));
    localStorage.setItem("exitInventories", JSON.stringify(exitInventories));
    localStorage.setItem(
      "comparativeInventories",
      JSON.stringify(comparativeInventories)
    );
  }, [entryInventories, exitInventories]);

  console.log(entryInventories)
  console.log(exitInventories);
  console.log(comparativeInventories);


  const handleModalSubmit = (inventoryPayload) => {
    // inventoryPayload: { property, items }
    if (modalType === "entry") {
      // Check if property already exists in entry inventories
      setEntryInventories((prev) => {
        const existingPropertyIndex = prev.findIndex(
          (inv) => inv.property.id === inventoryPayload.property.id
        );

        if (existingPropertyIndex >= 0) {
          // Property exists, merge items
          const updatedInventories = [...prev];
          const existingInventory = updatedInventories[existingPropertyIndex];

          // Create a new array that includes all items with unique IDs
          const combinedItems = [...existingInventory.items];

          // Add new items, replacing any with the same item ID
          inventoryPayload.items.forEach((newItem) => {
            const existingItemIndex = combinedItems.findIndex(
              (item) => item.item === newItem.item
            );
            if (existingItemIndex >= 0) {
              // Replace the existing item
              combinedItems[existingItemIndex] = newItem;
            } else {
              // Add new item
              combinedItems.push(newItem);
            }
          });

          // Update with combined items
          updatedInventories[existingPropertyIndex] = {
            ...existingInventory,
            items: combinedItems,
          };

          return updatedInventories;
        } else {
          // Property doesn't exist, add as new
          return [...prev, inventoryPayload];
        }
      });
    } else {
      // Same logic for exit inventories
      setExitInventories((prev) => {
        const existingPropertyIndex = prev.findIndex(
          (inv) => inv.property.id === inventoryPayload.property.id
        );

        if (existingPropertyIndex >= 0) {
          // Property exists, merge items
          const updatedInventories = [...prev];
          const existingInventory = updatedInventories[existingPropertyIndex];

          // Create a new array that includes all items with unique IDs
          const combinedItems = [...existingInventory.items];

          // Add new items, replacing any with the same item ID
          inventoryPayload.items.forEach((newItem) => {
            const existingItemIndex = combinedItems.findIndex(
              (item) => item.item === newItem.item
            );
            if (existingItemIndex >= 0) {
              // Replace the existing item
              combinedItems[existingItemIndex] = newItem;
            } else {
              // Add new item
              combinedItems.push(newItem);
            }
          });

          // Update with combined items
          updatedInventories[existingPropertyIndex] = {
            ...existingInventory,
            items: combinedItems,
          };

          return updatedInventories;
        } else {
          // Property doesn't exist, add as new
          return [...prev, inventoryPayload];
        }
      });
    }

    setPropertyInventoryShow(false);
  };

  // recompute comparative whenever entry or exit arrays change
  const computeComparatives = () => {
    const comps = [];
    entryInventories.forEach((entryInv) => {
      const exitInv = exitInventories.find(
        (ex) => ex.property.id === entryInv.property.id
      );
      if (exitInv) {
        // Generate a comparison between entry and exit inventories
        comps.push({
          property: entryInv.property,
          entryItems: entryInv.items,
          exitItems: exitInv.items,
        });
      }
    });
    setComparativeInventories(comps);
  };

  useEffect(() => {
    computeComparatives();
  }, [entryInventories, exitInventories]);

  const createPropertyInventoryModal = (type) => {
    if (session) {
      setPropertyInventoryShow(true);
      setModalType(type);
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

  const getHandledPropertyInventorys = (inventories) => {
    return <PropertyInventoryList inventories={inventories} />;
  };

  const getHandledPropertyInventoryCompare = (inventories) => {
    return <PropertyInventoryCompare inventories={inventories} />
  }

  const columnStyle = {
    height: "700px",
    overflowY: "scroll",
  };

  return (
    <RealEstatePageLayout
      pageTitle="Etat de lieux"
      activeNav="Account"
      userLoggedIn
    >
      {PropertyInventoryShow && (
        <PropertyInventoryModal
          centered
          size="lg"
          type={modalType}
          show={PropertyInventoryShow}
          onHide={() => setPropertyInventoryShow(false)}
          onSubmit={handleModalSubmit}
        />
      )}
      <RealEstateAccountLayout accountPageTitle="Etat de lieux">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h1 className="h2 mb-0">Etat de lieux</h1>
          <div className="d-flex align-items-right">
            <a
              href="#"
              className="fw-bold text-decoration-none"
              onClick={() => createPropertyInventoryModal("entry")}
            >
              <i className="fi-cash mt-n1 me-2" id="entry"></i>
              Creer un etat des lieux d'entree
            </a>
            <span className="mx-2">|</span>
            <a
              href="#"
              className="fw-bold text-decoration-none"
              onClick={() => createPropertyInventoryModal("exit")}
            >
              <i className="fi-link mt-n1 me-2" id="exit"></i>
              Creer un etat des lieux de sortie
            </a>
          </div>
        </div>
        <p className="pt-1 mb-4">
          Trouvez ici tous les etats des lieux pour les biens immobiliers en
          location et bails immobiliers commerciaux
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
              Etats de lieux en entree
            </Nav.Link>
          </Nav.Item>
          <Nav.Item as={Col}>
            <Nav.Link eventKey="accepted">
              <i className="fi-archive fs-base me-2"></i>
              Etats de lieux en sortie
            </Nav.Link>
          </Nav.Item>
          <Nav.Item as={Col}>
            <Nav.Link eventKey="declined">
              <i className="fi-file-clean fs-base me-2"></i>
              Etats de lieux compares
            </Nav.Link>
          </Nav.Item>
        </Nav>

        <Row>
          {/* For small screens, display only one column based on activeTab */}
          {isMobile ? (
            <>
              {activeTab === "published" && (
                <Col xs={12} style={columnStyle}>
                  {getHandledPropertyInventorys(entryInventories)}
                </Col>
              )}
              {activeTab === "accepted" && (
                <Col xs={12} style={columnStyle}>
                  {getHandledPropertyInventorys(exitInventories)}
                </Col>
              )}
              {activeTab === "declined" && (
                <Col xs={12} style={columnStyle}>
                  {getHandledPropertyInventoryCompare(comparativeInventories)}
                </Col>
              )}
            </>
          ) : (
            <>
              <Col xs={12} lg={4} style={columnStyle}>
                {getHandledPropertyInventorys(entryInventories)}
              </Col>
              <Col xs={12} lg={4} style={columnStyle}>
                {getHandledPropertyInventorys(exitInventories)}
              </Col>
              <Col xs={12} lg={4} style={columnStyle}>
                {getHandledPropertyInventoryCompare(comparativeInventories)}
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
        destination: '/auth/signin',
        permanent: false,
      },
    };
  }

  let _newInventory, _acceptedInventory, _declinedInventory;
  const project = [
    {
      id: 101, // negotiation offer ID
      statut: 0, // 0: Nouvelle, 1: Acceptée, 2: Refusée
      date_negociation: "2025-05-10T14:30:00Z",
      propriete: {
        nuo: "A-234", // property number
      },
    },
    {
      id: 102, // negotiation offer ID
      statut: 1, // 0: Nouvelle, 1: Acceptée, 2: Refusée
      date_negociation: "2025-05-10T14:30:00Z",
      propriete: {
        nuo: "A-234", // property number
      },
    },
  ];

  // Check the user's role and fetch Inventory accordingly
  switch (session?.user?.roleId) {
    case "151": // Tenant role
      _newInventory = await fetchRenterInventoryByStatut(0, session.user.id);
      _acceptedInventory = await fetchRenterInventoryByStatut(
        1,
        session.user.id
      );
      _declinedInventory = await fetchRenterInventoryByStatut(
        2,
        session.user.id
      );
      break;
    case "1200": // Admin role
    case "1231": // Admin role
      _newInventory = project;
      _acceptedInventory = project;
      // _newInventory = await fetchInventoryByStatutByRole(0);
      // _acceptedInventory = await fetchInventoryByStatutByRole(1);
      _declinedInventory = await fetchInventoryByStatutByRole(2);
      break;

    default: // Property owner
      _newInventory = await fetchInventoryByStatut(0, session.user.id);
      _acceptedInventory = await fetchInventoryByStatut(1, session.user.id);
      _declinedInventory = await fetchInventoryByStatut(2, session.user.id);
      break;
  }

  return {
    props: { _newInventory, _acceptedInventory, _declinedInventory },
  };
}

export default PropertyInventoryPage;
