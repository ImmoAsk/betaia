import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { tenant_fullname, tenant_phoneNumber, dates, property_rent } =
    req.body;

  const formattedDates = dates
    .map((d) => d.value)
    .filter(Boolean)
    .join(", ");
  const rentAmount = parseFloat(property_rent || 0);
  const totalAmount = rentAmount * dates.filter((d) => d.value).length;

  const message = `Cher(e) ${tenant_fullname}, votre loyer pour ${formattedDates} est dû. Total: ${totalAmount} CFA. Veuillez vous connecter à immoask.com pour payer.`;

  try {
    const response = await axios.post(
      `https://graph.facebook.com/v22.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to: tenant_phoneNumber,
        type: "text",
        text: {
          body: message,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("WhatsApp API Response:", response.data);
    return res.status(200).json({ success: true, data: response.data });
  } catch (error) {
    console.error("WhatsApp API Error:", error.response?.data || error.message);
    return res.status(500).json({
      error: error.response?.data || "Failed to send WhatsApp message",
    });
  }
}
