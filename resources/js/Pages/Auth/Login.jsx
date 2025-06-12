import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Lottie from 'lottie-react';
import loginAnimation from '../../animations/login.json';
import LottieAnimation from '../../components/LottieAnimation';
import './Auth.css';

export default function Login() {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await login(formData);
      
      if (result.success) {
        navigate('/');
      } else {
        setError(result.error || 'Invalid login credentials');
      }
    } catch (err) {
      setError('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="login-layout">
        <div className="auth-content">
          <div className="auth-form-section">
            <h1>Welcome back!</h1>
            <p className="auth-subtitle">Log in to your account to continue your journey</p>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                />
              </div>

              <div className="form-group remember-forgot">
                <label className="checkbox-label">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>
                <Link to="/forgot-password" className="forgot-password">
                  Forgot password?
                </Link>
              </div>

              <button type="submit" className="auth-button" disabled={loading}>
                {loading ? 'Logging in...' : 'Log in'}
              </button>

              <p className="auth-redirect">
                Don't have an account? <Link to="/register">Sign up</Link>
              </p>
            </form>
          </div>
          <div className="auth-image-section">
            <div className="lottie-container">
              <Lottie animationData={loginAnimation} loop={true} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
