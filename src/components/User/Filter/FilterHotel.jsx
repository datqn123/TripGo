import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import hotelApi from "../../../api/hotelApi";
import { PUBLIC_API } from "../../../api/config";
import "./filter-hotel.css";

const currency = (v) => {
  if (v === null || v === undefined) return "";
  return v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ";
};

const Stars = ({ n }) => (
  <div className="stars">
    {Array.from({ length: n }).map((_, i) => (
      <span key={i} className="star">★</span>
    ))}
  </div>
);

const FilterHotel = ({ locationSlug, searchData }) => {
  const navigate = useNavigate();
  const [sortOpen, setSortOpen] = useState(false);
  const [sortValue, setSortValue] = useState("Giá thấp đến cao");
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const sortRef = useRef(null);

  // Temporary filter states (UI state - changes on checkbox click)
  const [tempFilters, setTempFilters] = useState({
    priceRanges: [],      // Array of selected price ranges: ['<1000000', '1000000-5000000', ...]
    starRatings: [],      // Array of selected star ratings: [1, 2, 3, 4, 5]
    hotelTypes: [],       // Array of selected hotel types: ['RESORT', 'HOTEL', 'APARTMENT', 'VILLA']
  });

  // Applied filter states (sent to API - only changes when "Áp dụng bộ lọc" clicked)
  const [appliedFilters, setAppliedFilters] = useState({
    priceRanges: [],
    starRatings: [],
    hotelTypes: [],
  });

  // Extract location name from searchData or slug
  const locationName = searchData?.locationName || locationSlug?.replace(/-/g, ' ') || 'Đà Nẵng';
  const locationId = searchData?.locationId;
  useEffect(() => {
    function onDocClick(e) {
      if (sortRef.current && !sortRef.current.contains(e.target)) setSortOpen(false);
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  // Reset page when locationId or appliedFilters change
  useEffect(() => {
    setCurrentPage(0);
  }, [locationId, appliedFilters]);

  // Fetch hotels when locationId, appliedFilters, sortValue, or currentPage changes
  useEffect(() => {
    const fetchHotels = async () => {
      if (!locationId) {
        setHotels([]);
        setTotalResults(0);
        setTotalPages(0);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Build search params
        const params = {
          id: Number(locationId),
          page: currentPage
        };

        // Add price filter
        if (appliedFilters.priceRanges.length > 0) {
          // Find the minimum minPrice and maximum maxPrice from selected ranges
          const priceRangeMap = {
            '<1000000': { min: 0, max: 1000000 },
            '1000000-5000000': { min: 1000000, max: 5000000 },
            '5000000-10000000': { min: 5000000, max: 10000000 },
            '>10000000': { min: 10000000, max: Number.MAX_SAFE_INTEGER }
          };

          const selectedRanges = appliedFilters.priceRanges.map(range => priceRangeMap[range]);
          params.minPrice = Math.min(...selectedRanges.map(r => r.min));
          params.maxPrice = Math.max(...selectedRanges.map(r => r.max));
          
          // If maxPrice is MAX_SAFE_INTEGER, don't send it to backend
          if (params.maxPrice === Number.MAX_SAFE_INTEGER) {
            delete params.maxPrice;
          }
        }

        // Add star rating filter
        if (appliedFilters.starRatings.length > 0) {
          params.minStarRating = Math.min(...appliedFilters.starRatings);
          params.maxStarRating = Math.max(...appliedFilters.starRatings);
        }

        // Add hotel type filter (backend expects single HotelType enum)
        // If multiple types selected, we'll need to make multiple calls or change backend
        // For now, we'll send the first selected type
        if (appliedFilters.hotelTypes.length > 0) {
          params.hotelType = appliedFilters.hotelTypes[0]; // Backend accepts single type
        }

        // Add sort parameter
        if (sortValue === "Giá cao đến thấp") {
          params.sortByPrice = "DESC";
        } else if (sortValue === "Giá thấp đến cao") {
          params.sortByPrice = "ASC";
        }

        console.log('Search params:', params);

        const response = await hotelApi.searchHotels(params);
        console.log('API Response:', response.data);

        if (response?.data?.result) {
          const result = response.data.result;
          setHotels(result.hotels || []);
          setTotalResults(result.totalElements || 0);
          setTotalPages(result.totalPages || 1);
        } else {
          setHotels([]);
          setTotalResults(0);
          setTotalPages(0);
        }
      } catch (err) {
        console.error('Error fetching hotels:', err);
        setError(err.response?.data?.message || err.message || 'Không thể tải danh sách khách sạn');
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, [locationId, currentPage, appliedFilters, sortValue]);

  // Filter handlers
  const handlePriceRangeChange = (range) => {
    setTempFilters(prev => ({
      ...prev,
      priceRanges: prev.priceRanges.includes(range)
        ? prev.priceRanges.filter(r => r !== range)
        : [...prev.priceRanges, range]
    }));
  };

  const handleStarRatingChange = (rating) => {
    setTempFilters(prev => ({
      ...prev,
      starRatings: prev.starRatings.includes(rating)
        ? prev.starRatings.filter(r => r !== rating)
        : [...prev.starRatings, rating]
    }));
  };

  const handleHotelTypeChange = (type) => {
    setTempFilters(prev => ({
      ...prev,
      hotelTypes: prev.hotelTypes.includes(type)
        ? prev.hotelTypes.filter(t => t !== type)
        : [...prev.hotelTypes, type]
    }));
  };

  const handleApplyFilters = () => {
    // Copy temp filters to applied filters - this will trigger API call
    setAppliedFilters({
      priceRanges: [...tempFilters.priceRanges],
      starRatings: [...tempFilters.starRatings],
      hotelTypes: [...tempFilters.hotelTypes]
    });
    setCurrentPage(0);
  };

  const handleClearFilters = () => {
    // Clear both temp and applied filters
    const emptyFilters = {
      priceRanges: [],
      starRatings: [],
      hotelTypes: []
    };
    setTempFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
    setCurrentPage(0);
  };

  // Handle toggle favorite
  const handleToggleFavorite = async (e, hotelId) => {
    e.stopPropagation();
    
    const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
    if (!token) {
      toast.warning('Vui lòng đăng nhập để thêm khách sạn yêu thích!');
      return;
    }

    try {
      const response = await fetch(PUBLIC_API.TOGGLE_FAVORITE(hotelId), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        // Update local state
        setHotels(prev => prev.map(hotel => 
          hotel.id === hotelId ? { ...hotel, isFavorite: !hotel.isFavorite } : hotel
        ));
        
        const hotel = hotels.find(h => h.id === hotelId);
        toast.success(hotel?.isFavorite ? 'Đã xóa khỏi danh sách yêu thích!' : 'Đã thêm vào danh sách yêu thích!');
      } else {
        toast.error('Có lỗi xảy ra, vui lòng thử lại!');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Có lỗi xảy ra, vui lòng thử lại!');
    }
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
      pages.push(0); // First page
      
      let start = Math.max(1, currentPage - 1);
      let end = Math.min(totalPages - 2, currentPage + 1);
      
      if (currentPage <= 2) end = 3;
      if (currentPage >= totalPages - 3) start = totalPages - 4;
      
      if (start > 1) pages.push('...');
      for (let i = start; i <= end; i++) pages.push(i);
      if (end < totalPages - 2) pages.push('...');
      
      pages.push(totalPages - 1); // Last page
    }
    return pages;
  };

  const sortOptions = ["Giá cao đến thấp", "Giá thấp đến cao"];

  if (loading) {
    return (
      <div className="hotel-page container">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
          <p className="mt-3">Đang tìm kiếm khách sạn...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="hotel-page container">
        <div className="alert alert-danger my-4" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="hotel-page container">
      <div className="hotel-inner">
        <aside className="hotel-sidebar">
          <div className="filter-card">
            <div className="filter-title">Bộ lọc</div>

            <div className="filter-section">
              <h4>Giá phòng/đêm</h4>
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
                  checked={tempFilters.priceRanges.includes('1000000-5000000')}
                  onChange={() => handlePriceRangeChange('1000000-5000000')}
                />
                1.000.000đ - 5.000.000đ
              </label>
              <label className="chk">
                <input 
                  type="checkbox" 
                  checked={tempFilters.priceRanges.includes('5000000-10000000')}
                  onChange={() => handlePriceRangeChange('5000000-10000000')}
                />
                5.000.000đ - 10.000.000đ
              </label>
              <label className="chk">
                <input 
                  type="checkbox" 
                  checked={tempFilters.priceRanges.includes('>10000000')}
                  onChange={() => handlePriceRangeChange('>10000000')}
                />
                Trên 10.000.000đ
              </label>
            </div>

            <div className="filter-section">
              <h4>Đánh giá</h4>
              <label className="chk">
                <input 
                  type="checkbox" 
                  checked={tempFilters.starRatings.includes(5)}
                  onChange={() => handleStarRatingChange(5)}
                />
                <Stars n={5} />
              </label>
              <label className="chk">
                <input 
                  type="checkbox" 
                  checked={tempFilters.starRatings.includes(4)}
                  onChange={() => handleStarRatingChange(4)}
                />
                <Stars n={4} />
              </label>
              <label className="chk">
                <input 
                  type="checkbox" 
                  checked={tempFilters.starRatings.includes(3)}
                  onChange={() => handleStarRatingChange(3)}
                />
                <Stars n={3} />
              </label>
              <label className="chk">
                <input 
                  type="checkbox" 
                  checked={tempFilters.starRatings.includes(2)}
                  onChange={() => handleStarRatingChange(2)}
                />
                <Stars n={2} />
              </label>
              <label className="chk">
                <input 
                  type="checkbox" 
                  checked={tempFilters.starRatings.includes(1)}
                  onChange={() => handleStarRatingChange(1)}
                />
                <Stars n={1} />
              </label>
            </div>

            <div className="filter-section">
              <h4>Loại hình lưu trú</h4>
              <label className="chk">
                <input 
                  type="checkbox" 
                  checked={tempFilters.hotelTypes.includes('VILLA')}
                  onChange={() => handleHotelTypeChange('VILLA')}
                />
                Villa
              </label>
              <label className="chk">
                <input 
                  type="checkbox" 
                  checked={tempFilters.hotelTypes.includes('HOTEL')}
                  onChange={() => handleHotelTypeChange('HOTEL')}
                />
                Khách sạn
              </label>
              <label className="chk">
                <input 
                  type="checkbox" 
                  checked={tempFilters.hotelTypes.includes('APARTMENT')}
                  onChange={() => handleHotelTypeChange('APARTMENT')}
                />
                Căn hộ
              </label>
              <label className="chk">
                <input 
                  type="checkbox" 
                  checked={tempFilters.hotelTypes.includes('RESORT')}
                  onChange={() => handleHotelTypeChange('RESORT')}
                />
                Resort
              </label>
            </div>

            <div className="filter-section">
              <h4>Tiện nghi</h4>
              <label className="chk"><input type="checkbox" /> Nhà hàng</label>
              <label className="chk"><input type="checkbox" /> Đưa đón sân bay</label>
              <label className="chk"><input type="checkbox" /> Khu vực giải trí</label>
            </div>

            <div className="filter-apply">
              <button className="btn-apply" onClick={handleApplyFilters}>Áp dụng bộ lọc</button>
              <button className="btn-apply" onClick={handleClearFilters} style={{ marginTop: '10px', backgroundColor: '#dc3545' }}>Xóa bộ lọc</button>
            </div>
          </div>
        </aside>

        <main className="hotel-results">
          <div className="results-head">
            <div>
              <h2 className="results-title">{locationName}</h2>
              <p className="results-sub">{totalResults} nơi lưu trú được tìm thấy</p>
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

          <div className="hotel-list">
            {hotels.length === 0 ? (
              <div className="text-center py-5">
                <p className="text-muted">Không tìm thấy khách sạn nào</p>
              </div>
            ) : (
              hotels.map((h) => (
                <div className="hotel-card" key={h.id}>
                  <div className="hotel-media">
                    <div
                      className="main-img"
                      style={{
                        backgroundImage: `url(${h.thumbnail || h.images?.[0] || '/static/media/feature-1.jpg'})`,
                      }}
                    />
                  </div>

                  <div className="hotel-details">
                    <h3 className="hotel-name">{h.name}</h3>
                    
                    <div className="hotel-top">
                      <span className="badge">
                        <i className={`bi ${h.hotelType === 'Villas' ? 'bi-house-door' : h.hotelType === 'Căn hộ' ? 'bi-building' : 'bi-buildings'}`}></i>
                        {h.hotelType || 'Khách sạn'}
                      </span>
                      <Stars n={h.starRating || 3} />
                    </div>

                    <div className="hotel-location">
                      <i className="bi bi-geo-alt-fill"></i> {h.address || h.locationName}
                    </div>

                  </div>

                  <div className="hotel-actions">
                    <button 
                      className={`heart-btn ${h.isFavorite ? 'active' : ''}`}
                      onClick={(e) => handleToggleFavorite(e, h.id)}
                    >
                      <i className={h.isFavorite ? "bi bi-heart-fill" : "bi bi-heart"}></i>
                    </button>

                    <div className="action-bottom">
                       <div className="price-box">
                          {h.originalPrice && h.originalPrice > h.minPrice && (
                            <div className="old-price">{currency(h.originalPrice)}</div>
                          )}
                          <div className="price">{currency(h.minPrice)}</div>
                       </div>
                       
                       <button 
                        className="view-btn"
                        onClick={() => navigate(`/hotel-detail/${h.id}`)}
                      >
                        Xem phòng <i className="bi bi-chevron-right"></i>
                      </button>
                    </div>
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
  );
};

export default FilterHotel;
