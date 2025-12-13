import React from 'react';
import { NavLink } from 'react-router-dom';

const FlightCard = ({ flight }) => {
    // Format giá tiền
    const formatPrice = (price) => {
        if (!price) return "0";
        return price.toLocaleString('vi-VN');
    };

    const cardStyle = {
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        background: 'white',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    };

    const imgContainerStyle = {
        position: 'relative',
        overflow: 'hidden',
    };

    const imgStyle = {
        width: '100%',
        height: '160px',
        objectFit: 'cover',
        display: 'block',
        transition: 'transform 0.3s ease',
    };

    const bodyStyle = {
        padding: '14px',
    };

    const routeStyle = {
        fontSize: '15px',
        fontWeight: '700',
        color: '#1a1a1a',
        marginBottom: '8px',
        lineHeight: '1.4',
    };

    const airlineStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        marginBottom: '4px',
    };

    const logoStyle = {
        height: '16px',
        width: 'auto',
        objectFit: 'contain',
    };

    const priceLabelStyle = {
        fontSize: '12px',
        color: '#666',
    };

    const priceValueStyle = {
        fontSize: '16px',
        fontWeight: '700',
        color: '#f5a623',
    };

    // Tạo route display
    const routeDisplay = `${flight.fromLocation} - ${flight.toLocation}`;

    return (
        <NavLink to={`/flight/${flight.id}`} style={{ textDecoration: 'none' }}>
            <div
                style={cardStyle}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.12)';
                    const img = e.currentTarget.querySelector('img');
                    if (img) img.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                    const img = e.currentTarget.querySelector('img');
                    if (img) img.style.transform = 'scale(1)';
                }}
            >
                {/* Image */}
                <div style={imgContainerStyle}>
                    <img
                        src={flight.image}
                        alt={routeDisplay}
                        style={imgStyle}
                    />
                </div>

                {/* Body */}
                <div style={bodyStyle}>
                    {/* Route */}
                    <div style={routeStyle}>
                        {routeDisplay}
                    </div>

                    {/* Airline */}
                    <div style={airlineStyle}>
                        {flight.airlineLogo && (
                            <img
                                src={flight.airlineLogo}
                                alt={flight.airlineName}
                                style={logoStyle}
                                onError={(e) => { e.target.style.display = 'none'; }}
                            />
                        )}
                        <span style={priceLabelStyle}>Giá chỉ từ</span>
                    </div>

                    {/* Price */}
                    <div style={priceValueStyle}>
                        {formatPrice(flight.minPrice)} VND
                    </div>
                </div>
            </div>
        </NavLink>
    );
};

export default FlightCard;
