// Proxy API pour eviter les erreurs CORS
// Toutes les requetes GraphQL passent par ce proxy

export default async function handler(req, res) {
  const { query } = req.query;
  
  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  
  try {
    const response = await fetch(`${apiUrl}?query=${encodeURIComponent(query)}`);
    const data = await response.json();
    
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
    return res.status(200).json(data);
  } catch (error) {
    console.error('Proxy GraphQL error:', error);
    return res.status(500).json({ error: 'Failed to fetch data' });
  }
}
