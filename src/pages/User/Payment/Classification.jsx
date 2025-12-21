import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";
import flightApi from "../../../api/flightApi";
import "./classification.css";
import Banner from "../../../components/User/Banner/Banner";

const currency = (v) => {
  if (v === null || v === undefined) return "";
  return v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ";
};

const Classification = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const flightId = searchParams.get('flightId');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [flightData, setFlightData] = useState(null);
  const [activeTab, setActiveTab] = useState("economy");

  // Check authentication on mount
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken') || localStorage.getItem('token');
    if (!accessToken) {
      // User not logged in, redirect to login
      navigate('/login', { state: { from: `/classification?flightId=${flightId}` } });
    }
  }, [navigate, flightId]);

  // Fetch flight details when component mounts
  useEffect(() => {
    const fetchFlightDetails = async () => {
      if (!flightId) {
        setError("Không tìm thấy mã chuyến bay");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await flightApi.getFlightById(flightId);
        console.log('Flight details:', response.data);

        if (response?.data?.result) {
          setFlightData(response.data.result);
        } else {
          setError("Không thể tải thông tin chuyến bay");
        }
      } catch (err) {
        console.error('Error fetching flight details:', err);
        setError(err.response?.data?.message || "Không thể tải thông tin chuyến bay");
      } finally {
        setLoading(false);
      }
    };

    fetchFlightDetails();
  }, [flightId]);

  if (loading) {
    return (
      <>
        <Banner />
        <div className="classification-page">
          <Container className="py-5 text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Đang tải thông tin chuyến bay...</p>
          </Container>
        </div>
      </>
    );
  }

  if (error || !flightData) {
    return (
      <>
        <Banner />
        <div className="classification-page">
          <Container className="py-5 text-center">
            <p className="text-danger">{error || "Có lỗi xảy ra"}</p>
            <Button onClick={() => navigate(-1)}>Quay lại</Button>
          </Container>
        </div>
      </>
    );
  }

  // Separate flight seats by class type
  const economySeats = flightData.flightSeats?.filter(seat => 
    seat.seatClass.toLowerCase().includes('economy') || seat.seatClass.toLowerCase().includes('standard')
  ) || [];

  const businessSeats = flightData.flightSeats?.filter(seat => 
    seat.seatClass.toLowerCase().includes('business')
  ) || [];

  const currentSeats = activeTab === "economy" ? economySeats : businessSeats;

  // Format features for display
  const getFeatures = (seat) => {
    const features = [];
    
    if (seat.cabinBaggage) {
      features.push({ text: `Hành lý xách tay ${seat.cabinBaggage}`, included: true });
    }
    
    if (seat.checkedBaggage) {
      features.push({ text: `Hành lý ký gửi ${seat.checkedBaggage}`, included: true });
    } else {
      features.push({ text: "Hành lý ký gửi", included: false });
    }
    
    if (seat.isRefundable) {
      features.push({ text: "Hoàn vé", included: true });
    } else {
      features.push({ text: "Hoàn vé", included: false });
    }
    
    if (seat.isChangeable) {
      features.push({ text: "Đổi vé", included: true });
    } else {
      features.push({ text: "Đổi vé", included: false });
    }
    
    if (seat.hasMeal) {
      features.push({ text: "Suất ăn", included: true });
    }
    
    return features;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
    return `${days[date.getDay()]}, ${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  // Format time
  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  return (
    <>
      <Banner />
      <div className="classification-page">
        <Container className="py-5">
          {/* Flight Summary Card */}
          <div className="flight-summary-card">
            <Row className="align-items-center">
              <Col md={8}>
                <div className="flight-summary-label">Khởi hành</div>
                <div className="d-flex align-items-center gap-3 mb-2">
                  <div className="text-center">
                    <h3 className="flight-code mb-0">
                      {flightData.departureAirport?.code || ""}
                    </h3>
                    <div style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>
                      {flightData.departureAirport?.location?.name || ""}
                    </div>
                  </div>
                  <i className="bi bi-arrow-left-right text-dark fs-5"></i>
                  <div className="text-center">
                    <h3 className="flight-code mb-0">
                      {flightData.arrivalAirport?.code || ""}
                    </h3>
                    <div style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>
                      {flightData.arrivalAirport?.location?.name || ""}
                    </div>
                  </div>
                </div>
                <div className="flight-date">
                  {formatDate(flightData.departureTime)}
                </div>
                <span className="flight-badge">
                  {flightData.flightNumber}
                </span>
              </Col>
              <Col md={4} className="text-end flight-right-col">
                <div className="flight-time">
                  {formatTime(flightData.departureTime)} - {formatTime(flightData.arrivalTime)}
                </div>
                <div className="flight-airline">
                  {flightData.airline?.logoUrl && (
                    <img 
                      src={flightData.airline.logoUrl} 
                      alt={flightData.airline.name} 
                      height="24" 
                      className="airline-logo" 
                    />
                  )}
                  <span>{flightData.airline?.name || ""}</span>
                </div>
              </Col>
            </Row>
          </div>

          {/* Dynamic Ticket Cards from API - All seat types */}
          <Row className="g-4 justify-content-center">
            {flightData.flightSeats?.length === 0 ? (
              <Col className="text-center py-5">
                <p className="text-muted">Không có loại ghế nào khả dụng</p>
              </Col>
            ) : (
              flightData.flightSeats.map((seat) => (
                <Col lg={4} md={6} key={seat.id}>
                  <Card className="ticket-card h-100">
                    <Card.Body className="d-flex flex-column p-4">
                      <h5 className="ticket-name">{seat.seatClass}</h5>
                      <h3 className="ticket-price">
                        {currency(seat.price)}
                        <small>/khách</small>
                      </h3>

                      <div className="features-list flex-grow-1">
                        {getFeatures(seat).map((feature, idx) => (
                          <div className="feature-item mb-3" key={idx}>
                            <i className={`fs-5 me-2 bi ${feature.included ? 'bi-check-lg text-success' : 'bi-x-lg text-secondary'}`}></i>
                            <span className={feature.included ? 'feature-text included' : 'feature-text'}>
                              {feature.text}
                            </span>
                          </div>
                        ))}
                      </div>

                      <hr className="ticket-divider" />

                      <p className="ticket-note">
                        Còn {seat.availableQuantity} ghế trống
                      </p>

                      <Button 
                        className="select-btn w-100 py-2"
                        onClick={() => {
                          // Save flight and seat data to localStorage
                          const bookingData = {
                            flight: {
                              id: flightData.id,
                              flightNumber: flightData.flightNumber,
                              airline: flightData.airline,
                              departureAirport: flightData.departureAirport,
                              arrivalAirport: flightData.arrivalAirport,
                              departureTime: flightData.departureTime,
                              arrivalTime: flightData.arrivalTime,
                              duration: flightData.duration
                            },
                            seat: {
                              id: seat.id,
                              seatClass: seat.seatClass,
                              price: seat.price,
                              cabinBaggage: seat.cabinBaggage,
                              checkedBaggage: seat.checkedBaggage,
                              isRefundable: seat.isRefundable,
                              isChangeable: seat.isChangeable,
                              hasMeal: seat.hasMeal
                            }
                          };
                          
                          localStorage.setItem('flightBooking', JSON.stringify(bookingData));
                          navigate(`/payment-plane`);
                        }}
                        disabled={seat.availableQuantity === 0}
                      >
                        {seat.availableQuantity > 0 ? 'Chọn' : 'Hết chỗ'}
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            )}
          </Row>
        </Container>
      </div>
    </>
  );
};

export default Classification;
