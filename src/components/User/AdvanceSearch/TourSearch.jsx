import React, { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Container, Row, Col, Button, ListGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import CustomDropdown from "../CustomDropdown/CustomDropdown";
import tourApi from "../../../api/tourApi"; // Import tourApi
import "./advancesearch.css";

const TourSearch = () => {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

  // Simple debounce implementation
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (keyword.trim()) {
        try {
          const response = await tourApi.searchSuggest(keyword);
          if (response.data && response.data.code === 1000) {
            setSuggestions(response.data.result);
            setShowSuggestions(true);
          } else {
            setSuggestions([]);
          }
        } catch (error) {
          console.error("Error fetching suggestions:", error);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(delayDebounceFn);
  }, [keyword]);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const onLocationSelect = (v) => console.log("Location", v);

  const handleSearch = () => {
    navigate('/tour', { state: { name: keyword } });
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (tourId) => {
      navigate(`/tours/${tourId}`);
      setShowSuggestions(false);
  }

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

              <div className="field-col position-relative" ref={searchRef}>
                <label className="item-search-label"> Ý tưởng của bạn </label>
                <div className="pill-input">
                  <span className="icon">💡</span>
                  <div className="content">
                    <input 
                      placeholder="Bạn có ý tưởng gì cho chuyến đi không?" 
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                      onFocus={() => keyword && setShowSuggestions(true)}
                    />
                  </div>
                </div>
                {/* Suggestions Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                  <ListGroup className="position-absolute w-100 shadow-sm" style={{ top: "100%", left: 0, zIndex: 1000, maxHeight: "300px", overflowY: "auto", marginTop: "10px", borderRadius: "8px" }}>
                    {suggestions.map((tour) => (
                      <ListGroup.Item 
                        key={tour.id} 
                        action 
                        onClick={() => handleSuggestionClick(tour.id)}
                        className="d-flex align-items-center gap-3 border-0 py-2"
                      >
                         <img 
                            src={tour.thumbnail} 
                            alt={tour.title} 
                            style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "4px" }} 
                            onError={(e) => {e.target.onerror = null; e.target.src = "https://via.placeholder.com/50"}}
                         />
                         <div>
                            <div className="fw-bold text-truncate" style={{ maxWidth: "200px" }}>{tour.title}</div>
                            <div className="text-danger small">{tour.price ? tour.price.toLocaleString('vi-VN') + ' VND' : 'Liên hệ'}</div>
                         </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}
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

export default TourSearch;