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
  const [sortValue, setSortValue] = useState("Độ phổ biến");
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
        const results = response.data.result || [];
        
        setHotels(results);
        setTotalResults(results.length);
      } catch (err) {
        console.error('Error fetching hotels:', err);
        setError(err.message || 'Không thể tải danh sách khách sạn');
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, [locationName]);

  const sortOptions = ["Độ phổ biến", "Giá cao nhất", "Điểm đánh giá", "Giá thấp nhất"];

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
              <label className="chk"><input type="checkbox" /> <Stars n={5}/> </label>
              <label className="chk"><input type="checkbox" /> <Stars n={4}/> </label>
              <label className="chk"><input type="checkbox" /> <Stars n={3}/> </label>
              <label className="chk"><input type="checkbox" /> <Stars n={2}/> </label>
              <label className="chk"><input type="checkbox" /> <Stars n={1}/> </label>
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
              <button className={`sort-btn ${sortOpen ? 'open' : ''}`} onClick={() => setSortOpen((s) => !s)}>
                Xếp theo <span>{sortValue} ▾</span>
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
                        backgroundImage: `url(${h.thumbnail || '/static/media/feature-1.jpg'})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }} 
                    />
                  </div>

                  <div className="hotel-info">
                    <div className="hotel-top">
                      <span className="badge">{h.hotelType || 'Khách sạn'}</span>
                      <Stars n={h.starRating || 3} />
                    </div>

                    <h3 className="hotel-name">{h.name}</h3>
                    <div className="hotel-location">📍 {h.address || h.locationName}</div>

                    {h.amenities && (
                      <div className="hotel-tags">
                        {h.amenities.slice(0, 2).map((t, i) => (
                          <span key={i} className="tag">{t}</span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="hotel-price">
                    <div className="price">{currency(h.minPrice)}</div>
                    <button className="view-btn">Xem phòng ▸</button>
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
