import React from "react";

export const EmailTemplatePaymentLink = ({
  tenantName,
  rentAmount,
  dueDate,
  landlordName,
  landlordAddress,
  landlordNumber,
}) => {
  return (
    <div style={{ fontFamily: "Helvetica, Arial, sans-serif", fontSize: "16px", color: "#333", padding: "20px", backgroundColor: "#f9f9f9" }}>
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <img
          src="https://immoask.com/images/logo/immoask-logo-cropped.png"
          alt="ImmoAsk Logo"
          style={{ width: "180px", height: "auto" }}
        />
      </div>

      <div style={{ backgroundColor: "#ffffff", padding: "30px", borderRadius: "8px", boxShadow: "0 0 10px rgba(0,0,0,0.05)" }}>
        <h2 style={{ color: "#222", marginBottom: "20px" }}>Lien de Paiement - ImmoAsk</h2>

        <p><strong>Bonjour {tenantName},</strong></p>

        <p>
          Ceci est un rappel que la somme de <strong>{rentAmount} FCFA</strong> est due pour le(s) mois suivant(s) :
          <strong> {dueDate}</strong>.
        </p>

        <p>
          Merci de bien vouloir vous rendre sur l'application pour régler votre loyer, ou contacter votre bailleur,
          <strong> {landlordName}</strong>, au <strong>{landlordNumber}</strong>.
        </p>

        <p>Nous vous remercions pour votre confiance.</p>

        <br />
        <p style={{ fontStyle: "italic", color: "#555" }}>
          — {landlordName}, {landlordAddress}
        </p>
      </div>
    </div>
  );
};
