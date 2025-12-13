import React from "react";
import { Carousel } from "react-bootstrap";
import sliderImg from "../../assets/images/slider/1.png";
import sliderImg1 from "../../assets/images/slider/2.png";
import "../Banner/banner.css"

const Banner = () => {
  return (
    <>
      <section className="slider">
        <Carousel variant="dark">
          <Carousel.Item>
            <img src={sliderImg} className="d-block w-100" alt="First slide" />
          </Carousel.Item>

          <Carousel.Item>
            <img src={sliderImg1} className="d-block w-100" alt="Second slide" />
          </Carousel.Item>
        </Carousel>
      </section>
    </>
  );
};

export default Banner;
