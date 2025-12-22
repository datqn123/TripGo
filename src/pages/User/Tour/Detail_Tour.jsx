import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form, Badge } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import tourApi from "../../../api/tourApi";
import './detail_tour.css';

import Banner from "../../../components/User/Banner/Banner";
import AdvanceSearch from "../../../components/User/AdvanceSearch/AdvanceSearch";

const Detail_Tour = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [tourInfo, setTourInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedScheduleId, setSelectedScheduleId] = useState('');
    const [guestCount, setGuestCount] = useState(1);

    const handleBookTour = () => {
        if (!selectedScheduleId) {
            alert("Vui lòng chọn ngày khởi hành");
            return;
        }
        
        // Find schedule by ID
        const selectedSchedule = tourInfo.schedules?.find(s => String(s.id) === String(selectedScheduleId));
        
        if (!selectedSchedule) {
             alert("Lịch trình không hợp lệ");
             return;
        }

        if (!selectedSchedule.id) {
            console.error("Selected Schedule missing ID:", selectedSchedule);
            alert("Lỗi dữ liệu: Lịch trình tour không có ID hợp lệ. Vui lòng thử lại hoặc liên hệ hỗ trợ.");
            return;
        }

        console.log("Booking Tour with Schedule:", selectedSchedule);

        navigate('/payment-tour', { 
            state: { 
                tourInfo, 
                bookingDetails: {
                    date: selectedSchedule.startDate,
                    guestCount: guestCount,
                    totalPrice: (tourInfo.price || 0) * guestCount,
                    tourScheduleId: selectedSchedule.id
                }
            } 
        });
    };



    useEffect(() => {
        const fetchTourDetail = async () => {
            if (!id) return;
            setLoading(true);
            try {
                const response = await tourApi.getTour(id);
                if (response && response.data && response.data.result) {
                    console.log("Tour Detail Response:", response.data.result);
                    if (response.data.result.schedules) {
                        console.log("Schedules:", response.data.result.schedules);
                    }
                    setTourInfo(response.data.result);
                }
            } catch (error) {
                console.error("Failed to load tour detail:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTourDetail();
    }, [id]);

    const formatPrice = (price) => {
        return price ? price.toLocaleString('vi-VN') + ' VND' : 'Liên hệ';
    };

    if (loading) return <div className="text-center py-5">Đang tải thông tin tour...</div>;
    if (!tourInfo) return <div className="text-center py-5">Không tìm thấy thông tin tour.</div>;

    // Helper to get image or fallback
    const getMainImage = () => tourInfo.image || tourInfo.thumbnail || "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b";
    
    // Fallback for array data if not present in API or if not an array
    const safelyGetArray = (data, defaultArray = []) => {
        if (!data) return defaultArray;
        if (Array.isArray(data)) return data;
        // If string (e.g. valid JSON), try to parse
        if (typeof data === 'string') {
             try {
                 const parsed = JSON.parse(data);
                 if (Array.isArray(parsed)) return parsed;
             } catch (e) {
                 // Not JSON, might be single string item, return as single item array or default
                 return [ { icon: "bi-check-circle", text: data } ]; // for highlights style
             }
        }
        return defaultArray;
    };

    const defaultHighlights = [
        { icon: "bi-speedometer", text: "Di chuyển thuận tiện" },
        { icon: "bi-house-heart", text: "Khách sạn tiện nghi" },
        { icon: "bi-basket", text: "Ẩm thực địa phương" },
        { icon: "bi-tsunami", text: "Hoạt động thú vị" }
    ];

    const highlights = Array.isArray(tourInfo.highlights) ? tourInfo.highlights : defaultHighlights;

    const itinerary = Array.isArray(tourInfo.itinerary) ? tourInfo.itinerary : []; 
    const inclusions = Array.isArray(tourInfo.inclusions) ? tourInfo.inclusions : ["Xe đưa đón", "Vé tham quan", "Hướng dẫn viên", "Nước uống"];
    const exclusions = Array.isArray(tourInfo.exclusions) ? tourInfo.exclusions : ["Chi phí cá nhân", "Thuế VAT"];

    return (
        <div className="detail-page">
            <Banner />
            <AdvanceSearch />
            <div className="py-4 bg-light">
                <Container>
                {/* Header Info */}
                <div className="d-flex justify-content-between align-items-end mb-4">
                    <div>
                        {/* Larger Title */}
                        <h1 className="fw-bold text-primary-custom mb-3 display-5">{tourInfo.title || tourInfo.name}</h1>
                        <div className="d-flex align-items-center gap-2 mb-2">
                             {/* Mock rating if not available */}
                            <Badge bg="warning" className="text-dark">
                                <i className="bi bi-star-fill me-1"></i>{tourInfo.rating || 4.5}
                            </Badge>
                            <span className="text-muted small">({tourInfo.reviews || 0} đánh giá)</span>
                        </div>
                        <div className="text-muted small">
                        </div>
                    </div>
                    <div className="text-end">
                        {tourInfo.oldPrice && <div className="text-muted small text-decoration-line-through">{formatPrice(tourInfo.oldPrice)}</div>}
                        <div>
                            <span className="text-primary-custom fw-bold fs-2">{formatPrice(tourInfo.price)}</span>
                            <span className="text-muted"> /khách</span>
                        </div>
                    </div>
                </div>

                {/* Gallery - Single Main Image Only */}
                <div className="mb-5">
                    <img 
                        src={getMainImage()} 
                        alt={tourInfo.title || tourInfo.name} 
                        className="w-100 rounded-4 shadow-sm"
                        style={{ height: '500px', objectFit: 'cover' }}
                    />
                </div>

                <Row className="g-4">
                    {/* Left Content */}
                    <Col lg={8}>
                        {/* Intro */}
                        <div className="bg-white rounded-4 p-4 shadow-sm mb-4">
                            <h5 className="fw-bold text-primary-custom mb-3">Giới thiệu</h5>
                            <p className="text-muted mb-0 text-justify" style={{ lineHeight: '1.6' }}>
                                {tourInfo.description || "Chưa có mô tả chi tiết cho tour này."}
                            </p>
                        </div>

                        {/* Highlights */}
                        <div className="bg-white rounded-4 p-4 shadow-sm mb-4">
                            <h5 className="fw-bold text-primary-custom mb-3">Điểm nổi bật</h5>
                            <Row className="g-3">
                                {highlights.map((item, idx) => (
                                    <Col md={6} key={idx}>
                                        <div className="highlight-item border">
                                            <div className="highlight-icon">
                                                <i className={`bi ${item.icon}`}></i>
                                            </div>
                                            <span className="fw-medium text-dark">{item.text}</span>
                                        </div>
                                    </Col>
                                ))}
                            </Row>
                        </div>

                        {/* Itinerary */}
                        {itinerary.length > 0 && (
                            <div className="bg-white rounded-4 p-4 shadow-sm mb-4">
                                <h5 className="fw-bold text-primary-custom mb-4">Lịch trình chi tiết</h5>
                                <div className="ps-2">
                                    {itinerary.map((day, idx) => (
                                        <div key={idx} className="timeline-item">
                                            <div className="timeline-dot"></div>
                                            <h6 className="fw-bold text-primary-custom mb-3">{day.day || `Ngày ${idx + 1}`}</h6>
                                            <ul className="list-unstyled text-muted small ps-1 mb-0 custom-ul">
                                                {day.activities && day.activities.map((act, aIdx) => (
                                                    <li key={aIdx} className="mb-2 position-relative ps-3">
                                                        <span className="position-absolute top-0 start-0">•</span>
                                                        {act}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Inclusions & Exclusions */}
                        <div className="bg-white rounded-4 p-4 shadow-sm mb-4">
                            <h5 className="fw-bold text-primary-custom mb-4">Bao gồm và không bao gồm</h5>
                            <Row>
                                <Col md={6}>
                                    <h6 className="fw-bold mb-3 text-success">Bao gồm</h6>
                                    {inclusions.map((item, idx) => (
                                        <div key={idx} className="check-list-item">
                                            <i className="bi bi-check-lg fw-bold fs-5"></i>
                                            <span>{item}</span>
                                        </div>
                                    ))}
                                </Col>
                                <Col md={6}>
                                    <h6 className="fw-bold mb-3 text-danger">Không bao gồm</h6>
                                    {exclusions.map((item, idx) => (
                                        <div key={idx} className="cross-list-item">
                                            <i className="bi bi-x-lg fw-bold"></i>
                                            <span>{item}</span>
                                        </div>
                                    ))}
                                </Col>
                            </Row>
                        </div>
                    </Col>

                    {/* Right Sidebar */}
                    <Col lg={4}>
                        <div className="booking-sidebar">
                            <div className="booking-card p-4">
                                <h5 className="fw-bold text-primary-custom mb-4">
                                    Đặt tour ngay
                                </h5>

                                <Form>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold small">Ngày khởi hành</Form.Label>
                                        <div className="position-relative">
                                            {tourInfo.schedules && tourInfo.schedules.length > 0 ? (
                                                <Form.Select
                                                    className="form-control-custom ps-5"
                                                    value={selectedScheduleId}
                                                    onChange={(e) => setSelectedScheduleId(e.target.value)}
                                                >
                                                    <option value="">Chọn ngày khởi hành</option>
                                                    {tourInfo.schedules.map((schedule, idx) => (
                                                        <option key={schedule.id || idx} value={schedule.id}>
                                                            {new Date(schedule.startDate).toLocaleDateString('vi-VN')} - Còn {schedule.availableSeats} chỗ
                                                        </option>
                                                    ))}
                                                </Form.Select>
                                            ) : (
                                                <div className="text-danger p-2 border rounded bg-light">Hiện chưa có lịch trình</div>
                                            )}
                                            <i className="bi bi-calendar3 position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
                                        </div>
                                    </Form.Group>

                                    <Form.Group className="mb-4">
                                        <Form.Label className="fw-bold small">Số lượng khách</Form.Label>
                                        <Form.Control 
                                            type="number" 
                                            min="1" 
                                            value={guestCount}
                                            onChange={(e) => setGuestCount(parseInt(e.target.value) || 1)}
                                            className="form-control-custom" 
                                        />
                                    </Form.Group>

                                    <Button 
                                        className="w-100 bg-primary-custom border-0 py-2 fw-bold rounded-3"
                                        onClick={handleBookTour}
                                    >
                                        Đặt tour ngay
                                    </Button>
                                </Form>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
            </div>
        </div>
    );
};

export default Detail_Tour;
