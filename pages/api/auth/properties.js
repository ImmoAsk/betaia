import { promises as fs } from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const filePath = path.join(process.cwd(), 'data', 'properties.json');
      const jsonData = await fs.readFile(filePath, 'utf8');
      const properties = JSON.parse(jsonData);
      res.status(200).json(properties);
    } catch (error) {
      res.status(500).json({ message: 'Failed to load properties', error });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
