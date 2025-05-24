// Twitter OAuth Callback Handler
// This API route will handle the redirect from Twitter after user authorization.

import { encrypt } from '../../../../lib/encryption';
import fs from 'fs/promises';
import path from 'path';
import { parse } from 'cookie'; // To parse cookies from headers

const TOKENS_FILE_PATH = path.join(process.cwd(), 'data', 'user_social_tokens.json');
const TWITTER_CLIENT_ID = process.env.TWITTER_CLIENT_ID;
const TWITTER_CLIENT_SECRET = process.env.TWITTER_CLIENT_SECRET;
const TWITTER_REDIRECT_URI = process.env.NEXT_PUBLIC_TWITTER_REDIRECT_URI;

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
  const expectedState = cookies.twitter_oauth_state;
  const codeVerifier = cookies.twitter_code_verifier;

  // Clear cookies after use
  // Note: Path and domain might need to be specified if they were set with specific values
  res.setHeader('Set-Cookie', [
    'twitter_oauth_state=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax',
    'twitter_code_verifier=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax' // Consider if this needs to be HttpOnly based on your setup
  ]);

  if (!state || state !== expectedState) {
    console.error('Invalid OAuth state for Twitter', { received: state, expected: expectedState });
    return res.redirect(`/social-media?status=twitter_error&error_description=Invalid%20state`);
  }

  if (error) {
    console.error(`Twitter OAuth Error: ${error}`, error_description);
    return res.redirect(`/social-media?status=twitter_error&error_description=${encodeURIComponent(error_description || 'Twitter login failed.')}`);
  }

  if (!code) {
    console.error('Twitter OAuth: No authorization code provided.');
    return res.redirect('/social-media?status=twitter_error&error_description=Authorization%20code%20missing.');
  }

  if (!codeVerifier) {
    console.error('Twitter OAuth: Code verifier missing.');
    return res.redirect('/social-media?status=twitter_error&error_description=Code%20verifier%20missing.');
  }

  try {
    // 1. Exchange authorization code for an access token
    const tokenRequestBody = new URLSearchParams({
      code: code,
      grant_type: 'authorization_code',
      client_id: TWITTER_CLIENT_ID,
      redirect_uri: TWITTER_REDIRECT_URI,
      code_verifier: codeVerifier,
    });

    const basicAuth = Buffer.from(`${TWITTER_CLIENT_ID}:${TWITTER_CLIENT_SECRET}`).toString('base64');

    const tokenResponse = await fetch('https://api.twitter.com/2/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${basicAuth}`,
      },
      body: tokenRequestBody.toString(),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      console.error('Twitter Token Exchange Error:', errorData);
      throw new Error(errorData.error_description || errorData.error || 'Failed to exchange token with Twitter');
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;
    const refreshToken = tokenData.refresh_token;
    const expiresIn = tokenData.expires_in;
    const scope = tokenData.scope; // e.g. "users.read tweet.read tweet.write offline.access"

    // 2. Fetch user profile information from Twitter API
    // Make sure your app has users.read permission
    const profileResponse = await fetch('https://api.twitter.com/2/users/me?user.fields=id,name,username,profile_image_url,created_at', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!profileResponse.ok) {
      const errorData = await profileResponse.json();
      console.error('Twitter Profile Fetch Error:', errorData);
      throw new Error(errorData.detail || 'Failed to fetch user profile from Twitter');
    }

    const profileData = await profileResponse.json();
    const twitterUser = profileData.data;

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

      // No explicit check for !encryptedAccessToken needed as encrypt throws on failure

      const newConnection = {
        id: 'twitter',
        userId: `mock_user_123`,
        twitterUserId: twitterUser.id,
        name: twitterUser.name,
        username: twitterUser.username,
        profilePicture: twitterUser.profile_image_url,
        encryptedAccessToken: encryptedAccessToken,
        encryptedRefreshToken: encryptedRefreshToken,
        expiresIn: expiresIn,
        scope: scope,
        connectedAt: new Date().toISOString(),
        accountCreatedAt: twitterUser.created_at,
      };

      const updatedTokens = existingTokens.filter(t => !(t.id === 'twitter' && t.userId === newConnection.userId));
      updatedTokens.push(newConnection);

      await fs.writeFile(TOKENS_FILE_PATH, JSON.stringify(updatedTokens, null, 2));

    } catch (fileOpError) {
      console.error('Twitter Callback: Error during token file operation or encryption:', fileOpError.message, fileOpError.stack);
      throw new Error('Failed to process and store Twitter tokens due to a server-side issue.');
    }

    // 4. Redirect user back to /social-media page with a success message
    res.redirect('/social-media?status=twitter_success');

  } catch (err) {
    console.error('Twitter OAuth Callback Processing Error:', err.message, err.stack);
    res.redirect(`/social-media?status=twitter_error&error_description=${encodeURIComponent(err.message || 'An unexpected error occurred.')}`);
  }
}
