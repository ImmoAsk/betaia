/**
 * LinkedIn API Integration
 *
 * This file handles the integration with LinkedIn's APIs for sharing posts.
 * Documentation: https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/share-api
 */

/**
 * Share a property post to LinkedIn
 * @param {Object} accessToken - The user's LinkedIn access token
 * @param {Object} property - The property data
 * @param {string} content - The formatted post content
 * @param {Array} images - Array of image URLs to attach to the post
 * @returns {Promise} - Promise object representing the API response
 */
export async function shareToLinkedIn(accessToken, property, content, images) {
  try {
    console.log('Sharing to LinkedIn:', { property, content });

    // First, upload images if provided
    const imageUrns = [];
    if (images && images.length > 0) {
      for (const imageUrl of images.slice(0, 4)) { // LinkedIn supports up to 4 images
        const imageUrn = await uploadImageToLinkedIn(accessToken, imageUrl);
        if (imageUrn) imageUrns.push(imageUrn);
      }
    }

    // Prepare post data
    const postData = {
      owner: "urn:li:person:me", // Use authenticated user
      text: {
        text: content
      },
      distribution: {
        linkedInDistributionTarget: {
          visibleToGuest: true
        }
      },
      lifecycleState: "PUBLISHED"
    };

    // Add media content if we have uploaded images
    if (imageUrns.length > 0) {
      postData.content = {
        contentEntities: imageUrns.map(urn => ({
          entity: urn
        }))
      };

      // Add URL if we have one
      const listingUrl = `https://immoask.com/listing/${property.id || Math.floor(10000 + Math.random() * 90000)}`;
      postData.content.contentEntities.push({
        entityLocation: listingUrl,
        thumbnails: [{
          resolvedUrl: images[0] // Use first image as thumbnail
        }]
      });
    }

    // Make API call to LinkedIn
    const response = await fetch('https://api.linkedin.com/v2/posts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0'
      },
      body: JSON.stringify(postData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`LinkedIn API error: ${errorData.message || response.statusText}`);
    }

    const result = await response.json();
    console.log('LinkedIn post created:', result);
    return result;
  } catch (error) {
    console.error('Error sharing to LinkedIn:', error);
    throw error;
  }
}

/**
 * Upload an image to LinkedIn
 * @param {string} accessToken - The user's LinkedIn access token
 * @param {string} imageUrl - URL of the image to upload
 * @returns {Promise<string>} - URN of the uploaded image
 */
async function uploadImageToLinkedIn(accessToken, imageUrl) {
  try {
    // Step 1: Register the image upload
    const registerResponse = await fetch('https://api.linkedin.com/v2/assets?action=registerUpload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        registerUploadRequest: {
          recipes: ["urn:li:digitalmediaRecipe:feedshare-image"],
          owner: "urn:li:person:me",
          serviceRelationships: [{
            relationshipType: "OWNER",
            identifier: "urn:li:userGeneratedContent"
          }]
        }
      })
    });

    if (!registerResponse.ok) {
      throw new Error(`Failed to register image upload: ${registerResponse.statusText}`);
    }

    const registerData = await registerResponse.json();
    const uploadUrl = registerData.value.uploadMechanism["com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest"].uploadUrl;
    const assetId = registerData.value.asset;

    // Step 2: Fetch the image data
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch image from ${imageUrl}`);
    }
    const imageBlob = await imageResponse.blob();

    // Step 3: Upload the image to LinkedIn
    const uploadResponse = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      body: imageBlob
    });

    if (!uploadResponse.ok) {
      throw new Error(`Failed to upload image: ${uploadResponse.statusText}`);
    }

    return assetId;
  } catch (error) {
    console.error('Error uploading image to LinkedIn:', error);
    return null;
  }
}
