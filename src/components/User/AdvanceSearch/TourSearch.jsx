import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import "./advancesearch.css";
import { Container, Row, Col, Button } from "react-bootstrap";
import CustomDropdown from "../CustomDropdown/CustomDropdown";

const TourSearch = () => {
  const [startDate, setStartDate] = useState(null);

  const onLocationSelect = (v) => console.log("Location", v);

  return (
    <section className="box-search-advance">
      <Container>
        <Row>
          <Col md={12} xs={12}>
            <div className="row-items">

              <div className="field-col" style={{ maxWidth: 260 }}>
                <label className="item-search-label"> Địa điểm </label>
                <div className="pill-input">
                  <span className="icon">📍</span>
                  <div className="content">
                    <CustomDropdown label="Đà Nẵng" options={["Đà Nẵng", "Hà Nội"]} onSelect={onLocationSelect} />
                  </div>
                </div>
              </div>

              <div className="field-col">
                <label className="item-search-label"> Ý tưởng của bạn </label>
                <div className="pill-input">
                  <span className="icon">💡</span>
                  <div className="content">
                    <input placeholder="Bạn có ý tưởng gì cho chuyến đi không?" />
                  </div>
                </div>
              </div>

              <div className="field-col" style={{ maxWidth: 220 }}>
                <label className="item-search-label"> Ngày khởi hành </label>
                <div className="pill-input">
                  <span className="icon">📅</span>
                  <div className="content">
                    <DatePicker selected={startDate} onChange={(d) => setStartDate(d)} dateFormat="dd/MM/yyyy" />
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "flex-end" }}>
                <Button className="search-circle">
                  <i className="bi bi-search"></i>
                </Button>
              </div>

            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default TourSearch;