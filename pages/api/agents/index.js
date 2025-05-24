// Mock database for agents
const agentsStore = [
  {
    id: "agent1",
    name: "Kossi Adanou",
    email: " kjadanou@gmail.com",
    propertiesManaged: 120,
    specialty: ["Location", "Vente"],
  },
  {
    id: "agent2",
    name: "Timothy Essuman",
    email: "nyhirakwame@gmail.com",
    propertiesManaged: 95,
    specialty: ["Vente"],
  },
  {
    id: "agent3",
    name: "Charlie Logements",
    email: "charlie@gmail.com",
    propertiesManaged: 200,
    specialty: ["Location", "Gestion"],
  },
  {
    id: "agent4",
    name: "Diana Biens & Services",
    email: "diana@gmail.com",
    propertiesManaged: 75,
    specialty: ["Location"],
  },
  {
    id: "agent5",
    name: "Eva Propriétés",
    email: "eva@gmail.com",
    propertiesManaged: 150,
    specialty: ["Vente", "Luxe"],
  },
  {
    id: "agent6",
    name: "Franco Services Immo",
    email: "franco@example.com",
    propertiesManaged: 110,
    specialty: ["Location", "Vente", "Commercial"],
  },
  {
    id: "agent7",
    name: "Gaston Gestion Locative",
    email: "gaston@example.com",
    propertiesManaged: 180,
    specialty: ["Gestion"],
  },
  {
    id: "agent8",
    name: "Hélène Habitat Conseil",
    email: "helene@example.com",
    propertiesManaged: 130,
    specialty: ["Vente", "Neuf"],
  },
];

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Simulate fetching agents
    // In a real app, this could come from a database
    console.log("API returning list of agents:", agentsStore.length);
    // Add a small delay to simulate network latency
    await new Promise(resolve => setTimeout(resolve, 200));
    res.status(200).json(agentsStore);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
