import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './HotelManagement.css';

const HotelManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Sample data - Replace with API call
  const hotels = [
    {
      id: '#HTL-8852',
      name: 'Grand Hyatt Saigon',
      image: 'https://via.placeholder.com/60x60',
      location: 'TP. Hồ Chí Minh',
      country: 'Vietnam',
      category: 'Hotel',
      categoryColor: '#3b82f6',
      rating: 4.8,
      reviews: 124,
      status: 'Active'
    },
    {
      id: '#RST-1029',
      name: 'Vinpearl Resort',
      image: 'https://via.placeholder.com/60x60',
      location: 'Nha Trang',
      country: 'Vietnam',
      category: 'Resort',
      categoryColor: '#a855f7',
      rating: 5.0,
      reviews: 890,
      status: 'Active'
    },
    {
      id: '#VIL-4421',
      name: 'Hidden Hill Villa',
      image: 'https://via.placeholder.com/60x60',
      location: 'Đà Lạt',
      country: 'Vietnam',
      category: 'Villa',
      categoryColor: '#f97316',
      rating: 0,
      reviews: 0,
      status: 'Pending'
    },
    {
      id: '#HST-9912',
      name: 'Ocean Breeze',
      image: 'https://via.placeholder.com/60x60',
      location: 'Phú Quốc',
      country: 'Vietnam',
      category: 'Homestay',
      categoryColor: '#8b5cf6',
      rating: 4.2,
      reviews: 45,
      status: 'Disabled'
    },
    {
      id: '#HTL-3345',
      name: 'Melia Hanoi',
      image: 'https://via.placeholder.com/60x60',
      location: 'Hà Nội',
      country: 'Vietnam',
      category: 'Hotel',
      categoryColor: '#3b82f6',
      rating: 4.9,
      reviews: 212,
      status: 'Active'
    }
  ];

  const getStatusClass = (status) => {
    switch (status) {
      case 'Active': return 'status-active';
      case 'Pending': return 'status-pending';
      case 'Disabled': return 'status-disabled';
      default: return '';
    }
  };

  return (
    <div className="hotel-management">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link to="/admin">Dashboard</Link>
        <span className="separator">{'>'}</span>
        <span className="current">Quản lý khách sạn</span>
      </div>

      {/* Header */}
      <div className="page-header">
        <div className="header-left">
          <h1>Quản lý khách sạn</h1>
          <p className="subtitle">Quản lý thông tin, trạng thái và danh sách phòng của các đối tác</p>
        </div>
        <button className="add-button" onClick={() => navigate('/admin/hotels/add')}>
          <i className="bi bi-plus-lg"></i>
          Thêm khách sạn
        </button>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-box">
          <i className="bi bi-search"></i>
          <input
            type="text"
            placeholder="Tìm kiếm theo tên khách sạn..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select className="filter-select" value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)}>
          <option value="">Địa điểm</option>
          <option value="hcm">TP. Hồ Chí Minh</option>
          <option value="hanoi">Hà Nội</option>
          <option value="dalat">Đà Lạt</option>
          <option value="nhatrang">Nha Trang</option>
          <option value="phuquoc">Phú Quốc</option>
        </select>

        <select className="filter-select" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="">Hạng mục</option>
          <option value="hotel">Hotel</option>
          <option value="resort">Resort</option>
          <option value="villa">Villa</option>
          <option value="homestay">Homestay</option>
        </select>

        <select className="filter-select" value={ratingFilter} onChange={(e) => setRatingFilter(e.target.value)}>
          <option value="">Đánh giá</option>
          <option value="5">5 sao</option>
          <option value="4">4 sao trở lên</option>
          <option value="3">3 sao trở lên</option>
        </select>

        <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">Trạng thái</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="disabled">Disabled</option>
        </select>
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="hotels-table">
          <thead>
            <tr>
              <th>TÊN KHÁCH SẠN</th>
              <th>ĐỊA ĐIỂM</th>
              <th>HẠNG MỤC</th>
              <th>ĐÁNH GIÁ</th>
              <th>TRẠNG THÁI</th>
              <th>HÀNH ĐỘNG</th>
            </tr>
          </thead>
          <tbody>
            {hotels.map((hotel) => (
              <tr key={hotel.id}>
                <td>
                  <div className="hotel-info">
                    <img src={hotel.image} className="hotel-image" />
                    <div>
                      <div className="hotel-name">{hotel.name}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="location-info">
                    <div>{hotel.location}</div>
                    <div className="country">{hotel.country}</div>
                  </div>
                </td>
                <td>
                  <span className="category-badge text-black">
                    {hotel.category}
                  </span>
                </td>
                <td>
                  <div className="rating-info">
                    {hotel.rating > 0 ? (
                      <>
                        <i className="bi bi-star-fill" style={{ color: '#fbbf24' }}></i>
                        <span className="rating-value">{hotel.rating}</span>
                        <span className="review-count">({hotel.reviews})</span>
                      </>
                    ) : (
                      <span className="no-rating">-- (New)</span>
                    )}
                  </div>
                </td>
                <td>
                  <span className={`status-badge ${getStatusClass(hotel.status)}`}>
                    {hotel.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="action-btn view-btn" title="Xem chi tiết">
                      <i className="bi bi-eye"></i>
                    </button>
                    <button className="action-btn edit-btn" title="Chỉnh sửa">
                      <i className="bi bi-pencil"></i>
                    </button>
                    <button className="action-btn delete-btn" title="Xóa">
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination-container">
        <div className="pagination-info">
          Hiển thị <strong>1-5</strong> trong số <strong>48</strong> kết quả
        </div>
        <div className="pagination-controls">
          <button className="page-btn" disabled>
            <i className="bi bi-chevron-left"></i>
          </button>
          <button className="page-btn active">1</button>
          <button className="page-btn">2</button>
          <button className="page-btn">3</button>
          <span className="page-dots">...</span>
          <button className="page-btn">8</button>
          <button className="page-btn">
            <i className="bi bi-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HotelManagement;
