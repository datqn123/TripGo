
import React, { useState, useRef, useEffect } from "react";
import "./filter-hotel.css";
import "./filter.css";

const FilterTour = () => {
    const [sortOpen, setSortOpen] = useState(false);
    const [sortValue, setSortValue] = useState("Độ phổ biến");
    const sortRef = useRef(null);

    // Mock data based on the provided image
    const tours = [
        {
            id: 1,
            title: "Khám phá Bà Nà Hills - Cầu Vàng",
            location: "Đà Nẵng, Việt Nam",
            image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=500&q=60",
            discount: "-25%",
            duration: "1N",
            groupSize: "2 người",
            rating: 4.9,
            reviews: "1,259 đánh giá",
            oldPrice: "1.200.000 VND",
            price: "950.000 VND"
        },
        {
            id: 2,
            title: "Ngũ Hành Sơn - Chùa Linh Ứng",
            location: "Đà Nẵng, Việt Nam",
            image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=500&q=60",
            discount: "-20%",
            duration: "2N1Đ",
            groupSize: "2 người",
            rating: 4.8,
            reviews: "1,163 đánh giá",
            oldPrice: "900.000 VND",
            price: "720.000 VND"
        },
        {
            id: 3,
            title: "Đêm Hội An - Phố cổ và thuyền hoa đăng",
            location: "Đà Nẵng, Việt Nam",
            image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=500&q=60",
            discount: "-25%",
            duration: "1N",
            groupSize: "4 người",
            rating: 4.8,
            reviews: "3,574 đánh giá",
            oldPrice: "860.000 VND",
            price: "700.000 VND"
        },
        {
            id: 4,
            title: "Sơn Trà - Rừng thiên và nước xanh",
            location: "Đà Nẵng, Việt Nam",
            image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=500&q=60",
            discount: "-25%",
            duration: "2N1Đ",
            groupSize: "2-4 người",
            rating: 4.9,
            reviews: "1,259 đánh giá",
            oldPrice: "780.000 VND",
            price: "650.000 VND"
        },
        {
            id: 5,
            title: "Cù Lao Chàm - Lặn ngắm san hô",
            location: "North Atoll, Maldives",
            image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=500&q=60",
            discount: "-20%",
            duration: "2N1Đ",
            groupSize: "2 người",
            rating: 4.8,
            reviews: "1,163 đánh giá",
            oldPrice: "4.000.000 VND",
            price: "3.400.000 VND"
        },
        {
            id: 6,
            title: "Du thuyền sông Hồng - Cầu Rồng phun lửa",
            location: "Hàn Quốc",
            image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=500&q=60",
            discount: "-25%",
            duration: "4N3Đ",
            groupSize: "4 người",
            rating: 4.8,
            reviews: "3,574 đánh giá",
            oldPrice: "48.000.000 VND",
            price: "36.000.000 VND"
        }
    ];

    const sortOptions = ["Độ phổ biến", "Giá thấp đến cao", "Giá cao đến thấp", "Đánh giá cao nhất"];

    useEffect(() => {
        function onDocClick(e) {
            if (sortRef.current && !sortRef.current.contains(e.target)) setSortOpen(false);
        }
        document.addEventListener("click", onDocClick);
        return () => document.removeEventListener("click", onDocClick);
    }, []);

    const Stars = ({ n }) => (
        <div className="stars">
            <span className="star" style={{ color: "#fbbf24" }}>★</span>
            <span style={{ fontWeight: 600, color: "#1e293b", marginLeft: "4px" }}>{n}</span>
        </div>
    );

    return (
        <div className="hotel-page container">
            <div className="hotel-inner">
                {/* Sidebar Filter */}
                <aside className="hotel-sidebar">
                    <div className="filter-card">
                        <div className="filter-title">
                            <i className="bi bi-funnel"></i> Bộ lọc
                        </div>

                        <div className="filter-section">
                            <h4>Điểm đến</h4>
                            <label className="chk"><input type="checkbox" /> Việt Nam</label>
                            <label className="chk"><input type="checkbox" /> Nhật Bản</label>
                            <label className="chk"><input type="checkbox" /> Hàn Quốc</label>
                            <label className="chk"><input type="checkbox" /> Thái Lan</label>
                        </div>

                        <div className="filter-section">
                            <h4>Khoảng giá</h4>
                            <label className="chk"><input type="checkbox" /> Dưới 5.000.000đ</label>
                            <label className="chk"><input type="checkbox" /> 5.000.000đ - 10.000.000đ</label>
                            <label className="chk"><input type="checkbox" /> 10.000.000đ - 30.000.000đ</label>
                            <label className="chk"><input type="checkbox" /> Trên 30.000.000đ</label>
                        </div>

                        <div className="filter-section">
                            <h4>Tiện nghi</h4>
                            <label className="chk"><input type="checkbox" /> 1-2 ngày</label>
                            <label className="chk"><input type="checkbox" /> 3-4 ngày</label>
                            <label className="chk"><input type="checkbox" /> 5-7 ngày</label>
                            <label className="chk"><input type="checkbox" /> Trên 7 ngày</label>
                        </div>

                        <div className="filter-section">
                            <h4>Đánh giá</h4>
                            <label className="chk"><input type="checkbox" /> <span style={{ color: "#fbbf24" }}>★★★★★</span></label>
                            <label className="chk"><input type="checkbox" /> <span style={{ color: "#fbbf24" }}>★★★★</span></label>
                            <label className="chk"><input type="checkbox" /> <span style={{ color: "#fbbf24" }}>★★★</span></label>
                            <label className="chk"><input type="checkbox" /> <span style={{ color: "#fbbf24" }}>★★</span></label>
                            <label className="chk"><input type="checkbox" /> <span style={{ color: "#fbbf24" }}>★</span></label>
                        </div>

                        <div className="filter-apply">
                            <button className="btn-apply">Áp dụng bộ lọc</button>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="hotel-results">
                    <div className="results-head">
                        <div>
                            <h2 className="results-title">Đà Nẵng</h2>
                            <p className="results-sub">10 tour du lịch được tìm thấy</p>
                        </div>
                        <div className="sort" ref={sortRef}>
                            <span className="sort-label">Xếp theo</span>
                            <button className={`sort-btn ${sortOpen ? 'open' : ''}`} onClick={() => setSortOpen((s) => !s)}>
                                {sortValue} <i className="bi bi-chevron-down"></i>
                            </button>

                            {sortOpen && (
                                <ul className="sort-dropdown">
                                    {sortOptions.map((opt) => (
                                        <li
                                            key={opt}
                                            className={`sort-item ${opt === sortValue ? 'active' : ''}`}
                                            onClick={() => { setSortValue(opt); setSortOpen(false); }}
                                        >
                                            {opt}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>

                    <div className="tour-list">
                        {tours.map((tour) => (
                            <div className="tour-card" key={tour.id}>
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
                                            <i className="bi bi-calendar3"></i> {tour.duration}
                                        </div>
                                        <div className="tour-meta-item">
                                            <i className="bi bi-people"></i> {tour.groupSize}
                                        </div>
                                    </div>

                                    <div className="tour-rating-row">
                                        <Stars n={tour.rating} />
                                        <span>({tour.reviews})</span>
                                    </div>

                                    <div className="tour-price-section">
                                        <div className="tour-old-price">{tour.oldPrice}</div>
                                        <div className="tour-price">{tour.price}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="pagination">
                        <button className="page-btn" style={{ color: "#0ea5e9", borderColor: "#0ea5e9" }}>Trước</button>
                        <button className="page-num active">1</button>
                        <button className="page-num">2</button>
                        <button className="page-btn" style={{ color: "#0ea5e9", borderColor: "#0ea5e9" }}>Sau</button>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default FilterTour;
