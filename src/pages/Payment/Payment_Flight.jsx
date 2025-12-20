import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./payment.css";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import Banner from '../../components/Banner/Banner';
import AdvanceSearch from '../../components/AdvanceSearch/AdvanceSearch';
import axiosClient from '../../api/axiosClient';
import { QRCodeSVG } from 'qrcode.react';

const currency = (v) => {
  if (v === null || v === undefined) return "";
  return v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ";
};

const Payment_Flight = () => {
    const navigate = useNavigate();
    const [paymentMethod, setPaymentMethod] = useState("ATM");
    const [baggage, setBaggage] = useState(0);
    const [bookingData, setBookingData] = useState(null);
    
    // Contact info
    const [contactName, setContactName] = useState('');
    const [contactPhone, setContactPhone] = useState('');
    const [contactEmail, setContactEmail] = useState('');
    const [voucherCode, setVoucherCode] = useState('');
    
    // Passenger info
    const [passengerName, setPassengerName] = useState('');
    const [passengerType, setPassengerType] = useState('ADULT');
    
    // Insurance options
    const [hasTravelInsurance, setHasTravelInsurance] = useState(false);
    const [hasDelayInsurance, setHasDelayInsurance] = useState(false);
    
    // QR Display
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [qrCodeData, setQrCodeData] = useState('');
    const [checkoutUrl, setCheckoutUrl] = useState('');
    const [paymentLoading, setPaymentLoading] = useState(false);
    
    // Validation errors
    const [validationErrors, setValidationErrors] = useState({});
    
    // Payment status checking
    const [orderCode, setOrderCode] = useState(null);
    const [paymentId, setPaymentId] = useState(null);
    const [paymentCompleted, setPaymentCompleted] = useState(false);
    const [checkingStatus, setCheckingStatus] = useState(false);
    const pollingIntervalRef = useRef(null);

    // Check authentication on mount
    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken') || localStorage.getItem('token');
        if (!accessToken) {
            // User not logged in, redirect to login
            navigate('/login', { state: { from: '/payment-plane' } });
        }
    }, [navigate]);

    useEffect(() => {
        // Read booking data from localStorage
        const savedData = localStorage.getItem('flightBooking');
        if (savedData) {
            const parsedData = JSON.parse(savedData);
            setBookingData(parsedData);
            console.log('Booking data:', parsedData);
        }
    }, []);

    // Scroll to top when page loads
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Polling to check payment status
    useEffect(() => {
        if (!orderCode || paymentCompleted) {
            return;
        }

        let timeoutRef = null;

        const checkPaymentStatus = async () => {
            try {
                setCheckingStatus(true);
                const response = await axiosClient.get(`payment/check-status/${orderCode}`);
                const data = response.data;
                
                console.log('Payment status:', data.result);
                
                if (data.result === 'PAID') {
                    clearInterval(pollingIntervalRef.current);
                    pollingIntervalRef.current = null;
                    if (timeoutRef) clearTimeout(timeoutRef);
                    
                    setPaymentCompleted(true);
                    toast.success('🎉 Thanh toán thành công! Cảm ơn bạn đã đặt vé.');
                    localStorage.removeItem('flightBooking');
                } else if (data.result === 'CANCELLED') {
                    clearInterval(pollingIntervalRef.current);
                    pollingIntervalRef.current = null;
                    if (timeoutRef) clearTimeout(timeoutRef);
                    
                    toast.error('Giao dịch đã bị hủy.');
                    setPaymentSuccess(false);
                    setOrderCode(null);
                    setQrCodeData('');
                    setCheckoutUrl('');
                }
            } catch (error) {
                console.error('Error checking payment status:', error);
            } finally {
                setCheckingStatus(false);
            }
        };

        pollingIntervalRef.current = setInterval(checkPaymentStatus, 2000);

        timeoutRef = setTimeout(() => {
            if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
                pollingIntervalRef.current = null;
            }
            console.log('Stopped polling due to timeout.');
            toast.warning('Hết thời gian chờ thanh toán. Vui lòng thử lại.');
        }, 900000); // 15 minutes

        return () => {
            if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
                pollingIntervalRef.current = null;
            }
            if (timeoutRef) {
                clearTimeout(timeoutRef);
            }
        };
    }, [orderCode, paymentCompleted]);

    const handlePaymentMethodChange = (method) => {
        setPaymentMethod(method);
    };

    // Calculate baggage info
    const getBaggageInfo = () => {
        const baggageOptions = {
            '0': { kg: null, price: 0 },
            '250000': { kg: '15kg', price: 250000 },
            '320000': { kg: '23kg', price: 320000 },
            '450000': { kg: '32kg', price: 450000 },
            '600000': { kg: '50kg', price: 600000 }
        };
        return baggageOptions[baggage] || { kg: null, price: 0 };
    };

    // Handle payment submission
    const handlePayment = async () => {
        const errors = {};
        
        // Validate contact info
        if (!contactName || contactName.trim() === '') {
            errors.contactName = true;
        }
        if (!contactPhone || contactPhone.trim() === '') {
            errors.contactPhone = true;
        }
        if (!contactEmail || contactEmail.trim() === '') {
            errors.contactEmail = true;
        }
        
        // Validate passenger info
        if (!passengerName || passengerName.trim() === '') {
            errors.passengerName = true;
        }
        
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            toast.error('Vui lòng điền đầy đủ các trường bắt buộc');
            return;
        }
        
        if (!bookingData || !bookingData.seat) {
            toast.error('Không tìm thấy thông tin đặt vé');
            return;
        }

        setValidationErrors({});
        setPaymentLoading(true);
        
        try {
            const baggageInfo = getBaggageInfo();
            
            const paymentData = {
                type: "FLIGHT",
                contactName,
                contactPhone,
                contactEmail,
                paymentMethod: "ATM",
                voucherCode: voucherCode || null,
                quantity: 1, // Number of passengers
                
                flightSeatId: bookingData.seat.id,
                
                hasTravelInsurance,
                hasDelayInsurance,
                extraBaggageKg: baggageInfo.kg,
                extraBaggagePrice: baggageInfo.price,
                
                passengers: [
                    {
                        name: passengerName,
                        type: passengerType
                    }
                ]
            };

            console.log('Payment data:', paymentData);

            const response = await axiosClient.post('payment/create-payment-link', paymentData);
            const result = response.data;
            
            console.log('Payment API Response:', result);
            
            if (result.code === 1000 && result.result) {
                const qrData = result.result.qrCode;
                const paymentLink = result.result.checkoutUrl;
                const paymentOrderCode = result.result.orderCode;
                const paymentLinkId = result.result.paymentLinkId || result.result.id || '';
                
                setQrCodeData(qrData);
                setCheckoutUrl(paymentLink);
                setOrderCode(paymentOrderCode);
                setPaymentId(paymentLinkId);
                setPaymentSuccess(true);
                toast.success('Đã tạo link thanh toán thành công!');
                
                setTimeout(() => {
                    const qrSection = document.getElementById('qr-payment-section');
                    if (qrSection) {
                        qrSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }, 300);
            } else {
                toast.error(result.message || 'Không thể tạo link thanh toán');
            }
        } catch (error) {
            console.error('Payment error:', error);
            if (error.response?.status === 401) {
                toast.error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
            } else if (error.response?.status === 403) {
                toast.error('Bạn không có quyền thực hiện thanh toán này.');
            } else {
                toast.error(error.response?.data?.message || 'Lỗi kết nối đến server thanh toán');
            }
        } finally {
            setPaymentLoading(false);
        }
    };

    return (
        <div className="payment-page">
            {/* Hero Section - Same as Hotel pages */}
            <Banner />
            <AdvanceSearch />
            
            <div className="bg-light py-4">
                <Container>
                    <h4 className="fw-bold mb-4 text-primary">Xác nhận đặt vé máy bay</h4>
            <Container>
                <Row>
                    {/* Left Column - Forms */}
                    <Col lg={8}>
                        {/* QR Payment Section - Show after successful payment */}
                        {paymentSuccess && qrCodeData && (
                            <div id="qr-payment-section" className="section-box mb-4">
                                {paymentCompleted ? (
                                    <div className="text-center py-4">
                                        <div className="mb-4">
                                            <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '80px' }}></i>
                                        </div>
                                        <h4 className="text-success fw-bold mb-3">🎉 Thanh toán thành công!</h4>
                                        <p className="text-muted mb-4">
                                            Cảm ơn bạn đã đặt vé. Thông tin xác nhận đã được gửi đến email <strong>{contactEmail}</strong>
                                        </p>
                                        
                                        <div className="mb-4 p-3 bg-light rounded-3 text-start">
                                            <h6 className="text-primary fw-bold mb-3">
                                                <i className="bi bi-info-circle-fill me-2"></i>
                                                Chi tiết đặt vé
                                            </h6>
                                            <Row className="g-2">
                                                <Col md={6}>
                                                    <div className="small"><strong>Hãng bay:</strong> {bookingData?.flight?.airline?.name}</div>
                                                    <div className="small"><strong>Chuyến bay:</strong> {bookingData?.flight?.flightNumber}</div>
                                                    <div className="small"><strong>Hạng vé:</strong> {bookingData?.seat?.seatClass}</div>
                                                </Col>
                                                <Col md={6}>
                                                    <div className="small"><strong>Hành khách:</strong> {passengerName}</div>
                                                    <div className="small"><strong>Số điện thoại:</strong> {contactPhone}</div>
                                                    <div className="small"><strong>Email:</strong> {contactEmail}</div>
                                                    <div className="small"><strong>Tổng tiền:</strong> <span className="text-primary fw-bold">{bookingData ? currency(bookingData.seat.price + parseInt(baggage) + Math.round(bookingData.seat.price * 0.1)) : '0đ'}</span></div>
                                                </Col>
                                            </Row>
                                        </div>
                                        
                                        <div className="d-flex justify-content-center gap-3">
                                            <Button variant="primary" onClick={() => window.location.href = '/setting?tab=history'}>
                                                <i className="bi bi-clock-history me-2"></i>
                                                Xem lịch sử đặt vé
                                            </Button>
                                            <Button variant="outline-primary" onClick={() => window.location.href = '/filter-plane'}>
                                                <i className="bi bi-airplane me-2"></i>
                                                Tiếp tục đặt vé
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="alert alert-success mb-4">
                                            <i className="bi bi-check-circle-fill me-2"></i>
                                            Đã tạo link thanh toán thành công!
                                        </div>
                                        
                                        <div className="mb-4 p-3 bg-light rounded-3">
                                            <h6 className="text-primary fw-bold mb-3">
                                                <i className="bi bi-person-check-fill me-2"></i>
                                                Thông tin đặt vé
                                            </h6>
                                            
                                            <div className="mb-3">
                                                <div className="text-muted small fw-bold mb-2">Thông tin liên hệ</div>
                                                <Row className="g-2">
                                                    <Col md={4}>
                                                        <div className="d-flex align-items-center">
                                                            <i className="bi bi-person-fill text-secondary me-2"></i>
                                                            <div>
                                                                <div className="text-muted x-small">Họ và tên</div>
                                                                <div className="fw-medium">{contactName}</div>
                                                            </div>
                                                        </div>
                                                    </Col>
                                                    <Col md={4}>
                                                        <div className="d-flex align-items-center">
                                                            <i className="bi bi-telephone-fill text-secondary me-2"></i>
                                                            <div>
                                                                <div className="text-muted x-small">Số điện thoại</div>
                                                                <div className="fw-medium">{contactPhone}</div>
                                                            </div>
                                                        </div>
                                                    </Col>
                                                    <Col md={4}>
                                                        <div className="d-flex align-items-center">
                                                            <i className="bi bi-envelope-fill text-secondary me-2"></i>
                                                            <div>
                                                                <div className="text-muted x-small">Email</div>
                                                                <div className="fw-medium">{contactEmail}</div>
                                                            </div>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </div>
                                            
                                            <hr className="my-3 opacity-25" />
                                            
                                            <div>
                                                <div className="text-muted small fw-bold mb-2">Thông tin hành khách</div>
                                                <Row className="g-2">
                                                    <Col md={6}>
                                                        <div className="d-flex align-items-center">
                                                            <i className="bi bi-person-badge-fill text-secondary me-2"></i>
                                                            <div>
                                                                <div className="text-muted x-small">Họ và tên</div>
                                                                <div className="fw-medium">{passengerName}</div>
                                                            </div>
                                                        </div>
                                                    </Col>
                                                    <Col md={6}>
                                                        <div className="d-flex align-items-center">
                                                            <i className="bi bi-person-circle text-secondary me-2"></i>
                                                            <div>
                                                                <div className="text-muted x-small">Loại hành khách</div>
                                                                <div className="fw-medium">{passengerType === 'ADULT' ? 'Người lớn' : 'Trẻ em'}</div>
                                                            </div>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </div>
                                        </div>
                                        
                                        <h5 className="section-title text-primary mb-4 text-center">Quét mã QR để thanh toán</h5>
                                        <div className="d-flex justify-content-center mb-4">
                                            <div className="p-4 bg-white rounded-3 shadow-sm">
                                                <QRCodeSVG 
                                                    value={qrCodeData} 
                                                    size={280}
                                                    level="H"
                                                    includeMargin={true}
                                                />
                                            </div>
                                        </div>
                                        
                                        <div className="text-center mb-3">
                                            {checkingStatus ? (
                                                <div className="text-info">
                                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                    Đang kiểm tra trạng thái thanh toán...
                                                </div>
                                            ) : (
                                                <div className="text-muted small">
                                                    <i className="bi bi-clock me-1"></i>
                                                    Hệ thống sẽ tự động cập nhật khi thanh toán hoàn tất
                                                </div>
                                            )}
                                        </div>
                                        
                                        <p className="text-muted mb-2 text-center">Quét mã QR bằng ứng dụng ngân hàng</p>
                                        <p className="text-secondary small mb-3 text-center">
                                            Số tiền: <strong className="text-primary">{bookingData ? currency(bookingData.seat.price + parseInt(baggage) + Math.round(bookingData.seat.price * 0.1)) : '0đ'}</strong>
                                        </p>
                                        <div className="d-flex justify-content-center gap-3">
                                            {checkoutUrl && (
                                                <a href={checkoutUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                                                    <i className="bi bi-box-arrow-up-right me-2"></i>
                                                    Mở trang thanh toán
                                                </a>
                                            )}
                                            <Button 
                                                variant="outline-secondary"
                                                onClick={() => {
                                                    if (pollingIntervalRef.current) {
                                                        clearInterval(pollingIntervalRef.current);
                                                        pollingIntervalRef.current = null;
                                                    }
                                                    setPaymentSuccess(false);
                                                    setQrCodeData('');
                                                    setCheckoutUrl('');
                                                    setOrderCode(null);
                                                }}
                                            >
                                                <i className="bi bi-arrow-left me-2"></i>
                                                Quay lại
                                            </Button>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                        
                        {!paymentSuccess && (
                        <div className="section-box">
                            <h5 className="section-title">Thông tin liên hệ</h5>
                            <Row>
                                <Col md={12} className="mb-3">
                                    <Form.Group>
                                        <Form.Label>Họ và tên <span className="text-danger">*</span></Form.Label>
                                        <Form.Control 
                                            type="text" 
                                            placeholder="Nguyễn Văn A"
                                            className={`bg-white ${validationErrors.contactName ? 'is-invalid' : ''}`}
                                            value={contactName}
                                            onChange={(e) => setContactName(e.target.value)}
                                        />
                                        {validationErrors.contactName && <div className="invalid-feedback">Vui lòng nhập họ và tên</div>}
                                    </Form.Group>
                                </Col>
                                <Col md={6} className="mb-3">
                                    <Form.Group>
                                        <Form.Label>Email <span className="text-danger">*</span></Form.Label>
                                        <Form.Control 
                                            type="email" 
                                            placeholder="example@email.com"
                                            className={`bg-white ${validationErrors.contactEmail ? 'is-invalid' : ''}`}
                                            value={contactEmail}
                                            onChange={(e) => setContactEmail(e.target.value)}
                                        />
                                        {validationErrors.contactEmail && <div className="invalid-feedback">Vui lòng nhập email</div>}
                                    </Form.Group>
                                </Col>
                                <Col md={6} className="mb-3">
                                    <Form.Group>
                                        <Form.Label>Số điện thoại <span className="text-danger">*</span></Form.Label>
                                        <Form.Control 
                                            type="text" 
                                            placeholder="0912345678"
                                            className={`bg-white ${validationErrors.contactPhone ? 'is-invalid' : ''}`}
                                            value={contactPhone}
                                            onChange={(e) => setContactPhone(e.target.value)}
                                        />
                                        {validationErrors.contactPhone && <div className="invalid-feedback">Vui lòng nhập số điện thoại</div>}
                                    </Form.Group>
                                </Col>
                            </Row>

                            <hr className="my-4" style={{ opacity: 0.1 }} />

                            <h5 className="section-title">Thông tin hành khách</h5>
                            <Row>
                                <Col md={6} className="mb-3">
                                    <Form.Group>
                                        <Form.Label>Họ và tên hành khách <span className="text-danger">*</span></Form.Label>
                                        <Form.Control 
                                            type="text" 
                                            placeholder="Họ tên trên CCCD (không dấu)"
                                            className={`bg-white ${validationErrors.passengerName ? 'is-invalid' : ''}`}
                                            value={passengerName}
                                            onChange={(e) => setPassengerName(e.target.value)}
                                        />
                                        {validationErrors.passengerName && <div className="invalid-feedback">Vui lòng nhập tên hành khách</div>}
                                    </Form.Group>
                                </Col>
                                <Col md={6} className="mb-3">
                                    <Form.Group>
                                        <Form.Label>Loại hành khách <span className="text-danger">*</span></Form.Label>
                                        <Form.Select 
                                            className="bg-white"
                                            value={passengerType}
                                            onChange={(e) => setPassengerType(e.target.value)}
                                        >
                                            <option value="ADULT">Người lớn</option>
                                            <option value="CHILD">Trẻ em</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>
                        </div>
                        )}

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
                                        {bookingData ? (
                                            <>
                                                <strong>{bookingData.flight.departureAirport?.code || ""}</strong> 
                                                <i className="bi bi-arrow-right mx-2"></i> 
                                                <strong>{bookingData.flight.arrivalAirport?.code || ""}</strong>
                                                <div className="small text-muted mt-1">
                                                    {bookingData.seat.cabinBaggage || "7kg"} xách tay / {bookingData.seat.checkedBaggage || "0kg"} ký gửi
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <strong>---</strong> <i className="bi bi-arrow-right mx-2"></i> <strong>---</strong>
                                                <div className="small text-muted mt-1">7kg xách tay / 0kg ký gửi</div>
                                            </>
                                        )}
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

                        {!paymentSuccess && (
                        <div className="mb-4">
                            <h5 className="section-title text-primary mb-3">Bảo hiểm và dịch vụ bổ sung</h5>

                            {/* Card 1 */}
                            <div className="insurance-card d-flex align-items-center justify-content-between mb-3">
                                <div className="d-flex align-items-start">
                                    <Form.Check 
                                        type="checkbox"
                                        className="me-3 mt-1"
                                        checked={hasTravelInsurance}
                                        onChange={(e) => setHasTravelInsurance(e.target.checked)}
                                    />
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
                                </div>
                            </div>

                            {/* Card 2 */}
                            <div className="insurance-card d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-start">
                                    <Form.Check 
                                        type="checkbox"
                                        className="me-3 mt-1"
                                        checked={hasDelayInsurance}
                                        onChange={(e) => setHasDelayInsurance(e.target.checked)}
                                    />
                                    <div>
                                        <h6 className="fw-bold mb-2">Bảo hiểm trì hoãn chuyến bay</h6>
                                        <div className="insurance-desc">
                                            Hoàn tiền nếu chuyến bay bị delay từ 2 giờ trở lên
                                        </div>
                                    </div>
                                </div>
                                <div className="text-end">
                                    <div className="price-tag-large mb-1">50.000đ<span>/khách</span></div>
                                </div>
                            </div>
                        </div>
                        )}

                        {!paymentSuccess && (
                        <div className="section-box">
                            <h5 className="section-title text-primary">Thanh toán</h5>

                            <div className="mb-4">
                                <Form.Label className="fw-bold">Mã khuyến mãi/Voucher</Form.Label>
                                <Row className="g-2 mb-3">
                                    <Col>
                                        <Form.Control 
                                            type="text" 
                                            placeholder="Nhập mã khuyến mãi" 
                                            className="bg-light border-light"
                                            value={voucherCode}
                                            onChange={(e) => setVoucherCode(e.target.value)}
                                        />
                                    </Col>
                                    <Col xs="auto">
                                        <Button variant="primary" className="apply-btn">Áp dụng</Button>
                                    </Col>
                                </Row>
                            </div>

                            <hr className="my-4" style={{ opacity: 0.1 }} />

                            <div className="text-muted small mb-4">
                                Bạn sẽ được chuyển đến trang thanh toán sau khi nhấn nút bên dưới.
                            </div>

                            <div className="mt-4">
                                <Form.Check
                                    type="checkbox"
                                    label={<span>Tôi đồng ý với <a href="#" className="text-primary text-decoration-none">điều khoản và chính sách</a> hoàn vé</span>}
                                    id="terms-check"
                                />
                            </div>

                            <Button 
                                className="pay-btn w-100 mt-4" 
                                size="lg"
                                onClick={handlePayment}
                                disabled={paymentLoading || !bookingData}
                            >
                                {paymentLoading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                        Đang xử lý...
                                    </>
                                ) : 'Thanh toán'}
                            </Button>
                        </div>
                        )}
                    </Col>

                    {/* Right Column - Sidebar */}
                    <Col lg={4}>
                        {bookingData ? (
                            <div className="sidebar-summary">
                                <h5 className="summary-title">Tóm tắt chuyến bay</h5>

                                <div className="airline-info-block">
                                    <div className="airline-brand">
                                        {bookingData.flight.airline?.logoUrl ? (
                                            <img src={bookingData.flight.airline.logoUrl} alt={bookingData.flight.airline.name} className="airline-logo-sm" />
                                        ) : (
                                            <span>✈️</span>
                                        )}
                                        <span className="airline-name">{bookingData.flight.airline?.name || "Airline"}</span>
                                    </div>
                                    <div className="flight-class">{bookingData.seat.seatClass}</div>
                                </div>

                                <div className="flight-route-summary">
                                    <div className="time-col">
                                        <div className="time">
                                            {new Date(bookingData.flight.departureTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                        <div className="code">{bookingData.flight.departureAirport?.code || ""}</div>
                                    </div>
                                    <div className="duration-col">
                                        <div className="duration-val">{bookingData.flight.duration || "N/A"}</div>
                                        <div className="dur-arrow"></div>
                                        <div className="flight-type-text">{bookingData.flight.flightNumber}</div>
                                    </div>
                                    <div className="time-col">
                                        <div className="time">
                                            {new Date(bookingData.flight.arrivalTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                        <div className="code">{bookingData.flight.arrivalAirport?.code || ""}</div>
                                    </div>
                                </div>

                                <div className="flight-date">
                                    {new Date(bookingData.flight.departureTime).toLocaleDateString('vi-VN', { 
                                        weekday: 'long', 
                                        day: '2-digit', 
                                        month: '2-digit', 
                                        year: 'numeric' 
                                    })}
                                </div>

                                <div className="price-section">
                                    <div className="price-row">
                                        <span>Giá vé ({bookingData.seat.seatClass})</span>
                                        <span>{currency(bookingData.seat.price)}</span>
                                    </div>
                                    {parseInt(baggage) > 0 && (
                                        <div className="price-row">
                                            <span>Hành lý ký gửi</span>
                                            <span>{currency(parseInt(baggage))}</span>
                                        </div>
                                    )}
                                    <div className="price-row">
                                        <span>Thuế và phí</span>
                                        <span>{currency(Math.round(bookingData.seat.price * 0.1))}</span>
                                    </div>
                                </div>

                                <div className="total-row">
                                    <span className="total-label">Tổng tiền</span>
                                    <span className="total-price">
                                        {currency(bookingData.seat.price + parseInt(baggage) + Math.round(bookingData.seat.price * 0.1))}
                                    </span>
                                </div>

                                {/* Flight Details */}
                                <div style={{ marginTop: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
                                    <h6 style={{ marginBottom: '10px', fontWeight: 'bold' }}>Thông tin hạng vé</h6>
                                    <div style={{ fontSize: '13px', color: '#666' }}>
                                        {bookingData.seat.cabinBaggage && (
                                            <div>✓ Hành lý xách tay: {bookingData.seat.cabinBaggage}</div>
                                        )}
                                        {bookingData.seat.checkedBaggage && (
                                            <div>✓ Hành lý ký gửi: {bookingData.seat.checkedBaggage}</div>
                                        )}
                                        {bookingData.seat.isRefundable && (
                                            <div>✓ Được hoàn vé</div>
                                        )}
                                        {bookingData.seat.isChangeable && (
                                            <div>✓ Được đổi vé</div>
                                        )}
                                        {bookingData.seat.hasMeal && (
                                            <div>✓ Bao gồm suất ăn</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="sidebar-summary">
                                <p className="text-center text-muted">Không tìm thấy thông tin booking</p>
                            </div>
                        )}
                    </Col>
                </Row>
            </Container>
                </Container>
            </div>
        </div>
    );
};

export default Payment_Flight;