import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import './setting.css';
import logo from '../../assets/images/icons/VietnamAirlines.png'; // Assuming availability or use placeholder

const MyHistory = () => {
    const [activeTab, setActiveTab] = useState('active');
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [rating, setRating] = useState(0);

    const handleOpenReview = (item) => {
        setSelectedItem(item);
        setShowReviewModal(true);
        setRating(0);
    };

    const handleCloseReview = () => {
        setShowReviewModal(false);
        setSelectedItem(null);
    };

    // Mock Data
    const activeTransactions = [
        {
            id: 'T1',
            type: 'flight',
            airline: 'Vietnam Airlines',
            departureCode: 'DAD',
            arrivalCode: 'HAN',
            departureTime: '13:00',
            arrivalTime: '14:10',
            duration: '1h 10p',
            flightType: 'Khứ hồi',
            price: '1.250.000đ',
            status: 'success',
            statusText: 'Đã thanh toán'
        },
        {
            id: 'T2',
            type: 'flight',
            airline: 'Vietnam Airlines',
            departureCode: 'DAD',
            arrivalCode: 'HAN',
            departureTime: '13:00',
            arrivalTime: '14:10',
            duration: '1h 10p',
            flightType: 'Khứ hồi',
            price: '1.250.000đ',
            status: 'success',
            statusText: 'Đã thanh toán'
        }
    ];

    const completedTransactions = [
        {
            id: 'T3',
            type: 'tour',
            title: 'Tour Cù Lao Chàm',
            location: 'Đà Nẵng',
            time: '20/11/2025-21/11/2025',
            people: '2 người',
            price: '3.550.000đ',
            status: 'success',
            statusText: 'Đã hoàn tất',
            image: 'https://images.unsplash.com/photo-1544551763-46a42a46e865?auto=format&fit=crop&w=200&q=60'
        },
        {
            id: 'T4',
            type: 'flight',
            airline: 'Vietnam Airlines',
            departureCode: 'DAD',
            arrivalCode: 'HAN',
            departureTime: '13:00',
            arrivalTime: '14:10',
            duration: '1h 10p',
            flightType: 'Khứ hồi',
            price: '1.250.000đ',
            status: 'success',
            statusText: 'Đã hoàn tất'
        }
    ];

    const renderFlightCard = (item, isCompleted = false) => (
        <div className="transaction-card" key={item.id}>
            <div className="trans-header">
                <div className="trans-airline">
                    <img src={logo} alt="Airline" style={{ height: '24px' }} />
                    <span>{item.airline}</span>
                </div>
                <div className="trans-price-col">
                    <div className="trans-price">{item.price}</div>
                    <span className={`status-badge ${item.status === 'success' ? 'success' : 'pending'}`}>
                        {item.statusText}
                    </span>
                </div>
            </div>
            <div className="trans-route justify-content-center mb-4">
                <div className="text-center">
                    <div className="route-time">{item.departureTime}</div>
                    <div className="route-date">{item.departureCode}</div>
                </div>
                <div className="route-arrow">
                    <span>{item.duration}</span>
                    <div style={{ borderTop: '1px solid #cbd5e1', width: '60px', position: 'relative' }}>
                        <i className="bi bi-arrow-left-right" style={{ position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', background: '#fff', padding: '0 4px' }}></i>
                    </div>
                    <span style={{ color: '#0ea5e9', fontSize: '13px' }}>{item.flightType}</span>
                </div>
                <div className="text-center">
                    <div className="route-time">{item.arrivalTime}</div>
                    <div className="route-date">{item.arrivalCode}</div>
                </div>
            </div>

            <div className="trans-actions">
                {isCompleted ? (
                    <>
                        <button className="btn-action-outline">Đặt lại</button>
                        <button className="btn-action-primary" onClick={() => handleOpenReview(item)}>Đánh giá</button>
                    </>
                ) : (
                    <>
                        <button className="btn-action-outline">Huỷ</button>
                        <button className="btn-action-primary">Xem chi tiết</button>
                    </>
                )}
            </div>
        </div>
    );

    const renderTourCard = (item) => (
        <div className="transaction-card" key={item.id}>
            <div className="trans-header mb-0">
                <div className="tour-history-card w-100">
                    <img src={item.image} alt={item.title} className="tour-thumb-sm" />
                    <div className="tour-info-col">
                        <div className="d-flex justify-content-between align-items-start">
                            <a href="#" className="tour-title-link">{item.title}</a>
                            <div className="text-end">
                                <div className="trans-price">{item.price}</div>
                                <span className={`status-badge ${item.status === 'success' ? 'success' : 'pending'}`}>
                                    {item.statusText}
                                </span>
                            </div>
                        </div>
                        <div className="tour-meta">
                            <i className="bi bi-geo-alt"></i> {item.location}
                        </div>
                        <div className="tour-meta">
                            <strong>Thời gian:</strong> {item.time}
                        </div>
                        <div className="tour-meta">
                            <i className="bi bi-people"></i> {item.people}
                        </div>

                        <div className="trans-actions mt-2 pt-0 border-0">
                            <button className="btn-action-outline">Đặt lại</button>
                            <button className="btn-action-primary" onClick={() => handleOpenReview(item)}>Đánh giá</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div>
            <h2 className="account-section-title">Giao dịch của tôi</h2>

            <div className="setting-card">
                <div className="setting-card-body">
                    <div className="setting-tabs">
                        <button
                            className={`setting-tab-item ${activeTab === 'active' ? 'active' : ''}`}
                            onClick={() => setActiveTab('active')}
                        >
                            Đang hoạt động
                        </button>
                        <button
                            className={`setting-tab-item ${activeTab === 'completed' ? 'active' : ''}`}
                            onClick={() => setActiveTab('completed')}
                        >
                            Hoàn tất
                        </button>
                        <button
                            className={`setting-tab-item ${activeTab === 'cancelled' ? 'active' : ''}`}
                            onClick={() => setActiveTab('cancelled')}
                        >
                            Đã huỷ
                        </button>
                    </div>

                    <div className="tab-content py-2">
                        {activeTab === 'active' && (
                            <div>
                                {activeTransactions.map(item => renderFlightCard(item))}
                            </div>
                        )}
                        {activeTab === 'completed' && (
                            <div>
                                {completedTransactions.map(item =>
                                    item.type === 'tour' ? renderTourCard(item) : renderFlightCard(item, true)
                                )}
                            </div>
                        )}
                        {activeTab === 'cancelled' && (
                            <div className="text-center py-5 text-muted">Chưa có giao dịch bị huỷ</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Review Modal */}
            <Modal show={showReviewModal} onHide={handleCloseReview} centered size="lg">
                <Modal.Header closeButton className="border-0 pb-0">
                    <Modal.Title className="fw-bold text-primary"><i className="bi bi-star-fill text-warning me-2"></i> Đánh giá</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4">
                    {selectedItem && (
                        <div className="modal-tour-info">
                            <div>
                                <div className="text-dark fw-bold mb-1">{selectedItem.type === 'tour' ? 'Tour du lịch' : 'Chuyến bay'}</div>
                                <div className="modal-tour-title">{selectedItem.title || (selectedItem.airline + ' ' + selectedItem.departureCode + '-' + selectedItem.arrivalCode)}</div>
                                <div className="text-muted small">
                                    {selectedItem.type === 'tour' ? `Thời gian: ${selectedItem.time}` : `${selectedItem.departureTime} - ${selectedItem.arrivalTime}`}
                                </div>
                            </div>
                            <div className="modal-tour-price">{selectedItem.price}</div>
                        </div>
                    )}

                    <div className="text-center mb-4">
                        <h5 className="fw-bold mb-3">Bạn cảm thấy chuyến đi như thế nào?</h5>
                        <div className="rating-stars">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <i
                                    key={star}
                                    className={`bi ${star <= rating ? 'bi-star-fill active' : 'bi-star inactive'} rating-star-icon`}
                                    onClick={() => setRating(star)}
                                ></i>
                            ))}
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="fw-bold mb-2">Nhận xét của bạn (Tuỳ chọn)</label>
                        <textarea
                            className="review-textarea"
                            placeholder="Chia sẻ trải nghiệm của bạn về chuyến đi này...."
                        ></textarea>
                    </div>

                    <div className="text-end">
                        <Button className="btn-action-primary" style={{ minWidth: '150px' }} onClick={handleCloseReview}>
                            Gửi đánh giá
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default MyHistory;
