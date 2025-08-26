import { Resend } from "resend";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { VerificationDisponibiliteEmailTemplate } from "../../components/iacomponents/Emails/VerificationDisponibiliteEmailTemplate";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const {
  agentName,
  agentEmail,
  customerName,
  propertyNuo,
  propertyLink,
  propertyImage,
  } = req.body;
  console.log("Request Body: ", req.body);
  const formattedDates = (dates) => {
    const values = dates.map((d) => d.value).filter(Boolean);
    if (values.length === 0) return "N/A";
    if (values.length === 1) return values[0];
    if (values.length === 2) return `${values[0]} and ${values[1]}`;
    return `${values.slice(0, -1).join(", ")} and ${values[values.length - 1]}`;
  };

  try {
    const html = renderToStaticMarkup(
      <VerificationDisponibiliteEmailTemplate
        agentName={agentName}
        customerName={customerName}
        propertyNuo={propertyNuo}
        propertyLink={propertyLink}
        propertyImage={propertyImage}
      />
    );

    const result = await resend.emails.send({
      from: "contact@immoask.com",
      to: agentEmail,
      subject: "Vérification de la disponibilité du bien immobilier N° " + propertyNuo,
      html,
    });

    return res.status(200).json({ message: "Email envoyé avec succès", result });
  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(500).json({ error: "Failed to send email" });
  }
}
