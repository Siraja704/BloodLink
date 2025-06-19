import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const UserPage = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [donationHistory, setDonationHistory] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const API_BASE = "http://localhost:3000/api";

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  const fetchUserData = async () => {
    try {
      const response = await fetch(`${API_BASE}/auth/profile`, {
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        throw new Error("Failed to fetch user data");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  const fetchDonationHistory = async () => {
    try {
      const response = await fetch(`${API_BASE}/donations/history`, {
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        const data = await response.json();
        setDonationHistory(data.donations || []);
      }
    } catch (error) {
      console.error("Error fetching donation history:", error);
    }
  };

  const fetchUpcomingAppointments = async () => {
    try {
      const response = await fetch(`${API_BASE}/appointments/upcoming`, {
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        const data = await response.json();
        setUpcomingAppointments(data.appointments || []);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      navigate("/login");
      return;
    }

    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchUserData(),
        fetchDonationHistory(),
        fetchUpcomingAppointments(),
      ]);
      setLoading(false);
    };

    loadData();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: "POST",
        headers: getAuthHeaders(),
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  const DashboardTab = () => (
    <div className="dashboard-grid">
      <div className="dashboard-card">
        <h3>Welcome back, {user?.fullName || "User"}!</h3>
        <div className="user-stats">
          <div className="stat-item">
            <span className="stat-number">{user?.totalDonations || 0}</span>
            <span className="stat-label">Total Donations</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{upcomingAppointments.length}</span>
            <span className="stat-label">Upcoming Appointments</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{user?.bloodType || "N/A"}</span>
            <span className="stat-label">Blood Type</span>
          </div>
        </div>
      </div>

      <div className="dashboard-card">
        <h3>Quick Actions</h3>
        <div className="quick-actions">
          <button className="btn primary">Schedule Donation</button>
          <button className="btn secondary">Find Donors</button>
          <button className="btn secondary">Update Profile</button>
          <button className="btn secondary">View History</button>
        </div>
      </div>

      <div className="dashboard-card">
        <h3>Recent Activity</h3>
        <div className="activity-list">
          {donationHistory.length > 0 ? (
            <div className="activity-item">
              <span className="activity-icon">🩸</span>
              <div className="activity-content">
                <p>Blood donation completed at {donationHistory[0].hospital}</p>
                <small>
                  {new Date(
                    donationHistory[0].donationDate
                  ).toLocaleDateString()}
                </small>
              </div>
            </div>
          ) : (
            <p>No recent donations</p>
          )}
          {upcomingAppointments.length > 0 && (
            <div className="activity-item">
              <span className="activity-icon">📅</span>
              <div className="activity-content">
                <p>
                  Appointment scheduled for{" "}
                  {new Date(
                    upcomingAppointments[0].appointmentDate
                  ).toLocaleDateString()}
                </p>
                <small>{upcomingAppointments[0].appointmentTime}</small>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const ProfileTab = () => (
    <div className="profile-section">
      <div className="profile-card">
        <h3>Personal Information</h3>
        <div className="profile-info">
          <div className="info-group">
            <label>Full Name</label>
            <p>{user?.fullName || "Not provided"}</p>
          </div>
          <div className="info-group">
            <label>Email</label>
            <p>{user?.email || "Not provided"}</p>
          </div>
          <div className="info-group">
            <label>Blood Type</label>
            <p>{user?.bloodType || "Not specified"}</p>
          </div>
          <div className="info-group">
            <label>Location</label>
            <p>{user?.location || "Not provided"}</p>
          </div>
          <div className="info-group">
            <label>Phone</label>
            <p>{user?.phone || "Not provided"}</p>
          </div>
          <div className="info-group">
            <label>Total Donations</label>
            <p>{user?.totalDonations || 0}</p>
          </div>
          <div className="info-group">
            <label>Last Donation</label>
            <p>
              {user?.lastDonationDate
                ? new Date(user.lastDonationDate).toLocaleDateString()
                : "Never"}
            </p>
          </div>
        </div>
        <button className="btn primary">Edit Profile</button>
      </div>
    </div>
  );

  const HistoryTab = () => (
    <div className="history-section">
      <h3>Donation History</h3>
      <div className="history-list">
        {donationHistory.length > 0 ? (
          donationHistory.map((donation) => (
            <div key={donation._id} className="history-item">
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
        ) : (
          <p>No donation history available</p>
        )}
      </div>
    </div>
  );

  const AppointmentsTab = () => (
    <div className="appointments-section">
      <h3>Upcoming Appointments</h3>
      <div className="appointments-list">
        {upcomingAppointments.length > 0 ? (
          upcomingAppointments.map((appointment) => (
            <div key={appointment._id} className="appointment-item">
              <div className="appointment-date">
                <span className="date">
                  {new Date(appointment.appointmentDate).toLocaleDateString()}
                </span>
                <span className="time">{appointment.appointmentTime}</span>
              </div>
              <div className="appointment-details">
                <p>
                  <strong>Type:</strong> {appointment.appointmentType}
                </p>
                <p>
                  <strong>Blood Type:</strong> {appointment.bloodType}
                </p>
                <p>
                  <strong>Location:</strong> {appointment.location}
                </p>
                <p>
                  <strong>Hospital:</strong> {appointment.hospital}
                </p>
              </div>
              <div className="appointment-actions">
                <button className="btn secondary">Reschedule</button>
                <button className="btn danger">Cancel</button>
              </div>
            </div>
          ))
        ) : (
          <p>No upcoming appointments</p>
        )}
      </div>
    </div>
  );

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>BloodLink Dashboard</h1>
        <div className="user-menu">
          <span>Welcome, {user.fullName}</span>
          <button onClick={handleLogout} className="btn logout">
            Logout
          </button>
        </div>
      </div>

      <div className="dashboard-tabs">
        <button
          className={`tab ${activeTab === "dashboard" ? "active" : ""}`}
          onClick={() => setActiveTab("dashboard")}
        >
          Dashboard
        </button>
        <button
          className={`tab ${activeTab === "profile" ? "active" : ""}`}
          onClick={() => setActiveTab("profile")}
        >
          Profile
        </button>
        <button
          className={`tab ${activeTab === "history" ? "active" : ""}`}
          onClick={() => setActiveTab("history")}
        >
          Donation History
        </button>
        <button
          className={`tab ${activeTab === "appointments" ? "active" : ""}`}
          onClick={() => setActiveTab("appointments")}
        >
          Appointments
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === "dashboard" && <DashboardTab />}
        {activeTab === "profile" && <ProfileTab />}
        {activeTab === "history" && <HistoryTab />}
        {activeTab === "appointments" && <AppointmentsTab />}
      </div>
    </div>
  );
};

export default UserPage;
