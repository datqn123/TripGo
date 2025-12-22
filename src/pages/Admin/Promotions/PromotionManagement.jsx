import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import adminVoucherApi from '../../../api/adminVoucherApi';
import './PromotionManagement.css';

const PromotionManagement = () => {
    const [vouchers, setVouchers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    
    // Form State
    const [formData, setFormData] = useState({
        id: null,
        code: '',
        name: '',
        description: '',
        discountType: 'PERCENTAGE', // PERCENTAGE or FIXED_AMOUNT
        discountValue: 0,
        maxDiscountAmount: 0,
        startDate: '', // Added startDate
        endDate: '',
        scope: 'GLOBAL', // Default scope
        
        // Notification fields
        sendNotification: false,
        notificationTitle: '',
        notificationMessage: ''
    });

    const fetchVouchers = async () => {
        setIsLoading(true);
        try {
            const res = await adminVoucherApi.getAll();
            const data = res.data;
            setVouchers(data?.result || (Array.isArray(data) ? data : []) || []);
        } catch (error) {
            console.error("Failed to fetch vouchers", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchVouchers();
    }, []);

    const resetForm = () => {
        setFormData({
            id: null,
            code: '',
            name: '',
            description: '',
            discountType: 'PERCENTAGE',
            discountValue: 0,
            maxDiscountAmount: 0,
            startDate: '', // Reset startDate
            endDate: '',
            scope: 'GLOBAL',
            sendNotification: false,
            notificationTitle: '',
            notificationMessage: ''
        });
        setIsEditing(false);
    };

    const handleOpenModal = (voucher = null) => {
        if (voucher) {
            setIsEditing(true);
            setFormData({
                ...voucher,
                startDate: voucher.startDate ? voucher.startDate.split('T')[0] : '', // Parse startDate
                endDate: voucher.endDate ? voucher.endDate.split('T')[0] : '',
                // Reset notification fields for edit (usually don't resend notif on edit, but optional)
                sendNotification: false,
                notificationTitle: '',
                notificationMessage: ''
            });
        } else {
            resetForm();
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Prepare payload - Clean unrelated fields
            const payload = { ...formData };
            
            // Format startDate to LocalDateTime (YYYY-MM-DDTHH:mm:ss)
            if (payload.startDate && payload.startDate.length === 10) {
                 payload.startDate = `${payload.startDate}T00:00:00`;
            }

            // Format endDate to LocalDateTime (YYYY-MM-DDTHH:mm:ss)
            if (payload.endDate && payload.endDate.length === 10) {
                 payload.endDate = `${payload.endDate}T23:59:59`;
            }

            // Remove 'id' and 'status' from payload as strictly requested
            delete payload.id;
            delete payload.status; 
            delete payload.createdAt;
            delete payload.updatedAt;

            if (isEditing) {
                await adminVoucherApi.update(formData.id, payload);
                toast.success('Cập nhật voucher thành công');
            } else {
                await adminVoucherApi.create(payload);
                toast.success('Tạo voucher thành công');
            }
            setShowModal(false);
            fetchVouchers();
        } catch (error) {
            console.error("Save error:", error);
            const errMsg = error.response?.data?.message || 'Lỗi khi lưu voucher';
            toast.error(errMsg);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa voucher này?')) {
            try {
                await adminVoucherApi.delete(id);
                toast.success('Xóa voucher thành công');
                fetchVouchers();
            } catch (error) {
                console.error("Delete error:", error);
                toast.error('Lỗi khi xóa voucher');
            }
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    return (
        <div className="promotion-management">
             <div className="breadcrumb">
                <Link to="/admin">Dashboard</Link>
                <span className="separator">{'>'}</span>
                <span className="current">Quản lý Voucher</span>
            </div>

            <div className="page-header">
                <div>
                    <h1>Danh sách Voucher</h1>
                    <p className="subtitle">Quản lý các mã giảm giá và chương trình khuyến mãi</p>
                </div>
                <button className="add-btn" onClick={() => handleOpenModal()}>
                    <i className="bi bi-plus-lg"></i> Thêm Voucher
                </button>
            </div>

            {/* Notification Hint */}
            <div className="alert alert-info py-2 small mb-4">
                <i className="bi bi-info-circle me-2"></i>
                Khi tạo voucher mới, bạn có thể gửi thông báo ngay lập tức đến toàn bộ người dùng 
                thông qua kênh WebSocket công khai.
            </div>

            <div className="table-container">
                <table className="promotions-table">
                    <thead>
                        <tr>
                            <th>MÃ VOUCHER</th>
                            <th>TÊN CHƯƠNG TRÌNH</th>
                            <th>GIẢM GIÁ</th>
                            <th>THỜI GIAN</th>
                            <th>LOẠI SCOPE</th>
                            <th>TRẠNG THÁI</th>
                            <th>HÀNH ĐỘNG</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr><td colSpan="7" className="text-center">Đang tải...</td></tr>
                        ) : vouchers.length === 0 ? (
                            <tr><td colSpan="7" className="text-center">Chưa có voucher nào</td></tr>
                        ) : (
                            vouchers.map(v => (
                                <tr key={v.id}>
                                    <td className="voucher-code">{v.code}</td>
                                    <td>
                                        <div className="voucher-name">{v.name}</div>
                                        <div className="voucher-desc">{v.description}</div>
                                    </td>
                                    <td>
                                        <div className="discount-info">
                                            <span className="value">
                                                {v.discountType === 'PERCENTAGE' ? `${v.discountValue}%` : formatCurrency(v.discountValue)}
                                            </span>
                                            {v.maxDiscountAmount > 0 && (
                                                <div className="max-value">Tối đa: {formatCurrency(v.maxDiscountAmount)}</div>
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="small text-muted">
                                            {v.startDate ? new Date(v.startDate).toLocaleDateString('vi-VN') : '...'} - 
                                            {v.endDate ? new Date(v.endDate).toLocaleDateString('vi-VN') : '...'}
                                        </div>
                                    </td>
                                    <td>
                                        <span className="badge bg-light text-dark border">
                                            {v.scope === 'GLOBAL' ? 'Toàn hệ thống' : v.scope}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`status-badge ${v.status === 'ACTIVE' ? 'active' : 'inactive'}`}>
                                            {v.status === 'ACTIVE' ? 'Hoạt động' : 'Đã hết hạn'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button className="action-btn edit-btn" onClick={() => handleOpenModal(v)}>
                                                <i className="bi bi-pencil"></i>
                                            </button>
                                            <button className="action-btn delete-btn" onClick={() => handleDelete(v.id)}>
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>{isEditing ? 'Cập nhật Voucher' : 'Thêm Voucher mới'}</h3>
                            <button className="close-btn" onClick={() => setShowModal(false)}><i className="bi bi-x-lg"></i></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                {/* Basic Info */}
                                <div className="section-label-sm text-primary mb-3 fw-bold">Thông tin cơ bản</div>
                                
                                <div className="form-group mb-3">
                                    <label>Mã Voucher <span className="text-danger">*</span></label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        value={formData.code}
                                        onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})}
                                        required 
                                        placeholder="VD: SUMMER2024"
                                    />
                                </div>
                                <div className="form-group mb-3">
                                    <label>Tên chương trình <span className="text-danger">*</span></label>
                                    <input 
                                        type="text" 
                                        className="form-control"
                                        value={formData.name}
                                        onChange={e => setFormData({...formData, name: e.target.value})}
                                        required
                                        placeholder="VD: Khuyến mãi mùa hè"
                                    />
                                </div>
                                <div className="form-group mb-3">
                                    <label>Mô tả</label>
                                    <textarea 
                                        className="form-control"
                                        value={formData.description}
                                        onChange={e => setFormData({...formData, description: e.target.value})}
                                        rows="2"
                                    ></textarea>
                                </div>
                                
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label>Loại giảm giá</label>
                                        <select 
                                            className="form-control"
                                            value={formData.discountType}
                                            onChange={e => setFormData({...formData, discountType: e.target.value})}
                                        >
                                            <option value="PERCENTAGE">Theo phần trăm (%)</option>
                                            <option value="FIXED_AMOUNT">Số tiền cố định (VND)</option>
                                        </select>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label>Giá trị giảm <span className="text-danger">*</span></label>
                                        <input 
                                            type="number" 
                                            className="form-control"
                                            value={formData.discountValue}
                                            onChange={e => setFormData({...formData, discountValue: parseFloat(e.target.value)})}
                                            required
                                        />
                                    </div>
                                </div>
                                
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label>Giảm tối đa (VND)</label>
                                        <input 
                                            type="number" 
                                            className="form-control"
                                            value={formData.maxDiscountAmount}
                                            onChange={e => setFormData({...formData, maxDiscountAmount: parseFloat(e.target.value)})}
                                        />
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label>Ngày bắt đầu <span className="text-danger">*</span></label>
                                        <input 
                                            type="date" 
                                            className="form-control"
                                            value={formData.startDate}
                                            onChange={e => setFormData({...formData, startDate: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label>Ngày hết hạn <span className="text-danger">*</span></label>
                                        <input 
                                            type="date" 
                                            className="form-control"
                                            value={formData.endDate}
                                            onChange={e => setFormData({...formData, endDate: e.target.value})}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-group mb-4">
                                    <label>Phạm vi áp dụng (Scope)</label>
                                    <select 
                                        className="form-control"
                                        value={formData.scope}
                                        onChange={e => setFormData({...formData, scope: e.target.value})}
                                    >
                                        <option value="GLOBAL">Toàn bộ hệ thống (GLOBAL)</option>
                                        <option value="HOTEL">Chỉ Khách sạn (HOTEL)</option>
                                        <option value="FLIGHT">Chỉ Máy bay (FLIGHT)</option>
                                        <option value="TOUR">Chỉ Tour (TOUR)</option>
                                    </select>
                                </div>

                                {/* Notification Options */}
                                {!isEditing && (
                                    <div className="notification-options p-3 bg-light border rounded">
                                        <div className="form-check form-switch mb-3">
                                            <input 
                                                className="form-check-input" 
                                                type="checkbox" 
                                                id="sendNotifCheck"
                                                checked={formData.sendNotification}
                                                onChange={e => setFormData({...formData, sendNotification: e.target.checked})}
                                            />
                                            <label className="form-check-label fw-bold" htmlFor="sendNotifCheck">
                                                Gửi thông báo cho người dùng?
                                            </label>
                                        </div>

                                        {formData.sendNotification && (
                                            <>
                                                <div className="form-group mb-2">
                                                    <label className="small">Tiêu đề thông báo</label>
                                                    <input 
                                                        type="text" 
                                                        className="form-control form-control-sm"
                                                        value={formData.notificationTitle}
                                                        onChange={e => setFormData({...formData, notificationTitle: e.target.value})}
                                                        placeholder="VD: Săn Voucher Giờ Vàng!"
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label className="small">Nội dung thông báo</label>
                                                    <textarea 
                                                        className="form-control form-control-sm"
                                                        value={formData.notificationMessage}
                                                        onChange={e => setFormData({...formData, notificationMessage: e.target.value})}
                                                        placeholder="VD: Nhập mã TEST50 giảm ngay 50%..."
                                                        rows="2"
                                                    ></textarea>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Hủy</button>
                                <button type="submit" className="btn-save">Lưu Voucher</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PromotionManagement;
