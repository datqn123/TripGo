import React from "react";
import { Carousel } from "react-bootstrap";
import "./banner.css"

const Banner = () => {
  const captionStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
    zIndex: 10,
    width: '100%',
    padding: '0 20px'
  };

  const titleStyle = {
    fontFamily: "'Quicksand', sans-serif",
    fontSize: '42px',
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: '12px',
    textShadow: '0 2px 8px rgba(0,0,0,0.5)'
  };

  const subtitleStyle = {
    fontFamily: "'Quicksand', sans-serif",
    fontSize: '16px',
    color: '#ffffff',
    fontWeight: '500',
    textShadow: '0 1px 4px rgba(0,0,0,0.5)'
  };

  return (
    <>
      <section className="slider">
        <Carousel variant="dark">
          <Carousel.Item>
            <img src="/banner4.jpg" className="d-block w-100" alt="First slide" />
            <div style={captionStyle}>
              <h2 style={titleStyle}>Khám phá thế giới, tìm kiếm hành trình của bạn</h2>
              <p style={subtitleStyle}>Đặt khách sạn, chuyến bay và tour du lịch với giá tốt nhất</p>
            </div>
          </Carousel.Item>

          <Carousel.Item>
            <img src="/banner5.jpg" className="d-block w-100" alt="Second slide" />
            <div style={captionStyle}>
              <h2 style={titleStyle}>Khám phá thế giới, tìm kiếm hành trình của bạn</h2>
              <p style={subtitleStyle}>Đặt khách sạn, chuyến bay và tour du lịch với giá tốt nhất</p>
            </div>
          </Carousel.Item>

          <Carousel.Item>
            <img src="/banner6.jpg" className="d-block w-100" alt="Third slide" />
            <div style={captionStyle}>
              <h2 style={titleStyle}>Khám phá thế giới, tìm kiếm hành trình của bạn</h2>
              <p style={subtitleStyle}>Đặt khách sạn, chuyến bay và tour du lịch với giá tốt nhất</p>
            </div>
          </Carousel.Item>
        </Carousel>
      </section>
    </>
  );
};

export default Banner;
