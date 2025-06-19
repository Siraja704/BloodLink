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
          <li key={a._id}>
            {new Date(a.appointmentDate).toLocaleDateString()}{" "}
            {a.appointmentTime} at {a.hospital} ({a.location}) - {a.bloodType}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ScheduleDonationPage;
