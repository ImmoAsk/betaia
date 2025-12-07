import React from "react";

export const NewPropertyEmailTemplate = ({ property }) => {
  return (
    <div
      style={{
        background: "#f5f7fb",
        fontFamily: "Segoe UI, Roboto, Helvetica, Arial, sans-serif",
        color: "#0f172a",
        padding: "24px",
      }}
    >
      {/* Hidden preview text for inbox preview */}
      <div
        style={{
          display: "none",
          visibility: "hidden",
          opacity: 0,
          height: 0,
          width: 0,
          overflow: "hidden",
          msoHide: "all",
        }}
      >
        Au carrefour de 3 quartiers (Agoe, Adidogome et Zanguera) :
        Deux villas jumelles sont mises en location — découvrez les détails et planifiez une visite.
      </div>

      <table
        role="presentation"
        width="100%"
        cellPadding="0"
        cellSpacing="0"
        style={{
          width: "100%",
          background: "#ffffff",
          borderRadius: "16px",
          overflow: "hidden",
          maxWidth: "600px",
          margin: "0 auto",
          boxShadow: "0 10px 30px rgba(18,27,46,0.08)",
        }}
      >
        <tbody>
          {/* Header */}
          <tr>
            <td style={{ padding: "28px 32px 8px 32px" }}>
              <div style={{ fontSize: "22px", fontWeight: 700, color: "#0f172a", lineHeight: 1.3 }}>
                Villas en location, Agoe Nanegbe (carrefour de 3 quartiers)
              </div>
              <div style={{ marginTop: 8, fontSize: 15, lineHeight: 1.7, color: "#334155" }}>
                Bonjour Madame/Monsieur, <br />
                Agoè (Nanegbé) – Entre le Carrefour Bonheur et le CEG Nanegbé, se trouve une villa jumelée à louer,
                avec jardin et une vue imprenable. Le calme de la zone est tout simplement légendaire.
                Ne manquez pas l’occasion d’en savoir plus.
              </div>
            </td>
          </tr>

          {/* Property Image */}
          <tr>
            <td style={{ padding: "16px 16px 0 16px" }}>
              <a
                href={`https://www.immoask.com/tg/locations-immobilieres/villa-meublee/lome/agoe/${property?.id || 5874}`}
                style={{ display: "block", borderRadius: "14px", overflow: "hidden" }}
              >
                <img
                  src={
                    property?.image ||
                    "https://immoaskbetaapi.omnisoft.africa/public/storage/uploads/visuels/proprietes/bJ7Nfms6xyA7zaXd2QeoW7hIVnv4dABaIlrTCMCo.jpg"
                  }
                  width="568"
                  alt={property?.title || "Villa en location, Agoe, Lome, Togo"}
                  style={{ display: "block", width: "100%", height: "auto" }}
                />
              </a>
            </td>
          </tr>

          {/* Property Card */}
          <tr>
            <td style={{ padding: "16px 32px 8px 32px" }}>
              <table
                role="presentation"
                width="100%"
                cellPadding="0"
                cellSpacing="0"
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: "14px",
                  width: "100%",
                  overflow: "hidden",
                }}
              >
                <tbody>
                  <tr>
                    <td style={{ padding: "16px 18px" }}>
                      <div style={{ fontSize: 18, fontWeight: 700, color: "#111827", lineHeight: 1.35 }}>
                        No. {property?.id || "5874"} | {property?.title || "Villa jumelle en location, Agoe, Lome"}
                      </div>
                      <div style={{ marginTop: 4, fontSize: 13, color: "#6b7280" }}>
                        Agoe (Nanegbe, non loin du carrefour Bonheur) — Ville :{" "}
                        <strong>Agoe, Lomé, Togo</strong>
                      </div>

                      <table
                        role="presentation"
                        cellPadding="0"
                        cellSpacing="0"
                        style={{ marginTop: 12, fontSize: 13, color: "#0f172a" }}
                      >
                        <tbody>
                          <tr>
                            <td style={{ paddingRight: 14 }}>
                              <strong>Prix :</strong> {property?.priceFurnished || "350 000 XOF"}/mois (meublé) |{" "}
                              {property?.priceUnfurnished || "250 000 XOF"}/mois (non meublé)
                            </td>
                            <td>
                              <strong>Surface :</strong> {property?.surface || "300 m²"}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>

          {/* CTA Button */}
          <tr>
            <td align="center" style={{ padding: "20px 32px 28px 32px" }}>
              <a
                href={`https://www.immoask.com/tg/locations-immobilieres/villa-meublee/lome/agoe/${property?.id || 5874}`}
                style={{
                  background: "#2563eb",
                  border: "1px solid #2563eb",
                  color: "#ffffff",
                  display: "inline-block",
                  fontSize: 16,
                  fontWeight: 700,
                  lineHeight: "44px",
                  textAlign: "center",
                  textDecoration: "none",
                  borderRadius: 10,
                  width: 300,
                }}
              >
                En savoir plus
              </a>

              <div
                style={{
                  fontSize: 12,
                  color: "#6b7280",
                  marginTop: 10,
                  wordBreak: "break-all",
                }}
              >
                Ou copiez ce lien dans votre navigateur :
                <br />
                https://www.immoask.com/tg/locations-immobilieres/villa-meublee/lome/agoe/
                {property?.id || 5874}
              </div>
            </td>
          </tr>

          {/* Footer */}
          <tr>
            <td style={{ padding: "18px 24px 28px 24px", fontSize: 12, color: "#6b7280", lineHeight: 1.6 }}>
              Vous recevez cet email car vous vous êtes inscrit(e) sur <strong>ImmoAsk</strong>.
              <br />
              Besoin d’aide ? Répondez à cet email ou contactez-nous :
              <a href="mailto:contact@immoask.com" style={{ color: "#2563eb" }}>
                {" "}
                contact@immoask.com
              </a>
              <br />
              <a href="/unsubscribe" style={{ color: "#6b7280", textDecoration: "underline" }}>
                Se désabonner
              </a>
              <div style={{ marginTop: 8 }}>
                <a href="https://www.facebook.com/immoask/" style={{ color: "#6b7280", marginRight: 8 }}>
                  Facebook
                </a>
                <a href="https://www.linkedin.com/company/immoask/" style={{ color: "#6b7280" }}>
                  LinkedIn
                </a>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
