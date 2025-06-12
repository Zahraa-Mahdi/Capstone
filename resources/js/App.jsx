import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './Pages/Home';
import About from './AboutUs';
import Footer from './components/Footer';
import Universities from './Pages/Universities';
import UniversityDetails from './Pages/UniversityDetails';
import CompareUniversities from './Pages/CompareUniversities';
import Profile from './Pages/Profile';
import React from 'react';
import Register from "./Pages/Auth/Register";
import Login from "./Pages/Auth/Login";
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

function AppContent() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/universities" element={<Universities />} />
        <Route path="/compare" element={<CompareUniversities />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/universities/:code" element={<UniversityDetails />} />
      </Routes>
      <Footer />
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
