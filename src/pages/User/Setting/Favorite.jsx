import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { PUBLIC_API } from '../../../api/config';
import './setting.css';

const Favorite = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('hotel');
    const [favoriteHotels, setFavoriteHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch favorite hotels from API
    useEffect(() => {
        const fetchFavoriteHotels = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
                
                if (!token) {
                    toast.warning('Vui lòng đăng nhập để xem danh sách yêu thích');
                    navigate('/login');
                    return;
                }

                const response = await fetch(PUBLIC_API.FAVORITE_HOTELS, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        toast.error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại');
                        localStorage.removeItem('accessToken');
                        localStorage.removeItem('token');
                        navigate('/login');
                        return;
                    }
                    throw new Error('Không thể tải danh sách yêu thích');
                }

                const data = await response.json();
                console.log('Favorite hotels:', data);
                setFavoriteHotels(data.result || data || []);
            } catch (err) {
                console.error('Error fetching favorite hotels:', err);
                setError(err.message);
                toast.error('Không thể tải danh sách yêu thích');
            } finally {
                setLoading(false);
            }
        };

        if (activeTab === 'hotel') {
            fetchFavoriteHotels();
        }
    }, [activeTab, navigate]);

    // Handle toggle favorite (remove from favorites)
    const handleToggleFavorite = async (hotelId) => {
        try {
            const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
            
            const response = await fetch(PUBLIC_API.TOGGLE_FAVORITE(hotelId), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                // Remove from local state
                setFavoriteHotels(prev => prev.filter(hotel => hotel.id !== hotelId));
                toast.success('Đã xóa khỏi danh sách yêu thích!');
            } else {
                toast.error('Có lỗi xảy ra, vui lòng thử lại!');
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
            toast.error('Có lỗi xảy ra, vui lòng thử lại!');
        }
    };

    // Format currency
    const formatCurrency = (price) => {
        if (!price) return 'Liên hệ';
        return price.toLocaleString('vi-VN') + ' VND';
    };

    const favoriteTours = [
        {
            id: 1,
            name: "Tour Vịnh Hạ Long 2N1D",
            duration: "2N1D",
            people: "4-6 người",
            oldPrice: "6.000.000 VND",
            price: "4.800.000 VND",
            image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=500&q=60"
        },
        {
            id: 2,
            name: "Tour Vịnh Hạ Long 2N1D",
            duration: "2N1D",
            people: "4-6 người",
            oldPrice: "6.000.000 VND",
            price: "4.800.000 VND",
            image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=500&q=60"
        }
    ];

    return (
        <div>
            <h2 className="account-section-title">Yêu thích</h2>

            <div className="setting-card">
                <div className="setting-card-body">
                    <div className="setting-tabs">
                        <button
                            className={`setting-tab-item ${activeTab === 'hotel' ? 'active' : ''}`}
                            onClick={() => setActiveTab('hotel')}
                        >
                            Khách sạn
                        </button>
                        <button
                            className={`setting-tab-item ${activeTab === 'tour' ? 'active' : ''}`}
                            onClick={() => setActiveTab('tour')}
                        >
                            Hoạt động & Tour
                        </button>
                        <button
                            className={`setting-tab-item ${activeTab === 'flight' ? 'active' : ''}`}
                            onClick={() => setActiveTab('flight')}
                        >
                            Chuyến bay
                        </button>
                    </div>

                    <div className="tab-content py-4">
                        {activeTab === 'hotel' && (
                            <>
                                {/* Loading State */}
                                {loading && (
                                    <div className="text-center py-5">
                                        <Spinner animation="border" variant="primary" />
                                        <p className="mt-3 text-muted">Đang tải danh sách yêu thích...</p>
                                    </div>
                                )}

                                {/* Error State */}
                                {error && !loading && (
                                    <div className="alert alert-danger" role="alert">
                                        <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                        {error}
                                    </div>
                                )}

                                {/* Empty State */}
                                {!loading && !error && favoriteHotels.length === 0 && (
                                    <div className="text-start">
                                        <p className="empty-state-text">Bạn chưa lưu khách sạn nào vào danh sách yêu thích</p>
                                    </div>
                                )}

                                {/* Hotels Grid */}
                                {!loading && !error && favoriteHotels.length > 0 && (
                                    <div className="fav-grid">
                                        {favoriteHotels.map(hotel => (
                                            <div 
                                                className="fav-card" 
                                                key={hotel.id}
                                                onClick={() => navigate(`/hotel-detail/${hotel.id}`)}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <div className="fav-img-wrapper">
                                                    <img 
                                                        src={hotel.thumbnail || hotel.images?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=500&q=60'} 
                                                        alt={hotel.name} 
                                                        className="fav-img" 
                                                    />
                                                    <button 
                                                        className="fav-heart-btn"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleToggleFavorite(hotel.id);
                                                        }}
                                                    >
                                                        <i className="bi bi-heart-fill"></i>
                                                    </button>
                                                </div>
                                                <div className="fav-card-body">
                                                    <h3 className="fav-title">{hotel.name}</h3>
                                                    <div className="fav-rating">
                                                        <i className="bi bi-star-fill"></i>
                                                        <span>{hotel.averageRating || hotel.starRating || 0}</span>
                                                        <span className="text-muted">({hotel.totalReviews || 0} đánh giá)</span>
                                                    </div>
                                                    <div className="fav-price-label">Giá mỗi đêm từ</div>
                                                    <div className="fav-price">{formatCurrency(hotel.pricePerNightFrom || hotel.minPrice)}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}

                        {activeTab === 'tour' && (
                            <div className="fav-grid">
                                {favoriteTours.map(tour => (
                                    <div className="fav-card" key={tour.id}>
                                        <div className="fav-img-wrapper">
                                            <img src={tour.image} alt={tour.name} className="fav-img" />
                                            <button className="fav-heart-btn">
                                                <i className="bi bi-heart-fill"></i>
                                            </button>
                                        </div>
                                        <div className="fav-card-body">
                                            <h3 className="fav-title">{tour.name}</h3>
                                            <div className="fav-meta">
                                                <div className="fav-meta-item">
                                                    <i className="bi bi-calendar3"></i> {tour.duration}
                                                </div>
                                                <div className="fav-meta-item">
                                                    <i className="bi bi-people"></i> {tour.people}
                                                </div>
                                            </div>
                                            <div className="fav-price-old">{tour.oldPrice}</div>
                                            <div className="fav-price">{tour.price}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'flight' && (
                            <div className="text-start">
                                <p className="empty-state-text">Bạn chưa lưu vé máy bay nào vào danh sách yêu thích</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Favorite;
