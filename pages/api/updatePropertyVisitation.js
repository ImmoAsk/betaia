import { visitations } from "../../models/Visitation";
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'your-email@gmail.com',  // Replace with your Gmail
    pass: 'your-email-password'    // Replace with your email password or app password
  }
});

export default function handler(req, res) {
  const { id, status, email } = req.body;

  const visitation = visitations.find(v => v.id === id);
  if (visitation) {
    visitation.status = status;

    // Send email notification
    let mailOptions = {
      from: 'your-email@gmail.com',
      to: email,
      subject: `Property Visitation ${status === 'accepted' ? 'Accepted' : 'Declined'}`,
      text: `Your visitation request for ${visitation.property} on ${visitation.date} has been ${status}.`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ error: "Error sending email" });
      }
      res.status(200).json(visitation);
    });
  } else {
    res.status(404).json({ error: "Visitation not found" });
  }
}
