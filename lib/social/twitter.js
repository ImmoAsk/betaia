/**
 * Twitter API Integration (X)
 *
 * This file handles the integration with Twitter's API v2 for sharing posts.
 * Documentation: https://developer.twitter.com/en/docs/twitter-api/tweets/manage-tweets/api-reference/post-tweets
 */

/**
 * Share a property post to Twitter
 * @param {Object} accessToken - The user's Twitter access token
 * @param {Object} property - The property data
 * @param {string} content - The formatted post content
 * @param {Array} images - Array of image URLs to attach to the post
 * @returns {Promise} - Promise object representing the API response
 */
export async function shareToTwitter(accessToken, property, content, images) {
  try {
    console.log('Sharing to Twitter:', { property, content });

    // Twitter has a 280 character limit, so we need to truncate the content if necessary
    const twitterContent = truncateForTwitter(content);

    // First, upload media if provided
    const mediaIds = [];
    if (images && images.length > 0) {
      for (const imageUrl of images.slice(0, 4)) { // Twitter supports up to 4 images
        const mediaId = await uploadMediaToTwitter(accessToken, imageUrl);
        if (mediaId) mediaIds.push(mediaId);
      }
    }

    // Prepare post data
    const postData = {
      text: twitterContent
    };

    // Add media if available
    if (mediaIds.length > 0) {
      postData.media = {
        media_ids: mediaIds
      };
    }

    // Make API call to Twitter
    const response = await fetch('https://api.twitter.com/2/tweets', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(postData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Twitter API error: ${errorData.detail || response.statusText}`);
    }

    const result = await response.json();
    console.log('Twitter post created:', result);
    return result;
  } catch (error) {
    console.error('Error sharing to Twitter:', error);
    throw error;
  }
}

/**
 * Upload media to Twitter
 * @param {string} accessToken - The user's Twitter access token
 * @param {string} imageUrl - URL of the image to upload
 * @returns {Promise<string>} - Media ID of the uploaded image
 */
async function uploadMediaToTwitter(accessToken, imageUrl) {
  try {
    // Fetch the image as a blob
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch image from ${imageUrl}`);
    }
    const imageBlob = await imageResponse.blob();

    // Create form data for the image upload
    const formData = new FormData();
    formData.append('media', imageBlob);

    // Initialize the upload
    const initResponse = await fetch('https://upload.twitter.com/1.1/media/upload.json?command=INIT', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        'media_type': imageBlob.type,
        'total_bytes': imageBlob.size
      })
    });

    if (!initResponse.ok) {
      throw new Error(`Failed to initialize media upload: ${initResponse.statusText}`);
    }

    const initData = await initResponse.json();
    const mediaId = initData.media_id_string;

    // Upload the media in chunks
    // For simplicity, we're uploading the whole blob at once
    // In a production environment, you might want to split it into chunks
    const appendResponse = await fetch('https://upload.twitter.com/1.1/media/upload.json?command=APPEND', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
      body: formData
    });

    if (!appendResponse.ok) {
      throw new Error(`Failed to append media data: ${appendResponse.statusText}`);
    }

    // Finalize the upload
    const finalizeResponse = await fetch('https://upload.twitter.com/1.1/media/upload.json?command=FINALIZE', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        'media_id': mediaId
      })
    });

    if (!finalizeResponse.ok) {
      throw new Error(`Failed to finalize media upload: ${finalizeResponse.statusText}`);
    }

    return mediaId;
  } catch (error) {
    console.error('Error uploading media to Twitter:', error);
    return null;
  }
}

/**
 * Truncate content to fit Twitter's 280 character limit
 * @param {string} content - The original content
 * @returns {string} - Truncated content
 */
function truncateForTwitter(content) {
  const MAX_LENGTH = 280;

  if (content.length <= MAX_LENGTH) {
    return content;
  }

  // Find a good place to truncate (preferably at a line break or space)
  let truncateIndex = MAX_LENGTH - 3; // Make room for "..."

  // Look for line breaks or spaces to truncate at
  const lineBreakIndex = content.lastIndexOf('\n', truncateIndex);
  const spaceIndex = content.lastIndexOf(' ', truncateIndex);

  if (lineBreakIndex > 0 && lineBreakIndex > spaceIndex) {
    truncateIndex = lineBreakIndex;
  } else if (spaceIndex > 0) {
    truncateIndex = spaceIndex;
  }

  return content.substring(0, truncateIndex) + '...';
}
