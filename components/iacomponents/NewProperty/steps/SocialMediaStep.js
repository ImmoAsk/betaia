import React, { useEffect, useState, useCallback } from 'react';
import { Container, Row, Col, Button, Alert, Toast, ToastContainer } from 'react-bootstrap';
import SocialMediaLinkCard from '../SocialMediaLinkCard'; // Adjusted path
import Cookies from 'js-cookie';
import crypto from 'crypto-js';

// List of available social media platforms (ensure environment variables are accessible)
const AVAILABLE_PLATFORMS = [
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: 'bi-linkedin',
    authUrl: 'https://www.linkedin.com/oauth/v2/authorization',
    clientId: process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID,
    redirectUri: process.env.NEXT_PUBLIC_LINKEDIN_REDIRECT_URI,
    scope: 'r_liteprofile w_member_social',
    state: 'linkedin_state',
    responseType: 'code',
  },
  {
    id: 'facebook',
    name: 'Facebook Page',
    icon: 'bi-facebook',
    authUrl: 'https://www.facebook.com/v17.0/dialog/oauth',
    clientId: process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID,
    redirectUri: process.env.NEXT_PUBLIC_FACEBOOK_REDIRECT_URI,
    scope: 'pages_manage_posts,pages_read_engagement,pages_show_list,email,public_profile',
    state: 'facebook_state',
    responseType: 'code',
  },
  {
    id: 'twitter',
    name: 'Twitter',
    icon: 'bi-twitter-x',
    authUrl: 'https://twitter.com/i/oauth2/authorize',
    clientId: process.env.NEXT_PUBLIC_TWITTER_CLIENT_ID,
    redirectUri: process.env.NEXT_PUBLIC_TWITTER_REDIRECT_URI,
    scope: 'tweet.read tweet.write users.read offline.access',
    state: 'twitter_state', // Will be overridden
    responseType: 'code',
    codeChallengeMethod: 'S256',
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: 'bi-instagram',
    authUrl: 'https://api.instagram.com/oauth/authorize',
    clientId: process.env.NEXT_PUBLIC_INSTAGRAM_CLIENT_ID,
    redirectUri: process.env.NEXT_PUBLIC_INSTAGRAM_REDIRECT_URI,
    scope: 'user_profile,user_media',
    state: 'instagram_state',
    responseType: 'code',
  },
];

const SocialMediaStep = ({
  propertyData,
  onConnectionsChecked,
  onProceed,
  onBack,
  initialIsMockMode = true // Default to mock mode
}) => {
  const [connectedAccounts, setConnectedAccounts] = useState([]);
  const [availablePlatforms, setAvailablePlatforms] = useState([]);
  const [isMockMode, setIsMockMode] = useState(initialIsMockMode);
  const [showMockWarning, setShowMockWarning] = useState(true);
  const [showConnectToast, setShowConnectToast] = useState(false);
  const [showDisconnectToast, setShowDisconnectToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateAvailablePlatforms = useCallback((currentConnectedAccounts) => {
    const connectedIds = currentConnectedAccounts.map(account => account.id);
    const available = AVAILABLE_PLATFORMS.filter(
      platform => !connectedIds.includes(platform.id)
    );
    setAvailablePlatforms(available);
  }, []);

  const fetchRealConnections = useCallback(async () => {
    try {
      const response = await fetch('/api/social/get-connections');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch connections');
      }
      const realConnections = await response.json();
      setConnectedAccounts(realConnections);
      updateAvailablePlatforms(realConnections);
      onConnectionsChecked(realConnections.length > 0);
    } catch (error) {
      console.error("Error fetching real connections:", error);
      setToastMessage(error.message || "Could not load your connected accounts.");
      setShowErrorToast(true);
      onConnectionsChecked(false);
    }
  }, [updateAvailablePlatforms, onConnectionsChecked]);

  useEffect(() => {
    if (isMockMode) {
      const storedAccounts = localStorage.getItem('connectedAccounts');
      const initialAccounts = storedAccounts ? JSON.parse(storedAccounts) : [];
      setConnectedAccounts(initialAccounts);
      updateAvailablePlatforms(initialAccounts);
      onConnectionsChecked(initialAccounts.length > 0);
    } else {
      fetchRealConnections();
    }
  }, [isMockMode, fetchRealConnections, updateAvailablePlatforms, onConnectionsChecked]);

  // Effect to handle OAuth callback messages (simplified for component context)
  useEffect(() => {
    // This logic might need to be adapted based on how the parent MultiStepForm handles redirects
    // For now, assuming any relevant query params would be passed down or handled by a global context
    // Simulating a message passed via props or a shared state if needed
    const queryParams = new URLSearchParams(window.location.search);
    const status = queryParams.get('status');
    const error_description = queryParams.get('error_description');
    const message = queryParams.get('message');

    if (status) {
      if (status.endsWith('_success')) {
        const platformName = status.split('_')[0];
        setToastMessage(`Successfully connected to ${platformName.charAt(0).toUpperCase() + platformName.slice(1)}!`);
        setShowConnectToast(true);
        if (!isMockMode) fetchRealConnections();
         // Clean up URL query params (if this component has control or via callback)
        window.history.replaceState({}, document.title, window.location.pathname);
      } else if (status.endsWith('_error')) {
        const platformName = status.split('_')[0];
        setToastMessage(decodeURIComponent(error_description || message || `Failed to connect ${platformName}.`));
        setShowErrorToast(true);
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, [isMockMode, fetchRealConnections]);


  const handleToggleMockMode = () => {
    const newMockMode = !isMockMode;
    setIsMockMode(newMockMode);
    // Refresh accounts based on the new mode
    if (newMockMode) {
      const storedAccounts = localStorage.getItem('connectedAccounts');
      const mockAccounts = storedAccounts ? JSON.parse(storedAccounts) : [];
      setConnectedAccounts(mockAccounts);
      updateAvailablePlatforms(mockAccounts);
      onConnectionsChecked(mockAccounts.length > 0);
    } else {
      fetchRealConnections();
    }
  };

  const initiateOAuth = (platform) => {
    const generatedState = crypto.lib.WordArray.random(16).toString();
    Cookies.set(`${platform.id}_oauth_state`, generatedState, { path: '/', sameSite: 'lax' });

    const params = new URLSearchParams({
      client_id: platform.clientId,
      redirect_uri: platform.redirectUri, // This redirect URI should point back to the page hosting this multi-step form
      scope: platform.scope,
      response_type: platform.responseType,
      state: generatedState,
    });

    if (platform.id === 'twitter') {
      const verifier = crypto.lib.WordArray.random(32).toString(crypto.enc.Base64url).replace(/=/g, '');
      const challenge = crypto.SHA256(verifier).toString(crypto.enc.Base64url).replace(/=/g, '');
      Cookies.set('twitter_code_verifier', verifier, { path: '/', sameSite: 'lax', secure: process.env.NODE_ENV === 'production' });
      params.append('code_challenge', challenge);
      params.append('code_challenge_method', platform.codeChallengeMethod || 'S256');
    }
    // The redirect URI needs to bring the user back to the current page/step
    // This might require the parent form to handle the OAuth callback and pass status.
    window.location.href = `${platform.authUrl}?${params.toString()}`;
  };

  const handleConnect = (platform) => {
    if (isMockMode) {
      setTimeout(() => {
        try {
          const newConnectedAccount = {
            ...platform,
            connectedAt: new Date().toISOString(),
            username: `user_${platform.id}`,
            accessToken: `mock_token_${Date.now()}`,
          };
          const updatedConnectedAccounts = [...connectedAccounts, newConnectedAccount];
          setConnectedAccounts(updatedConnectedAccounts);
          localStorage.setItem('connectedAccounts', JSON.stringify(updatedConnectedAccounts));
          updateAvailablePlatforms(updatedConnectedAccounts);
          onConnectionsChecked(updatedConnectedAccounts.length > 0);
          setToastMessage(`Successfully connected to ${platform.name}!`);
          setShowConnectToast(true);
        } catch (error) {
          console.error("Error connecting mock account:", error);
          setToastMessage(`Error connecting to ${platform.name}. Please try again.`);
          setShowErrorToast(true);
        }
      }, 1000);
    } else {
      if (!platform.clientId || !platform.redirectUri) {
        setToastMessage(`Configuration error for ${platform.name}. Client ID or Redirect URI is missing.`);
        setShowErrorToast(true);
        return;
      }
      initiateOAuth(platform);
    }
  };

  const handleDisconnect = async (platformId) => {
    const platformName = connectedAccounts.find(account => account.id === platformId)?.name || platformId;
    if (isMockMode) {
      try {
        const updatedConnectedAccounts = connectedAccounts.filter(acc => acc.id !== platformId);
        setConnectedAccounts(updatedConnectedAccounts);
        localStorage.setItem('connectedAccounts', JSON.stringify(updatedConnectedAccounts));
        updateAvailablePlatforms(updatedConnectedAccounts);
        onConnectionsChecked(updatedConnectedAccounts.length > 0);
        setToastMessage(`Successfully disconnected from ${platformName} (mock)!`);
        setShowDisconnectToast(true);
      } catch (error) {
        console.error("Error disconnecting mock account:", error);
        setToastMessage("Error disconnecting mock account.");
        setShowErrorToast(true);
      }
    } else {
      try {
        const response = await fetch(`/api/social/disconnect/${platformId}`, { method: 'POST' });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || `Failed to disconnect from ${platformName}`);
        setToastMessage(result.message || `Successfully disconnected from ${platformName}!`);
        setShowDisconnectToast(true);
        fetchRealConnections(); // Refresh connections
      } catch (error) {
        console.error(`Error disconnecting ${platformName}:`, error);
        setToastMessage(error.message || `Could not disconnect from ${platformName}.`);
        setShowErrorToast(true);
      }
    }
  };

  const handleProceed = async () => {
    setIsSubmitting(true);
    // onProceed will handle the actual submission, agent notification, social posting
    // This component's job is to ensure connections are there before allowing proceed.
    if (connectedAccounts.length === 0 && !isMockMode) { // In real mode, require connections
        setToastMessage("Please connect at least one social media account to proceed.");
        setShowErrorToast(true);
        setIsSubmitting(false);
        return;
    }
    await onProceed(connectedAccounts, isMockMode); // Pass accounts and mock status
    setIsSubmitting(false);
  };


  return (
    <Container fluid className="py-4">
      <Row className="mb-3">
        <Col>
          <h3>Connect Social Media & Post</h3>
          <p className="text-muted">
            Connect your social media accounts to automatically post your property listing.
            You must connect at least one account to proceed.
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
                Currently running in demo mode with simulated OAuth.
                Toggle to "Real Mode" to use actual OAuth (requires API setup).
              </p>
              <div className="d-flex justify-content-end">
                <Button
                  variant={isMockMode ? "outline-info" : "info"}
                  size="sm"
                  onClick={handleToggleMockMode}
                >
                  {isMockMode ? "Switch to Real Mode" : "Switch to Mock Mode"}
                </Button>
              </div>
            </Alert>
          )}
        </Col>
      </Row>

      <Row>
        <Col md={6} className="mb-4">
          <h4 className="mb-3">Available Platforms</h4>
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
            <div className="alert alert-secondary">
              {connectedAccounts.length === AVAILABLE_PLATFORMS.length
                ? "All available platforms have been connected."
                : "No more platforms to connect or loading..."}
            </div>
          )}
        </Col>

        <Col md={6} className="mb-4">
          <h4 className="mb-3">Connected Accounts</h4>
          {connectedAccounts.length > 0 ? (
            connectedAccounts.map((account) => (
              <SocialMediaLinkCard
                key={account.id || account.connectionId} // Ensure unique key
                platform={account}
                isConnected={true}
                username={account.username}
                onDisconnect={() => handleDisconnect(account.id)}
                // Share button per account can be added if direct sharing from this step is desired
              />
            ))
          ) : (
            <div className="alert alert-warning">
              No accounts connected yet. Connect a platform to enable posting.
            </div>
          )}
        </Col>
      </Row>

      <Row className="mt-4">
        <Col className="d-flex justify-content-between">
          <Button variant="secondary" onClick={onBack} disabled={isSubmitting}>
            Previous
          </Button>
          <Button
            variant="primary"
            onClick={handleProceed}
            disabled={isSubmitting || (connectedAccounts.length === 0 && !isMockMode)}
          >
            {isSubmitting ? 'Submitting...' : (propertyData && propertyData.submitted ? 'Update & Re-post' : 'Complete & Post Listing')}
          </Button>
        </Col>
      </Row>

      <ToastContainer position="bottom-end" className="p-3" style={{ zIndex: 9999 }}>
        <Toast onClose={() => setShowConnectToast(false)} show={showConnectToast} delay={3000} autohide bg="success">
          <Toast.Header closeButton={false}><i className="bi bi-check-circle-fill me-2"></i><strong className="me-auto">Success</strong></Toast.Header>
          <Toast.Body className="text-white">{toastMessage}</Toast.Body>
        </Toast>
        <Toast onClose={() => setShowDisconnectToast(false)} show={showDisconnectToast} delay={3000} autohide bg="info">
          <Toast.Header closeButton={false}><i className="bi bi-info-circle-fill me-2"></i><strong className="me-auto">Info</strong></Toast.Header>
          <Toast.Body className="text-white">{toastMessage}</Toast.Body>
        </Toast>
        <Toast onClose={() => setShowErrorToast(false)} show={showErrorToast} delay={5000} autohide bg="danger">
          <Toast.Header closeButton={false}><i className="bi bi-exclamation-triangle-fill me-2"></i><strong className="me-auto">Error</strong></Toast.Header>
          <Toast.Body className="text-white">{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
};

export default SocialMediaStep;
