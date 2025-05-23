import React from "react";

export const EmailTemplatePaymentLink = ({
  tenantName,
  rentAmount,
  dueDate,
  landlordName,
  landlordAddress,
  landlordNumber,
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
      <h5 className="mb-3">Payment Link</h5>
      <p>
        <strong>Dear {tenantName},</strong>
      </p>
      <p>
        This is a reminder that an amount of <strong>{rentAmount} CFA </strong>
        is due for the following month(s) <strong>{dueDate}</strong>
      </p>

      <p>
        Kindly visit the app to settle these arrears or contact your landlord,{" "}
        <strong>{landlordName}</strong> on <strong>{landlordNumber}</strong>
      </p>

      <p>Thank you.</p>
      <br />
      <p>
        — {landlordName} - {landlordAddress}
      </p>
    </div>
  );
};
