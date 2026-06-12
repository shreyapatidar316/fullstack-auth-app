import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name = '') =>
    name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      {/* Brand */}
      <Link to={isAuthenticated ? '/dashboard' : '/'} className="navbar-brand">
        <span className="brand-icon" aria-hidden="true">🔐</span>
        <span>AuthApp</span>
      </Link>

      <div className="navbar-spacer" />

      {/* Right side */}
      <div className="navbar-actions">
        {isAuthenticated && user ? (
          <>
            <div className="navbar-user">
              <div className="navbar-avatar" aria-label={`User: ${user.name}`}>
                {getInitials(user.name)}
              </div>
              <span>{user.name}</span>
            </div>
            <button
              id="logout-btn"
              className="btn-logout"
              onClick={handleLogout}
              aria-label="Sign out"
            >
              Sign Out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.875rem' }}>
              Login
            </Link>
            <Link to="/signup" className="btn btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.875rem', width: 'auto' }}>
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
