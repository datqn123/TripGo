import React, { useState, useEffect } from "react";
import Banner from "../../components/Banner/Banner";
import AdvanceSearch from "../../components/AdvanceSearch/AdvanceSearch";
import Features from "../../components/Features/Features";
import { Container, Row, Col } from "react-bootstrap";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import "./home.css";

import Gallery from "../../components/Gallery/Gallery";
import Cards from "../../components/Cards/Cards";
import { destinationsData, popularsData } from "../../utils/data";
import { fetchLocations } from "../../utils/locationdata";
import { fetchHotels } from "../../utils/hoteldata";
import { fetchFlights } from "../../utils/flightdata";
import VoucherList from "../../components/Cards/VoucherList";
import PopularCard from "../../components/Cards/PopularCard";
import FlightCard from "../../components/Cards/FlightCard";

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
  const [locations, setLocations] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [flights, setFlights] = useState([]);
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
      setFlights(flightsRes.result);

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
      <VoucherList />
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
            {hotels.slice(0, 4).map((val, inx) => (
              <Col md={3} sm={6} xs={12} className="mb-4" key={val.id || inx}>
                <PopularCard val={val} />
              </Col>
            ))}
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
            {flights.slice(0, 5).map((flight, inx) => (
              <Col lg={true} md={4} sm={6} xs={12} className="mb-4" key={flight.id || inx}>
                <FlightCard flight={flight} />
              </Col>
            ))}
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

      <section className="call_us">
        <Container>
          <Row className="align-items-center">
            <Col md="8">
              <h5 className="title">CALL TO ACTION</h5>
              <h2 className="heading">
                READY FOR UNFORGATABLE TRAVEL. REMEMBER US!
              </h2>
              <p className="text">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s,{" "}
              </p>
            </Col>
            <Col md="4" className="text-center mt-3 mt-md-0">
              <a
                href="tel:6398312365"
                className="secondary_btn bounce"
                rel="no"
              >
                {" "}
                Contact Us !
              </a>
            </Col>
          </Row>
        </Container>
        <div className="overlay"></div>
      </section>

      <section className="gallery">
        <Container>
          <Row>
            <Col md="12">
              <div className="main_heading">
                <h1>Photo Gallery </h1>
              </div>
            </Col>
          </Row>
          <Row>
            <Col md="12">
              <Gallery />
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Home;
