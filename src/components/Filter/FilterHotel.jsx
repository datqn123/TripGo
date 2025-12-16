import React, { useState, useRef, useEffect } from "react";
import hotelApi from "../../api/hotelApi";
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
  const [sortOpen, setSortOpen] = useState(false);
  const [sortValue, setSortValue] = useState("Giá thấp đến cao");
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalResults, setTotalResults] = useState(0);
  const sortRef = useRef(null);

  // Extract location name from searchData or slug
  const locationName = searchData?.location || locationSlug?.replace(/-/g, ' ') || 'Đà Nẵng';

  useEffect(() => {
    function onDocClick(e) {
      if (sortRef.current && !sortRef.current.contains(e.target)) setSortOpen(false);
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true);
        setError(null);

        // Build search params
        const params = {
          location: locationName,
          page: 0,
          size: 20
        };

        const response = await hotelApi.searchHotels(params);
        console.log(response.data.result.hotels);
        // Handle different possible response structures
        let results = [];
        if (response?.data?.result && Array.isArray(response.data.result)) {
          results = response.data.result;
        } else if (response?.data && Array.isArray(response.data)) {
          results = response.data;
        } else if (Array.isArray(response)) {
          results = response;
        }

        setHotels(response.data.result.hotels);
        setTotalResults(response.data.result.hotels.length);
      } catch (err) {
        console.error('Error fetching hotels:', err);
        setError(err.message || 'Không thể tải danh sách khách sạn');
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, [locationName]);

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
              <label className="chk"><input type="checkbox" /> Dưới 1.000.000đ</label>
              <label className="chk"><input type="checkbox" /> 1.000.000đ - 5.000.000đ</label>
              <label className="chk"><input type="checkbox" /> 5.000.000đ - 10.000.000đ</label>
              <label className="chk"><input type="checkbox" /> Trên 10.000.000đ</label>
            </div>

            <div className="filter-section">
              <h4>Đánh giá</h4>
              <label className="chk"><input type="checkbox" /> <Stars n={5} /> </label>
              <label className="chk"><input type="checkbox" /> <Stars n={4} /> </label>
              <label className="chk"><input type="checkbox" /> <Stars n={3} /> </label>
              <label className="chk"><input type="checkbox" /> <Stars n={2} /> </label>
              <label className="chk"><input type="checkbox" /> <Stars n={1} /> </label>
            </div>

            <div className="filter-section">
              <h4>Loại hình lưu trú</h4>
              <label className="chk"><input type="checkbox" /> Villa</label>
              <label className="chk"><input type="checkbox" /> Khách sạn</label>
              <label className="chk"><input type="checkbox" /> Căn hộ</label>
              <label className="chk"><input type="checkbox" /> Resort</label>
            </div>

            <div className="filter-section">
              <h4>Tiện nghi</h4>
              <label className="chk"><input type="checkbox" /> Nhà hàng</label>
              <label className="chk"><input type="checkbox" /> Đưa đón sân bay</label>
              <label className="chk"><input type="checkbox" /> Khu vực giải trí</label>
            </div>

            <div className="filter-apply">
              <button className="btn-apply">Áp dụng bộ lọc</button>
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

                  <div className="hotel-info">
                    <h3 className="hotel-name">{h.name}</h3>

                    <div className="hotel-top">
                      <span className="badge">
                        <i className={`bi ${h.hotelType === 'Villas' ? 'bi-house-door' : h.hotelType === 'Căn hộ' ? 'bi-building' : 'bi-buildings'}`}></i>
                        {h.hotelType || 'Khách sạn'}
                      </span>
                      <Stars n={h.starRating || 3} />
                    </div>

                    <div className="hotel-location">
                      <i className="bi bi-geo-alt mb-3"></i> {h.address || h.locationName}
                    </div>

                    {h.amenities && h.amenities.length > 0 && (
                      <div className="hotel-tags">
                        {h.amenities.slice(0, 2).map((amenity, i) => (
                          <span key={i} className="tag">{amenity}</span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="hotel-price">
                    <button className="heart-btn">
                      <i className="bi bi-heart"></i>
                    </button>
                    {h.originalPrice && h.originalPrice > h.minPrice && (
                      <div className="old-price">{currency(h.originalPrice)}</div>
                    )}
                    <div className="price">{currency(h.minPrice)}</div>
                    <button className="view-btn">
                      Xem phòng <i className="bi bi-chevron-right"></i>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="pagination">
            <button className="page-btn">Trước</button>
            <button className="page-num active">1</button>
            <button className="page-num">2</button>
            <button className="page-btn">Sau</button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default FilterHotel;
