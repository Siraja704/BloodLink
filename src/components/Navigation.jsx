import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const profileRef = useRef();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    // Close profile dropdown on outside click
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/" className="nav-link">
          <h1>BloodDonate</h1>
        </Link>
      </div>

      <button className="mobile-menu-btn" onClick={toggleMenu}>
        <span className={`hamburger ${isMenuOpen ? "open" : ""}`}></span>
      </button>

      <div className={`nav-links ${isMenuOpen ? "active" : ""}`}>
        <Link to="/" className="nav-link">
          Home
        </Link>
        <Link to="/user" className="nav-link">
          Find Doners
        </Link>
        <Link to="/about" className="nav-link">
          About
        </Link>
        <Link to="/contact" className="nav-link">
          Contact
        </Link>
        <li>
          <Link to="/requests">Blood Requests</Link>
        </li>
      </div>

      <div className={`nav-auth ${isMenuOpen ? "active" : ""}`}>
        {!user ? (
          <>
            <Link to="/login" className="btn login">
              Login
            </Link>
            <Link to="/register" className="btn register">
              Register
            </Link>
          </>
        ) : (
          <div className="profile-menu-wrapper" ref={profileRef}>
            <button
              className="profile-avatar-btn"
              onClick={() => setIsProfileOpen((open) => !open)}
              aria-label="Profile menu"
            >
              {/* Avatar icon or user image */}
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt="Profile"
                  className="profile-avatar"
                />
              ) : (
                <span className="profile-avatar">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="16" cy="16" r="16" fill="#e63946" />
                    <circle cx="16" cy="13" r="6" fill="#fff" />
                    <ellipse cx="16" cy="24" rx="8" ry="5" fill="#fff" />
                  </svg>
                </span>
              )}
            </button>
            {isProfileOpen && (
              <div className="profile-dropdown">
                <div className="profile-dropdown-header">
                  <span className="profile-name">
                    {user.fullName || "Profile"}
                  </span>
                  <span className="profile-email">{user.email}</span>
                </div>
                <Link
                  to="/user"
                  className="dropdown-item"
                  onClick={() => setIsProfileOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/schedule"
                  className="dropdown-item"
                  onClick={() => setIsProfileOpen(false)}
                >
                  Schedule Donation
                </Link>
                <Link
                  to="/find-donor"
                  className="dropdown-item"
                  onClick={() => setIsProfileOpen(false)}
                >
                  Find Donor
                </Link>
                <Link
                  to="/history"
                  className="dropdown-item"
                  onClick={() => setIsProfileOpen(false)}
                >
                  Donation History
                </Link>
                <Link
                  to="/settings"
                  className="dropdown-item"
                  onClick={() => setIsProfileOpen(false)}
                >
                  Settings
                </Link>
                <button className="dropdown-item logout" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
