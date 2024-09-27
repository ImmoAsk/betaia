import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function PropertyDetail({ property }) {
  const [visitDate, setVisitDate] = useState('');
  const [visitTime, setVisitTime] = useState('');
  const { data: session } = useSession();
  const router = useRouter();

  const handleBooking = async () => {
    if (!session) {
      router.push('/auth/signin'); // Redirect to sign-in page if not logged in
      return;
    }

    const bookingDetails = {
      propertyId: property.id,
      userId: session.user.id,
      visitDate,
      visitTime,
    };

    // Make API call to save the booking
    const response = await fetch('/api/book-visit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingDetails),
    });

    if (response.ok) {
      alert('Property visit booked successfully!');
    } else {
      alert('Failed to book property visit');
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: 'white',
        padding: '20px',
      }}
    >
      <h1 style={{ fontSize: '30px', fontWeight: 'bold', color: '#0070f3', marginBottom: '20px' }}>
        {property.name}
      </h1>
      <p style={{ fontSize: '18px', color: '#555', marginBottom: '30px', textAlign: 'center' }}>
        {property.description}
      </p>

      <div style={{ marginBottom: '20px', width: '100%', maxWidth: '400px' }}>
        <label style={{ display: 'block', marginBottom: '10px', color: '#333' }}>
          Choose a date:
        </label>
        <input
          type="date"
          value={visitDate}
          onChange={(e) => setVisitDate(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #0070f3',
          }}
        />
      </div>

      <div style={{ marginBottom: '30px', width: '100%', maxWidth: '400px' }}>
        <label style={{ display: 'block', marginBottom: '10px', color: '#333' }}>
          Choose a time:
        </label>
        <input
          type="time"
          value={visitTime}
          onChange={(e) => setVisitTime(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #0070f3',
          }}
        />
      </div>

      <button
        onClick={handleBooking}
        style={{
          padding: '12px 24px',
          backgroundColor: '#0070f3',
          color: '#fff',
          fontWeight: 'bold',
          borderRadius: '5px',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        Book Visit
      </button>
    </div>
  );
}

// This fetches the property data based on the dynamic route
export async function getServerSideProps(context) {
  const { params } = context;

  if (!params || !params.id) {
    return {
      notFound: true, // Return 404 if no id is provided
    };
  }

  const { id } = params;

  // Replace with real data fetching logic (e.g., from a database or API)
  const property = {
    id,
    name: `Property ${id}`,
    description: 'This is a detailed description of the property.',
  };

  return {
    props: {
      property,
    },
  };
}
