import React, { useState, useEffect } from "react";
import Spinner from "../components/Spinner";
import BloodTypeChart from "../components/charts/BloodTypeChart";

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("stats");
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editingRequest, setEditingRequest] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      try {
        // Fetch stats, users, and requests in parallel
        const [statsRes, usersRes, requestsRes] = await Promise.all([
          fetch("http://localhost:3000/api/admin/stats", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:3000/api/admin/users", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:3000/api/admin/requests", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const statsData = await statsRes.json();
        if (statsData.success) {
          setStats(statsData.stats);
        }

        const usersData = await usersRes.json();
        if (usersData.success) {
          setUsers(usersData.users);
        }

        const requestsData = await requestsRes.json();
        if (requestsData.success) {
          setRequests(requestsData.requests);
        }
      } catch (err) {
        console.error("Failed to fetch admin data", err);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleEditClick = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleUserUpdate = async (updatedUser) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `http://localhost:3000/api/admin/users/${updatedUser._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            role: updatedUser.role,
            isAvailable: updatedUser.isAvailable,
          }),
        }
      );
      const data = await res.json();
      if (data.success) {
        setUsers(users.map((u) => (u._id === updatedUser._id ? data.user : u)));
        handleModalClose();
      } else {
        alert("Failed to update user.");
      }
    } catch (err) {
      alert("An error occurred.");
    }
  };

  const handleRequestEditClick = (request) => {
    setEditingRequest(request);
  };

  const handleRequestModalClose = () => {
    setEditingRequest(null);
  };

  const handleRequestUpdate = async (updatedRequest) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `http://localhost:3000/api/admin/requests/${updatedRequest._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: updatedRequest.status }),
        }
      );
      const data = await res.json();
      if (data.success) {
        setRequests(
          requests.map((r) => (r._id === updatedRequest._id ? data.request : r))
        );
        handleRequestModalClose();
      } else {
        alert("Failed to update request.");
      }
    } catch (err) {
      alert("An error occurred.");
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <Spinner />;
  }

  const StatsTab = () => (
    <>
      {stats ? (
        <div className="admin-stats-grid">
          <div className="stat-card">
            <h3>Total Users</h3>
            <p className="stat-number">{stats.totalUsers}</p>
          </div>
          <div className="stat-card">
            <h3>Total Donors</h3>
            <p className="stat-number">{stats.totalDonors}</p>
          </div>
          <div className="stat-card">
            <h3>Total Donations</h3>
            <p className="stat-number">{stats.totalDonations}</p>
          </div>
          <div className="stat-card">
            <h3>Total Requests</h3>
            <p className="stat-number">{stats.totalRequests}</p>
          </div>
          <div className="stat-card">
            <h3>Open Requests</h3>
            <p className="stat-number">{stats.openRequests}</p>
          </div>
        </div>
      ) : (
        <p>Could not load statistics.</p>
      )}
      <div className="charts-container">
        <div className="chart-card">
          <BloodTypeChart users={users} />
        </div>
      </div>
    </>
  );

  const UsersTab = () => (
    <div className="admin-user-management">
      <input
        type="text"
        placeholder="Search users by name or email..."
        className="search-bar"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="user-table-container">
        <table className="user-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Blood Type</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id}>
                <td>{user.fullName}</td>
                <td>{user.email}</td>
                <td>{user.bloodType}</td>
                <td>{user.role}</td>
                <td>{user.isAvailable ? "Available" : "Unavailable"}</td>
                <td>
                  <button
                    className="btn btn-sm"
                    onClick={() => handleEditClick(user)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const RequestsTab = () => (
    <div className="admin-user-management">
      <div className="user-table-container">
        <table className="user-table">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Blood Type</th>
              <th>Hospital</th>
              <th>Status</th>
              <th>Requested On</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request._id}>
                <td>{request.patientName}</td>
                <td>{request.bloodType}</td>
                <td>{request.hospitalName}</td>
                <td>{request.status}</td>
                <td>{new Date(request.createdAt).toLocaleDateString()}</td>
                <td>
                  <button
                    className="btn btn-sm"
                    onClick={() => handleRequestEditClick(request)}
                  >
                    Change Status
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="page-container">
      <h1>Admin Dashboard</h1>
      <div className="dashboard-tabs">
        <button
          className={`tab ${activeTab === "stats" ? "active" : ""}`}
          onClick={() => setActiveTab("stats")}
        >
          Dashboard Stats
        </button>
        <button
          className={`tab ${activeTab === "users" ? "active" : ""}`}
          onClick={() => setActiveTab("users")}
        >
          User Management
        </button>
        <button
          className={`tab ${activeTab === "requests" ? "active" : ""}`}
          onClick={() => setActiveTab("requests")}
        >
          Request Management
        </button>
      </div>
      <div className="dashboard-content">
        {activeTab === "stats" && <StatsTab />}
        {activeTab === "users" && <UsersTab />}
        {activeTab === "requests" && <RequestsTab />}
      </div>
      {isModalOpen && (
        <EditUserModal
          user={editingUser}
          onClose={handleModalClose}
          onSave={handleUserUpdate}
        />
      )}
      {editingRequest && (
        <EditRequestModal
          request={editingRequest}
          onClose={handleRequestModalClose}
          onSave={handleRequestUpdate}
        />
      )}
    </div>
  );
};

const EditUserModal = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState({ ...user });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Edit User: {user.fullName}</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave(formData);
          }}
        >
          <div className="form-group">
            <label>Role</label>
            <select name="role" value={formData.role} onChange={handleChange}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="isAvailable"
                checked={formData.isAvailable}
                onChange={handleChange}
              />
              Available to Donate
            </label>
          </div>
          <div className="modal-actions">
            <button type="submit" className="btn primary">
              Save Changes
            </button>
            <button type="button" className="btn secondary" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const EditRequestModal = ({ request, onClose, onSave }) => {
  const [status, setStatus] = useState(request.status);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Edit Request Status</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave({ ...request, status });
          }}
        >
          <div className="form-group">
            <label>Status</label>
            <select
              name="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Open">Open</option>
              <option value="Fulfilled">Fulfilled</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
          <div className="modal-actions">
            <button type="submit" className="btn primary">
              Save Status
            </button>
            <button type="button" className="btn secondary" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
