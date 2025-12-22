import React from 'react'
import { NavLink } from 'react-router-dom';

const PopularCard = ({ val }) => {
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
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  };

  const imgStyle = {
    width: '100%',
    height: '130px',
    objectFit: 'cover',
    display: 'block',
  };

  const bodyStyle = {
    padding: '12px',
    flex: '1',
    display: 'flex',
    flexDirection: 'column',
  };

  const nameStyle = {
    fontSize: '16px',
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: '6px',
    lineHeight: '1.4',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    minHeight: '45px', // Reserve space for 2 lines
  };

  const linkStyle = {
    color: '#1a1a1a',
    textDecoration: 'none',
  };

  const ratingStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    marginBottom: '8px',
    fontSize: '12px',
  };

  const starStyle = {
    color: '#ffc107',
  };

  const scoreStyle = {
    fontWeight: '600',
    color: '#1a1a1a',
  };

  const countStyle = {
    color: '#666',
    fontSize: '11px',
  };

  const priceLabelStyle = {
    fontSize: '11px',
    color: '#666',
    display: 'block',
    marginBottom: '2px',
  };

  const priceValueStyle = {
    fontSize: '15px',
    fontWeight: '700',
    color: '#0077cc',
  };

  const priceContainerStyle = {
    marginTop: 'auto',
  };

  return (
    <NavLink to={`/hotel-detail/${val.id}`} style={{ textDecoration: 'none', height: '100%', display: 'block' }}>
      <div
        style={cardStyle}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-5px)';
          e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.12)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
        }}
      >
        {/* Image */}
        <img
          src={val.thumbnail}
          alt={val.name || "hotel"}
          style={imgStyle}
        />

        {/* Body */}
        <div style={bodyStyle}>
          {/* Hotel Name */}
          <div style={nameStyle}>
            {val.name}
          </div>

        {/* Rating */}
        <div style={ratingStyle}>
          <i className="bi bi-star-fill" style={starStyle}></i>
          <span style={scoreStyle}>{val.starRating || 4.5}</span>
          <span style={countStyle}>({val.reviewCount || Math.floor(Math.random() * 5000) + 100} đánh giá)</span>
        </div>

        {/* Price */}
        <div style={priceContainerStyle}>
          <span style={priceLabelStyle}>Giá mỗi đêm từ</span>
          <span style={priceValueStyle}>{formatPrice(val.minPrice)} VND</span>
        </div>
      </div>
    </div>
    </NavLink>
  )
}

export default PopularCard
