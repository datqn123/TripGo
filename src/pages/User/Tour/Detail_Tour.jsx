import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Badge } from 'react-bootstrap';
import './detail_tour.css';

const Detail_Tour = () => {
    // Mock Data for "Tour Cù Lao Chàm - Lặn ngắm san hô"
    const tourInfo = {
        title: "Tour Cù Lao Chàm - Lặn ngắm san hô",
        address: "Đà Nẵng, Việt Nam",
        rating: 4.9,
        reviews: 1259,
        oldPrice: "3.000.000 VND",
        price: "1.700.000 VND",
        priceUnit: "/người",
        images: [
            "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?q=80&w=2674&auto=format&fit=crop", // Cham Island view
            "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?q=80&w=2674&auto=format&fit=crop", // Snorkeling
            "https://images.unsplash.com/photo-1540202404-a2f29016b523?q=80&w=2666&auto=format&fit=crop"  // Beach activities
        ],
        description: "Tour Cù Lao Chàm mang đến hành trình khám phá biển đảo hoang sơ và yên bình. Du khách sẽ trải nghiệm lặn ngắm san hô, tham quan lăng chài và tận hưởng những bãi biển trong xanh tuyệt đẹp. Đây là lựa chọn lý tưởng cho cặp đôi hoặc hội người muốn có một chuyến đi thư giãn và tràn trề.",
        highlights: [
            { icon: "bi-speedometer", text: "Cano cao tốc đời mới" },
            { icon: "bi-house-heart", text: "Homestay view biển" },
            { icon: "bi-basket", text: "Phục vụ hải sản đặc sắc" },
            { icon: "bi-tsunami", text: "Lặn ngắm san hô" }
        ],
        itinerary: [
            {
                day: "Ngày 1: Khởi hành - Tham quan đảo - Lặn ngắm san hô",
                activities: [
                    "07:30-08:00: Xe đón tại Đà Nẵng/Hội An -> Cảng Cửa Đại",
                    "08:30: Đi cano cao tốc đến Cù Lao Chàm",
                    "09:00: Tham quan Bãi Làng, Giếng cổ, Chùa Hải Tạng, Khu bảo tồn biển",
                    "11:30: Check-in homestay/resort",
                    "12:00: Ăn trưa hải sản",
                    "14:00-16:30: Lặn ngắm san hô + tắm biển + kayak",
                    "18:00: Ăn tối",
                    "19:30: Hoạt động đêm: dạo biển, đốt lửa trại"
                ]
            },
            {
                day: "Ngày 2: Tự do khám phá - Trở về",
                activities: [
                    "06:00: Ngắm bình minh",
                    "07:30: Ăn sáng",
                    "08:30-10:00: Mua hải sản, thăm thú, tắm biển",
                    "10:30: Trả phòng",
                    "11:00: Cano về lại Cửa Đại",
                    "12:00: Xe đưa về Đà Nẵng/Hội An"
                ]
            }
        ],
        inclusions: [
            "Xe đưa đón Đà Nẵng/Hội An",
            "Cano cao tốc khứ hồi",
            "Vé tham quan Cù Lao Chàm",
            "Dụng cụ lặn ngắm san hô",
            "Ăn trưa hải sản",
            "Hướng dẫn viên"
        ],
        exclusions: [
            "Chi phí cá nhân",
            "Tiền TIP cho HDV, tài xế"
        ]
    };

    const reviews = [
        {
            user: "Nguyễn Thị A",
            date: "15/11/2025",
            avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=2576&auto=format&fit=crop",
            content: "Khách sạn rất đẹp, phòng sạch sẽ, nhân viên thân thiện. View biển tuyệt vời!",
            rating: 5
        },
        {
            user: "Nguyễn Thị A",
            date: "15/11/2025",
            avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=2576&auto=format&fit=crop",
            content: "Khách sạn rất đẹp, phòng sạch sẽ, nhân viên thân thiện. View biển tuyệt vời!",
            rating: 5
        },
        {
            user: "Nguyễn Thị A",
            date: "15/11/2025",
            avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=2576&auto=format&fit=crop",
            content: "Khách sạn rất đẹp, phòng sạch sẽ, nhân viên thân thiện. View biển tuyệt vời!",
            rating: 5
        }
    ];

    return (
        <div className="detail-page py-4 bg-light">
            <Container>
                {/* Header Info */}
                <div className="d-flex justify-content-between align-items-end mb-4">
                    <div>
                        <h2 className="fw-bold text-primary-custom mb-2">{tourInfo.title}</h2>
                        <div className="d-flex align-items-center gap-2 mb-2">
                            <Badge bg="warning" className="text-dark">
                                <i className="bi bi-star-fill me-1"></i>{tourInfo.rating}
                            </Badge>
                            <span className="text-muted small">({tourInfo.reviews} đánh giá)</span>
                        </div>
                        <div className="text-muted small">
                            <i className="bi bi-geo-alt-fill me-1 text-primary-custom"></i> {tourInfo.address}
                        </div>
                    </div>
                    <div className="text-end">
                        <div className="text-muted small text-decoration-line-through">{tourInfo.oldPrice}</div>
                        <div>
                            <span className="text-primary-custom fw-bold fs-2">{tourInfo.price}</span>
                            <span className="text-muted"> {tourInfo.priceUnit}</span>
                        </div>
                    </div>
                </div>

                {/* Gallery */}
                <div className="gallery-grid mb-5">
                    <div className="gallery-item main">
                        <img src={tourInfo.images[0]} alt="Main" />
                    </div>
                    <div className="gallery-item">
                        <img src={tourInfo.images[1]} alt="Sub 1" />
                    </div>
                    <div className="gallery-item">
                        <img src={tourInfo.images[2]} alt="Sub 2" />
                    </div>
                </div>

                <Row className="g-4">
                    {/* Left Content */}
                    <Col lg={8}>
                        {/* Intro */}
                        <div className="bg-white rounded-4 p-4 shadow-sm mb-4">
                            <h5 className="fw-bold text-primary-custom mb-3">Giới thiệu</h5>
                            <p className="text-muted mb-0 text-justify" style={{ lineHeight: '1.6' }}>
                                {tourInfo.description}
                            </p>
                        </div>

                        {/* Highlights */}
                        <div className="bg-white rounded-4 p-4 shadow-sm mb-4">
                            <h5 className="fw-bold text-primary-custom mb-3">Điểm nổi bật</h5>
                            <Row className="g-3">
                                {tourInfo.highlights.map((item, idx) => (
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
                        <div className="bg-white rounded-4 p-4 shadow-sm mb-4">
                            <h5 className="fw-bold text-primary-custom mb-4">Lịch trình chi tiết</h5>
                            <div className="ps-2">
                                {tourInfo.itinerary.map((day, idx) => (
                                    <div key={idx} className="timeline-item">
                                        <div className="timeline-dot"></div>
                                        <h6 className="fw-bold text-primary-custom mb-3">{day.day}</h6>
                                        <ul className="list-unstyled text-muted small ps-1 mb-0 custom-ul">
                                            {day.activities.map((act, aIdx) => (
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

                        {/* Inclusions & Exclusions */}
                        <div className="bg-white rounded-4 p-4 shadow-sm mb-4">
                            <h5 className="fw-bold text-primary-custom mb-4">Bao gồm và không bao gồm</h5>
                            <Row>
                                <Col md={6}>
                                    {tourInfo.inclusions.map((item, idx) => (
                                        <div key={idx} className="check-list-item">
                                            <i className="bi bi-check-lg fw-bold fs-5"></i>
                                            <span>{item}</span>
                                        </div>
                                    ))}
                                </Col>
                                <Col md={6}>
                                    {tourInfo.exclusions.map((item, idx) => (
                                        <div key={idx} className="cross-list-item">
                                            <i className="bi bi-x-lg fw-bold"></i>
                                            <span>{item}</span>
                                        </div>
                                    ))}
                                </Col>
                            </Row>
                        </div>

                        {/* Reviews */}
                        <div className="bg-white rounded-4 p-4 shadow-sm mb-4">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h5 className="fw-bold text-primary-custom mb-0">Đánh giá của khách hàng</h5>
                                <a href="#" className="text-decoration-none small text-primary-custom fw-bold">Xem thêm</a>
                            </div>

                            <div className="d-flex flex-column gap-4">
                                {reviews.map((rv, idx) => (
                                    <div key={idx} className="border-bottom pb-4 last-border-0">
                                        <div className="d-flex justify-content-between mb-2">
                                            <div className="d-flex align-items-center gap-3">
                                                <img src={rv.avatar} className="review-avatar" alt="User" />
                                                <div>
                                                    <h6 className="fw-bold mb-0 text-dark small">{rv.user}</h6>
                                                    <small className="text-muted x-small">{rv.date}</small>
                                                </div>
                                            </div>
                                            <div className="text-warning small">
                                                {[...Array(5)].map((_, i) => (
                                                    <i key={i} className={`bi bi-star${i < rv.rating ? '-fill' : ''}`}></i>
                                                ))}
                                            </div>
                                        </div>
                                        <p className="mb-0 text-muted small fst-italic">
                                            "{rv.content}"
                                        </p>
                                    </div>
                                ))}
                            </div>
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
                                            <Form.Control type="input" className="form-control-custom ps-5" placeholder="22/11/2025" readOnly />
                                            <i className="bi bi-calendar3 position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
                                        </div>
                                    </Form.Group>

                                    <Form.Group className="mb-4">
                                        <Form.Label className="fw-bold small">Số lượng khách</Form.Label>
                                        <Form.Control type="input" className="form-control-custom" placeholder="2 người lớn" readOnly />
                                    </Form.Group>

                                    <div className="d-flex justify-content-between mb-2 small text-muted">
                                        <span>2 người x 1.700.000đ</span>
                                        <span className="fw-bold text-dark">3.400.000đ</span>
                                    </div>
                                    <div className="d-flex justify-content-between mb-4 small text-muted">
                                        <span>Phí dịch vụ</span>
                                        <span className="fw-bold text-dark">150.000đ</span>
                                    </div>

                                    <div className="d-flex justify-content-between mb-4 align-items-center">
                                        <span className="fw-bold">Tổng cộng</span>
                                        <span className="fw-bold text-primary-custom fs-5">3.550.000đ</span>
                                    </div>

                                    <Button className="w-100 bg-primary-custom border-0 py-2 fw-bold rounded-3">
                                        Đặt tour ngay
                                    </Button>
                                </Form>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Detail_Tour;
