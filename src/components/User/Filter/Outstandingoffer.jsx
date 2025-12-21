import React, { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import "./filter.css";
import Banner from "../Banner/Banner";
import AdvanceSearch from "../AdvanceSearch/AdvanceSearch";
import { useNavigate } from "react-router-dom";
import { PUBLIC_API } from "../../../api/config";

const Outstandingoffer = () => {
    const navigate = useNavigate();
    const [flightCards, setFlightCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFlightCards = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch(PUBLIC_API.FLIGHT_CARDS, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Không thể tải danh sách chuyến bay');
                }

                const data = await response.json();
                console.log('Flight cards:', data);
                setFlightCards(data.result || data);
            } catch (err) {
                console.error('Error fetching flight cards:', err);
                setError(err.message);
                toast.error('Không thể tải danh sách chuyến bay');
            } finally {
                setLoading(false);
            }
        };

        fetchFlightCards();
    }, []);

    // Format price
    const formatPrice = (price) => {
        if (!price) return '0đ';
        return price.toLocaleString('vi-VN') + 'đ';
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    return (
        <>
        <Banner/>
        <AdvanceSearch/>
            <div className="filter-page container">
                <div className="filter-inner">
                    <aside className="filter-sidebar">
                        <div className="filter-card">
                            <div className="filter-title">Bộ lọc</div>

                            <div className="filter-section">
                                <h4>Khoảng giá</h4>
                                <label className="chk"><input type="checkbox" /> Dưới 1.000.000đ</label>
                                <label className="chk"><input type="checkbox" /> 1.000.000đ - 2.000.000đ</label>
                                <label className="chk"><input type="checkbox" /> 2.000.000đ - 4.000.000đ</label>
                                <label className="chk"><input type="checkbox" /> Trên 4.000.000đ</label>
                            </div>

                            <div className="filter-section">
                                <h4>Hãng hàng không</h4>
                                <label className="chk"><input type="checkbox" /> Vietnam Airlines</label>
                                <label className="chk"><input type="checkbox" /> Vietjet Air</label>
                                <label className="chk"><input type="checkbox" /> Singapore Airlines</label>
                            </div>

                            <div className="filter-section">
                                <h4>Giờ khởi hành</h4>
                                <label className="chk"><input type="checkbox" /> Sáng sớm (00:00 - 06:00)</label>
                                <label className="chk"><input type="checkbox" /> Buổi sáng (06:00 - 12:00)</label>
                                <label className="chk"><input type="checkbox" /> Buổi chiều (12:00 - 18:00)</label>
                                <label className="chk"><input type="checkbox" /> Buổi tối (18:00 - 24:00)</label>
                            </div>

                            <div className="filter-section">
                                <h4>Chọn kiểu bay</h4>
                                <label className="chk"><input type="checkbox" /> Một chiều</label>
                                <label className="chk"><input type="checkbox" /> Khứ hồi</label>
                                <label className="chk"><input type="checkbox" /> Nhiều chặng</label>
                            </div>

                            <div className="filter-apply">
                                <button 
                                onClick={() => navigate('/filterplane')}
                                className="btn-apply">Áp dụng bộ lọc</button>
                            </div>
                        </div>
                    </aside>
                    <div className="outstanding-offers-container">
                        <h3 className="offers-title">Chuyến bay gần nhất</h3>
                        
                        {loading ? (
                            <div className="text-center py-5">
                                <Spinner animation="border" variant="primary" />
                                <p className="mt-3 text-muted">Đang tải danh sách chuyến bay...</p>
                            </div>
                        ) : error ? (
                            <div className="alert alert-danger" role="alert">
                                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                {error}
                            </div>
                        ) : flightCards.length === 0 ? (
                            <div className="text-center py-5 text-muted">
                                Hiện không có chuyến bay nào
                            </div>
                        ) : (
                            <div className="offers-grid">
                                {flightCards.map((flight) => (
                                    <div key={flight.id} className="offer-card-new">
                                        <div className="offer-date-badge">
                                            <i className="bi bi-calendar3"></i> {flight.flightDate || 'N/A'}
                                        </div>

                                        <div className="offer-content">
                                            <div className="offer-flight-info">
                                                <div className="airline-section">
                                                    <div className="airline-logo-new">
                                                        {flight.airlineLogo ? (
                                                            <img src={flight.airlineLogo} alt={flight.airlineName} style={{ width: '24px', height: '24px' }} />
                                                        ) : (
                                                            '✈️'
                                                        )}
                                                    </div>
                                                    <div className="airline-name-new">{flight.airlineName || 'N/A'}</div>
                                                </div>

                                                <div className="flight-route">
                                                    <div className="route-point">
                                                        <div className="time-big">{flight.departureTime || 'N/A'}</div>
                                                        <div className="city-text">
                                                            {flight.departureCode || flight.departureCity || 'N/A'}
                                                        </div>
                                                    </div>

                                                    <div className="flight-duration">
                                                        <i className="bi bi-send"></i>
                                                        <div className="duration-text">{flight.duration || 'N/A'}</div>
                                                    </div>

                                                    <div className="route-point">
                                                        <div className="time-big">{flight.arrivalTime || 'N/A'}</div>
                                                        <div className="city-text">
                                                            {flight.arrivalCode || flight.arrivalCity || 'N/A'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="offer-price-section">
                                                <div className="new-price-big">{formatPrice(flight.originalPrice)}</div>
                                                <button className="select-flight-btn">Chọn chuyến bay</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Outstandingoffer;
