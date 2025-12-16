import React from "react";
import "./filter.css";

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
    return (
        <div className="outstanding-offers-container">
            <h3 className="offers-title">Ưu đãi nổi bật</h3>
            <div className="offers-grid">
                {mockOffers.map((offer) => (
                    <div key={offer.id} className="offer-card-new">
                        <div className="offer-date-badge">
                            <i className="bi bi-calendar3"></i> {offer.date}
                        </div>h

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
                                    <div className="discount-tag">{offer.discount}</div>
                                </div>
                                <div className="new-price-big">{offer.price}</div>
                                <button className="select-flight-btn">Chọn chuyến bay</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Outstandingoffer;
