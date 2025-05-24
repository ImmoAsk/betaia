import { encrypt } from '../../../../lib/encryption';
import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { parse } from 'cookie';

const USER_SOCIAL_TOKENS_PATH = path.resolve(process.cwd(), 'data/user_social_tokens.json');
const MOCK_USER_ID = 'mock-user-123'; // Replace with actual user ID in a real app

// Helper function to ensure the JSON file exists
async function ensureTokensFileExists() {
  try {
    await fs.access(USER_SOCIAL_TOKENS_PATH);
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log(`Tokens file not found at ${USER_SOCIAL_TOKENS_PATH}. Creating it.`);
      try {
        await fs.mkdir(path.dirname(USER_SOCIAL_TOKENS_PATH), { recursive: true });
        await fs.writeFile(USER_SOCIAL_TOKENS_PATH, JSON.stringify([], null, 2), 'utf8');
        console.log(`Tokens file created successfully at ${USER_SOCIAL_TOKENS_PATH}.`);
      } catch (writeError) {
        console.error(`Failed to create tokens file at ${USER_SOCIAL_TOKENS_PATH}:`, writeError.message, writeError.stack);
        throw new Error(`Server error: Could not initialize token storage. Details: ${writeError.message}`);
      }
    } else {
      console.error(`Error accessing tokens file at ${USER_SOCIAL_TOKENS_PATH}:`, error.message, error.stack);
      throw new Error(`Server error: Could not access token storage. Details: ${error.message}`);
    }
  }
}

async function readUserSocialTokens() {
  await ensureTokensFileExists();
  try {
    const data = await fs.readFile(USER_SOCIAL_TOKENS_PATH, 'utf8');
    if (data.trim() === '') return [];
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading or parsing user social tokens from ${USER_SOCIAL_TOKENS_PATH}:`, error.message, error.stack);
    throw new Error(`Failed to read or parse user social tokens. File might be corrupted or inaccessible. Details: ${error.message}`);
  }
}

async function writeUserSocialTokens(tokens) {
  try {
    await fs.writeFile(USER_SOCIAL_TOKENS_PATH, JSON.stringify(tokens, null, 2), 'utf8');
  } catch (error) {
    console.error(`Error writing user social tokens to ${USER_SOCIAL_TOKENS_PATH}:`, error.message, error.stack);
    throw new Error(`Failed to write user social tokens. Details: ${error.message}`);
  }
}

// Instagram OAuth callback handler
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { code, state, error, error_description } = req.query;

  const cookies = parse(req.headers.cookie || '');
  const expectedState = cookies.instagram_oauth_state;

  // Clear the state cookie immediately after reading it
  res.setHeader('Set-Cookie', 'instagram_oauth_state=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax');

  // Basic CSRF Protection: Verify the state parameter
  if (state !== expectedState) {
    console.error('Invalid OAuth state for Instagram:', { received: state, expectedFromCookie: expectedState });
    return res.redirect('/social-media?status=instagram_error&error_description=Invalid_state');
  }

  if (error) {
    console.error('Instagram OAuth Error:', error, error_description);
    return res.redirect(`/social-media?status=instagram_error&error_description=${encodeURIComponent(error_description || error)}`);
  }

  if (!code) {
    console.error('Instagram OAuth: No code received.');
    return res.redirect('/social-media?status=instagram_error&error_description=Authorization_code_missing');
  }

  const { INSTAGRAM_CLIENT_ID, INSTAGRAM_CLIENT_SECRET, NEXT_PUBLIC_INSTAGRAM_REDIRECT_URI, TOKEN_ENCRYPTION_KEY } = process.env;

  if (!INSTAGRAM_CLIENT_ID || !INSTAGRAM_CLIENT_SECRET || !NEXT_PUBLIC_INSTAGRAM_REDIRECT_URI) {
    console.error('Instagram environment variables not set.');
    return res.redirect('/social-media?status=instagram_error&error_description=Configuration_error_IG_credentials');
  }
  if (!TOKEN_ENCRYPTION_KEY || TOKEN_ENCRYPTION_KEY.length !== 32) {
    console.error('TOKEN_ENCRYPTION_KEY is missing or not 32 bytes long.');
    return res.redirect('/social-media?status=instagram_error&error_description=Server_encryption_key_error');
  }

  try {
    // 1. Exchange authorization code for access token
    const tokenParams = new URLSearchParams();
    tokenParams.append('client_id', INSTAGRAM_CLIENT_ID);
    tokenParams.append('client_secret', INSTAGRAM_CLIENT_SECRET);
    tokenParams.append('grant_type', 'authorization_code');
    tokenParams.append('redirect_uri', NEXT_PUBLIC_INSTAGRAM_REDIRECT_URI);
    tokenParams.append('code', code);

    const tokenResponse = await fetch('https://api.instagram.com/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: tokenParams.toString(),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok || tokenData.error_message || tokenData.error_type) {
      console.error('Instagram Token Exchange Error:', tokenData);
      const message = tokenData.error_message || tokenData.error_type || 'Token_exchange_failed';
      return res.redirect(`/social-media?status=instagram_error&error_description=${encodeURIComponent(message)}`);
    }

    const { access_token, user_id } = tokenData;

    // 2. Fetch user profile from Instagram
    const profileResponse = await fetch(`https://graph.instagram.com/${user_id}?fields=id,username&access_token=${access_token}`);
    const profileData = await profileResponse.json();

    if (profileData.error) {
      console.error('Instagram Profile Fetch Error:', profileData.error);
      return res.redirect(`/social-media?status=instagram_error&error_description=${encodeURIComponent(profileData.error.message || 'Profile_fetch_failed')}`);
    }

    const platformUserId = profileData.id;
    const userName = profileData.username;

    // 3. Encrypt and store tokens and profile info
    let encryptedAccessToken;
    try {
      encryptedAccessToken = encrypt(access_token);

      let userSocialTokens = await readUserSocialTokens();
      userSocialTokens = userSocialTokens.filter(token => !(token.userId === MOCK_USER_ID && token.platform === 'instagram'));

      const newConnection = {
        id: uuidv4(),
        userId: MOCK_USER_ID,
        platform: 'instagram',
        platformUserId: platformUserId,
        username: userName,
        encryptedAccessToken: encryptedAccessToken,
        connectedAt: new Date().toISOString(),
      };

      userSocialTokens.push(newConnection);
      await writeUserSocialTokens(userSocialTokens);

    } catch (fileOrEncryptError) {
      console.error('Instagram Callback: Error during token file operation or encryption:', fileOrEncryptError.message, fileOrEncryptError.stack);
      throw new Error('Failed to process and store Instagram tokens due to a server-side issue.');
    }

    // 4. Redirect user back to the social media page
    return res.redirect('/social-media?status=instagram_success');

  } catch (err) {
    console.error('Instagram OAuth Callback Handler Error:', err.message, err.stack);
    let errorMessage = 'An_unexpected_error_occurred';
    if (err instanceof Error) {
      errorMessage = err.message;
    }
    return res.redirect(`/social-media?status=instagram_error&error_description=${encodeURIComponent(errorMessage)}`);
  }
}
