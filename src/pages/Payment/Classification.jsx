import React, { useState } from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import "./classification.css";
// Import icons if needed (using bootstrap icons)
import logo from "../../assets/images/icons/VietnamAirlines.png";

const Classification = () => {
  const [activeTab, setActiveTab] = useState("economy");

  const economyTickets = [
    {
      name: "Economy",
      price: "2.090.000đ",
      features: [
        { text: "Hành lý xách tay 7kg", included: true },
        { text: "Hành lý ký gửi", included: false },
        { text: "Hoàn vé", included: false },
        { text: "Đổi vé", included: false },
        { text: "Bảo hiểm du lịch", included: false },
      ],
      note: "Vé điện tử sẽ được phát hành trong vòng 2 giờ sau khi thanh toán",
    },
    {
      name: "Standard",
      price: "2.590.000đ",
      features: [
        { text: "Hành lý xách tay 7kg", included: true },
        { text: "Hành lý ký gửi 20kg", included: true },
        { text: "Hoàn vé", included: false },
        { text: "Đổi vé (có phí)", included: true },
        { text: "Bảo hiểm du lịch", included: false },
      ],
      note: "Vé điện tử sẽ được phát hành trong vòng 2 giờ sau khi thanh toán",
    },
    {
      name: "Economy Flex",
      price: "3.290.000đ",
      features: [
        { text: "Hành lý xách tay 7kg", included: true },
        { text: "Hành lý ký gửi 25kg", included: true },
        { text: "Hoàn vé (có phí)", included: true },
        { text: "Đổi vé (có phí)", included: true },
        { text: "Bảo hiểm du lịch", included: true },
      ],
      note: "Vé điện tử sẽ được phát hành trong vòng 2 giờ sau khi thanh toán",
    },
  ];

  const businessTickets = [
    {
      name: "Business",
      price: "8.690.000đ",
      features: [
        { text: "Hành lý xách tay 14kg", included: true },
        { text: "Hành lý ký gửi 30kg", included: true },
        { text: "Suất ăn đặc biệt", included: true },
        { text: "Ưu tiên làm thủ tục", included: true },
        { text: "Đổi vé (có phí)", included: true },
      ],
      note: "Vé điện tử sẽ được phát hành trong vòng 2 giờ sau khi thanh toán",
    },
    {
      name: "Business Flex",
      price: "10.590.000đ",
      features: [
        { text: "Hành lý xách tay 7kg", included: true },
        { text: "Hành lý ký gửi 40kg", included: true },
        { text: "Hoàn vé (miễn phí)", included: true },
        { text: "Đổi vé (miễn phí)", included: true },
        { text: "Suất ăn đặc biệt", included: true },
        { text: "Ưu tiên làm thủ tục", included: true },
        { text: "Truy cập Lounge", included: true },
      ],
      note: "Vé điện tử sẽ được phát hành trong vòng 2 giờ sau khi thanh toán",
    },
    {
        name: "Business Premium",
        price: "12.390.000đ",
        features: [
          { text: "Hành lý xách tay 7kg", included: true },
          { text: "Hành lý ký gửi 40kg", included: true },
          { text: "Hoàn vé (miễn phí)", included: true },
          { text: "Đổi vé (miễn phí)", included: true },
          { text: "Suất ăn đặc biệt", included: true },
          { text: "Ưu tiên làm thủ tục", included: true },
          { text: "Truy cập Lounge", included: true },
          { text: "Bảo hiểm du lịch cao cấp", included: true },
        ],
        note: "Vé điện tử sẽ được phát hành trong vòng 2 giờ sau khi thanh toán",
      },
  ];

  const tickets = activeTab === "economy" ? economyTickets : businessTickets;

  return (
    <div className="classification-page">
      {/* Header Banner */}
      <div className="class-header-banner">
        <Container>
            <h2 className="text-center text-white mb-0 fw-bold">Chọn loại vé</h2>
        </Container>
      </div>

      <Container className="pb-5">
        {/* Flight Summary Card */}
        <div className="flight-summary-card">
            <Row className="align-items-center">
                <Col md={8}>
                    <div className="text-info fw-bold mb-2">Khởi hành</div>
                    <div className="d-flex align-items-center gap-3 mb-2">
                        <h3 className="mb-0 fw-bold">DAD</h3>
                        <i className="bi bi-arrow-left-right text-dark fs-5"></i>
                        <h3 className="mb-0 fw-bold">HAN</h3>
                    </div>
                    <div className="text-secondary small mb-3">Thứ Sáu, 28/12/2025</div>
                    <span className="badge bg-light-blue text-dark border-0 px-3 py-2 rounded-3">Khứ hồi</span>
                </Col>
                <Col md={4} className="text-end">
                    <div className="fs-4 fw-bold mb-2">13:00 - 14:10</div>
                    <div className="d-flex align-items-center justify-content-end gap-2">
                        <img src={logo} alt="VNA" height="24" className="airline-logo" />
                        <span className="fw-bold text-secondary">Vietnam Airlines</span>
                    </div>
                </Col>
            </Row>
        </div>

        {/* Tabs */}
        <div className="class-tabs-container">
            <div className="class-tabs">
                <button 
                    className={`class-tab ${activeTab === 'economy' ? 'active' : ''}`}
                    onClick={() => setActiveTab('economy')}
                >
                    Phổ thông
                </button>
                <button 
                    className={`class-tab ${activeTab === 'business' ? 'active' : ''}`}
                    onClick={() => setActiveTab('business')}
                >
                    Thương gia
                </button>
            </div>
        </div>

        {/* Dynamic Ticket Cards */}
        <Row className="mt-4 g-4 justify-content-center">
            {tickets.map((ticket, index) => (
                <Col lg={4} md={6} key={index}>
                    <Card className="ticket-card h-100">
                        <Card.Body className="d-flex flex-column p-4">
                            <h5 className="text-secondary fw-normal mb-2">{ticket.name}</h5>
                            <h3 className="text-primary fw-bold mb-3">{ticket.price}<small className="fs-6 text-info fw-normal">/khách</small></h3>
                            
                            <div className="features-list flex-grow-1">
                                {ticket.features.map((feature, idx) => (
                                    <div className="feature-item mb-3" key={idx}>
                                        <i className={`fs-5 me-2 bi ${feature.included ? 'bi-check-lg text-success' : 'bi-x-lg text-secondary'}`}></i>
                                        <span className={feature.included ? 'text-dark fw-medium' : 'text-secondary'}>{feature.text}</span>
                                    </div>
                                ))}
                            </div>

                            <hr className="my-3 text-muted opacity-25" />
                            
                            <p className="text-secondary small mb-4" style={{fontSize: '13px', lineHeight: '1.6'}}>{ticket.note}</p>
                            
                            <Button className="select-btn w-100 py-2">Chọn</Button>
                        </Card.Body>
                    </Card>
                </Col>
            ))}
        </Row>
      </Container>
    </div>
  );
};

export default Classification;
