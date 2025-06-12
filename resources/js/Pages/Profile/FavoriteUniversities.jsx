import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FavoriteButton from '../../Components/FavoriteButton';
import './FavoriteUniversities.css';
import AOS from 'aos';
import 'aos/dist/aos.css';

const FavoriteUniversities = ({ isAuthenticated }) => {
    const navigate = useNavigate();
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: true,
            offset: 100,
        });

        fetchFavorites();
    }, []);

    const fetchFavorites = async () => {
        try {
            const response = await fetch('/api/favorites', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            
            // Ensure we're setting an array
            if (data && data.data) {
                setFavorites(Array.isArray(data.data) ? data.data : []);
            } else {
                setFavorites([]);
            }
            setLoading(false);
        } catch (err) {
            console.error('Error fetching favorites:', err);
            setError('Failed to fetch favorites');
            setFavorites([]);
            setLoading(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="favorites-container">
                <h2 className="title" data-aos="fade-down">Favorite Universities</h2>
                <p className="no-results" data-aos="fade-up">Please log in to view your favorite universities.</p>
                <Link to="/login" className="explore-link">
                    Log In
                </Link>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="favorites-container">
                <h2 className="title" data-aos="fade-down">Favorite Universities</h2>
                <div className="loading">Loading your favorite universities...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="favorites-container">
                <h2 className="title" data-aos="fade-down">Favorite Universities</h2>
                <div className="error">{error}</div>
            </div>
        );
    }

    if (!favorites || favorites.length === 0) {
        return (
            <div className="favorites-container">
                <h2 className="title" data-aos="fade-down">Favorite Universities</h2>
                <p className="no-results" data-aos="fade-up">You haven't added any universities to your favorites yet.</p>
                <Link to="/universities" className="explore-link">
                    Explore Universities
                </Link>
            </div>
        );
    }

    return (
        <div className="favorites-container">
            <h2 className="title" data-aos="fade-down">Favorite Universities</h2>
            <div className="university-grid">
                {favorites.map((university, index) => (
                    <div 
                        className="university-card" 
                        key={university.code}
                        data-aos="fade-up"
                        data-aos-delay={200 + (index % 3) * 100}
                    >
                        <img
                            src={`/images/universities/${university.image}`}
                            alt={`${university.name} logo`}
                            className="university-image"
                            loading="lazy"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/images/university-default.png';
                            }}
                        />
                        <h2 className="university-name">{university.name}</h2>

                        <div className="university-info">
                            {university.location && (
                                <div className="location">
                                    <i className="fas fa-map-marker-alt"></i>
                                    <span>{university.location.address}</span>
                                </div>
                            )}

                            {university.website && (
                                <div className="website">
                                    <i className="fas fa-globe"></i>
                                    <a href={university.website} target="_blank" rel="noopener noreferrer">
                                        {university.website}
                                    </a>
                                </div>
                            )}

                            <div className="faculties">
                                <strong>Faculties:</strong>
                                <span>{university.faculties?.length || 0}</span>
                            </div>

                            <div className="majors">
                                <strong>Total Programs:</strong>
                                <span>
                                    {university.faculties?.reduce((total, faculty) => total + (faculty.majors?.length || 0), 0) || 0}
                                </span>
                            </div>
                        </div>

                        <div className="card-buttons">
                            <button onClick={() => navigate(`/universities/${university.code}`)}>View Details</button>
                            <FavoriteButton 
                                universityId={university.code}
                                isAuthenticated={isAuthenticated}
                                onFavoriteChange={fetchFavorites}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FavoriteUniversities; 