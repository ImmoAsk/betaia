import { useState, useEffect } from "react";
import { Modal, Alert, Button } from "react-bootstrap";
import PropertyInventoryForm from "./PropertyInventoryForm";
import PropertyInventoryPreview from "./PropertyInventoryPreview";
import { defaultInventoryItems } from "./constants";
import { v4 as uuidv4 } from "uuid";
import "react-phone-input-2/lib/style.css";

export default function PropertyInventoryModal({
  type,
  show,
  onHide,
  onSubmit,
  existingInventories = [],
}) {
  const [formData, setFormData] = useState({
    item: "",
    state: "",
    quantity: 1,
    value: 1,
    image: null,
  });
  const [currentItems, setCurrentItems] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showWarning, setShowWarning] = useState(false);
  const [showDuplicateAlert, setShowDuplicateAlert] = useState(false);
  const [duplicateItem, setDuplicateItem] = useState(null);
  const [existingProperty, setExistingProperty] = useState(null);

  // Check if an item already exists in the inventory for the selected property
  const checkForDuplicateItem = (itemId) => {
    // Find if property exists in existing inventories
    const inventoryList =
      type === "entry" ? existingInventories.entry : existingInventories.exit;
    const existingPropInventory = inventoryList?.find(
      (inv) => inv.property.id === selectedProperty.id
    );

    // If property exists, check if item exists
    if (existingPropInventory) {
      const existingItem = existingPropInventory.items.find(
        (item) => item.item === itemId
      );
      if (existingItem) {
        return {
          exists: true,
          property: existingPropInventory.property,
          item: existingItem,
        };
      }
    }

    return { exists: false };
  };

  const handleAddRecord = () => {
    if (!selectedProperty || !formData.item || !formData.state) return;

    // Check if the item already exists for this property
    const { exists, property, item } = checkForDuplicateItem(formData.item);

    if (exists) {
      // Set the duplicate item and show alert
      setDuplicateItem({
        id: uuidv4(),
        item: formData.item,
        itemName:
          defaultInventoryItems.find((d) => d.id === formData.item)?.name ||
          formData.item,
        state: formData.state,
        quantity: formData.quantity,
        value: formData.value,
        image: formData.image ? URL.createObjectURL(formData.image) : null,
      });
      setExistingProperty(property);
      setShowDuplicateAlert(true);
      return;
    }

    // Create new item with UUID
    const newItem = {
      id: uuidv4(),
      item: formData.item,
      itemName:
        defaultInventoryItems.find((d) => d.id === formData.item)?.name ||
        formData.item,
      state: formData.state,
      quantity: formData.quantity,
      value: formData.value,
      image: formData.image ? URL.createObjectURL(formData.image) : null,
    };

    setCurrentItems((prev) => [...prev, newItem]);
    setFormData({ item: "", state: "", quantity: 1, value: 1, image: null });
    setShowWarning(false); // Reset warning when user adds an item
  };

  // Handle when user confirms replacing a duplicate item
  const handleDuplicateReplace = () => {
    if (duplicateItem) {
      setCurrentItems((prev) => [...prev, duplicateItem]);
      setFormData({ item: "", state: "", quantity: 1, value: 1, image: null });
      setDuplicateItem(null);
      setExistingProperty(null);
      setShowDuplicateAlert(false);
    }
  };

  // Handle when user cancels replacing a duplicate item
  const handleDuplicateCancel = () => {
    setDuplicateItem(null);
    setExistingProperty(null);
    setShowDuplicateAlert(false);
    setFormData({ item: "", state: "", quantity: 1, value: 1, image: null });
  };

  const handleFinalSubmit = () => {
    if (!selectedProperty || currentItems.length === 0) return;
    onSubmit({ property: selectedProperty, items: currentItems });
  };

  // Handle editing an existing item
  const handleEditItem = (item) => {
    // Populate form with item details
    setFormData({
      item: item.item,
      itemName: item.itemName,
      state: item.state,
      quantity: item.quantity,
      value: item.value,
      image: item.image,
    });

    // Remove the item from current items
    setCurrentItems(currentItems.filter((i) => i.id !== item.id));
  };

  // Handle deleting an item
  const handleDeleteItem = (itemId) => {
    setCurrentItems(currentItems.filter((i) => i.id !== itemId));
  };

  // Handle clearing all items
  const handleClearItems = () => {
    setFormData({ item: "", state: "", quantity: 1, value: 1, image: null });
    setCurrentItems([]);
  };

  const handleCancel = () => {
    // Show warning if there are unsaved items
    if (currentItems.length > 0 && !showWarning) {
      setShowWarning(true);
      return;
    }

    // Reset form and close modal
    handleClearItems();
    setShowWarning(false);
    onHide();
  };

  return (
    <Modal
      show={show}
      onHide={handleCancel}
      size="xl"
      backdrop="static"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {type === "entry"
            ? "Create Entry Inventory"
            : "Create Exit Inventory"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {showWarning && (
          <Alert variant="warning" className="mb-3">
            <Alert.Heading>Unsaved Changes</Alert.Heading>
            <p>
              You have {currentItems.length} unsaved inventory items. Are you
              sure you want to close this form? All your changes will be lost.
            </p>
            <div className="d-flex justify-content-end">
              <Button
                variant="outline-secondary"
                className="me-2"
                onClick={() => setShowWarning(false)}
              >
                Continue Editing
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  handleClearItems();
                  setShowWarning(false);
                  onHide();
                }}
              >
                Discard Changes
              </Button>
            </div>
          </Alert>
        )}

        {showDuplicateAlert && duplicateItem && (
          <Alert variant="warning" className="mb-3">
            <Alert.Heading>Duplicate Item Detected</Alert.Heading>
            <p>
              This item "{duplicateItem.itemName}" already exists in the
              inventory for property "{existingProperty?.title}". Do you want to
              replace the existing item?
            </p>
            <div className="d-flex justify-content-between align-items-start mt-3">
              <div>
                <strong>Existing item:</strong>
                <ul className="mt-2">
                  <li>State: {duplicateItem.state}</li>
                  <li>Quantity: {duplicateItem.quantity}</li>
                  <li>Value: ${duplicateItem.value}</li>
                </ul>
              </div>
              <div className="d-flex">
                <Button
                  variant="outline-secondary"
                  className="me-2"
                  onClick={handleDuplicateCancel}
                >
                  Cancel
                </Button>
                <Button variant="warning" onClick={handleDuplicateReplace}>
                  Replace Existing
                </Button>
              </div>
            </div>
          </Alert>
        )}

        <div className="d-flex" style={{ gap: 20 }}>
          <div style={{ flex: 1 }}>
            <PropertyInventoryForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleFinalSubmit}
              onAddRecord={handleAddRecord}
              onCancel={handleCancel}
              selectedProperty={selectedProperty}
              setSelectedProperty={setSelectedProperty}
              currentItems={currentItems}
            />
          </div>
          <div style={{ flex: 1 }}>
            <PropertyInventoryPreview
              modalType={type}
              selectedProperty={selectedProperty}
              currentFormItem={formData}
              currentItems={currentItems}
              onConfirmAdd={handleAddRecord}
              onSubmitAll={handleFinalSubmit}
              onEditItem={handleEditItem}
              onDeleteItem={handleDeleteItem}
            />
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
