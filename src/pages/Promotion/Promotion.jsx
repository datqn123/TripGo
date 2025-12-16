import React from 'react';
import { Container, Row, Col, Card, Accordion, Table, Button } from 'react-bootstrap';
import './promotion.css';

const Promotion = () => {
    const tiers = [
        {
            id: 'explorer',
            name: 'Explorer',
            color: '#a0785a', // Brown
            icon: 'bi-compass',
            desc: 'Bắt đầu hành trình khám phá',
            points: '0 - 999 điểm',
            bgIcon: '#C8A88F' // Lighter shade for icon bg
        },
        {
            id: 'traveler',
            name: 'Traveler',
            color: '#3b82f6', // Blue
            icon: 'bi-briefcase',
            desc: 'Người đam mê khám phá',
            points: '1.000 - 4.999 điểm',
            bgIcon: '#93c5fd'
        },
        {
            id: 'adventurer',
            name: 'Adventurer',
            color: '#14b8a6', // Teal
            icon: 'bi-tree',
            desc: 'Nhà thám hiểm chuyên nghiệp',
            points: '5.000 - 14.999 điểm',
            bgIcon: '#5eead4'
        },
        {
            id: 'elite',
            name: 'Elite',
            color: '#f59e0b', // Orange
            icon: 'bi-crown',
            desc: 'Thành viên VIP cao cấp',
            points: '15.000 - 29.999 điểm',
            bgIcon: '#fcd34d'
        },
        {
            id: 'infinity',
            name: 'Infinity',
            color: '#8b5cf6', // Purple
            icon: 'bi-gem',
            desc: 'Đỉnh cao trải nghiệm',
            points: '30.000+ điểm',
            bgIcon: '#c4b5fd'
        }
    ];

    const benefits = [
        { icon: 'bi-bag-check', title: 'Miễn phí hành lý', desc: 'Mang thêm hành lý ký gửi không tính phí' },
        { icon: 'bi-person-check', title: 'Ưu tiên check-in', desc: 'Làm thủ tục tại quầy ưu tiên' },
        { icon: 'bi-tag', title: 'Ưu đãi đặt phòng', desc: 'Giảm giá đặc biệt cho khách sạn' },
        { icon: 'bi-gift', title: 'Quà tặng sinh nhật', desc: 'Nhận quà vào tháng sinh nhật' },
        { icon: 'bi-arrow-left-right', title: 'Đổi vé linh hoạt', desc: 'Miễn phí đổi vé 1 lần' },
        { icon: 'bi-cup-hot', title: 'Phòng chờ hạng thương gia', desc: 'Sử dụng phòng chờ tại sân bay' },
        { icon: 'bi-headset', title: 'Hỗ trợ 24/7', desc: 'Đường dây nóng hỗ trợ ưu tiên' },
        { icon: 'bi-ticket-perforated', title: 'Voucher dịch vụ', desc: 'Nhận voucher hàng tháng' }
    ];

    const faqs = [
        "Làm thế nào để kiểm tra điểm tích lũy của tôi?",
        "Điểm thưởng có hết hạn không?",
        "Cách thăng hạng thành viên?",
        "Quyền lợi đổi vé áp dụng như thế nào?",
        "Tôi có thể chuyển điểm cho người khác không?",
        "Voucher giảm giá có được áp dụng đồng thời?",
        "Làm sao để đổi điểm lấy quà tặng?",
        "Ai có thể vào phòng chờ thương gia?"
    ];

    return (
        <div className="promotion-page">
            {/* Banner Section (Optional placeholder if needed, skipping as per instruction "from Hạng thành viên") */}
            <div className="promo-banner-section mb-5">
                <div className="promo-banner-content text-center text-white">
                    <h1 className="fw-bold display-5">TRIP GO PRIORITY</h1>
                    <p className="lead">Nâng tầm trải nghiệm với đặc quyền dành riêng cho bạn</p>
                    <div className="d-flex justify-content-center gap-3 mt-4">
                        <Button variant="info" className="text-white px-4">Khám phá ngay</Button>
                        <Button variant="outline-light" className="px-4">Tìm hiểu thêm</Button>
                    </div>
                </div>
            </div>

            <Container>
                {/* 1. Membership Tiers */}
                <div className="text-center mb-5">
                    <h2 className="section-title">Hạng thành viên</h2>
                    <p className="text-muted">Tích lũy điểm thưởng để thăng hạng và nhận nhiều ưu đãi</p>
                </div>

                <div className="tiers-container mb-5">
                    <Row className="g-4 justify-content-center">
                        {tiers.map(tier => (
                            <Col key={tier.id} xl={2} lg={4} md={6}> {/* 5 cols on XL is hard with grid, custom flex might be better or 2/12 approx -> use 'col-xl-custom' or just auto */}
                                <div className={`tier-card ${tier.id}`}>
                                    <div className="tier-icon-wrapper" style={{ background: tier.color }}>
                                        <i className={`bi ${tier.icon}`}></i>
                                    </div>
                                    <h4 className="tier-name" style={{ color: tier.color }}>{tier.name}</h4>
                                    <p className="tier-desc">{tier.desc}</p>
                                    <div className="tier-points">{tier.points}</div>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </div>

                {/* 2. TripGo Points */}
                <div className="points-section mb-5">
                    <div className="text-center mb-4">
                        <span className="badge-pill">TripGo Points</span>
                        <h3 className="mt-2 fw-bold text-primary-custom">TripGo Points</h3>
                        <p className="text-muted">Tích lũy điểm mỗi chuyến đi để đổi lấy hàng ngàn quà tặng hấp dẫn</p>
                    </div>

                    <div className="points-dashboard-card p-4 text-white">
                        <Row className="align-items-center">
                            <Col md={7}>
                                <h4 className="fw-bold mb-4">Cách thức hoạt động</h4>
                                <div className="step-item d-flex gap-3 mb-3">
                                    <div className="step-num">1</div>
                                    <div>Đặt vé máy bay, khách sạn hoặc tour du lịch</div>
                                </div>
                                <div className="step-item d-flex gap-3 mb-3">
                                    <div className="step-num">2</div>
                                    <div>Tích điểm thưởng tương ứng với giá trị đơn hàng</div>
                                </div>
                                <div className="step-item d-flex gap-3">
                                    <div className="step-num">3</div>
                                    <div>Sử dụng điểm để đổi quà hoặc thanh toán chuyến đi tiếp theo</div>
                                </div>
                            </Col>
                            <Col md={5} className="text-center">
                                <div className="circle-progress">
                                    <div className="circle-content">
                                        <div className="display-4 fw-bold">725</div>
                                        <div className="small">Điểm hiện tại</div>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>

                {/* 3. Exclusive Benefits */}
                <div className="benefits-section mb-5">
                    <div className="text-center mb-5">
                        <span className="badge-pill-outline">Đặc quyền hội viên</span>
                        <h2 className="section-title mt-2">Quyền lợi độc quyền</h2>
                        <p className="text-muted">Nâng cao trải nghiệm du lịch với các ưu đãi đặc biệt</p>
                    </div>

                    <Row className="g-4">
                        {benefits.map((benefit, idx) => (
                            <Col key={idx} md={3} sm={6}>
                                <div className="benefit-card">
                                    <div className="benefit-icon">
                                        <i className={`bi ${benefit.icon}`}></i>
                                    </div>
                                    <h5 className="benefit-title">{benefit.title}</h5>
                                    <p className="benefit-desc">{benefit.desc}</p>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </div>

                {/* 4. Feature Blocks */}
                <Row className="mb-5 feature-blocks g-4">
                    <Col md={6}>
                        <div className="feature-block resort">
                            <div className="feature-content">
                                <span className="feature-tag">Ưu đãi mới</span>
                                <h3>Nghỉ dưỡng hạng sang</h3>
                                <p>Trải nghiệm kỳ nghỉ đẳng cấp tại các resort 5 sao với giá ưu đãi dành riêng cho thành viên</p>
                                <Button className="btn-feature">Xem chi tiết</Button>
                            </div>
                        </div>
                    </Col>
                    <Col md={6}>
                        <div className="feature-block adventure">
                            <div className="feature-content">
                                <span className="feature-tag">Trải nghiệm</span>
                                <h3>Trải nghiệm mạo hiểm</h3>
                                <p>Tham gia các hoạt động thể thao, leo núi, chèo thuyền với huấn luyện viên chuyên nghiệp</p>
                                <Button className="btn-feature">Xem chi tiết</Button>
                            </div>
                        </div>
                    </Col>
                </Row>

                {/* 5. Comparison Table */}
                <div className="comparison-section mb-5">
                    <h2 className="section-title text-center mb-4 text-primary-custom">So sánh quyền lợi các hạng thành viên</h2>
                    <div className="table-responsive">
                        <Table hover className="comparison-table">
                            <thead>
                                <tr>
                                    <th>Quyền lợi</th>
                                    <th className="color-explorer">Explorer</th>
                                    <th className="color-traveler">Traveler</th>
                                    <th className="color-adventurer">Adventurer</th>
                                    <th className="color-elite">Elite</th>
                                    <th className="color-infinity">Infinity</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Tích lũy điểm</td>
                                    <td>x1</td>
                                    <td>x1.2</td>
                                    <td>x1.5</td>
                                    <td>x2</td>
                                    <td>x3</td>
                                </tr>
                                <tr>
                                    <td>Điểm thưởng sinh nhật</td>
                                    <td>-</td>
                                    <td>500</td>
                                    <td>1000</td>
                                    <td>2000</td>
                                    <td>5000</td>
                                </tr>
                                <tr>
                                    <td>Miễn phí hành lý</td>
                                    <td><i className="bi bi-check text-success"></i></td>
                                    <td><i className="bi bi-check text-success"></i></td>
                                    <td><i className="bi bi-check text-success"></i></td>
                                    <td><i className="bi bi-check text-success"></i></td>
                                    <td><i className="bi bi-check text-success"></i></td>
                                </tr>
                                <tr>
                                    <td>Phòng chờ hạng thương gia</td>
                                    <td>-</td>
                                    <td>-</td>
                                    <td>Giảm 50%</td>
                                    <td>Miễn phí</td>
                                    <td>Miễn phí + 1 khách</td>
                                </tr>
                            </tbody>
                        </Table>
                    </div>
                    <div className="text-center mt-3">
                        <Button variant="outline-info">Xem toàn bộ quyền lợi</Button>
                    </div>
                </div>

                {/* 6. FAQ */}
                <div className="faq-section mb-5 pb-5">
                    <h2 className="section-title text-center mb-4 text-primary-custom">Câu hỏi thường gặp</h2>
                    <Row className="justify-content-center">
                        <Col lg={8}>
                            <Accordion>
                                {faqs.map((faq, index) => (
                                    <Accordion.Item eventKey={index.toString()} key={index}>
                                        <Accordion.Header>
                                            <div className="d-flex align-items-center gap-3">
                                                <i className="bi bi-question-circle text-primary"></i>
                                                {faq}
                                            </div>
                                        </Accordion.Header>
                                        <Accordion.Body>
                                            Nội dung trả lời cho câu hỏi "{faq}". Các chính sách và quy định có thể thay đổi tùy theo thời điểm. Vui lòng liên hệ bộ phận CSKH để được hỗ trợ chi tiết nhất.
                                        </Accordion.Body>
                                    </Accordion.Item>
                                ))}
                            </Accordion>
                        </Col>
                    </Row>
                </div>

            </Container>
        </div>
    );
};

export default Promotion;
