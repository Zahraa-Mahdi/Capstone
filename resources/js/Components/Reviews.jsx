import React, { useState, useEffect, useRef } from 'react';
import axios from '@/axios';
import './Reviews.css';

const Reviews = () => {
    const [reviews, setReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const reviewsRef = useRef(null);
    const reviewsPerPage = 5;

    useEffect(() => {
        fetchReviews();
    }, [page]);

    const fetchReviews = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`/reviews?page=${page}&per_page=${reviewsPerPage}`);
            if (page === 1) {
                setReviews(response.data);
            } else {
                setReviews(prevReviews => [...prevReviews, ...response.data]);
            }
            setHasMore(response.data.length === reviewsPerPage);
            setError(null);
        } catch (error) {
            console.error('Error fetching reviews:', error);
            setError('Unable to load reviews. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleNewReview = async (newReview) => {
        setReviews(prevReviews => [newReview, ...prevReviews]);
        if (reviewsRef.current) {
            reviewsRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const loadMore = () => {
        if (!isLoading && hasMore) {
            setPage(prevPage => prevPage + 1);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) return '1 day ago';
        if (diffDays < 30) return `${diffDays} days ago`;
        if (diffDays < 365) {
            const months = Math.floor(diffDays / 30);
            return `${months} ${months === 1 ? 'month' : 'months'} ago`;
        }
        const years = Math.floor(diffDays / 365);
        return `${years} ${years === 1 ? 'year' : 'years'} ago`;
    };

    const renderStars = (rating) => {
        return [...Array(5)].map((_, index) => (
            <span key={index} className="star">
                ★
            </span>
        ));
    };

    if (error) {
        return (
            <div className="reviews-container" ref={reviewsRef}>
                <div className="error-message">
                    {error}
                </div>
            </div>
        );
    }

    if (reviews.length === 0 && !isLoading) {
        return (
            <div className="reviews-container" ref={reviewsRef}>
                <div className="reviews-header">
                    <h2>What Our Students Say?</h2>
                </div>
                <p className="subtitle">Be the first to share your experience!</p>
            </div>
        );
    }

    return (
        <div className="reviews-container" ref={reviewsRef}>
            <div className="reviews-header">
                <h2>What Our Students Say?</h2>
            </div>
            
            <div className="reviews-list">
                {reviews.map((review) => (
                    <div key={review.id} className="review-card">
                        <div className="review-header">
                            <div className="author-avatar">
                                {review.user?.name?.charAt(0) || '?'}
                            </div>
                            <div className="review-author-info">
                                <h4 className="author-name">{review.user?.name || 'Anonymous'}</h4>
                                <p className="review-date">{formatDate(review.created_at)}</p>
                            </div>
                            <div className="review-rating">
                                {renderStars(review.rating)}
                            </div>
                        </div>
                        <p className="review-content">
                            {review.content}
                        </p>
                        {review.content.length > 200 && (
                            <span className="read-more">Read more</span>
                        )}
                    </div>
                ))}
            </div>

            {hasMore && (
                <div className="load-more">
                    <button 
                        onClick={loadMore} 
                        disabled={isLoading}
                        className="load-more-button"
                    >
                        {isLoading ? 'Loading...' : 'Load More Reviews'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default Reviews; 