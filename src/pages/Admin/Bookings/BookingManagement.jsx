import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import adminBookingApi from '../../../api/adminBookingApi';
import BookingDetailModal from '../../../components/Admin/Modals/BookingDetailModal';
import './BookingManagement.css';

const BookingManagement = () => {
    const [bookings, setBookings] = useState([]);
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [activeTab, setActiveTab] = useState('ALL');
    const [isLoading, setIsLoading] = useState(false);
    
    // Detail Modal State
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedBookingId, setSelectedBookingId] = useState(null);
    
    // Pagination (Simple client-side for now)
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const fetchBookings = async () => {
        setIsLoading(true);
        try {
            const res = await adminBookingApi.getAll();
            const data = res.data;
            // Handle { code: 1000, message: "...", result: [...] }
            const list = data?.result || (Array.isArray(data) ? data : []) || [];
            
            // Sort by createdAt desc
            list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            
            setBookings(list);
            setFilteredBookings(list);
        } catch (error) {
            console.error("Failed to fetch bookings:", error);
            // toast.error("Không thể tải danh sách đơn hàng"); 
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    useEffect(() => {
        if (activeTab === 'ALL') {
             setFilteredBookings(bookings);
        } else {
             setFilteredBookings(bookings.filter(b => b.status === activeTab));
        }
        setCurrentPage(1);
    }, [activeTab, bookings]);

    // Handlers
    const handleViewDetail = (id) => {
        setSelectedBookingId(id);
        setShowDetailModal(true);
    };

    const handleUpdateStatus = async (id, newStatus) => {
        // Translation for confirm message
        const actionMap = {
            'CONFIRMED': 'xác nhận',
            'CANCELLED': 'hủy',
            'REJECTED': 'từ chối',
            'PENDING': 'đưa về chờ xử lý'
        };
        const actionName = actionMap[newStatus] || 'cập nhật';

        if (window.confirm(`Bạn có chắc chắn muốn ${actionName} đơn này?`)) {
            try {
                await adminBookingApi.updateStatus(id, newStatus);
                toast.success(`Đã ${actionName} đơn hàng thành công`);
                fetchBookings();
            } catch (error) {
                console.error("Update status error:", error);
                toast.error(`Lỗi khi ${actionName} đơn hàng`);
            }
        }
    };

    // Formatters
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleString('vi-VN');
    };

    const getStatusBadge = (status) => {
        const s = status ? status.toUpperCase() : '';
        switch (s) {
            case 'CONFIRMED': return 'badge-success';
            case 'PAID': return 'badge-success'; 
            case 'PENDING': return 'badge-warning';
            case 'CANCELLED': return 'badge-danger'; 
            case 'REJECTED': return 'badge-danger';
            case 'COMPLETED': return 'badge-primary';
            default: return 'badge-secondary';
        }
    };
    
    const getServiceTypeIcon = (type) => {
        switch (type) {
            case 'FLIGHT': return <i className="bi bi-airplane-fill"></i>;
            case 'HOTEL': return <i className="bi bi-building-fill"></i>;
            case 'TOUR': return <i className="bi bi-globe-americas"></i>;
            default: return <i className="bi bi-tag-fill"></i>;
        }
    };

    // Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredBookings.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);

    return (
        <div className="booking-management">
             <div className="breadcrumb">
                <Link to="/admin">Dashboard</Link>
                <span className="separator">{'>'}</span>
                <span className="current">Quản lý đặt chỗ</span>
            </div>

            <div className="page-header">
                <div className="header-left">
                    <h1>Quản lý Đặt chỗ</h1>
                    <p className="subtitle">Theo dõi và xử lý các đơn đặt vé máy bay, khách sạn, tour</p>
                </div>
            </div>

            <div className="management-section">
                {/* Tabs */}
                <div className="status-tabs">
                     {[
                        { id: 'ALL', label: 'Tất cả' },
                        { id: 'PENDING', label: 'Chờ xử lý' },
                        { id: 'CONFIRMED', label: 'Đã xác nhận' },
                        { id: 'CANCELLED', label: 'Đã hủy' },
                        { id: 'REJECTED', label: 'Từ chối' }
                    ].map(tab => (
                        <button 
                            key={tab.id} 
                            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="table-container">
                    <table className="bookings-table">
                        <thead>
                            <tr>
                                <th>MÃ ĐƠN</th>
                                <th>KHÁCH HÀNG</th>
                                <th>DỊCH VỤ</th>
                                <th>NGÀY ĐẶT</th>
                                <th>TỔNG TIỀN</th>
                                <th>TRẠNG THÁI</th>
                                <th>HÀNH ĐỘNG</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.length === 0 ? (
                                <tr><td colSpan="7" className="text-center">Không có đơn hàng nào</td></tr>
                            ) : (
                                currentItems.map(booking => (
                                    <tr key={booking.id}>
                                        <td className="booking-code">{booking.bookingCode}</td>
                                        <td>
                                            <div className="customer-info">
                                                <div className="customer-name">{booking.contactName || '---'}</div>
                                                <div className="customer-contact">{booking.contactPhone || ''}</div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="service-info">
                                                <span className="service-icon">{getServiceTypeIcon(booking.type)}</span>
                                                <span className="service-name">
                                                    {booking.type}
                                                    {booking.service?.name && <span style={{display:'block', fontSize:'11px', color:'#888'}}>{booking.service.name}</span>}
                                                </span>
                                            </div>
                                        </td>
                                        <td>{formatDate(booking.createdAt)}</td>
                                        <td className="price">{formatCurrency(booking.finalPrice || booking.totalPrice)}</td>
                                        <td>
                                            <span className={`status-badge ${getStatusBadge(booking.status)}`}>
                                                {booking.status}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="action-buttons">
                                                <button 
                                                    className="action-btn view-btn" 
                                                    title="Xem chi tiết"
                                                    onClick={() => handleViewDetail(booking.id)}
                                                >
                                                    <i className="bi bi-eye"></i>
                                                </button>
                                                
                                                {/* Action Buttons based on status */}
                                                {booking.status === 'PENDING' && (
                                                    <>
                                                        <button 
                                                            className="action-btn confirm-btn" 
                                                            title="Xác nhận"
                                                            onClick={() => handleUpdateStatus(booking.id, 'CONFIRMED')}
                                                        >
                                                            <i className="bi bi-check-lg"></i>
                                                        </button>
                                                        <button 
                                                            className="action-btn cancel-btn" 
                                                            title="Hủy đơn"
                                                            onClick={() => handleUpdateStatus(booking.id, 'CANCELLED')}
                                                        >
                                                            <i className="bi bi-x-lg"></i>
                                                        </button>
                                                    </>
                                                )}

                                               {/* Allow canceling confirmed bookings */}
                                                {booking.status === 'CONFIRMED' && (
                                                     <button 
                                                        className="action-btn cancel-btn" 
                                                        title="Hủy đơn"
                                                        onClick={() => handleUpdateStatus(booking.id, 'CANCELLED')}
                                                    >
                                                        <i className="bi bi-x-lg"></i>
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                
                 {/* Pagination */}
                 {totalPages > 1 && (
                    <div className="pagination-container">
                        <div className="pagination-controls">
                            <button 
                                className="page-btn" 
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(prev => prev - 1)}
                            >
                                <i className="bi bi-chevron-left"></i>
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => (
                                <button 
                                    key={i + 1} 
                                    className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`}
                                    onClick={() => setCurrentPage(i + 1)}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button 
                                className="page-btn" 
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(prev => prev + 1)}
                            >
                                <i className="bi bi-chevron-right"></i>
                            </button>
                        </div>
                    </div>
                 )}
            </div>

            {/* Detail Modal */}
            <BookingDetailModal 
                isOpen={showDetailModal}
                onClose={() => setShowDetailModal(false)}
                bookingId={selectedBookingId}
            />
        </div>
    );
};

export default BookingManagement;
