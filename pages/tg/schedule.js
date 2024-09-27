import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function PropertyVisitForm() {
  const [startDate, setStartDate] = useState(new Date());
  const [propertyId, setPropertyId] = useState('');
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Fetch properties when the component mounts
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch('/properties.json'); // Fetch from the public folder
        const data = await response.json();
        setProperties(data);
      } catch (error) {
        console.error('Error fetching properties:', error);
        setMessage('Failed to load properties');
      }
    };

    fetchProperties();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!propertyId) {
      setMessage('Please select a property!');
      return;
    }

    const dateTime = startDate.toISOString();

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dateTime, propertyId }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('Visite programmée avec succès!');
      } else {
        setMessage(`Erreur lors de la programmation de la visite: ${data.message}`);
      }
    } catch (error) {
      console.error('Error scheduling visit:', error);
      setMessage('Erreur lors de la programmation de la visite. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.photoContainer}>
        {/* Placeholder for the photo */}
        <img
          src="/images/tg/top-properties/06.jpg" // Replace with your image URL or image component
          alt="Propriété"
          style={styles.photo}
        />
      </div>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.header}>Programmer une visite de propriété</h2>

        {message && <p style={styles.message}>{message}</p>}

        <div style={styles.field}>
          <label style={styles.label}>Sélectionnez la propriété :</label>
          <select
            value={propertyId}
            onChange={(e) => setPropertyId(e.target.value)}
            required
            style={styles.input}
          >
            <option value="" disabled>Sélectionnez une propriété</option>
            {properties.map((property) => (
              <option key={property._id} value={property._id}>
                {property.name} - {property.address}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Sélectionnez la date et l'heure :</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="MMMM d, yyyy h:mm aa"
            timeCaption="Heure"
            required
            style={styles.datePicker}
          />
        </div>

        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? 'Programmation...' : 'Programmer la visite'}
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px',
    height: '100vh',
    backgroundColor: '#e0f7fa',
  },
  photoContainer: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: '20px',
  },
  photo: {
    width: '100%',
    height: 'auto',
    maxWidth: '500px',
    borderRadius: '10px',
  },
  form: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.2)',
    width: '400px',
    textAlign: 'center',
  },
  header: {
    color: '#1E88E5',
    marginBottom: '20px',
    fontSize: '24px',
  },
  field: {
    marginBottom: '20px',
    textAlign: 'left',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    color: '#1E88E5',
    fontSize: '16px',
  },
  input: {
    width: '100%',
    padding: '12px',
    borderRadius: '5px',
    border: '1px solid #90caf9',
    fontSize: '16px',
  },
  datePicker: {
    width: '100%',
  },
  button: {
    backgroundColor: '#1976D2',
    color: '#ffffff',
    padding: '12px 20px',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '18px',
    display: 'block',
    marginTop: '20px',
    width: '100%',
  },
  message: {
    color: '#D32F2F',
    marginBottom: '15px',
  },
};
