import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const ViewRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }

    const fetchRequests = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      try {
        const res = await fetch("http://localhost:3000/api/requests", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (data.success) {
          setRequests(data.requests);
        }
      } catch (err) {
        console.error("Failed to fetch requests", err);
      }
      setLoading(false);
    };

    fetchRequests();
  }, []);

  const handleApply = async (requestId) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `http://localhost:3000/api/requests/${requestId}/apply`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      if (data.success) {
        alert("Successfully applied!");
        // Optionally, update the UI to show "Applied"
      } else {
        alert(`Failed to apply: ${data.message}`);
      }
    } catch (err) {
      alert("An error occurred while applying.");
    }
  };

  return (
    <div className="page-container">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <h1>Open Blood Requests</h1>
        <Link to="/create-request" className="btn primary">
          + Create Request
        </Link>
      </div>

      {loading ? (
        <p>Loading requests...</p>
      ) : requests.length === 0 ? (
        <p>No open blood requests at the moment.</p>
      ) : (
        <div className="requests-list">
          {requests.map((req) => (
            <div key={req._id} className="request-card">
              <div className="request-card-header">
                <h3>Patient: {req.patientName}</h3>
                <span
                  className={`urgency-tag ${req.urgency
                    .toLowerCase()
                    .replace(" ", "-")}`}
                >
                  {req.urgency}
                </span>
              </div>
              <div className="request-card-body">
                <p>
                  <strong>Blood Type:</strong>{" "}
                  <span className="blood-type-highlight">{req.bloodType}</span>
                </p>
                <p>
                  <strong>Units Required:</strong> {req.unitsRequired}
                </p>
                <p>
                  <strong>Hospital:</strong> {req.hospitalName}
                </p>
                <p>
                  <strong>Address:</strong> {req.hospitalAddress}
                </p>
                <p>
                  <strong>Contact:</strong> {req.contactPerson} at{" "}
                  {req.contactPhone}
                </p>
                <p>
                  <strong>Requested By:</strong> {req.requesterId.fullName}
                </p>
                {req.notes && (
                  <p>
                    <strong>Notes:</strong> {req.notes}
                  </p>
                )}
              </div>
              <div className="request-card-footer">
                <small>
                  Posted on: {new Date(req.createdAt).toLocaleDateString()}
                </small>
                {user &&
                  user._id !== req.requesterId._id &&
                  !req.applicants?.includes(user._id) && (
                    <button
                      className="btn primary"
                      onClick={() => handleApply(req._id)}
                    >
                      Apply
                    </button>
                  )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewRequestsPage;
