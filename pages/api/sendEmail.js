import { Resend } from "resend";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { EmailTemplate } from "../../components/iacomponents/TenantPayment/emailTemplate";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const {
    tenant_fullname,
    dates,
    tenant_email,
    landlord_fullname,
    landlord_address,
    fileName,
    fileBase64,
    fileType,
  } = req.body;

  const formattedDates = (dates) => {
    const values = dates.map((d) => d.value).filter(Boolean);
    if (values.length === 0) return "N/A";
    if (values.length === 1) return values[0];
    if (values.length === 2) return `${values[0]} and ${values[1]}`;
    return `${values.slice(0, -1).join(", ")} and ${values[values.length - 1]}`;
  };

  try {
    const html = renderToStaticMarkup(
      <EmailTemplate
        tenantName={tenant_fullname}
        receiptDates={formattedDates(dates)}
        landlordName={landlord_fullname}
        landlordAddress={landlord_address}
      />
    );

    const result = await resend.emails.send({
      from: "contact@immoask.com",
      to: tenant_email,
      subject: "Rent Payment Receipt Confirmation",
      html,
      attachments: [
        {
          filename: fileName,
          content: fileBase64.split(",")[1],
          contentType: fileType,
        },
      ],
    });

    return res.status(200).json({ message: "Email sent", result });
  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(500).json({ error: "Failed to send email" });
  }
}
