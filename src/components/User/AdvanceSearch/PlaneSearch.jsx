import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import "../AdvanceSearch/advancesearch.css";
import { Container, Row, Col, Button } from "react-bootstrap";
import CustomDropdown from "../CustomDropdown/CustomDropdown";
import { PUBLIC_API } from "../../../api/config";

const PlaneSearch = () => {
  const navigate = useNavigate();
  const [departDate, setDepartDate] = useState(new Date());
  const nextDay = new Date();
  nextDay.setDate(nextDay.getDate() + 1);
  const [returnDate, setReturnDate] = useState(nextDay);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  // Location states
  const [locations, setLocations] = useState([]);
  const [departureLocation, setDepartureLocation] = useState(null);
  const [arrivalLocation, setArrivalLocation] = useState(null);

  // Fetch locations from API
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch(PUBLIC_API.DROPDOWN_LOCATIONS);
        const data = await response.json();
        setLocations(data.result || []);
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };
    fetchLocations();
  }, []);

  const onFromSelect = (locationName) => {
    const location = locations.find(loc => loc.name === locationName);
    if (location) {
      setDepartureLocation(location);
    }
  };

  const onToSelect = (locationName) => {
    const location = locations.find(loc => loc.name === locationName);
    if (location) {
      setArrivalLocation(location);
    }
  };

  const onGuestSelect = (v) => console.log("Guest", v);

  const handleSearch = () => {
    if (!departureLocation || !arrivalLocation) {
      alert("Vui lòng chọn điểm khởi hành và điểm đến");
      return;
    }

    // Navigate to filter-plane with query parameters
    const params = new URLSearchParams({
      departureLocationId: departureLocation.id,
      departureLocationName: departureLocation.name,
      arrivalLocationId: arrivalLocation.id,
      arrivalLocationName: arrivalLocation.name,
    });

    if (departDate) {
      params.append('departureDate', departDate.toISOString().split('T')[0]);
    }

    navigate(`/filter-plane?${params.toString()}`);
  };

  // Get location names for dropdown options
  const locationOptions = locations.map(loc => loc.name);

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
                      label={departureLocation ? departureLocation.name : "Nơi đi"}
                      options={locationOptions}
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
                      label={arrivalLocation ? arrivalLocation.name : "Nơi đến"}
                      options={locationOptions}
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

export default PlaneSearch;
