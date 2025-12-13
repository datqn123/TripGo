import React, { useState } from "react";
import "./payment.css";
import logo from "../../assets/images/icons/VietnamAirlines.png";
import { Container, Row, Col, Form, Button } from "react-bootstrap";

const Payment = () => {
  const [paymentMethod, setPaymentMethod] = useState("bank"); // international, wallet, bank
  const [baggage, setBaggage] = useState(0);

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

  return (
    <div className="payment-page">
      <div className="payment-header-bg"></div>
      <Container>
        <Row>
          {/* Left Column - Forms */}
          <Col lg={8}>
            {/* Contact & Passenger Info Unified Section */}
            <div className="section-box">
              <h5 className="section-title">Thông tin liên hệ</h5>
              <Row>
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Họ <span className="text-danger">*</span></Form.Label>
                    <Form.Control type="text" defaultValue="Nguyễn" className="bg-white" />
                  </Form.Group>
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Tên <span className="text-danger">*</span></Form.Label>
                    <Form.Control type="text" defaultValue="ABC" className="bg-white" />
                  </Form.Group>
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Email <span className="text-danger">*</span></Form.Label>
                    <Form.Control type="email" defaultValue="abc@gmail.com" className="bg-white" />
                  </Form.Group>
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Số điện thoại <span className="text-danger">*</span></Form.Label>
                    <Form.Control type="text" defaultValue="0987654321" className="bg-white" />
                  </Form.Group>
                </Col>
              </Row>

              <hr className="my-4" style={{ opacity: 0.1 }} />

              <h5 className="section-title">Thông tin hành khách</h5>
              <Row>
                <Col md={4} className="mb-3">
                  <Form.Group>
                    <Form.Label>Danh xưng <span className="text-danger">*</span></Form.Label>
                    <Form.Select className="bg-white">
                      <option>Ông</option>
                      <option>Bà</option>
                      <option>Cô</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Họ <span className="text-danger">*</span></Form.Label>
                    <Form.Control type="text" placeholder="Họ trên CCCD (không dấu)" className="bg-white" />
                  </Form.Group>
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Tên <span className="text-danger">*</span></Form.Label>
                    <Form.Control type="text" placeholder="Tên trên CCCD (không dấu)" className="bg-white" />
                  </Form.Group>
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Ngày sinh <span className="text-danger">*</span></Form.Label>
                    <Form.Control type="text" placeholder="DD/MM/YY" className="bg-white" />
                  </Form.Group>
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Quốc tịch <span className="text-danger">*</span></Form.Label>
                    <Form.Select className="bg-white">
                      <option>Việt Nam</option>
                      <option>Quốc tế</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            </div>

            {/* Baggage */}
            <div className="section-box baggage-box d-flex align-items-center">
              <div className="baggage-icon-large me-4 text-center">
                 <i className="bi bi-suitcase-lg-fill" style={{ fontSize: '4rem', color: '#009abb' }}></i>
              </div>
              <div className="flex-grow-1">
                <h5 className="section-title mb-1">Hành lý ký gửi</h5>
                <p className="text-muted mb-3 small">Thêm hành lý ký gửi để chuyến đi thoải mái hơn</p>
                
                <div className="baggage-select-row">
                  <div className="route-info">
                    <strong>DAD</strong> <i className="bi bi-arrow-right mx-2"></i> <strong>HAN</strong>
                    <div className="small text-muted mt-1">7kg xách tay/ 0kg ký gửi</div>
                  </div>
                  <div className="baggage-dropdown">
                    <Form.Select 
                      value={baggage} 
                      onChange={(e) => setBaggage(e.target.value)}
                      className="custom-select"
                    >
                      <option value="0">0kg - 0đ</option>
                      <option value="250000">15kg - 250.000đ</option>
                      <option value="320000">23kg - 320.000đ</option>
                      <option value="450000">32kg - 450.000đ</option>
                      <option value="600000">50kg - 600.000đ</option>
                    </Form.Select>
                  </div>
                </div>
              </div>
            </div>

            {/* Insurance */}
            <div className="mb-4">
              <h5 className="section-title text-primary mb-3">Bảo hiểm và dịch vụ bổ sung</h5>
              
              {/* Card 1 */}
              <div className="insurance-card d-flex align-items-center justify-content-between mb-3">
                <div className="d-flex align-items-start">
                   <div className="insurance-icon me-3">
                     <i className="bi bi-shield-check"></i>
                   </div>
                   <div>
                     <h6 className="fw-bold mb-2">Bảo hiểm chuyến đi</h6>
                     <ul className="insurance-benefits mb-0">
                       <li>Hoàn tiền lên đến 100% giá vé</li>
                       <li>Bồi thường chi phí y tế</li>
                       <li>Bảo hiểm thất lạc hành lý</li>
                     </ul>
                   </div>
                </div>
                <div className="text-end">
                   <div className="price-tag-large mb-1">99.000đ<span>/khách</span></div>
                   <a href="#" className="add-btn-link">Thêm</a>
                </div>
              </div>

               {/* Card 2 */}
              <div className="insurance-card d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-start">
                   <div className="insurance-icon me-3">
                     <i className="bi bi-clock-history"></i>
                   </div>
                   <div>
                     <h6 className="fw-bold mb-2">Bảo hiểm trì hoãn chuyến bay</h6>
                     <div className="insurance-desc">
                       Hoàn tiền nếu chuyến bay bị delay từ 2 giờ trở lên
                     </div>
                   </div>
                </div>
                <div className="text-end">
                   <div className="price-tag-large mb-1">50.000đ<span>/khách</span></div>
                   <a href="#" className="add-btn-link">Thêm</a>
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="section-box">
              <h5 className="section-title text-primary">Thanh toán</h5>
              
              <div className="mb-4">
                <Form.Label className="fw-bold">Mã khuyến mãi/Voucher</Form.Label>
                <Row className="g-2 mb-3">
                  <Col>
                    <Form.Control type="text" placeholder="Nhập mã khuyến mãi" className="bg-light border-light" />
                  </Col>
                  <Col xs="auto">
                    <Button variant="primary" className="apply-btn">Áp dụng</Button>
                  </Col>
                </Row>
                <div className="voucher-tags mt-2">
                  <span className="voucher-tag"><i className="bi bi-tag-fill"></i> TRIPFL30</span>
                  <span className="voucher-tag"><i className="bi bi-tag-fill"></i> TETANVUI</span>
                  <span className="voucher-tag"><i className="bi bi-tag-fill"></i> TRIPGO20</span>
                </div>
              </div>
              
              <hr className="my-4" style={{ opacity: 0.1 }} />

              <div className="payment-methods-tabs">
                <button 
                  className={`pm-tab ${paymentMethod === 'international' ? 'active' : ''}`}
                  onClick={() => handlePaymentMethodChange('international')}
                >
                  Thẻ quốc tế
                </button>
                <button 
                  className={`pm-tab ${paymentMethod === 'wallet' ? 'active' : ''}`}
                  onClick={() => handlePaymentMethodChange('wallet')}
                >
                  Ví điện tử
                </button>
                <button 
                  className={`pm-tab ${paymentMethod === 'bank' ? 'active' : ''}`}
                  onClick={() => handlePaymentMethodChange('bank')}
                >
                  Ngân hàng nội địa
                </button>
              </div>

              <div className="payment-content mt-4">
                {paymentMethod === 'bank' && (
                  <div>
                    <h6 className="mb-3 fw-bold">Chọn ngân hàng</h6>
                    <div className="bank-list">
                      <div className="bank-item"><img src="https://upload.wikimedia.org/wikipedia/commons/2/25/Logo_MB_new.png" alt="MB" /></div>
                      <div className="bank-item"><img src="https://upload.wikimedia.org/wikipedia/commons/2/29/Vietcombank_Logo_Style_2025.png" alt="VCB" /></div>
                      <div className="bank-item"><img src="https://vnpay.vn/s1/statics.vnpay.vn/2023/6/0oxhzjmxbksr1686814746087.png" alt="Vietinbank" /></div>
                      <div className="bank-item"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Logo_TPBank.svg/2560px-Logo_TPBank.svg.png" alt="TPBank" /></div>
                    </div>
                  </div>
                )}

                 {paymentMethod === 'wallet' && (
                  <div className="wallet-content">
                    <h6 className="mb-3 fw-bold">Chọn ví điện tử</h6>
                    <div className="d-flex gap-3 mb-4">
                       <div className="wallet-option selected">
                          <img src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png" alt="Momo" />
                       </div>
                       <div className="wallet-option">
                          <img src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-ZaloPay-Square.png" alt="ZaloPay" />
                       </div>
                       <div className="wallet-option">
                          <img src="https://vnpay.vn/assets/images/logo-icon/logo-primary.svg" alt="VNPAY" />
                       </div>
                    </div>
                    <div className="wallet-guide">
                      <h6>Hướng dẫn thanh toán bằng ví điện tử</h6>
                      <ol>
                        <li>Chọn 1 trong các ví điện tử trên</li>
                        <li>Nhấn "Thanh toán"</li>
                        <li>Quét mã QR hiển thị trên màn hình bằng ứng dụng ví điện tử của bạn</li>
                        <li>Xác nhận thanh toán trên ứng dụng để hoàn tất</li>
                      </ol>
                    </div>
                  </div>
                )}
                
                {paymentMethod === 'international' && (
                   <div className="card-form">
                      <Row>
                         <Col md={12} className="mb-3">
                            <Form.Group>
                               <Form.Label className="fw-bold">Số thẻ</Form.Label>
                               <Form.Control type="text" placeholder="XXXXXXXXXXXX" className="bg-light border-light" />
                            </Form.Group>
                         </Col>
                         <Col md={6} className="mb-3">
                            <Form.Group>
                               <Form.Label className="fw-bold">Ngày hết hạn</Form.Label>
                               <Form.Control type="text" placeholder="MM/YY" className="bg-light border-light" />
                            </Form.Group>
                         </Col>
                         <Col md={6} className="mb-3">
                            <Form.Group>
                               <Form.Label className="fw-bold">CVV</Form.Label>
                               <Form.Control type="text" placeholder="123" className="bg-light border-light" />
                            </Form.Group>
                         </Col>
                      </Row>
                   </div>
                )}
              </div>

              <div className="mt-4">
                 <Form.Check 
                    type="checkbox" 
                    label={<span>Tôi đồng ý với <a href="#" className="text-primary text-decoration-none">điều khoản và chính sách</a> hoàn vé</span>}
                    id="terms-check"
                 />
              </div>

              <Button className="pay-btn w-100 mt-4" size="lg">Thanh toán</Button>
            </div>
          </Col>

          {/* Right Column - Sidebar */}
          <Col lg={4}>
            <div className="sidebar-summary">
              <h5 className="summary-title">Tóm tắt chuyến bay</h5>
              
              <div className="airline-info-block">
                <div className="airline-brand">
                  <img src={logo} alt="Vietnam Airlines" className="airline-logo-sm" />
                  <span className="airline-name">Vietnam Airlines</span>
                </div>
                <div className="flight-class">Economy</div>
              </div>

              <div className="flight-route-summary">
                <div className="time-col">
                  <div className="time">13:00</div>
                  <div className="code">DAD</div>
                </div>
                <div className="duration-col">
                  <div className="duration-val">1h 10p</div>
                  <div className="dur-arrow"></div>
                  <div className="flight-type-text">Khứ hồi</div>
                </div>
                <div className="time-col">
                  <div className="time">14:10</div>
                  <div className="code">HAN</div>
                </div>
              </div>
              
              <div className="flight-date">Thứ Bảy, ngày 22/12/2025</div>
              
              <div className="price-section">
                <div className="price-row">
                  <span>Giá vé</span>
                  <span>2.090.000đ (1 người lớn)</span>
                </div>
                <div className="price-row">
                  <span>Thuế và phí</span>
                  <span>350.000đ</span>
                </div>
              </div>

              <div className="total-row">
                 <span className="total-label">Tổng tiền</span>
                 <span className="total-price">2.440.000đ</span>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Payment;
