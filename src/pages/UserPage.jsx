import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";

const UserPage = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [donationHistory, setDonationHistory] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    fullName: "",
    location: "",
    phone: "",
    emergencyContact: { name: "", phone: "", relationship: "" },
    preferences: { notifications: true, emailUpdates: true },
    contactPublic: false,
    isPaidDonor: false,
    chargeAmount: 0,
    locationCoords: { lat: null, lng: null },
  });
  const [profileMsg, setProfileMsg] = useState("");
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

  useEffect(() => {
    if (user) {
      setProfileForm({
        fullName: user.fullName || "",
        location: user.location || "",
        phone: user.phone || "",
        emergencyContact: user.emergencyContact || {
          name: "",
          phone: "",
          relationship: "",
        },
        preferences: user.preferences || {
          notifications: true,
          emailUpdates: true,
        },
        contactPublic: user.contactPublic || false,
        isPaidDonor: user.isPaidDonor || false,
        chargeAmount: user.chargeAmount || 0,
        locationCoords: user.locationCoords || { lat: null, lng: null },
      });
    }
  }, [user]);

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

  const handleProfileChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith("emergencyContact.")) {
      const field = name.split(".")[1];
      setProfileForm((prev) => ({
        ...prev,
        emergencyContact: { ...prev.emergencyContact, [field]: value },
      }));
    } else if (name.startsWith("preferences.")) {
      const field = name.split(".")[1];
      setProfileForm((prev) => ({
        ...prev,
        preferences: { ...prev.preferences, [field]: checked },
      }));
    } else if (type === "checkbox") {
      setProfileForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setProfileForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleLocationUpdate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setProfileForm((prev) => ({
            ...prev,
            locationCoords: {
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
            },
          }));
          setProfileMsg("Location updated!");
        },
        (err) => {
          setProfileMsg("Failed to get location: " + err.message);
        }
      );
    } else {
      setProfileMsg("Geolocation is not supported by your browser.");
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileMsg("");
    try {
      const res = await fetch("http://localhost:3000/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(profileForm),
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        setProfileMsg("Profile updated successfully!");
        setEditingProfile(false);
      } else {
        setProfileMsg(data.message || "Failed to update profile");
      }
    } catch (err) {
      setProfileMsg("Server error");
    }
  };

  const DashboardTab = () => (
    <div className="dashboard-grid">
      <div className="dashboard-card stat-card welcome-card">
        <h3>Welcome back, {user?.fullName || "User"}!</h3>
        <p>Here's a summary of your activity and stats.</p>
      </div>

      <div className="dashboard-card stat-card">
        <span className="stat-icon">🩸</span>
        <div className="stat-info">
          <span className="stat-number">{user?.totalDonations || 0}</span>
          <span className="stat-label">Total Donations</span>
        </div>
      </div>

      <div className="dashboard-card stat-card">
        <span className="stat-icon">📅</span>
        <div className="stat-info">
          <span className="stat-number">{upcomingAppointments.length}</span>
          <span className="stat-label">Upcoming Appointments</span>
        </div>
      </div>

      <div className="dashboard-card stat-card">
        <span className="stat-icon">🅰️</span>
        <div className="stat-info">
          <span className="stat-number">{user?.bloodType || "N/A"}</span>
          <span className="stat-label">Blood Type</span>
        </div>
      </div>

      <div className="dashboard-card quick-actions-card">
        <h3>Quick Actions</h3>
        <div className="quick-actions">
          <button className="btn primary" onClick={() => navigate("/schedule")}>
            Schedule Donation
          </button>
          <button
            className="btn primary"
            onClick={() => navigate("/create-request")}
          >
            Create Request
          </button>
          <button
            className="btn secondary"
            onClick={() => navigate("/requests")}
          >
            View Requests
          </button>
          <button className="btn" onClick={() => setActiveTab("profile")}>
            Update Profile
          </button>
          <button className="btn" onClick={() => navigate("/history")}>
            View History
          </button>
        </div>
      </div>
    </div>
  );

  const ProfileTab = () => (
    <div className="profile-section">
      <div className="profile-card">
        <h3>Personal Information</h3>
        {!editingProfile ? (
          <>
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
              <div className="info-group">
                <label>Emergency Contact</label>
                <p>
                  {user?.emergencyContact?.name || "-"}{" "}
                  {user?.emergencyContact?.phone
                    ? `(${user.emergencyContact.phone})`
                    : ""}{" "}
                  {user?.emergencyContact?.relationship || ""}
                </p>
              </div>
              <div className="info-group">
                <label>Preferences</label>
                <p>
                  Notifications:{" "}
                  {user?.preferences?.notifications ? "On" : "Off"}, Email
                  Updates: {user?.preferences?.emailUpdates ? "On" : "Off"}
                </p>
              </div>
              <div className="info-group">
                <label>Contact Public</label>
                <p>{user?.contactPublic ? "Yes" : "No"}</p>
              </div>
              <div className="info-group">
                <label>Donor Type</label>
                <p>
                  {user?.isPaidDonor ? `Paid ($${user.chargeAmount})` : "Free"}
                </p>
              </div>
              <div className="info-group">
                <label>Real-Time Location</label>
                <p>
                  {user?.locationCoords?.lat && user?.locationCoords?.lng
                    ? `${user.locationCoords.lat.toFixed(
                        5
                      )}, ${user.locationCoords.lng.toFixed(5)}`
                    : "Not set"}
                </p>
              </div>
              <div className="info-group">
                <label>Availability</label>
                <p>
                  {user?.isDonor
                    ? user?.isAvailable
                      ? "Available to Donate"
                      : "Not Available"
                    : "N/A (Not a donor)"}
                </p>
              </div>
            </div>
            <button
              className="btn primary"
              onClick={() => setEditingProfile(true)}
            >
              Edit Profile
            </button>
            {profileMsg && (
              <div
                style={{
                  marginTop: "1rem",
                  color: profileMsg.includes("success") ? "green" : "red",
                }}
              >
                {profileMsg}
              </div>
            )}
          </>
        ) : (
          <form
            className="profile-edit-form"
            onSubmit={handleProfileSubmit}
            style={{ marginTop: "1rem" }}
          >
            <div className="form-group">
              <label>Full Name</label>
              <input
                name="fullName"
                value={profileForm.fullName}
                onChange={handleProfileChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Location</label>
              <input
                name="location"
                value={profileForm.location}
                onChange={handleProfileChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input
                name="phone"
                value={profileForm.phone}
                onChange={handleProfileChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Emergency Contact Name</label>
              <input
                name="emergencyContact.name"
                value={profileForm.emergencyContact?.name || ""}
                onChange={handleProfileChange}
              />
            </div>
            <div className="form-group">
              <label>Emergency Contact Phone</label>
              <input
                name="emergencyContact.phone"
                value={profileForm.emergencyContact?.phone || ""}
                onChange={handleProfileChange}
              />
            </div>
            <div className="form-group">
              <label>Emergency Contact Relationship</label>
              <input
                name="emergencyContact.relationship"
                value={profileForm.emergencyContact?.relationship || ""}
                onChange={handleProfileChange}
              />
            </div>
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  name="preferences.notifications"
                  checked={!!profileForm.preferences?.notifications}
                  onChange={handleProfileChange}
                />{" "}
                Notifications
              </label>
              <label style={{ marginLeft: "1rem" }}>
                <input
                  type="checkbox"
                  name="preferences.emailUpdates"
                  checked={!!profileForm.preferences?.emailUpdates}
                  onChange={handleProfileChange}
                />{" "}
                Email Updates
              </label>
            </div>
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  name="contactPublic"
                  checked={!!profileForm.contactPublic}
                  onChange={handleProfileChange}
                />
                Make my contact info public (allow others to contact me)
              </label>
            </div>
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  name="isPaidDonor"
                  checked={!!profileForm.isPaidDonor}
                  onChange={handleProfileChange}
                />
                I want to charge for donation
              </label>
              {profileForm.isPaidDonor && (
                <input
                  type="number"
                  name="chargeAmount"
                  min="0"
                  value={profileForm.chargeAmount}
                  onChange={handleProfileChange}
                  placeholder="Charge Amount ($)"
                  style={{ marginTop: "0.5rem" }}
                />
              )}
            </div>
            <div className="form-group">
              <label>Real-Time Location</label>
              <div
                style={{ display: "flex", alignItems: "center", gap: "1rem" }}
              >
                <span>
                  {profileForm.locationCoords.lat &&
                  profileForm.locationCoords.lng
                    ? `${profileForm.locationCoords.lat.toFixed(
                        5
                      )}, ${profileForm.locationCoords.lng.toFixed(5)}`
                    : "Not set"}
                </span>
                <button
                  type="button"
                  className="btn secondary"
                  onClick={handleLocationUpdate}
                >
                  Update Location
                </button>
              </div>
            </div>
            {user?.isDonor && (
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    name="isAvailable"
                    checked={user?.isAvailable}
                    onChange={async (e) => {
                      const newValue = e.target.checked;
                      try {
                        const res = await fetch(
                          "http://localhost:3000/api/auth/availability",
                          {
                            method: "PUT",
                            headers: {
                              "Content-Type": "application/json",
                              Authorization: `Bearer ${localStorage.getItem(
                                "token"
                              )}`,
                            },
                            body: JSON.stringify({ isAvailable: newValue }),
                          }
                        );
                        const data = await res.json();
                        if (data.success) {
                          setUser(data.user);
                          localStorage.setItem(
                            "user",
                            JSON.stringify(data.user)
                          );
                          setProfileMsg("Availability updated!");
                        } else {
                          setProfileMsg(
                            data.message || "Failed to update availability"
                          );
                        }
                      } catch (err) {
                        setProfileMsg("Server error");
                      }
                    }}
                  />
                  Available to Donate
                </label>
              </div>
            )}
            <button className="btn primary" type="submit">
              Save
            </button>
            <button
              className="btn secondary"
              type="button"
              onClick={() => setEditingProfile(false)}
              style={{ marginLeft: "1rem" }}
            >
              Cancel
            </button>
            {profileMsg && (
              <div
                style={{
                  marginTop: "1rem",
                  color: profileMsg.includes("success") ? "green" : "red",
                }}
              >
                {profileMsg}
              </div>
            )}
          </form>
        )}
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
    return <Spinner />;
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
        <button
          className={`tab ${activeTab === "requests" ? "active" : ""}`}
          onClick={() => navigate("/requests")}
        >
          Blood Requests
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
