import React from "react";

export const EmailTemplate = ({
  tenantName,
  receiptDates,
  landlordName,
  landlordAddress,
}) => {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", lineHeight: 1.6 }}>
      <div style={{ textAlign: "center" }}>
        <img
          src="https://immoask.com/images/logo/immoask-logo-cropped.png"
          alt="Logo"
          style={{ width: "200px", height: "auto", marginBottom: "20px" }}
        />
      </div>
      <h2>Dear {tenantName},</h2>
      <p>
        Your rent payment for the following month(s):{" "}
        <strong>{receiptDates}</strong> has been recorded successfully
      </p>
      <p>Your receipt has been attached to this email.</p>
      <p>Thank you .</p>
      <br />
      <p>
        — {landlordName} - {landlordAddress}
      </p>
    </div>
  );
};
