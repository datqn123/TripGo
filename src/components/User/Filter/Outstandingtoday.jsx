import React from 'react';
import { Container, Row, Col, Pagination } from 'react-bootstrap';
import './filter-hotel.css';

const Outstandingtoday = () => {
    const tours = [
        {
            id: 1,
            title: "Tour Vịnh Hạ Long 2N1Đ",
            location: "Quảng Ninh, Việt Nam",
            image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=500&q=60",
            duration: "2N1Đ",
            groupSize: "4-6 người",
            rating: 4.9,
            reviews: 1259,
            oldPrice: "6.000.000 VND",
            price: "4.800.000 VND",
            discount: "-25%"
        },
        {
            id: 2,
            title: "Thiên đường biển xanh Maldives",
            location: "North Atoll, Maldives",
            image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=500&q=60",
            duration: "5N4Đ",
            groupSize: "2 người",
            rating: 4.8,
            reviews: 1163,
            oldPrice: "60.000.000 VND",
            price: "48.000.000 VND",
            discount: "-20%"
        },
        {
            id: 3,
            title: "Khám phá văn hoá và ẩm thực Seoul",
            location: "Hàn Quốc",
            image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=500&q=60",
            duration: "4N3Đ",
            groupSize: "4 người",
            rating: 4.8,
            reviews: 3574,
            oldPrice: "48.000.000 VND",
            price: "36.000.000 VND",
            discount: "-25%"
        },
        {
            id: 4,
            title: "Tour Vịnh Hạ Long 2N1Đ",
            location: "Quảng Ninh, Việt Nam",
            image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=500&q=60",
            duration: "2N1Đ",
            groupSize: "4-6 người",
            rating: 4.9,
            reviews: 1259,
            oldPrice: "6.000.000 VND",
            price: "4.800.000 VND",
            discount: "-25%"
        },
        {
            id: 5,
            title: "Thiên đường biển xanh Maldives",
            location: "North Atoll, Maldives",
            image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=500&q=60",
            duration: "5N4Đ",
            groupSize: "2 người",
            rating: 4.8,
            reviews: 1163,
            oldPrice: "60.000.000 VND",
            price: "48.000.000 VND",
            discount: "-20%"
        },
        {
            id: 6,
            title: "Khám phá văn hoá và ẩm thực Seoul",
            location: "Hàn Quốc",
            image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=500&q=60",
            duration: "4N3Đ",
            groupSize: "4 người",
            rating: 4.8,
            reviews: 3574,
            oldPrice: "48.000.000 VND",
            price: "36.000.000 VND",
            discount: "-25%"
        }
    ];

    return (
        <section className="outstanding-today py-5">
            <Container>
                <h2 className="section-title mb-4" style={{ color: '#009abb', fontWeight: 'bold', fontSize: '2rem' }}>Ưu đãi hôm nay</h2>
                <div className="tour-list mb-5">
                    {tours.map(tour => (
                        <div key={tour.id} className="tour-card">
                            <div className="tour-header">
                                <img src={tour.image} alt={tour.title} className="tour-img" />
                                <span className="discount-tag">{tour.discount}</span>
                            </div>
                            <div className="tour-body">
                                <div className="tour-location">
                                    <i className="bi bi-geo-alt"></i> {tour.location}
                                </div>
                                <h3 className="tour-title">{tour.title}</h3>
                                <div className="tour-meta">
                                    <div className="tour-meta-item">
                                        <i className="bi bi-calendar"></i> {tour.duration}
                                    </div>
                                    <div className="tour-meta-item">
                                        <i className="bi bi-people"></i> {tour.groupSize}
                                    </div>
                                </div>
                                <div className="tour-rating-row">
                                    <i className="bi bi-star-fill text-warning"></i>
                                    <span className="fw-bold text-dark">{tour.rating}</span>
                                    <span>({tour.reviews.toLocaleString()} đánh giá)</span>
                                </div>
                                <div className="tour-price-section">
                                    <div className="tour-old-price">{tour.oldPrice}</div>
                                    <div className="tour-price">{tour.price}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                <div className="d-flex justify-content-center">
                    <div className="custom-pagination d-flex gap-2">
                        <button className="btn btn-outline-primary rounded-pill px-4">Trước</button>
                        <button className="btn btn-outline-secondary rounded-3 px-3">1</button>
                        <button className="btn btn-outline-secondary rounded-3 px-3">2</button>
                        <button className="btn btn-outline-primary rounded-pill px-4">Sau</button>
                    </div>
                </div>
            </Container>
        </section>
    );
};

export default Outstandingtoday;
