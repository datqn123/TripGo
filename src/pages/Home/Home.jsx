import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import "./home.css";

import Cards from "../../components/Cards/Cards";
import { useNavigate } from "react-router-dom";
import { fetchLocations } from "../../utils/locationdata";
import { fetchHotels } from "../../utils/hoteldata";
import { fetchFlights } from "../../utils/flightdata";
import PopularCard from "../../components/Cards/PopularCard";
import FlightCard from "../../components/Cards/FlightCard";
import Banner from "../../components/Banner/Banner";
import AdvanceSearch from "../../components/AdvanceSearch/AdvanceSearch";
import Features from "../../components/Features/Features";
const SkeletonCard = ({ type }) => {
  const skeletonStyle = {
    background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite',
    borderRadius: '8px',
  };

  if (type === 'hotel') {
    return (
      <div style={{
        background: '#fff',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}>
        <div style={{ ...skeletonStyle, height: '180px', borderRadius: '12px 12px 0 0' }}></div>
        <div style={{ padding: '16px' }}>
          <div style={{ ...skeletonStyle, height: '14px', width: '60%', marginBottom: '12px' }}></div>
          <div style={{ ...skeletonStyle, height: '20px', width: '90%', marginBottom: '8px' }}></div>
          <div style={{ ...skeletonStyle, height: '14px', width: '40%', marginBottom: '16px' }}></div>
          <div style={{ ...skeletonStyle, height: '24px', width: '50%' }}></div>
        </div>
      </div>
    );
  }

  if (type === 'flight') {
    return (
      <div style={{
        background: '#fff',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}>
        <div style={{ ...skeletonStyle, height: '120px', borderRadius: '12px 12px 0 0' }}></div>
        <div style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ ...skeletonStyle, height: '16px', width: '30%' }}></div>
            <div style={{ ...skeletonStyle, height: '16px', width: '30%' }}></div>
          </div>
          <div style={{ ...skeletonStyle, height: '14px', width: '50%', marginBottom: '8px' }}></div>
          <div style={{ ...skeletonStyle, height: '20px', width: '40%' }}></div>
        </div>
      </div>
    );
  }

  return null;
};
const Home = () => {
  var settings = {
    dots: false,
    infinite: true,
    autoplay: true,
    slidesToShow: 4,
    slidesToScroll: 1,

    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          infinite: false,
          dots: true,
          autoplay: true,
        },
      },
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: false,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          autoplay: true,
          prevArrow: false,
          nextArrow: false,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          prevArrow: false,
          nextArrow: false,
        },
      },
    ],
  };
  const navigate = useNavigate();
  const [locations, setLocations] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [flights, setFlights] = useState([]);
  const [loadingHotels, setLoadingHotels] = useState(true);
  const [loadingFlights, setLoadingFlights] = useState(true);
  const hasFetched = React.useRef(false);

  useEffect(() => {
    // Ngăn gọi API 2 lần trong React.StrictMode
    if (hasFetched.current) return;
    hasFetched.current = true;

    async function loadData() {
      // Fetch locations, hotels and flights in parallel
      const [locationsRes, hotelsRes, flightsRes] = await Promise.all([
        fetchLocations(),
        fetchHotels(),
        fetchFlights()
      ]);

      setLocations(locationsRes.result);
      setHotels(hotelsRes.result);
      setLoadingHotels(false);
      setFlights(flightsRes.result);
      setLoadingFlights(false);

      console.log('Locations:', locationsRes.result);
      console.log('Hotels:', hotelsRes.result);
      console.log('Flights:', flightsRes.result);
    }
    loadData();
  }, []);

  return (
    <>
      <Banner />
      <AdvanceSearch />
      <Features />
      {/* tour seciton start */}

      <section className="tours_section slick_slider">
        <Container>
          <Row>
            <Col md="12">
              <div className="main_heading">
                <h1> Những địa điểm không thể bỏ lỡ </h1>
              </div>
            </Col>
          </Row>

          <Row>
            <Col md="12">
              <Slider {...settings}>
                {locations.map((destination, inx) => {
                  return <Cards destination={destination} key={inx} />;
                })}
              </Slider>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Promotional Banner */}
      <section style={{ padding: '40px 0', background: '#fff' }}>
        <Container>
          <div style={{
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          }}>
            <img
              src="/poster-1.png"
              alt="Du lịch và trải nghiệm - Giảm đến 35%"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                cursor: 'pointer',
              }}
            />
          </div>
        </Container>
      </section>

      {/* Hotel Section */}
      <section style={{ padding: '40px 0', background: '#fff' }}>
        <Container>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                background: '#e6f3ff',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <i className="bi bi-building" style={{ fontSize: '20px', color: '#0077cc' }}></i>
              </div>
              <div>
                <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#0077cc', margin: 0 }}>
                  Khách sạn giá ưu đãi
                </h2>
                <p style={{ fontSize: '14px', color: '#666', margin: '4px 0 0 0' }}>
                  Trải nghiệm lưu trú chất lượng với mức giá tối ưu
                </p>
              </div>
            </div>
          </div>

          {/* Cards */}
          <Row>
            {loadingHotels ? (
              // Skeleton Loading
              [1, 2, 3, 4].map((_, inx) => (
                <Col md={3} sm={6} xs={12} className="mb-4" key={inx}>
                  <SkeletonCard type="hotel" />
                </Col>
              ))
            ) : (
              hotels.slice(0, 4).map((val, inx) => (
                <Col md={3} sm={6} xs={12} className="mb-4" key={val.id || inx}>
                  <PopularCard val={val} />
                </Col>
              ))
            )}
          </Row>

          {/* View More Button */}
          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <button style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              background: 'white',
              color: '#0077cc',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
            }}>
              Xem thêm <i className="bi bi-chevron-right"></i>
            </button>
          </div>
        </Container>
      </section>

      {/* Flight Section */}
      <section style={{ padding: '40px 0', background: '#f8f9fa' }}>
        <Container>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                background: '#e6f3ff',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <i className="bi bi-airplane" style={{ fontSize: '20px', color: '#0077cc' }}></i>
              </div>
              <div>
                <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#0077cc', margin: 0 }}>
                  Vé máy bay giá tốt nhất
                </h2>
                <p style={{ fontSize: '14px', color: '#666', margin: '4px 0 0 0' }}>
                  Khám phá thế giới với vé bay giá tốt nhất, bay là thích!
                </p>
              </div>
            </div>
          </div>

          {/* Cards */}
          <Row>
            {loadingFlights ? (
              // Skeleton Loading
              [1, 2, 3, 4, 5].map((_, inx) => (
                <Col lg={true} md={4} sm={6} xs={12} className="mb-4" key={inx}>
                  <SkeletonCard type="flight" />
                </Col>
              ))
            ) : (
              flights.slice(0, 5).map((flight, inx) => (
                <Col lg={true} md={4} sm={6} xs={12} className="mb-4" key={flight.id || inx}>
                  <FlightCard flight={flight} />
                </Col>
              ))
            )}
          </Row>

          {/* View More Button */}
          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <button style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              background: 'white',
              color: '#0077cc',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
            }}>
              Xem thêm <i className="bi bi-chevron-right"></i>
            </button>
          </div>
        </Container>
      </section>

      {/* Testimonials Section */}
      <section style={{ padding: '60px 0', background: '#f0f7ff' }}>
        <Container>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{
              fontSize: '32px',
              fontWeight: '600',
              color: '#0099cc',
              fontStyle: 'italic',
              fontFamily: "'Playfair Display', Georgia, serif",
              marginBottom: '12px'
            }}>
              Khách hàng nói gì về chúng tôi
            </h2>
            <p style={{ fontSize: '15px', color: '#666', fontStyle: 'italic' }}>
              Những trải nghiệm thực tế từ các hành trình đã đặt qua TripGo
            </p>
          </div>

          <Row>
            {/* Testimonial 1 */}
            <Col md={4} className="mb-4">
              <div style={{
                background: '#fff',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                height: '100%'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <img
                    src="https://ui-avatars.com/api/?name=Nguyen+Thi+Minh+Anh&background=ff9a9e&color=fff&size=48"
                    alt="avatar"
                    style={{ width: '48px', height: '48px', borderRadius: '50%' }}
                  />
                  <div>
                    <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#333', margin: 0 }}>Nguyễn Thị Minh Anh</h4>
                    <p style={{ fontSize: '13px', color: '#888', margin: 0 }}>Việt Nam</p>
                  </div>
                </div>
                <div style={{ color: '#ffc107', marginBottom: '12px', fontSize: '16px' }}>★★★★★</div>
                <p style={{ fontSize: '14px', color: '#555', lineHeight: '1.6', fontStyle: 'italic', margin: 0 }}>
                  "Trải nghiệm tuyệt vời! Đặt tour rất nhanh chóng và nhận được sự hỗ trợ nhiệt tình từ đội ngũ tư vấn."
                </p>
              </div>
            </Col>

            {/* Testimonial 2 */}
            <Col md={4} className="mb-4">
              <div style={{
                background: '#fff',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                height: '100%'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <img
                    src="https://ui-avatars.com/api/?name=David+Chen&background=a8e6cf&color=fff&size=48"
                    alt="avatar"
                    style={{ width: '48px', height: '48px', borderRadius: '50%' }}
                  />
                  <div>
                    <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#333', margin: 0 }}>David Chen</h4>
                    <p style={{ fontSize: '13px', color: '#888', margin: 0 }}>Singapore</p>
                  </div>
                </div>
                <div style={{ color: '#ffc107', marginBottom: '12px', fontSize: '16px' }}>★★★★★</div>
                <p style={{ fontSize: '14px', color: '#555', lineHeight: '1.6', fontStyle: 'italic', margin: 0 }}>
                  "Great service and competitive prices. Booked multiple trips and never disappointed. Highly recommended!"
                </p>
              </div>
            </Col>

            {/* Testimonial 3 */}
            <Col md={4} className="mb-4">
              <div style={{
                background: '#fff',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                height: '100%'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <img
                    src="https://ui-avatars.com/api/?name=Sarah+Nguyen&background=dda0dd&color=fff&size=48"
                    alt="avatar"
                    style={{ width: '48px', height: '48px', borderRadius: '50%' }}
                  />
                  <div>
                    <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#333', margin: 0 }}>Sarah Nguyễn</h4>
                    <p style={{ fontSize: '13px', color: '#888', margin: 0 }}>Việt Nam</p>
                  </div>
                </div>
                <div style={{ color: '#ffc107', marginBottom: '12px', fontSize: '16px' }}>★★★★★</div>
                <p style={{ fontSize: '14px', color: '#555', lineHeight: '1.6', fontStyle: 'italic', margin: 0 }}>
                  "Giá cả hợp lý, dịch vụ chuyên nghiệp. Mình đã đặt tour Nhật Bản và mọi thứ đều hoàn hảo!"
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Travel Guide Section */}
      <section style={{ padding: '60px 0', background: '#fff' }}>
        <Container>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              background: '#e6f3ff',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <i className="bi bi-journal-text" style={{ fontSize: '18px', color: '#0077cc' }}></i>
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#0077cc', margin: 0 }}>
              Cẩm nang du lịch dành cho bạn
            </h2>
          </div>
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '32px', marginLeft: '48px' }}>
            Khám phá những bài viết hữu ích để chuẩn bị cho chuyến đi hoàn hảo
          </p>

          <Row>
            {/* Article 1 */}
            <Col md={4} className="mb-4">
              <div style={{
                background: '#fff',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                height: '100%'
              }}>
                <div style={{
                  height: '180px',
                  background: 'linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <span style={{
                    fontSize: '48px',
                    fontWeight: '900',
                    color: 'rgba(255,255,255,0.15)',
                    fontFamily: 'serif',
                    letterSpacing: '4px'
                  }}>VIỆT NAM</span>
                </div>
                <div style={{ padding: '20px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#333', marginBottom: '12px', lineHeight: '1.4' }}>
                    Top 10 điểm đến hấp dẫn nhất Việt Nam 2024
                  </h3>
                  <p style={{ fontSize: '13px', color: '#666', lineHeight: '1.5', marginBottom: '16px' }}>
                    Khám phá những địa điểm du lịch tuyệt đẹp không thể bỏ qua trong năm nay
                  </p>
                  <a href="#" style={{ color: '#0099cc', fontSize: '14px', fontWeight: '500', textDecoration: 'none' }}>
                    Đọc thêm <i className="bi bi-chevron-right" style={{ fontSize: '12px' }}></i>
                  </a>
                </div>
              </div>
            </Col>

            {/* Article 2 */}
            <Col md={4} className="mb-4">
              <div style={{
                background: '#fff',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                height: '100%'
              }}>
                <div style={{
                  height: '180px',
                  backgroundImage: 'url(https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=400)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}></div>
                <div style={{ padding: '20px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#333', marginBottom: '12px', lineHeight: '1.4' }}>
                    Bí quyết tiết kiệm khi đi du lịch nước ngoài
                  </h3>
                  <p style={{ fontSize: '13px', color: '#666', lineHeight: '1.5', marginBottom: '16px' }}>
                    Những mẹo hay giúp bạn tối ưu chi phí mà vẫn có chuyến đi tuyệt vời
                  </p>
                  <a href="#" style={{ color: '#0099cc', fontSize: '14px', fontWeight: '500', textDecoration: 'none' }}>
                    Đọc thêm <i className="bi bi-chevron-right" style={{ fontSize: '12px' }}></i>
                  </a>
                </div>
              </div>
            </Col>

            {/* Article 3 */}
            <Col md={4} className="mb-4">
              <div style={{
                background: '#fff',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                height: '100%'
              }}>
                <div style={{
                  height: '180px',
                  backgroundImage: 'url(https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}></div>
                <div style={{ padding: '20px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#333', marginBottom: '12px', lineHeight: '1.4' }}>
                    Cần chuẩn bị gì cho một chuyến bay dài
                  </h3>
                  <p style={{ fontSize: '13px', color: '#666', lineHeight: '1.5', marginBottom: '16px' }}>
                    Danh sách checklist đầy đủ để chuyến bay của bạn thoải mái nhất
                  </p>
                  <a href="#" style={{ color: '#0099cc', fontSize: '14px', fontWeight: '500', textDecoration: 'none' }}>
                    Đọc thêm <i className="bi bi-chevron-right" style={{ fontSize: '12px' }}></i>
                  </a>
                </div>
              </div>
            </Col>
          </Row>

          {/* View More Button */}
          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <button style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 28px',
              border: '1px solid #0099cc',
              borderRadius: '24px',
              background: 'white',
              color: '#0099cc',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
            }}>
              Xem thêm bài viết <i className="bi bi-chevron-right"></i>
            </button>
          </div>
        </Container>
      </section>
    </>
  );
};

export default Home;
