import { useState } from 'react';
import { Card, Button, Spinner, Badge } from 'react-bootstrap';

const SocialMediaLinkCard = ({ platform, isConnected, username, onConnect, onDisconnect, showShareButton, onShare }) => {
  const [connecting, setConnecting] = useState(false);
  const [sharing, setSharing] = useState(false);

  const handleConnect = () => {
    setConnecting(true);

    // Simulate OAuth authentication process
    setTimeout(() => {
      onConnect();
      setConnecting(false);
    }, 1500); // 1.5s delay to simulate authentication
  };

  const handleDisconnect = () => {
    onDisconnect();
  };

  const handleShare = () => {
    setSharing(true);

    // Simulate sharing process
    setTimeout(() => {
      if (onShare) {
        onShare(platform);
      }
      setSharing(false);
    }, 1000);
  };

  return (
    <Card className={`mb-3 social-media-card ${isConnected ? 'connected' : ''}`}>
      <Card.Body className="d-flex align-items-center flex-wrap">
        <div className="me-3">
          {isConnected ? (
            <i className="bi bi-check-circle-fill text-success fs-4"></i>
          ) : (
            <i className={`bi ${platform.icon} fs-4 text-muted`}></i>
          )}
        </div>

        <div className="flex-grow-1">
          <h5 className="mb-0">
            {platform.name}
            {isConnected && (
              <Badge bg="success" className="ms-2" pill>Connected</Badge>
            )}
          </h5>
          {isConnected && username && (
            <small className="text-muted">
              <i className="bi bi-person-circle me-1"></i>Connected as {username}
            </small>
          )}
        </div>

        <div className="d-flex mt-2 mt-sm-0">
          {isConnected && showShareButton && (
            <Button
              variant="success"
              size="sm"
              className="me-2"
              onClick={handleShare}
              disabled={sharing}
            >
              {sharing ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-1"
                  />
                  Sharing...
                </>
              ) : (
                <><i className="bi bi-share-fill me-1"></i>Share</>
              )}
            </Button>
          )}

          {isConnected ? (
            <Button
              variant="outline-danger"
              size="sm"
              onClick={handleDisconnect}
            >
              <i className="bi bi-x-circle me-1"></i>Disconnect
            </Button>
          ) : (
            <Button
              variant="outline-primary"
              size="sm"
              onClick={handleConnect}
              disabled={connecting}
            >
              {connecting ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-1"
                  />
                  Connecting...
                </>
              ) : (
                <><i className="bi bi-link-45deg me-1"></i>Connect</>
              )}
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default SocialMediaLinkCard;
