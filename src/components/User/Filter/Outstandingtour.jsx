import React, { useState, useRef, useEffect } from "react";
import "./filter-hotel.css";
import "./filter.css";

import { useLocation } from "react-router-dom";
import Banner from "../Banner/Banner";
import AdvanceSearch from "../AdvanceSearch/AdvanceSearch";

const Outstandingtour = ({ name }) => {
    const location = useLocation();
    const title = location.state?.name || name || "Điểm tham quan";

    const [sortOpen, setSortOpen] = useState(false);
    const [sortValue, setSortValue] = useState("Độ phổ biến");
    const sortRef = useRef(null);

    // Mock data based on the provided image
    const attractions = [
        {
            id: 1,
            title: "Vé VinWonders Nam Hội An",
            location: "Quảng Nam, Việt Nam",
            image: "https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?auto=format&fit=crop&w=500&q=60", // Replace with relevant image
            rating: 4.9,
            reviews: "1,259 đánh giá",
            price: "350.000 VND"
        },
        {
            id: 2,
            title: "Vé công viên khu nghỉ dưỡng Tokyo Disneyland",
            location: "Tokyo, Nhật Bản",
            image: "https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?auto=format&fit=crop&w=500&q=60",
            rating: 4.9,
            reviews: "1,259 đánh giá",
            price: "1.650.000 VND"
        },
        {
            id: 3,
            title: "Vé công viên nước The Amazing Bay Vịnh Kỳ Diệu",
            location: "Đồng Nai, Việt Nam",
            image: "https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?auto=format&fit=crop&w=500&q=60",
            rating: 4.9,
            reviews: "1,259 đánh giá",
            price: "340.000 VND"
        },
        {
            id: 4,
            title: "Van Gogh Museum",
            location: "Amsterdam, Netherlands",
            image: "https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?auto=format&fit=crop&w=500&q=60",
            rating: 4.9,
            reviews: "1,259 đánh giá",
            price: "789.000 VND"
        },
        {
            id: 5,
            title: "Vé show diễn Tinh Hoa Bắc Bộ",
            location: "Hà Nội, Việt Nam",
            image: "https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?auto=format&fit=crop&w=500&q=60",
            rating: 4.9,
            reviews: "1,259 đánh giá",
            price: "341.000 VND"
        },
        {
            id: 6,
            title: "Tiffany's Show at Pattaya Tickets",
            location: "Pattaya, Thái Lan",
            image: "https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?auto=format&fit=crop&w=500&q=60",
            rating: 4.9,
            reviews: "1,259 đánh giá",
            price: "984.000 VND"
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
        <>
        <Banner />
        <AdvanceSearch />
            <div className="hotel-page container">
            <div className="hotel-inner">
                {/* Sidebar Filter */}
                <aside className="hotel-sidebar">
                    <div className="filter-card">
                        <div className="filter-title">
                            <i className="bi bi-funnel"></i> Bộ lọc
                        </div>

                        <div className="filter-section">
                            <h4>Điểm tham quan</h4>
                            <label className="chk"><input type="checkbox" /> Công viên giải trí</label>
                            <label className="chk"><input type="checkbox" /> Bảo tàng phòng tranh</label>
                            <label className="chk"><input type="checkbox" /> Thiên nhiên và động vật</label>
                            <label className="chk"><input type="checkbox" /> Sự kiện</label>
                        </div>

                        <div className="filter-section">
                            <h4>Khoảng giá</h4>
                            <label className="chk"><input type="checkbox" /> Dưới 5.000.000đ</label>
                            <label className="chk"><input type="checkbox" /> 5.000.000đ - 10.000.000đ</label>
                            <label className="chk"><input type="checkbox" /> 10.000.000đ - 30.000.000đ</label>
                            <label className="chk"><input type="checkbox" /> Trên 30.000.000đ</label>
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
                            <h2 className="results-title">{title}</h2>
                            <p className="results-sub">10 kết quả được tìm thấy</p>
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
                        {attractions.map((item) => (
                            <div className="tour-card" key={item.id} style={{ height: 'auto' }}>
                                <div className="tour-header" style={{ height: '200px' }}>
                                    <img src={item.image} alt={item.title} className="tour-img" />
                                </div>
                                <div className="tour-body">
                                    <div className="tour-location">
                                        <i className="bi bi-geo-alt"></i> {item.location}
                                    </div>
                                    <h3 className="tour-title" style={{ fontSize: '15px', minHeight: '42px' }}>{item.title}</h3>

                                    <div className="tour-rating-row">
                                        <Stars n={item.rating} />
                                        <span>({item.reviews})</span>
                                    </div>

                                    <div className="tour-price-section" style={{ marginTop: '12px' }}>
                                        <div style={{ fontSize: '12px', color: '#64748b' }}>Chỉ từ</div>
                                        <div className="tour-price" style={{ color: '#009abb' }}>{item.price}</div>
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
        </>
    );
};

export default Outstandingtour;
