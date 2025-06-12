import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Dropdown toggles
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showUniversitiesMenu, setShowUniversitiesMenu] = useState(false);

  const profileMenuRef = useRef(null);
  const universitiesMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Close dropdowns on outside click
  const handleClickOutside = (event) => {
    if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
      setShowProfileMenu(false);
    }
    if (universitiesMenuRef.current && !universitiesMenuRef.current.contains(event.target)) {
      setShowUniversitiesMenu(false);
    }
    if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
      setIsMobileMenuOpen(false);
    }
  };

  React.useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    setShowProfileMenu(false);
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <Link to="/" className="navbar-logo">UniCity</Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <div className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>

        {/* Desktop and Mobile Menu */}
        <div className={`nav-menu ${isMobileMenuOpen ? 'active' : ''}`} ref={mobileMenuRef}>
          <ul className="nav-links">
            <li><Link to="/" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Home</Link></li>
            <li><Link to="/about" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>About</Link></li>

            {/* Universities Dropdown */}
            <li className="profile-menu-container" ref={universitiesMenuRef}>
              <button 
                type="button"
                className="profile-button" 
                onClick={() => setShowUniversitiesMenu(!showUniversitiesMenu)}
                aria-expanded={showUniversitiesMenu}
                aria-haspopup="true"
              >
                Universities
                <svg
                  className={`profile-arrow ${showUniversitiesMenu ? 'rotate' : ''}`}
                  width="12"
                  height="8"
                  viewBox="0 0 12 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>

              {showUniversitiesMenu && (
                <ul className="universities-dropdown">
                  <li><Link to="/universities" className="dropdown-item" onClick={() => setIsMobileMenuOpen(false)}>Explore Universities</Link></li>
                  <li><Link to="/compare" className="dropdown-item" onClick={() => setIsMobileMenuOpen(false)}>Compare Universities</Link></li>
                </ul>
              )}
            </li>

            {/* Authenticated User Profile Menu */}
            {isAuthenticated ? (
              <li className="profile-menu-container" ref={profileMenuRef}>
                <button
                  type="button"
                  className="profile-button"
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  aria-expanded={showProfileMenu}
                  aria-haspopup="true"
                >
                  <span>{user?.name}</span>
                  <svg
                    className={`profile-arrow ${showProfileMenu ? 'rotate' : ''}`}
                    width="12"
                    height="8"
                    viewBox="0 0 12 8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>

                {showProfileMenu && (
                  <ul className="profile-dropdown">
                    <li><Link to="/profile" className="dropdown-item" onClick={() => setIsMobileMenuOpen(false)}>Profile</Link></li>
                    <li>
                      <button 
                        onClick={() => {
                          handleLogout();
                          setIsMobileMenuOpen(false);
                        }} 
                        className="dropdown-item" 
                        type="button"
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                )}
              </li>
            ) : (
              <li><Link to="/register" className="register-button" onClick={() => setIsMobileMenuOpen(false)}>Register</Link></li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
