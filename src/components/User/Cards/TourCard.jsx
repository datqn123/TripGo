import React from 'react'
import { NavLink } from 'react-router-dom';

const TourCard = ({ tour }) => {
  // Format price
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
    height: '180px', // Slightly taller for tours
    objectFit: 'cover',
    display: 'block',
  };

  const bodyStyle = {
    padding: '16px',
    flex: '1',
    display: 'flex',
    flexDirection: 'column',
  };

  const nameStyle = {
    fontSize: '16px',
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: '8px',
    lineHeight: '1.4',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    minHeight: '45px',
  };

  const infoStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '13px',
    color: '#666',
    marginBottom: '4px',
  };

  const priceContainerStyle = {
    marginTop: 'auto',
    paddingTop: '12px',
    borderTop: '1px solid #f0f0f0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  };

  const priceLabelStyle = {
    fontSize: '12px',
    color: '#666',
    display: 'block',
    marginBottom: '2px',
  };

  const priceValueStyle = {
    fontSize: '16px',
    fontWeight: '700',
    color: '#0099cc', // Different color for tours
  };

  return (
    <NavLink to={`/tours/${tour.id}`} style={{ textDecoration: 'none', height: '100%', display: 'block' }}>
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
        <div style={{ position: 'relative' }}>
        <img
          src={tour.image || tour.thumbnail || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=500"} // Fallback image
          alt={tour.title || tour.name}
          style={imgStyle}
        />
        {tour.duration && (
            <div style={{
                position: 'absolute',
                bottom: '8px',
                right: '8px',
                background: 'rgba(0,0,0,0.6)',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: '500'
            }}>
                <i className="bi bi-clock"></i> {tour.duration}
            </div>
        )}
        </div>

        {/* Body */}
        <div style={bodyStyle}>
          {/* Location/Category Tag */}
          {(tour.location || tour.category) && (
            <div style={{ 
                fontSize: '12px', 
                color: '#0099cc', 
                fontWeight: '600', 
                marginBottom: '4px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
            }}>
                {tour.destinationName || tour.location || "TOUR"}
            </div>
          )}

          {/* Tour Name */}
          <div style={nameStyle}>
            {tour.title || tour.name}
          </div>

        {/* Additional Info */}
        <div style={infoStyle}>
            <i className="bi bi-geo-alt-fill" style={{ color: '#ff6b6b' }}></i>
            <span>{tour.startLocation || "Khởi hành hàng ngày"}</span>
        </div>
        
        {/* Rating if available */}
        {tour.rating && (
            <div style={infoStyle}>
                <i className="bi bi-star-fill" style={{ color: '#ffc107' }}></i>
                <span>{tour.rating} ({tour.reviews || 0} đánh giá)</span>
            </div>
        )}

        {/* Price */}
        <div style={priceContainerStyle}>
          <div>
            <span style={priceLabelStyle}>Giá trọn gói</span>
            <span style={priceValueStyle}>{formatPrice(tour.price)} VND</span>
          </div>
           <button style={{
               background: 'none',
               border: '1px solid #0099cc',
               borderRadius: '20px',
               color: '#0099cc',
               padding: '4px 12px',
               fontSize: '12px',
               fontWeight: '600',
               cursor: 'pointer'
           }}>
               Chi tiết
           </button>
        </div>
      </div>
    </div>
    </NavLink>
  )
}

export default TourCard
