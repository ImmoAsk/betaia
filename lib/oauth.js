/**
 * OAuth utilities and configuration
 */

/**
 * OAuth configuration for different platforms
 * In a real app, you would store these securely using environment variables
 */
export const OAUTH_CONFIG = {
  linkedin: {
    clientId: process.env.LINKEDIN_CLIENT_ID || 'your-linkedin-client-id',
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET || 'your-linkedin-client-secret',
    tokenUrl: 'https://www.linkedin.com/oauth/v2/accessToken',
    apiBaseUrl: 'https://api.linkedin.com/v2',
    redirectUri: process.env.NEXT_PUBLIC_BASE_URL
      ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/oauth/linkedin/callback`
      : typeof window !== 'undefined'
        ? `${window.location.origin}/api/oauth/linkedin/callback`
        : '',
  },
  facebook: {
    clientId: process.env.FACEBOOK_CLIENT_ID || 'your-facebook-client-id',
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET || 'your-facebook-client-secret',
    tokenUrl: 'https://graph.facebook.com/v17.0/oauth/access_token',
    apiBaseUrl: 'https://graph.facebook.com/v17.0',
    redirectUri: process.env.NEXT_PUBLIC_BASE_URL
      ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/oauth/facebook/callback`
      : typeof window !== 'undefined'
        ? `${window.location.origin}/api/oauth/facebook/callback`
        : '',
  },
  twitter: {
    clientId: process.env.TWITTER_CLIENT_ID || 'your-twitter-client-id',
    clientSecret: process.env.TWITTER_CLIENT_SECRET || 'your-twitter-client-secret',
    tokenUrl: 'https://api.twitter.com/2/oauth2/token',
    apiBaseUrl: 'https://api.twitter.com/2',
    redirectUri: process.env.NEXT_PUBLIC_BASE_URL
      ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/oauth/twitter/callback`
      : typeof window !== 'undefined'
        ? `${window.location.origin}/api/oauth/twitter/callback`
        : '',
  },
  instagram: {
    clientId: process.env.INSTAGRAM_CLIENT_ID || 'your-instagram-client-id',
    clientSecret: process.env.INSTAGRAM_CLIENT_SECRET || 'your-instagram-client-secret',
    tokenUrl: 'https://api.instagram.com/oauth/access_token',
    apiBaseUrl: 'https://graph.instagram.com',
    redirectUri: process.env.NEXT_PUBLIC_BASE_URL
      ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/oauth/instagram/callback`
      : typeof window !== 'undefined'
        ? `${window.location.origin}/api/oauth/instagram/callback`
        : '',
  },
};

/**
 * Exchange an authorization code for an access token
 * @param {string} platform - The platform identifier (linkedin, facebook, etc.)
 * @param {string} code - The authorization code from the OAuth provider
 * @returns {Promise<Object>} - The access token response
 */
export async function exchangeCodeForToken(platform, code) {
  try {
    const config = OAUTH_CONFIG[platform];
    if (!config) {
      throw new Error(`Unsupported platform: ${platform}`);
    }

    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append('redirect_uri', config.redirectUri);
    params.append('client_id', config.clientId);
    params.append('client_secret', config.clientSecret);

    // Special case for Twitter which uses PKCE
    if (platform === 'twitter') {
      params.append('code_verifier', 'challenge'); // In a real app, this should be securely stored
    }

    const response = await fetch(config.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Error exchanging code: ${error.error_description || error.error || response.statusText}`);
    }

    const tokenData = await response.json();
    return tokenData;
  } catch (error) {
    console.error(`Error exchanging code for token for ${platform}:`, error);
    throw error;
  }
}

/**
 * Get user profile information from the OAuth provider
 * @param {string} platform - The platform identifier
 * @param {string} accessToken - The access token
 * @returns {Promise<Object>} - The user profile information
 */
export async function getUserProfile(platform, accessToken) {
  try {
    const config = OAUTH_CONFIG[platform];
    if (!config) {
      throw new Error(`Unsupported platform: ${platform}`);
    }

    let url, headers, responseParser;

    // Platform-specific profile endpoints and parsers
    switch (platform) {
      case 'linkedin':
        url = `${config.apiBaseUrl}/me`;
        headers = { 'Authorization': `Bearer ${accessToken}` };
        responseParser = (data) => ({
          id: data.id,
          username: `${data.localizedFirstName} ${data.localizedLastName}`,
        });
        break;

      case 'facebook':
        url = `${config.apiBaseUrl}/me?fields=id,name,email`;
        headers = { 'Authorization': `Bearer ${accessToken}` };
        responseParser = (data) => ({
          id: data.id,
          username: data.name,
          email: data.email,
        });
        break;

      case 'twitter':
        url = `${config.apiBaseUrl}/users/me`;
        headers = { 'Authorization': `Bearer ${accessToken}` };
        responseParser = (data) => ({
          id: data.data.id,
          username: data.data.username,
        });
        break;

      case 'instagram':
        url = `${config.apiBaseUrl}/me?fields=id,username&access_token=${accessToken}`;
        headers = {};
        responseParser = (data) => ({
          id: data.id,
          username: data.username,
        });
        break;

      default:
        throw new Error(`Unsupported platform: ${platform}`);
    }

    const response = await fetch(url, { headers });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Error fetching user profile: ${error.error?.message || error.message || response.statusText}`);
    }

    const data = await response.json();
    return responseParser(data);
  } catch (error) {
    console.error(`Error fetching user profile for ${platform}:`, error);
    throw error;
  }
}

/**
 * Revoke an access token
 * @param {string} platform - The platform identifier
 * @param {string} accessToken - The access token to revoke
 * @returns {Promise<boolean>} - Success status
 */
export async function revokeAccessToken(platform, accessToken) {
  try {
    const config = OAUTH_CONFIG[platform];
    if (!config) {
      throw new Error(`Unsupported platform: ${platform}`);
    }

    let url, method, body, headers;

    // Platform-specific revocation endpoints and methods
    switch (platform) {
      case 'linkedin':
        // LinkedIn doesn't have a specific revocation endpoint
        // but we can still notify our server to remove the token
        return true;

      case 'facebook':
        url = `${config.apiBaseUrl}/me/permissions`;
        method = 'DELETE';
        headers = { 'Authorization': `Bearer ${accessToken}` };
        break;

      case 'twitter':
        url = 'https://api.twitter.com/oauth2/revoke';
        method = 'POST';
        body = new URLSearchParams({
          token: accessToken,
          client_id: config.clientId,
          token_type_hint: 'access_token',
        });
        headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
        break;

      case 'instagram':
        // Instagram (via Facebook) revocation
        url = `https://graph.facebook.com/v17.0/me/permissions?access_token=${accessToken}`;
        method = 'DELETE';
        headers = {};
        break;

      default:
        throw new Error(`Unsupported platform: ${platform}`);
    }

    const response = await fetch(url, {
      method,
      headers,
      ...(body ? { body: body.toString() } : {})
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Error revoking token: ${error.error?.message || error.message || response.statusText}`);
    }

    return true;
  } catch (error) {
    console.error(`Error revoking token for ${platform}:`, error);
    // Return true even on error to allow the user to disconnect
    // Their session will be invalid locally regardless
    return true;
  }
}
