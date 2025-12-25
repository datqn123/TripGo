
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Form, Card, Badge } from 'react-bootstrap';
import axios from 'axios';
import { API_BASE_URL } from '../../../api/config';
import hotelApi from '../../../api/hotelApi';
import bookingApi from '../../../api/bookingApi';
import { toast } from 'react-toastify';
import './detail_hotel.css';
import Banner from '../../../components/User/Banner/Banner';
import AdvanceSearch from '../../../components/User/AdvanceSearch/AdvanceSearch';
import { PUBLIC_API } from '../../../api/config';
import reviewApi from '../../../api/reviewApi';
import ReviewList from '../../../components/User/Review/ReviewList';
import ReviewForm from '../../../components/User/Review/ReviewForm';
import recommenderApi from '../../../api/recommenderApi';

const Hotel_Detail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [hotel, setHotel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [checkInDate, setCheckInDate] = useState('');
    const [checkOutDate, setCheckOutDate] = useState('');
    const [guestCount, setGuestCount] = useState('2 người lớn');
    const [similarHotels, setSimilarHotels] = useState([]);

    // Review logic check
    const [reviews, setReviews] = useState([]);
    const [canReview, setCanReview] = useState(false);
    const [loadingReviews, setLoadingReviews] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Ensure id is valid integer/number if possible, or just checking against "undefined" string
                if (!id || id === 'undefined') return;

                const res = await hotelApi.getHotelById(id);
                // Extract result from the wrapper if present
                setHotel(res.data?.result || res.data);
                
                // Set default dates (today and tomorrow)
                const today = new Date();
                const tomorrow = new Date(today);
                tomorrow.setDate(today.getDate() + 1);
                setCheckInDate(today.toISOString().split('T')[0]);
                setCheckOutDate(tomorrow.toISOString().split('T')[0]);

                // Similar hotels
                try {
                    const similarRes = await recommenderApi.getSimilarHotels(id);
                    // The recommender API directly returns a list of hotels, or { similar_hotels: [...] }
                    // Based on Hotel.jsx logic, it might return { recommendations: [...] } or just an array.
                    // Let's assume the new endpoint follows standard pattern: data.result or data directly.
                    // Adjusting based on recommenderApi definition: axiosClient.get returns response.
                    
                    const similarData = similarRes.data?.similar_hotels || similarRes.data?.recommendations || similarRes.data || [];
                    
                    // Filter out current hotel just in case
                    const filtered = Array.isArray(similarData) ? similarData.filter(h => h.id !== parseInt(id)) : [];
                    setSimilarHotels(filtered.slice(0, 4));
                } catch (recError) {
                    console.error("Failed to fetch similar hotels", recError);
                    // Fail silently for recommendations, don't break the page
                }

            } catch (error) {
                console.error("Failed to fetch hotel details", error);
                toast.error("Không thể tải thông tin khách sạn");
            } finally {
                setLoading(false);
            }
        };

        if (id && id !== 'undefined') {
            fetchData();
        } else {
            setLoading(false); // Stop loading if invalid ID
        }
        window.scrollTo(0, 0);
    }, [id]);

    const fetchReviews = async () => {
        try {
            setLoadingReviews(true);
            const res = await reviewApi.getHotelReviews(id);
            console.log("FETCH REVIEWS RAW:", res); // DEBUG LOG
            
            // Check potential response structures
            let reviewData = res.data?.result || res.data || [];
            console.log("REVIEW DATA RAW:", reviewData); // DEBUG LOG
            
            // If result is a single object (has an id and not an array), wrap it
            if (reviewData && !Array.isArray(reviewData) && reviewData.id) {
                reviewData = [reviewData];
            }

            console.log("FINAL REVIEWS SET:", reviewData); // DEBUG LOG
            setReviews(Array.isArray(reviewData) ? reviewData : []);
        } catch (error) {
            console.error("Failed to fetch reviews", error);
            setReviews([]); 
        } finally {
            setLoadingReviews(false);
        }
    };

    const checkReviewEligibility = async () => {
        const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
        if (!token) return;

        try {
            const res = await reviewApi.checkMyReview(id);
            setCanReview(true); 
        } catch (error) {
            setCanReview(false);
        }
    };

    useEffect(() => {
        if (id && id !== 'undefined') {
            fetchReviews();
            checkReviewEligibility();
        }
    }, [id]);

    const handleRoomSelect = (room) => {
        setSelectedRoom(room);
    };

    const handleBookRoomClick = (room) => {
        setSelectedRoom(room);
        toast.info(`Đã chọn phòng: ${room.name}`);
        // Scroll to booking form
        const bookingForm = document.querySelector('.booking-card');
        if (bookingForm) {
            bookingForm.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleConfirmBooking = () => {
        if (!selectedRoom) {
            toast.error("Vui lòng chọn loại phòng trước");
            return;
        }

        const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
        if (!token) {
            toast.warning("Vui lòng đăng nhập để đặt phòng");
            navigate('/login', { state: { from: `/hotel-detail/${id}` } });
            return;
        }

        // Navigate to booking/payment page or open modal
        // For now, let's navigate to a payment page placeholder or use existing flow
        // Assuming there's a payment page receiving state
        navigate('/payment', { 
            state: { 
                hotelId: id,
                roomId: selectedRoom.id,
                roomName: selectedRoom.name,
                price: selectedRoom.price,
                checkIn: checkInDate,
                checkOut: checkOutDate,
                hotelName: hotel.name,
                image: hotel.images?.[0]?.imageUrl
            } 
        });
    };

    const handleReviewSubmit = () => {
        fetchReviews();
        setCanReview(false); 
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (!hotel) {
        return <div className="text-center py-5">Không tìm thấy khách sạn</div>;
    }

    // Get main image or default
    const mainImage = hotel.images?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2670&auto=format&fit=crop';
    
    // Get min room price
    const minRoomPrice = hotel.rooms?.length > 0 
        ? Math.min(...hotel.rooms.map(r => r.price))
        : hotel.pricePerNightFrom;

    // Get prominent amenities
    const prominentAmenities = hotel.amenities?.filter(a => a.isProminent) || [];
    const otherAmenities = hotel.amenities?.filter(a => !a.isProminent) || [];

    return (
        <div className="detail-page">
            <Banner />
            <AdvanceSearch />

            <div className="bg-light py-4">
                <Container>
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

                    <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 py-3 mb-4">
                        <div>
                            <h1 className="fw-bold text-primary-custom mb-2" style={{ fontSize: '32px' }}>{hotel.name}</h1>
                            <div className="d-flex align-items-center gap-2 mb-2 flex-wrap">
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

                    <div className="mb-5">
                        <img 
                            src={mainImage} 
                            alt={hotel.name}
                            className="w-100 rounded-4"
                            style={{ height: '400px', objectFit: 'cover' }}
                        />
                    </div>

                    <Row className="g-4">
                        <Col lg={8}>
                             <div className="bg-white rounded-4 p-4 shadow-sm mb-4">
                                <h5 className="fw-bold text-primary-custom mb-3">Giới thiệu</h5>
                                <p className="text-muted mb-0" style={{ lineHeight: '1.6' }}>
                                    {hotel.description || 'Chưa có mô tả.'}
                                </p>
                            </div>

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

                             {hotel.amenities?.length > 0 && (
                                <div className="bg-white rounded-4 p-4 shadow-sm mb-4">
                                    <h5 className="fw-bold text-primary-custom mb-3">Tiện nghi</h5>
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

                            <div className="bg-white rounded-4 p-4 shadow-sm mb-4">
                                <h5 className="fw-bold text-primary-custom mb-4">Đánh giá từ khách hàng</h5>
                                
                                <div className="mb-4">
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

                                {canReview && (
                                    <ReviewForm 
                                        hotelId={id} 
                                        onReviewSubmit={handleReviewSubmit}
                                        onCancel={() => setCanReview(false)} 
                                    />
                                )}

                                <ReviewList 
                                    reviews={reviews} 
                                />
                            </div>

                        </Col>

                        <Col lg={4}>
                             <div className="booking-sidebar d-flex flex-column gap-4">
                                <div className="booking-card p-4">
                                    <h5 className="fw-bold text-primary-custom mb-3 text-center border-bottom border-dashed pb-3 border-secondary border-opacity-25" style={{ borderStyle: 'dashed' }}>
                                        Đặt phòng
                                    </h5>
    
                                    <Form>
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
