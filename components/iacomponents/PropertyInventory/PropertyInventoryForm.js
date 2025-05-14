import React from "react";
import { Form, Button } from "react-bootstrap";
import Select from "react-select";
import { properties, defaultInventoryItems, itemState } from "./constants";
import styles from "./InventoryForm.module.css";

const propertyOptions = properties.map((property) => ({
  value: property.id,
  label: property.title,
  image: property.image_url,
  data: property,
}));

const inventoryItemOptions = defaultInventoryItems.map((item) => ({
  value: item.id,
  label: item.name,
}));

const itemStateOptions = itemState.map((state) => ({
  value: state.id,
  label: state.name,
}));

// Custom option component for property select with thumbnail
const PropertyOption = ({ innerProps, data, isSelected }) => (
  <div
    {...innerProps}
    className={`d-flex align-items-center p-2 ${isSelected ? "bg-light" : ""}`}
    style={{ cursor: "pointer" }}
  >
    <img
      src={data.image}
      alt={data.label}
      style={{
        width: 32,
        height: 32,
        marginRight: 10,
        objectFit: "cover",
        borderRadius: 4,
      }}
    />
    <div>{data.label}</div>
  </div>
);

export default function PropertyInventoryForm({
  formData,
  setFormData,
  onSubmit,
  onAddRecord,
  onCancel,
  selectedProperty,
  setSelectedProperty,
  currentItems = [],
}) {
  const handlePropertyChange = (selected) => {
    setSelectedProperty(selected?.data || null);
  };

  const handleItemChange = (selected) => {
    setFormData({ ...formData, item: selected?.value || "" });
  };

  const handleStateChange = (selected) => {
    setFormData({ ...formData, state: selected?.value || "" });
  };

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      setFormData({ ...formData, image: files[0] || null });
    } else if (type === "number") {
      setFormData({
        ...formData,
        [name]: Math.max(1, parseInt(value, 10) || 1),
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const isFormValid = () => {
    return (
      formData.item &&
      formData.state &&
      formData.quantity >= 1 &&
      formData.value >= 1
    );
  };

  return (
    <div className="inventory-form p-3">
      <h4>
        {selectedProperty
          ? `Etat de lieux de la propriete N°${selectedProperty.id}`
          : "Nouvel inventaire"}
      </h4>

      <Form>
        <Form.Group className="mb-4">
          <Form.Label className="fw-bold">Pour quelle propriete?</Form.Label>
          <Select
            options={propertyOptions}
            onChange={handlePropertyChange}
            placeholder="Sélectionner une propriété..."
            isClearable
            isDisabled={currentItems.length > 0}
            components={{ Option: PropertyOption }}
            className="mb-3"
          />
          {currentItems.length > 0 && (
            <div className="text-muted small">
              <em>
                Property selection is disabled while items are added. Clear
                items to change property.
              </em>
            </div>
          )}
        </Form.Group>

        {selectedProperty && (
          <>
            <Form.Group className="mb-3">
              <Form.Label>Item</Form.Label>
              <Select
                options={inventoryItemOptions}
                onChange={handleItemChange}
                value={
                  formData.item
                    ? inventoryItemOptions.find(
                        (opt) => opt.value === formData.item
                      )
                    : null
                }
                placeholder="Select an item..."
                isClearable
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>State</Form.Label>
              <Select
                options={itemStateOptions}
                onChange={handleStateChange}
                value={
                  formData.state
                    ? itemStateOptions.find(
                        (opt) => opt.value === formData.state
                      )
                    : null
                }
                placeholder="Select item state..."
                isClearable
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                name="quantity"
                min="1"
                value={formData.quantity}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Value</Form.Label>
              <Form.Control
                type="number"
                name="value"
                min="1"
                value={formData.value}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleInputChange}
              />
              {formData.image && (
                <div className="mt-2">
                  <img
                    src={URL.createObjectURL(formData.image)}
                    alt="Preview"
                    style={{ maxWidth: "100%", maxHeight: "200px" }}
                  />
                </div>
              )}
            </Form.Group>

            <div className="d-flex gap-2 mt-4">
              <Button
                variant="outline-secondary"
                onClick={onCancel}
                className="w-50"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={onAddRecord}
                disabled={!isFormValid()}
                className="w-50"
              >
                Add Record
              </Button>
            </div>
          </>
        )}
      </Form>
    </div>
  );
}
