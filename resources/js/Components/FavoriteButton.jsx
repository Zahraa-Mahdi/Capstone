import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import './FavoriteButton.css';

const FavoriteButton = ({ universityId, isAuthenticated }) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated && universityId) {
            checkFavoriteStatus();
        } else {
            setIsLoading(false);
        }
    }, [universityId, isAuthenticated]);

    const checkFavoriteStatus = async () => {
        try {
            const response = await api.get(`/favorites/check/${universityId}`);
            setIsFavorite(response.data.is_favorite);
        } catch (error) {
            console.error('Error checking favorite status:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleFavorite = async () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        try {
            setIsLoading(true);
            const response = await api.post(`/favorites/toggle/${universityId}`);
            setIsFavorite(response.data.is_favorite);
        } catch (error) {
            console.error('Error toggling favorite:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <div className="favorite-button loading">
            <svg className="favorite-icon animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
        </div>;
    }

    return (
        <button
            onClick={toggleFavorite}
            className={`favorite-button ${isFavorite ? 'active' : ''}`}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="favorite-icon"
                fill={isFavorite ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth="1.5"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                />
            </svg>
        </button>
    );
};

export default FavoriteButton; 