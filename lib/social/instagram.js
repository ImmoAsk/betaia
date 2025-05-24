/**
 * Instagram API Integration
 *
 * This file handles the integration with Instagram's Graph API for sharing posts.
 * Documentation: https://developers.facebook.com/docs/instagram-api/guides/content-publishing
 */

/**
 * Share a property post to Instagram
 * @param {Object} accessToken - The user's Facebook access token with Instagram permissions
 * @param {string} instagramAccountId - The Instagram account ID to post to
 * @param {Object} property - The property data
 * @param {string} content - The formatted post content
 * @param {Array} images - Array of image URLs to attach to the post
 * @returns {Promise} - Promise object representing the API response
 */
export async function shareToInstagram(accessToken, instagramAccountId, property, content, images) {
  try {
    console.log('Sharing to Instagram:', { property, content });

    if (!images || images.length === 0) {
      throw new Error('Instagram API requires at least one image for posting');
    }

    // Instagram API for content publishing requires at least one image
    // We'll use the first image as the main post and others as a carousel if available
    if (images.length === 1) {
      return postSinglePhotoToInstagram(accessToken, instagramAccountId, content, images[0]);
    } else {
      return postCarouselToInstagram(accessToken, instagramAccountId, content, images);
    }
  } catch (error) {
    console.error('Error sharing to Instagram:', error);
    throw error;
  }
}

/**
 * Post a single photo to Instagram
 * @param {string} accessToken - The Facebook access token with Instagram permissions
 * @param {string} instagramAccountId - The Instagram account ID
 * @param {string} caption - The post caption
 * @param {string} imageUrl - The image URL
 * @returns {Promise} - Promise object representing the API response
 */
async function postSinglePhotoToInstagram(accessToken, instagramAccountId, caption, imageUrl) {
  try {
    // Step 1: Create a container for the photo
    const containerUrl = `https://graph.facebook.com/v17.0/${instagramAccountId}/media`;
    const containerResponse = await fetch(containerUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image_url: imageUrl,
        caption: caption,
        access_token: accessToken
      })
    });

    if (!containerResponse.ok) {
      const errorData = await containerResponse.json();
      throw new Error(`Instagram API error creating container: ${errorData.error.message || containerResponse.statusText}`);
    }

    const containerData = await containerResponse.json();
    const containerId = containerData.id;

    // Step 2: Publish the container
    return publishInstagramContainer(accessToken, instagramAccountId, containerId);
  } catch (error) {
    console.error('Error posting single photo to Instagram:', error);
    throw error;
  }
}

/**
 * Post a carousel of photos to Instagram
 * @param {string} accessToken - The Facebook access token with Instagram permissions
 * @param {string} instagramAccountId - The Instagram account ID
 * @param {string} caption - The post caption
 * @param {Array} imageUrls - Array of image URLs
 * @returns {Promise} - Promise object representing the API response
 */
async function postCarouselToInstagram(accessToken, instagramAccountId, caption, imageUrls) {
  try {
    // Step 1: Create a container for each photo in the carousel
    const childrenContainers = [];
    for (const imageUrl of imageUrls.slice(0, 10)) { // Instagram allows max 10 images in a carousel
      const containerUrl = `https://graph.facebook.com/v17.0/${instagramAccountId}/media`;
      const containerResponse = await fetch(containerUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image_url: imageUrl,
          is_carousel_item: true,
          access_token: accessToken
        })
      });

      if (!containerResponse.ok) {
        const errorData = await containerResponse.json();
        console.error('Error creating carousel item:', errorData);
        continue;
      }

      const containerData = await containerResponse.json();
      childrenContainers.push(containerData.id);
    }

    if (childrenContainers.length === 0) {
      throw new Error('Failed to create any carousel items');
    }

    // Step 2: Create a carousel container with all the children
    const carouselUrl = `https://graph.facebook.com/v17.0/${instagramAccountId}/media`;
    const carouselResponse = await fetch(carouselUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        media_type: 'CAROUSEL',
        children: childrenContainers,
        caption: caption,
        access_token: accessToken
      })
    });

    if (!carouselResponse.ok) {
      const errorData = await carouselResponse.json();
      throw new Error(`Instagram API error creating carousel: ${errorData.error.message || carouselResponse.statusText}`);
    }

    const carouselData = await carouselResponse.json();
    const carouselId = carouselData.id;

    // Step 3: Publish the carousel container
    return publishInstagramContainer(accessToken, instagramAccountId, carouselId);
  } catch (error) {
    console.error('Error posting carousel to Instagram:', error);
    throw error;
  }
}

/**
 * Publish an Instagram container (photo or carousel)
 * @param {string} accessToken - The Facebook access token with Instagram permissions
 * @param {string} instagramAccountId - The Instagram account ID
 * @param {string} containerId - The container ID to publish
 * @returns {Promise} - Promise object representing the API response
 */
async function publishInstagramContainer(accessToken, instagramAccountId, containerId) {
  try {
    const publishUrl = `https://graph.facebook.com/v17.0/${instagramAccountId}/media_publish`;
    const publishResponse = await fetch(publishUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        creation_id: containerId,
        access_token: accessToken
      })
    });

    if (!publishResponse.ok) {
      const errorData = await publishResponse.json();
      throw new Error(`Instagram API error publishing: ${errorData.error.message || publishResponse.statusText}`);
    }

    const result = await publishResponse.json();
    console.log('Instagram post published:', result);
    return result;
  } catch (error) {
    console.error('Error publishing to Instagram:', error);
    throw error;
  }
}
