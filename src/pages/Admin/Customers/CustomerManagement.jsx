import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './CustomerManagement.css';

const CustomerManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Sample data
  const customers = [
    {
      id: 'KH-0001',
      name: 'Lê Văn C',
      contact: 'Ha Long Bay Cruise',
      date: '30/10/2020',
      total: '2.888.000'
    },
    {
      id: 'KH-0001',
      name: 'Lê Văn C',
      contact: 'Ha Long Bay Cruise',
      date: '30/10/2020',
      total: '2.888.000'
    },
    {
      id: 'KH-0001',
      name: 'Lê Văn C',
      contact: 'Ha Long Bay Cruise',
      date: '30/10/2020',
      total: '2.888.000'
    }
  ];

  return (
    <div className="customer-management">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link to="/admin">Dashboard</Link>
        <span className="separator">{'>'}</span>
        <span className="current">Quản lý khách hàng</span>
      </div>

      {/* Header */}
      <div className="page-header">
        <div className="header-left">
          <h1>Quản lý khách hàng</h1>
          <p className="subtitle">Quản lý thông tin và lịch sử giao dịch của khách hàng</p>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-box">
          <i className="bi bi-search"></i>
          <input
            type="text"
            placeholder="Tìm kiếm theo mã, tên khách hàng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select className="filter-select">
          <option value="">Hồ DH</option>
          <option value="complete">Hoàn thành</option>
          <option value="pending">Đang xử lý</option>
        </select>

        <select className="filter-select">
          <option value="">Khách hàng</option>
          <option value="vip">VIP</option>
          <option value="regular">Thường xuyên</option>
          <option value="new">Mới</option>
        </select>

        <select className="filter-select">
          <option value="">Liên hệ</option>
          <option value="email">Email</option>
          <option value="phone">Điện thoại</option>
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
          <option value="active">Hoạt động</option>
          <option value="inactive">Không hoạt động</option>
        </select>
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="customers-table">
          <thead>
            <tr>
              <th>HỒ DH</th>
              <th>KHÁCH HÀNG</th>
              <th>LIÊN HỆ</th>
              <th>NGÀY ĐẶT</th>
              <th>TỔNG</th>
              <th>TRẠNG THÁI</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer, index) => (
              <tr key={index}>
                <td className="customer-id">{customer.id}</td>
                <td>{customer.name}</td>
                <td>{customer.contact}</td>
                <td>{customer.date}</td>
                <td className="total-amount">{customer.total} đ</td>
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

export default CustomerManagement;
