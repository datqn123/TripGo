import React, { useState, useEffect } from 'react';
import axiosClient from '../../../api/axiosClient';
import { PUBLIC_API } from '../../../api/config';
import './AddAirportModal.css';

const AddAirportModal = ({ isOpen, onClose, onSave, airport, isLoading }) => {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    locationId: ''
  });
  
  const [locations, setLocations] = useState([]);

  // Fetch locations
  useEffect(() => {
    if (isOpen) {
        const fetchLocations = async () => {
            try {
                const res = await axiosClient.get(PUBLIC_API.DROPDOWN_LOCATIONS);
                // Axios returns the full response object, so data is in res.data
                const responseBody = res.data || res; 
                const data = responseBody.result || responseBody;
                setLocations(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Failed to fetch locations", error);
                setLocations([]); // Fallback to empty array
            }
        };
        fetchLocations();
    }
  }, [isOpen]);

  // Populate data when editing
  useEffect(() => {
    if (airport && isOpen) {
      setFormData({
        name: airport.name || '',
        code: airport.code || '',
        locationId: airport.location?.id || ''
      });
    } else if (!isOpen) {
        setFormData({ name: '', code: '', locationId: '' });
    }
  }, [airport, isOpen]);

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
    // Modal will be closed by parent after success
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{airport ? 'Cập nhật sân bay' : 'Thêm sân bay mới'}</h2>
          <button className="close-btn" onClick={onClose}>
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
            <label>Mã sân bay (Code)</label>
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
            <label>Địa điểm (Tỉnh/Thành phố)</label>
            <div className="select-wrapper">
                <select
                    name="locationId"
                    value={formData.locationId}
                    onChange={handleInputChange}
                    required
                    className="form-select"
                >
                    <option value="">-- Chọn địa điểm --</option>
                    {locations.map(loc => (
                        <option key={loc.id} value={loc.id}>
                            {loc.name}
                        </option>
                    ))}
                </select>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose} disabled={isLoading}>
              Huỷ
            </button>
            <button type="submit" className="save-btn" disabled={isLoading}>
              {isLoading ? 'Đang lưu...' : (airport ? 'Cập nhật' : 'Lưu')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAirportModal;
