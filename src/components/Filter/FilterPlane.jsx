import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import flightApi from "../../api/flightApi";
import { PUBLIC_API } from "../../api/config";
import "./filter.css";

const currency = (v) => {
  if (v === null || v === undefined) return "";
  return v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ";
};

const FilterPlane = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [sortOpen, setSortOpen] = useState(false);
  const [sortValue, setSortValue] = useState("Giá thấp đến cao");
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const sortRef = useRef(null);

  // Location states
  const [locations, setLocations] = useState([]);
  const [departureLocationId, setDepartureLocationId] = useState(null);
  const [arrivalLocationId, setArrivalLocationId] = useState(null);
  const [departureLocationName, setDepartureLocationName] = useState("Chọn điểm khởi hành");
  const [arrivalLocationName, setArrivalLocationName] = useState("Chọn điểm đến");
  const [showDepartureDropdown, setShowDepartureDropdown] = useState(false);
  const [showArrivalDropdown, setShowArrivalDropdown] = useState(false);
  const [departureDate, setDepartureDate] = useState("");

  // Temporary filter states (UI state - changes on checkbox click)
  const [tempFilters, setTempFilters] = useState({
    priceRanges: [],
    airlines: [],
  });

  // Applied filter states (sent to API - only changes when "Áp dụng bộ lọc" clicked)
  const [appliedFilters, setAppliedFilters] = useState({
    priceRanges: [],
    airlines: [],
  });

  // Read URL parameters and set initial values
  useEffect(() => {
    const depLocId = searchParams.get('departureLocationId');
    const depLocName = searchParams.get('departureLocationName');
    const arrLocId = searchParams.get('arrivalLocationId');
    const arrLocName = searchParams.get('arrivalLocationName');
    const depDate = searchParams.get('departureDate');

    if (depLocId) setDepartureLocationId(Number(depLocId));
    if (depLocName) setDepartureLocationName(depLocName);
    if (arrLocId) setArrivalLocationId(Number(arrLocId));
    if (arrLocName) setArrivalLocationName(arrLocName);
    if (depDate) setDepartureDate(depDate);
  }, [searchParams]);

  // Fetch locations on mount
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

  // Close dropdowns when clicking outside
  useEffect(() => {
    function onDocClick(e) {
      if (sortRef.current && !sortRef.current.contains(e.target)) setSortOpen(false);
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(0);
  }, [departureLocationId, arrivalLocationId, departureDate, appliedFilters]);

  // Fetch flights when filters or page changes
  useEffect(() => {
    const fetchFlights = async () => {
      try {
        setLoading(true);
        setError(null);

        // Determine which API to call
        const hasLocationFilter = departureLocationId && arrivalLocationId;

        // Build params
        const params = {};

        if (hasLocationFilter) {
          // Search mode: always include required params and pagination
          params.departureLocationId = Number(departureLocationId);
          params.arrivalLocationId = Number(arrivalLocationId);
          params.page = currentPage;

          // Add departure date if selected
          if (departureDate) {
            params.departureDate = departureDate;
          }

          // Add sort parameter
          if (sortValue === "Giá cao đến thấp") {
            params.sortByPrice = "DESC";
          } else if (sortValue === "Giá thấp đến cao") {
            params.sortByPrice = "ASC";
          }
        } else {
          // Flight cards mode: only add params if filters are applied
          // No default page or sort - backend returns all flights for today
        }

        // Add price filter (only if user selected)
        if (appliedFilters.priceRanges.length > 0) {
          const priceRangeMap = {
            '<1000000': { min: 0, max: 1000000 },
            '1000000-2000000': { min: 1000000, max: 2000000 },
            '2000000-4000000': { min: 2000000, max: 4000000 },
            '>4000000': { min: 4000000, max: Number.MAX_SAFE_INTEGER }
          };

          const selectedRanges = appliedFilters.priceRanges.map(range => priceRangeMap[range]);
          params.minPrice = Math.min(...selectedRanges.map(r => r.min));
          params.maxPrice = Math.max(...selectedRanges.map(r => r.max));
          
          if (params.maxPrice === Number.MAX_SAFE_INTEGER) {
            delete params.maxPrice;
          }
        }

        // Add airline filter (only if user selected)
        if (appliedFilters.airlines.length > 0) {
          params.airlineIds = appliedFilters.airlines;
        }

        console.log('Flight API params:', params);
        console.log('Using API:', hasLocationFilter ? 'searchFlights' : 'getFlightCards');

        // Call appropriate API
        const response = hasLocationFilter 
          ? await flightApi.searchFlights(params)
          : await flightApi.getFlightCards(params);
        
        console.log('Flight API Response:', response.data);

        if (response?.data?.result) {
          const result = response.data.result;
          setFlights(result.content || result || []);
          setTotalResults(result.totalElements || result.length || 0);
          setTotalPages(result.totalPages || 1);
        } else {
          setFlights([]);
          setTotalResults(0);
          setTotalPages(0);
        }
      } catch (err) {
        console.error('Error fetching flights:', err);
        setError(err.response?.data?.message || err.message || 'Không thể tải danh sách chuyến bay');
      } finally {
        setLoading(false);
      }
    };

    fetchFlights();
  }, [departureLocationId, arrivalLocationId, departureDate, currentPage, appliedFilters, sortValue]);

  // Filter handlers
  const handlePriceRangeChange = (range) => {
    setTempFilters(prev => ({
      ...prev,
      priceRanges: prev.priceRanges.includes(range)
        ? prev.priceRanges.filter(r => r !== range)
        : [...prev.priceRanges, range]
    }));
  };

  const handleAirlineChange = (airlineId) => {
    setTempFilters(prev => ({
      ...prev,
      airlines: prev.airlines.includes(airlineId)
        ? prev.airlines.filter(a => a !== airlineId)
        : [...prev.airlines, airlineId]
    }));
  };

  const handleApplyFilters = () => {
    setAppliedFilters({
      priceRanges: [...tempFilters.priceRanges],
      airlines: [...tempFilters.airlines]
    });
    setCurrentPage(0);
  };

  const handleClearFilters = () => {
    const emptyFilters = {
      priceRanges: [],
      airlines: []
    };
    setTempFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
    setDepartureDate("");
    setCurrentPage(0);
  };

  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Generate page numbers for pagination UI
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 0; i < totalPages; i++) pages.push(i);
    } else {
      pages.push(0);
      
      let start = Math.max(1, currentPage - 1);
      let end = Math.min(totalPages - 2, currentPage + 1);
      
      if (currentPage <= 2) end = 3;
      if (currentPage >= totalPages - 3) start = totalPages - 4;
      
      if (start > 1) pages.push('...');
      for (let i = start; i <= end; i++) pages.push(i);
      if (end < totalPages - 2) pages.push('...');
      
      pages.push(totalPages - 1);
    }
    return pages;
  };

  const sortOptions = ["Giá cao đến thấp", "Giá thấp đến cao"];

  // Handle location selection
  const handleDepartureLocationSelect = (location) => {
    setDepartureLocationId(location.id);
    setDepartureLocationName(location.name);
    setShowDepartureDropdown(false);
  };

  const handleArrivalLocationSelect = (location) => {
    setArrivalLocationId(location.id);
    setArrivalLocationName(location.name);
    setShowArrivalDropdown(false);
  };

  if (loading && flights.length === 0) {
    return (
      <div className="filter-page container">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
          <p className="mt-3">Đang tìm kiếm chuyến bay...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="filter-page container">
        <div className="alert alert-danger my-4" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="filter-page container">
        <div className="filter-inner">
          <aside className="filter-sidebar">
            <div className="filter-card">
              <div className="filter-title">Bộ lọc</div>

              {/* Departure Location */}
              <div className="filter-section">
                <h4>Điểm khởi hành</h4>
                <div className="location-dropdown" style={{ position: 'relative' }}>
                  <button 
                    className="location-select-btn"
                    onClick={() => setShowDepartureDropdown(!showDepartureDropdown)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      background: 'white',
                      textAlign: 'left',
                      cursor: 'pointer'
                    }}
                  >
                    {departureLocationName}
                  </button>
                  {showDepartureDropdown && (
                    <div 
                      className="location-dropdown-menu"
                      style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        maxHeight: '200px',
                        overflowY: 'auto',
                        background: 'white',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        marginTop: '5px',
                        zIndex: 1000,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                      }}
                    >
                      {locations.map(location => (
                        <div
                          key={location.id}
                          onClick={() => handleDepartureLocationSelect(location)}
                          style={{
                            padding: '10px',
                            cursor: 'pointer',
                            borderBottom: '1px solid #f0f0f0'
                          }}
                          onMouseEnter={(e) => e.target.style.background = '#f5f5f5'}
                          onMouseLeave={(e) => e.target.style.background = 'white'}
                        >
                          {location.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Arrival Location */}
              <div className="filter-section">
                <h4>Điểm đến</h4>
                <div className="location-dropdown" style={{ position: 'relative' }}>
                  <button 
                    className="location-select-btn"
                    onClick={() => setShowArrivalDropdown(!showArrivalDropdown)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      background: 'white',
                      textAlign: 'left',
                      cursor: 'pointer'
                    }}
                  >
                    {arrivalLocationName}
                  </button>
                  {showArrivalDropdown && (
                    <div 
                      className="location-dropdown-menu"
                      style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        maxHeight: '200px',
                        overflowY: 'auto',
                        background: 'white',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        marginTop: '5px',
                        zIndex: 1000,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                      }}
                    >
                      {locations.map(location => (
                        <div
                          key={location.id}
                          onClick={() => handleArrivalLocationSelect(location)}
                          style={{
                            padding: '10px',
                            cursor: 'pointer',
                            borderBottom: '1px solid #f0f0f0'
                          }}
                          onMouseEnter={(e) => e.target.style.background = '#f5f5f5'}
                          onMouseLeave={(e) => e.target.style.background = 'white'}
                        >
                          {location.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Departure Date */}
              <div className="filter-section">
                <h4>Ngày khởi hành</h4>
                <input 
                  type="date" 
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '8px'
                  }}
                />
              </div>

              {/* Price Range */}
              <div className="filter-section">
                <h4>Khoảng giá</h4>
                <label className="chk">
                  <input 
                    type="checkbox" 
                    checked={tempFilters.priceRanges.includes('<1000000')}
                    onChange={() => handlePriceRangeChange('<1000000')}
                  />
                  Dưới 1.000.000đ
                </label>
                <label className="chk">
                  <input 
                    type="checkbox" 
                    checked={tempFilters.priceRanges.includes('1000000-2000000')}
                    onChange={() => handlePriceRangeChange('1000000-2000000')}
                  />
                  1.000.000đ - 2.000.000đ
                </label>
                <label className="chk">
                  <input 
                    type="checkbox" 
                    checked={tempFilters.priceRanges.includes('2000000-4000000')}
                    onChange={() => handlePriceRangeChange('2000000-4000000')}
                  />
                  2.000.000đ - 4.000.000đ
                </label>
                <label className="chk">
                  <input 
                    type="checkbox" 
                    checked={tempFilters.priceRanges.includes('>4000000')}
                    onChange={() => handlePriceRangeChange('>4000000')}
                  />
                  Trên 4.000.000đ
                </label>
              </div>

              {/* Airlines */}
              <div className="filter-section">
                <h4>Hãng hàng không</h4>
                <label className="chk">
                  <input 
                    type="checkbox" 
                    checked={tempFilters.airlines.includes(1)}
                    onChange={() => handleAirlineChange(1)}
                  />
                  Vietnam Airlines
                </label>
                <label className="chk">
                  <input 
                    type="checkbox" 
                    checked={tempFilters.airlines.includes(2)}
                    onChange={() => handleAirlineChange(2)}
                  />
                  Vietjet Air
                </label>
                <label className="chk">
                  <input 
                    type="checkbox" 
                    checked={tempFilters.airlines.includes(3)}
                    onChange={() => handleAirlineChange(3)}
                  />
                  Bamboo Airways
                </label>
              </div>

              <div className="filter-apply">
                <button className="btn-apply" onClick={handleApplyFilters}>Áp dụng bộ lọc</button>
                <button className="btn-apply" onClick={handleClearFilters} style={{ marginTop: '10px', backgroundColor: '#dc3545' }}>Xóa bộ lọc</button>
              </div>
            </div>
          </aside>

          <main className="filter-results">
            <div className="results-head">
              <div>
                <h2 className="results-title">
                  {departureLocationName !== "Chọn điểm khởi hành" && arrivalLocationName !== "Chọn điểm đến"
                    ? `${departureLocationName} - ${arrivalLocationName}`
                    : "Chuyến bay"}
                </h2>
                <p className="results-sub">{totalResults} chuyến bay được tìm thấy</p>
              </div>
              <div className="sort" ref={sortRef}>
                <span className="sort-label">Xếp theo</span>
                <button className={`sort-btn ${sortOpen ? 'open' : ''}`} onClick={() => setSortOpen((s) => !s)}>
                  {sortValue} <i className="bi bi-chevron-down"></i>
                </button>

                {sortOpen && (
                  <ul className="sort-dropdown">
                    {sortOptions.map((opt) => (
                      <li
                        key={opt}
                        className={`sort-item ${opt === sortValue ? 'active' : ''}`}
                        onClick={() => { setSortValue(opt); setSortOpen(false); }}
                      >
                        {opt}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="results-list">
              {flights.length === 0 ? (
                <div className="text-center py-5">
                  <p className="text-muted">Không tìm thấy chuyến bay nào</p>
                </div>
              ) : (
                flights.map((f) => (
                  <div className="flight-card" key={f.id}>
                    <div className="flight-left">
                      <div className="airline">
                        <div className="airline-logo">
                          {f.airlineLogo ? (
                            <img src={f.airlineLogo} alt={f.airlineName} style={{ width: '40px', height: '40px' }} />
                          ) : (
                            "✈"
                          )}
                        </div>
                        <div className="airline-name">{f.airlineName || "Airline"}</div>
                      </div>

                      <div className="times">
                        <div className="time-block">
                          <div className="time">{f.departureTime || "00:00"}</div>
                          <div className="iata">{f.departureCode || ""}</div>
                          {f.departureCity && (
                            <div style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>
                              {f.departureCity}
                            </div>
                          )}
                        </div>

                        <div className="duration">
                          <div className="dur-text">{f.duration || "0h 0m"}</div>
                          <div className="type">{f.flightNumber || "Một chiều"}</div>
                        </div>

                        <div className="time-block">
                          <div className="time">{f.arrivalTime || "00:00"}</div>
                          <div className="iata">{f.arrivalCode || ""}</div>
                          {f.arrivalCity && (
                            <div style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>
                              {f.arrivalCity}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flight-right">
                      <div className="price-container">
                        <div className="price">{currency(f.originalPrice || 0)}</div>
                        <div className="per">/khách</div>
                      </div>
                      <button 
                        className="choose-btn"
                        onClick={() => navigate(`/classification?flightId=${f.id}`)}
                      >
                        Chọn
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                <button 
                  className="page-btn" 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                >
                  Trước
                </button>
                
                {getPageNumbers().map((page, index) => (
                  page === '...' ? (
                    <span key={`ellipsis-${index}`} className="page-ellipsis">...</span>
                  ) : (
                    <button
                      key={page}
                      className={`page-num ${page === currentPage ? 'active' : ''}`}
                      onClick={() => handlePageChange(page)}
                    >
                      {page + 1}
                    </button>
                  )
                ))}
                
                <button 
                  className="page-btn" 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages - 1}
                >
                  Sau
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
};

export default FilterPlane;
