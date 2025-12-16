import React, { useState } from "react";
import Outstandingoffer from "./Outstandingoffer";
import "./filter.css";

const mockFlights = [
  { id: 1, airline: "Vietnam Airlines", logo: "★", depTime: "13:00", arrTime: "14:10", from: "DAD", to: "HAN", duration: "1h 10p", price: 1250000, type: "Khứ hồi" },
  { id: 2, airline: "Vietnam Airlines", logo: "★", depTime: "14:00", arrTime: "15:10", from: "DAD", to: "HAN", duration: "1h 10p", price: 1250000, type: "Khứ hồi" },
  { id: 3, airline: "Vietnam Airlines", logo: "★", depTime: "15:00", arrTime: "16:10", from: "DAD", to: "HAN", duration: "1h 10p", price: 1250000, type: "Khứ hồi" },
  { id: 4, airline: "Vietnam Airlines", logo: "★", depTime: "16:00", arrTime: "17:10", from: "DAD", to: "HAN", duration: "1h 10p", price: 1250000, type: "Khứ hồi" },
  { id: 5, airline: "Vietnam Airlines", logo: "★", depTime: "17:00", arrTime: "18:10", from: "DAD", to: "HAN", duration: "1h 10p", price: 1250000, type: "Khứ hồi" }
];

const currency = (v) => v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ";

const FilterPlane = () => {
  const [filters, setFilters] = useState({
    priceRanges: [],
    airlines: [],
    timeRanges: [],
    flightType: []
  });
  const [filterApplied, setFilterApplied] = useState(false);

  const toggleFilter = (key, value) => {
    setFilters((prev) => {
      const s = new Set(prev[key]);
      if (s.has(value)) s.delete(value);
      else s.add(value);
      return { ...prev, [key]: Array.from(s) };
    });
  };

  const handleApplyFilter = () => {
    setFilterApplied(true);
  };

  return (
    <>

      <div className="filter-page container">
        <div className="filter-inner">
          <aside className="filter-sidebar">
            <div className="filter-card">
              <div className="filter-title">Bộ lọc</div>

              <div className="filter-section">
                <h4>Khoảng giá</h4>
                <label className="chk"><input type="checkbox" /> Dưới 1.000.000đ</label>
                <label className="chk"><input type="checkbox" /> 1.000.000đ - 2.000.000đ</label>
                <label className="chk"><input type="checkbox" /> 2.000.000đ - 4.000.000đ</label>
                <label className="chk"><input type="checkbox" /> Trên 4.000.000đ</label>
              </div>

              <div className="filter-section">
                <h4>Hãng hàng không</h4>
                <label className="chk"><input type="checkbox" /> Vietnam Airlines</label>
                <label className="chk"><input type="checkbox" /> Vietjet Air</label>
                <label className="chk"><input type="checkbox" /> Singapore Airlines</label>
              </div>

              <div className="filter-section">
                <h4>Giờ khởi hành</h4>
                <label className="chk"><input type="checkbox" /> Sáng sớm (00:00 - 06:00)</label>
                <label className="chk"><input type="checkbox" /> Buổi sáng (06:00 - 12:00)</label>
                <label className="chk"><input type="checkbox" /> Buổi chiều (12:00 - 18:00)</label>
                <label className="chk"><input type="checkbox" /> Buổi tối (18:00 - 24:00)</label>
              </div>

              <div className="filter-section">
                <h4>Chọn kiểu bay</h4>
                <label className="chk"><input type="checkbox" /> Một chiều</label>
                <label className="chk"><input type="checkbox" /> Khứ hồi</label>
                <label className="chk"><input type="checkbox" /> Nhiều chặng</label>
              </div>

              <div className="filter-apply">
                <button className="btn-apply" onClick={handleApplyFilter}>Áp dụng bộ lọc</button>
              </div>
            </div>
          </aside>

          <main className="filter-results">
            {!filterApplied ? (
              <Outstandingoffer />
            ) : (
              <>
                <h2 className="results-title">Kết quả cho Đà Nẵng - Hà Nội</h2>
                <p className="results-sub">Có {mockFlights.length} chuyến bay</p>

                <div className="results-list">
                  {mockFlights.map((f) => (
                    <div className="flight-card" key={f.id}>
                      <div className="flight-left">
                        <div className="airline">
                          <div className="airline-logo">{f.logo}</div>
                          <div className="airline-name">{f.airline}</div>
                        </div>

                        <div className="times">
                          <div className="time-block">
                            <div className="time">{f.depTime}</div>
                            <div className="iata">{f.from}</div>
                          </div>

                          <div className="duration">
                            <div className="dur-text">{f.duration}</div>
                            <div className="type">{f.type}</div>
                          </div>

                          <div className="time-block">
                            <div className="time">{f.arrTime}</div>
                            <div className="iata">{f.to}</div>
                          </div>
                        </div>
                      </div>

                      <div className="flight-right">
                        <div className="price-container">
                          <div className="price">{currency(f.price)}</div>
                          <div className="per">/khách</div>
                        </div>
                        <button className="choose-btn">Chọn</button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pagination">
                  <button className="page-btn">Trước</button>
                  <button className="page-num active">1</button>
                  <button className="page-num">2</button>
                  <button className="page-btn">Sau</button>
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </>
  );
};

export default FilterPlane;
