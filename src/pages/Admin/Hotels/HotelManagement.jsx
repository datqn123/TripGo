import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import adminApi from '../../../api/adminApi';
import hotelApi from '../../../api/hotelApi';
import homeApi from '../../../api/homeApi';
import { toast } from 'react-toastify';
import './HotelManagement.css';

const HotelManagement = () => {
  const navigate = useNavigate();
  const [hotelName, setHotelName] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  const [locations, setLocations] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    pageSize: 12
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLocations();
    fetchHotels(0);
  }, []);

  // Re-fetch when filters change (debounced for search text could be better, but simple effect here)
  useEffect(() => {
    fetchHotels(0);
  }, [locationFilter, categoryFilter, ratingFilter, statusFilter]);

  const fetchLocations = async () => {
    try {
      const response = await homeApi.getDropdownLocations();
      if (response.data && response.data.result) {
        setLocations(response.data.result);
      }
    } catch (error) {
      console.error("Failed to fetch locations:", error);
    }
  };

  const fetchHotels = async (page) => {
    setLoading(true);
    try {
      // Map params to match FilterHotel/hotelApi.searchHotels structure
      const params = {
        page: page,
        size: pagination.pageSize,
        name: hotelName,
        id: locationFilter, // Map locationFilter to 'id'
        hotelType: categoryFilter,
        minStarRating: ratingFilter, // Map ratingFilter to 'minStarRating'
        status: statusFilter
      };
      
      // Clean undefined/empty params
      Object.keys(params).forEach(key => (params[key] === '' || params[key] === null) && delete params[key]);

      // Use hotelApi.searchHotels instead of adminApi.getHotels
      const response = await hotelApi.searchHotels(params);
      
      if (response.data && response.data.result) {
        const { hotels, currentPage, totalPages, totalElements, pageSize } = response.data.result;
        setHotels(hotels || []);
        setPagination({
          currentPage: currentPage || 0,
          totalPages: totalPages || 0,
          totalElements: totalElements || 0,
          pageSize: pageSize || 12
        });
      } else {
        setHotels([]);
        setPagination({
            currentPage: 0,
            totalPages: 0,
            totalElements: 0,
            pageSize: 12
          });
      }
    } catch (error) {
      console.error("Failed to fetch hotels:", error);
      toast.error("Không thể tải danh sách khách sạn");
      setHotels([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchHotels(0);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < pagination.totalPages) {
      fetchHotels(newPage);
    }
  };

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedHotelId, setSelectedHotelId] = useState(null);

  const handleDeleteClick = (id) => {
    setSelectedHotelId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedHotelId) return;
    
    try {
      await adminApi.deleteHotel(selectedHotelId);
      toast.success("Xóa khách sạn thành công!");
      fetchHotels(pagination.currentPage);
      setShowDeleteModal(false);
      setSelectedHotelId(null);
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Xóa thất bại! Vui lòng thử lại.");
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setSelectedHotelId(null);
  };

  // Helper to render pagination pages
  const renderPaginationButtons = () => {
    const pages = [];
    const { currentPage, totalPages } = pagination;
    
    // Simple logic: show all or localized range. For infinite pages, logic should be smarter.
    // Here showing a simplified view centered around current page
    
    // Always show first
    if (totalPages > 0) {
        // Range optimization can be added here
        for (let i = 0; i < totalPages; i++) {
            // Show only first 3, last 3, and current +/- 1 if huge list
            // For now, keeping simple
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
            value={hotelName}
            onChange={(e) => setHotelName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>

        {/* Custom Location Dropdown */}
        <div className="custom-dropdown" onClick={() => document.getElementById('location-dropdown').classList.toggle('show')}>
          <div className="selected-value">
            {locationFilter ? locations.find(l => l.id == locationFilter)?.name : 'Địa điểm'}
            <i className="bi bi-chevron-down"></i>
          </div>
          <div id="location-dropdown" className="dropdown-menu-list">
             <div className="dropdown-header">Địa điểm</div>
             <div className="dropdown-items-container">
                <div 
                  className={`dropdown-item ${locationFilter === '' ? 'active' : ''}`}
                  onClick={() => setLocationFilter('')}
                >
                  Tất cả
                </div>
                {locations.map((loc) => (
                  <div 
                    key={loc.id} 
                    className={`dropdown-item ${locationFilter == loc.id ? 'active' : ''}`}
                    onClick={() => setLocationFilter(loc.id)}
                  >
                    {loc.name}
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Global Click Listener to close dropdown (simple implementation) */}
        {useEffect(() => {
          const closeDropdown = (e) => {
            if (!e.target.closest('.custom-dropdown')) {
               const dropdowns = document.getElementsByClassName('dropdown-menu-list');
               for (let i = 0; i < dropdowns.length; i++) {
                 dropdowns[i].classList.remove('show');
               }
            }
          };
          document.addEventListener('click', closeDropdown);
          return () => document.removeEventListener('click', closeDropdown);
        }, [])}

        <select className="filter-select" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="">Hạng mục</option>
          <option value="HOTEL">Hotel</option>
          <option value="RESORT">Resort</option>
          <option value="VILLA">Villa</option>
          <option value="APARTMENT">Căn hộ</option>
        </select>

        <select className="filter-select" value={ratingFilter} onChange={(e) => setRatingFilter(e.target.value)}>
          <option value="">Đánh giá</option>
          <option value="5">5 sao</option>
          <option value="4">4 sao trở lên</option>
          <option value="3">3 sao trở lên</option>
        </select>

        <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">Trạng thái</option>
          <option value="ACTIVE">Active</option>
          <option value="PENDING">Pending</option>
          <option value="DISABLED">Disabled</option>
        </select>
      </div>

      {/* Table */}
      <div className="table-container">
        {loading ? (
            <div className="text-center p-5">Loading...</div>
        ) : (
            <table className="hotels-table">
            <thead>
                <tr>
                <th>TÊN KHÁCH SẠN</th>
                <th>ĐỊA ĐIỂM</th>
                <th>HẠNG MỤC</th>
                <th>ĐÁNH GIÁ</th>
                <th>HÀNH ĐỘNG</th>
                </tr>
            </thead>
            <tbody>
                {hotels.map((hotel) => (
                <tr key={hotel.id}>
                    <td>
                    <div className="hotel-info">
                        <img 
                            src={hotel.thumbnail || 'https://via.placeholder.com/60x60'} 
                            className="hotel-image" 
                            alt={hotel.name}
                            onError={(e) => e.target.src = 'https://via.placeholder.com/60x60'}
                        />
                        <div>
                        <div className="hotel-name">{hotel.name}</div>
                        <div className="hotel-address-small">{hotel.address}</div>
                        </div>
                    </div>
                    </td>
                    <td>
                    <div className="location-info">
                        <div>{hotel.locationName}</div>
                    </div>
                    </td>
                    <td>
                    <span className="category-badge text-black">
                        {hotel.hotelType}
                    </span>
                    </td>
                    <td>
                    <div className="rating-info">
                        {hotel.starRating > 0 ? (
                        <>
                            <i className="bi bi-star-fill" style={{ color: '#fbbf24' }}></i>
                            <span className="rating-value">{hotel.starRating}</span>
                            <span className="review-count">({hotel.totalReviews})</span>
                        </>
                        ) : (
                        <span className="no-rating">-- (New)</span>
                        )}
                    </div>
                    </td>
                    <td>
                    <div className="action-buttons">
                        <button className="action-btn view-btn" title="Xem chi tiết" onClick={() => navigate(`/admin/hotels/edit/${hotel.id}`)}>
                        <i className="bi bi-eye"></i>
                        </button>
                        <button className="action-btn edit-btn" title="Chỉnh sửa" onClick={() => navigate(`/admin/hotels/edit/${hotel.id}`)}>
                        <i className="bi bi-pencil"></i>
                        </button>
                        <button className="action-btn delete-btn" title="Xóa" onClick={() => handleDeleteClick(hotel.id)}>
                        <i className="bi bi-trash"></i>
                        </button>
                    </div>
                    </td>
                </tr>
                ))}
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Xác nhận xóa</h3>
              <button className="close-btn" onClick={cancelDelete}>&times;</button>
            </div>
            <div className="modal-body">
              <p>Bạn có chắc chắn muốn xóa khách sạn này không? Hành động này không thể hoàn tác.</p>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={cancelDelete}>Hủy bỏ</button>
              <button className="btn-confirm-delete" onClick={confirmDelete}>Xóa khách sạn</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelManagement;
