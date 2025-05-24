import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import RealEstatePageLayout from "../../components/partials/RealEstatePageLayout";
import RealEstateAccountLayout from "../../components/partials/RealEstateAccountLayout"
import {
  Container,
  Row,
  Col,
  Button,
  Alert,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import SocialMediaLinkCard from "../../components/SocialMediaLinkCard";
import Cookies from "js-cookie"; // For setting cookies
import crypto from "crypto-js"; // For SHA256 and Base64 for PKCE

// List of available social media platforms with actual OAuth endpoints
const AVAILABLE_PLATFORMS = [
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: "bi-linkedin",
    authUrl: "https://www.linkedin.com/oauth/v2/authorization",
    clientId: process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID, // Using env variable
    redirectUri: process.env.NEXT_PUBLIC_LINKEDIN_REDIRECT_URI, // Using env variable
    scope: "r_liteprofile w_member_social",
    state: "linkedin_state",
    responseType: "code",
  },
  {
    id: "facebook",
    name: "Facebook Page",
    icon: "bi-facebook",
    authUrl: "https://www.facebook.com/v17.0/dialog/oauth",
    clientId: process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID, // Using env variable
    redirectUri: process.env.NEXT_PUBLIC_FACEBOOK_REDIRECT_URI, // Using env variable
    scope:
      "pages_manage_posts,pages_read_engagement,pages_show_list,email,public_profile", // Added email and public_profile
    state: "facebook_state",
    responseType: "code",
  },
  {
    id: "twitter",
    name: "Twitter",
    icon: "bi-twitter-x",
    authUrl: "https://twitter.com/i/oauth2/authorize",
    clientId: process.env.NEXT_PUBLIC_TWITTER_CLIENT_ID,
    redirectUri: process.env.NEXT_PUBLIC_TWITTER_REDIRECT_URI,
    scope: "tweet.read tweet.write users.read offline.access", // Added offline.access for refresh tokens
    state: "twitter_state", // This will be overridden by a randomly generated one
    responseType: "code",
    // PKCE parameters will be generated dynamically
    codeChallengeMethod: "S256",
  },
  {
    id: "instagram",
    name: "Instagram",
    icon: "bi-instagram",
    authUrl: "https://api.instagram.com/oauth/authorize",
    clientId: process.env.NEXT_PUBLIC_INSTAGRAM_CLIENT_ID, // Using env variable
    redirectUri: process.env.NEXT_PUBLIC_INSTAGRAM_REDIRECT_URI, // Using env variable
    scope: "user_profile,user_media", // Standard scopes for Instagram Basic Display API
    state: "instagram_state", // Added state for CSRF protection
    responseType: "code",
  },
];

export default function SocialMedia() {
  const router = useRouter();
  const [connectedAccounts, setConnectedAccounts] = useState([]);
  const [availablePlatforms, setAvailablePlatforms] = useState([]);
  const [isMockMode, setIsMockMode] = useState(true);
  const [showMockWarning, setShowMockWarning] = useState(true);
  const [showConnectToast, setShowConnectToast] = useState(false);
  const [showDisconnectToast, setShowDisconnectToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const fetchRealConnections = async () => {
    try {
      const response = await fetch("/api/social/get-connections");
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch connections");
      }
      const realConnections = await response.json();
      setConnectedAccounts(realConnections);
      updateAvailablePlatforms(realConnections); // Update available platforms based on real connections
    } catch (error) {
      console.error("Error fetching real connections:", error);
      setToastMessage(
        error.message || "Could not load your connected accounts."
      );
      setShowErrorToast(true);
    }
  };

  useEffect(() => {
    if (isMockMode) {
      const storedAccounts = localStorage.getItem("connectedAccounts");
      const initialAccounts = storedAccounts ? JSON.parse(storedAccounts) : [];
      setConnectedAccounts(initialAccounts);
      updateAvailablePlatforms(initialAccounts);
    } else {
      fetchRealConnections();
    }

    const { status, error_description, message } = router.query;
    if (status) {
      if (status.endsWith("_success")) {
        const platformName = status.split("_")[0];
        setToastMessage(
          `Successfully connected to ${
            platformName.charAt(0).toUpperCase() + platformName.slice(1)
          }!`
        );
        setShowConnectToast(true);
        if (!isMockMode) {
          // If a real connection was made, refresh the list
          fetchRealConnections();
        }
      } else if (status.endsWith("_error")) {
        const platformName = status.split("_")[0];
        setToastMessage(
          decodeURIComponent(
            error_description || message || `Failed to connect ${platformName}.`
          )
        );
        setShowErrorToast(true);
      }
      router.replace("/tg/account-socialmedia", undefined, { shallow: true });
    }
  }, [router.query, isMockMode]); // Add isMockMode to dependency array

  const updateAvailablePlatforms = (currentConnectedAccounts) => {
    const connectedIds = currentConnectedAccounts.map((account) => account.id);
    const available = AVAILABLE_PLATFORMS.filter(
      (platform) => !connectedIds.includes(platform.id)
    );
    setAvailablePlatforms(available);
  };

  const handleToggleMockMode = () => {
    const newMockMode = !isMockMode;
    setIsMockMode(newMockMode);
    // When switching modes, we need to refresh the accounts
    if (newMockMode) {
      // Switching to Mock: Load from localStorage
      const storedAccounts = localStorage.getItem("connectedAccounts");
      const mockAccounts = storedAccounts ? JSON.parse(storedAccounts) : [];
      setConnectedAccounts(mockAccounts);
      updateAvailablePlatforms(mockAccounts);
    } else {
      // Switching to Real: Fetch from API
      fetchRealConnections();
    }
  };

  const handleConnect = (platform) => {
    if (isMockMode) {
      // Simulate OAuth authentication process in mock mode
      setTimeout(() => {
        try {
          const newConnectedAccount = {
            ...platform,
            connectedAt: new Date().toISOString(),
            username: `user_${platform.id}`, // mock username
            accessToken: `mock_token_${Date.now()}`, // mock token
          };

          const updatedConnectedAccounts = [
            ...connectedAccounts,
            newConnectedAccount,
          ];
          setConnectedAccounts(updatedConnectedAccounts);

          // Update localStorage
          localStorage.setItem(
            "connectedAccounts",
            JSON.stringify(updatedConnectedAccounts)
          );

          // Update available platforms
          updateAvailablePlatforms(updatedConnectedAccounts);

          // Show success toast
          setToastMessage(`Successfully connected to ${platform.name}!`);
          setShowConnectToast(true);
        } catch (error) {
          console.error("Error connecting account:", error);
          setToastMessage(
            `Error connecting to ${platform.name}. Please try again.`
          );
          setShowErrorToast(true);
        }
      }, 1500); // 1.5s delay to simulate authentication
    } else {
      // Real OAuth flow
      try {
        // Before initiating OAuth, ensure platform details are up-to-date if they can change
        const currentPlatformDetails = AVAILABLE_PLATFORMS.find(
          (p) => p.id === platform.id
        );
        if (
          !currentPlatformDetails ||
          !currentPlatformDetails.clientId ||
          !currentPlatformDetails.redirectUri
        ) {
          setToastMessage(
            `Configuration error for ${platform.name}. Please contact support.`
          );
          setShowErrorToast(true);
          return;
        }
        initiateOAuth(currentPlatformDetails);
      } catch (error) {
        console.error("Error initiating OAuth:", error);
        setToastMessage(
          `Error connecting to ${platform.name}. Please try again.`
        );
        setShowErrorToast(true);
      }
    }
  };

  const initiateOAuth = (platform) => {
    const generatedState = crypto.lib.WordArray.random(16).toString(); // Generate a random state

    // Store state in a cookie for CSRF protection
    Cookies.set(`${platform.id}_oauth_state`, generatedState, {
      path: "/",
      sameSite: "lax",
    });

    const params = new URLSearchParams({
      client_id: platform.clientId,
      redirect_uri: platform.redirectUri,
      scope: platform.scope,
      response_type: platform.responseType,
      state: generatedState,
    });

    if (platform.id === "twitter") {
      // PKCE Flow for Twitter
      const verifier = crypto.lib.WordArray.random(32)
        .toString(crypto.enc.Base64url)
        .replace(/=/g, "");
      const challenge = crypto
        .SHA256(verifier)
        .toString(crypto.enc.Base64url)
        .replace(/=/g, "");

      Cookies.set("twitter_code_verifier", verifier, {
        path: "/",
        httpOnly: false,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      }); // Storing verifier

      params.append("code_challenge", challenge);
      params.append(
        "code_challenge_method",
        platform.codeChallengeMethod || "S256"
      );
    } else if (platform.codeChallenge) {
      // For other platforms if they use PKCE and it's pre-defined (example)
      params.append("code_challenge", platform.codeChallenge);
      params.append("code_challenge_method", platform.codeChallengeMethod);
    }

    window.location.href = `${platform.authUrl}?${params.toString()}`;
  };

  // In a real app, this would be handled by your API route
  const handleOAuthCallback = (code, state, platform) => {
    // In a real implementation, your server would exchange this code for an access token
    console.log(`Received auth code for ${platform}: ${code}`);

    // Mock successful authentication
    const newConnectedAccount = {
      ...AVAILABLE_PLATFORMS.find((p) => p.id === platform),
      connectedAt: new Date().toISOString(),
      username: `real_user_${platform}`,
      accessToken: `real_token_${Date.now()}`,
    };

    const updatedConnectedAccounts = [
      ...connectedAccounts,
      newConnectedAccount,
    ];
    setConnectedAccounts(updatedConnectedAccounts);
    localStorage.setItem(
      "connectedAccounts",
      JSON.stringify(updatedConnectedAccounts)
    );
    updateAvailablePlatforms(updatedConnectedAccounts);
  };

  const handleDisconnect = async (platformId) => {
    const platformName =
      connectedAccounts.find((account) => account.id === platformId)?.name ||
      platformId;
    if (isMockMode) {
      try {
        const updatedConnectedAccounts = connectedAccounts.filter(
          (account) => account.id !== platformId
        );
        setConnectedAccounts(updatedConnectedAccounts);
        localStorage.setItem(
          "connectedAccounts",
          JSON.stringify(updatedConnectedAccounts)
        );
        updateAvailablePlatforms(updatedConnectedAccounts);
        setToastMessage(
          `Successfully disconnected from ${platformName} (mock)!`
        );
        setShowDisconnectToast(true);
      } catch (error) {
        console.error("Error disconnecting mock account:", error);
        setToastMessage("Error disconnecting mock account. Please try again.");
        setShowErrorToast(true);
      }
    } else {
      // Real disconnect logic
      try {
        const response = await fetch(`/api/social/disconnect/${platformId}`, {
          method: "POST",
        });
        const result = await response.json();
        if (!response.ok) {
          throw new Error(
            result.message || `Failed to disconnect from ${platformName}`
          );
        }
        setToastMessage(
          result.message || `Successfully disconnected from ${platformName}!`
        );
        setShowDisconnectToast(true);
        fetchRealConnections(); // Refresh the list of connected accounts
      } catch (error) {
        console.error(`Error disconnecting ${platformName}:`, error);
        setToastMessage(
          error.message ||
            `Could not disconnect from ${platformName}. Please try again.`
        );
        setShowErrorToast(true);
      }
    }
  };

  const shareToSocialMedia = (account, property) => {
    if (isMockMode) {
      // Mock posting to social media
      alert(`Post successfully shared to ${account.name}!`);
      return;
    }

    // In a real implementation, this would make API calls to the respective platforms
    switch (account.id) {
      case "linkedin":
        // LinkedIn sharing API call
        fetch("/api/share/linkedin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            accessToken: account.accessToken,
            content: `Check out this property: ${property.title} in ${property.district}, ${property.town} for €${property.price}/month!`,
            images: property.images.slice(0, 4),
          }),
        });
        break;
      case "facebook":
        // Facebook sharing API call
        fetch("/api/share/facebook", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            accessToken: account.accessToken,
            content: `Check out this property: ${property.title} in ${property.district}, ${property.town} for €${property.price}/month!`,
            images: property.images.slice(0, 4),
          }),
        });
        break;
      // Similar implementations for other platforms
      default:
        console.log(`Sharing to ${account.id} not implemented yet`);
    }
  };

  return (
    <RealEstatePageLayout
      pageTitle="manage social media"
      activeNav="Account"
      userLoggedIn
    >
      <RealEstateAccountLayout accountPageTitle="manage social media">
        <Container fluid className="py-4">
          <Row className="mb-4">
            <Col>
              <h3 className="mb-3">Social Media Accounts</h3>
              <p className="text-muted">
                Connect your social media accounts to automatically post your
                property listings.
              </p>

              {showMockWarning && (
                <Alert
                  variant="info"
                  dismissible
                  onClose={() => setShowMockWarning(false)}
                  className="mb-3"
                >
                  <Alert.Heading>Demo Mode</Alert.Heading>
                  <p>
                    Currently running in demo mode with simulated OAuth. In a
                    production environment, real OAuth would be implemented with
                    proper API keys.
                  </p>
                  <div className="d-flex justify-content-end">
                    <Button
                      variant={isMockMode ? "outline-info" : "info"}
                      size="sm"
                      onClick={handleToggleMockMode}
                    >
                      {isMockMode
                        ? "Switch to Real Mode"
                        : "Switch to Mock Mode"}
                    </Button>
                  </div>
                </Alert>
              )}
            </Col>
          </Row>

          <Row>
            <Col md={6} className="mb-4">
              <h2 className="h4 mb-3">Available Platforms</h2>
              {availablePlatforms.length > 0 ? (
                availablePlatforms.map((platform) => (
                  <SocialMediaLinkCard
                    key={platform.id}
                    platform={platform}
                    isConnected={false}
                    onConnect={() => handleConnect(platform)}
                  />
                ))
              ) : (
                <div className="alert alert-info">
                  All available platforms have been connected.
                </div>
              )}
            </Col>

            <Col md={6} className="mb-4">
              <h2 className="h4 mb-3">Connected Accounts</h2>
              {connectedAccounts.length > 0 ? (
                connectedAccounts.map((account) => (
                  <SocialMediaLinkCard
                    key={account.connectionId} // Use connectionId for unique key
                    platform={account}
                    isConnected={true}
                    username={account.username}
                    onDisconnect={() => handleDisconnect(account.id)}
                    showShareButton={true}
                    onShare={() => {
                      // Simulate sharing to the platform
                      alert(`Post would be shared to ${account.name}!`);

                      // In a real app, this would use the shareToSocialMedia function
                      // if there's a current property selected
                      // shareToSocialMedia(account, currentProperty);
                    }}
                  />
                ))
              ) : (
                <div className="alert alert-secondary">
                  No accounts connected yet. Connect a platform from the left.
                </div>
              )}
            </Col>
          </Row>
        </Container>

        {/* Toast notifications */}
        <ToastContainer position="bottom-end" className="p-3">
          {/* Connect Toast */}
          <Toast
            onClose={() => setShowConnectToast(false)}
            show={showConnectToast}
            delay={3000}
            autohide
            bg="success"
          >
            <Toast.Header>
              <i className="bi bi-check-circle-fill me-2 text-success"></i>
              <strong className="me-auto">Success</strong>
              <small>just now</small>
            </Toast.Header>
            <Toast.Body className="text-white">{toastMessage}</Toast.Body>
          </Toast>

          {/* Disconnect Toast */}
          <Toast
            onClose={() => setShowDisconnectToast(false)}
            show={showDisconnectToast}
            delay={3000}
            autohide
            bg="info"
          >
            <Toast.Header>
              <i className="bi bi-info-circle-fill me-2 text-info"></i>
              <strong className="me-auto">Info</strong>
              <small>just now</small>
            </Toast.Header>
            <Toast.Body className="text-white">{toastMessage}</Toast.Body>
          </Toast>
        </ToastContainer>
      </RealEstateAccountLayout>
    </RealEstatePageLayout>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}
