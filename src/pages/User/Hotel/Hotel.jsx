import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Card, Badge, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './hotel.css';
import Banner from '../../../components/User/Banner/Banner';
import AdvanceSearch from '../../../components/User/AdvanceSearch/AdvanceSearch';
import homeApi from '../../../api/homeApi';
import { PUBLIC_API } from '../../../api/config';

// Skeleton loading component
const SkeletonCard = () => {
    const skeletonStyle = {
        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
        borderRadius: '8px',
    };

    return (
        <div style={{
            background: '#fff',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}>
            <div style={{ ...skeletonStyle, height: '200px', borderRadius: '16px 16px 0 0' }}></div>
            <div style={{ padding: '16px' }}>
                <div style={{ ...skeletonStyle, height: '20px', width: '80%', marginBottom: '12px' }}></div>
                <div style={{ ...skeletonStyle, height: '14px', width: '60%', marginBottom: '12px' }}></div>
                <div style={{ ...skeletonStyle, height: '24px', width: '50%' }}></div>
            </div>
        </div>
    );
};

// Skeleton for voucher cards
const VoucherSkeleton = () => {
    const skeletonStyle = {
        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
        borderRadius: '8px',
    };

    return (
        <div className="voucher-card p-3 bg-white rounded-3 shadow-sm d-flex gap-3 align-items-center h-100">
            <div style={{ ...skeletonStyle, width: '50px', height: '50px', borderRadius: '8px' }}></div>
            <div className="flex-grow-1">
                <div style={{ ...skeletonStyle, height: '16px', width: '80%', marginBottom: '8px' }}></div>
                <div style={{ ...skeletonStyle, height: '12px', width: '100%', marginBottom: '8px' }}></div>
                <div style={{ ...skeletonStyle, height: '20px', width: '40%' }}></div>
            </div>
        </div>
    );
};

const Hotel = () => {
    const navigate = useNavigate();
    
    // State for recommendations
    const [recommendations, setRecommendations] = useState([]);
    const [loadingRecommendations, setLoadingRecommendations] = useState(true);
    const [recommendationMessage, setRecommendationMessage] = useState('');

    // State for vouchers
    const [vouchers, setVouchers] = useState([]);
    const [loadingVouchers, setLoadingVouchers] = useState(true);

    // State for VN locations and hotels
    const [vnLocations, setVnLocations] = useState([]);
    const [selectedVNLocation, setSelectedVNLocation] = useState(null);
    const [vnHotels, setVnHotels] = useState([]);
    const [loadingVnHotels, setLoadingVnHotels] = useState(false);

    // State for International locations and hotels
    const [intlLocations, setIntlLocations] = useState([]);
    const [selectedIntlLocation, setSelectedIntlLocation] = useState(null);
    const [intlHotels, setIntlHotels] = useState([]);
    const [loadingIntlHotels, setLoadingIntlHotels] = useState(false);

    // State for popular destinations
    const [popularDestinations, setPopularDestinations] = useState([]);
    const [loadingDestinations, setLoadingDestinations] = useState(true);

    // Slider refs
    const vnSliderRef = useRef(null);
    const intlSliderRef = useRef(null);
    const recSliderRef = useRef(null);

    // Slider scroll functions
    const scrollSlider = (ref, direction) => {
        if (ref.current) {
            const scrollAmount = 300;
            ref.current.scrollBy({
                left: direction === 'next' ? scrollAmount : -scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    // Handle toggle favorite
    const handleToggleFavorite = async (e, hotelId, listType) => {
        e.stopPropagation(); // Prevent navigation to hotel detail
        
        // Check if user is logged in
        const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
        if (!token) {
            toast.warning('Vui lòng đăng nhập để thêm khách sạn yêu thích!');
            return;
        }

        try {
            // Call both APIs in parallel
            const [response] = await Promise.all([
                fetch(PUBLIC_API.TOGGLE_FAVORITE(hotelId), {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }),
            ]);

            if (response.ok) {
                // Update local state based on list type
                if (listType === 'recommendations') {
                    setRecommendations(prev => prev.map(hotel => 
                        hotel.id === hotelId ? { ...hotel, favorite: !hotel.favorite } : hotel
                    ));
                } else if (listType === 'vnHotels') {
                    setVnHotels(prev => prev.map(hotel => 
                        hotel.id === hotelId ? { ...hotel, favorite: !hotel.favorite } : hotel
                    ));
                } else if (listType === 'intlHotels') {
                    setIntlHotels(prev => prev.map(hotel => 
                        hotel.id === hotelId ? { ...hotel, favorite: !hotel.favorite } : hotel
                    ));
                }
                
                // Show success message
                const hotel = [...recommendations, ...vnHotels, ...intlHotels].find(h => h.id === hotelId);
                const isFavorite = hotel?.favorite;
                toast.success(isFavorite ? 'Đã xóa khỏi danh sách yêu thích!' : 'Đã thêm vào danh sách yêu thích!');
            } else {
                toast.error('Có lỗi xảy ra, vui lòng thử lại!');
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
            toast.error('Có lỗi xảy ra, vui lòng thử lại!');
        }
    };

    // Fetch VN locations from API
    useEffect(() => {
        const fetchVNLocations = async () => {
            try {
                const response = await fetch(PUBLIC_API.VN_LOCATIONS);
                const data = await response.json();
                const locations = data.result || [];
                setVnLocations(locations);
                
                // Auto-select first location if available
                if (locations.length > 0) {
                    setSelectedVNLocation(locations[0]);
                }
            } catch (error) {
                console.error('Error fetching VN locations:', error);
            }
        };

        fetchVNLocations();
    }, []);

    // Fetch hotels when VN location is selected
    useEffect(() => {
        const fetchHotelsByLocation = async () => {
            if (!selectedVNLocation) return;
            
            setLoadingVnHotels(true);
            try {
                const response = await fetch(PUBLIC_API.HOTELS_BY_LOCATION(selectedVNLocation.id));
                const data = await response.json();
                const hotels = data.result || [];
                setVnHotels(hotels.slice(0, 10)); // Limit to 10 hotels
            } catch (error) {
                console.error('Error fetching hotels by location:', error);
                setVnHotels([]);
            } finally {
                setLoadingVnHotels(false);
            }
        };

        fetchHotelsByLocation();
    }, [selectedVNLocation]);

    // Fetch International locations from API
    useEffect(() => {
        const fetchIntlLocations = async () => {
            try {
                const response = await fetch(PUBLIC_API.COUNTRY_LOCATIONS);
                const data = await response.json();
                const locations = data.result || [];
                // Filter out Vietnam
                const filteredLocations = locations.filter(loc => loc.name !== 'Việt Nam');
                setIntlLocations(filteredLocations);
                
                // Auto-select first location if available
                if (filteredLocations.length > 0) {
                    setSelectedIntlLocation(filteredLocations[0]);
                }
            } catch (error) {
                console.error('Error fetching international locations:', error);
            }
        };

        fetchIntlLocations();
    }, []);

    // Fetch hotels when International location is selected
    useEffect(() => {
        const fetchIntlHotelsByLocation = async () => {
            if (!selectedIntlLocation) return;
            
            setLoadingIntlHotels(true);
            try {
                const response = await fetch(PUBLIC_API.HOTELS_SEARCH(selectedIntlLocation.id));
                const data = await response.json();
                const hotels = data.result?.hotels || [];
                setIntlHotels(hotels.slice(0, 10)); // Limit to 10 hotels for slider
            } catch (error) {
                console.error('Error fetching international hotels:', error);
                setIntlHotels([]);
            } finally {
                setLoadingIntlHotels(false);
            }
        };

        fetchIntlHotelsByLocation();
    }, [selectedIntlLocation]);

    // Fetch popular destinations from API
    useEffect(() => {
        const fetchPopularDestinations = async () => {
            try {
                const response = await fetch(PUBLIC_API.DROPDOWN_LOCATIONS);
                const data = await response.json();
                const destinations = data.result || [];
                // Filter out locations with no hotels (count = 0 or null)
                const filteredDestinations = destinations.filter(dest => dest.count && dest.count > 0);
                setPopularDestinations(filteredDestinations);
            } catch (error) {
                console.error('Error fetching popular destinations:', error);
            } finally {
                setLoadingDestinations(false);
            }
        };

        fetchPopularDestinations();
    }, []);

    // Fetch vouchers from API
    useEffect(() => {
        const fetchVouchers = async () => {
            try {
                const res = await homeApi.getVouchers();
                const voucherData = res.data?.result || res.data || [];
                setVouchers(voucherData);
            } catch (error) {
                console.error('Error fetching vouchers:', error);
            } finally {
                setLoadingVouchers(false);
            }
        };

        fetchVouchers();
    }, []);

    // Fetch recommendations from API
    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                // Get user_id and token from localStorage
                const storedUser = localStorage.getItem('user');
                const userId = storedUser ? JSON.parse(storedUser).id : 1;
                const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
                
                const headers = {
                    'Content-Type': 'application/json',
                };
                
                // Add authorization header if token exists
                if (token) {
                    headers['Authorization'] = `Bearer ${token}`;
                }
                
                const response = await fetch(`https://recommender-trip-go-api.onrender.com/api/recommend/smart/${userId}/`, {
                    method: 'GET',
                    headers: headers,
                });
                const data = await response.json();
                console.log('Recommendations data:', data);
                console.log('User ID:', userId);
                console.log('Token:', token);
                
                setRecommendations(data.recommendations || []);
                setRecommendationMessage(data.message || '');
                setLoadingRecommendations(false);
            } catch (error) {
                console.error('Error fetching recommendations:', error);
                setLoadingRecommendations(false);
            }
        };

        fetchRecommendations();
    }, []);

    return (
        <>
            <Banner />
            <AdvanceSearch />
            <div className="hotel-page py-4 bg-light">
                <Container>

                    {/* Vouchers section */}
                    <div className="mb-5">
                        <h4 className="fw-bold mb-3 d-flex align-items-center gap-2 text-primary" style={{ fontSize: '30px' }}>
                            <i className="bi bi-gift-fill"></i> Ưu đãi và mã giảm giá
                        </h4>
                        <Row className="g-3">
                            {loadingVouchers ? (
                                // Skeleton Loading for vouchers
                                [1, 2, 3].map((_, idx) => (
                                    <Col md={4} key={idx}>
                                        <VoucherSkeleton />
                                    </Col>
                                ))
                            ) : vouchers.length > 0 ? (
                                vouchers.slice(0, 3).map((v, idx) => (
                                    <Col md={4} key={v.id || idx}>
                                        <div className="voucher-card bg-white rounded-4 shadow-sm h-100 d-flex flex-column" style={{ border: '1px solid #e0e0e0' }}>
                                            {/* Top section with icon and content */}
                                            <div className="d-flex gap-3 p-3 flex-grow-1">
                                                <div className="voucher-icon-box rounded-3 d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '48px', height: '48px', backgroundColor: '#e3f2fd' }}>
                                                    <i className="bi bi-file-earmark-text fs-4" style={{ color: '#42a5f5' }}></i>
                                                </div>
                                                <div className="flex-grow-1">
                                                    <h6 className="fw-bold mb-1" style={{ fontSize: '14px', color: '#1976d2' }}>{v.voucherName || v.name}</h6>
                                                    <p className="text-muted mb-0" style={{ 
                                                        display: '-webkit-box', 
                                                        WebkitLineClamp: 2, 
                                                        WebkitBoxOrient: 'vertical', 
                                                        overflow: 'hidden',
                                                        fontSize: '12px',
                                                        lineHeight: '1.5',
                                                        color: '#757575'
                                                    }}>
                                                        {v.description}
                                                    </p>
                                                </div>
                                            </div>
                                            {/* Bottom section with code and copy button */}
                                            <div className="border-top d-flex justify-content-between align-items-center px-3 py-2" style={{ backgroundColor: '#fafafa' }}>
                                                <span className="fw-bold px-2 py-1 rounded" style={{ 
                                                    fontSize: '12px', 
                                                    color: '#424242',
                                                    backgroundColor: '#fff',
                                                    border: '1px dashed #bdbdbd'
                                                }}>
                                                    {v.voucherCode || v.code}
                                                </span>
                                                <button 
                                                    className="btn btn-link p-0 text-decoration-none fw-bold"
                                                    style={{ fontSize: '13px', color: '#1976d2' }}
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(v.voucherCode || v.code);
                                                        toast.success('Đã sao chép mã: ' + (v.voucherCode || v.code));
                                                    }}
                                                >
                                                    Sao chép
                                                </button>
                                            </div>
                                        </div>
                                    </Col>
                                ))
                            ) : (
                                <Col>
                                    <p className="text-muted">Không có voucher nào.</p>
                                </Col>
                            )}
                        </Row>
                    </div>

                    {/* You Might Like */}
                    <div className="mb-5">
                        <h4 className="fw-bold mb-3 d-flex align-items-center gap-2 text-primary" style={{ fontSize: '30px' }}>
                            <i className="bi bi-heart-fill"></i> Có thể bạn sẽ thích
                        </h4>
                        {recommendationMessage && (
                            <p className="text-muted mb-3">{recommendationMessage}</p>
                        )}
                        
                        <div className="hotel-slider-container">
                            {/* Navigation Buttons */}
                            <button 
                                className="slider-nav-btn prev"
                                onClick={() => scrollSlider(recSliderRef, 'prev')}
                            >
                                <i className="bi bi-chevron-left"></i>
                            </button>
                            <button 
                                className="slider-nav-btn next"
                                onClick={() => scrollSlider(recSliderRef, 'next')}
                            >
                                <i className="bi bi-chevron-right"></i>
                            </button>

                            {/* Slider Content */}
                            <div className="hotel-slider-wrapper" ref={recSliderRef}>
                                {loadingRecommendations ? (
                                    // Skeleton Loading
                                    [1, 2, 3, 4].map((_, idx) => (
                                        <div className="hotel-slider-item" key={idx}>
                                            <SkeletonCard />
                                        </div>
                                    ))
                                ) : recommendations.length > 0 ? (
                                    recommendations.slice(0, 10).map((item, idx) => (
                                        <div 
                                            className="hotel-slider-item" 
                                            key={item.id || idx}
                                            onClick={() => navigate(`/hotel-detail/${item.id}`)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <Card className="hotel-card-uniform border-0 shadow-sm rounded-4 overflow-hidden">
                                                <div className="card-img-container position-relative">
                                                    <img 
                                                        src={item.thumbnail || "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=2670&auto=format&fit=crop"} 
                                                        alt={item.name}
                                                    />
                                                    <div 
                                                        className={`card-heart-icon position-absolute top-0 end-0 m-3 ${item.favorite ? 'text-danger' : 'text-white'}`}
                                                        onClick={(e) => handleToggleFavorite(e, item.id, 'recommendations')}
                                                        style={{ cursor: 'pointer' }}
                                                    >
                                                        <i className={item.favorite ? "bi bi-heart-fill" : "bi bi-heart"}></i>
                                                    </div>
                                                </div>
                                                <Card.Body className="p-3">
                                                    <Card.Title className="card-title">{item.name}</Card.Title>
                                                    <div className="card-info">
                                                        <div className="text-muted x-small mb-1">
                                                            <i className="bi bi-geo-alt me-1"></i>{item.location}
                                                        </div>
                                                        <div className="d-flex align-items-center gap-1 mb-2 x-small">
                                                            <i className="bi bi-star-fill text-warning"></i>
                                                            <span className="fw-bold">{item.star_rating || 0}</span>
                                                            <span className="text-muted">({item.total_reviews?.toLocaleString() || 0} đánh giá)</span>
                                                        </div>
                                                    </div>
                                                    <div className="card-price">
                                                        <div className="text-muted x-small">Giá mỗi đêm từ</div>
                                                        <div className="text-primary fw-bold fs-6">
                                                            {item.min_room_price 
                                                                ? `${item.min_room_price.toLocaleString('vi-VN')} VND`
                                                                : 'Liên hệ'}
                                                        </div>
                                                    </div>
                                                </Card.Body>
                                            </Card>
                                        </div>
                                    ))
                                ) : (
                                    <div className="w-100 text-center py-4">
                                        <p className="text-muted">Không có gợi ý khách sạn</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Discover Domestic */}
                    <div className="mb-5">
                        <h4 className="fw-bold mb-3 text-primary" style={{ fontSize: '30px' }}>Khám phá khách sạn nội địa</h4>
                        <div className="d-flex gap-2 overflow-auto pb-3 mb-2 no-scrollbar">
                            {vnLocations.map((location) => (
                                <Button
                                    key={location.id}
                                    variant={selectedVNLocation?.id === location.id ? "primary" : "outline-secondary"}
                                    className="rounded-pill fw-medium px-4 border-opacity-25 text-nowrap"
                                    onClick={() => setSelectedVNLocation(location)}
                                >
                                    {location.name}
                                </Button>
                            ))}
                        </div>
                        
                        <div className="hotel-slider-container">
                            {/* Navigation Buttons */}
                            <button 
                                className="slider-nav-btn prev"
                                onClick={() => scrollSlider(vnSliderRef, 'prev')}
                            >
                                <i className="bi bi-chevron-left"></i>
                            </button>
                            <button 
                                className="slider-nav-btn next"
                                onClick={() => scrollSlider(vnSliderRef, 'next')}
                            >
                                <i className="bi bi-chevron-right"></i>
                            </button>

                            {/* Slider Content */}
                            <div className="hotel-slider-wrapper" ref={vnSliderRef}>
                                {loadingVnHotels ? (
                                    // Skeleton Loading
                                    [1, 2, 3, 4].map((_, idx) => (
                                        <div className="hotel-slider-item" key={idx}>
                                            <SkeletonCard />
                                        </div>
                                    ))
                                ) : vnHotels.length > 0 ? (
                                    vnHotels.map((item, idx) => (
                                        <div 
                                            className="hotel-slider-item" 
                                            key={item.id || idx}
                                            onClick={() => navigate(`/hotel-detail/${item.id}`)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <Card className="hotel-card-uniform border-0 shadow-sm rounded-4 overflow-hidden">
                                                <div className="card-img-container position-relative">
                                                    <img 
                                                        src={item.thumbnail || "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=2670&auto=format&fit=crop"} 
                                                        alt={item.name}
                                                    />
                                                    <div 
                                                        className={`card-heart-icon position-absolute top-0 end-0 m-3 ${item.favorite ? 'text-danger' : 'text-white'}`}
                                                        onClick={(e) => handleToggleFavorite(e, item.id, 'vnHotels')}
                                                        style={{ cursor: 'pointer' }}
                                                    >
                                                        <i className={item.favorite ? "bi bi-heart-fill" : "bi bi-heart"}></i>
                                                    </div>
                                                </div>
                                                <Card.Body className="p-3">
                                                    <Card.Title className="card-title">{item.name}</Card.Title>
                                                    <div className="card-info">
                                                        <div className="text-muted x-small mb-1">
                                                            <i className="bi bi-geo-alt me-1"></i>{item.locationName || selectedVNLocation?.name}
                                                        </div>
                                                        <div className="d-flex align-items-center gap-1 mb-2 x-small">
                                                            <i className="bi bi-star-fill text-warning"></i>
                                                            <span className="fw-bold">{item.starRating || 0}</span>
                                                            <span className="text-muted">(0 đánh giá)</span>
                                                        </div>
                                                    </div>
                                                    <div className="card-price">
                                                        <div className="text-muted x-small">Giá mỗi đêm từ</div>
                                                        <div className="text-primary fw-bold fs-6">
                                                            {item.minPrice 
                                                                ? `${item.minPrice.toLocaleString('vi-VN')} VND`
                                                                : 'Liên hệ'}
                                                        </div>
                                                    </div>
                                                </Card.Body>
                                            </Card>
                                        </div>
                                    ))
                                ) : (
                                    <div className="w-100 text-center py-4">
                                        <p className="text-muted">Không có khách sạn nào tại {selectedVNLocation?.name}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Discover International */}
                    <div className="mb-5">
                        <h4 className="fw-bold mb-3 text-primary" style={{ fontSize: '30px' }}>Vi vu khách sạn quốc tế</h4>
                        <div className="d-flex gap-2 overflow-auto pb-3 mb-2 no-scrollbar">
                            {intlLocations.map((location) => (
                                <Button
                                    key={location.id}
                                    variant={selectedIntlLocation?.id === location.id ? "primary" : "outline-secondary"}
                                    className="rounded-pill fw-medium px-4 border-opacity-25 text-nowrap"
                                    onClick={() => setSelectedIntlLocation(location)}
                                >
                                    {location.name}
                                </Button>
                            ))}
                        </div>
                        
                        <div className="hotel-slider-container">
                            {/* Navigation Buttons */}
                            <button 
                                className="slider-nav-btn prev"
                                onClick={() => scrollSlider(intlSliderRef, 'prev')}
                            >
                                <i className="bi bi-chevron-left"></i>
                            </button>
                            <button 
                                className="slider-nav-btn next"
                                onClick={() => scrollSlider(intlSliderRef, 'next')}
                            >
                                <i className="bi bi-chevron-right"></i>
                            </button>

                            {/* Slider Content */}
                            <div className="hotel-slider-wrapper" ref={intlSliderRef}>
                                {loadingIntlHotels ? (
                                    // Skeleton Loading
                                    [1, 2, 3, 4].map((_, idx) => (
                                        <div className="hotel-slider-item" key={idx}>
                                            <SkeletonCard />
                                        </div>
                                    ))
                                ) : intlHotels.length > 0 ? (
                                    intlHotels.map((item, idx) => (
                                        <div 
                                            className="hotel-slider-item" 
                                            key={item.id || idx}
                                            onClick={() => navigate(`/hotel-detail/${item.id}`)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <Card className="hotel-card-uniform border-0 shadow-sm rounded-4 overflow-hidden">
                                                <div className="card-img-container position-relative">
                                                    <img 
                                                        src={item.thumbnail || "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=2670&auto=format&fit=crop"} 
                                                        alt={item.name}
                                                    />
                                                    <div 
                                                        className={`card-heart-icon position-absolute top-0 end-0 m-3 ${item.favorite ? 'text-danger' : 'text-white'}`}
                                                        onClick={(e) => handleToggleFavorite(e, item.id, 'intlHotels')}
                                                        style={{ cursor: 'pointer' }}
                                                    >
                                                        <i className={item.favorite ? "bi bi-heart-fill" : "bi bi-heart"}></i>
                                                    </div>
                                                </div>
                                                <Card.Body className="p-3">
                                                    <Card.Title className="card-title">{item.name}</Card.Title>
                                                    <div className="card-info">
                                                        <div className="text-muted x-small mb-1">
                                                            <i className="bi bi-geo-alt me-1"></i>{item.locationName || selectedIntlLocation?.name}
                                                        </div>
                                                        <div className="d-flex align-items-center gap-1 mb-2 x-small">
                                                            <i className="bi bi-star-fill text-warning"></i>
                                                            <span className="fw-bold">{item.starRating || 0}</span>
                                                            <span className="text-muted">(0 đánh giá)</span>
                                                        </div>
                                                    </div>
                                                    <div className="card-price">
                                                        <div className="text-muted x-small">Giá mỗi đêm từ</div>
                                                        <div className="text-primary fw-bold fs-6">
                                                            {item.minPrice 
                                                                ? `${item.minPrice.toLocaleString('vi-VN')} VND`
                                                                : 'Liên hệ'}
                                                        </div>
                                                    </div>
                                                </Card.Body>
                                            </Card>
                                        </div>
                                    ))
                                ) : (
                                    <div className="w-100 text-center py-4">
                                        <p className="text-muted">Không có khách sạn nào tại {selectedIntlLocation?.name}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sale Banner */}
                    <div className="mb-5 rounded-4 overflow-hidden position-relative">
                        <img src="https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=2600&auto=format&fit=crop" className="w-100 object-fit-cover" height="250" alt="Sale Banner" style={{ filter: 'brightness(0.8)' }} />
                        <div className="position-absolute top-50 start-0 translate-middle-y ps-5 text-white">
                            <div className="d-flex align-items-center gap-2 mb-2">
                                <i className="bi bi-geo-alt"></i> TripGo
                            </div>
                            <h2 className="fw-bold mb-3 display-5">GIẢM GIÁ ĐẾN 60%<br />TOÀN BỘ KHÁCH SẠN</h2>
                            <Button variant="warning" className="text-white fw-bold px-4 py-2 rounded-pill">Săn Deal Ngay</Button>
                        </div>
                    </div>

                    {/* Popular Destinations */}
                    <div className="mb-5">
                        <h4 className="fw-bold mb-3 text-primary text-center">Những điểm đến phổ biến</h4>
                        {loadingDestinations ? (
                            <Row className="g-3">
                                {[1, 2, 3, 4, 5].map((_, idx) => (
                                    <Col md={idx === 0 ? 6 : 3} key={idx}>
                                        <div style={{
                                            background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                                            backgroundSize: '200% 100%',
                                            animation: 'shimmer 1.5s infinite',
                                            borderRadius: '16px',
                                            height: idx === 0 ? '300px' : '140px'
                                        }}></div>
                                    </Col>
                                ))}
                            </Row>
                        ) : popularDestinations.length > 0 ? (
                            <Row className="g-3">
                                {/* First large card */}
                                {popularDestinations[0] && (
                                    <Col md={6}>
                                        <div 
                                            className="destination-card rounded-4 overflow-hidden position-relative h-100"
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => navigate(`/hotels?locationId=${popularDestinations[0].id}`)}
                                        >
                                            <img 
                                                src={popularDestinations[0].thumbnail || "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?q=80&w=2600&auto=format&fit=crop"} 
                                                className="w-100 h-100 object-fit-cover" 
                                                style={{ minHeight: '300px' }} 
                                                alt={popularDestinations[0].name} 
                                            />
                                            <div className="destination-overlay position-absolute bottom-0 start-0 w-100 p-3 text-white bg-gradient-dark">
                                                <h5 className="fw-bold mb-0">{popularDestinations[0].name}</h5>
                                                <small>{popularDestinations[0].count || 0} khách sạn</small>
                                            </div>
                                        </div>
                                    </Col>
                                )}
                                {/* Small cards grid */}
                                <Col md={6}>
                                    <Row className="g-3 h-100">
                                        {popularDestinations.slice(1, 5).map((dest, idx) => (
                                            <Col md={6} key={dest.id || idx}>
                                                <div 
                                                    className="destination-card rounded-4 overflow-hidden position-relative h-100"
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={() => navigate(`/hotels?locationId=${dest.id}`)}
                                                >
                                                    <img 
                                                        src={dest.thumbnail || "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2670&auto=format&fit=crop"} 
                                                        className="w-100 h-100 object-fit-cover" 
                                                        style={{ minHeight: '140px' }} 
                                                        alt={dest.name} 
                                                    />
                                                    <div className="destination-overlay position-absolute bottom-0 start-0 w-100 p-3 text-white bg-gradient-dark">
                                                        <h6 className="fw-bold mb-0">{dest.name}</h6>
                                                        <small className="x-small">{dest.count || 0} khách sạn</small>
                                                    </div>
                                                </div>
                                            </Col>
                                        ))}
                                    </Row>
                                </Col>
                            </Row>
                        ) : (
                            <div className="text-center py-4">
                                <p className="text-muted">Không có điểm đến nào.</p>
                            </div>
                        )}
                    </div>

                </Container>
            </div>
        </>
    );
};

export default Hotel;
