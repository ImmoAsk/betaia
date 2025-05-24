import fs from 'fs/promises';
import path from 'path';

const TOKENS_FILE_PATH = path.join(process.cwd(), 'data', 'user_social_tokens.json');

export default async function handler(req, res) {
  if (req.method !== 'POST') { // Changed to POST for a state-changing operation
    res.setHeader('Allow', ['POST']);
    return res.status(405).end('Method Not Allowed');
  }

  const { platform } = req.query; // Get platform from dynamic route parameter
  // In a real app, you would also get the authenticated user ID
  const mockUserId = 'mock-user-123';

  if (!platform) {
    return res.status(400).json({ message: 'Platform ID is required.' });
  }

  try {
    let allConnections = [];
    try {
      const tokensFileContent = await fs.readFile(TOKENS_FILE_PATH, 'utf-8');
      allConnections = JSON.parse(tokensFileContent);
    } catch (error) {
      if (error.code === 'ENOENT') {
        // File doesn't exist, so nothing to disconnect
        return res.status(200).json({ message: `No connections file found. ${platform} considered disconnected.` });
      }
      throw error;
    }

    const initialCount = allConnections.length;
    const updatedConnections = allConnections.filter(
      conn => !(conn.platform === platform && conn.userId === mockUserId)
    );

    if (updatedConnections.length === initialCount) {
      // No account found for this platform and user to disconnect
      return res.status(404).json({ message: `No ${platform} account found for this user to disconnect.` });
    }

    await fs.writeFile(TOKENS_FILE_PATH, JSON.stringify(updatedConnections, null, 2));

    // TODO: Implement token revocation with the actual social media platform if required.
    // This would involve using the stored (and decrypted) access token to make an API call
    // to the platform's token revocation endpoint.

    return res.status(200).json({ message: `Successfully disconnected from ${platform}.` });

  } catch (error) {
    console.error(`Error disconnecting from ${platform}:`, error);
    return res.status(500).json({ message: `Failed to disconnect from ${platform}.`, error: error.message });
  }
}
