import React, { useEffect } from 'react';
import { useAuth } from '@/Contexts/AuthContext';
import ReviewForm from '@/Components/ReviewForm';
import FavoriteUniversities from './Profile/FavoriteUniversities';
import './Profile/Profile.css';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    if (!isAuthenticated || !user) {
        return null;
    }

    return (
        <div className="profile-container">
            <div className="profile-header">
                <h1>My Profile</h1>
            </div>
            
            <div className="profile-content">
                <div className="user-info-section">
                    <h2 className="section-title">User Information</h2>
                    <div className="user-info">
                        <div className="info-item">
                            <span className="label">Name:</span>
                            <span className="value">{user.name}</span>
                        </div>
                        <div className="info-item">
                            <span className="label">Email:</span>
                            <span className="value">{user.email}</span>
                        </div>
                    </div>
                </div>

                <div className="review-section">
                    <h2 className="section-title">Share Your Experience</h2>
                    <ReviewForm />
                </div>

                <div className="favorites-section">
                    <h2 className="section-title">My Favorite Universities</h2>
                    <FavoriteUniversities />
                </div>
            </div>
        </div>
    );
};

export default Profile;