import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './BookingManagement.css';

const BookingManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [serviceFilter, setServiceFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Sample data
  const bookings = [
    {
      id: 'TC-0003',
      customer: 'Nguyễn Văn A',
      service: 'VinPearl Resort Phu Quoc',
      serviceType: 'Khách sạn',
      category: 'Khách sạn',
      date: '30/12/2025',
      total: '2.888.000',
      status: 'Đã xác nhận'
    },
    {
      id: 'TC-0002',
      customer: 'Nguyễn Văn A',
      service: 'VN123 SGN-HAN',
      serviceType: 'Vé máy bay',
      category: 'Vé máy bay',
      date: '30/12/2025',
      total: '2.664.000',
      status: 'Đã xác nhận'
    },
    {
      id: 'TC-0001',
      customer: 'Nguyễn Văn A',
      service: 'Ha Long Bay Cruise',
      serviceType: 'Du lịch',
      category: 'Tour',
      date: '24/12/2025',
      total: '2.888.000',
      status: 'Chờ xác nhận'
    }
  ];

  const getServiceBadgeClass = (type) => {
    switch (type) {
      case 'Khách sạn': return 'service-hotel';
      case 'Vé máy bay': return 'service-flight';
      case 'Du lịch': return 'service-tour';
      default: return '';
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Đã xác nhận': return 'status-confirmed';
      case 'Chờ xác nhận': return 'status-pending';
      case 'Đã hủy': return 'status-cancelled';
      default: return '';
    }
  };

  return (
    <div className="booking-management">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link to="/admin">Dashboard</Link>
        <span className="separator">{'>'}</span>
        <span className="current">Quản lý đặt chỗ</span>
      </div>

      {/* Header */}
      <div className="page-header">
        <div className="header-left">
          <h1>Quản lý đặt chỗ</h1>
          <p className="subtitle">Quản lý tất cả các đơn đặt chỗ từ khách hàng</p>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-box">
          <i className="bi bi-search"></i>
          <input
            type="text"
            placeholder="Tìm kiếm theo mã đặt chỗ, tên khách hàng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">Dịch vụ</option>
          <option value="hotel">Khách sạn</option>
          <option value="flight">Vé máy bay</option>
          <option value="tour">Du lịch</option>
        </select>

        <select className="filter-select">
          <option value="">Loại</option>
          <option value="standard">Tiêu chuẩn</option>
          <option value="premium">Cao cấp</option>
        </select>

        <select className="filter-select">
          <option value="">Ngày đặt</option>
          <option value="today">Hôm nay</option>
          <option value="week">Tuần này</option>
          <option value="month">Tháng này</option>
        </select>

        <select className="filter-select">
          <option value="">Tổng</option>
          <option value="0-1m">Dưới 1 triệu</option>
          <option value="1m-5m">1-5 triệu</option>
          <option value="5m+">Trên 5 triệu</option>
        </select>

        <select className="filter-select">
          <option value="">Trạng thái</option>
          <option value="confirmed">Đã xác nhận</option>
          <option value="pending">Chờ xác nhận</option>
          <option value="cancelled">Đã hủy</option>
        </select>
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="bookings-table">
          <thead>
            <tr>
              <th>MÃ ĐẶT CHỖ</th>
              <th>KHÁCH HÀNG</th>
              <th>DỊCH VỤ</th>
              <th>LOẠI</th>
              <th>NGÀY ĐẶT</th>
              <th>TỔNG</th>
              <th>TRẠNG THÁI</th>
              <th>HÀNH ĐỘNG</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td className="booking-id">{booking.id}</td>
                <td>{booking.customer}</td>
                <td>
                  <div className="service-info">
                    <div className="service-name">{booking.service}</div>
                  </div>
                </td>
                <td>{booking.category}</td>
                <td>{booking.date}</td>
                <td className="total-amount">{booking.total} đ</td>
                <td>
                  <span className={`status-badge ${getStatusClass(booking.status)}`}>
                    {booking.status}
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
          Hiển thị <strong>1-3</strong> trong số <strong>48</strong> kết quả
        </div>
        <div className="pagination-controls">
          <button className="page-btn active">1</button>
          <button className="page-btn">2</button>
          <button className="page-btn">3</button>
          <span className="page-dots">...</span>
          <button className="page-btn">8</button>
        </div>
      </div>
    </div>
  );
};

export default BookingManagement;
