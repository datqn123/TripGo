import React, { useState, useEffect, useRef } from "react";
import "./payment.css";
import { Container, Row, Col, Form, Button, Badge, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import Banner from '../../components/Banner/Banner';
import AdvanceSearch from '../../components/AdvanceSearch/AdvanceSearch';
import axiosClient from '../../api/axiosClient';
import { QRCodeSVG } from 'qrcode.react';
import { PUBLIC_API } from '../../api/config';

const Payment_Hotel = () => {
    const [paymentMethod, setPaymentMethod] = useState("ATM"); // ATM, CREDIT_CARD, INTERNATIONAL_CARD
    const [bookingData, setBookingData] = useState(null);
    const [vouchers, setVouchers] = useState([]);
    
    // Customer contact info
    const [contactName, setContactName] = useState('');
    const [contactPhone, setContactPhone] = useState('');
    const [contactEmail, setContactEmail] = useState('');
    const [voucherCode, setVoucherCode] = useState('');
    
    // Guest info
    const [guestTitle, setGuestTitle] = useState('Ông');
    const [guestFirstName, setGuestFirstName] = useState('');
    const [guestLastName, setGuestLastName] = useState('');
    const [guestDOB, setGuestDOB] = useState('');
    const [guestNationality, setGuestNationality] = useState('Việt Nam');
    
    // QR Display (not modal)
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [qrCodeData, setQrCodeData] = useState(''); // Chuỗi dữ liệu VietQR để tạo mã QR
    const [checkoutUrl, setCheckoutUrl] = useState(''); // Link thanh toán
    const [paymentLoading, setPaymentLoading] = useState(false);
    
    // Validation errors
    const [validationErrors, setValidationErrors] = useState({});
    
    // Payment status checking
    const [orderCode, setOrderCode] = useState(null);
    const [paymentId, setPaymentId] = useState(null); // ID từ PayOS
    const [paymentCompleted, setPaymentCompleted] = useState(false);
    const [checkingStatus, setCheckingStatus] = useState(false);
    const pollingIntervalRef = useRef(null);

    // Load booking data from localStorage
    useEffect(() => {
        const loadBookingData = () => {
            const savedBooking = localStorage.getItem('hotelBooking');
            if (savedBooking) {
                try {
                    const data = JSON.parse(savedBooking);
                    setBookingData(data);
                } catch (error) {
                    console.error('Error parsing booking data:', error);
                    toast.error('Không thể tải thông tin đặt phòng');
                }
            } else {
                toast.warning('Chưa có thông tin đặt phòng');
            }
        };

        // Load on mount
        loadBookingData();

        // Reload when window gains focus (user comes back from another tab/page)
        const handleFocus = () => {
            loadBookingData();
        };

        // Reload when localStorage changes in another tab/window
        const handleStorageChange = (e) => {
            if (e.key === 'hotelBooking') {
                loadBookingData();
            }
        };

        window.addEventListener('focus', handleFocus);
        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('focus', handleFocus);
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    // Scroll to top when page loads
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Load vouchers from API
    useEffect(() => {
        const fetchVouchers = async () => {
            try {
                const response = await fetch(PUBLIC_API.HOTEL_VOUCHERS);
                const data = await response.json();
                if (data.code === 1000 && data.result) {
                    setVouchers(data.result);
                }
            } catch (error) {
                console.error('Error fetching vouchers:', error);
            }
        };

        fetchVouchers();
    }, []);

    // Polling để kiểm tra trạng thái thanh toán
    useEffect(() => {
        // Chỉ polling khi có orderCode và chưa hoàn thành thanh toán
        if (!orderCode || paymentCompleted) {
            return;
        }

        let timeoutRef = null;

        const checkPaymentStatus = async () => {
            try {
                setCheckingStatus(true);
                // Gọi API kiểm tra trạng thái thanh toán
                const response = await axiosClient.get(`payment/check-status/${orderCode}`);
                const data = response.data;
                
                console.log('Payment status:', data.result);
                
                if (data.result === 'PAID') {
                    // Thanh toán thành công
                    clearInterval(pollingIntervalRef.current);
                    pollingIntervalRef.current = null;
                    if (timeoutRef) clearTimeout(timeoutRef);
                    
                    setPaymentCompleted(true);
                    toast.success('🎉 Thanh toán thành công! Cảm ơn bạn đã đặt phòng.');
                    // Xóa booking data khỏi localStorage
                    localStorage.removeItem('hotelBooking');
                } else if (data.result === 'CANCELLED') {
                    // Thanh toán bị hủy
                    clearInterval(pollingIntervalRef.current);
                    pollingIntervalRef.current = null;
                    if (timeoutRef) clearTimeout(timeoutRef);
                    
                    toast.error('Giao dịch đã bị hủy.');
                    setPaymentSuccess(false);
                    setOrderCode(null);
                    setQrCodeData('');
                    setCheckoutUrl('');
                }
                // Nếu chưa có kết quả, tiếp tục polling
            } catch (error) {
                console.error('Error checking payment status:', error);
                // Không hiển thị lỗi để tránh spam, chỉ log
            } finally {
                setCheckingStatus(false);
            }
        };

        // Polling mỗi 2 giây
        pollingIntervalRef.current = setInterval(checkPaymentStatus, 2000);

        // Tự động dừng sau 15 phút (900000 ms)
        timeoutRef = setTimeout(() => {
            if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
                pollingIntervalRef.current = null;
            }
            console.log('Stopped polling due to timeout.');
            toast.warning('Hết thời gian chờ thanh toán. Vui lòng thử lại.');
        }, 900000);

        // Cleanup khi component unmount hoặc dependencies thay đổi
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

    // Format date to Vietnamese
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const weekdays = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const weekday = weekdays[date.getDay()];
        return `${weekday}, ngày ${day}/${month}/${year}`;
    };

    // Handle payment submission
    const handlePayment = async () => {
        // Reset validation errors
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
        
        // Validate guest info
        if (!guestLastName || guestLastName.trim() === '') {
            errors.guestLastName = true;
        }
        if (!guestFirstName || guestFirstName.trim() === '') {
            errors.guestFirstName = true;
        }
        if (!guestDOB || guestDOB.trim() === '') {
            errors.guestDOB = true;
        }
        
        // Check if there are any errors
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            toast.error('Vui lòng điền đầy đủ các trường bắt buộc (đánh dấu đỏ)');
            return;
        }
        
        if (!bookingData || !bookingData.room) {
            toast.error('Không tìm thấy thông tin đặt phòng');
            return;
        }

        setValidationErrors({});
        setPaymentLoading(true);
        
        // Additional date validation
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const checkIn = new Date(bookingData.checkInDate);
        const checkOut = new Date(bookingData.checkOutDate);
        
        if (checkIn < today) {
            toast.error('Ngày nhận phòng phải từ hôm nay trở đi');
            setPaymentLoading(false);
            return;
        }
        
        if (checkOut <= checkIn) {
            toast.error('Ngày trả phòng phải sau ngày nhận phòng');
            setPaymentLoading(false);
            return;
        }
        
        console.log('Booking dates:', {
            checkInDate: bookingData.checkInDate,
            checkOutDate: bookingData.checkOutDate
        });
        
        try {
            // Helper function to format date as yyyy-MM-dd
            const formatDateForAPI = (dateString) => {
                if (!dateString) return null;
                const date = new Date(dateString);
                if (isNaN(date.getTime())) return null;
                return date.toISOString().split('T')[0]; // Returns yyyy-MM-dd
            };

            const paymentData = {
                type: "HOTEL",
                contactName,
                contactPhone,
                contactEmail,
                paymentMethod: 'ATM',
                voucherCode: voucherCode || null,
                quantity: 1,
                roomId: bookingData.room.id,
                flightSeatId: 0,
                tourScheduleId: 0,
                checkInDate: formatDateForAPI(bookingData.checkInDate),
                checkOutDate: formatDateForAPI(bookingData.checkOutDate),
                hasTravelInsurance: false,
                hasDelayInsurance: false,
                extraBaggageKg: null,
                extraBaggagePrice: 0,
                passengers: [
                    {
                        fullName: `${guestLastName} ${guestFirstName}`,
                        gender: guestTitle === 'Ông' ? 'MALE' : 'FEMALE',
                        dob: formatDateForAPI(guestDOB),
                        nationality: guestNationality,
                        idNumber: '',
                        phoneNumber: contactPhone,
                        type: 'ADULT'
                    }
                ]
            };

            console.log('Payment data:', paymentData);

            // Sử dụng axiosClient để tự động refresh token khi hết hạn
            const response = await axiosClient.post('payment/create-payment-link', paymentData);
            const result = response.data;
            
            console.log('Payment API Response:', result);
            console.log('Result object:', result.result);
            
            if (result.code === 1000 && result.result) {
                // Lấy chuỗi dữ liệu QR và link thanh toán từ API
                const qrData = result.result.qrCode; // Chuỗi VietQR data
                const paymentLink = result.result.checkoutUrl; // Link thanh toán
                const paymentOrderCode = result.result.orderCode; // Order code để kiểm tra trạng thái
                const paymentLinkId = result.result.paymentLinkId || result.result.id || ''; // Payment ID
                
                console.log('QR Data:', qrData);
                console.log('Checkout URL:', paymentLink);
                console.log('Order Code:', paymentOrderCode);
                console.log('Payment ID:', paymentLinkId);
                
                setQrCodeData(qrData);
                setCheckoutUrl(paymentLink);
                setOrderCode(paymentOrderCode); // Lưu orderCode để polling kiểm tra trạng thái
                setPaymentId(paymentLinkId); // Lưu paymentId
                setPaymentSuccess(true); // Show QR section
                toast.success('Đã tạo link thanh toán thành công!');
                // Scroll to QR section
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
            // Xử lý lỗi cụ thể hơn
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
                    <h4 className="fw-bold mb-4 text-primary">Xác nhận đặt phòng</h4>
                <Row>
                    {/* Main Content - Left */}
                    <Col lg={8}>

                        {/* Header Hotel Info Card */}
                        <div className="section-box mb-4">
                            <Row className="g-3">
                                <Col md={4}>
                                    <div className="rounded-3 overflow-hidden h-100">
                                        <img
                                            src={bookingData?.hotel?.thumbnail || "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=2649&auto=format&fit=crop"}
                                            alt="Hotel"
                                            className="w-100 h-100 object-fit-cover"
                                            style={{ minHeight: '160px' }}
                                        />
                                    </div>
                                </Col>
                                <Col md={8}>
                                    <div className="d-flex align-items-center gap-2 mb-2">
                                        <div className="text-warning small">
                                            {bookingData?.hotel?.starRating && [...Array(bookingData.hotel.starRating)].map((_, i) => (
                                                <i key={i} className="bi bi-star-fill"></i>
                                            ))}
                                        </div>
                                        {bookingData?.room && (
                                            <Badge bg="light" text="dark" className="border fw-normal">
                                                <i className="bi bi-aspect-ratio me-1"></i>{bookingData.room.area}m²
                                            </Badge>
                                        )}
                                    </div>
                                    <h5 className="fw-bold text-primary mb-1">{bookingData?.hotel?.name || 'Đang tải...'}</h5>
                                    <div className="text-secondary small mb-3">
                                        <i className="bi bi-geo-alt-fill me-1"></i> {bookingData?.hotel?.address || ''}
                                    </div>
                                    {bookingData?.room && (
                                        <div className="mb-3">
                                            <div className="fw-bold text-dark small mb-1">Loại phòng: {bookingData.room.name}</div>
                                            <div className="text-muted small">
                                                <i className="bi bi-people-fill me-1"></i>{bookingData.room.capacity} người
                                            </div>
                                        </div>
                                    )}
                                    <div className="d-flex flex-column gap-1 text-dark small fw-medium">
                                        <div>Check-in: <span className="fw-bold">{bookingData?.checkInDate ? formatDate(bookingData.checkInDate) : ''}</span></div>
                                        <div>Check-out: <span className="fw-bold">{bookingData?.checkOutDate ? formatDate(bookingData.checkOutDate) : ''}</span></div>
                                        <div><i className="bi bi-moon-stars-fill me-1 text-secondary"></i> {bookingData?.nights || 0} đêm</div>
                                        <div><i className="bi bi-people-fill me-1 text-secondary"></i> {bookingData?.guestCount || '2 người'}</div>
                                    </div>
                                </Col>
                            </Row>
                        </div>

                        {/* QR Payment Section - Show after successful payment */}
                        {paymentSuccess && qrCodeData && (
                            <div id="qr-payment-section" className="section-box mb-4">
                                {/* Hiển thị khi đã thanh toán hoàn thành */}
                                {paymentCompleted ? (
                                    <div className="text-center py-4">
                                        <div className="mb-4">
                                            <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '80px' }}></i>
                                        </div>
                                        <h4 className="text-success fw-bold mb-3">🎉 Thanh toán thành công!</h4>
                                        <p className="text-muted mb-4">
                                            Cảm ơn bạn đã đặt phòng. Thông tin xác nhận đã được gửi đến email <strong>{contactEmail}</strong>
                                        </p>
                                        
                                        {/* Thông tin đặt phòng */}
                                        <div className="mb-4 p-3 bg-light rounded-3 text-start">
                                            <h6 className="text-primary fw-bold mb-3">
                                                <i className="bi bi-info-circle-fill me-2"></i>
                                                Chi tiết đặt phòng
                                            </h6>
                                            <Row className="g-2">
                                                <Col md={6}>
                                                    <div className="small"><strong>Khách sạn:</strong> {bookingData?.hotel?.name}</div>
                                                    <div className="small"><strong>Phòng:</strong> {bookingData?.room?.name}</div>
                                                    <div className="small"><strong>Check-in:</strong> {bookingData?.checkInDate ? formatDate(bookingData.checkInDate) : ''}</div>
                                                    <div className="small"><strong>Check-out:</strong> {bookingData?.checkOutDate ? formatDate(bookingData.checkOutDate) : ''}</div>
                                                </Col>
                                                <Col md={6}>
                                                    <div className="small"><strong>Khách lưu trú:</strong> {guestTitle} {guestLastName} {guestFirstName}</div>
                                                    <div className="small"><strong>Số điện thoại:</strong> {contactPhone}</div>
                                                    <div className="small"><strong>Email:</strong> {contactEmail}</div>
                                                    <div className="small"><strong>Tổng tiền:</strong> <span className="text-primary fw-bold">{bookingData?.totalPrice?.toLocaleString('vi-VN')}đ</span></div>
                                                </Col>
                                            </Row>
                                        </div>
                                        
                                        <div className="d-flex justify-content-center gap-3">
                                            <Button variant="primary" onClick={() => window.location.href = '/setting?tab=history'}>
                                                <i className="bi bi-clock-history me-2"></i>
                                                Xem lịch sử đặt phòng
                                            </Button>
                                            <Button variant="outline-primary" onClick={() => window.location.href = '/hotel'}>
                                                <i className="bi bi-house-door me-2"></i>
                                                Tiếp tục đặt phòng
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="alert alert-success mb-4">
                                            <i className="bi bi-check-circle-fill me-2"></i>
                                            Đã tạo link thanh toán thành công!
                                        </div>
                                        
                                        {/* Thông tin đã điền để kiểm tra */}
                                        <div className="mb-4 p-3 bg-light rounded-3">
                                            <h6 className="text-primary fw-bold mb-3">
                                                <i className="bi bi-person-check-fill me-2"></i>
                                                Thông tin đặt phòng
                                            </h6>
                                            
                                            {/* Thông tin liên hệ */}
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
                                            
                                            {/* Thông tin khách lưu trú */}
                                            <div>
                                                <div className="text-muted small fw-bold mb-2">Thông tin khách lưu trú</div>
                                                <Row className="g-2">
                                                    <Col md={4}>
                                                        <div className="d-flex align-items-center">
                                                            <i className="bi bi-person-badge-fill text-secondary me-2"></i>
                                                            <div>
                                                                <div className="text-muted x-small">Họ và tên</div>
                                                                <div className="fw-medium">{guestTitle} {guestLastName} {guestFirstName}</div>
                                                            </div>
                                                        </div>
                                                    </Col>
                                                    <Col md={4}>
                                                        <div className="d-flex align-items-center">
                                                            <i className="bi bi-calendar-event-fill text-secondary me-2"></i>
                                                            <div>
                                                                <div className="text-muted x-small">Ngày sinh</div>
                                                                <div className="fw-medium">{guestDOB ? new Date(guestDOB).toLocaleDateString('vi-VN') : ''}</div>
                                                            </div>
                                                        </div>
                                                    </Col>
                                                    <Col md={4}>
                                                        <div className="d-flex align-items-center">
                                                            <i className="bi bi-globe2 text-secondary me-2"></i>
                                                            <div>
                                                                <div className="text-muted x-small">Quốc tịch</div>
                                                                <div className="fw-medium">{guestNationality}</div>
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
                                        
                                        {/* Trạng thái kiểm tra thanh toán */}
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
                                            Số tiền: <strong className="text-primary">{bookingData?.totalPrice?.toLocaleString('vi-VN')}đ</strong>
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
                                                    // Dừng polling khi quay lại
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

                        {/* Contact Info - Hide when payment successful */}
                        {!paymentSuccess && (
                        <>
                        <div className="section-box mb-4">
                            <h5 className="section-title text-primary mb-3">Thông tin liên hệ</h5>
                            <Row className="g-3">
                                <Col md={12}>
                                    <Form.Group>
                                        <Form.Label className="fw-bold small">Họ và tên <span className="text-danger">*</span></Form.Label>
                                        <Form.Control 
                                            type="text" 
                                            placeholder="Nguyễn Văn A"
                                            className={`bg-light border-light py-2 ${validationErrors.contactName ? 'is-invalid' : ''}`}
                                            value={contactName}
                                            onChange={(e) => setContactName(e.target.value)}
                                        />
                                        {validationErrors.contactName && <div className="invalid-feedback">Vui lòng nhập họ và tên</div>}
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label className="fw-bold small">Số điện thoại <span className="text-danger">*</span></Form.Label>
                                        <Form.Control 
                                            type="tel" 
                                            placeholder="0901234567"
                                            className={`bg-light border-light py-2 ${validationErrors.contactPhone ? 'is-invalid' : ''}`}
                                            value={contactPhone}
                                            onChange={(e) => setContactPhone(e.target.value)}
                                        />
                                        {validationErrors.contactPhone && <div className="invalid-feedback">Vui lòng nhập số điện thoại</div>}
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label className="fw-bold small">Email <span className="text-danger">*</span></Form.Label>
                                        <Form.Control 
                                            type="email" 
                                            placeholder="example@email.com"
                                            className={`bg-light border-light py-2 ${validationErrors.contactEmail ? 'is-invalid' : ''}`}
                                            value={contactEmail}
                                            onChange={(e) => setContactEmail(e.target.value)}
                                        />
                                        {validationErrors.contactEmail && <div className="invalid-feedback">Vui lòng nhập email</div>}
                                    </Form.Group>
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
                                        <Form.Select 
                                            className="bg-light border-light py-2"
                                            value={guestTitle}
                                            onChange={(e) => setGuestTitle(e.target.value)}
                                        >
                                            <option>Ông</option>
                                            <option>Bà</option>
                                            <option>Cô</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label className="fw-bold small">Họ <span className="text-danger">*</span></Form.Label>
                                        <Form.Control 
                                            type="text" 
                                            placeholder="Họ trên CCCD (không dấu)" 
                                            className={`bg-light border-light py-2 ${validationErrors.guestLastName ? 'is-invalid' : ''}`}
                                            value={guestLastName}
                                            onChange={(e) => setGuestLastName(e.target.value)}
                                        />
                                        {validationErrors.guestLastName && <div className="invalid-feedback">Vui lòng nhập họ</div>}
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label className="fw-bold small">Tên <span className="text-danger">*</span></Form.Label>
                                        <Form.Control 
                                            type="text" 
                                            placeholder="Tên trên CCCD (không dấu)" 
                                            className={`bg-light border-light py-2 ${validationErrors.guestFirstName ? 'is-invalid' : ''}`}
                                            value={guestFirstName}
                                            onChange={(e) => setGuestFirstName(e.target.value)}
                                        />
                                        {validationErrors.guestFirstName && <div className="invalid-feedback">Vui lòng nhập tên</div>}
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label className="fw-bold small">Ngày sinh <span className="text-danger">*</span></Form.Label>
                                        <Form.Control 
                                            type="date" 
                                            className={`bg-light border-light py-2 ${validationErrors.guestDOB ? 'is-invalid' : ''}`}
                                            value={guestDOB}
                                            onChange={(e) => setGuestDOB(e.target.value)}
                                        />
                                        {validationErrors.guestDOB && <div className="invalid-feedback">Vui lòng chọn ngày sinh</div>}
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label className="fw-bold small">Quốc tịch <span className="text-danger">*</span></Form.Label>
                                        <Form.Select 
                                            className="bg-light border-light py-2"
                                            value={guestNationality}
                                            onChange={(e) => setGuestNationality(e.target.value)}
                                        >
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
                                        <Form.Control 
                                            type="text" 
                                            placeholder="Nhập mã khuyến mãi" 
                                            className="bg-light border-light"
                                            value={voucherCode}
                                            onChange={(e) => setVoucherCode(e.target.value)}
                                        />
                                    </Col>
                                    <Col xs="auto">
                                        <Button variant="primary" className="apply-btn fw-bold px-4">Áp dụng</Button>
                                    </Col>
                                </Row>
                                <div className="voucher-tags mt-2">
                                    {vouchers.map((voucher) => (
                                        <span 
                                            key={voucher.id}
                                            className="voucher-tag badge bg-light text-success border border-success border-opacity-25 rounded-pill px-3 py-2 me-2 mb-2 fw-normal"
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => {
                                                setVoucherCode(voucher.code);
                                            }}
                                        >
                                            <i className="bi bi-tag-fill me-1"></i> {voucher.code}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="payment-methods-tabs d-flex gap-2 mb-4">
                                <button
                                    className={`pm-tab btn rounded-pill px-4 py-2 fw-bold text-nowrap ${paymentMethod === 'INTERNATIONAL_CARD' ? 'btn-outline-primary active bg-primary text-white' : 'btn-outline-secondary text-dark border-opacity-25'}`}
                                    onClick={() => handlePaymentMethodChange('INTERNATIONAL_CARD')}
                                >
                                    Thẻ quốc tế
                                </button>
                                <button
                                    className={`pm-tab btn rounded-pill px-4 py-2 fw-bold text-nowrap ${paymentMethod === 'CREDIT_CARD' ? 'btn-outline-primary active bg-primary text-white' : 'btn-outline-secondary text-dark border-opacity-25'}`}
                                    onClick={() => handlePaymentMethodChange('CREDIT_CARD')}
                                >
                                    Thẻ tín dụng
                                </button>
                                <button
                                    className={`pm-tab btn rounded-pill px-4 py-2 fw-bold text-nowrap ${paymentMethod === 'ATM' ? 'btn-outline-primary active bg-primary text-white' : 'btn-outline-secondary text-dark border-opacity-25'}`}
                                    onClick={() => handlePaymentMethodChange('ATM')}
                                >
                                    ATM/Ngân hàng nội địa
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
                                className="w-100 fw-bold py-2 rounded-3" 
                                variant="primary"
                                onClick={handlePayment}
                                disabled={paymentLoading}
                            >
                                {paymentLoading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Đang xử lý...
                                    </>
                                ) : 'Thanh toán'}
                            </Button>

                        </div>
                        </>
                        )}

                    </Col>

                    {/* Sidebar - Right */}
                    <Col lg={4}>
                        {/* Bill Summary */}
                        <div className="section-box mb-4">
                            <h5 className="section-title text-primary mb-3">Hoá đơn</h5>
                            <div className="d-flex justify-content-between mb-2 small fw-medium text-secondary">
                                <span>Giá phòng ({bookingData?.nights || 1} đêm)</span>
                                <span className="text-dark fw-bold">{bookingData?.room?.price ? `${(bookingData.room.price * (bookingData.nights || 1)).toLocaleString('vi-VN')}đ` : '0đ'}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-3 small fw-medium text-secondary">
                                <span>Thuế và phí</span>
                                <span className="text-dark fw-bold">0đ</span>
                            </div>
                            <hr className="my-3 opacity-10" />
                            <div className="d-flex justify-content-between align-items-center">
                                <span className="fw-bold text-dark">Tổng cộng</span>
                                <span className="text-info fs-5 fw-bold">{bookingData?.totalPrice ? `${bookingData.totalPrice.toLocaleString('vi-VN')}đ` : '0đ'}</span>
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
        </div>
    );
};

export default Payment_Hotel;
