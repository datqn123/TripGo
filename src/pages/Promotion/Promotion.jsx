import React from 'react';
import { Container, Row, Col, Card, Accordion, Table, Button } from 'react-bootstrap';
import './promotion.css';
import background from '../../assets/images/tour/Banner.png'
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
            <div className="promo-banner-section mb-5" style={{ backgroundImage: `url(${background})` }}>
                <div className="promo-banner-content text-center text-white">
                    <h1 className="banner-title">TRIP GO PRIORITY</h1>
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
                        <div className="d-inline-block border rounded-pill px-3 py-1 text-info mb-3 border-info bg-light">
                            <i className="bi bi-star me-2"></i>Hệ thống tích điểm
                        </div>
                        <h3 className="fw-bold text-primary-custom" style={{ fontSize: '2rem' }}>TripGo Points</h3>
                        <p className="text-muted">Tích điểm cho mỗi chuyến đi hoàn thành. Càng đi nhiều, càng nhận được nhiều ưu đãi</p>
                    </div>

                    <div className="points-dashboard-card p-5 text-white">
                        <Row className="align-items-center">
                            <Col md={7}>
                                <h4 className="fw-bold mb-4">Cách thức hoạt động</h4>
                                <div className="step-item d-flex gap-3 mb-4">
                                    <div className="step-num">1</div>
                                    <div className="step-text">Đặt và hoàn thành chuyến đi của bạn trên TripGo</div>
                                </div>
                                <div className="step-item d-flex gap-3 mb-4">
                                    <div className="step-num">2</div>
                                    <div className="step-text">Nhận điểm thưởng dựa trên giá trị đơn hàng</div>
                                </div>
                                <div className="step-item d-flex gap-3">
                                    <div className="step-num">3</div>
                                    <div className="step-text">Sử dụng điểm để đổi voucher hoặc nâng hạng dịch vụ</div>
                                </div>
                            </Col>
                            <Col md={5} className="text-center">
                                <div className="circle-progress">
                                    <div className="circle-content">
                                        <div className="points-number">725</div>
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
                        <div className="d-inline-block border rounded-pill px-3 py-1 text-info mb-3 border-info bg-light">
                            <i className="bi bi-stars me-2"></i>Đặc quyền thành viên
                        </div>
                        <h2 className="fw-bold text-primary-custom" style={{ fontSize: '2rem' }}>Quyền lợi độc quyền</h2>
                        <p className="text-muted mt-2">Hàng trăm ưu đãi và đặc quyền đang chờ đón bạn</p>
                    </div>
                </div>

                {/* 4. Feature Blocks (Zig-Zag Layout) */}
                <div className="feature-blocks-container mb-5">
                    {/* Block 1: Image Left, Text Right */}
                    <Row className="align-items-center mb-5 gx-5">
                        <Col lg={6}>
                            <div className="feature-img-wrapper rounded-4 overflow-hidden shadow-sm">
                                <img src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80" alt="Resort" className="img-fluid w-100" />
                            </div>
                        </Col>
                        <Col lg={6}>
                            <div className="feature-content-side ps-lg-4">
                                <div className="d-inline-block border rounded-pill px-3 py-1 text-info mb-3 border-info bg-light small fw-bold">
                                    <i className="bi bi-gem me-2"></i>Đặc biệt
                                </div>
                                <h3 className="fw-bold mb-3 text-primary-custom display-6" style={{ fontSize: '2rem' }}>Nghỉ dưỡng hạng sang</h3>
                                <p className="text-muted mb-4 lead fs-6">Trải nghiệm những kỳ nghỉ đẳng cấp 5 sao với mức giá ưu đãi đặc biệt dành riêng cho thành viên Priority. Từ resort biển nhiệt đới đến khách sạn boutique sang trọng.</p>
                                <Button variant="info" className="text-white px-4 py-2 rounded-3 fw-bold">Khám phá ngay</Button>
                            </div>
                        </Col>
                    </Row>

                    {/* Block 2: Text Left, Image Right */}
                    <Row className="align-items-center mb-5 gx-5">
                        <Col lg={6} className="order-2 order-lg-1">
                            <div className="feature-content-side pe-lg-4">
                                <div className="d-inline-block border rounded-pill px-3 py-1 text-info mb-3 border-info bg-light small fw-bold">
                                    <i className="bi bi-compass me-2"></i>Phiêu lưu
                                </div>
                                <h3 className="fw-bold mb-3 text-primary-custom display-6" style={{ fontSize: '2rem' }}>Trải nghiệm mạo hiểm</h3>
                                <p className="text-muted mb-4 lead fs-6">Tham gia những chuyến phiêu lưu độc đáo, từ leo núi chinh phục đỉnh cao đến khám phá thiên nhiên hoang dã. Nhận ưu đãi 25% cho các tour mạo hiểm.</p>
                                <Button variant="info" className="text-white px-4 py-2 rounded-3 fw-bold">Xem các tour</Button>
                            </div>
                        </Col>
                        <Col lg={6} className="order-1 order-lg-2">
                            <div className="feature-img-wrapper rounded-4 overflow-hidden shadow-sm">
                                <img src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80" alt="Resort" className="img-fluid w-100" />
                            </div>
                        </Col>
                    </Row>
                </div>

                {/* 5. Comparison Table */}
                <div className="comparison-section mb-5">
                    <h2 className="section-title text-center mb-5 text-primary-custom">So sánh quyền lợi các hạng thành viên</h2>
                    <div className="table-responsive rounded-4 shadow-sm bg-white p-3">
                        <Table hover className="comparison-table align-middle">
                            <thead>
                                <tr className="text-center bg-light">
                                    <th className="text-start py-4 ps-4">Quyền lợi</th>
                                    <th className="py-4"><span className="badge-tier explorer">Explorer</span></th>
                                    <th className="py-4"><span className="badge-tier traveler">Traveler</span></th>
                                    <th className="py-4"><span className="badge-tier adventurer">Adventurer</span></th>
                                    <th className="py-4"><span className="badge-tier elite">Elite</span></th>
                                    <th className="py-4"><span className="badge-tier infinity">Infinity</span></th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Group 1: Tích điểm */}
                                <tr className="table-group-header "><td colSpan="6" className="fw-bold bg-light ps-4 py-2">Tích điểm</td></tr>
                                <tr className="text-center">
                                    <td className="text-start ps-4">Tỉ lệ tích điểm</td>
                                    <td>x1</td>
                                    <td>x1.2</td>
                                    <td>x1.5</td>
                                    <td>x2</td>
                                    <td>x3</td>
                                </tr>
                                <tr className="text-center">
                                    <td className="text-start ps-4">Điểm thưởng sinh nhật</td>
                                    <td><i className="bi bi-x-lg text-muted opacity-50"></i></td>
                                    <td>500</td>
                                    <td>1.000</td>
                                    <td>2.000</td>
                                    <td>5.000</td>
                                </tr>
                                <tr className="text-center">
                                    <td className="text-start ps-4">Điểm không hết hạn</td>
                                    <td><i className="bi bi-check-lg text-success fs-5"></i></td>
                                    <td><i className="bi bi-check-lg text-success fs-5"></i></td>
                                    <td><i className="bi bi-check-lg text-success fs-5"></i></td>
                                    <td><i className="bi bi-check-lg text-success fs-5"></i></td>
                                    <td><i className="bi bi-check-lg text-success fs-5"></i></td>
                                </tr>

                                {/* Group 2: Ưu đãi & Khuyến mãi */}
                                <tr className="table-group-header"><td colSpan="6" className="fw-bold bg-light ps-4 py-2 mt-2">Ưu đãi và khuyến mãi</td></tr>
                                <tr className="text-center">
                                    <td className="text-start ps-4">Giảm giá khách sạn</td>
                                    <td>5%</td>
                                    <td>10%</td>
                                    <td>15%</td>
                                    <td>20%</td>
                                    <td>30%</td>
                                </tr>
                                <tr className="text-center">
                                    <td className="text-start ps-4">Voucher hằng tháng</td>
                                    <td><i className="bi bi-x-lg text-muted opacity-50"></i></td>
                                    <td><i className="bi bi-check-lg text-success fs-5"></i></td>
                                    <td><i className="bi bi-check-lg text-success fs-5"></i></td>
                                    <td><i className="bi bi-check-lg text-success fs-5"></i></td>
                                    <td><i className="bi bi-check-lg text-success fs-5"></i></td>
                                </tr>
                                <tr className="text-center">
                                    <td className="text-start ps-4">Ưu tiên đặt phòng sớm</td>
                                    <td><i className="bi bi-x-lg text-muted opacity-50"></i></td>
                                    <td><i className="bi bi-x-lg text-muted opacity-50"></i></td>
                                    <td><i className="bi bi-check-lg text-success fs-5"></i></td>
                                    <td><i className="bi bi-check-lg text-success fs-5"></i></td>
                                    <td><i className="bi bi-check-lg text-success fs-5"></i></td>
                                </tr>
                                <tr className="text-center">
                                    <td className="text-start ps-4">Flash Sale độc quyền</td>
                                    <td><i className="bi bi-x-lg text-muted opacity-50"></i></td>
                                    <td><i className="bi bi-x-lg text-muted opacity-50"></i></td>
                                    <td><i className="bi bi-x-lg text-muted opacity-50"></i></td>
                                    <td><i className="bi bi-check-lg text-success fs-5"></i></td>
                                    <td><i className="bi bi-check-lg text-success fs-5"></i></td>
                                </tr>

                                {/* Group 3: Dịch vụ cao cấp */}
                                <tr className="table-group-header"><td colSpan="6" className="fw-bold bg-light ps-4 py-2 mt-2">Dịch vụ cao cấp</td></tr>
                                <tr className="text-center">
                                    <td className="text-start ps-4">Nâng hạng phòng</td>
                                    <td><i className="bi bi-x-lg text-muted opacity-50"></i></td>
                                    <td><i className="bi bi-x-lg text-muted opacity-50"></i></td>
                                    <td>Theo yêu cầu</td>
                                    <td>Ưu tiên</td>
                                    <td>Đảm bảo</td>
                                </tr>
                                <tr className="text-center">
                                    <td className="text-start ps-4">Late check-out</td>
                                    <td><i className="bi bi-x-lg text-muted opacity-50"></i></td>
                                    <td><i className="bi bi-x-lg text-muted opacity-50"></i></td>
                                    <td>+2h</td>
                                    <td>+4h</td>
                                    <td>Linh hoạt</td>
                                </tr>
                                <tr className="text-center">
                                    <td className="text-start ps-4">Bảo hiểm du lịch</td>
                                    <td><i className="bi bi-x-lg text-muted opacity-50"></i></td>
                                    <td><i className="bi bi-x-lg text-muted opacity-50"></i></td>
                                    <td><i className="bi bi-x-lg text-muted opacity-50"></i></td>
                                    <td>Cơ bản</td>
                                    <td>Cao cấp</td>
                                </tr>
                                <tr className="text-center">
                                    <td className="text-start ps-4">Concierge 24/7</td>
                                    <td><i className="bi bi-x-lg text-muted opacity-50"></i></td>
                                    <td><i className="bi bi-x-lg text-muted opacity-50"></i></td>
                                    <td><i className="bi bi-x-lg text-muted opacity-50"></i></td>
                                    <td><i className="bi bi-check-lg text-success fs-5"></i></td>
                                    <td><i className="bi bi-check-lg text-success fs-5"></i></td>
                                </tr>
                            </tbody>
                        </Table>
                    </div>
                    <div className="text-center mt-5">
                        <div className="d-inline-block border rounded-pill px-4 py-2 text-info border-info bg-white fw-bold" role="button">
                            <i className="bi bi-question-circle me-2"></i>Đặc quyền thành viên
                        </div>
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
