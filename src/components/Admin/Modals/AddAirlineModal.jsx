import React, { useState } from 'react';
import './AddAirlineModal.css';

const AddAirlineModal = ({ isOpen, onClose, onSave, airline, isLoading }) => {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    logoUrl: ''
  });

  // Populate data when editing
  React.useEffect(() => {
    if (airline && isOpen) {
      setFormData({
        name: airline.name || '',
        code: airline.code || '',
        logoUrl: airline.logoUrl || ''
      });
    } else if (!isOpen) {
        // Reset when closed
        setFormData({ name: '', code: '', logoUrl: '' });
    }
  }, [airline, isOpen]);

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
    // Don't close immediately, let parent handle success
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{airline ? 'Cập nhật hãng hàng không' : 'Thêm hãng hàng không mới'}</h2>
          <button className="close-btn" onClick={onClose}>
            <i className="bi bi-x"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-group">
            <label>Tên hãng hàng không</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Nhập tên hãng"
              required
            />
          </div>

          <div className="form-group">
            <label>Mã hãng bay (Code)</label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleInputChange}
              placeholder="VD: VJ, VN, QH"
              required
            />
          </div>

          <div className="form-group">
            <label>Logo URL</label>
            <input
              type="url"
              name="logoUrl"
              value={formData.logoUrl}
              onChange={handleInputChange}
              placeholder="https://example.com/logo.png"
              required
            />
          </div>

          {formData.logoUrl && (
             <div className="form-group" style={{ textAlign: 'center' }}>
                 <p>Preview:</p>
                 <img 
                    src={formData.logoUrl} 
                    alt="Logo Preview" 
                    style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'contain', border: '1px solid #ddd', borderRadius: '4px', padding: '5px' }} 
                    onError={(e) => {e.target.style.display = 'none'}}
                 />
             </div>
          )}

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose} disabled={isLoading}>
              Huỷ
            </button>
            <button type="submit" className="save-btn" disabled={isLoading}>
              {isLoading ? 'Đang lưu...' : (airline ? 'Cập nhật' : 'Lưu')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAirlineModal;
