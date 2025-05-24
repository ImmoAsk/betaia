import fs from "fs/promises";
import path from "path";
import { decrypt } from "../../../lib/encryption"; // Adjust path as necessary

const TOKENS_FILE_PATH = path.join(
  process.cwd(),
  "data",
  "user_social_tokens.json"
);

// For providing display details for connected accounts
const PLATFORM_DETAILS_MAP = {
  linkedin: { name: "LinkedIn", icon: "bi-linkedin" },
  facebook: { name: "Facebook Page", icon: "bi-facebook" },
  twitter: { name: "Twitter", icon: "bi-twitter-x" },
  instagram: { name: "Instagram", icon: "bi-instagram" },
  // Add other platforms if they can be connected
};

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end("Method Not Allowed");
  }

  // In a real app, you would filter connections by the authenticated user ID
  // const userId = getUserIdFromSession(req); // Placeholder for getting actual user ID
  const mockUserId = "mock-user-123"; // Using the same mock user ID as in the callback

  try {
    let allConnections = [];
    try {
      const tokensFileContent = await fs.readFile(TOKENS_FILE_PATH, "utf-8");
      allConnections = JSON.parse(tokensFileContent);
    } catch (error) {
      // If file doesn't exist or is empty, treat as no connections
      if (error.code === "ENOENT") {
        return res.status(200).json([]);
      }
      throw error; // Re-throw other errors
    }

    // Filter connections for the current mock user
    const userConnections = allConnections.filter(
      (conn) => conn.userId === mockUserId
    );

    // For displaying connections, we usually don't need to send tokens to the client.
    // We send profile information and connection status.
    // If a token is needed for a client-side action (rarely, and not secure), decrypt it here.
    // For now, we'll return the stored profile info without decrypting tokens.
    const connectionsForClient = userConnections.map((conn) => {
      const platformInfo = PLATFORM_DETAILS_MAP[conn.platform] || {
        name: conn.platform,
        icon: "bi-question-circle",
      }; // Default if platform unknown
      return {
        id: conn.platform, // Platform identifier (e.g., 'facebook') for filtering available platforms
        name: platformInfo.name, // Platform display name
        icon: platformInfo.icon, // Platform icon
        username: conn.username,
        profilePicture: conn.profilePicture,
        connectedAt: conn.connectedAt,
        userId: conn.userId, // Internal, not directly used by card but good to have
        connectionId: conn.id, // The unique UUID of this connection instance for keys/disconnect
      };
    });

    return res.status(200).json(connectionsForClient);
  } catch (error) {
    console.error("Error fetching social connections:", error);
    return res
      .status(500)
      .json({
        message: "Failed to fetch social connections.",
        error: error.message,
      });
  }
}
