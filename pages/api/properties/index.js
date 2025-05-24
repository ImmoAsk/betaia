import fs from "fs";
import path from "path";
import formidable from "formidable"; // Import formidable
import { v4 as uuidv4 } from "uuid"; // For generating unique filenames

// Disable Next.js body parsing for this route, as formidable will handle it
export const config = {
  api: {
    bodyParser: false,
  },
};

const dataFilePath = path.join(process.cwd(), "src", "data", "properties.json");
const uploadsDir = path.join(process.cwd(), "public", "uploads", "properties");

// Ensure uploads directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Function to read properties from the JSON file
const readPropertiesFromFile = () => {
  try {
    if (fs.existsSync(dataFilePath)) {
      const jsonData = fs.readFileSync(dataFilePath);
      // Handle empty or invalid JSON
      return jsonData.length > 0 ? JSON.parse(jsonData) : [];
    }
  } catch (error) {
    console.error("Error reading properties file:", error);
  }
  return []; // Return empty array if file doesn't exist or error occurs
};

// Function to write properties to the JSON file
const writePropertiesToFile = (properties) => {
  try {
    const jsonData = JSON.stringify(properties, null, 2);
    fs.writeFileSync(dataFilePath, jsonData);
  } catch (error) {
    console.error("Error writing properties file:", error);
  }
};

// Initialize propertiesStore from file
let propertiesStore = readPropertiesFromFile();

export default async function handler(req, res) {
  console.log(
    `[API /api/properties] Received request: ${req.method} ${req.url}`
  ); // Added logging
  const mockUserId = "user1"; // Simulate session for userId

  if (req.method === "POST") {
    console.log("[API /api/properties] Entered POST handler."); // Added logging
    const form = formidable({
      uploadDir: uploadsDir,
      keepExtensions: true,
      multiples: true, // Important for multiple files
      filename: (name, ext, part, form) => {
        // part.originalFilename will be like 'image_0', 'image_1' from client
        // We want to use the actual original filename if available, or generate a unique one
        // The `part` object contains `originalFilename` (from client), `mimetype`, etc.
        // `name` here is the field name e.g. 'image_0'
        // `ext` is the extension derived by formidable
        // Let's create a unique filename to avoid collisions, but try to keep original extension.
        return `${uuidv4()}${ext}`;
      },
    });

    try {
      const [fields, files] = await form.parse(req);

      console.log("[API /api/properties] Formidable parsed fields:", fields);
      console.log("[API /api/properties] Formidable parsed files:", files);

      // Extract text fields. Formidable wraps single values in arrays.
      const newPropertyData = {};
      for (const key in fields) {
        if (fields[key].length === 1) {
          newPropertyData[key] = fields[key][0];
        } else {
          newPropertyData[key] = fields[key]; // Keep as array if multiple values for a field (though not expected for most here)
        }
      }

      // Check for 'titre' and 'offre_id' (previously was 'offer')
      if (!newPropertyData.titre || !newPropertyData.offre_id) {
        return res
          .status(400)
          .json({ error: "Titre et identifiant de l'offre sont requis." });
      }

      const uploadedImagePaths = [];
      // Process uploaded files
      // `files` will be an object where keys are field names (`image_0`, `image_1`, etc.)
      // and values are arrays of File objects (or single File if not multiples)
      Object.keys(files).forEach((fieldName) => {
        if (fieldName.startsWith("images[")) {
          // Process only our image fields
          const fileArray = Array.isArray(files[fieldName])
            ? files[fieldName]
            : [files[fieldName]];
          fileArray.forEach((file) => {
            if (file && file.newFilename) {
              const protocol =
                req.headers["x-forwarded-proto"] ||
                (process.env.NODE_ENV === "production" ? "https" : "http");
              const host = req.headers.host;
              const absoluteBaseUrl = `${protocol}://${host}`;
              const webPath = `${absoluteBaseUrl}/uploads/properties/${file.newFilename}`;
              uploadedImagePaths.push(webPath);
            }
          });
        }
      });

      console.log("Uploaded image paths:", uploadedImagePaths);

      const newProperty = {
        id: `prop${Date.now()}`,
        userId: mockUserId,
        status: "available",
        ...newPropertyData, // Spread the text fields
        images:
          uploadedImagePaths.length > 0
            ? uploadedImagePaths
            : [
                `https://via.placeholder.com/300x200.png?text=Property+${Math.floor(Math.random() * 1000)}`,
              ], // Use uploaded images
        // Ensure numeric fields are correctly typed if they came as strings
        piece: Number(newPropertyData.piece) || 0,
        salon: Number(newPropertyData.salon) || 0,
        pays_id: Number(newPropertyData.pays_id) || 0,
        surface: Number(newPropertyData.surface) || 0,
        cout_mensuel: Number(newPropertyData.cout_mensuel) || 0,
        cout_vente: Number(newPropertyData.cout_vente) || 0,
        nuitee: Number(newPropertyData.nuitee) || 0,
        part_min_investissement:
          Number(newPropertyData.part_min_investissement) || 0,
        garage: Number(newPropertyData.garage) || 0,
        eau: Number(newPropertyData.eau) || 0,
        electricite: Number(newPropertyData.electricite) || 0,
        categorie_id: Number(newPropertyData.categorie_id) || 0,
        user_id: Number(newPropertyData.user_id) || Number(mockUserId), // Fallback to mockUserId if not provided
        // Directly use offre_id from newPropertyData, as it's now expected to be sent correctly
        offre_id: Number(newPropertyData.offre_id) || 0,
        ville_id: Number(newPropertyData.ville_id) || 0,
        quartier_id: Number(newPropertyData.quartier_id) || 0,
        piscine: Number(newPropertyData.piscine) || 0,
        gardien_securite: Number(newPropertyData.gardien_securite) || 0,
        cuisine: Number(newPropertyData.cuisine) || 0,
        jardin: Number(newPropertyData.jardin) || 0,
        menage: Number(newPropertyData.menage) || 0,
        etage: Number(newPropertyData.etage) || 0,
        caution_avance: Number(newPropertyData.caution_avance) || 0,
        honoraire: Number(newPropertyData.honoraire) || 0,
        balcon: Number(newPropertyData.balcon) || 0,
        terrasse_balcon: Number(newPropertyData.terrasse_balcon) || 0,
        cout_visite: Number(newPropertyData.cout_visite) || 0,
        est_present_bailleur: Number(newPropertyData.est_present_bailleur) || 0,
        est_meuble: Number(newPropertyData.est_meuble) || 0,
      };

      // Re-read propertiesStore before pushing and writing to avoid race conditions if multiple requests happen
      // For a simple JSON file store, this is a basic precaution. A real DB would handle this better.
      propertiesStore = readPropertiesFromFile();
      propertiesStore.push(newProperty);
      writePropertiesToFile(propertiesStore);
      console.log(
        "Property saved to file:",
        newProperty.id,
        "with images:",
        newProperty.images
      );

      res.status(201).json({
        // MODIFIED RESPONSE
        message: "Propriété enregistrée avec succès!",
        property: {
          id: newProperty.id,
          titre: newProperty.titre,
          // Use a consistent name like imageUrls, mapping from newProperty.images
          imageUrls: newProperty.images,
        },
      });
    } catch (err) {
      console.error(
        "[API /api/properties] Error processing form data (raw error object):",
        err
      ); // Enhanced logging
      console.error("[API /api/properties] Error stack:", err.stack); // Added stack trace logging
      res
        .status(500)
        .json({
          error: "Erreur serveur lors du traitement du formulaire.",
          details: err.message,
        });
    }
  } else if (req.method === "GET") {
    propertiesStore = readPropertiesFromFile(); // Ensure fresh data on GET too
    const userProperties = propertiesStore.filter(
      (p) => p.userId === mockUserId
    );
    console.log(
      "API returning properties for user:",
      mockUserId,
      userProperties.length
    );
    res.status(200).json(userProperties);
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
