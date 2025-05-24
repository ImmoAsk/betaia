/**
 * Social Media APIs - Export file
 *
 * This file exports all the social media API integration functions
 */

import { shareToLinkedIn } from './linkedin';
import { shareToFacebook } from './facebook';
import { shareToTwitter } from './twitter';
import { shareToInstagram } from './instagram';

/**
 * Share a property to a specific social media platform
 * @param {string} platform - The social media platform ID
 * @param {Object} account - The account information with access token
 * @param {Object} property - The property data
 * @param {string} content - The formatted post content
 * @param {Array} images - Array of image URLs
 * @returns {Promise} - Promise object representing the API response
 */
export async function shareToSocialMedia(platform, account, property, content, images) {
  try {
    // Ensure we have the required data
    if (!account || !account.accessToken) {
      throw new Error(`No access token available for ${platform}`);
    }

    // Call the appropriate API based on the platform
    switch (platform) {
      case 'linkedin':
        return await shareToLinkedIn(account.accessToken, property, content, images);

      case 'facebook':
        // For Facebook, we might have a page ID if posting to a page
        const pageId = account.pageId || null;
        return await shareToFacebook(account.accessToken, pageId, property, content, images);

      case 'twitter':
        return await shareToTwitter(account.accessToken, property, content, images);

      case 'instagram':
        // For Instagram, we need the Instagram business account ID
        const instagramAccountId = account.instagramAccountId;
        if (!instagramAccountId) {
          throw new Error('Instagram account ID is required for posting');
        }
        return await shareToInstagram(account.accessToken, instagramAccountId, property, content, images);

      default:
        throw new Error(`Unsupported platform: ${platform}`);
    }
  } catch (error) {
    console.error(`Error sharing to ${platform}:`, error);
    throw error;
  }
}

// Export individual sharing functions as well
export {
  shareToLinkedIn,
  shareToFacebook,
  shareToTwitter,
  shareToInstagram
};
