import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Badge } from 'react-bootstrap';
import './detail_hotel.css';

const Detail_Tour = () => {
    // Mock Data
    const tourInfo = {
        title: "Glamour Hotel Da Nang", // Keeping title as in image or close to it
        address: "269 Trần Hưng Đạo, Sơn Trà, Đà Nẵng",
        rating: 4.9,
        reviews: 1056,
        price: "575.000đ",
        images: [
            "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2670&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=2525&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=2525&auto=format&fit=crop"
        ],
        description: "Callix Hotel Đà Nẵng nằm tại trung tâm thành phố, gần các điểm du lịch và bãi biển. Khách sạn có thiết kế hiện đại, phòng ốc thoải mái và tiện nghi đầy đủ. Dịch vụ chuyên nghiệp và thân thiện mang điểm đến trải nghiệm dễ chịu cho mọi du khách.",
        amenities: [
            "Wifi miễn phí", "Dịch vụ phòng 24/7",
            "Nhà hàng phục vụ bữa sáng", "Phòng gym",
            "Đưa đón sân bay", "Hồ bơi ngoài trời",
            "Spa", "Bãi đậu xe miễn phí"
        ]
    };

    const roomTypes = [
        {
            name: "Phòng Deluxe",
            size: "28m²",
            guests: "2 người",
            tags: ["Giường King", "View biển", "Ban công"],
            price: "575.000đ",
            available: true
        },
        {
            name: "Phòng Suite",
            size: "45m²",
            guests: "3 người",
            tags: ["Giường King", "View biển", "Phòng khách"],
            price: "1.150.000đ",
            available: true
        },
        {
            name: "Phòng Family",
            size: "55m²",
            guests: "4 người",
            tags: ["2 Giường King", "View thành phố", "Phòng khách"],
            price: "950.000đ",
            available: true
        }
    ];

    const reviews = [
        {
            user: "Nguyễn Thị A",
            date: "15/11/2025",
            avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=2576&auto=format&fit=crop",
            content: "Khách sạn rất đẹp, phòng sạch sẽ, nhân viên thân thiện. View biển tuyệt vời!",
            rating: 5
        },
        {
            user: "Trần Văn B",
            date: "12/11/2025",
            avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=2574&auto=format&fit=crop",
            content: "Dịch vụ tốt, vị trí thuận tiện. Sẽ quay lại.",
            rating: 5
        },
        {
            user: "Lê Thị C",
            date: "10/11/2025",
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2670&auto=format&fit=crop",
            content: "Bữa sáng ngon, hồ bơi đẹp. Rất đáng tiền.",
            rating: 4
        }
    ];

    const similarHotels = [
        {
            name: "Muong Thanh Grand Da Nang",
            tags: ["Khách sạn", "View biển"],
            rating: 4.8,
            location: "An Hải Tây, Sơn Trà",
            image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2670&auto=format&fit=crop"
        },
        {
            name: "Muong Thanh Grand Da Nang",
            tags: ["Khách sạn", "View thành phố"],
            rating: 4.9,
            location: "An Hải Tây, Sơn Trà",
            image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=2525&auto=format&fit=crop"
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
                        <div className="text-muted small">Giá mỗi đêm từ</div>
                        <div className="text-primary-custom fw-bold fs-2">{tourInfo.price}</div>
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
                            <p className="text-muted mb-0" style={{ lineHeight: '1.6' }}>
                                {tourInfo.description}
                            </p>
                        </div>

                        {/* Amenities */}
                        <div className="bg-white rounded-4 p-4 shadow-sm mb-4">
                            <h5 className="fw-bold text-primary-custom mb-3">Tiện nghi</h5>
                            <Row className="g-3">
                                {tourInfo.amenities.map((item, idx) => (
                                    <Col md={6} key={idx}>
                                        <div className="amenity-item">
                                            <i className="bi bi-check-lg"></i>
                                            {item}
                                        </div>
                                    </Col>
                                ))}
                            </Row>
                        </div>

                        {/* Room Types / Options */}
                        <div className="bg-white rounded-4 p-4 shadow-sm mb-4">
                            <h5 className="fw-bold text-primary-custom mb-4">Loại phòng</h5>
                            <div className="d-flex flex-column gap-3">
                                {roomTypes.map((room, idx) => (
                                    <div key={idx} className="option-card">
                                        <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
                                            <div>
                                                <h6 className="fw-bold fs-5 mb-2">{room.name}</h6>
                                                <div className="d-flex gap-3 text-muted x-small mb-3">
                                                    <span><i className="bi bi-aspect-ratio"></i> {room.size}</span>
                                                    <span><i className="bi bi-people-fill"></i> {room.guests}</span>
                                                </div>
                                                <div className="d-flex gap-2 flex-wrap">
                                                    {room.tags.map((tag, tIdx) => (
                                                        <span key={tIdx} className="tag-pill">{tag}</span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="text-end">
                                                <div className="text-primary-custom fw-bold fs-4 mb-2">{room.price}</div>
                                                <Button className="bg-primary-custom border-0 rounded-3 px-4 fw-bold">
                                                    Đặt phòng
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
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
                        <div className="booking-sidebar d-flex flex-column gap-4">
                            {/* Booking Widget */}
                            <div className="booking-card p-4">
                                <h5 className="fw-bold text-primary-custom mb-3 text-center border-bottom border-dashed pb-3 border-secondary border-opacity-25" style={{ borderStyle: 'dashed' }}>
                                    Đặt phòng
                                </h5>

                                <Form>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold small">Ngày nhận phòng</Form.Label>
                                        <div className="position-relative">
                                            <Form.Control type="input" className="form-control-custom ps-5" placeholder="20/11/2025" readOnly />
                                            <i className="bi bi-calendar3 position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
                                        </div>
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold small">Ngày trả phòng</Form.Label>
                                        <div className="position-relative">
                                            <Form.Control type="input" className="form-control-custom ps-5" placeholder="22/11/2025" readOnly />
                                            <i className="bi bi-calendar3 position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
                                        </div>
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold small">Số lượng khách</Form.Label>
                                        <Form.Control type="input" className="form-control-custom" placeholder="2 người lớn" readOnly />
                                    </Form.Group>

                                    <div className="dashed-line"></div>

                                    <div className="d-flex justify-content-between mb-2 small">
                                        <span className="text-muted">2 đêm x 575.000đ</span>
                                        <span className="fw-bold">575.000đ</span>
                                    </div>
                                    <div className="d-flex justify-content-between mb-3 small">
                                        <span className="text-muted">Phí dịch vụ</span>
                                        <span className="fw-bold">150.000đ</span>
                                    </div>

                                    <div className="dashed-line"></div>

                                    <div className="d-flex justify-content-between mb-4">
                                        <span className="fw-bold">Tổng cộng</span>
                                        <span className="fw-bold text-primary-custom fs-5">725.000đ</span>
                                    </div>

                                    <Button className="w-100 bg-primary-custom border-0 py-2 fw-bold rounded-3">
                                        Đặt phòng ngay
                                    </Button>
                                </Form>
                            </div>

                            {/* Similar Hotels */}
                            <div className="bg-white rounded-4 p-4 shadow-sm">
                                <h6 className="fw-bold text-primary-custom mb-3">Khách sạn tương tự</h6>
                                <div className="d-flex flex-column gap-3">
                                    {similarHotels.map((hotel, idx) => (
                                        <div key={idx} className="similar-card border rounded-3 overflow-hidden">
                                            <img src={hotel.image} className="w-100" alt="Similar" />
                                            <div className="p-3">
                                                <h6 className="fw-bold small mb-1">{hotel.name}</h6>
                                                <div className="d-flex gap-2 mb-2">
                                                    {hotel.tags.map((tag, tIdx) => (
                                                        <Badge key={tIdx} bg="light" text="dark" className="fw-normal border tags-sm">{tag}</Badge>
                                                    ))}
                                                </div>
                                                <div className="text-warning small mb-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <i key={i} className={`bi bi-star${i < 4 ? '-fill' : ''}`}></i>
                                                    ))}
                                                </div>
                                                <div className="small text-muted"><i className="bi bi-geo-alt-fill"></i> {hotel.location}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Detail_Tour;
