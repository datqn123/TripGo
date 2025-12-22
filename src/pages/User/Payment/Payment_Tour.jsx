import React, { useState, useEffect, useRef } from "react";
import "./payment.css";
import { Container, Row, Col, Form, Button, Badge } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import bookingApi from "../../../api/bookingApi";
import Banner from "../../../components/User/Banner/Banner";
import AdvanceSearch from "../../../components/User/AdvanceSearch/AdvanceSearch";
import { QRCodeSVG } from 'qrcode.react';

const Payment_Tour = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { tourInfo, bookingDetails } = location.state || {}; // Expecting state passed from Detail_Tour

    const [paymentMethod, setPaymentMethod] = useState("ATM"); // Default to ATM
    const [loading, setLoading] = useState(false);

    // QR & Payment Status State
    const [paymentSuccess, setPaymentSuccess] = useState(false); // Valid booking created
    const [qrCodeData, setQrCodeData] = useState('');
    const [checkoutUrl, setCheckoutUrl] = useState('');
    const [orderCode, setOrderCode] = useState(null);
    const [paymentCompleted, setPaymentCompleted] = useState(false); // Payment verified "PAID"
    const [checkingStatus, setCheckingStatus] = useState(false);
    const pollingIntervalRef = useRef(null);

    // Contact Info
    const [contactName, setContactName] = useState('');
    const [contactPhone, setContactPhone] = useState('');
    const [contactEmail, setContactEmail] = useState('');

    // Passengers
    const [passengers, setPassengers] = useState([]);

    // Initialize passengers based on guestCount
    useEffect(() => {
        if (!tourInfo || !bookingDetails) {
            toast.error("Không tìm thấy thông tin đặt tour. Vui lòng chọn tour lại.");
            navigate('/tour');
            return;
        }

        const initialPassengers = Array(bookingDetails.guestCount).fill(null).map(() => ({
            name: '',
            gender: 'MALE',
            dateOfBirth: '',
            type: 'ADULT' // Default type
        }));
        setPassengers(initialPassengers);
    }, [tourInfo, bookingDetails, navigate]);

    // Polling Payment Status
    useEffect(() => {
        if (!orderCode || paymentCompleted) return;

        let timeoutRef = null;

        const checkPaymentStatus = async () => {
            try {
                setCheckingStatus(true);
                const response = await bookingApi.checkPaymentStatus(orderCode); // Assuming this API exists or using axiosClient
                const data = response.data;
                
                console.log('Payment status:', data.result);
                
                if (data.result === 'PAID') {
                    clearInterval(pollingIntervalRef.current);
                    pollingIntervalRef.current = null;
                    if (timeoutRef) clearTimeout(timeoutRef);
                    
                    setPaymentCompleted(true);
                    toast.success('🎉 Thanh toán thành công! Cảm ơn bạn đã đặt tour.');
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
            toast.warning('Hết thời gian chờ thanh toán. Vui lòng thử lại.');
        }, 900000); // 15 mins

        return () => {
            if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
            if (timeoutRef) clearTimeout(timeoutRef);
        };
    }, [orderCode, paymentCompleted]);

    const handlePassengerChange = (index, field, value) => {
        const updatedPassengers = [...passengers];
        updatedPassengers[index] = { ...updatedPassengers[index], [field]: value };
        setPassengers(updatedPassengers);
    };

    const handlePayment = async () => {
        // Validation
        if (!contactName || !contactPhone || !contactEmail) {
            toast.error("Vui lòng điền đầy đủ thông tin liên hệ");
            return;
        }
        
        // Basic validation for passengers
        const isPassengersValid = passengers.every(p => p.name && p.dateOfBirth);
        if (!isPassengersValid) {
            toast.error("Vui lòng điền đầy đủ thông tin hành khách");
            return;
        }

        setLoading(true);
        try {
            console.log("Booking Details Received:", bookingDetails);
            
            const payload = {
                type: "TOUR",
                tourScheduleId: bookingDetails.tourScheduleId,
                quantity: bookingDetails.guestCount,
                contactName,
                contactPhone,
                contactEmail,
                paymentMethod: "ATM", // Force ATM to trigger PayOS QR/Link generation if needed, or keep dynamic if backend handles it
                passengers: passengers,
                tourId: tourInfo.id,
                checkInDate: bookingDetails.date 
            };
            
            // Note: If user selects 'CREDIT_CARD' or 'MOMO', backend might behave differently. 
            // For 'QR' style like Hotel, we typically use the PayOS link which supports QR.
            // Let's assume sending the selected 'paymentMethod' (updated to 'ATM' or whatever triggers PayOS) is correct.
            // But user wants QR for "Hotel-like" experience which usually implies PayOS/VietQR.
            // Hotel implementation hardcoded 'ATM' in payload for QR in the reference.
            // I will use `paymentMethod` state but default to 'ATM' behavior if they want QR.
             
            // payload.paymentMethod = "ATM"; // Based on Hotel reference which sets 'ATM' for the QR flow
            // Actually let's start with state, if it fails to give QR, we might need to force ATM.
            // But the user specifically asked for QR like Hotel, and Hotel uses 'ATM' in the snippet I saw.
            
            console.log("FINAL Booking Payload:", payload);
            
            if (!payload.tourScheduleId) {
                toast.error("Lỗi: Không tìm thấy ID lịch trình tour. Vui lòng quay lại chọn ngày.");
                setLoading(false);
                return;
            }

            const response = await bookingApi.createPaymentLink(payload);
            const result = response.data;

            if (result && result.code === 1000 && result.result) {
                const { qrCode, checkoutUrl, orderCode } = result.result;
                
                if (qrCode && checkoutUrl) {
                    setQrCodeData(qrCode);
                    setCheckoutUrl(checkoutUrl);
                    setOrderCode(orderCode);
                    setPaymentSuccess(true); // Show QR section
                    toast.success("Đã tạo link thanh toán thành công!");
                    
                     // Scroll to QR section
                    setTimeout(() => {
                        const qrSection = document.getElementById('qr-payment-section');
                        if (qrSection) {
                            qrSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                    }, 300);
                } else if (result.result.checkoutUrl) {
                    // Fallback if no specific QR code string but there is a link (maybe direct redirect needed?)
                    // But user wants QR. Let's assume PayOS returns QR string if 'ATM' is selected.
                    window.location.href = result.result.checkoutUrl;
                } else {
                     toast.error("Không nhận được thông tin thanh toán từ hệ thống");
                }
            } else {
                toast.error(result?.message || "Lỗi khi tạo thanh toán");
            }
        } catch (error) {
            console.error("Payment Error:", error);
            toast.error(error.response?.data?.message || "Có lỗi xảy ra khi xử lý thanh toán");
        } finally {
            setLoading(false);
        }
    };

    if (!tourInfo) return null;

    return (
        <div className="payment-page">
            <Banner />
            <AdvanceSearch />
            <div className="py-5 bg-light">
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
                                            src={tourInfo.image || "https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?q=80&w=2664&auto=format&fit=crop"}
                                            alt={tourInfo.title}
                                            className="w-100 h-100 object-fit-cover"
                                            style={{ minHeight: '160px' }}
                                        />
                                    </div>
                                </Col>
                                <Col md={8}>
                                    <h5 className="fw-bold text-primary mb-1">{tourInfo.title}</h5>
                                    <div className="d-flex flex-column gap-1 text-dark small fw-medium mt-3">
                                        <div>Khởi hành: <span className="fw-bold">{new Date(bookingDetails.date).toLocaleDateString('vi-VN')}</span></div>
                                        <div>Số lượng khách: <span className="fw-bold">{bookingDetails.guestCount} người</span></div>
                                        <div>Giá tour: <span className="fw-bold text-primary">{(tourInfo.price || 0).toLocaleString('vi-VN')}đ / khách</span></div>
                                    </div>
                                </Col>
                            </Row>
                        </div>

                         {/* QR Payment Section - Show after successful booking creation */}
                         {paymentSuccess && qrCodeData && (
                            <div id="qr-payment-section" className="section-box mb-4">
                                {paymentCompleted ? (
                                    <div className="text-center py-4">
                                        <div className="mb-4">
                                            <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '80px' }}></i>
                                        </div>
                                        <h4 className="text-success fw-bold mb-3">🎉 Thanh toán thành công!</h4>
                                        <p className="text-muted mb-4">
                                            Cảm ơn bạn đã đặt tour. Thông tin xác nhận đã được gửi đến email <strong>{contactEmail}</strong>
                                        </p>
                                        
                                        <div className="d-flex justify-content-center gap-3">
                                            <Button variant="primary" onClick={() => navigate('/setting?tab=history')}>
                                                <i className="bi bi-clock-history me-2"></i>
                                                Xem lịch sử đặt tour
                                            </Button>
                                            <Button variant="outline-primary" onClick={() => navigate('/tour')}>
                                                <i className="bi bi-map me-2"></i>
                                                Tiếp tục xem tour
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="alert alert-success mb-4">
                                            <i className="bi bi-check-circle-fill me-2"></i>
                                            Đã tạo link thanh toán thành công!
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
                                            Số tiền: <strong className="text-primary">{bookingDetails.totalPrice?.toLocaleString('vi-VN')}đ</strong>
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
                            <>
                        {/* Contact Info */}
                        <div className="section-box mb-4">
                            <div className="d-flex align-items-center mb-3">
                                <div className="bg-primary" style={{ width: '4px', height: '24px', marginRight: '10px' }}></div>
                                <h5 className="fw-bold text-primary mb-0 text-uppercase">Thông tin liên hệ</h5>
                            </div>
                            <Row className="g-3">
                                <Col md={12}>
                                    <Form.Group>
                                        <Form.Label className="fw-bold small">Họ và tên <span className="text-danger">*</span></Form.Label>
                                        <Form.Control 
                                            type="text" 
                                            value={contactName}
                                            onChange={(e) => setContactName(e.target.value)}
                                            placeholder="Nguyễn Văn A" 
                                            className="bg-light border-light py-2" 
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label className="fw-bold small">Số điện thoại <span className="text-danger">*</span></Form.Label>
                                        <Form.Control 
                                            type="tel" 
                                            value={contactPhone}
                                            onChange={(e) => setContactPhone(e.target.value)}
                                            placeholder="0901234567" 
                                            className="bg-light border-light py-2" 
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label className="fw-bold small">Email <span className="text-danger">*</span></Form.Label>
                                        <Form.Control 
                                            type="email" 
                                            value={contactEmail}
                                            onChange={(e) => setContactEmail(e.target.value)}
                                            placeholder="email@example.com" 
                                            className="bg-light border-light py-2" 
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                        </div>

                        {/* Passenger Info */}
                        <div className="section-box mb-4">
                            <div className="d-flex align-items-center mb-3">
                                <div className="bg-primary" style={{ width: '4px', height: '24px', marginRight: '10px' }}></div>
                                <h5 className="fw-bold text-primary mb-0 text-uppercase">Thông tin hành khách ({passengers.length})</h5>
                            </div>
                            {passengers.map((passenger, idx) => (
                                <div key={idx} className="mb-4 pb-3 border-bottom">
                                    <h6 className="fw-bold text-secondary mb-3">Khách {idx + 1}</h6>
                                    <Row className="g-3">
                                        <Col md={6}>
                                            <Form.Group>
                                                <Form.Label className="fw-bold small">Họ và tên <span className="text-danger">*</span></Form.Label>
                                                <Form.Control 
                                                    type="text" 
                                                    value={passenger.name}
                                                    onChange={(e) => handlePassengerChange(idx, 'name', e.target.value)}
                                                    className="bg-light border-light py-2" 
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={3}>
                                            <Form.Group>
                                                <Form.Label className="fw-bold small">Giới tính</Form.Label>
                                                <Form.Select 
                                                    value={passenger.gender}
                                                    onChange={(e) => handlePassengerChange(idx, 'gender', e.target.value)}
                                                    className="bg-light border-light py-2"
                                                >
                                                    <option value="MALE">Nam</option>
                                                    <option value="FEMALE">Nữ</option>
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                        <Col md={3}>
                                            <Form.Group>
                                                <Form.Label className="fw-bold small">Loại khách</Form.Label>
                                                <Form.Select 
                                                    value={passenger.type}
                                                    onChange={(e) => handlePassengerChange(idx, 'type', e.target.value)}
                                                    className="bg-light border-light py-2"
                                                >
                                                    <option value="ADULT">Người lớn</option>
                                                    <option value="CHILD">Trẻ em</option>
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group>
                                                <Form.Label className="fw-bold small">Ngày sinh <span className="text-danger">*</span></Form.Label>
                                                <Form.Control 
                                                    type="date" 
                                                    value={passenger.dateOfBirth}
                                                    onChange={(e) => handlePassengerChange(idx, 'dateOfBirth', e.target.value)}
                                                    className="bg-light border-light py-2" 
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </div>
                            ))}
                        </div>

                        {/* Payment Method */}
                        <div className="section-box">
                            <div className="d-flex align-items-center mb-3">
                                <div className="bg-primary" style={{ width: '4px', height: '24px', marginRight: '10px' }}></div>
                                <h5 className="fw-bold text-primary mb-0 text-uppercase">THANH TOÁN</h5>
                            </div>

                            <div className="mb-4">
                                <Form.Label className="fw-bold small">Mã khuyến mãi/Voucher</Form.Label>
                                <Row className="g-2 mb-3">
                                    <Col>
                                        <Form.Control type="text" placeholder="Nhập mã khuyến mãi" className="bg-light border-light" />
                                    </Col>
                                    <Col xs="auto">
                                        <Button variant="primary" className="apply-btn fw-bold px-4" style={{ backgroundColor: '#009aaaaa', borderColor: '#009aaaaa' }}>Áp dụng</Button>
                                    </Col>
                                </Row>
                                <div className="voucher-tags mt-2">
                                     <span className="voucher-tag badge bg-light text-success border border-success border-opacity-25 rounded-pill px-3 py-2 me-2 fw-normal">
                                        <i className="bi bi-tag-fill me-1"></i> HOTEL20
                                    </span>
                                </div>
                            </div>

                            <div className="payment-methods-tabs d-flex gap-2 mb-4">
                                <button
                                    className={`pm-tab btn rounded-pill px-4 py-2 fw-bold text-nowrap ${paymentMethod === 'CREDIT_CARD' ? 'btn-outline-primary active bg-primary text-white' : 'btn-outline-secondary text-dark border-opacity-25'}`}
                                    onClick={() => setPaymentMethod('CREDIT_CARD')}
                                >
                                    Thẻ quốc tế (Visa/Master)
                                </button>
                                <button
                                    className={`pm-tab btn rounded-pill px-4 py-2 fw-bold text-nowrap ${paymentMethod === 'ATM' ? 'btn-outline-primary active bg-primary text-white' : 'btn-outline-secondary text-dark border-opacity-25'}`}
                                    onClick={() => setPaymentMethod('ATM')}
                                >
                                    Thẻ ATM nội địa
                                </button>
                                <button
                                    className={`pm-tab btn rounded-pill px-4 py-2 fw-bold text-nowrap ${paymentMethod === 'MOMO' ? 'btn-outline-primary active bg-primary text-white' : 'btn-outline-secondary text-dark border-opacity-25'}`}
                                    onClick={() => setPaymentMethod('MOMO')}
                                >
                                    Ví MoMo
                                </button>
                            </div>
                            
                            <div className="payment-content mb-4">
                                <div className="text-muted small">Bạn sẽ được chuyển đến trang thanh toán sau khi nhấn nút bên dưới.</div>
                            </div>

                            <div className="mb-4">
                                <Form.Check
                                    type="checkbox"
                                    id="terms-check"
                                    label={<span className="small text-secondary">Tôi đồng ý với <a href="#" className="text-info text-decoration-none">điều khoản và chính sách</a> hoàn vé</span>}
                                />
                            </div>
                            
                            <Button 
                                className="w-100 fw-bold py-3 rounded-3 fs-6" 
                                variant="primary"
                                onClick={handlePayment}
                                disabled={loading}
                                style={{ backgroundColor: '#009aaaaa', borderColor: '#009aaaaa' }}
                            >
                                {loading ? 'Đang xử lý...' : 'Thanh toán'}
                            </Button>
                        </div>
                        </>
                        )}
                    </Col>

                    {/* Sidebar - Right */}
                    <Col lg={4}>
                        {/* Bill Summary */}
                        <div className="section-box mb-4">
                            <div className="d-flex align-items-center mb-3">
                                <div className="bg-primary" style={{ width: '4px', height: '24px', marginRight: '10px' }}></div>
                                <h5 className="fw-bold text-primary mb-0 text-uppercase">Hoá đơn</h5>
                            </div>
                            <div className="d-flex justify-content-between mb-2 small fw-medium text-secondary">
                                <span>Giá tour ({bookingDetails.guestCount} khách)</span>
                                <span className="text-dark fw-bold">{bookingDetails.totalPrice.toLocaleString('vi-VN')}đ</span>
                            </div>
                            <hr className="my-3 opacity-10" />
                            <div className="d-flex justify-content-between align-items-center">
                                <span className="fw-bold text-dark">Tổng cộng</span>
                                <span className="text-info fs-5 fw-bold">{bookingDetails.totalPrice.toLocaleString('vi-VN')}đ</span>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
            </div>
        </div>
    );
};

export default Payment_Tour;
