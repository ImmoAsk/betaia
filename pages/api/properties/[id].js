import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'properties.json');

const readPropertiesFromFile = () => {
  try {
    if (fs.existsSync(dataFilePath)) {
      const jsonData = fs.readFileSync(dataFilePath);
      return JSON.parse(jsonData);
    }
  } catch (error) {
    console.error('Error reading properties file:', error);
  }
  return [];
};

export default function handler(req, res) {
  const { id } = req.query;
  const properties = readPropertiesFromFile();
  const property = properties.find(p => p.id === id);

  if (req.method === 'GET') {
    if (property) {
      res.status(200).json(property);
    } else {
      res.status(404).json({ error: 'Property not found' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
