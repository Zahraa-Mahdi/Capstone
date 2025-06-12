import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '@/axios';
import { useAuth } from '../../contexts/AuthContext';
import Lottie from 'lottie-react';
import signInAnimation from '../../animations/signIn.json';
import LottieAnimation from '../../components/LottieAnimation';
import './Auth.css';

export default function Register() {
  const { login, checkAuthStatus } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
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

    if (formData.password !== formData.password_confirmation) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('/register', formData);
      
      if (response.data.user && response.data.access_token) {
        // Store the token and user data
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('isAuthenticated', 'true');
        
        // Update axios default headers
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;
        
        // Update auth context
        await checkAuthStatus();
        
        // Navigate to home page
        navigate('/', { replace: true });
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="register-layout">
        <div className="auth-content">
          <div className="auth-form-section">
            <h1>Ready to start your success story?</h1>
            <p className="auth-subtitle">Sign up to our website and start exploring your university options today!</p>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="name">Full name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>

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
                  placeholder="Create a password"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password_confirmation">Confirm Password</label>
                <input
                  type="password"
                  id="password_confirmation"
                  name="password_confirmation"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  required
                />
              </div>

              <button type="submit" className="auth-button" disabled={loading}>
                {loading ? 'Creating account...' : 'Sign up'}
              </button>
            </form>
          </div>
          <div className="auth-image-section">
            <div className="lottie-container">
              <Lottie animationData={signInAnimation} loop={true} />
            </div>
            <p className="auth-redirect">
              Already have an account? <Link to="/login">Log in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
