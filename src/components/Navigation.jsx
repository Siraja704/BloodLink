import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Handler for Donor link (redirect to register)
  const handleDonorClick = (e) => {
    e.preventDefault();
    navigate("/register");
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
      </div>

      <div className={`nav-auth ${isMenuOpen ? "active" : ""}`}>
        <Link to="/login" className="btn login">
          Login
        </Link>

        <Link to="/register" className="btn register">
          Register
        </Link>
      </div>
    </nav>
  );
};

export default Navigation;
