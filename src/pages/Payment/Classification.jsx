import React, { useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import "./classification.css";
import logo from "../../assets/images/icons/VietnamAirlines.png";
import Banner from "../../components/Banner/Banner";

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
    <>
    <Banner/>
    <div className="classification-page">
      <Container className="py-5">
        {/* Flight Summary Card */}
        <div className="flight-summary-card">
          <Row className="align-items-center">
            <Col md={8}>
              <div className="flight-summary-label">Khởi hành</div>
              <div className="d-flex align-items-center gap-3 mb-2">
                <h3 className="flight-code mb-0">DAD</h3>
                <i className="bi bi-arrow-left-right text-dark fs-5"></i>
                <h3 className="flight-code mb-0">HAN</h3>
              </div>
              <div className="flight-date">Thứ Sáu, 28/12/2025</div>
              <span className="flight-badge">Khứ hồi</span>
            </Col>
            <Col md={4} className="text-end flight-right-col">
              <div className="flight-time">13:00 - 14:10</div>
              <div className="flight-airline">
                <img src={logo} alt="VNA" height="24" className="airline-logo" />
                <span>Vietnam Airlines</span>
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
        <Row className="g-4 justify-content-center">
          {tickets.map((ticket, index) => (
            <Col lg={4} md={6} key={index}>
              <Card className="ticket-card h-100">
                <Card.Body className="d-flex flex-column p-4">
                  <h5 className="ticket-name">{ticket.name}</h5>
                  <h3 className="ticket-price">{ticket.price}<small>/khách</small></h3>

                  <div className="features-list flex-grow-1">
                    {ticket.features.map((feature, idx) => (
                      <div className="feature-item mb-3" key={idx}>
                        <i className={`fs-5 me-2 bi ${feature.included ? 'bi-check-lg text-success' : 'bi-x-lg text-secondary'}`}></i>
                        <span className={feature.included ? 'feature-text included' : 'feature-text'}>{feature.text}</span>
                      </div>
                    ))}
                  </div>

                  <hr className="ticket-divider" />

                  <p className="ticket-note">{ticket.note}</p>

                  <Button className="select-btn w-100 py-2">Chọn</Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
    </>
    
  );
};

export default Classification;
