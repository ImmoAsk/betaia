import React, { useState } from "react";
import { Card, Button, Badge } from "react-bootstrap";
import { defaultInventoryItems, itemState } from "./constants";

// Helper to get item name from id
const getItemName = (itemId) => {
  const item = defaultInventoryItems.find((item) => item.id === itemId);
  return item ? item.name : itemId;
};

// Helper to get state name from id
const getStateName = (stateId) => {
  const state = itemState.find((state) => state.id === stateId);
  return state ? state.name : stateId;
};

// Individual item card
const ItemCard = ({
  item,
  isCurrent = false,
  onConfirmAdd,
  onEdit,
  onDelete,
  isConfirmed = false,
}) => {
  const itemName = item.itemName || getItemName(item.item);
  const stateName = getStateName(item.state);

  return (
    <Card
      className={`mb-3 ${
        isCurrent ? "border-primary" : isConfirmed ? "border-success" : ""
      }`}
    >
      <Card.Header className="d-flex justify-content-between align-items-center">
        <div>
          {isCurrent ? (
            <Badge bg="primary" className="me-2">
              New
            </Badge>
          ) : (
            <Badge bg={isConfirmed ? "success" : "secondary"} className="me-2">
              {isConfirmed ? "Confirmed" : "Saved"}
            </Badge>
          )}
          {isCurrent ? "Current Item (not saved)" : itemName}
        </div>
      </Card.Header>
      <Card.Body>
        <div className="d-flex mb-3">
          <div className="flex-grow-1">
            {!isCurrent && (
              <div className="mb-2">
                <strong>Item:</strong> {itemName}
              </div>
            )}
            <div className="mb-2">
              <strong>State:</strong> {stateName}
            </div>
            <div className="mb-2">
              <strong>Quantity:</strong> {item.quantity}
            </div>
            <div>
              <strong>Value:</strong> ${item.value}
            </div>
          </div>
          {item.image && (
            <div
              className="ms-3"
              style={{ minWidth: "80px", maxWidth: "120px" }}
            >
              <img
                src={
                  typeof item.image === "string"
                    ? item.image
                    : URL.createObjectURL(item.image)
                }
                alt={itemName}
                className="img-thumbnail"
                style={{ width: "100%", height: "80px", objectFit: "cover" }}
              />
            </div>
          )}
        </div>

        {/* Buttons for current item */}
        {isCurrent && onConfirmAdd && (
          <Button
            variant="primary"
            size="sm"
            onClick={onConfirmAdd}
            className="w-100"
          >
            Confirm & Add
          </Button>
        )}

        {/* Buttons for saved items */}
        {!isCurrent && !isConfirmed && onEdit && onDelete && (
          <div className="d-flex gap-2">
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => onEdit(item)}
              className="flex-grow-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-pencil me-1"
                viewBox="0 0 16 16"
              >
                <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
              </svg>
              Edit
            </Button>
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => onDelete(item.id)}
              className="flex-grow-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-trash me-1"
                viewBox="0 0 16 16"
              >
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z" />
                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z" />
              </svg>
              Delete
            </Button>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

// Empty state component
const EmptyState = () => (
  <div className="text-center py-5">
    <div className="mb-3">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        fill="currentColor"
        className="bi bi-clipboard-plus text-muted"
        viewBox="0 0 16 16"
      >
        <path
          fillRule="evenodd"
          d="M8 7a.5.5 0 0 1 .5.5V9H10a.5.5 0 0 1 0 1H8.5v1.5a.5.5 0 0 1-1 0V10H6a.5.5 0 0 1 0-1h1.5V7.5A.5.5 0 0 1 8 7z"
        />
        <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z" />
        <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z" />
      </svg>
    </div>
    <p className="text-muted">
      Fill out the form to add inventory items. Your items will appear here.
    </p>
  </div>
);

export default function PropertyInventoryPreview({
  modalType,
  selectedProperty,
  currentFormItem,
  currentItems,
  onConfirmAdd,
  onSubmitAll,
  onEditItem,
  onDeleteItem,
}) {
  // Check if current form has valid data to preview
  const hasCurrentItemToPreview =
    currentFormItem.item &&
    currentFormItem.state &&
    currentFormItem.quantity >= 1 &&
    currentFormItem.value >= 1;

  const inventoryTypeLabel = modalType === "entry" ? "Entry" : "Exit";

  // State for confirming all items
  const [allConfirmed, setAllConfirmed] = useState(false);

  const handleConfirmAll = () => {
    setAllConfirmed(true);
  };

  return (
    <div className="preview-panel p-3">
      <h4>
        {selectedProperty
          ? `Etat de lieux de la propriete N°${selectedProperty.id}`
          : inventoryTypeLabel + " Inventory Preview"}
      </h4>

      <Card className="mb-3">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <span>Property Inventory</span>
          {currentItems.length > 0 && !allConfirmed && (
            <Button
              variant="outline-success"
              size="sm"
              onClick={handleConfirmAll}
            >
              Confirm all
            </Button>
          )}
          {allConfirmed && <Badge bg="success">All items confirmed</Badge>}
        </Card.Header>
        <Card.Body style={{ maxHeight: "60vh", overflowY: "auto" }}>
          {hasCurrentItemToPreview && !allConfirmed && (
            <ItemCard
              item={currentFormItem}
              isCurrent={true}
              onConfirmAdd={onConfirmAdd}
            />
          )}

          {currentItems.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onEdit={!allConfirmed ? onEditItem : undefined}
              onDelete={!allConfirmed ? onDeleteItem : undefined}
              isConfirmed={allConfirmed}
            />
          ))}

          {!hasCurrentItemToPreview && currentItems.length === 0 && (
            <EmptyState />
          )}
        </Card.Body>
      </Card>

      {currentItems.length > 0 && (
        <div className="d-grid">
          <Button
            variant="primary"
            size="lg"
            onClick={onSubmitAll}
            disabled={!allConfirmed}
          >
            Submit All Items
          </Button>
        </div>
      )}
    </div>
  );
}
