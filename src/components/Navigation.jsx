import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
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
        <Link to="/donor" className="nav-link">
          Donor
        </Link>
        <Link to="/user" className="nav-link">
          User
        </Link>
        <Link to="/about" className="nav-link">
          About
        </Link>
        <Link to="/contact" className="nav-link">
          Contact
        </Link>
      </div>

      <div className={`nav-auth ${isMenuOpen ? "active" : ""}`}>
        <button className="btn login">Login</button>
        <button className="btn register">Register</button>
      </div>
    </nav>
  );
};

export default Navigation;
