import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/" className="brand-link">
            <img 
              src="/Speed-Tech-Motoring-Website-Logo-White-BG.png.webp" 
              alt="S&T Motoring Logo" 
              className="logo"
            />
            S&T Motoring
          </Link>
        </div>
        <div className="navbar-links">
          <Link to="/" className="nav-link">
            Customers
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;