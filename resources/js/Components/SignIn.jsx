import React, { useState } from 'react';
import Lottie from 'lottie-react';
import signIn from '../animations/signIn.json'; // change path & name
import './SignIn.css';
import LottieAnimation from './LottieAnimation';
function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    // Example POST request to register endpoint
    fetch('http://localhost:8000/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.message === 'Registration successful') {
          setMessage('Welcome!');
        } else {
          setMessage(data.message || 'Registration failed');
        }
      })
      .catch(() => setMessage('Error connecting to server'));
  };

  return (
    <div className="signin-container">
      <div className="animation-container">
        <LottieAnimation animationData={signIn}  />
      </div>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Re-type Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit">Sign Up</button>

          <button type="button" className="google-btn">
            <img src='./google-logo.png' alt="Google Logo" />
            Register using Google
          </button>

          <p><a href="/signin" style={{ color: 'var(--yellow)' }}>Already have an account? </a></p>
          <p>{message}</p>
        </form>
      </div>
    </div>
  );
}

export default SignUp;