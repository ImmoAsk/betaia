import { visitations } from "../../models/Visitation";

export default function handler(req, res) {
  if (req.method === "GET") {
    res.status(200).json(visitations);
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
