import React, { useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import reviewApi from '../../../api/reviewApi';
import './Review.css';

const ReviewForm = ({ hotelId, onReviewSubmit, onCancel }) => {
    const [submitting, setSubmitting] = useState(false);
    const [ratings, setRatings] = useState({
        cleanliness: 10,
        comfort: 10,
        location: 10,
        facilities: 10,
        staff: 10,
        valueForMoney: 10
    });
    const [comment, setComment] = useState('');

    const handleRatingChange = (key, value) => {
        setRatings(prev => ({
            ...prev,
            [key]: parseInt(value)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!comment.trim()) {
            toast.error("Vui lòng nhập nội dung đánh giá");
            return;
        }

        setSubmitting(true);
        try {
            const data = {
                hotelId: parseInt(hotelId),
                comment: comment,
                cleanliness: ratings.cleanliness,
                comfort: ratings.comfort,
                location: ratings.location,
                facilities: ratings.facilities,
                staff: ratings.staff,
                value: ratings.valueForMoney 
            };

            await reviewApi.submitReview(data);
            toast.success("Đánh giá của bạn đã được gửi thành công!");
            
            if (onReviewSubmit) {
                onReviewSubmit();
            }
        } catch (error) {
            console.error("Submit review error:", error);
            const msg = error.response?.data?.message || "Có lỗi xảy ra khi gửi đánh giá";
            toast.error(msg);
        } finally {
            setSubmitting(false);
        }
    };

    const categories = [
        { key: 'cleanliness', label: 'Vệ sinh' },
        { key: 'comfort', label: 'Thoải mái' },
        { key: 'location', label: 'Vị trí' },
        { key: 'facilities', label: 'Tiện nghi' },
        { key: 'staff', label: 'Nhân viên' },
        { key: 'valueForMoney', label: 'Đáng giá' }
    ];

    return (
        <div className="review-form-container bg-light p-4 rounded-4 mb-4">
            <h5 className="fw-bold mb-4">Viết đánh giá của bạn</h5>
            
            <Form onSubmit={handleSubmit}>
                <Row className="g-3 mb-4">
                    {categories.map(cat => (
                        <Col md={6} key={cat.key}>
                            <Form.Group>
                                <div className="d-flex justify-content-between mb-1">
                                    <Form.Label className="small mb-0 text-muted">{cat.label}</Form.Label>
                                    <div className="fw-bold text-primary">{ratings[cat.key]}</div>
                                </div>
                                <Form.Range 
                                    min={1} 
                                    max={10} 
                                    step={1}
                                    value={ratings[cat.key]}
                                    onChange={(e) => handleRatingChange(cat.key, e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                    ))}
                </Row>

                <Form.Group className="mb-4">
                    <Form.Label className="fw-bold small">Nhận xét của bạn</Form.Label>
                    <Form.Control 
                        as="textarea" 
                        rows={4} 
                        placeholder="Chia sẻ trải nghiệm của bạn về khách sạn này..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        required
                    />
                </Form.Group>

                <div className="d-flex gap-2 justify-content-end">
                    {onCancel && (
                        <Button variant="light" onClick={onCancel} disabled={submitting}>
                            Hủy
                        </Button>
                    )}
                    <Button type="submit" variant="primary" className="fw-bold px-4" disabled={submitting}>
                        {submitting ? 'Đang gửi...' : 'Gửi đánh giá'}
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default ReviewForm;
