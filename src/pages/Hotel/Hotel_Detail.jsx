import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Form, Badge, Spinner, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import hotelApi from '../../api/hotelApi';
import './detail_hotel.css';
import Banner from '../../components/Banner/Banner';
import AdvanceSearch from '../../components/AdvanceSearch/AdvanceSearch';
import { PUBLIC_API } from '../../api/config';

const Hotel_Detail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [hotel, setHotel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [similarHotels, setSimilarHotels] = useState([]);
    const viewHistoryIdRef = useRef(null); // Store view history ID for duration tracking
    const hasTrackedRef = useRef(false); // Prevent double tracking from React Strict Mode

    // Booking modal state
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [checkInDate, setCheckInDate] = useState('');
    const [checkOutDate, setCheckOutDate] = useState('');
    const [guestCount, setGuestCount] = useState('2 người lớn');

    // Handle book room click
    const handleBookRoomClick = (room) => {
        setSelectedRoom(room);
        // Leave dates empty for user to input
        setCheckInDate('');
        setCheckOutDate('');
        
        // Scroll to booking form
        setTimeout(() => {
            const bookingCard = document.querySelector('.booking-card');
            if (bookingCard) {
                bookingCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 100);
    };

    // Auto-update localStorage when dates change
    useEffect(() => {
        const existingBooking = localStorage.getItem('hotelBooking');
        if (existingBooking && selectedRoom && checkInDate && checkOutDate) {
            try {
                const bookingData = JSON.parse(existingBooking);
                const checkIn = new Date(checkInDate);
                const checkOut = new Date(checkOutDate);
                const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
                const totalPrice = selectedRoom.price * nights;
                
                // Update dates and recalculate
                bookingData.checkInDate = checkInDate;
                bookingData.checkOutDate = checkOutDate;
                bookingData.nights = nights;
                bookingData.totalPrice = totalPrice;
                
                localStorage.setItem('hotelBooking', JSON.stringify(bookingData));
            } catch (error) {
                console.error('Error updating booking dates:', error);
            }
        }
    }, [checkInDate, checkOutDate, selectedRoom]);

    // Handle confirm booking
    const handleConfirmBooking = () => {
        // Validate dates
        if (!checkInDate || !checkOutDate) {
            toast.error('Vui lòng chọn ngày nhận và trả phòng');
            return;
        }
        
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        
        if (checkIn >= checkOut) {
            toast.error('Ngày trả phòng phải sau ngày nhận phòng');
            return;
        }

        // Calculate number of nights
        const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
        const totalPrice = selectedRoom.price * nights;

        // Create booking data
        const bookingData = {
            hotel: {
                id: hotel.id,
                name: hotel.name,
                address: hotel.address,
                thumbnail: hotel.images?.[0]?.imageUrl || '',
                starRating: hotel.starRating,
                checkInTime: hotel.checkInTime || '14:00',
                checkOutTime: hotel.checkOutTime || '12:00'
            },
            room: {
                id: selectedRoom.id,
                name: selectedRoom.name,
                price: selectedRoom.price,
                capacity: selectedRoom.capacity,
                area: selectedRoom.area
            },
            checkInDate,
            checkOutDate,
            nights,
            guestCount,
            totalPrice,
            createdAt: new Date().toISOString()
        };

        // Save to localStorage
        localStorage.setItem('hotelBooking', JSON.stringify(bookingData));
        
        // Close modal and navigate to payment
        setShowBookingModal(false);
        toast.success('Đã lưu thông tin đặt phòng!');
        navigate('/payment-hotel');
    };

    // Fetch hotel details from API
    useEffect(() => {
        const fetchHotelDetail = async () => {
            try {
                setLoading(true);
                const res = await hotelApi.getHotelById(id);
                const hotelData = res.data?.result || res.data;
                setHotel(hotelData);
            } catch (err) {
                console.error('Error fetching hotel details:', err);
                setError('Không thể tải thông tin khách sạn');
                toast.error('Không thể tải thông tin khách sạn');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchHotelDetail();
        }
    }, [id]);

    // Fetch similar hotels from recommender API
    useEffect(() => {
        const fetchSimilarHotels = async () => {
            try {
                const response = await fetch(`https://recommender-trip-go-api.onrender.com/api/recommend/${id}`);
                const data = await response.json();
                console.log('[Similar Hotels] API Response:', data);
                
                // Extract hotels from response
                const hotels = data?.recommendations || data?.hotels || data || [];
                setSimilarHotels(Array.isArray(hotels) ? hotels.slice(0, 4) : []);
            } catch (err) {
                console.error('Error fetching similar hotels:', err);
                setSimilarHotels([]);
            }
        };

        if (id) {
            fetchSimilarHotels();
        }
    }, [id]);

    // Track hotel view when user enters the page
    useEffect(() => {
        if (!id) return;
        
        // Skip if already tracked (prevents double call from React Strict Mode)
        if (hasTrackedRef.current) {
            console.log(`[View Track] Already tracked, skipping...`);
            return;
        }
        hasTrackedRef.current = true; // Mark as tracked IMMEDIATELY (sync)
        
        const trackHotelView = async () => {
            try {
                const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
                const url = PUBLIC_API.TRACK_VIEW(id);
                
                console.log(`[View Track] Tracking hotel view: ${id}`);
                
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token && { 'Authorization': `Bearer ${token}` })
                    }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    console.log('[View Track] Full response data:', data);
                    // Get the view history ID from response - result is the ID directly
                    viewHistoryIdRef.current = data.result?.id || data.id || data.result;
                    console.log(`[View Track] Response status: ${response.status}, viewHistoryId: ${viewHistoryIdRef.current}`);
                } else {
                    console.log(`[View Track] Response status: ${response.status}`);
                }
            } catch (err) {
                console.error('[View Track] Error:', err);
            }
        };
        
        trackHotelView();
    }, [id]);

    // Track view duration and send to API when leaving page
    useEffect(() => {
        if (!id) return;
        
        const startTime = Date.now();
        let hasSent = false;
        
        console.log(`[View Duration] Started tracking for hotel ${id} at ${new Date().toLocaleTimeString()}`);
        
        const sendViewDuration = () => {
            const currentViewHistoryId = viewHistoryIdRef.current;
            
            if (hasSent) {
                console.log('[View Duration] Already sent, skipping...');
                return;
            }
            
            const endTime = Date.now();
            const durationSeconds = Math.floor((endTime - startTime) / 1000);
            
            console.log(`[View Duration] Attempting to send: ${durationSeconds} seconds, viewHistoryId: ${currentViewHistoryId}`);
            
            // Only send if user spent at least 2 seconds and we have viewHistoryId
            if (durationSeconds >= 2 && currentViewHistoryId) {
                hasSent = true;
                const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
                
                const url = PUBLIC_API.UPDATE_DURATION(currentViewHistoryId, durationSeconds);
                console.log(`[View Duration] Sending PUT to: ${url}`);
                
                // Use synchronous XMLHttpRequest for beforeunload (fetch may not complete)
                try {
                    const xhr = new XMLHttpRequest();
                    xhr.open('PUT', url, false); // PUT method, false = synchronous
                    xhr.setRequestHeader('Content-Type', 'application/json');
                    if (token) {
                        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
                    }
                    xhr.send();
                    console.log(`[View Duration] Response status: ${xhr.status}`);
                } catch (err) {
                    console.error('[View Duration] Error:', err);
                }
            } else {
                console.log(`[View Duration] Skipped: duration=${durationSeconds}s, viewHistoryId=${currentViewHistoryId}`);
            }
        };

        // Handle page unload (close tab, refresh)
        const handleBeforeUnload = () => {
            console.log('[View Duration] beforeunload triggered');
            sendViewDuration();
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        // Cleanup: send duration when component unmounts (React navigation)
        return () => {
            console.log('[View Duration] Component unmounting');
            window.removeEventListener('beforeunload', handleBeforeUnload);
            sendViewDuration();
        };
    }, [id]);

    // Loading state
    if (loading) {
        return (
            <div className="detail-page py-5 bg-light d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
                <div className="text-center">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-3 text-muted">Đang tải thông tin khách sạn...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error || !hotel) {
        return (
            <div className="detail-page py-5 bg-light d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
                <div className="text-center">
                    <i className="bi bi-exclamation-circle text-danger" style={{ fontSize: '48px' }}></i>
                    <p className="mt-3 text-muted">{error || 'Không tìm thấy khách sạn'}</p>
                    <Button variant="primary" onClick={() => navigate('/hotel')}>
                        Quay lại danh sách
                    </Button>
                </div>
            </div>
        );
    }

    // Get main image or default
    const mainImage = hotel.images?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2670&auto=format&fit=crop';
    const subImages = hotel.images?.slice(1, 3) || [];

    // Get min room price
    const minRoomPrice = hotel.rooms?.length > 0 
        ? Math.min(...hotel.rooms.map(r => r.price))
        : hotel.pricePerNightFrom;

    // Get prominent amenities
    const prominentAmenities = hotel.amenities?.filter(a => a.isProminent) || [];
    const otherAmenities = hotel.amenities?.filter(a => !a.isProminent) || [];

    return (
        <div className="detail-page">
            {/* Hero Section - Same as Hotel page */}
            <Banner />
            <AdvanceSearch />

            {/* Main Content */}
            <div className="bg-light py-4">
                <Container>
                    {/* Breadcrumb */}
                    <nav aria-label="breadcrumb" className="mb-3">
                        <ol className="breadcrumb mb-0">
                            <li className="breadcrumb-item">
                                <a href="/" className="text-muted text-decoration-none small">Trang chủ</a>
                            </li>
                            <li className="breadcrumb-item">
                                <a href="/hotel" className="text-muted text-decoration-none small">Khách sạn</a>
                            </li>
                            <li className="breadcrumb-item active small" aria-current="page">{hotel.name}</li>
                        </ol>
                    </nav>

                    {/* Hotel Info */}
                    <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 py-3 mb-4">
                        <div>
                            <h1 className="fw-bold text-primary-custom mb-2" style={{ fontSize: '32px' }}>{hotel.name}</h1>
                            <div className="d-flex align-items-center gap-2 mb-2 flex-wrap">
                                {/* Star Rating */}
                                <div className="text-warning">
                                    {[...Array(hotel.starRating || 0)].map((_, i) => (
                                        <i key={i} className="bi bi-star-fill"></i>
                                    ))}
                                </div>
                                <Badge bg="warning" className="text-dark">
                                    <i className="bi bi-star-fill me-1"></i>{hotel.averageRating || 0}
                                </Badge>
                                <span className="text-muted small">({hotel.totalReviews?.toLocaleString() || 0} đánh giá)</span>
                            </div>
                            <div className="text-muted small">
                                <i className="bi bi-geo-alt-fill me-1 text-primary-custom"></i> {hotel.address}
                            </div>
                        </div>
                        <div className="text-end">
                            <div className="text-muted small">Giá mỗi đêm từ</div>
                            <div className="text-primary-custom fw-bold fs-2">
                                {minRoomPrice ? `${minRoomPrice.toLocaleString('vi-VN')}đ` : 'Liên hệ'}
                            </div>
                        </div>
                    </div>

                {/* Gallery - Single Image */}
                <div className="mb-5">
                    <img 
                        src={mainImage} 
                        alt={hotel.name}
                        className="w-100 rounded-4"
                        style={{ height: '400px', objectFit: 'cover' }}
                    />
                </div>

                <Row className="g-4">
                    {/* Left Content */}
                    <Col lg={8}>
                        {/* Intro */}
                        <div className="bg-white rounded-4 p-4 shadow-sm mb-4">
                            <h5 className="fw-bold text-primary-custom mb-3">Giới thiệu</h5>
                            <p className="text-muted mb-0" style={{ lineHeight: '1.6' }}>
                                {hotel.description || 'Chưa có mô tả.'}
                            </p>
                        </div>

                        {/* Location Info */}
                        {hotel.location && (
                            <div className="bg-white rounded-4 p-4 shadow-sm mb-4">
                                <h5 className="fw-bold text-primary-custom mb-3">Vị trí</h5>
                                <div className="d-flex align-items-center gap-3">
                                    <img 
                                        src={hotel.location.thumbnail} 
                                        alt={hotel.location.name}
                                        className="rounded-3"
                                        style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                                    />
                                    <div>
                                        <h6 className="fw-bold mb-1">{hotel.location.name}</h6>
                                        <p className="text-muted small mb-0">{hotel.location.description}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Amenities */}
                        {hotel.amenities?.length > 0 && (
                            <div className="bg-white rounded-4 p-4 shadow-sm mb-4">
                                <h5 className="fw-bold text-primary-custom mb-3">Tiện nghi</h5>
                                
                                {/* Prominent amenities */}
                                {prominentAmenities.length > 0 && (
                                    <div className="mb-3">
                                        <h6 className="text-muted small mb-2">Tiện nghi nổi bật</h6>
                                        <Row className="g-2">
                                            {prominentAmenities.map((item) => (
                                                <Col md={4} sm={6} key={item.id}>
                                                    <div className="amenity-item d-flex align-items-center gap-2 p-2 bg-light rounded-3">
                                                        <i className={`fa ${item.icon} text-primary`}></i>
                                                        <span className="small">{item.name}</span>
                                                    </div>
                                                </Col>
                                            ))}
                                        </Row>
                                    </div>
                                )}

                                {/* Other amenities */}
                                <Row className="g-3">
                                    {otherAmenities.map((item) => (
                                        <Col md={6} key={item.id}>
                                            <div className="amenity-item">
                                                <i className={`fa ${item.icon} me-2 text-primary`}></i>
                                                {item.name}
                                            </div>
                                        </Col>
                                    ))}
                                </Row>
                            </div>
                        )}

                        {/* Room Types */}
                        {hotel.rooms?.length > 0 && (
                            <div className="bg-white rounded-4 p-4 shadow-sm mb-4">
                                <h5 className="fw-bold text-primary-custom mb-4">Loại phòng</h5>
                                <div className="d-flex flex-column gap-3">
                                    {hotel.rooms.map((room) => (
                                        <div key={room.id} className="option-card">
                                            <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
                                                <div>
                                                    <h6 className="fw-bold fs-5 mb-2">{room.name}</h6>
                                                    <div className="d-flex gap-3 text-muted x-small mb-3">
                                                        <span><i className="bi bi-aspect-ratio"></i> {room.area}m²</span>
                                                        <span><i className="bi bi-people-fill"></i> {room.capacity} người</span>
                                                        <span><i className="bi bi-door-open"></i> Còn {room.quantity} phòng</span>
                                                    </div>
                                                    <div className="d-flex gap-2 flex-wrap">
                                                        {room.isAvailable ? (
                                                            <span className="tag-pill bg-success text-white">Còn phòng</span>
                                                        ) : (
                                                            <span className="tag-pill bg-danger text-white">Hết phòng</span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="text-end">
                                                    <div className="text-primary-custom fw-bold fs-4 mb-2">
                                                        {room.price?.toLocaleString('vi-VN')}đ
                                                    </div>
                                                    <Button 
                                                        className="bg-primary-custom border-0 rounded-3 px-4 fw-bold"
                                                        disabled={!room.isAvailable}
                                                        onClick={() => handleBookRoomClick(room)}
                                                    >
                                                        Đặt phòng
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Rating Breakdown */}
                        <div className="bg-white rounded-4 p-4 shadow-sm mb-4">
                            <h5 className="fw-bold text-primary-custom mb-3">Điểm đánh giá chi tiết</h5>
                            <Row className="g-3">
                                {[
                                    { label: 'Vệ sinh', score: hotel.cleanlinessScore },
                                    { label: 'Thoải mái', score: hotel.comfortScore },
                                    { label: 'Vị trí', score: hotel.locationScore },
                                    { label: 'Tiện nghi', score: hotel.facilitiesScore },
                                    { label: 'Nhân viên', score: hotel.staffScore },
                                ].map((item, idx) => (
                                    <Col md={6} key={idx}>
                                        <div className="d-flex justify-content-between align-items-center mb-1">
                                            <span className="small text-muted">{item.label}</span>
                                            <span className="fw-bold small">{item.score || 0}</span>
                                        </div>
                                        <div className="progress" style={{ height: '8px' }}>
                                            <div 
                                                className="progress-bar bg-primary" 
                                                style={{ width: `${(item.score || 0) * 10}%` }}
                                            ></div>
                                        </div>
                                    </Col>
                                ))}
                            </Row>
                        </div>

                        {/* Views */}
                        {hotel.views?.length > 0 && (
                            <div className="bg-white rounded-4 p-4 shadow-sm mb-4">
                                <h5 className="fw-bold text-primary-custom mb-3">View</h5>
                                <div className="d-flex gap-2 flex-wrap">
                                    {hotel.views.map((view, idx) => (
                                        <Badge key={idx} bg="light" text="dark" className="px-3 py-2">
                                            {view === 'MOUNTAIN_VIEW' ? '🏔️ View Núi' : 
                                             view === 'SEA_VIEW' ? '🌊 View Biển' : 
                                             view === 'CITY_VIEW' ? '🏙️ View Thành phố' : view}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                    </Col>

                    {/* Right Sidebar */}
                    <Col lg={4}>
                        <div className="booking-sidebar d-flex flex-column gap-4">
                            {/* Booking Widget */}
                            <div className="booking-card p-4">
                                <h5 className="fw-bold text-primary-custom mb-3 text-center border-bottom border-dashed pb-3 border-secondary border-opacity-25" style={{ borderStyle: 'dashed' }}>
                                    Đặt phòng
                                </h5>

                                <Form>
                                    {/* Show selected room info */}
                                    {selectedRoom && (
                                        <div className="mb-3 p-3 bg-light rounded-3">
                                            <div className="fw-bold text-primary-custom mb-1">{selectedRoom.name}</div>
                                            <div className="text-muted small">
                                                <i className="bi bi-aspect-ratio me-1"></i>{selectedRoom.area}m² • 
                                                <i className="bi bi-people-fill ms-2 me-1"></i>{selectedRoom.capacity} người
                                            </div>
                                        </div>
                                    )}

                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold small">Ngày nhận phòng</Form.Label>
                                        <div className="position-relative">
                                            <Form.Control 
                                                type="date" 
                                                className="form-control-custom ps-5" 
                                                value={checkInDate}
                                                onChange={(e) => setCheckInDate(e.target.value)}
                                            />
                                            <i className="bi bi-calendar3 position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
                                        </div>
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold small">Ngày trả phòng</Form.Label>
                                        <div className="position-relative">
                                            <Form.Control 
                                                type="date" 
                                                className="form-control-custom ps-5" 
                                                value={checkOutDate}
                                                onChange={(e) => setCheckOutDate(e.target.value)}
                                            />
                                            <i className="bi bi-calendar3 position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
                                        </div>
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold small">Số lượng khách</Form.Label>
                                        <Form.Select 
                                            className="form-control-custom"
                                            value={guestCount}
                                            onChange={(e) => setGuestCount(e.target.value)}
                                        >
                                            <option>1 người lớn</option>
                                            <option>2 người lớn</option>
                                            <option>2 người lớn, 1 trẻ em</option>
                                            <option>2 người lớn, 2 trẻ em</option>
                                        </Form.Select>
                                    </Form.Group>

                                    <div className="dashed-line"></div>

                                    <div className="d-flex justify-content-between mb-2 small">
                                        <span className="text-muted">{selectedRoom ? selectedRoom.name : 'Giá phòng từ'}</span>
                                        <span className="fw-bold">
                                            {selectedRoom ? `${selectedRoom.price.toLocaleString('vi-VN')}đ` : (minRoomPrice ? `${minRoomPrice.toLocaleString('vi-VN')}đ` : 'Liên hệ')}
                                        </span>
                                    </div>

                                    <div className="dashed-line"></div>

                                    <Button 
                                        className="w-100 bg-primary-custom border-0 py-2 fw-bold rounded-3"
                                        onClick={handleConfirmBooking}
                                        disabled={!selectedRoom}
                                    >
                                        Đặt phòng
                                    </Button>
                                </Form>
                            </div>

                            {/* Hotel Info Summary */}
                            <div className="bg-white rounded-4 p-4 shadow-sm">
                                <h6 className="fw-bold text-primary-custom mb-3">Thông tin liên hệ</h6>
                                <div className="d-flex flex-column gap-2 small">
                                    <div className="d-flex align-items-center gap-2">
                                        <i className="bi bi-clock text-primary"></i>
                                        <span>Check-in: {hotel.checkInTime || '14:00'}</span>
                                    </div>
                                    <div className="d-flex align-items-center gap-2">
                                        <i className="bi bi-clock text-primary"></i>
                                        <span>Check-out: {hotel.checkOutTime || '12:00'}</span>
                                    </div>
                                    {hotel.contactPhone && (
                                        <div className="d-flex align-items-center gap-2">
                                            <i className="bi bi-telephone text-primary"></i>
                                            <span>{hotel.contactPhone}</span>
                                        </div>
                                    )}
                                    {hotel.contactEmail && (
                                        <div className="d-flex align-items-center gap-2">
                                            <i className="bi bi-envelope text-primary"></i>
                                            <span>{hotel.contactEmail}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>

            {/* Similar Hotels Section */}
            {similarHotels.length > 0 && (
                <div className="bg-white py-5">
                    <Container>
                        <h4 className="fw-bold text-primary-custom mb-4">Khách sạn tương tự</h4>
                        <Row className="g-4">
                            {similarHotels.map((similarHotel) => (
                                <Col key={similarHotel.id} md={6} lg={3}>
                                    <Card 
                                        className="similar-hotel-card"
                                        onClick={() => navigate(`/hotel-detail/${similarHotel.id}`)}
                                    >
                                        <div className="card-img-wrapper">
                                            <img 
                                                src={similarHotel.thumbnail || similarHotel.images?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2670&auto=format&fit=crop'} 
                                                alt={similarHotel.name}
                                            />
                                        </div>
                                        <Card.Body>
                                            <Card.Title className="card-title">
                                                {similarHotel.name}
                                            </Card.Title>
                                            <div className="hotel-type-stars">
                                                <span>Khách sạn</span>
                                                <div className="text-warning stars">
                                                    {[...Array(similarHotel.starRating || 3)].map((_, i) => (
                                                        <i key={i} className="bi bi-star-fill"></i>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="hotel-location">
                                                <i className="bi bi-geo-alt"></i>
                                                {similarHotel.location?.name || similarHotel.address?.split(',')[1]?.trim() || 'Việt Nam'}
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </Container>
                </div>
            )}
            </div>
        </div>
    );
};

export default Hotel_Detail;
