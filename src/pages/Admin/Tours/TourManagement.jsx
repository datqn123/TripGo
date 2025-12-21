import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './TourManagement.css';

const TourManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [durationFilter, setDurationFilter] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Sample data - Replace with API call
  const tours = [
    {
      id: 1,
      name: 'Ha Long Bay Cruise 2N1D',
      image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=100&h=100&fit=crop',
      location: 'Quảng Ninh',
      duration: '2 ngày 1 đêm',
      price: '2.500.000',
      status: 'Hoạt động'
    },
    {
      id: 2,
      name: 'Sapa Trekking Adventure',
      icon: '🏔️',
      location: 'Lào Cai',
      duration: '3 ngày 2 đêm',
      price: '3.200.000',
      status: 'Hoạt động'
    },
    {
      id: 3,
      name: 'Đà Nẵng - Hội An - Huế',
      image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=100&h=100&fit=crop',
      location: 'Đà Nẵng',
      duration: '4 ngày 3 đêm',
      price: '4.500.000',
      status: 'Hoạt động'
    },
    {
      id: 4,
      name: 'Phú Quốc Island Tour',
      icon: '🏝️',
      location: 'Kiên Giang',
      duration: '3 ngày 2 đêm',
      price: '5.100.000',
      status: 'Tạm ngưng'
    },
    {
      id: 5,
      name: 'Mekong Delta Discovery',
      image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=100&h=100&fit=crop',
      location: 'Cần Thơ',
      duration: '2 ngày 1 đêm',
      price: '1.800.000',
      status: 'Hoạt động'
    }
  ];

  const getStatusClass = (status) => {
    switch (status) {
      case 'Hoạt động': return 'status-active';
      case 'Tạm ngưng': return 'status-pending';
      case 'Ngừng': return 'status-disabled';
      default: return '';
    }
  };

  return (
    <div className="tour-management">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link to="/admin">Dashboard</Link>
        <span className="separator">{'>'}</span>
        <span className="current">Quản lý tour</span>
      </div>

      {/* Header */}
      <div className="page-header">
        <div className="header-left">
          <h1>Quản lý Tour</h1>
          <p className="subtitle">Quản lý, tổ chức và theo dõi tất cả các tour du lịch</p>
        </div>
        <button className="add-button" onClick={() => navigate('/admin/tours/add')}>
          <i className="bi bi-plus-lg"></i>
          Thêm tour
        </button>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-box">
          <i className="bi bi-search"></i>
          <input
            type="text"
            placeholder="Tìm kiếm theo tên tour..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select className="filter-select" value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)}>
          <option value="">Địa điểm</option>
          <option value="quangninh">Quảng Ninh</option>
          <option value="laocai">Lào Cai</option>
          <option value="danang">Đà Nẵng</option>
          <option value="kiengiang">Kiên Giang</option>
          <option value="cantho">Cần Thơ</option>
        </select>

        <select className="filter-select" value={durationFilter} onChange={(e) => setDurationFilter(e.target.value)}>
          <option value="">Thời lượng</option>
          <option value="1day">1 ngày</option>
          <option value="2days">2 ngày 1 đêm</option>
          <option value="3days">3 ngày 2 đêm</option>
          <option value="4days">4 ngày 3 đêm</option>
          <option value="5days">5+ ngày</option>
        </select>

        <select className="filter-select" value={priceFilter} onChange={(e) => setPriceFilter(e.target.value)}>
          <option value="">Giá</option>
          <option value="0-2">Dưới 2 triệu</option>
          <option value="2-5">2-5 triệu</option>
          <option value="5-10">5-10 triệu</option>
          <option value="10+">Trên 10 triệu</option>
        </select>

        <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">Trạng thái</option>
          <option value="active">Hoạt động</option>
          <option value="pending">Tạm ngưng</option>
          <option value="disabled">Ngừng</option>
        </select>
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="tours-table">
          <thead>
            <tr>
              <th>TÊN TOUR</th>
              <th>ĐỊA ĐIỂM</th>
              <th>THỜI LƯỢNG</th>
              <th>GIÁ TỪ</th>
              <th>TRẠNG THÁI</th>
              <th>HÀNH ĐỘNG</th>
            </tr>
          </thead>
          <tbody>
            {tours.map((tour) => (
              <tr key={tour.id}>
                <td>
                  <div className="tour-info">
                    {tour.image ? (
                      <img src={tour.image} alt={tour.name} className="tour-image" />
                    ) : (
                      <div className="tour-icon">{tour.icon}</div>
                    )}
                    <div className="tour-name">{tour.name}</div>
                  </div>
                </td>
                <td>{tour.location}</td>
                <td>{tour.duration}</td>
                <td className="price-cell">{tour.price} đ</td>
                <td>
                  <span className={`status-badge ${getStatusClass(tour.status)}`}>
                    {tour.status}
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

export default TourManagement;
