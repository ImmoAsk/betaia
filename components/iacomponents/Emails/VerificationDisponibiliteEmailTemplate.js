// components/emails/AvailabilityRequestEmail.tsx
import * as React from "react";

export const VerificationDisponibiliteEmailTemplate=({
  agentName,
  customerName,
  propertyNuo,
  propertyLink,
  propertyImage,
}) => {
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f9f9f9",
        padding: "20px",
      }}
    >
      <table
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        }}
        cellPadding={0}
        cellSpacing={0}
        role="presentation"
      >
        <tbody>
          {/* Header */}
          <tr>
            <td style={{ backgroundColor: "#2563eb", padding: "20px" }}>
              <h2
                style={{
                  margin: 0,
                  color: "#ffffff",
                  fontSize: "20px",
                  fontWeight: "600",
                }}
              >
                Nouvelle demande de disponibilité
              </h2>
            </td>
          </tr>

          {/* Body */}
          <tr>
            <td style={{ padding: "20px" }}>
              <p style={{ fontSize: "16px", color: "#333" }}>
                Bonjour <strong>{agentName}</strong>,
              </p>
              <p style={{ fontSize: "15px", color: "#444" }}>
                Le client(e) <strong>{customerName}</strong> souhaite connaître la
                disponibilité du bien immobilier <strong>#{propertyNuo}</strong>.
              </p>

              {/* Property Card */}
              <table
                style={{
                  width: "100%",
                  marginTop: "16px",
                  border: "1px solid #eee",
                  borderRadius: "10px",
                  overflow: "hidden",
                }}
                cellPadding={0}
                cellSpacing={0}
              >
                <tbody>
                  {propertyImage && (
                    <tr>
                      <td>
                        <img
                          src={propertyImage}
                          alt={`Bien ${propertyNuo}`}
                          style={{
                            width: "100%",
                            height: "auto",
                            display: "block",
                          }}
                        />
                      </td>
                    </tr>
                  )}
                  <tr>
                    <td style={{ padding: "16px" }}>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "16px",
                          fontWeight: "500",
                          color: "#111",
                        }}
                      >
                        No. #{propertyNuo}
                      </p>
                      <a
                        href={propertyLink}
                        style={{
                          color: "#2563eb",
                          textDecoration: "none",
                          fontSize: "14px",
                        }}
                      >
                        En savoir plus →
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* CTA */}
              <div style={{ textAlign: "center", marginTop: "24px" }}>
                <a
                  href="https://immoask.com/tg/account-checkingavailabilities"
                  style={{
                    display: "inline-block",
                    backgroundColor: "#2563eb",
                    color: "#ffffff",
                    fontWeight: "600",
                    fontSize: "15px",
                    padding: "12px 24px",
                    borderRadius: "8px",
                    textDecoration: "none",
                  }}
                >
                  Vérifier et confirmer la disponibilité
                </a>
              </div>
            </td>
          </tr>

          {/* Footer */}
          <tr>
            <td
              style={{
                padding: "20px",
                backgroundColor: "#f3f4f6",
                fontSize: "12px",
                color: "#666",
                textAlign: "center",
              }}
            >
              Cet email vous est envoyé via <strong>immoask.com</strong>.<br />
              Merci de répondre rapidement à la demande du client.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
