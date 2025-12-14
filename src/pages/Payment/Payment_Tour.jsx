import React, { useState } from "react";
import "./payment.css";
import { Container, Row, Col, Form, Button, Badge } from "react-bootstrap";

const Payment_Tour = () => {
    const [paymentMethod, setPaymentMethod] = useState("bank"); // international, wallet, bank

    const handlePaymentMethodChange = (method) => {
        setPaymentMethod(method);
    };

    return (
        <div className="payment-page">
            <div className="payment-header-bg"></div>
            <Container>
                <h4 className="fw-bold mb-4 text-primary">Xác nhận đặt tour</h4>
                <Row>
                    {/* Main Content - Left */}
                    <Col lg={8}>

                        {/* Header Tour Info Card */}
                        <div className="section-box mb-4">
                            <Row className="g-3">
                                <Col md={4}>
                                    <div className="rounded-3 overflow-hidden h-100">
                                        <img
                                            src="https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?q=80&w=2664&auto=format&fit=crop"
                                            alt="Tour Details"
                                            className="w-100 h-100 object-fit-cover"
                                            style={{ minHeight: '160px' }}
                                        />
                                    </div>
                                </Col>
                                <Col md={8}>
                                    <div className="d-flex align-items-center gap-2 mb-2">
                                        <div className="text-warning small">
                                            <i className="bi bi-star-fill"></i>
                                            <i className="bi bi-star-fill"></i>
                                            <i className="bi bi-star-fill"></i>
                                        </div>
                                        <Badge bg="light" text="dark" className="border fw-normal">Giảm giá đặc biệt</Badge>
                                    </div>
                                    <h5 className="fw-bold text-primary mb-1">Tour Cù Lao Chàm</h5>
                                    <div className="text-secondary small mb-3">
                                        <i className="bi bi-geo-alt-fill me-1"></i> 269 Trần Hưng Đạo, Sơn Trà, Đà Nẵng
                                    </div>
                                    <div className="d-flex flex-column gap-1 text-dark small fw-medium">
                                        <div>Check-in: <span className="fw-bold">Thứ Năm, ngày 20/11/2025</span></div>
                                        <div>Check-out: <span className="fw-bold">Thứ Bảy, ngày 22/11/2025</span></div>
                                        <div><i className="bi bi-people-fill me-1 text-secondary"></i> 2 người</div>
                                    </div>
                                </Col>
                            </Row>
                        </div>

                        {/* Guest Info */}
                        <div className="section-box mb-4">
                            <h5 className="section-title text-primary mb-3">Thông tin hành khách lưu trú</h5>
                            <Row className="g-3">
                                <Col md={12}>
                                    <Form.Group>
                                        <Form.Label className="fw-bold small">Danh xưng <span className="text-danger">*</span></Form.Label>
                                        <Form.Select className="bg-light border-light py-2">
                                            <option>Ông</option>
                                            <option>Bà</option>
                                            <option>Cô</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label className="fw-bold small">Họ <span className="text-danger">*</span></Form.Label>
                                        <Form.Control type="text" placeholder="Họ trên CCCD (không dấu)" className="bg-light border-light py-2" />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label className="fw-bold small">Tên <span className="text-danger">*</span></Form.Label>
                                        <Form.Control type="text" placeholder="Tên trên CCCD (không dấu)" className="bg-light border-light py-2" />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label className="fw-bold small">Ngày sinh <span className="text-danger">*</span></Form.Label>
                                        <Form.Control type="text" placeholder="DD/MM/YY" className="bg-light border-light py-2" />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label className="fw-bold small">Quốc tịch <span className="text-danger">*</span></Form.Label>
                                        <Form.Select className="bg-light border-light py-2">
                                            <option>Việt Nam</option>
                                            <option>Quốc tế</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>
                        </div>

                        {/* Payment Section */}
                        <div className="section-box">
                            <h5 className="section-title text-primary mb-3">Thanh toán</h5>

                            <div className="mb-4">
                                <Form.Label className="fw-bold small">Mã khuyến mãi/Voucher</Form.Label>
                                <Row className="g-2 mb-3">
                                    <Col>
                                        <Form.Control type="text" placeholder="Nhập mã khuyến mãi" className="bg-light border-light" />
                                    </Col>
                                    <Col xs="auto">
                                        <Button variant="primary" className="apply-btn fw-bold px-4">Áp dụng</Button>
                                    </Col>
                                </Row>
                                <div className="voucher-tags mt-2">
                                    <span className="voucher-tag badge bg-light text-success border border-success border-opacity-25 rounded-pill px-3 py-2 me-2 fw-normal">
                                        <i className="bi bi-tag-fill me-1"></i> TRIPFL30
                                    </span>
                                    <span className="voucher-tag badge bg-light text-success border border-success border-opacity-25 rounded-pill px-3 py-2 me-2 fw-normal">
                                        <i className="bi bi-tag-fill me-1"></i> TETANVUI
                                    </span>
                                    <span className="voucher-tag badge bg-light text-success border border-success border-opacity-25 rounded-pill px-3 py-2 me-2 fw-normal">
                                        <i className="bi bi-tag-fill me-1"></i> TRIPGO20
                                    </span>
                                </div>
                            </div>

                            <div className="payment-methods-tabs d-flex gap-2 mb-4">
                                <button
                                    className={`pm-tab btn rounded-pill px-4 py-2 fw-bold text-nowrap ${paymentMethod === 'international' ? 'btn-outline-primary active bg-primary text-white' : 'btn-outline-secondary text-dark border-opacity-25'}`}
                                    onClick={() => handlePaymentMethodChange('international')}
                                >
                                    Thẻ quốc tế
                                </button>
                                <button
                                    className={`pm-tab btn rounded-pill px-4 py-2 fw-bold text-nowrap ${paymentMethod === 'wallet' ? 'btn-outline-primary active bg-primary text-white' : 'btn-outline-secondary text-dark border-opacity-25'}`}
                                    onClick={() => handlePaymentMethodChange('wallet')}
                                >
                                    Ví điện tử
                                </button>
                                <button
                                    className={`pm-tab btn rounded-pill px-4 py-2 fw-bold text-nowrap ${paymentMethod === 'bank' ? 'btn-outline-primary active bg-primary text-white' : 'btn-outline-secondary text-dark border-opacity-25'}`}
                                    onClick={() => handlePaymentMethodChange('bank')}
                                >
                                    Ngân hàng nội địa
                                </button>
                            </div>

                            <div className="payment-content mb-4">
                                {paymentMethod === 'international' && (
                                    <div className="card-form">
                                        <Row>
                                            <Col md={12} className="mb-3">
                                                <Form.Group>
                                                    <Form.Label className="fw-bold small">Số thẻ</Form.Label>
                                                    <Form.Control type="text" placeholder="XXXXXXXXXXXX" className="bg-light border-light py-2" />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6} className="mb-3">
                                                <Form.Group>
                                                    <Form.Label className="fw-bold small">Ngày hết hạn</Form.Label>
                                                    <Form.Control type="text" placeholder="MM/YY" className="bg-light border-light py-2" />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6} className="mb-3">
                                                <Form.Group>
                                                    <Form.Label className="fw-bold small">CVV</Form.Label>
                                                    <Form.Control type="text" placeholder="123" className="bg-light border-light py-2" />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                    </div>
                                )}

                                {paymentMethod === 'bank' && (
                                    <div className="text-muted small">Chọn ngân hàng để tiếp tục...</div>
                                )}

                                {paymentMethod === 'wallet' && (
                                    <div className="text-muted small">Chọn ví điện tử để tiếp tục...</div>
                                )}
                            </div>

                            <div className="mb-4">
                                <Form.Check
                                    type="checkbox"
                                    id="terms-check"
                                    label={<span className="small text-secondary">Tôi đồng ý với <a href="#" className="text-info text-decoration-none">điều khoản và chính sách</a> hoàn vé</span>}
                                />
                            </div>

                            <Button className="w-100 fw-bold py-2 rounded-3" variant="primary">Thanh toán</Button>

                        </div>

                    </Col>

                    {/* Sidebar - Right */}
                    <Col lg={4}>
                        {/* Bill Summary */}
                        <div className="section-box mb-4">
                            <h5 className="section-title text-primary mb-3">Hoá đơn</h5>
                            <div className="d-flex justify-content-between mb-2 small fw-medium text-secondary">
                                <span>Giá phòng (1 đêm)</span>
                                <span className="text-dark fw-bold">575.000đ</span>
                            </div>
                            <div className="d-flex justify-content-between mb-3 small fw-medium text-secondary">
                                <span>Thuế và phí</span>
                                <span className="text-dark fw-bold">150.000đ</span>
                            </div>
                            <hr className="my-3 opacity-10" />
                            <div className="d-flex justify-content-between align-items-center">
                                <span className="fw-bold text-dark">Tổng cộng</span>
                                <span className="text-info fs-5 fw-bold">725.000đ</span>
                            </div>
                        </div>

                        {/* Special Requests */}
                        <div className="section-box">
                            <h5 className="section-title text-primary mb-3">Yêu cầu khác</h5>
                            <p className="text-muted x-small mb-3">
                                Các yêu cầu đặc biệt sẽ được chuyển đến khách sạn và tuỳ thuộc vào tình trạng sẵn có
                            </p>
                            <Form.Control
                                as="textarea"
                                rows={5}
                                placeholder="VD: Nhận phòng sớm,..."
                                className="bg-light border-light rounded-3 small"
                            />
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Payment_Tour;
