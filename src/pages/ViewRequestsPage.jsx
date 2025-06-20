import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Spinner from "../components/Spinner";

const ViewRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

  if (loading) {
    return <Spinner />;
  }

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

      {requests.length === 0 ? (
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
                  <strong>Hospital:</strong> {req.hospitalName},{" "}
                  {req.hospitalAddress}
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
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewRequestsPage;
