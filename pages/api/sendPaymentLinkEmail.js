import { Resend } from "resend";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { EmailTemplatePaymentLink } from "../../components/iacomponents/TenantPayment/emailTempPaymentLink";

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
    landlord_phoneNumber,
    monthlyRent,
  } = req.body;

  const totalRent = (monthlyRent, dates) => {
    const rent = parseFloat(monthlyRent || 0);
    const validDates = Array.isArray(dates) ? dates.filter((d) => d.value) : [];
    return rent * validDates.length;
  };

  const formattedDates = (dates) => {
    const values = dates.map((d) => d.value).filter(Boolean);
    if (values.length === 0) return "N/A";
    if (values.length === 1) return values[0];
    if (values.length === 2) return `${values[0]} and ${values[1]}`;
    return `${values.slice(0, -1).join(", ")} and ${values[values.length - 1]}`;
  };
  try {
    const html = renderToStaticMarkup(
      <EmailTemplatePaymentLink
        tenantName={tenant_fullname}
        dueDate={formattedDates(dates)}
        landlordAddress={landlord_address}
        landlordName={landlord_fullname}
        rentAmount={totalRent(monthlyRent, dates).toLocaleString("fr-FR")}
        landlordNumber={landlord_phoneNumber}
      />
    );

    const result = await resend.emails.send({
      from: "contact@immoask.com",
      to: tenant_email,
      subject: "Rent Payment Receipt Confirmation",
      html,
    });

    return res.status(200).json({ message: "Email sent", result });
  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(500).json({ error: "Failed to send email" });
  }
}
