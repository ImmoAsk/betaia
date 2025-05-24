import fs from "fs/promises";
import path from "path";
import { decrypt } from "../../../lib/encryption";
import FB from "fb";
import axios from "axios";
import { TwitterApi } from "twitter-api-v2";


const TOKENS_FILE_PATH = path.join(
  process.cwd(),
  "data",
  "user_social_tokens.json"
);

// --- Platform-Specific Posting Functions ---

async function postToFacebook(accessToken, contentDetails) {
  FB.setAccessToken(accessToken);

  const { text, link, imageUrls } = contentDetails;
  const uploadedImageIds = [];

  try {
    // 1. Upload Images (if any)
    if (imageUrls && imageUrls.length > 0) {
      for (const imageUrl of imageUrls.slice(0, 4)) {
        // Max 4 images
        try {
          // Fetch the image data
          const imageResponse = await axios.get(imageUrl, {
            responseType: "arraybuffer",
          });
          const imageBuffer = Buffer.from(imageResponse.data, "binary");

          // Upload photo to Facebook without publishing it immediately
          const photoUploadResponse = await new Promise((resolve, reject) => {
            FB.api(
              "me/photos",
              "post",
              {
                source: imageBuffer,
                published: false, // Upload photo without creating a feed story for each photo
              },
              (res) => {
                if (!res || res.error) {
                  console.error(
                    "Facebook photo upload error:",
                    res ? res.error : "No response"
                  );
                  return reject(
                    res && res.error
                      ? res.error
                      : new Error("Photo upload failed")
                  );
                }
                resolve(res);
              }
            );
          });

          if (photoUploadResponse && photoUploadResponse.id) {
            uploadedImageIds.push(photoUploadResponse.id);
          }
        } catch (imgError) {
          console.error(
            `Error uploading image ${imageUrl} to Facebook:`,
            imgError
          );
          // Continue without this image
        }
      }
    }

    // 2. Create the Feed Post
    const postPayload = {
      message: text,
      link: link,
    };

    if (uploadedImageIds.length > 0) {
      postPayload.attached_media = uploadedImageIds.map((id) => ({
        media_fbid: id,
      }));
    }

    const feedPostResponse = await new Promise((resolve, reject) => {
      FB.api("me/feed", "post", postPayload, (res) => {
        if (!res || res.error) {
          console.error(
            "Facebook feed post error:",
            res ? res.error : "No response"
          );
          return reject(
            res && res.error ? res.error : new Error("Feed post failed")
          );
        }
        resolve(res);
      });
    });

    if (feedPostResponse && feedPostResponse.id) {
      return {
        success: true,
        postId: feedPostResponse.id,
        message: "Successfully posted to Facebook.",
      };
    } else {
      console.error(
        "Facebook feed post failed, no ID returned:",
        feedPostResponse
      );
      return {
        success: false,
        error: "Feed post submission did not return an ID.",
        message: "Failed to post to Facebook.",
      };
    }
  } catch (error) {
    console.error("Error in postToFacebook:", error);
    return {
      success: false,
      error:
        error.message || "An unknown error occurred during Facebook posting.",
      message: "Failed to post to Facebook.",
    };
  }
}

async function postToTwitter(accessToken, contentDetails) {
  const { text, link, imageUrls } = contentDetails;

  try {
    // Initialize Twitter client. Assuming accessToken is a user context bearer token for v2 API,
    // or part of an OAuth 1.0a set if v1 endpoints are used for media upload.
    // For simplicity with a single token, we'll try v2 bearer token. If it's an OAuth1 token, adjustments are needed.
    const client = new TwitterApi(accessToken); // This assumes the accessToken is a Bearer Token for v2 User Context
    // If it's an OAuth 1.0a access token, it would be: new TwitterApi({ appKey, appSecret, accessToken, accessSecret });
    // The current structure of user_social_tokens.json needs to be aligned with what twitter-api-v2 expects.
    // For now, proceeding with the assumption that `accessToken` is directly usable as a Bearer Token for v2 posting context.

    const uploadedMediaIds = [];

    // 1. Upload Images (if any) - using v1.1 API for media upload as it's more straightforward with twitter-api-v2
    if (imageUrls && imageUrls.length > 0) {
      const twitterV1Client = client.v1; // Access v1 methods for media upload
      for (const imageUrl of imageUrls.slice(0, 4)) {
        // Twitter allows up to 4 images
        try {
          const imageFetchResponse = await axios.get(imageUrl, {
            responseType: "arraybuffer",
          });
          const imageBuffer = Buffer.from(imageFetchResponse.data, "binary");
          const imageMimeType =
            imageFetchResponse.headers["content-type"] || "image/jpeg";

          // Upload media and get media_id_string
          const mediaId = await twitterV1Client.uploadMedia(imageBuffer, {
            mimeType: imageMimeType,
          });
          if (mediaId) {
            uploadedMediaIds.push(mediaId);
          }
        } catch (imgError) {
          console.error(
            `Error uploading image ${imageUrl} to Twitter:`,
            imgError.data || imgError.message || imgError
          );
          // Continue without this image
        }
      }
    }

    // 2. Create Tweet (using v2 API)
    // Ensure the text includes the link. Twitter automatically shortens and handles links.
    const tweetText = `${text}`; // The link is already part of the text from MultiStepPropertyForm

    const tweetPayload = { text: tweetText };
    if (uploadedMediaIds.length > 0) {
      tweetPayload.media = { media_ids: uploadedMediaIds };
    }

    // Post tweet using v2 client
    // Ensure the client is properly authenticated for user context for v2.tweet()
    // If `client` was initialized with a Bearer token for a User, this should work.
    const { data: createdTweet } = await client.v2.tweet(tweetPayload);

    if (createdTweet && createdTweet.id) {
      return {
        success: true,
        postId: createdTweet.id,
        message: "Successfully posted to Twitter.",
      };
    } else {
      console.error(
        "Twitter post creation failed or did not return an ID:",
        createdTweet
      );
      return {
        success: false,
        error: "Tweet creation did not return an ID.",
        message: "Failed to post to Twitter.",
      };
    }
  } catch (error) {
    console.error(
      "Error in postToTwitter:",
      error.data || error.message || error
    );
    const errorMessage =
      error.data && error.data.detail
        ? error.data.detail
        : error.message || "An unknown error occurred during Twitter posting.";
    return {
      success: false,
      error: errorMessage,
      message: "Failed to post to Twitter.",
    };
  }
}

async function postToLinkedIn(accessToken, contentDetails) {
  const { text, link, imageUrls } = contentDetails;
  const linkedInApiBase = "https://api.linkedin.com/v2";

  try {
    // 1. Get LinkedIn User ID (Person URN)
    const meResponse = await axios.get(`${linkedInApiBase}/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "cache-control": "no-cache",
        "X-Restli-Protocol-Version": "2.0.0",
      },
    });
    const personUrn = meResponse.data.id;
    if (!personUrn) {
      return {
        success: false,
        error: "Could not retrieve LinkedIn user URN.",
        message: "Failed to post to LinkedIn.",
      };
    }

    const uploadedImageUrns = [];

    // 2. Upload Images (if any)
    if (imageUrls && imageUrls.length > 0) {
      for (const imageUrl of imageUrls.slice(0, 4)) {
        // LinkedIn might have limits, let's stick to 4 for now
        try {
          // 2a. Fetch image data
          const imageFetchResponse = await axios.get(imageUrl, {
            responseType: "arraybuffer",
          });
          const imageBuffer = Buffer.from(imageFetchResponse.data, "binary");
          const imageContentType =
            imageFetchResponse.headers["content-type"] || "image/jpeg"; // Default or get from response

          // 2b. Register image upload
          const registerUploadResponse = await axios.post(
            `${linkedInApiBase}/assets?action=registerUpload`,
            {
              registerUploadRequest: {
                recipes: ["urn:li:digitalmediaRecipe:feedshare-image"],
                owner: `urn:li:person:${personUrn}`,
                serviceRelationships: [
                  {
                    relationshipType: "OWNER",
                    identifier: "urn:li:userGeneratedContent",
                  },
                ],
              },
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "X-Restli-Protocol-Version": "2.0.0",
              },
            }
          );

          const uploadUrl =
            registerUploadResponse.data.value.uploadMechanism[
              "com.linkedin.digitalmedia.uploadMechanism.TransferEncoding"
            ].uploadUrl;
          const assetUrn = registerUploadResponse.data.value.asset;

          if (!uploadUrl || !assetUrn) {
            console.error(
              "LinkedIn register upload failed to return URL or URN."
            );
            continue; // Skip this image
          }

          // 2c. Upload image binary
          await axios.put(uploadUrl, imageBuffer, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": imageContentType,
            },
          });

          uploadedImageUrns.push(assetUrn);
        } catch (imgError) {
          console.error(
            `Error processing image ${imageUrl} for LinkedIn:`,
            imgError.response ? imgError.response.data : imgError.message
          );
          // Continue without this image
        }
      }
    }

    // 3. Construct and Send the Share Post
    const postText = `${text}\n\nCheck out more details here: ${link}`;
    const shareContent = {
      shareCommentary: { text: postText },
      shareMediaCategory: uploadedImageUrns.length > 0 ? "IMAGE" : "ARTICLE", // ARTICLE if no images, IMAGE otherwise
    };

    if (uploadedImageUrns.length > 0) {
      shareContent.media = uploadedImageUrns.map((urn) => ({
        status: "READY",
        media: urn,
        // Optional: title and description for each image
        // title: { text: 'Property Image' },
        // description: { text: 'A beautiful property view' }
      }));
    } else {
      // For ARTICLE share, the link is typically provided in the media array
      shareContent.media = [
        {
          status: "READY",
          originalUrl: link, // The link itself is the media for an ARTICLE share
        },
      ];
    }

    const sharePayload = {
      author: `urn:li:person:${personUrn}`,
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": shareContent,
      },
      visibility: {
        "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
      },
    };

    const postResponse = await axios.post(
      `${linkedInApiBase}/ugcPosts`,
      sharePayload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "X-Restli-Protocol-Version": "2.0.0",
          "Content-Type": "application/json",
        },
      }
    );

    if (postResponse.status === 201 && postResponse.data.id) {
      return {
        success: true,
        postId: postResponse.data.id,
        message: "Successfully posted to LinkedIn.",
      };
    } else {
      console.error(
        "LinkedIn post creation failed or did not return an ID:",
        postResponse.data
      );
      return {
        success: false,
        error: postResponse.data.message || "Post creation failed on LinkedIn.",
        message: "Failed to post to LinkedIn.",
      };
    }
  } catch (error) {
    console.error(
      "Error in postToLinkedIn:",
      error.response ? error.response.data : error.message
    );
    const errorMessage =
      error.response && error.response.data && error.response.data.message
        ? error.response.data.message
        : error.message;
    return {
      success: false,
      error:
        errorMessage || "An unknown error occurred during LinkedIn posting.",
      message: "Failed to post to LinkedIn.",
    };
  }
}

// --- Main Handler ---
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { platform, userId, contentDetails, propertyId } = req.body;

  if (!platform || !contentDetails || !userId) {
    return res
      .status(400)
      .json({ error: "Platform, userId, and contentDetails are required." });
  }
  if (!contentDetails.text || !contentDetails.link) {
    return res
      .status(400)
      .json({ error: "contentDetails must include text and link." });
  }

  try {
    let allTokens = [];
    try {
      const tokensFileContent = await fs.readFile(TOKENS_FILE_PATH, "utf-8");
      allTokens = JSON.parse(tokensFileContent);
    } catch (error) {
      if (error.code === "ENOENT") {
        console.error("Tokens file not found:", TOKENS_FILE_PATH);
        return res
          .status(500)
          .json({ error: "Social tokens configuration error." });
      }
      throw error; // Re-throw other read errors
    }

    const userPlatformTokenInfo = allTokens.find(
      (token) => token.userId === userId && token.platform === platform
    );

    if (!userPlatformTokenInfo || !userPlatformTokenInfo.encryptedAccessToken) {
      return res
        .status(404)
        .json({
          error: `No valid token found for ${platform} for user ${userId}. Please connect the account.`,
        });
    }

    let accessToken;
    try {
      accessToken = decrypt(userPlatformTokenInfo.encryptedAccessToken);
    } catch (decryptionError) {
      console.error("Token decryption failed:", decryptionError);
      return res
        .status(500)
        .json({
          error:
            "Token decryption failed. Please re-connect the social account.",
        });
    }

    if (!accessToken) {
      return res
        .status(500)
        .json({
          error:
            "Decrypted token is invalid. Please re-connect the social account.",
        });
    }

    let postResult;
    console.log(
      `Attempting to post to ${platform} for user ${userId}. Content:`,
      contentDetails
    );

    switch (platform.toLowerCase()) {
      case "facebook":
        postResult = await postToFacebook(accessToken, contentDetails);
        break;
      case "twitter":
        postResult = await postToTwitter(accessToken, contentDetails);
        break;
      case "linkedin":
        postResult = await postToLinkedIn(accessToken, contentDetails);
        break;
      // Add other platforms like 'instagram' here if supported
      default:
        console.warn(`Platform ${platform} not supported for posting.`);
        return res
          .status(400)
          .json({
            error: `Platform ${platform} not currently supported for posting.`,
          });
    }

    if (postResult.success) {
      console.log(
        `Successfully posted to ${platform} for user ${userId}:`,
        postResult.postId
      );
      return res.status(200).json({
        message: `Successfully posted to ${platform}`,
        platform: platform,
        postId: postResult.postId,
        details: postResult,
      });
    } else {
      console.error(
        `Failed to post to ${platform} for user ${userId}:`,
        postResult.message || postResult.error
      );
      return res.status(500).json({
        error: `Failed to post to ${platform}`,
        platform: platform,
        details: postResult.message || postResult.error,
      });
    }
  } catch (error) {
    console.error(
      `General error in /api/social/post for platform ${platform}, user ${userId}:`,
      error
    );
    return res
      .status(500)
      .json({
        error: "Internal server error during social media posting.",
        details: error.message,
      });
  }
}
