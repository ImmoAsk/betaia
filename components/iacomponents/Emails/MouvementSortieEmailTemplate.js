import React from "react";

export const MouvementSortieEmailTemplate = ({
    tenantName,
    receiptDates,
    landlordName,
    landlordAddress,
    source_mouvement,
    montant_mouvement,
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
                Nous venons de créer un mouvement de sortie de {source_mouvement} de {montant_mouvement} CFA ce <strong>{receiptDates}</strong>
            </p>

            <p style={{ fontSize: "16px", marginBottom: "15px" }}>
                Le reçu correspondant est joint à cet email.
            </p>

            <p style={{ fontSize: "16px", marginBottom: "30px" }}>
                Merci de se connecter sur l'application pour consulter votre compte.
            </p>

            <p style={{ fontSize: "15px", color: "#555", borderTop: "1px solid #ddd", paddingTop: "15px" }}>
                — {landlordName}<br />
                <span style={{ fontStyle: "italic" }}>{landlordAddress}</span>
            </p>
        </div>
    );
};
