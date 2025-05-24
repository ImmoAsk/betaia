// Using React syntax for email templates with Resend.
// Inline styles are generally recommended for best email client compatibility.

const mainContainerStyle = {
  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  backgroundColor: "#f4f4f7",
  margin: "0 auto",
  padding: "20px",
  maxWidth: "600px",
  border: "1px solid #e0e0e0",
  borderRadius: "8px",
};

const headerStyle = {
  backgroundColor: "#007bff",
  color: "#ffffff",
  padding: "20px",
  textAlign: "center",
  borderRadius: "6px 6px 0 0",
};

const headerTextStyle = {
  margin: "0",
  fontSize: "24px",
};

const contentStyle = {
  backgroundColor: "#ffffff",
  padding: "30px",
  lineHeight: "1.6",
  color: "#333333",
  fontSize: "16px",
};

const propertyDetailStyle = {
  marginBottom: "12px",
};

const strongStyle = {
  fontWeight: "bold",
  color: "#555555",
};

const linkStyle = {
  color: "#007bff",
  textDecoration: "none",
  fontWeight: "bold",
};

const buttonStyle = {
  display: "inline-block",
  backgroundColor: "#28a745",
  color: "#ffffff",
  padding: "12px 25px",
  marginTop: "20px",
  borderRadius: "5px",
  textDecoration: "none",
  fontSize: "16px",
  fontWeight: "bold",
};

const footerStyle = {
  textAlign: "center",
  padding: "20px",
  fontSize: "12px",
  color: "#777777",
  borderTop: "1px solid #e0e0e0",
  marginTop: "20px",
};

const NewPropertyNotificationEmail = ({ propertyDetails }) => {
  console.log(propertyDetails);
  const {
    title = "N/A",
    price = "N/A",
    link = "#",
    address = "N/A",
    town = "N/A",
    quarter = "N/A",
    // offer, // For determining "For Rent" / "For Sale"
    // cout_mensuel, cout_vente for more precise pricing in future
  } = propertyDetails || {};

  // A more generic price display for now, can be enhanced
  const displayPrice = price;

  return (
    <div style={mainContainerStyle}>
      <div style={headerStyle}>
        <h1 style={headerTextStyle}>Nouvelle Propriété Disponible !</h1>
      </div>
      <div style={contentStyle}>
        <p>Bonjour,</p>
        <p>
          Une nouvelle propriété qui pourrait intéresser vos clients vient
          d'être listée sur notre plateforme.
        </p>

        <h2
          style={{
            color: "#007bff",
            marginTop: "25px",
            marginBottom: "15px",
            borderBottom: "2px solid #eee",
            paddingBottom: "10px",
          }}
        >
          Détails de la Propriété :
        </h2>

        <div style={propertyDetailStyle}>
          <span style={strongStyle}>Titre :</span> {title}
        </div>
        <div style={propertyDetailStyle}>
          <span style={strongStyle}>Prix :</span> {displayPrice}
        </div>
        <div style={propertyDetailStyle}>
          <span style={strongStyle}>Localisation :</span> {quarter}, {town}
        </div>
        {address && address !== "N/A" && (
          <div style={propertyDetailStyle}>
            <span style={strongStyle}>Adresse :</span> {address}
          </div>
        )}

        <p style={{ textAlign: "center", marginTop: "30px" }}>
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            style={buttonStyle}
          >
            Voir les détails de la propriété
          </a>
        </p>

        <p style={{ marginTop: "30px" }}>
          N'hésitez pas à contacter le propriétaire ou à consulter l'annonce
          pour plus d'informations.
        </p>
        <p>Cordialement,</p>
        <p style={strongStyle}>L'équipe ImmoAsk</p>
      </div>
      <div style={footerStyle}>
        ImmoAsk | Votre partenaire immobilier de confiance.
        <br />
        Si vous ne souhaitez plus recevoir ces notifications, veuillez ajuster
        vos paramètres (fonctionnalité à venir).
      </div>
    </div>
  );
};

export default NewPropertyNotificationEmail;
