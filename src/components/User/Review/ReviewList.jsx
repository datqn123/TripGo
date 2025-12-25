import React from 'react';
import { Row, Col, ProgressBar } from 'react-bootstrap';
import './Review.css';

const ReviewList = ({ reviews, averageRating, totalReviews, ratingBreakdown }) => {
    
    // Helper to format date
    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="review-list-container">
            {/* Reviews Content */}
            <div className="reviews-stream">
                {(!Array.isArray(reviews) || reviews.length === 0) ? (
                    <div className="text-center py-5 text-muted">
                        <i className="bi bi-chat-square-text mb-3" style={{fontSize: '2rem'}}></i>
                        <p>Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá!</p>
                    </div>
                ) : (
                    reviews.map((review) => (
                        <div key={review.id} className="review-item border-bottom py-4">
                            <div className="d-flex justify-content-between mb-2">
                                <div className="d-flex gap-3">
                                    <div className="user-avatar-placeholder rounded-circle bg-primary-subtle d-flex align-items-center justify-content-center text-primary fw-bold" 
                                         style={{width: '48px', height: '48px', fontSize: '1.2rem'}}>
                                        {review.user?.fullName?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                    <div>
                                        <div className="fw-bold">{review.user?.fullName || 'Người dùng ẩn danh'}</div>
                                        <div className="text-muted small">{formatDate(review.createdAt)}</div>
                                    </div>
                                </div>
                                <div className="review-rating text-end">
                                    <div className="badge bg-primary fs-6 rounded-3 px-3 py-2">
                                        {review.averageRating || review.totalScore} <span className="fw-normal opacity-75">/ 10</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="review-content mt-3">
                                <p className="mb-0">{review.comment}</p>
                            </div>
                            
                            {/* Optional: Show sub-scores if detailed */}
                             <div className="review-tags mt-3 d-flex gap-2 flex-wrap">
                                <span className="badge bg-light text-dark border fw-normal">
                                    Vệ sinh: {review.cleanlinessRating || review.cleanlinessScore}
                                </span>
                                <span className="badge bg-light text-dark border fw-normal">
                                    Thoải mái: {review.comfortRating || review.comfortScore}
                                </span>
                                <span className="badge bg-light text-dark border fw-normal">
                                    Nhân viên: {review.staffRating || review.staffScore}
                                </span>
                             </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ReviewList;
