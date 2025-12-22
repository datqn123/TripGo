import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import adminAccountApi from '../../../api/adminAccountApi';
import './CustomerManagement.css';

const CustomerManagement = () => {
    const [accounts, setAccounts] = useState([]);
    const [filteredAccounts, setFilteredAccounts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const fetchAccounts = async () => {
        setIsLoading(true);
        try {
            const res = await adminAccountApi.getAll();
            const data = res.data;
            const list = data?.result || (Array.isArray(data) ? data : []) || [];
            
            // Sort by simple logic or createdAt if available
            list.sort((a, b) => b.id - a.id);
            
            setAccounts(list);
            setFilteredAccounts(list);
        } catch (error) {
            console.error("Failed to fetch accounts:", error);
            // toast.error("Không thể tải danh sách tài khoản");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAccounts();
    }, []);

    // Filter by search
    useEffect(() => {
        if (!searchTerm) {
            setFilteredAccounts(accounts);
        } else {
            const lowerInfo = searchTerm.toLowerCase();
            const filtered = accounts.filter(acc => 
                (acc.fullName && acc.fullName.toLowerCase().includes(lowerInfo)) ||
                (acc.email && acc.email.toLowerCase().includes(lowerInfo)) ||
                (acc.phoneNumber && acc.phoneNumber.includes(lowerInfo))
            );
            setFilteredAccounts(filtered);
        }
        setCurrentPage(1);
    }, [searchTerm, accounts]);

    // Handlers
    const handleStatusChange = async (id, currentStatus) => {
        const newStatus = currentStatus === 'ACTIVE' ? 'LOCKED' : 'ACTIVE';
        const actionName = newStatus === 'LOCKED' ? 'khóa' : 'mở khóa';
        
        if (window.confirm(`Bạn có chắc chắn muốn ${actionName} tài khoản này?`)) {
            try {
                await adminAccountApi.updateStatus(id, newStatus);
                toast.success(`Đã ${actionName} tài khoản thành công`);
                fetchAccounts();
            } catch (error) {
                console.error("Update status error:", error);
                toast.error(`Lỗi khi ${actionName} tài khoản`);
            }
        }
    };

    const handleRoleChange = async (id, newRole) => {
        if (window.confirm(`Bạn có chắc chắn muốn chuyển quyền thành ${newRole}?`)) {
            try {
                await adminAccountApi.updateRole(id, newRole);
                toast.success("Cập nhật quyền thành công");
                fetchAccounts();
            } catch (error) {
                console.error("Update role error:", error);
                toast.error("Lỗi khi cập nhật quyền");
            }
        }
    };

    // Formatters
    const formatDate = (dateString) => {
        if (!dateString) return '---';
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    // Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredAccounts.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage);

    return (
        <div className="customer-management">
            {/* Breadcrumb */}
            <div className="breadcrumb">
                <Link to="/admin">Dashboard</Link>
                <span className="separator">{'>'}</span>
                <span className="current">Quản lý tài khoản</span>
            </div>

            {/* Header */}
            <div className="page-header">
                <div className="header-left">
                    <h1>Quản lý Tài khoản</h1>
                    <p className="subtitle">Quản lý người dùng, phân quyền và trạng thái hoạt động</p>
                </div>
            </div>

            {/* Filters */}
            <div className="filters-section">
                <div className="search-box">
                    <i className="bi bi-search"></i>
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo tên, email, sđt..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                {/* Add more filters if needed later */}
            </div>

            {/* Table */}
            <div className="table-container">
                <table className="customers-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>HỌ TÊN</th>
                            <th>LIÊN HỆ</th>
                            <th>VAI TRÒ</th>
                            <th>TRẠNG THÁI</th>
                            <th>NGÀY TẠO</th>
                            <th>HÀNH ĐỘNG</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                           <tr><td colSpan="7" className="text-center">Đang tải...</td></tr>
                        ) : currentItems.length === 0 ? (
                            <tr><td colSpan="7" className="text-center">Không tìm thấy tài khoản nào</td></tr>
                        ) : (
                            currentItems.map(acc => (
                                <tr key={acc.id}>
                                    <td className="customer-id">#{acc.id}</td>
                                    <td>
                                        <div className="customer-name">{acc.fullName || '---'}</div>
                                    </td>
                                    <td>
                                        <div className="contact-info">
                                            <div className="email"><i className="bi bi-envelope"></i> {acc.email}</div>
                                            {acc.phoneNumber && <div className="phone"><i className="bi bi-telephone"></i> {acc.phoneNumber}</div>}
                                        </div>
                                    </td>
                                    <td>
                                        <select 
                                            className="role-select" 
                                            value={acc.roles && acc.roles[0]} 
                                            onChange={(e) => handleRoleChange(acc.id, e.target.value)}
                                        >
                                            <option value="USER">USER</option>
                                            <option value="STAFF">STAFF</option>
                                            <option value="ADMIN">ADMIN</option>
                                        </select>
                                    </td>
                                    <td>
                                        <span className={`status-badge ${acc.status === 'ACTIVE' ? 'active' : 'locked'}`}>
                                            {acc.status === 'ACTIVE' ? 'Hoạt động' : 'Đã khóa'}
                                        </span>
                                    </td>
                                    <td>{formatDate(acc.createdAt)}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <button 
                                                className={`action-btn ${acc.status === 'ACTIVE' ? 'lock-btn' : 'unlock-btn'}`}
                                                title={acc.status === 'ACTIVE' ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
                                                onClick={() => handleStatusChange(acc.id, acc.status)}
                                            >
                                                <i className={`bi ${acc.status === 'ACTIVE' ? 'bi-lock' : 'bi-unlock'}`}></i>
                                            </button>
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
    );
};

export default CustomerManagement;
