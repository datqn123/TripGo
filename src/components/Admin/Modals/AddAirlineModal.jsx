import React, { useState } from 'react';
import './AddAirlineModal.css';

const AddAirlineModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    logo: null
  });

  const [preview, setPreview] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, logo: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    handleClose();
  };

  const handleClose = () => {
    setFormData({ name: '', code: '', logo: null });
    setPreview(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Thêm hãng hàng không mới</h2>
          <button className="close-btn" onClick={handleClose}>
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
            <label>Hệ hãng bay</label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleInputChange}
              placeholder="VJ, VJ, VNA"
              required
            />
          </div>

          <div className="form-group">
            <label>Logo</label>
            <div className="logo-upload-area">
              <input
                type="file"
                id="airline-logo"
                accept="image/png, image/jpeg, image/gif"
                onChange={handleLogoUpload}
                hidden
              />
              <label htmlFor="airline-logo" className="upload-box">
                {preview ? (
                  <img src={preview} alt="Logo preview" className="logo-preview" />
                ) : (
                  <>
                    <i className="bi bi-cloud-arrow-up upload-icon"></i>
                    <p className="upload-text">Tải ảnh lên</p>
                  </>
                )}
              </label>
              <p className="upload-hint">PNG, JPG, GIF tối đa 1MB. Tỉ lệ là 1:1</p>
            </div>
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

export default AddAirlineModal;
