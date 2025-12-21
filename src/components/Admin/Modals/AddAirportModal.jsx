import React, { useState } from 'react';
import './AddAirportModal.css';

const AddAirportModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    location: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    handleClose();
  };

  const handleClose = () => {
    setFormData({ name: '', code: '', location: '' });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Thêm sân bay</h2>
          <button className="close-btn" onClick={handleClose}>
            <i className="bi bi-x"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-group">
            <label>Tên sân bay</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Nhập tên sân bay"
              required
            />
          </div>

          <div className="form-group">
            <label>Mã sân bay</label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleInputChange}
              placeholder="SGN, HAN, DAD..."
              required
              maxLength="3"
              style={{ textTransform: 'uppercase' }}
            />
          </div>

          <div className="form-group">
            <label>Địa điểm</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="Nhập địa điểm"
              required
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={handleClose}>
              Huỷ
            </button>
            <button type="submit" className="save-btn">
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAirportModal;
