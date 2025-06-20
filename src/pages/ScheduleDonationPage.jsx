import React, { useState, useEffect } from "react";

const ScheduleDonationPage = () => {
  const [form, setForm] = useState({
    appointmentDate: "",
    appointmentTime: "",
    location: "",
    hospital: "",
    bloodType: "A+",
    notes: "",
  });
  const [message, setMessage] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [user, setUser] = useState(null);

  const API_BASE = "http://localhost:3000/api";

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  const fetchAppointments = async () => {
    try {
      const res = await fetch(`${API_BASE}/appointments/upcoming`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setAppointments(data.appointments || []);
      }
    } catch (err) {
      // ignore
    }
  };

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) setUser(JSON.parse(userData));
    fetchAppointments();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await fetch(`${API_BASE}/appointments`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setMessage("Appointment scheduled successfully!");
        setForm({
          appointmentDate: "",
          appointmentTime: "",
          location: "",
          hospital: "",
          bloodType: "A+",
          notes: "",
        });
        fetchAppointments();
      } else {
        setMessage(data.message || "Failed to schedule appointment");
      }
    } catch (err) {
      setMessage("Server error");
    }
  };

  const handleComplete = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/appointments/${id}/complete`, {
        method: "PATCH",
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (data.success) {
        fetchAppointments();
      } else {
        alert(data.message || "Failed to mark as completed");
      }
    } catch (err) {
      alert("Server error");
    }
  };

  return (
    <div className="page-container">
      <h1>Schedule Donation</h1>
      <form className="donor-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            name="appointmentDate"
            value={form.appointmentDate}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Time</label>
          <input
            type="time"
            name="appointmentTime"
            value={form.appointmentTime}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Location</label>
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Hospital</label>
          <input
            type="text"
            name="hospital"
            value={form.hospital}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Blood Type</label>
          <select
            name="bloodType"
            value={form.bloodType}
            onChange={handleChange}
            required
          >
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
        </div>
        <div className="form-group">
          <label>Notes</label>
          <textarea name="notes" value={form.notes} onChange={handleChange} />
        </div>
        <button type="submit" className="btn primary">
          Schedule
        </button>
      </form>
      {message && (
        <div
          style={{
            marginTop: "1rem",
            color: message.includes("success") ? "green" : "red",
          }}
        >
          {message}
        </div>
      )}
      <h2 style={{ marginTop: "2rem" }}>Upcoming Appointments</h2>
      <ul>
        {appointments.map((a) => (
          <li key={a._id} style={{ marginBottom: "1.5rem" }}>
            <div>
              <strong>Date:</strong>{" "}
              {new Date(a.appointmentDate).toLocaleDateString()}{" "}
              {a.appointmentTime}
              <br />
              <strong>Hospital:</strong> {a.hospital} <br />
              <strong>Address:</strong> {a.location} <br />
              <strong>Blood Type:</strong> {a.bloodType} <br />
              <strong>Status:</strong> {a.status} <br />
              {a.donorId && user && a.donorId._id !== user._id && (
                <div>
                  <strong>Donor:</strong> {a.donorId.fullName} (
                  {a.donorId.phone})
                </div>
              )}
              {a.requesterId && user && a.requesterId._id !== user._id && (
                <div>
                  <strong>Requester:</strong> {a.requesterId.fullName} (
                  {a.requesterId.phone})
                </div>
              )}
              {a.status !== "Completed" && a.status !== "Cancelled" && (
                <button
                  className="btn primary"
                  onClick={() => handleComplete(a._id)}
                  style={{ marginTop: "0.5rem" }}
                >
                  Mark as Completed
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ScheduleDonationPage;
