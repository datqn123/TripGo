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
                  <span className="icon">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-500">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                    </svg>
                  </span>
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
                  <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 10h16m-8-3V4M7 7V4m10 3V4M5 20h14a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Zm3-7h.01v.01H8V13Zm4 0h.01v.01H12V13Zm4 0h.01v.01H16V13Zm-8 4h.01v.01H8V17Zm4 0h.01v.01H12V17Zm4 0h.01v.01H16V17Z" />
                  </svg>
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
                  <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path fill-rule="evenodd" d="M12 6a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm-1.5 8a4 4 0 0 0-4 4 2 2 0 0 0 2 2h7a2 2 0 0 0 2-2 4 4 0 0 0-4-4h-3Zm6.82-3.096a5.51 5.51 0 0 0-2.797-6.293 3.5 3.5 0 1 1 2.796 6.292ZM19.5 18h.5a2 2 0 0 0 2-2 4 4 0 0 0-4-4h-1.1a5.503 5.503 0 0 1-.471.762A5.998 5.998 0 0 1 19.5 18ZM4 7.5a3.5 3.5 0 0 1 5.477-2.889 5.5 5.5 0 0 0-2.796 6.293A3.501 3.501 0 0 1 4 7.5ZM7.1 12H6a4 4 0 0 0-4 4 2 2 0 0 0 2 2h.5a5.998 5.998 0 0 1 3.071-5.238A5.505 5.505 0 0 1 7.1 12Z" clip-rule="evenodd" />
                  </svg>
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
