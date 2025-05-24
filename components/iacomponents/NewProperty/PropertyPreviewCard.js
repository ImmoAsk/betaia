import Card from "react-bootstrap/Card";
import Badge from "react-bootstrap/Badge";
import ListGroup from "react-bootstrap/ListGroup";

const PropertyPreviewCard = ({ property, images }) => {
  // Destructure with defaults to avoid errors if property is initially empty
  const {
    title = "Titre de l'annonce...",
    offer = "",
    type = "",
    town = "",
    quarter = "",
    address = "Adresse...",
    area = 0,
    bedRooms = 0,
    livingRooms = 0,
    inBathRooms = 0,
    outBathRooms = 0, // Added
    parkings = 0, // Added
    floor = 0, // Added
    kitchen = "", // Added
    water = "", // Added
    electricity = "", // Added
    garden = "", // Added (will be '0' or '1')
    pool = "", // Added (will be '0' or '1')
    monthPrice = 0,
    buyPrice = 0,
    dayPrice = 0,
    description = "Description de la propriété...",
    furnished = "", // Existing ( '0' or '1')
    amenities = [], // Added
    cautionGuarantee = "", // Added
    visitRight = "", // Added
    honorary = "", // Added
    security = "", // Added (will be '0' or '1')
    owner = "", // Added (will be '0' or '1')
    otherConditions = "", // Added
  } = property || {};

  // Determine price and offer type for display
  let displayPrice = "Prix non spécifié";
  let offerText = "Non spécifié";

  if (offer === "1") {
    // Mettre en location
    offerText = "À Louer";
    displayPrice =
      monthPrice > 0
        ? `${Number(monthPrice).toLocaleString()} FCFA/mois`
        : "Prix sur demande";
  } else if (offer === "2") {
    // Mettre en vente
    offerText = "À Vendre";
    displayPrice =
      buyPrice > 0
        ? `${Number(buyPrice).toLocaleString()} FCFA`
        : "Prix sur demande";
  } else if (offer === "3") {
    // Mettre en colocation
    offerText = "En Colocation";
    displayPrice =
      monthPrice > 0
        ? `${Number(monthPrice).toLocaleString()} FCFA/mois`
        : "Prix sur demande";
  } else if (offer === "5" && furnished === "1") {
    // Mettre en investissement meublé (potentially for dayPrice)
    offerText = "Séjour (par nuit)";
    displayPrice =
      dayPrice > 0
        ? `${Number(dayPrice).toLocaleString()} FCFA/nuit`
        : "Prix sur demande";
  }

  const getOfferText = (offerValue) => {
    const options = {
      1: "À Louer",
      2: "À Vendre",
      3: "En Colocation",
      4: "En Bail",
      5: "Investissement",
    };
    return options[offerValue] || "Non spécifié";
  };

  const getPropertyTypeText = (typeValue) => {
    // This should map to the actual labels used in PropertyForm options for consistency
    const propertyTypeOptions = [
      { value: "1", label: "Villa" },
      { value: "2", label: "Appartement" },
      { value: "3", label: "Maison" },
      { value: "4", label: "Chambre (Pièce ou studio)" },
      { value: "5", label: "Chambre salon" },
      { value: "6", label: "Terrain rural" },
      { value: "7", label: "Terrain urbain" },
      { value: "14", label: "Boutique" }, // Note: value 14 used twice, check original form
      { value: "9", label: "Bureau" },
      { value: "10", label: "Appartement meublé" },
      { value: "11", label: "Espace coworking" },
      { value: "12", label: "Magasin" },
      /* { value: '14', label: 'Villa meublée' }, */ {
        value: "15",
        label: "Studio meublé",
      },
      { value: "16", label: "Hotel" },
      { value: "17", label: "Ecole" },
      { value: "18", label: "Bar-restaurant" },
      { value: "19", label: "Immeuble commercial" },
      { value: "29", label: "Mur commercial" },
      { value: "30", label: "Garage" },
      { value: "21", label: "Chambre d'hotel" },
      { value: "22", label: "Immeuble" },
      { value: "31", label: "Salle de Conference" },
    ];
    const foundType = propertyTypeOptions.find(
      (opt) => opt.value === typeValue
    );
    return foundType ? foundType.label : "Type non spécifié";
  };

  const getKitchenText = (kitchenValue) => {
    const options = {
      0: "Pas de cuisine",
      1: "Cuisine interne normale",
      2: "Cuisine américaine",
      3: "Cuisine externe normale",
      4: "Cuisine européeene",
    };
    return options[kitchenValue] || "Non spécifié";
  };

  const getWaterText = (waterValue) => {
    const options = {
      0: "Pas d'eau à l'intérieur",
      1: "TDE, Compteur personnel",
      2: "TDE, Compteur commun",
      3: "Forage, Compteur personnel",
      4: "Forage, Compteur commun",
    };
    return options[waterValue] || "Non spécifié";
  };

  const getElectricityText = (electricityValue) => {
    const options = {
      0: "Pas d'électricité",
      1: "CEET, Compteur commun",
      2: "CEET, Compteur personel", // Note: "personel" vs "personnel" in FORM_FIELDS.md
    };
    return options[electricityValue] || "Non spécifié";
  };

  const yesNoText = (value) =>
    value === "1" ? "Oui" : value === "0" ? "Non" : "Non spécifié";

  return (
    <Card className="shadow-sm">
      <Card.Header as="h5">Aperçu en direct</Card.Header>
      {images && images.length > 0 && (
        <Card.Img
          variant="top"
          src={URL.createObjectURL(images[0])}
          alt="Aperçu de l'image principale"
          style={{ maxHeight: "250px", objectFit: "cover" }}
        />
      )}
      {(!images || images.length === 0) && (
        <Card.Img
          variant="top"
          src="https://via.placeholder.com/300x200.png?text=Image+Principale"
          alt="Image placeholder"
          style={{ maxHeight: "250px", objectFit: "cover" }}
        />
      )}
      <Card.Body>
        <Card.Title>{title || "Titre de l'annonce..."}</Card.Title>
        <h5>
          <Badge bg="success">{displayPrice}</Badge>
        </h5>
        <Card.Text className="text-muted small">
          {getOfferText(offer)} - {getPropertyTypeText(type)}
          {furnished === "1" && (
            <Badge bg="info" text="dark" className="ms-2">
              Meublé
            </Badge>
          )}
        </Card.Text>
        <Card.Text>
          <strong>Lieu:</strong> {town || "Ville non spécifiée"}
          {quarter && `, ${quarter}`}
          {address && ` (${address})`}
        </Card.Text>

        <ListGroup variant="flush" className="mb-3">
          {Number(area) > 0 && (
            <ListGroup.Item>
              <strong>Surface:</strong> {area} m²
            </ListGroup.Item>
          )}
          {Number(bedRooms) > 0 && (
            <ListGroup.Item>
              <strong>Chambres:</strong> {bedRooms}
            </ListGroup.Item>
          )}
          {Number(livingRooms) > 0 && (
            <ListGroup.Item>
              <strong>Salons:</strong> {livingRooms}
            </ListGroup.Item>
          )}
          {Number(inBathRooms) > 0 && (
            <ListGroup.Item>
              <strong>Salles de bain internes:</strong> {inBathRooms}
            </ListGroup.Item>
          )}
          {Number(outBathRooms) > 0 && (
            <ListGroup.Item>
              <strong>Salles de bain externes:</strong> {outBathRooms}
            </ListGroup.Item>
          )}
          {Number(parkings) > 0 && (
            <ListGroup.Item>
              <strong>Garages:</strong> {parkings}
            </ListGroup.Item>
          )}
          {Number(floor) > 0 && (
            <ListGroup.Item>
              <strong>Étage:</strong> {floor}
            </ListGroup.Item>
          )}
          {kitchen && (
            <ListGroup.Item>
              <strong>Cuisine:</strong> {getKitchenText(kitchen)}
            </ListGroup.Item>
          )}
          {water && (
            <ListGroup.Item>
              <strong>Eau:</strong> {getWaterText(water)}
            </ListGroup.Item>
          )}
          {electricity && (
            <ListGroup.Item>
              <strong>Électricité:</strong> {getElectricityText(electricity)}
            </ListGroup.Item>
          )}
          {garden && (
            <ListGroup.Item>
              <strong>Jardin:</strong> {yesNoText(garden)}
            </ListGroup.Item>
          )}
          {pool && (
            <ListGroup.Item>
              <strong>Piscine:</strong> {yesNoText(pool)}
            </ListGroup.Item>
          )}
        </ListGroup>

        {furnished === "1" && amenities && amenities.length > 0 && (
          <>
            <h6>Aménagements ({amenities.length}):</h6>
            <p style={{ fontSize: "0.9rem" }}>
              {amenities.map((amenity) => amenity.label || amenity).join(", ")}
            </p>
          </>
        )}

        <h6>Description:</h6>
        <p
          style={{ fontSize: "0.9rem", maxHeight: "100px", overflowY: "auto" }}
        >
          {description || "Aucune description pour le moment..."}
        </p>

        {(cautionGuarantee ||
          visitRight ||
          honorary ||
          security ||
          owner ||
          otherConditions) && (
          <>
            <h6 className="mt-3">Conditions d'accès:</h6>
            <ListGroup variant="flush" className="mb-3">
              {cautionGuarantee && (
                <ListGroup.Item>
                  <strong>Caution/Avance:</strong> {cautionGuarantee}
                </ListGroup.Item>
              )}
              {visitRight && (
                <ListGroup.Item>
                  <strong>Droit de visite:</strong>{" "}
                  {Number(visitRight).toLocaleString()} FCFA
                </ListGroup.Item>
              )}
              {honorary && (
                <ListGroup.Item>
                  <strong>Honoraires:</strong>{" "}
                  {Number(honorary).toLocaleString()} FCFA
                </ListGroup.Item>
              )}
              {security && (
                <ListGroup.Item>
                  <strong>Gardien:</strong> {yesNoText(security)}
                </ListGroup.Item>
              )}
              {owner && (
                <ListGroup.Item>
                  <strong>Bailleur présent:</strong> {yesNoText(owner)}
                </ListGroup.Item>
              )}
            </ListGroup>
            {otherConditions && (
              <>
                <strong>Autres conditions:</strong>
                <p
                  style={{
                    fontSize: "0.9rem",
                    maxHeight: "70px",
                    overflowY: "auto",
                  }}
                >
                  {otherConditions}
                </p>
              </>
            )}
          </>
        )}
      </Card.Body>
      <Card.Footer className="text-muted small">
        Cet aperçu se met à jour automatiquement.
      </Card.Footer>
    </Card>
  );
};

export default PropertyPreviewCard;
