import React, { useState } from 'react';
import './setting.css';

const Favorite = () => {
    const [activeTab, setActiveTab] = useState('hotel');

    const favoriteHotels = [
        {
            id: 1,
            name: "Glamour Hotel Da Nang",
            rating: 4.9,
            reviews: "1,259 đánh giá",
            price: "1.500.000 VND",
            image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=500&q=60"
        },
        {
            id: 2,
            name: "Glamour Hotel Da Nang",
            rating: 4.9,
            reviews: "1,259 đánh giá",
            price: "1.500.000 VND",
            image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=500&q=60"
        },
        {
            id: 3,
            name: "Glamour Hotel Da Nang",
            rating: 4.9,
            reviews: "1,259 đánh giá",
            price: "1.500.000 VND",
            image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=500&q=60"
        }
    ];

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
                            <div className="fav-grid">
                                {favoriteHotels.map(hotel => (
                                    <div className="fav-card" key={hotel.id}>
                                        <div className="fav-img-wrapper">
                                            <img src={hotel.image} alt={hotel.name} className="fav-img" />
                                            <button className="fav-heart-btn">
                                                <i className="bi bi-heart-fill"></i>
                                            </button>
                                        </div>
                                        <div className="fav-card-body">
                                            <h3 className="fav-title">{hotel.name}</h3>
                                            <div className="fav-rating">
                                                <i className="bi bi-star-fill"></i>
                                                <span>{hotel.rating}</span>
                                                <span className="text-muted">({hotel.reviews})</span>
                                            </div>
                                            <div className="fav-price-label">Giá mỗi đêm từ</div>
                                            <div className="fav-price">{hotel.price}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
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
