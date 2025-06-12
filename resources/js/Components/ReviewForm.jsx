import React, { useState } from 'react';
import axios from '@/axios';
import { useAuth } from '@/Contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Reviews.css';

const ReviewForm = ({ onReviewSubmitted }) => {
    const [newReview, setNewReview] = useState('');
    const [rating, setRating] = useState(5);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newReview.trim() || isSubmitting) return;

        setIsSubmitting(true);
        setError(null);

        try {
            const response = await axios.post('/reviews', {
                content: newReview,
                rating: rating
            });
            
            setNewReview('');
            setRating(5);
            
            // Call the callback with the new review
            if (onReviewSubmitted) {
                onReviewSubmitted(response.data);
            }

            // Navigate to the reviews section
            navigate('/about#reviews');
            
        } catch (error) {
            console.error('Error posting review:', error);
            if (error.response?.status === 401) {
                setError('Please log in to post a review.');
            } else {
                setError(error.response?.data?.message || 'Unable to post review. Please try again later.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!user) {
        return (
            <div className="review-login-prompt">
                <p>Please log in to share your experience.</p>
            </div>
        );
    }

    const renderStars = (rating) => {
        return [...Array(5)].map((_, index) => (
            <span 
                key={index} 
                className={`star ${index < rating ? 'filled' : ''}`}
            >
                ★
            </span>
        ));
    };

    return (
        <div className="review-form-container">
            <h3>Share Your Experience</h3>
            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}
            <form onSubmit={handleSubmit} className="review-form">
                <div className="rating-input">
                    <label>Rating:</label>
                    <div className="star-rating">
                        {[5, 4, 3, 2, 1].map((value) => (
                            <label key={value}>
                                <input
                                    type="radio"
                                    name="rating"
                                    value={value}
                                    checked={rating === value}
                                    onChange={(e) => setRating(Number(e.target.value))}
                                />
                                <span className={`star ${value <= rating ? 'filled' : ''}`}>★</span>
                            </label>
                        ))}
                    </div>
                </div>
                <textarea
                    value={newReview}
                    onChange={(e) => setNewReview(e.target.value)}
                    placeholder="Tell us about your experience..."
                    maxLength={1000}
                    required
                />
                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Posting...' : 'Post Review'}
                </button>
            </form>
        </div>
    );
};

export default ReviewForm; 