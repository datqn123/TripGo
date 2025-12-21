import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import "../AdvanceSearch/advancesearch.css";
import { Container, Row, Col, Button } from "react-bootstrap";
import CustomDropdown from "../CustomDropdown/CustomDropdown";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../../api/axiosClient";

const HotelSearch = () => {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState(new Date());
  const nextDay = new Date();
  nextDay.setDate(nextDay.getDate() + 1);
  const [endDate, setEndDate] = useState(nextDay);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [location, setLocation] = useState(null); // {id, name}
  const [guests, setGuests] = useState("");
  const [locations, setLocations] = useState([]);

  // Gọi API lấy danh sách địa điểm
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axiosClient.get("public/locations/dropdown");
        if (response.data?.result) {
          setLocations(response.data.result);
        }
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };
    fetchLocations();
  }, []);

  const selectedLocation = (value) => {
    setLocation(value); // {id, name}
    console.log("Location selected:", value);
  };

  const selectedGuest = (value) => {
    setGuests(value.name || value);
    console.log("Guest:", value);
  };

  const handleSearch = () => {
    if (!location) {
      alert('Vui lòng chọn điểm đến');
      return;
    }

    navigate(`/filter-hotel`, {
      state: {
        locationId: location.id,
        locationName: location.name,
        startDate,
        endDate,
        guests
      }
    });
  };

  return (
    <section className="box-search-advance">
      <Container>
        <Row>
          <Col md={12} xs={12}>
            <div className="row-items">
              <div className="field-col">
                <label className="item-search-label"> Điểm đến </label>
                <div className="pill-input">
                  <span className="icon">📍</span>
                  <div className="content">
                    <CustomDropdown
                      onSelect={selectedLocation}
                      label="Bạn muốn đến đâu?"
                      options={locations}
                    />
                  </div>
                </div>
              </div>

              <div className="field-col" style={{ position: "relative" }}>
                <label className="item-search-label"> Ngày ở </label>
                <div className="pill-input" onClick={() => setIsDatePickerOpen(!isDatePickerOpen)} style={{ cursor: "pointer" }}>
                  <span className="icon">📅</span>
                  <div className="content">
                    <div className="date-range-display">
                      {startDate && endDate ? (
                        <span>
                          {startDate.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                          {' - '}
                          {endDate.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
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
                        <h5>Ngày ở</h5>
                        <div className="date-info-row">
                          <div className="date-info-item">
                            <span className="date-info-label">Nhận phòng</span>
                            <span className="date-info-value">
                              {startDate ? startDate.toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' }) : '-'}
                            </span>
                          </div>
                          <div className="date-info-item">
                            <span className="date-info-label">Trả phòng</span>
                            <span className="date-info-value">
                              {endDate ? endDate.toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' }) : '-'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <DatePicker
                        selected={startDate}
                        onChange={(dates) => {
                          const [start, end] = dates;
                          setStartDate(start);
                          setEndDate(end);
                          if (start && end) {
                            setIsDatePickerOpen(false);
                          }
                        }}
                        startDate={startDate}
                        endDate={endDate}
                        selectsRange
                        inline
                        monthsShown={2}
                        minDate={new Date()}
                        dateFormat="dd/MM/yyyy"
                        calendarClassName="hotel-calendar"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="field-col" style={{ maxWidth: 300 }}>
                <label className="item-search-label"> Số lượng khách </label>
                <div className="pill-input">
                  <span className="icon">👥</span>
                  <div className="content">
                    <CustomDropdown
                      label="2 người lớn, 0 trẻ em"
                      onSelect={selectedGuest}
                      options={[
                        "1 người lớn",
                        "2 người lớn, 1 trẻ em",
                        "3 người lớn",
                      ]}
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "flex-end" }}>
                <Button className="search-circle" onClick={handleSearch}>
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

export default HotelSearch;
