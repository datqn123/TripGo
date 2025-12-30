import React, { useState, useEffect } from 'react';
import Banner from "../../../components/User/Banner/Banner";
import AdvanceSearch from "../../../components/User/AdvanceSearch/AdvanceSearch";
import { Container, Row, Col, Card, Badge, Button } from 'react-bootstrap';
import './tour.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import tourApi from "../../../api/tourApi";

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

const Tour = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [tours, setTours] = useState([]);
    const [loadingTours, setLoadingTours] = useState(true);
    const [loadingVouchers, setLoadingVouchers] = useState(true);
    const [vouchers, setVouchers] = useState([]);
    const [filters, setFilters] = useState({
        page: 0,
        size: 12,
        name: location.state?.name || '',
        destinationId: '',
        priceRange: '',
        sortBy: 'id',
        sortDir: 'desc'
    });

    useEffect(() => {
        const fetchTours = async () => {
            setLoadingTours(true);
            try {
                const response = await tourApi.searchTours(filters);
                if (response && response.data && response.data.result) {
                    setTours(response.data.result.content || response.data.result.tours || response.data.result || []);
                }
            } catch (error) {
                console.error("Failed to fetch tours:", error);
            } finally {
                setLoadingTours(false);
            }
        };
        fetchTours();
    }, [filters]);

    useEffect(() => {
        const fetchVouchers = async () => {
            setLoadingVouchers(true);
            try {
                const response = await tourApi.getVouchersTour();
                if (response && response.data && response.data.result) {
                    setVouchers(response.data.result.content || response.data.result.vouchers || response.data.result || []);
                }
            } catch (error) {
                console.error("Failed to fetch vouchers:", error);
            } finally {
                setLoadingVouchers(false);
            }
        };
        fetchVouchers();
    }, []);

    const formatPrice = (price) => {
        return price ? price.toLocaleString('vi-VN') + ' VND' : 'Liên hệ';
    };
    const categories = [
        { icon: "bi-grid-fill", label: "Tất cả" },
        { icon: "bi-briefcase-fill", label: "Tour" },
        { icon: "bi-ticket-perforated-fill", label: "Điểm tham quan" },
        { icon: "bi-flower1", label: "Spa và Thư giãn" },
        { icon: "bi-cup-hot-fill", label: "Ẩm thực và trải nghiệm" },
    ];

    const vietnamPlaces = ["Đà Nẵng", "Tp Hồ Chí Minh", "Hà Nội", "Đà Lạt", "Nha Trang", "Phú Quốc", "Huế"];
    const worldPlaces = ["Bangkok","Seoul", "Tokyo", "Singapore", "Osaka", "HongKong"];

    const [activeVN, setActiveVN] = useState("Đà Nẵng");
    const [activeWorld, setActiveWorld] = useState("Bangkok");

    return (
        <>
            <Banner />
            <AdvanceSearch />
            <div className="tour-page py-4 bg-light">
                <Container>
                    {/* Categories */}
                    <div
                        className="category-section text-center mb-5"
                    >
                        <div className="d-flex justify-content-center gap-5 flex-wrap">
                            {categories.map((cat, idx) => (
                                <div key={idx} className="category-item d-flex flex-column align-items-center gap-2 cursor-pointer" onClick={() => navigate('/outstanding-tour', { state: { name: cat.label } })}>
                                    <div className={`cat-icon-circle rounded-circle d-flex align-items-center justify-content-center ${idx === 0 ? 'active' : ''}`}>
                                        <i className={`bi ${cat.icon}`}></i>
                                    </div>
                                    <span className="cat-label fw-bold small">{cat.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Vouchers section */}
                    <div className="mb-5">
                        <h4 className="fw-bold mb-3 d-flex align-items-center gap-2 text-primary" style={{ fontSize: "30px" }}>
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
                                                    <h6 className="fw-bold mb-1" style={{ fontSize: '14px', color: '#1976d2' }}>{v.voucherName || v.name || v.discount}</h6>
                                                    <p className="text-muted mb-0" style={{ 
                                                        display: '-webkit-box', 
                                                        WebkitLineClamp: 2, 
                                                        WebkitBoxOrient: 'vertical', 
                                                        overflow: 'hidden',
                                                        fontSize: '12px',
                                                        lineHeight: '1.5',
                                                        color: '#757575'
                                                    }}>
                                                        {v.description || v.sub}
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
                                                        const code = v.voucherCode || v.code;
                                                        if (code) {
                                                            navigator.clipboard.writeText(code);
                                                            toast.success('Đã sao chép mã: ' + code);
                                                        }
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

                    {/* Banners */}
                    <Row className="g-3 mb-5">
                        <Col md={4}>
                            <div className="banner-img rounded-4 overflow-hidden">
                                <img src="https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=2574&auto=format&fit=crop" className="w-100 object-fit-cover" height="180" alt="Banner 1" />
                            </div>
                        </Col>
                        <Col md={4}>
                            <div className="banner-img rounded-4 overflow-hidden">
                                <img src="https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=2574&auto=format&fit=crop" className="w-100 object-fit-cover" height="180" alt="Banner 2" />
                            </div>
                        </Col>
                        <Col md={4}>
                            <div className="banner-img rounded-4 overflow-hidden">
                                <img src="https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=2574&auto=format&fit=crop" className="w-100 object-fit-cover" height="180" alt="Banner 3" />
                            </div>
                        </Col>
                    </Row>

                    {/* Discover Vietnam */}
                    <div className="mb-5">
                        <h4 className="fw-bold mb-3 d-flex align-items-center gap-2 text-primary" style={{ fontSize: '30px' }}>
                            <i className="bi bi-signpost-2-fill"></i> Khám phá Tour
                        </h4>

                        <div className="d-flex gap-2 overflow-auto pb-3 mb-2 no-scrollbar">
                             {/* Keep Vietnam Places filters for demo/future implementation - clicking could update filters.destinationId */}
                            {vietnamPlaces.map((place, idx) => (
                                <Button
                                    key={idx}
                                    variant={activeVN === place ? "primary" : "outline-secondary"}
                                    className="rounded-pill fw-medium px-4 border-opacity-25 text-nowrap"
                                    onClick={() => {
                                        setActiveVN(place);
                                        // TODO: Map place name to destination ID if API supports name search or get ID map
                                        setFilters({...filters, name: place}); 
                                    }}
                                >
                                    {place}
                                </Button>
                            ))}
                        </div>

                        <Row className="g-4">
                            {loadingTours ? (
                                <div className="text-center py-5">Đang tải danh sách tour...</div>
                            ) : (
                                tours.length > 0 ? (
                                    tours.map((item, idx) => (
                                        <Col md={6} lg={3} key={item.id || idx}>
                                            <div className="position-relative cursor-pointer" onClick={() => navigate(`/tours/${item.id}`)}>
                                                <Card className="tour-card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
                                                    <div className="position-relative">
                                                        <Card.Img variant="top" src={item.image || item.thumbnail || "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b"} height="200" className="object-fit-cover" />
                                                        {item.discount && (
                                                            <Badge bg="danger" className="position-absolute top-0 end-0 m-3 py-2 px-3 rounded-pill">
                                                                <span style={{ color: "black" }}>{item.discountValue}</span>
                                                            </Badge>
                                                        )}
                                                        <div className="card-heart-icon position-absolute top-0 start-0 m-3 text-white">
                                                            <i className="bi bi-heart"></i>
                                                        </div>
                                                    </div>
                                                    <Card.Body className="d-flex flex-column p-3">
                                                        <div className="text-secondary x-small mb-1"><i className="bi bi-geo-alt-fill"></i> {item.destinationName || item.location || "Việt Nam"}</div>
                                                        <Card.Title className="fw-bold fs-6 mb-2 text-truncate-2 title-min-h">{item.title || item.name}</Card.Title>

                                                        <div className="d-flex gap-3 mb-2 x-small text-muted">
                                                            <span><i className="bi bi-calendar3"></i> {item.duration || "N/A"}</span>
                                                            <span><i className="bi bi-people-fill"></i> {item.maxGuests || item.guests || "N/A"}</span>
                                                        </div>
                                                        <div className="d-flex align-items-center gap-1 mb-3 x-small">
                                                            <i className="bi bi-star-fill text-warning"></i>
                                                            <span className="fw-bold">{item.rating || 4.5}</span>
                                                            <span className="text-muted">({item.reviews || 0} đánh giá)</span>
                                                        </div>

                                                        <div className="mt-auto">
                                                            {item.oldPrice && <div className="text-decoration-line-through text-muted x-small">{formatPrice(item.oldPrice)}</div>}
                                                            <div className="text-primary fw-bold fs-5">{formatPrice(item.price)}</div>
                                                        </div>
                                                    </Card.Body>
                                                </Card>
                                            </div>
                                        </Col>
                                    ))
                                ) : (
                                    <Col xs={12} className="text-center py-5">
                                        Không tìm thấy tour nào phù hợp.
                                    </Col>
                                )
                            )}
                        </Row>
                    </div>

                    {/* Discover World - For now, hide or reuse the same logic if we want to show world tours specifically. 
                        Let's hide it for now to avoid duplication or implementing complex logic without clear requirements.
                     */}
                    {/* <div className="mb-5"> ... </div> */}

                    {/* Discover World */}


                </Container>
            </div>
        </>
    );
};

export default Tour;
