import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './hotel.css';
import Banner from '../../components/Banner/Banner';
import AdvanceSearch from '../../components/AdvanceSearch/AdvanceSearch';
import homeApi from '../../api/homeApi';

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
                const userId = localStorage.getItem('id') || 1;
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

    const hotelData = [
        {
            image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=2670&auto=format&fit=crop",
            location: "Đà Nẵng",
            title: "Khách sạn Chicland Đà Nẵng",
            rating: 4.9,
            reviews: 1259,
            oldPrice: "Giá mỗi đêm từ",
            price: "1.500.000 VND",
        },
        {
            image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=2574&auto=format&fit=crop",
            location: "Đà Nẵng",
            title: "Khách sạn Chicland Đà Nẵng",
            rating: 4.9,
            reviews: 1259,
            oldPrice: "Giá mỗi đêm từ",
            price: "1.500.000 VND",
        },
        {
            image: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=2670&auto=format&fit=crop",
            location: "Đà Nẵng",
            title: "Khách sạn Chicland Đà Nẵng",
            rating: 4.9,
            reviews: 1259,
            oldPrice: "Giá mỗi đêm từ",
            price: "1.500.000 VND",
        },
        {
            image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2670&auto=format&fit=crop",
            location: "Đà Nẵng",
            title: "Khách sạn Chicland Đà Nẵng",
            rating: 4.9,
            reviews: 1259,
            oldPrice: "Giá mỗi đêm từ",
            price: "1.500.000 VND",
        }
    ];

    const vietnamPlaces = ["Đà Nẵng", "Tp Hồ Chí Minh", "Hà Nội", "Đà Lạt", "Nha Trang", "Phú Quốc", "Huế"];
    const worldPlaces = ["Bangkok", "Seoul", "Tokyo", "Singapore", "Osaka", "HongKong"];

    const activeVN = "Đà Nẵng";
    const activeWorld = "Bangkok";

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
                        <Row className="g-4">
                            {loadingRecommendations ? (
                                // Skeleton Loading
                                [1, 2, 3, 4].map((_, idx) => (
                                    <Col md={6} lg={3} key={idx}>
                                        <SkeletonCard />
                                    </Col>
                                ))
                            ) : (
                                recommendations.slice(0, 4).map((item, idx) => (
                                    <Col md={6} lg={3} key={item.id || idx}>
                                        <div 
                                            className="position-relative cursor-pointer"
                                            onClick={() => navigate(`/hotel-detail/${item.id}`)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <Card className="tour-card h-100 border-0 shadow-sm rounded-4 overflow-hidden" >
                                                <div className="position-relative">
                                                    <Card.Img 
                                                        variant="top" 
                                                        src={item.thumbnail || "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=2670&auto=format&fit=crop"} 
                                                        height="200" 
                                                        className="object-fit-cover" 
                                                    />
                                                    <div className="card-heart-icon position-absolute top-0 end-0 m-3 text-white">
                                                        <i className="bi bi-heart"></i>
                                                    </div>
                                                </div>
                                                <Card.Body className="d-flex flex-column p-3">
                                                    <Card.Title className="fw-bold fs-6 mb-1 text-truncate-2">{item.name}</Card.Title>
                                                    <div className="text-muted x-small mb-1">
                                                        <i className="bi bi-geo-alt me-1"></i>{item.location}
                                                    </div>
                                                    <div className="d-flex align-items-center gap-1 mb-2 x-small">
                                                        <i className="bi bi-star-fill text-warning"></i>
                                                        <span className="fw-bold">{item.star_rating}</span>
                                                        <span className="text-muted">({item.total_reviews?.toLocaleString()} đánh giá)</span>
                                                    </div>

                                                    <div className="mt-auto">
                                                        <div className="text-muted x-small">Giá mỗi đêm từ</div>
                                                        <div className="text-primary fw-bold fs-5">
                                                            {typeof item.min_room_price === 'number' 
                                                                ? item.min_room_price.toLocaleString('vi-VN') 
                                                                : item.min_room_price} VND
                                                        </div>
                                                    </div>
                                                </Card.Body>
                                            </Card>
                                            {idx === 0 && <div className="nav-arrow prev"><i className="bi bi-chevron-left"></i></div>}
                                            {idx === 3 && <div className="nav-arrow next"><i className="bi bi-chevron-right"></i></div>}
                                        </div>
                                    </Col>
                                ))
                            )}
                        </Row>
                    </div>

                    {/* Discover Domestic */}
                    <div className="mb-5">
                        <h4 className="fw-bold mb-3 text-primary" style={{ fontSize: '30px' }}>Khám phá khách sạn nội địa</h4>
                        <div className="d-flex gap-2 overflow-auto pb-3 mb-2 no-scrollbar">
                            {vietnamPlaces.map((place, idx) => (
                                <Button
                                    key={idx}
                                    variant={activeVN === place ? "primary" : "outline-secondary"}
                                    className="rounded-pill fw-medium px-4 border-opacity-25 text-nowrap"
                                >
                                    {place}
                                </Button>
                            ))}
                        </div>
                        <Row className="g-4">
                            {hotelData.map((item, idx) => (
                                <Col md={6} lg={3} key={idx}>
                                    <div className="position-relative cursor-pointer">
                                        <Card className="tour-card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
                                            <div className="position-relative">
                                                <Card.Img variant="top" src={item.image} height="200" className="object-fit-cover" />
                                                <div className="card-heart-icon position-absolute top-0 end-0 m-3 text-white">
                                                    <i className="bi bi-heart"></i>
                                                </div>
                                            </div>
                                            <Card.Body className="d-flex flex-column p-3">
                                                <Card.Title className="fw-bold fs-6 mb-1 text-truncate-2">{item.title}</Card.Title>
                                                <div className="d-flex align-items-center gap-1 mb-2 x-small">
                                                    <i className="bi bi-star-fill text-warning"></i>
                                                    <span className="fw-bold">{item.rating}</span>
                                                    <span className="text-muted">({item.reviews} đánh giá)</span>
                                                </div>
                                                <div className="mt-auto">
                                                    <div className="text-muted x-small">{item.oldPrice}</div>
                                                    <div className="text-primary fw-bold fs-5">{item.price}</div>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                        {idx === 0 && <div className="nav-arrow prev"><i className="bi bi-chevron-left"></i></div>}
                                        {idx === 3 && <div className="nav-arrow next"><i className="bi bi-chevron-right"></i></div>}
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    </div>

                    {/* Discover International */}
                    <div className="mb-5">
                        <h4 className="fw-bold mb-3 text-primary" style={{ fontSize: '30px' }}>Vi vu khách sạn quốc tế</h4>
                        <div className="d-flex gap-2 overflow-auto pb-3 mb-2 no-scrollbar">
                            {worldPlaces.map((place, idx) => (
                                <Button
                                    key={idx}
                                    variant={activeWorld === place ? "primary" : "outline-secondary"}
                                    className="rounded-pill fw-medium px-4 border-opacity-25 text-nowrap"
                                >
                                    {place}
                                </Button>
                            ))}
                        </div>
                        <Row className="g-4">
                            {hotelData.map((item, idx) => (
                                <Col md={6} lg={3} key={idx}>
                                    <div className="position-relative cursor-pointer">
                                        <Card className="tour-card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
                                            <div className="position-relative">
                                                <Card.Img variant="top" src={item.image} height="200" className="object-fit-cover" />
                                                <div className="card-heart-icon position-absolute top-0 end-0 m-3 text-white">
                                                    <i className="bi bi-heart"></i>
                                                </div>
                                            </div>
                                            <Card.Body className="d-flex flex-column p-3">
                                                <Card.Title className="fw-bold fs-6 mb-1 text-truncate-2">{item.title}</Card.Title>
                                                <div className="d-flex align-items-center gap-1 mb-2 x-small">
                                                    <i className="bi bi-star-fill text-warning"></i>
                                                    <span className="fw-bold">{item.rating}</span>
                                                    <span className="text-muted">({item.reviews} đánh giá)</span>
                                                </div>
                                                <div className="mt-auto">
                                                    <div className="text-muted x-small">{item.oldPrice}</div>
                                                    <div className="text-primary fw-bold fs-5">{item.price}</div>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                        {idx === 0 && <div className="nav-arrow prev"><i className="bi bi-chevron-left"></i></div>}
                                        {idx === 3 && <div className="nav-arrow next"><i className="bi bi-chevron-right"></i></div>}
                                    </div>
                                </Col>
                            ))}
                        </Row>
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
                        <h4 className="fw-bold mb-3 text-primary text-center">Những điểm đến phố biển</h4>
                        <Row className="g-3">
                            <Col md={6}>
                                <div className="destination-card rounded-4 overflow-hidden position-relative h-100">
                                    <img src="https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?q=80&w=2600&auto=format&fit=crop" className="w-100 h-100 object-fit-cover" style={{ minHeight: '300px' }} alt="Da Nang" />
                                    <div className="destination-overlay position-absolute bottom-0 start-0 w-100 p-3 text-white bg-gradient-dark">
                                        <h5 className="fw-bold mb-0">Đà Nẵng</h5>
                                        <small>783 khách sạn</small>
                                    </div>
                                </div>
                            </Col>
                            <Col md={6}>
                                <Row className="g-3 h-100">
                                    <Col md={6}>
                                        <div className="destination-card rounded-4 overflow-hidden position-relative h-100">
                                            <img src="https://images.unsplash.com/photo-1540202404-a2f29016b523?q=80&w=2666&auto=format&fit=crop" className="w-100 h-100 object-fit-cover" style={{ minHeight: '140px' }} alt="Phu Quoc" />
                                            <div className="destination-overlay position-absolute bottom-0 start-0 w-100 p-3 text-white bg-gradient-dark">
                                                <h6 className="fw-bold mb-0">Phú Quốc</h6>
                                                <small className="x-small">341 khách sạn</small>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col md={6}>
                                        <div className="destination-card rounded-4 overflow-hidden position-relative h-100">
                                            <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2670&auto=format&fit=crop" className="w-100 h-100 object-fit-cover" style={{ minHeight: '140px' }} alt="Hue" />
                                            <div className="destination-overlay position-absolute bottom-0 start-0 w-100 p-3 text-white bg-gradient-dark">
                                                <h6 className="fw-bold mb-0">Huế</h6>
                                                <small className="x-small">247 khách sạn</small>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col md={6}>
                                        <div className="destination-card rounded-4 overflow-hidden position-relative h-100">
                                            <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2670&auto=format&fit=crop" className="w-100 h-100 object-fit-cover" style={{ minHeight: '140px' }} alt="Da Lat" />
                                            <div className="destination-overlay position-absolute bottom-0 start-0 w-100 p-3 text-white bg-gradient-dark">
                                                <h6 className="fw-bold mb-0">Đà Lạt</h6>
                                                <small className="x-small">321 khách sạn</small>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col md={6}>
                                        <div className="destination-card rounded-4 overflow-hidden position-relative h-100">
                                            <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2670&auto=format&fit=crop" className="w-100 h-100 object-fit-cover" style={{ minHeight: '140px' }} alt="HCMC" />
                                            <div className="destination-overlay position-absolute bottom-0 start-0 w-100 p-3 text-white bg-gradient-dark">
                                                <h6 className="fw-bold mb-0">TP Hồ Chí Minh</h6>
                                                <small className="x-small">1621 khách sạn</small>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </div>

                </Container>
            </div>
        </>
    );
};

export default Hotel;
