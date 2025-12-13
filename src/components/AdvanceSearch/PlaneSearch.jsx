import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import "../AdvanceSearch/advancesearch.css";
import { Container, Row, Col, Button } from "react-bootstrap";
import CustomDropdown from "../CustomDropdown/CustomDropdown";

const PlaneSearch = () => {
  const [departDate, setDepartDate] = useState(new Date());
  const nextDay = new Date();
  nextDay.setDate(nextDay.getDate() + 1);
  const [returnDate, setReturnDate] = useState(nextDay);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const onFromSelect = (v) => console.log("From", v);
  const onToSelect = (v) => console.log("To", v);
  const onGuestSelect = (v) => console.log("Guest", v);

  return (
    <section className="box-search-advance">
      <Container>
        <Row>
          <Col md={12} xs={12}>
            <div className="row-items">

              <div className="field-col">
                <label className="item-search-label"> Điểm khởi hành </label>
                <div className="pill-input">
                  <span className="icon">✈️</span>
                  <div className="content">
                    <CustomDropdown
                      label="Nơi đi"
                      options={["Đà Nẵng", "Hà Nội", "Hồ Chí Minh"]}
                      onSelect={onFromSelect}
                    />
                  </div>
                </div>
              </div>

              <div className="field-col">
                <label className="item-search-label"> Điểm đến </label>
                <div className="pill-input">
                  <span className="icon">🧭</span>
                  <div className="content">
                    <CustomDropdown
                      label="Nơi đến"
                      options={["Hà Nội", "Đà Nẵng", "Hồ Chí Minh"]}
                      onSelect={onToSelect}
                    />
                  </div>
                </div>
              </div>

              <div className="field-col" style={{ position: "relative" }}>
                <label className="item-search-label"> Ngày bay </label>
                <div className="pill-input" onClick={() => setIsDatePickerOpen(!isDatePickerOpen)} style={{ cursor: "pointer" }}>
                  <span className="icon">📅</span>
                  <div className="content">
                    <div className="date-range-display">
                      {departDate && returnDate ? (
                        <span>
                          {departDate.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                          {' - '}
                          {returnDate.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                        </span>
                      ) : departDate ? (
                        <span>
                          {departDate.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                          {' - Một chiều'}
                        </span>
                      ) : (
                        <span style={{ color: '#999' }}>Chọn ngày</span>
                      )}
                    </div>
                  </div>
                </div>
                {isDatePickerOpen && (
                  <div className="hotel-datepicker-overlay" onClick={() => setIsDatePickerOpen(false)}>
                    <div className="hotel-datepicker-container" onClick={(e) => e.stopPropagation()}>
                      <div className="hotel-datepicker-header">
                        <h5>Ngày bay</h5>
                        <div className="date-info-row">
                          <div className="date-info-item">
                            <span className="date-info-label">Ngày đi</span>
                            <span className="date-info-value">
                              {departDate ? departDate.toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' }) : '-'}
                            </span>
                          </div>
                          <div className="date-info-item">
                            <span className="date-info-label">Ngày về (Tùy chọn)</span>
                            <span className="date-info-value">
                              {returnDate ? returnDate.toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' }) : 'Một chiều'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <DatePicker
                        selected={departDate}
                        onChange={(dates) => {
                          const [start, end] = dates;
                          setDepartDate(start);
                          setReturnDate(end);
                          // Allow closing with just depart date (one-way trip)
                          if (start && !end) {
                            // Don't auto-close, user might want to select return
                          } else if (start && end) {
                            setIsDatePickerOpen(false);
                          }
                        }}
                        startDate={departDate}
                        endDate={returnDate}
                        selectsRange
                        inline
                        monthsShown={2}
                        minDate={new Date()}
                        dateFormat="dd/MM/yyyy"
                        calendarClassName="hotel-calendar"
                      />
                      <div style={{ marginTop: '12px', textAlign: 'right' }}>
                        <Button 
                          variant="outline-primary" 
                          size="sm" 
                          onClick={() => {
                            setReturnDate(null);
                          }}
                          style={{ marginRight: '8px' }}
                        >
                          Một chiều
                        </Button>
                        <Button 
                          variant="primary" 
                          size="sm" 
                          onClick={() => setIsDatePickerOpen(false)}
                        >
                          Xong
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="field-col" style={{ maxWidth: 260 }}>
                <label className="item-search-label"> Số lượng khách </label>
                <div className="pill-input">
                  <span className="icon">👥</span>
                  <div className="content">
                    <CustomDropdown label="1 người" options={["1 người", "2 người", "3 người"]} onSelect={onGuestSelect} />
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

export default PlaneSearch;