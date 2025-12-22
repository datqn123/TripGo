import React, { useEffect, useState } from 'react';
import adminBookingApi from '../../../api/adminBookingApi';
import './BookingDetailModal.css';

const BookingDetailModal = ({ isOpen, onClose, bookingId }) => {
    const [booking, setBooking] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen && bookingId) {
            const fetchDetail = async () => {
                setIsLoading(true);
                try {
                    const res = await adminBookingApi.getById(bookingId);
                    const data = res.data;
                    setBooking(data?.result || data);
                } catch (error) {
                    console.error("Failed to fetch booking detail", error);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchDetail();
        } else {
            setBooking(null);
        }
    }, [isOpen, bookingId]);

    if (!isOpen) return null;

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const formatDate = (dateString, includeTime = true) => {
         if (!dateString) return '';
         const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
         if (includeTime) {
             options.hour = '2-digit';
             options.minute = '2-digit';
         }
         return new Date(dateString).toLocaleString('vi-VN', options);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content booking-detail-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Chi tiết đơn hàng #{booking?.bookingCode}</h2>
                    <button className="close-btn" onClick={onClose}><i className="bi bi-x"></i></button>
                </div>

                <div className="modal-body">
                    {isLoading ? (
                        <div className="loading-spinner">Đang tải...</div>
                    ) : booking ? (
                        <>
                            {/* Section 1: General Info */}
                            <div className="detail-section">
                                <h3 className="section-title">Thông tin chung</h3>
                                <div className="info-grid">
                                    <div className="info-item">
                                        <label>Mã đơn hàng</label>
                                        <span>{booking.bookingCode}</span>
                                    </div>
                                    <div className="info-item">
                                        <label>Ngày đặt</label>
                                        <span>{formatDate(booking.createdAt)}</span>
                                    </div>
                                    <div className="info-item">
                                        <label>Trạng thái</label>
                                        <span className={`status-badge ${booking.status.toLowerCase()}`}>{booking.status}</span>
                                    </div>
                                    <div className="info-item">
                                        <label>Tổng tiền</label>
                                        <span className="price-text">{formatCurrency(booking.finalPrice || booking.totalPrice)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Contact Info */}
                            <div className="detail-section">
                                <h3 className="section-title">Thông tin liên hệ</h3>
                                <div className="info-grid">
                                    <div className="info-item">
                                        <label>Họ tên</label>
                                        <span>{booking.contactName}</span>
                                    </div>
                                    <div className="info-item">
                                        <label>Số điện thoại</label>
                                        <span>{booking.contactPhone}</span>
                                    </div>
                                    <div className="info-item">
                                        <label>Email</label>
                                        <span>{booking.contactEmail}</span>
                                    </div>
                                    <div className="info-item">
                                        <label>Phương thức thanh toán</label>
                                        <span>{booking.paymentMethod}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Section 3: Service Detail */}
                            <div className="detail-section">
                                <h3 className="section-title">Chi tiết dịch vụ ({booking.type})</h3>
                                {booking.service && (
                                    <div className="service-detail-card">
                                        {booking.type === 'FLIGHT' && (
                                            <>
                                                <h4>{booking.service.flightCode}</h4>
                                                <p>Hạng vé: {booking.service.name}</p>
                                                <p>Giá vé gốc: {formatCurrency(booking.service.price)}</p>
                                            </>
                                        )}
                                        {booking.type === 'HOTEL' && (
                                            <>
                                                <h4>{booking.service.hotelName}</h4>
                                                <p>Phòng: {booking.service.name}</p>
                                                <p>Check-in: {formatDate(booking.checkInDate, false)}</p>
                                                <p>Check-out: {formatDate(booking.checkOutDate, false)}</p>
                                            </>
                                        )}
                                        {booking.type === 'TOUR' && (
                                            <>
                                                <h4>{booking.service.tourName}</h4>
                                                <p>Lịch trình ID: {booking.tourScheduleId}</p>
                                            </>
                                        )}
                                        <div className="passengers-list">
                                            <h5>Danh sách khách ({booking.passengers?.length || 0})</h5>
                                            <ul>
                                                {booking.passengers?.map((p, idx) => (
                                                    <li key={idx}>
                                                        {p.fullName} <span className="passenger-type">({p.passengerType})</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="error-msg">Không tìm thấy thông tin đơn hàng</div>
                    )}
                </div>

                <div className="modal-footer">
                    <button className="btn-secondary" onClick={onClose}>Đóng</button>
                </div>
            </div>
        </div>
    );
};

export default BookingDetailModal;
