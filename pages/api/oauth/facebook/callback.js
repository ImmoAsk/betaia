import { encrypt } from "../../../../lib/encryption";
import { promises as fs } from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { parse } from "cookie"; // To parse cookies from headers

const USER_SOCIAL_TOKENS_PATH = path.resolve(
  process.cwd(),
  "data/user_social_tokens.json"
);
const MOCK_USER_ID = "mock-user-123";

// Helper function to ensure the JSON file exists
async function ensureTokensFileExists() {
  try {
    await fs.access(USER_SOCIAL_TOKENS_PATH);
  } catch (error) {
    if (error.code === "ENOENT") {
      console.log(
        `Tokens file not found at ${USER_SOCIAL_TOKENS_PATH}. Creating it.`
      );
      try {
        await fs.mkdir(path.dirname(USER_SOCIAL_TOKENS_PATH), {
          recursive: true,
        });
        await fs.writeFile(
          USER_SOCIAL_TOKENS_PATH,
          JSON.stringify([], null, 2),
          "utf8"
        );
        console.log(
          `Tokens file created successfully at ${USER_SOCIAL_TOKENS_PATH}.`
        );
      } catch (writeError) {
        console.error(
          `Failed to create tokens file at ${USER_SOCIAL_TOKENS_PATH}:`,
          writeError.message,
          writeError.stack
        );
        throw new Error(
          `Server error: Could not initialize token storage. Details: ${writeError.message}`
        );
      }
    } else {
      console.error(
        `Error accessing tokens file at ${USER_SOCIAL_TOKENS_PATH}:`,
        error.message,
        error.stack
      );
      throw new Error(
        `Server error: Could not access token storage. Details: ${error.message}`
      );
    }
  }
}

async function readUserSocialTokens() {
  await ensureTokensFileExists(); // Ensures file exists or throws if creation fails
  try {
    const data = await fs.readFile(USER_SOCIAL_TOKENS_PATH, "utf8");
    if (data.trim() === "") return []; // Handle empty file
    return JSON.parse(data);
  } catch (error) {
    console.error(
      `Error reading or parsing user social tokens from ${USER_SOCIAL_TOKENS_PATH}:`,
      error.message,
      error.stack
    );
    throw new Error(
      `Failed to read or parse user social tokens. File might be corrupted or inaccessible. Details: ${error.message}`
    );
  }
}

async function writeUserSocialTokens(tokens) {
  try {
    await fs.writeFile(
      USER_SOCIAL_TOKENS_PATH,
      JSON.stringify(tokens, null, 2),
      "utf8"
    );
  } catch (error) {
    console.error(
      `Error writing user social tokens to ${USER_SOCIAL_TOKENS_PATH}:`,
      error.message,
      error.stack
    );
    throw new Error(
      `Failed to write user social tokens. Details: ${error.message}`
    );
  }
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { code, state, error, error_description } = req.query;

  const cookies = parse(req.headers.cookie || "");
  const expectedState = cookies.facebook_oauth_state; // Read state from cookie

  // Clear the state cookie immediately after reading it
  res.setHeader(
    "Set-Cookie",
    "facebook_oauth_state=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax"
  );

  if (state !== expectedState) {
    // Check if state exists and matches
    console.error("Invalid OAuth state for Facebook:", {
      received: state,
      expectedFromCookie: expectedState,
    });
    return res.redirect('/tg/account-socialmedia?status=facebook_error&error_description=Invalid_state');
  }

  if (error) {
    console.error("Facebook OAuth Error:", error, error_description);
    return res.redirect(
      `/tg/account-socialmedia?status=facebook_error&error_description=${encodeURIComponent(error_description || error)}`
    );
  }

  if (!code) {
    console.error("Facebook OAuth: No code received.");
    return res.redirect(
      "/tg/account-socialmedia?status=facebook_error&error_description=Authorization_code_missing"
    );
  }

  const {
    FACEBOOK_CLIENT_ID,
    FACEBOOK_CLIENT_SECRET,
    NEXT_PUBLIC_FACEBOOK_REDIRECT_URI,
    TOKEN_ENCRYPTION_KEY,
  } = process.env;

  if (
    !FACEBOOK_CLIENT_ID ||
    !FACEBOOK_CLIENT_SECRET ||
    !NEXT_PUBLIC_FACEBOOK_REDIRECT_URI
  ) {
    console.error("Facebook environment variables not set.");
    return res.redirect(
      "/tg/account-socialmedia?status=facebook_error&error_description=Configuration_error_FB_credentials"
    );
  }
  if (!TOKEN_ENCRYPTION_KEY || TOKEN_ENCRYPTION_KEY.length !== 32) {
    console.error(
      "TOKEN_ENCRYPTION_KEY is missing or not 32 bytes long. Please check your .env.local file."
    );
    return res.redirect(
      "/tg/account-socialmedia?status=facebook_error&error_description=Server_encryption_key_error"
    );
  }

  try {
    // 1. Exchange authorization code for access token
    const tokenResponse = await fetch(
      `https://graph.facebook.com/v12.0/oauth/access_token?client_id=${FACEBOOK_CLIENT_ID}&redirect_uri=${NEXT_PUBLIC_FACEBOOK_REDIRECT_URI}&client_secret=${FACEBOOK_CLIENT_SECRET}&code=${code}`
    );
    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      console.error("Facebook Token Exchange Error:", tokenData.error);
      return res.redirect(
        `/tg/account-socialmedia?status=facebook_error&error_description=${encodeURIComponent(tokenData.error.message || "Token_exchange_failed")}`
      );
    }

    const { access_token } = tokenData;

    // 2. Fetch user profile from Facebook
    const profileResponse = await fetch(
      `https://graph.facebook.com/me?fields=id,name,email,picture.type(large)&access_token=${access_token}`
    );
    const profileData = await profileResponse.json();

    if (profileData.error) {
      console.error("Facebook Profile Fetch Error:", profileData.error);
      return res.redirect(
        `/tg/account-socialmedia?status=facebook_error&error_description=${encodeURIComponent(profileData.error.message || "Profile_fetch_failed")}`
      );
    }

    const platformUserId = profileData.id;
    const userName = profileData.name;
    const userEmail = profileData.email; // May be undefined if not granted or not primary
    const profilePictureUrl = profileData.picture?.data?.url;

    // 3. Fetch user's managed pages to get Page ID and Page Access Token
    let pageId = null;
    let pageAccessToken = access_token; // Default to user access token
    let pageName = userName; // Default to user's name if no page context
    let pageProfilePictureUrl = profilePictureUrl; // Default to user's picture

    try {
      console.log("Attempting to fetch user's Facebook pages (/me/accounts)");
      const accountsResponse = await fetch(
        `https://graph.facebook.com/me/accounts?fields=id,name,access_token,picture.type(large)&access_token=${access_token}`
      );
      const accountsData = await accountsResponse.json();

      if (accountsData.error) {
        console.warn(
          "Facebook Accounts Fetch Warning (will proceed with user context):",
          accountsData.error.message
        );
        // Not necessarily a fatal error, user might not have pages or gave limited permissions
      } else if (accountsData.data && accountsData.data.length > 0) {
        const firstPage = accountsData.data[0]; // Take the first page
        pageId = firstPage.id;
        pageAccessToken = firstPage.access_token; // Use the Page Access Token
        pageName = firstPage.name; // Use the Page Name
        pageProfilePictureUrl = firstPage.picture?.data?.url; // Use Page profile picture
        console.log(
          `Found Facebook Page: ${pageName} (ID: ${pageId}). Will use its token and info.`
        );
      } else {
        console.log(
          "No Facebook pages found for this user, or no permission for /me/accounts. Proceeding with user context only."
        );
      }
    } catch (accountsError) {
      console.warn(
        "Error fetching Facebook accounts (will proceed with user context):",
        accountsError.message
      );
    }

    // 4. Encrypt and store tokens and profile info
    // This section will be wrapped in its own try-catch for file/encryption errors
    let encryptedTokenToStore; // This will be pageAccessToken if available, otherwise user's access_token
    try {
      encryptedTokenToStore = encrypt(pageAccessToken); // Encrypt the page access token if available, else user token

      let userSocialTokens = await readUserSocialTokens();

      userSocialTokens = userSocialTokens.filter(
        (token) =>
          !(token.userId === MOCK_USER_ID && token.platform === "facebook")
      );

      const newConnection = {
        id: uuidv4(),
        userId: MOCK_USER_ID,
        platform: "facebook",
        platformUserId: platformUserId, // User's own Facebook ID
        username: pageName, // Store Page Name if page context, else User Name
        email: userEmail, // User's email (might be undefined)
        profilePicture: pageProfilePictureUrl, // Page picture if page context, else User picture
        encryptedAccessToken: encryptedTokenToStore, // Store encrypted Page or User access token
        pageId: pageId, // Store the Page ID if available
        connectedAt: new Date().toISOString(),
      };

      userSocialTokens.push(newConnection);
      await writeUserSocialTokens(userSocialTokens);
    } catch (fileOrEncryptError) {
      console.error(
        "Facebook Callback: Error during token file operation or encryption:",
        fileOrEncryptError.message,
        fileOrEncryptError.stack
      );
      throw new Error(
        "Failed to process and store Facebook tokens due to a server-side issue."
      );
    }

    // 5. Redirect user back to the social media page
    return res.redirect("/tg/account-socialmedia?status=facebook_success");
  } catch (err) {
    console.error(
      "Facebook OAuth Callback Handler Error:",
      err.message,
      err.stack
    );
    let errorMessage = "An_unexpected_error_occurred";
    if (err instanceof Error) {
      errorMessage = err.message;
    }
    return res.redirect(
      `/tg/account-socialmedia?status=facebook_error&error_description=${encodeURIComponent(errorMessage)}`
    );
  }
}
