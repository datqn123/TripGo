import React, { useState } from 'react';
import './AddFlightModal.css';

const AddFlightModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    // Flight Info
    flightNumber: '',
    airline: '',
    departureAirport: '',
    arrivalAirport: '',
    departureDate: '',
    departureTime: '',
    arrivalDate: '',
    arrivalTime: '',
    
    // Economy Class
    economySeats: '',
    economyPrice: '',
    economyBaggage: '',
    
    // Standard Class
    standardSeats: '',
    standardPrice: '',
    standardBaggage: '',
    
    // Economy Flex Class
    economyFlexSeats: '',
    economyFlexPrice: '',
    economyFlexBaggage: ''
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
    setFormData({
      flightNumber: '',
      airline: '',
      departureAirport: '',
      arrivalAirport: '',
      departureDate: '',
      departureTime: '',
      arrivalDate: '',
      arrivalTime: '',
      economySeats: '',
      economyPrice: '',
      economyBaggage: '',
      standardSeats: '',
      standardPrice: '',
      standardBaggage: '',
      economyFlexSeats: '',
      economyFlexPrice: '',
      economyFlexBaggage: ''
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content flight-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <button className="back-btn" onClick={handleClose}>
            <i className="bi bi-arrow-left"></i>
            Thêm chuyến bay mới
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          {/* Flight Information */}
          <div className="form-section">
            <h3 className="section-title">Thông tin chuyến bay</h3>
            
            <div className="form-grid">
              <div className="form-group">
                <label>Mã chuyến bay</label>
                <input
                  type="text"
                  name="flightNumber"
                  value={formData.flightNumber}
                  onChange={handleInputChange}
                  placeholder="VJ-123456"
                  required
                />
              </div>

              <div className="form-group">
                <label>Hãng hàng không</label>
                <input
                  type="text"
                  name="airline"
                  value={formData.airline}
                  onChange={handleInputChange}
                  placeholder="Vietnam Airline"
                  required
                />
              </div>

              <div className="form-group">
                <label>Sân bay đi</label>
                <input
                  type="text"
                  name="departureAirport"
                  value={formData.departureAirport}
                  onChange={handleInputChange}
                  placeholder="SGN - Tân Sơn Nhất"
                  required
                />
              </div>

              <div className="form-group">
                <label>Sân bay đến</label>
                <input
                  type="text"
                  name="arrivalAirport"
                  value={formData.arrivalAirport}
                  onChange={handleInputChange}
                  placeholder="HAN - Nội Bài"
                  required
                />
              </div>

              <div className="form-group">
                <label>Ngày khởi hành</label>
                <input
                  type="date"
                  name="departureDate"
                  value={formData.departureDate}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Giờ khởi hành</label>
                <input
                  type="time"
                  name="departureTime"
                  value={formData.departureTime}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Ngày đến</label>
                <input
                  type="date"
                  name="arrivalDate"
                  value={formData.arrivalDate}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Giờ đến</label>
                <input
                  type="time"
                  name="arrivalTime"
                  value={formData.arrivalTime}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* Ticket Classes & Pricing */}
          <div className="form-section">
            <h3 className="section-title">Hạng vé & Giá</h3>
            
            {/* Economy Class */}
            <div className="class-section">
              <h4 className="class-title">Hạng Phổ thông</h4>
              <div className="form-grid">
                <div className="form-group">
                  <label>Số lượng ghế</label>
                  <input
                    type="number"
                    name="economySeats"
                    value={formData.economySeats}
                    onChange={handleInputChange}
                    placeholder="150"
                    min="0"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Giá vé (VND$)</label>
                  <input
                    type="number"
                    name="economyPrice"
                    value={formData.economyPrice}
                    onChange={handleInputChange}
                    placeholder="1.500.000"
                    min="0"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Hành lý xách tay (kg)</label>
                  <input
                    type="number"
                    name="economyBaggage"
                    value={formData.economyBaggage}
                    onChange={handleInputChange}
                    placeholder="7"
                    min="0"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Standard Class */}
            <div className="class-section">
              <h4 className="class-title">Standard</h4>
              <div className="form-grid">
                <div className="form-group">
                  <label>Số lượng ghế</label>
                  <input
                    type="number"
                    name="standardSeats"
                    value={formData.standardSeats}
                    onChange={handleInputChange}
                    placeholder="80"
                    min="0"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Giá vé (VND$)</label>
                  <input
                    type="number"
                    name="standardPrice"
                    value={formData.standardPrice}
                    onChange={handleInputChange}
                    placeholder="2.500.000"
                    min="0"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Hành lý xách tay (kg)</label>
                  <input
                    type="number"
                    name="standardBaggage"
                    value={formData.standardBaggage}
                    onChange={handleInputChange}
                    placeholder="10"
                    min="0"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Economy Flex Class */}
            <div className="class-section">
              <h4 className="class-title">Economy Flex</h4>
              <div className="form-grid">
                <div className="form-group">
                  <label>Số lượng ghế</label>
                  <input
                    type="number"
                    name="economyFlexSeats"
                    value={formData.economyFlexSeats}
                    onChange={handleInputChange}
                    placeholder="50"
                    min="0"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Giá vé (VND$)</label>
                  <input
                    type="number"
                    name="economyFlexPrice"
                    value={formData.economyFlexPrice}
                    onChange={handleInputChange}
                    placeholder="3.500.000"
                    min="0"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Hành lý xách tay (kg)</label>
                  <input
                    type="number"
                    name="economyFlexBaggage"
                    value={formData.economyFlexBaggage}
                    onChange={handleInputChange}
                    placeholder="12"
                    min="0"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={handleClose}>
              Huỷ
            </button>
            <button type="submit" className="save-btn">
              Lưu chuyến bay
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFlightModal;
