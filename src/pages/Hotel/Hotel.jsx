import React, { useState } from 'react';
import { Container, Row, Col, Card, Badge, Button } from 'react-bootstrap';
import './hotel.css';

const Hotel = () => {
    // Mock Data
    const vouchers = [
        { code: "HOTELEX50", discount: "Giảm đến 500.000đ Khách sạn Hà Nội", sub: "Giảm 10% tối đa 500.000đ. Đặt tối thiểu 2tr. Áp dụng cho khách sạn tại Hà Nội.", icon: "bi-building" },
        { code: "VUQUOCTEH20", discount: "Giảm đến 1.000.000đ Quốc tế", sub: "Giảm 8% tối đa 1.000.000đ. Đặt tối thiểu 3tr. Áp dụng cho khách sạn ở Thái Lan, Nhật Bản.", icon: "bi-globe" },
        { code: "HOMESTAY15", discount: "Giảm 15% Homestay Đà Lạt", sub: "Giảm 15% tối đa 300.000đ. Đặt tối thiểu 500.000đ. Áp dụng cho các homestay tại Đà Lạt.", icon: "bi-house-heart-fill" },
    ];

    const hotelData = [
        {
            image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=2670&auto=format&fit=crop",
            location: "Đà Nẵng",
            title: "Khách sạn Chicland Đà Nẵng",
            rating: 4.9,
            reviews: 1259,
            oldPrice: "Giá mỗi đêm từ",
            price: "1.500.000 VND",
        },
        {
            image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=2574&auto=format&fit=crop",
            location: "Đà Nẵng",
            title: "Khách sạn Chicland Đà Nẵng",
            rating: 4.9,
            reviews: 1259,
            oldPrice: "Giá mỗi đêm từ",
            price: "1.500.000 VND",
        },
        {
            image: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=2670&auto=format&fit=crop",
            location: "Đà Nẵng",
            title: "Khách sạn Chicland Đà Nẵng",
            rating: 4.9,
            reviews: 1259,
            oldPrice: "Giá mỗi đêm từ",
            price: "1.500.000 VND",
        },
        {
            image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2670&auto=format&fit=crop",
            location: "Đà Nẵng",
            title: "Khách sạn Chicland Đà Nẵng",
            rating: 4.9,
            reviews: 1259,
            oldPrice: "Giá mỗi đêm từ",
            price: "1.500.000 VND",
        }
    ];

    const vietnamPlaces = ["Đà Nẵng", "Tp Hồ Chí Minh", "Hà Nội", "Đà Lạt", "Nha Trang", "Phú Quốc", "Huế"];
    const worldPlaces = ["Bangkok", "Seoul", "Tokyo", "Singapore", "Osaka", "HongKong"];

    const activeVN = "Đà Nẵng";
    const activeWorld = "Bangkok";

    return (
        <div className="hotel-page py-4 bg-light">
            <Container>

                {/* Vouchers section */}
                <div className="mb-5">
                    <h4 className="fw-bold mb-3 d-flex align-items-center gap-2 text-primary" style={{ fontSize: '30px' }}>
                        <i className="bi bi-gift-fill"></i> Ưu đãi và mã giảm giá
                    </h4>
                    <Row className="g-3">
                        {vouchers.map((v, idx) => (
                            <Col md={4} key={idx}>
                                <div className="voucher-card p-3 bg-white rounded-3 shadow-sm d-flex gap-3 align-items-center h-100">
                                    <div className="voucher-icon-box rounded-3 d-flex align-items-center justify-content-center bg-light text-primary">
                                        <i className={`bi ${v.icon} fs-4`}></i>
                                    </div>
                                    <div className="flex-grow-1">
                                        <h6 className="fw-bold mb-1 small">{v.discount}</h6>
                                        <p className="text-muted x-small mb-2">{v.sub}</p>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <span className="code-badge fw-bold small text-dark px-2 py-1 rounded bg-light border">{v.code}</span>
                                            <a href="#" className="small text-primary fw-bold text-decoration-none">Sao chép</a>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </div>

                {/* You Might Like */}
                <div className="mb-5">
                    <h4 className="fw-bold mb-3 d-flex align-items-center gap-2 text-primary" style={{ fontSize: '30px' }}>
                        <i className="bi bi-heart-fill"></i> Có thể bạn sẽ thích
                    </h4>
                    <Row className="g-4">
                        {hotelData.map((item, idx) => (
                            <Col md={6} lg={3} key={idx}>
                                <div className="position-relative cursor-pointer">
                                    <Card className="tour-card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
                                        <div className="position-relative">
                                            <Card.Img variant="top" src={item.image} height="200" className="object-fit-cover" />
                                            <div className="card-heart-icon position-absolute top-0 end-0 m-3 text-white">
                                                <i className="bi bi-heart"></i>
                                            </div>
                                            {/* Navigation arrows placeholder if implementing slider */}
                                            {/* {idx === 0 && <div className="position-absolute top-50 start-0 translate-middle-y ms-2 arrow-circle-btn"><i className="bi bi-chevron-left"></i></div>}
                                            {idx === 3 && <div className="position-absolute top-50 end-0 translate-middle-y me-2 arrow-circle-btn"><i className="bi bi-chevron-right"></i></div>} */}
                                        </div>
                                        <Card.Body className="d-flex flex-column p-3">
                                            <Card.Title className="fw-bold fs-6 mb-1 text-truncate-2">{item.title}</Card.Title>
                                            <div className="d-flex align-items-center gap-1 mb-2 x-small">
                                                <i className="bi bi-star-fill text-warning"></i>
                                                <span className="fw-bold">{item.rating}</span>
                                                <span className="text-muted">({item.reviews} đánh giá)</span>
                                            </div>

                                            <div className="mt-auto">
                                                <div className="text-muted x-small">{item.oldPrice}</div>
                                                <div className="text-primary fw-bold fs-5">{item.price}</div>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                    {idx === 0 && <div className="nav-arrow prev"><i className="bi bi-chevron-left"></i></div>}
                                    {idx === 3 && <div className="nav-arrow next"><i className="bi bi-chevron-right"></i></div>}
                                </div>
                            </Col>
                        ))}
                    </Row>
                </div>

                {/* Discover Domestic */}
                <div className="mb-5">
                    <h4 className="fw-bold mb-3 text-primary" style={{ fontSize: '30px' }}>Khám phá khách sạn nội địa</h4>
                    <div className="d-flex gap-2 overflow-auto pb-3 mb-2 no-scrollbar">
                        {vietnamPlaces.map((place, idx) => (
                            <Button
                                key={idx}
                                variant={activeVN === place ? "primary" : "outline-secondary"}
                                className="rounded-pill fw-medium px-4 border-opacity-25 text-nowrap"
                            >
                                {place}
                            </Button>
                        ))}
                    </div>
                    <Row className="g-4">
                        {hotelData.map((item, idx) => (
                            <Col md={6} lg={3} key={idx}>
                                <div className="position-relative cursor-pointer">
                                    <Card className="tour-card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
                                        <div className="position-relative">
                                            <Card.Img variant="top" src={item.image} height="200" className="object-fit-cover" />
                                            <div className="card-heart-icon position-absolute top-0 end-0 m-3 text-white">
                                                <i className="bi bi-heart"></i>
                                            </div>
                                        </div>
                                        <Card.Body className="d-flex flex-column p-3">
                                            <Card.Title className="fw-bold fs-6 mb-1 text-truncate-2">{item.title}</Card.Title>
                                            <div className="d-flex align-items-center gap-1 mb-2 x-small">
                                                <i className="bi bi-star-fill text-warning"></i>
                                                <span className="fw-bold">{item.rating}</span>
                                                <span className="text-muted">({item.reviews} đánh giá)</span>
                                            </div>
                                            <div className="mt-auto">
                                                <div className="text-muted x-small">{item.oldPrice}</div>
                                                <div className="text-primary fw-bold fs-5">{item.price}</div>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                    {idx === 0 && <div className="nav-arrow prev"><i className="bi bi-chevron-left"></i></div>}
                                    {idx === 3 && <div className="nav-arrow next"><i className="bi bi-chevron-right"></i></div>}
                                </div>
                            </Col>
                        ))}
                    </Row>
                </div>

                {/* Discover International */}
                <div className="mb-5">
                    <h4 className="fw-bold mb-3 text-primary" style={{ fontSize: '30px' }}>Vi vu khách sạn quốc tế</h4>
                    <div className="d-flex gap-2 overflow-auto pb-3 mb-2 no-scrollbar">
                        {worldPlaces.map((place, idx) => (
                            <Button
                                key={idx}
                                variant={activeWorld === place ? "primary" : "outline-secondary"}
                                className="rounded-pill fw-medium px-4 border-opacity-25 text-nowrap"
                            >
                                {place}
                            </Button>
                        ))}
                    </div>
                    <Row className="g-4">
                        {hotelData.map((item, idx) => (
                            <Col md={6} lg={3} key={idx}>
                                <div className="position-relative cursor-pointer">
                                    <Card className="tour-card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
                                        <div className="position-relative">
                                            <Card.Img variant="top" src={item.image} height="200" className="object-fit-cover" />
                                            <div className="card-heart-icon position-absolute top-0 end-0 m-3 text-white">
                                                <i className="bi bi-heart"></i>
                                            </div>
                                        </div>
                                        <Card.Body className="d-flex flex-column p-3">
                                            <Card.Title className="fw-bold fs-6 mb-1 text-truncate-2">{item.title}</Card.Title>
                                            <div className="d-flex align-items-center gap-1 mb-2 x-small">
                                                <i className="bi bi-star-fill text-warning"></i>
                                                <span className="fw-bold">{item.rating}</span>
                                                <span className="text-muted">({item.reviews} đánh giá)</span>
                                            </div>
                                            <div className="mt-auto">
                                                <div className="text-muted x-small">{item.oldPrice}</div>
                                                <div className="text-primary fw-bold fs-5">{item.price}</div>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                    {idx === 0 && <div className="nav-arrow prev"><i className="bi bi-chevron-left"></i></div>}
                                    {idx === 3 && <div className="nav-arrow next"><i className="bi bi-chevron-right"></i></div>}
                                </div>
                            </Col>
                        ))}
                    </Row>
                </div>

                {/* Sale Banner */}
                <div className="mb-5 rounded-4 overflow-hidden position-relative">
                    <img src="https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=2600&auto=format&fit=crop" className="w-100 object-fit-cover" height="250" alt="Sale Banner" style={{ filter: 'brightness(0.8)' }} />
                    <div className="position-absolute top-50 start-0 translate-middle-y ps-5 text-white">
                        <div className="d-flex align-items-center gap-2 mb-2">
                            <i className="bi bi-geo-alt"></i> TripGo
                        </div>
                        <h2 className="fw-bold mb-3 display-5">GIẢM GIÁ ĐẾN 60%<br />TOÀN BỘ KHÁCH SẠN</h2>
                        <Button variant="warning" className="text-white fw-bold px-4 py-2 rounded-pill">Săn Deal Ngay</Button>
                    </div>
                </div>

                {/* Popular Destinations */}
                <div className="mb-5">
                    <h4 className="fw-bold mb-3 text-primary text-center">Những điểm đến phố biển</h4>
                    <Row className="g-3">
                        <Col md={6}>
                            <div className="destination-card rounded-4 overflow-hidden position-relative h-100">
                                <img src="https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?q=80&w=2600&auto=format&fit=crop" className="w-100 h-100 object-fit-cover" style={{ minHeight: '300px' }} alt="Da Nang" />
                                <div className="destination-overlay position-absolute bottom-0 start-0 w-100 p-3 text-white bg-gradient-dark">
                                    <h5 className="fw-bold mb-0">Đà Nẵng</h5>
                                    <small>783 khách sạn</small>
                                </div>
                            </div>
                        </Col>
                        <Col md={6}>
                            <Row className="g-3 h-100">
                                <Col md={6}>
                                    <div className="destination-card rounded-4 overflow-hidden position-relative h-100">
                                        <img src="https://images.unsplash.com/photo-1540202404-a2f29016b523?q=80&w=2666&auto=format&fit=crop" className="w-100 h-100 object-fit-cover" style={{ minHeight: '140px' }} alt="Phu Quoc" />
                                        <div className="destination-overlay position-absolute bottom-0 start-0 w-100 p-3 text-white bg-gradient-dark">
                                            <h6 className="fw-bold mb-0">Phú Quốc</h6>
                                            <small className="x-small">341 khách sạn</small>
                                        </div>
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="destination-card rounded-4 overflow-hidden position-relative h-100">
                                        <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2670&auto=format&fit=crop" className="w-100 h-100 object-fit-cover" style={{ minHeight: '140px' }} alt="Hue" />
                                        <div className="destination-overlay position-absolute bottom-0 start-0 w-100 p-3 text-white bg-gradient-dark">
                                            <h6 className="fw-bold mb-0">Huế</h6>
                                            <small className="x-small">247 khách sạn</small>
                                        </div>
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="destination-card rounded-4 overflow-hidden position-relative h-100">
                                        <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2670&auto=format&fit=crop" className="w-100 h-100 object-fit-cover" style={{ minHeight: '140px' }} alt="Da Lat" />
                                        <div className="destination-overlay position-absolute bottom-0 start-0 w-100 p-3 text-white bg-gradient-dark">
                                            <h6 className="fw-bold mb-0">Đà Lạt</h6>
                                            <small className="x-small">321 khách sạn</small>
                                        </div>
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="destination-card rounded-4 overflow-hidden position-relative h-100">
                                        <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2670&auto=format&fit=crop" className="w-100 h-100 object-fit-cover" style={{ minHeight: '140px' }} alt="HCMC" />
                                        <div className="destination-overlay position-absolute bottom-0 start-0 w-100 p-3 text-white bg-gradient-dark">
                                            <h6 className="fw-bold mb-0">TP Hồ Chí Minh</h6>
                                            <small className="x-small">1621 khách sạn</small>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </div>

            </Container>
        </div>
    );
};

export default Hotel;
