import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import tourApi from '../../../api/tourApi';
import homeApi from '../../../api/homeApi';
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
  const [locations, setLocations] = useState([]);
  const [locationFilter, setLocationFilter] = useState('');
  const [durationFilter, setDurationFilter] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchLocations();
    fetchTours(0);
  }, []);

  // Re-fetch when filters change
  useEffect(() => {
    fetchTours(0);
  }, [locationFilter, durationFilter, priceFilter, statusFilter]);

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

  const fetchTours = async (page) => {
    setLoading(true);
    try {
      const params = {
        page: page,
        size: pagination.pageSize,
        title: searchTerm,
        destinationId: locationFilter,
        duration: durationFilter,
        priceRange: priceFilter,
        status: statusFilter
      };

      // Clean undefined/empty params
      Object.keys(params).forEach(key => (params[key] === '' || params[key] === null) && delete params[key]);

      const response = await tourApi.searchTours(params);
      
      console.log("Search Tours Response:", response.data);

      if (response.data && response.data.result) {
        const result = response.data.result;
        // Handle different response structures:
        // 1. Standard Page: { content, pageable... }
        // 2. Hotel-like: { tours, currentPage... }
        // 3. Raw List: [...]
        // 4. Custom: { result: [...] }

        let tourList = [];
        let pageInfo = {
          currentPage: 0,
          totalPages: 0,
          totalElements: 0,
          pageSize: 12
        };

        if (Array.isArray(result)) {
           // Case 3: Raw List
           tourList = result;
           pageInfo.totalElements = result.length;
           pageInfo.totalPages = Math.ceil(result.length / 12);
        } else if (result.content) {
           // Case 1: Standard Page
           tourList = result.content;
           pageInfo.currentPage = result.number !== undefined ? result.number : (result.pageable?.pageNumber || 0);
           pageInfo.totalPages = result.totalPages || 0;
           pageInfo.totalElements = result.totalElements || 0;
           pageInfo.pageSize = result.size || 12;
        } else if (result.tours) {
           // Case 2: Hotel-like structure
           tourList = result.tours;
           pageInfo.currentPage = result.currentPage || 0;
           pageInfo.totalPages = result.totalPages || 0;
           pageInfo.totalElements = result.totalElements || 0;
           pageInfo.pageSize = result.pageSize || 12;
        } else if (result.result) {
           // Recursive result check
            if (Array.isArray(result.result)) {
                tourList = result.result;
            }
        }

        // Fallback: If totalElements is 0 but we have items, use length
        if (tourList.length > 0 && pageInfo.totalElements === 0) {
            pageInfo.totalElements = tourList.length;
            pageInfo.totalPages = Math.ceil(tourList.length / (pageInfo.pageSize || 12));
        }

        setTours(tourList || []);
        setPagination(pageInfo);
      } else {
        setTours([]);
        setPagination({
          currentPage: 0,
          totalPages: 0,
          totalElements: 0,
          pageSize: 12
        });
      }
    } catch (error) {
      console.error("Failed to fetch tours:", error);
      // toast.error("Không thể tải danh sách tour"); // Optional: suppress default toast if just searching
      setTours([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchTours(0);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < pagination.totalPages) {
      fetchTours(newPage);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  // Helper to render pagination pages
  // Delete Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTourId, setSelectedTourId] = useState(null);

  const handleDeleteClick = (id) => {
    setSelectedTourId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedTourId) return;
    
    try {
      await tourApi.deleteTour(selectedTourId);
      toast.success("Xóa tour thành công!");
      fetchTours(pagination.currentPage);
      setShowDeleteModal(false);
      setSelectedTourId(null);
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Xóa thất bại! Vui lòng thử lại.");
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setSelectedTourId(null);
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

  // Global Click Listener to close dropdown
  useEffect(() => {
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
  }, []);

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
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>

        {/* Custom Location Dropdown */}
        <div className="custom-dropdown" onClick={() => document.getElementById('tour-location-dropdown').classList.toggle('show')}>
          <div className="selected-value">
            {locationFilter ? locations.find(l => l.id == locationFilter)?.name : 'Địa điểm'}
            <i className="bi bi-chevron-down"></i>
          </div>
          <div id="tour-location-dropdown" className="dropdown-menu-list">
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

        <select className="filter-select" value={durationFilter} onChange={(e) => setDurationFilter(e.target.value)}>
          <option value="">Thời lượng</option>
          <option value="1 ngày">1 ngày</option>
          <option value="2 ngày 1 đêm">2 ngày 1 đêm</option>
          <option value="3 ngày 2 đêm">3 ngày 2 đêm</option>
          <option value="4 ngày 3 đêm">4 ngày 3 đêm</option>
          <option value="5 ngày 4 đêm">5 ngày 4 đêm</option>
        </select>

        <select className="filter-select" value={priceFilter} onChange={(e) => setPriceFilter(e.target.value)}>
          <option value="">Giá</option>
          <option value="0-2000000">Dưới 2 triệu</option>
          <option value="2000000-5000000">2-5 triệu</option>
          <option value="5000000-10000000">5-10 triệu</option>
          <option value="10000000-100000000">Trên 10 triệu</option>
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
                      <button className="action-btn delete-btn" title="Xóa" onClick={() => handleDeleteClick(tour.id)}>
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Xác nhận xóa</h3>
              <button className="close-btn" onClick={cancelDelete}>&times;</button>
            </div>
            <div className="modal-body">
              <p>Bạn có chắc chắn muốn xóa tour này không? Hành động này không thể hoàn tác.</p>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={cancelDelete}>Hủy bỏ</button>
              <button className="btn-confirm-delete" onClick={confirmDelete}>Xóa tour</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TourManagement;
