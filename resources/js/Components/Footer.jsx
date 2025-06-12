import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>About UniCity</h3>
          <p>Helping students find their perfect university match through comprehensive information and easy-to-use tools.</p>
          <div className="social-links">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <i className="fab fa-facebook"></i>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <i className="fab fa-linkedin"></i>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <i className="fab fa-instagram"></i>
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/universities">Universities</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Resources</h3>
          <ul>
            <li><Link to="/blog">Blog</Link></li>
            <li><Link to="/faq">FAQ</Link></li>
            <li><Link to="/privacy-policy">Privacy Policy</Link></li>
            <li><Link to="/terms">Terms of Service</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Contact Us</h3>
          <ul className="contact-info">
            <li>
              <i className="fas fa-map-marker-alt"></i>
              Beirut, Lebanon
            </li>
            <li>
              <i className="fas fa-phone"></i>
              +961 1 234 567
            </li>
            <li>
              <i className="fas fa-envelope"></i>
              info@unicity.com
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} UniCity. All rights reserved.</p>
        <div className="footer-bottom-links">
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/terms">Terms of Service</Link>
          <Link to="/sitemap">Sitemap</Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
