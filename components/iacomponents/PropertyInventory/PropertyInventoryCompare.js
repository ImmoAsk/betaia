import { Card, Badge } from "react-bootstrap";

export default function PropertyInventoryCompare({ inventories }) {
  return (
    <div>
      {inventories.length > 0 &&
        inventories.map((inv) => {
          let totalDiff = 0;

          return (
            <Card key={inv.property.id} className="mb-3 shadow-sm">
              <Card.Header className="d-flex align-items-center gap-2 bg-light">
                <img
                  src={inv.property.image_url}
                  alt={inv.property.title}
                  style={{
                    width: 32,
                    height: 32,
                    objectFit: "cover",
                    borderRadius: 4,
                  }}
                />
                <span className="fw-bold">{inv.property.title}</span>
              </Card.Header>
              <Card.Body className="p-0">
                <div className="table-responsive">
                  <table className="table table-striped table-bordered mb-0">
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th className="text-center">Entry Status</th>
                        <th className="text-center">Exit Status</th>
                        <th className="text-center">Difference</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inv.entryItems.map((entryItem) => {
                        const exitItem = inv.exitItems.find(
                          (item) => item.item === entryItem.item
                        );
                        let itemDiff = 0;
                        const exitValue = exitItem?.value || 0;

                        let badge = null;

                        if (exitItem) {
                          const quantityDiff =
                            entryItem.quantity - exitItem.quantity; // corrected
                          const stateChanged =
                            entryItem.state !== exitItem.state;

                          // Quantity difference
                          if (quantityDiff > 0) {
                            // Missing items → Pay
                            itemDiff += quantityDiff * exitValue;
                          } else if (quantityDiff < 0) {
                            // Extra items returned → Refund
                            itemDiff += quantityDiff * exitValue; // quantityDiff is negative, so correct sign
                          }

                          // State change
                          if (
                            entryItem.state === "good" &&
                            exitItem.state !== "good"
                          ) {
                            itemDiff += exitValue; // Pay for damage
                          } else if (
                            entryItem.state !== "good" &&
                            exitItem.state === "good"
                          ) {
                            itemDiff -= exitValue; // Refund for improvement
                          }

                          // Badge logic
                          if (itemDiff > 0) {
                            badge = <Badge bg="danger">+{itemDiff} Pay</Badge>;
                          } else if (itemDiff < 0) {
                            badge = (
                              <Badge bg="success">{itemDiff} Refund</Badge>
                            );
                          } else {
                            badge = <Badge bg="secondary">Unchanged</Badge>;
                          }
                        } else {
                          // Missing in exit → full value pay
                          itemDiff = entryItem.quantity * entryItem.value;
                          badge = (
                            <Badge bg="danger">+{itemDiff} Pay (Missing)</Badge>
                          );
                        }

                        totalDiff += itemDiff;

                        return (
                          <tr key={entryItem.id}>
                            <td>{entryItem.itemName}</td>
                            <td className="text-center">
                              <Badge
                                bg={
                                  entryItem.state === "good"
                                    ? "success"
                                    : "warning"
                                }
                              >
                                {entryItem.state}
                              </Badge>{" "}
                              <small>({entryItem.quantity})</small>
                            </td>
                            <td className="text-center">
                              {exitItem ? (
                                <>
                                  <Badge
                                    bg={
                                      exitItem.state === "good"
                                        ? "success"
                                        : "warning"
                                    }
                                  >
                                    {exitItem.state}
                                  </Badge>{" "}
                                  <small>({exitItem.quantity})</small>
                                </>
                              ) : (
                                <Badge bg="secondary">Not in exit</Badge>
                              )}
                            </td>
                            <td className="text-center">{badge}</td>
                          </tr>
                        );
                      })}

                      {/* Exit items not in entry → new items → refund */}
                      {inv.exitItems
                        .filter(
                          (exitItem) =>
                            !inv.entryItems.some(
                              (item) => item.item === exitItem.item
                            )
                        )
                        .map((exitItem) => {
                          const refund = exitItem.quantity * exitItem.value;
                          totalDiff -= refund;

                          return (
                            <tr key={exitItem.id}>
                              <td>{exitItem.itemName}</td>
                              <td className="text-center">
                                <Badge bg="secondary">Not in entry</Badge>
                              </td>
                              <td className="text-center">
                                <Badge
                                  bg={
                                    exitItem.state === "good"
                                      ? "success"
                                      : "warning"
                                  }
                                >
                                  {exitItem.state}
                                </Badge>{" "}
                                <small>({exitItem.quantity})</small>
                              </td>
                              <td className="text-center">
                                <Badge bg="success">
                                  -{refund} Refund (New)
                                </Badge>
                              </td>
                            </tr>
                          );
                        })}

                      {/* Total difference row */}
                      <tr>
                        <td colSpan="3" className="text-end fw-bold">
                          Total Difference
                        </td>
                        <td className="text-center fw-bold">
                          {totalDiff > 0 ? (
                            <Badge bg="danger">+{totalDiff} Pay</Badge>
                          ) : totalDiff < 0 ? (
                            <Badge bg="success">{totalDiff} Refund</Badge>
                          ) : (
                            <Badge bg="secondary">0</Badge>
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Card.Body>
            </Card>
          );
        })}
    </div>
  );
}
