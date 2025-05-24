/**
 * Facebook API Integration
 *
 * This file handles the integration with Facebook's Graph API for sharing posts.
 * Documentation: https://developers.facebook.com/docs/graph-api/reference/page/feed
 */

/**
 * Share a property post to Facebook
 * @param {Object} accessToken - The user's Facebook access token
 * @param {string} pageId - The ID of the Facebook page to post to
 * @param {Object} property - The property data
 * @param {string} content - The formatted post content
 * @param {Array} images - Array of image URLs to attach to the post
 * @returns {Promise} - Promise object representing the API response
 */
export async function shareToFacebook(accessToken, pageId, property, content, images) {
  try {
    console.log('Sharing to Facebook:', { property, content });

    // Create the Facebook Graph API endpoint for the page's feed
    const endpoint = pageId
      ? `${pageId}/feed` // Post to a specific page
      : 'me/feed';       // Post to user's own feed

    let apiUrl = `https://graph.facebook.com/v17.0/${endpoint}`;
    let postData = {
      message: content,
      access_token: accessToken
    };

    // If we have a listing URL, add it
    const listingUrl = `https://immoask.com/listing/${property.id || Math.floor(10000 + Math.random() * 90000)}`;
    postData.link = listingUrl;

    // Handle different posting scenarios based on available media
    if (images && images.length > 0) {
      if (images.length === 1) {
        // Single image post
        return postSinglePhotoToFacebook(accessToken, endpoint, content, images[0], listingUrl);
      } else {
        // Multiple image post
        return postMultiplePhotosToFacebook(accessToken, endpoint, content, images, listingUrl);
      }
    } else {
      // Text-only post with link
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Facebook API error: ${errorData.error.message || response.statusText}`);
      }

      const result = await response.json();
      console.log('Facebook post created:', result);
      return result;
    }
  } catch (error) {
    console.error('Error sharing to Facebook:', error);
    throw error;
  }
}

/**
 * Post a single photo to Facebook
 * @param {string} accessToken - The Facebook access token
 * @param {string} endpoint - The Graph API endpoint to post to
 * @param {string} message - The post message
 * @param {string} imageUrl - The image URL
 * @param {string} link - Optional URL to attach to the post
 * @returns {Promise} - Promise object representing the API response
 */
async function postSinglePhotoToFacebook(accessToken, endpoint, message, imageUrl, link) {
  try {
    const apiUrl = `https://graph.facebook.com/v17.0/${endpoint}/photos`;

    const postData = {
      url: imageUrl,
      message: message,
      access_token: accessToken
    };

    if (link) {
      postData.link = link;
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Facebook API error: ${errorData.error.message || response.statusText}`);
    }

    const result = await response.json();
    console.log('Facebook photo post created:', result);
    return result;
  } catch (error) {
    console.error('Error posting photo to Facebook:', error);
    throw error;
  }
}

/**
 * Post multiple photos to Facebook as an album
 * @param {string} accessToken - The Facebook access token
 * @param {string} endpoint - The Graph API endpoint to post to
 * @param {string} message - The post message
 * @param {Array} imageUrls - Array of image URLs
 * @param {string} link - Optional URL to attach to the post
 * @returns {Promise} - Promise object representing the API response
 */
async function postMultiplePhotosToFacebook(accessToken, endpoint, message, imageUrls, link) {
  try {
    // Step 1: Create an empty album
    const albumUrl = `https://graph.facebook.com/v17.0/${endpoint}/albums`;
    const albumResponse = await fetch(albumUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Property Listing',
        message: message,
        access_token: accessToken
      })
    });

    if (!albumResponse.ok) {
      const errorData = await albumResponse.json();
      throw new Error(`Facebook API error creating album: ${errorData.error.message || albumResponse.statusText}`);
    }

    const albumData = await albumResponse.json();
    const albumId = albumData.id;

    // Step 2: Upload photos to the album
    const uploadPromises = imageUrls.slice(0, 10).map(async (imageUrl) => { // Facebook allows max 10 images
      const photoUrl = `https://graph.facebook.com/v17.0/${albumId}/photos`;
      const photoResponse = await fetch(photoUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: imageUrl,
          access_token: accessToken
        })
      });

      if (!photoResponse.ok) {
        console.error('Error uploading photo to album:', await photoResponse.json());
        return null;
      }

      return photoResponse.json();
    });

    const photoResults = await Promise.all(uploadPromises);
    console.log('Facebook album created with photos:', photoResults);

    // Step 3: Add the link as a comment on the album
    if (link) {
      const commentUrl = `https://graph.facebook.com/v17.0/${albumId}/comments`;
      await fetch(commentUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `View the property listing: ${link}`,
          access_token: accessToken
        })
      });
    }

    return {
      id: albumId,
      photos: photoResults.filter(result => result !== null).map(result => result.id)
    };
  } catch (error) {
    console.error('Error posting multiple photos to Facebook:', error);
    throw error;
  }
}
