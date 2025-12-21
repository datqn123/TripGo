import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import tourApi from '../../../api/tourApi';
import './TourManagement.css';

const TourManagement = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [tours, setTours] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    pageSize: 12
  });

  // Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [durationFilter, setDurationFilter] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchTours(0);
  }, []);

  const fetchTours = async (page) => {
    setLoading(true);
    try {
      const params = {
        page: page,
        size: pagination.pageSize,
        // Add other filters if API supports them later
        // title: searchTerm,
      };

      const response = await tourApi.getTours(params);
      
      if (response.data && response.data.result) {
        const { content, pageable, totalPages, totalElements, size, number } = response.data.result;
        setTours(content || []);
        setPagination({
          currentPage: number !== undefined ? number : (pageable?.pageNumber || 0),
          totalPages: totalPages || 0,
          totalElements: totalElements || 0,
          pageSize: size || 12
        });
      }
    } catch (error) {
      console.error("Failed to fetch tours:", error);
      toast.error("Không thể tải danh sách tour");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < pagination.totalPages) {
      fetchTours(newPage);
    }
  };

  const getStatusClass = (status) => {
    // API might not return status yet, keeping this for future use or mock
    switch (status) {
      case 'ACTIVE': return 'status-active';
      case 'PENDING': return 'status-pending';
      case 'DISABLED': return 'status-disabled';
      default: return '';
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const renderPaginationButtons = () => {
    const pages = [];
    const { currentPage, totalPages } = pagination;
    
    if (totalPages > 0) {
        for (let i = 0; i < totalPages; i++) {
            if (i === 0 || i === totalPages - 1 || (i >= currentPage - 2 && i <= currentPage + 2)) {
                 pages.push(
                    <button 
                        key={i} 
                        className={`page-btn ${currentPage === i ? 'active' : ''}`}
                        onClick={() => handlePageChange(i)}
                    >
                        {i + 1}
                    </button>
                 );
            } else if (i === currentPage - 3 || i === currentPage + 3) {
                pages.push(<span key={i} className="page-dots">...</span>);
            }
        }
    }
    return pages;
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
          <option value="ACTIVE">Hoạt động</option>
          <option value="PENDING">Tạm ngưng</option>
          <option value="DISABLED">Ngừng</option>
        </select>
      </div>

      {/* Table */}
      <div className="table-container">
        {loading ? (
           <div className="text-center p-5">Loading...</div>
        ) : (
          <table className="tours-table">
            <thead>
              <tr>
                <th>TÊN TOUR</th>
                <th>ĐỊA ĐIỂM</th>
                <th>THỜI LƯỢNG</th>
                <th>GIÁ TỪ</th>
                
                <th>HÀNH ĐỘNG</th>
              </tr>
            </thead>
            <tbody>
              {tours.map((tour) => (
                <tr key={tour.id}>
                  <td>
                    <div className="tour-info">
                      {(tour.thumbnail || (tour.imageUrls && tour.imageUrls.length > 0)) ? (
                        <img 
                          src={tour.thumbnail || tour.imageUrls[0]} 
                          alt={tour.title} 
                          className="tour-image"
                          onError={(e) => {
                            e.target.onerror = null; 
                            e.target.src = 'https://via.placeholder.com/60x60?text=No+Img'
                          }}
                        />
                      ) : (
                         <div className="tour-icon text-2xl h-[50px] w-[50px] flex items-center justify-center bg-blue-100 rounded-lg">
                            🏝️
                         </div>
                      )}
                      <div className="tour-name">{tour.title}</div>
                    </div>
                  </td>
                  <td>{tour.destinationName}</td>
                  <td>{tour.duration}</td>
                  <td className="price-cell">{formatPrice(tour.price)}</td>
                 
                  <td>
                    <div className="action-buttons">
                      <button className="action-btn view-btn" title="Xem chi tiết" onClick={() => navigate(`/admin/tours/edit/${tour.id}`)}>
                        <i className="bi bi-eye"></i>
                      </button>
                      <button className="action-btn edit-btn" title="Chỉnh sửa" onClick={() => navigate(`/admin/tours/edit/${tour.id}`)}>
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button className="action-btn delete-btn" title="Xóa">
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {tours.length === 0 && (
                <tr>
                    <td colSpan="5" className="text-center py-4">Không tìm thấy tour nào</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="pagination-container">
        <div className="pagination-info">
          Hiển thị <strong>{(pagination.currentPage * pagination.pageSize) + 1}-{Math.min((pagination.currentPage + 1) * pagination.pageSize, pagination.totalElements)}</strong> trong số <strong>{pagination.totalElements}</strong> kết quả
        </div>
        <div className="pagination-controls">
          <button 
            className="page-btn" 
            disabled={pagination.currentPage === 0}
            onClick={() => handlePageChange(pagination.currentPage - 1)}
          >
            <i className="bi bi-chevron-left"></i>
          </button>
          
          {renderPaginationButtons()}

          <button 
            className="page-btn" 
            disabled={pagination.currentPage >= pagination.totalPages - 1}
            onClick={() => handlePageChange(pagination.currentPage + 1)}
          >
            <i className="bi bi-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TourManagement;
