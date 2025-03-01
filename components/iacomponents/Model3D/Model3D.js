import React from "react";
import { Card } from "react-bootstrap";

const Model3D = ({ image, description }) => {
    const logoUrl = "/images/logo/immoask-logo-cropped.png";
    return (

        <Card
            style={{
                border: "none",
                overflow: "hidden",
                position: "relative",
                width: "300px",
                height: "250px",
            }}
        >
            <div
                style={{
                    position: "relative",
                    width: "100%",
                    height: "80%",
                }}
            >
                <img
                    src={image}
                    alt="3D Model"
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                    }}
                />
                <img
                    src={logoUrl}
                    alt="Logo"
                    style={{
                        position: "absolute",
                        bottom: "10px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: "50px",
                        height: "auto",
                        opacity: 0.8,
                    }}
                />
            </div>
            <Card.Body
                style={{
                    textAlign: "center",
                    fontSize: "14px",
                    padding: "8px",
                    backgroundColor: "white",
                }}
            >
                {description}
            </Card.Body>
        </Card>
    );
};
{/* <Card className="text-white border-0 overflow-hidden">
          <div
            style={{
              backgroundImage: `url(${image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              height: "300px",
              position: "relative",
            }}
            className="w-100"
          >
            <div className="position-absolute bottom-0 w-100 p-3 bg-dark bg-opacity-50">
              <Card.Text className="text-white">{description}</Card.Text>
            </div>
          </div>
        </Card> */}
export default Model3D;
