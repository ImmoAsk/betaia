import { useState, useEffect } from "react";

const Visitations = () => {
  const [visitations, setVisitations] = useState([]);
  const [filteredVisitations, setFilteredVisitations] = useState([]);
  const [filters, setFilters] = useState({ renterName: "", property: "", date: "" });

  useEffect(() => {
    fetch("/api/getVisitations")
      .then((res) => res.json())
      .then((data) => {
        setVisitations(data);
        setFilteredVisitations(data);
      });
  }, []);

  const handleAccept = (id, email) => {
    fetch("/api/updateVisitation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: "accepted", email })
    })
      .then((res) => res.json())
      .then((data) => alert(`Visitation accepted!`));
  };

  const handleDecline = (id, email) => {
    fetch("/api/updateVisitation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: "declined", email })
    })
      .then((res) => res.json())
      .then((data) => alert(`Visitation declined!`));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    const filtered = visitations.filter((v) =>
      (filters.renterName ? v.renterName.includes(filters.renterName) : true) &&
      (filters.property ? v.property.includes(filters.property) : true) &&
      (filters.date ? v.date.includes(filters.date) : true)
    );
    setFilteredVisitations(filtered);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "#f0f8ff", // Light blue background
        color: "#00008b", // Dark blue text
      }}
    >
      <h1 style={{ marginBottom: "20px", color: "#00008b" }}>Property Visitations</h1>

      <div style={{ marginBottom: "20px" }}>
        <input
          name="renterName"
          placeholder="Filter by Renter Name"
          onChange={handleFilterChange}
          style={{
            padding: "10px",
            margin: "5px",
            borderRadius: "5px",
            border: "1px solid #00008b",
            color: "#00008b",
          }}
        />
        <input
          name="property"
          placeholder="Filter by Property"
          onChange={handleFilterChange}
          style={{
            padding: "10px",
            margin: "5px",
            borderRadius: "5px",
            border: "1px solid #00008b",
            color: "#00008b",
          }}
        />
        <input
          name="date"
          type="date"
          placeholder="Filter by Date"
          onChange={handleFilterChange}
          style={{
            padding: "10px",
            margin: "5px",
            borderRadius: "5px",
            border: "1px solid #00008b",
            color: "#00008b",
          }}
        />
        <button
          onClick={applyFilters}
          style={{
            padding: "10px 20px",
            backgroundColor: "#00008b",
            color: "#ffffff",
            borderRadius: "5px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Apply Filters
        </button>
      </div>

      <ul style={{ listStyleType: "none", padding: 0, width: "100%", maxWidth: "600px" }}>
        {filteredVisitations.map((v) => (
          <li
            key={v.id}
            style={{
              marginBottom: "20px",
              padding: "15px",
              border: "1px solid #00008b",
              borderRadius: "10px",
              backgroundColor: "#ffffff",
              textAlign: "center",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <p style={{ margin: "10px 0", color: "#00008b" }}>
              {v.renterName} - {v.property} - {v.date}
            </p>
            <button
              onClick={() => handleAccept(v.id, v.email)}
              style={{
                padding: "10px 20px",
                backgroundColor: "#00008b",
                color: "#ffffff",
                borderRadius: "5px",
                margin: "5px",
                border: "none",
                cursor: "pointer",
              }}
            >
              Accept
            </button>
            <button
              onClick={() => handleDecline(v.id, v.email)}
              style={{
                padding: "10px 20px",
                backgroundColor: "#ff0000",
                color: "#ffffff",
                borderRadius: "5px",
                margin: "5px",
                border: "none",
                cursor: "pointer",
              }}
            >
              Decline
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Visitations;
