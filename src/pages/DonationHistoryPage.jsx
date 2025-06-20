import React, { useState, useEffect } from "react";

const DonationHistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_BASE = "http://localhost:3000/api";

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/donations/history`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setHistory(data.donations || []);
      }
    } catch (err) {
      setHistory([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="page-container">
      <h1>Donation History</h1>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="history-list">
          {history.length === 0 ? (
            <p>No donation history found.</p>
          ) : (
            history.map((donation) => (
              <div className="history-item" key={donation._id}>
                <div className="history-date">
                  <span className="date">
                    {new Date(donation.donationDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="history-details">
                  <p>
                    <strong>Blood Type:</strong> {donation.bloodType}
                  </p>
                  <p>
                    <strong>Location:</strong> {donation.location}
                  </p>
                  <p>
                    <strong>Hospital:</strong> {donation.hospital}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span className="status completed">{donation.status}</span>
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default DonationHistoryPage;
