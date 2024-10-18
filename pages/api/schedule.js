export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { dateTime, propertyId } = req.body;

    if (!dateTime || !propertyId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Convert dateTime string to a Date object
    const selectedDate = new Date(dateTime);
    const currentDate = new Date();

    // Check if the selected date is in the future
    if (selectedDate <= currentDate) {
      return res.status(400).json({ message: 'La date de visite doit être dans le futur.' });
    }

    try {
      // Simulate scheduling logic here (e.g., save to a database)
      // For now, we assume the visit is scheduled successfully.
      
      // Respond with success
      res.status(200).json({ message: 'Visite programmée avec succès!' });
    } catch (error) {
      console.error('Error scheduling visit:', error);
      res.status(500).json({ message: 'Erreur interne du serveur' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}
