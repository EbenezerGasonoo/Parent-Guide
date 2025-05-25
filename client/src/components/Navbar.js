import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const isAdmin = localStorage.getItem('role') === 'admin';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Parent Guide</Link>
      </div>
      <div className="navbar-links">
        {token ? (
          <>
            {isAdmin ? (
              <Link to="/admin-dashboard" className="nav-link">Dashboard</Link>
            ) : (
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
            )}
            <button onClick={handleLogout} className="nav-link logout-button">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link">Register</Link>
            <Link to="/admin-login" className="nav-link">Admin Login</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 