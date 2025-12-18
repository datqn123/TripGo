import React from "react";
import "./filter.css";
import Banner from "../Banner/Banner";
import AdvanceSearch from "../AdvanceSearch/AdvanceSearch";
import { useNavigate } from "react-router-dom";
const mockOffers = [
    {
        id: 1,
        airline: "Vietnam Airlines",
        logo: "🌟",
        depTime: "06:00",
        arrTime: "07:30",
        depCity: "TP HCM",
        arrCity: "Đà Nẵng",
        duration: "1h 30m",
        date: "28/12/2025",
        oldPrice: "1.437.500đ",
        price: "1.150.000đ",
        discount: "-25%"
    },
    {
        id: 2,
        airline: "Vietnam Airlines",
        logo: "🌟",
        depTime: "18:00",
        arrTime: "20:55",
        depCity: "Đà Nẵng",
        arrCity: "Singapore",
        duration: "2h 55m",
        date: "23/12/2025",
        oldPrice: "6.700.000đ",
        price: "4.275.000đ",
        discount: "-36%"
    },
    {
        id: 3,
        airline: "Vietjet",
        logo: "✈️",
        depTime: "06:00",
        arrTime: "07:30",
        depCity: "TP.HCM",
        arrCity: "Hà Nội",
        duration: "1h 30m",
        date: "25/12/2025",
        oldPrice: "3.457.000đ",
        price: "1.150.000đ",
        discount: "-67%"
    }
];

const Outstandingoffer = () => {
    const navigate = useNavigate();
    return (
        <>
        <Banner/>
        <AdvanceSearch/>
            <div className="filter-page container">
                <div className="filter-inner">
                    <aside className="filter-sidebar">
                        <div className="filter-card">
                            <div className="filter-title">Bộ lọc</div>

                            <div className="filter-section">
                                <h4>Khoảng giá</h4>
                                <label className="chk"><input type="checkbox" /> Dưới 1.000.000đ</label>
                                <label className="chk"><input type="checkbox" /> 1.000.000đ - 2.000.000đ</label>
                                <label className="chk"><input type="checkbox" /> 2.000.000đ - 4.000.000đ</label>
                                <label className="chk"><input type="checkbox" /> Trên 4.000.000đ</label>
                            </div>

                            <div className="filter-section">
                                <h4>Hãng hàng không</h4>
                                <label className="chk"><input type="checkbox" /> Vietnam Airlines</label>
                                <label className="chk"><input type="checkbox" /> Vietjet Air</label>
                                <label className="chk"><input type="checkbox" /> Singapore Airlines</label>
                            </div>

                            <div className="filter-section">
                                <h4>Giờ khởi hành</h4>
                                <label className="chk"><input type="checkbox" /> Sáng sớm (00:00 - 06:00)</label>
                                <label className="chk"><input type="checkbox" /> Buổi sáng (06:00 - 12:00)</label>
                                <label className="chk"><input type="checkbox" /> Buổi chiều (12:00 - 18:00)</label>
                                <label className="chk"><input type="checkbox" /> Buổi tối (18:00 - 24:00)</label>
                            </div>

                            <div className="filter-section">
                                <h4>Chọn kiểu bay</h4>
                                <label className="chk"><input type="checkbox" /> Một chiều</label>
                                <label className="chk"><input type="checkbox" /> Khứ hồi</label>
                                <label className="chk"><input type="checkbox" /> Nhiều chặng</label>
                            </div>

                            <div className="filter-apply">
                                <button 
                                onClick={() => navigate('/filterplane')}
                                className="btn-apply">Áp dụng bộ lọc</button>
                            </div>
                        </div>
                    </aside>
                    <div className="outstanding-offers-container">
                        <h3 className="offers-title">Ưu đãi nổi bật</h3>
                        <div className="offers-grid">
                            {mockOffers.map((offer) => (
                                <div key={offer.id} className="offer-card-new">
                                    <div className="offer-date-badge">
                                        <i className="bi bi-calendar3"></i> {offer.date}
                                    </div>

                                    <div className="offer-content">
                                        <div className="offer-flight-info">
                                            <div className="airline-section">
                                                <div className="airline-logo-new">{offer.logo}</div>
                                                <div className="airline-name-new">{offer.airline}</div>
                                            </div>

                                            <div className="flight-route">
                                                <div className="route-point">
                                                    <div className="time-big">{offer.depTime}</div>
                                                    <div className="city-text">{offer.depCity}</div>
                                                </div>

                                                <div className="flight-duration">
                                                    <i className="bi bi-send"></i>
                                                    <div className="duration-text">{offer.duration}</div>
                                                </div>

                                                <div className="route-point">
                                                    <div className="time-big">{offer.arrTime}</div>
                                                    <div className="city-text">{offer.arrCity}</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="offer-price-section">
                                            <div className="price-info">
                                                <div className="old-price-new">{offer.oldPrice}</div>
                                                <div className="flight-discount-tag">{offer.discount}</div>
                                            </div>
                                            <div className="new-price-big">{offer.price}</div>
                                            <button className="select-flight-btn">Chọn chuyến bay</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Outstandingoffer;
