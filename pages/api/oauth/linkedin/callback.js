// LinkedIn OAuth Callback Handler
// This API route will handle the redirect from LinkedIn after user authorization.

import { encrypt } from '../../../../lib/encryption'; // Adjusted path
import { parse } from 'cookie'; // To parse cookies from headers
import fs from 'fs/promises';
import path from 'path';

const TOKENS_FILE_PATH = path.join(process.cwd(), 'data', 'user_social_tokens.json');
const LINKEDIN_CLIENT_ID = process.env.LINKEDIN_CLIENT_ID;
const LINKEDIN_CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET;
const LINKEDIN_REDIRECT_URI = process.env.NEXT_PUBLIC_LINKEDIN_REDIRECT_URI;

async function ensureTokensFileExists() {
  try {
    await fs.access(TOKENS_FILE_PATH);
  } catch (error) {
    if (error.code === 'ENOENT') { // File does not exist
      console.log(`Tokens file not found at ${TOKENS_FILE_PATH}. Creating it.`);
      try {
        await fs.writeFile(TOKENS_FILE_PATH, JSON.stringify([]));
        console.log(`Tokens file created successfully at ${TOKENS_FILE_PATH}.`);
      } catch (writeError) {
        console.error(`Failed to create tokens file at ${TOKENS_FILE_PATH}:`, writeError.message, writeError.stack);
        throw new Error(`Server error: Could not initialize token storage. Details: ${writeError.message}`);
      }
    } else {
      // Other errors accessing the file (e.g., permissions)
      console.error(`Error accessing tokens file at ${TOKENS_FILE_PATH}:`, error.message, error.stack);
      throw new Error(`Server error: Could not access token storage. Details: ${error.message}`);
    }
  }
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end('Method Not Allowed');
  }

  const { code, state, error, error_description } = req.query;

  const cookies = parse(req.headers.cookie || '');
  const expectedState = cookies.linkedin_oauth_state; // Read state from cookie

  // Clear the state cookie immediately after reading it
  res.setHeader('Set-Cookie', 'linkedin_oauth_state=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax');

  if (!state || state !== expectedState) {
    console.error('Invalid OAuth state for LinkedIn', { receivedState: state, expectedStateFromCookie: expectedState });
    return res.redirect(`/social-media?status=linkedin_error&error_description=Invalid%20state`);
  }

  if (error) {
    console.error(`LinkedIn OAuth Error: ${error}`, error_description);
    return res.redirect(`/social-media?status=linkedin_error&error_description=${encodeURIComponent(error_description || 'LinkedIn login failed.')}`);
  }

  if (!code) {
    console.error('LinkedIn OAuth: No authorization code provided.');
    return res.redirect('/social-media?status=linkedin_error&error_description=Authorization%20code%20missing.');
  }

  try {
    // 1. Exchange authorization code for an access token
    const tokenResponse = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: LINKEDIN_REDIRECT_URI,
        client_id: LINKEDIN_CLIENT_ID,
        client_secret: LINKEDIN_CLIENT_SECRET,
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      console.error('LinkedIn Token Exchange Error:', errorData);
      throw new Error(errorData.error_description || 'Failed to exchange token with LinkedIn');
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;
    const refreshToken = tokenData.refresh_token; // May not always be provided
    const expiresIn = tokenData.expires_in;

    // 2. Fetch user profile information from LinkedIn API
    const profileResponse = await fetch('https://api.linkedin.com/v2/userinfo', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!profileResponse.ok) {
      const errorData = await profileResponse.json();
      console.error('LinkedIn Profile Fetch Error:', errorData);
      throw new Error(errorData.message || 'Failed to fetch user profile from LinkedIn');
    }

    const profileData = await profileResponse.json();
    const userId = profileData.sub; // LinkedIn's unique subject identifier
    const userName = profileData.name || `${profileData.given_name} ${profileData.family_name}`;
    const userEmail = profileData.email;
    const userPicture = profileData.picture;

    // 3. Encrypt and store the tokens and profile info
    try {
      await ensureTokensFileExists();
      const existingTokensRaw = await fs.readFile(TOKENS_FILE_PATH, 'utf-8');
      let existingTokens;
      if (existingTokensRaw.trim() === '') {
        existingTokens = []; // Handle empty file case
      } else {
        existingTokens = JSON.parse(existingTokensRaw);
      }

      const encryptedAccessToken = encrypt(accessToken);
      const encryptedRefreshToken = refreshToken ? encrypt(refreshToken) : null;

      const newConnection = {
        id: 'linkedin', // Platform ID
        userId: `mock_user_123`, // Mock user ID for now
        linkedinUserId: userId,
        username: userName,
        email: userEmail,
        profilePicture: userPicture,
        encryptedAccessToken: encryptedAccessToken,
        encryptedRefreshToken: encryptedRefreshToken,
        expiresIn: expiresIn,
        connectedAt: new Date().toISOString(),
      };

      // Remove any existing LinkedIn connection for this mock user before adding new one
      const updatedTokens = existingTokens.filter(t => !(t.id === 'linkedin' && t.userId === newConnection.userId));
      updatedTokens.push(newConnection);

      await fs.writeFile(TOKENS_FILE_PATH, JSON.stringify(updatedTokens, null, 2));
    } catch (fileOpError) {
      console.error('Error during token file operation or encryption/decryption for LinkedIn:', fileOpError.message, fileOpError.stack);
      throw new Error('Failed to process and store social media tokens due to a server-side issue.');
    }

    // 4. Redirect user back to /social-media page with a success message
    res.redirect('/social-media?status=linkedin_success');

  } catch (err) {
    console.error('LinkedIn OAuth Callback Processing Error:', err.message, err.stack);
    res.redirect(`/social-media?status=linkedin_error&error_description=${encodeURIComponent(err.message || 'An unexpected error occurred.')}`);
  }
}
