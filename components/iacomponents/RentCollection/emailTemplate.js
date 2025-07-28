import React from "react";

export const EmailTemplate = ({
  tenantName,
  receiptDates,
  landlordName,
  landlordAddress,
}) => {
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f9f9f9",
        padding: "40px 20px",
        color: "#333",
        maxWidth: "600px",
        margin: "0 auto",
        borderRadius: "8px",
        border: "1px solid #e0e0e0",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <img
          src="https://immoask.com/images/logo/immoask-logo-cropped.png"
          alt="ImmoAsk Logo"
          style={{ width: "180px", height: "auto" }}
        />
      </div>

      <h2 style={{ color: "#222", fontSize: "22px" }}>
        Bonjour {tenantName},
      </h2>

      <p style={{ fontSize: "16px", marginBottom: "15px" }}>
        Nous vous informons que le paiement de votre loyer pour la/les période(s)
        suivante(s) : <strong>{receiptDates}</strong> a bien été enregistré.
      </p>

      <p style={{ fontSize: "16px", marginBottom: "15px" }}>
        Le reçu correspondant est joint à cet email.
      </p>

      <p style={{ fontSize: "16px", marginBottom: "30px" }}>
        Merci pour votre confiance.
      </p>

      <p style={{ fontSize: "15px", color: "#555", borderTop: "1px solid #ddd", paddingTop: "15px" }}>
        — {landlordName}<br />
        <span style={{ fontStyle: "italic" }}>{landlordAddress}</span>
      </p>
    </div>
  );
};
