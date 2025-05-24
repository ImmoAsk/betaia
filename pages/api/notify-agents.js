import { Resend } from "resend";
import NewPropertyNotificationEmail from "../../components/iacomponents/NewProperty/emails/NewPropertyNotificationEmail";

// Initialize Resend with your API key from environment variables
// Ensure RESEND_API_KEY is set in your .env.local file
const resend = new Resend(process.env.RESEND_API_KEY);

// Helper function to introduce a delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { agentEmails, propertyDetails } = req.body;

    if (!process.env.RESEND_API_KEY) {
      console.error("Resend API key is not configured.");
      return res
        .status(500)
        .json({ error: "Email service is not configured." });
    }

    if (
      !agentEmails ||
      !Array.isArray(agentEmails) ||
      agentEmails.length === 0
    ) {
      return res.status(400).json({ error: "Agent emails are required." });
    }
    if (!propertyDetails) {
      return res.status(400).json({ error: "Property details are required." });
    }

    const fromEmail =
      process.env.RESEND_SENDER_EMAIL || "onboarding@resend.dev";
    if (
      fromEmail === "onboarding@resend.dev" &&
      process.env.NODE_ENV === "production"
    ) {
      console.warn(
        "Using default Resend sender email. Please configure RESEND_SENDER_EMAIL for production."
      );
    }

    const results = [];
    let successfulSends = 0;
    let failedSends = 0;

    try {
      for (let i = 0; i < agentEmails.length; i++) {
        const email = agentEmails[i];
        const subject = `Nouvelle propriété : ${propertyDetails.title || "Sans titre"}`;

        try {
          console.log(`Attempting to send email to: ${email}`);
          const { data, error } = await resend.emails.send({
            from: fromEmail,
            to: [email.trim()],
            subject: subject,
            text: "New property has been created",
            // react: NewPropertyNotificationEmail({ propertyDetails: propertyDetails }),
          });

          if (error) {
            return res.status(400).json({ error });
          }
          console.log(`Email sent to ${email} successfully:`, data.id);
          results.push({ status: "fulfilled", value: data, email });
          successfulSends++;
        } catch (error) {
          console.error(
            `Error sending email to ${email} via Resend:`,
            error.name,
            error.message
          );
          results.push({ status: "rejected", reason: error, email });
          failedSends++;
          // If the error is a rate limit error, you might want to break or handle it specifically
          // For now, we just log and continue to allow other emails to be attempted after the delay.
        }

        // Introduce a delay if there are more emails to send
        if (i < agentEmails.length - 1) {
          console.log("Delaying for rate limit...");
          await delay(600); // 600ms delay (just over 1 request per 0.5 seconds)
        }
      }

      if (failedSends > 0) {
        console.warn(`${failedSends} email(s) failed to send.`);
        const failedReasons = results
          .filter((r) => r.status === "rejected")
          .map((r) => ({
            email: r.email,
            error: r.reason?.message || "Unknown error",
          }));

        if (successfulSends === 0) {
          return res.status(500).json({
            error: "Failed to send all email notifications.",
            details: failedReasons,
          });
        }
        return res.status(207).json({
          message: `Notifications processed with ${successfulSends} success(es) and ${failedSends} failure(s).`,
          details: failedReasons,
        });
      }

      res.status(200).json({ message: "All notifications sent successfully." });
    } catch (error) {
      // This catch block is for unexpected errors in the loop setup or overall logic
      console.error("General error in notify-agents handler:", error);
      res
        .status(500)
        .json({
          error: "Failed to process notifications.",
          details: error.message,
        });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
