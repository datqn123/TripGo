import React, { useState, useEffect } from 'react';
import adminAirlineApi from '../../../api/adminAirlineApi';
import adminAirportApi from '../../../api/adminAirportApi';
import './AddFlightModal.css';

const SEAT_CLASSES = [
    { value: 'ECONOMY', label: 'Phổ thông (Economy)' },
    { value: 'BUSINESS', label: 'Thương gia (Business)' },
    { value: 'FIRST_CLASS', label: 'Hạng nhất (First Class)' },
    { value: 'PREMIUM_ECONOMY', label: 'Phổ thông đặc biệt' }
];

const AddFlightModal = ({ isOpen, onClose, onSave, flight, isLoading }) => {
  const [formData, setFormData] = useState({
    flightNumber: '',
    airlineId: '',
    departureAirportId: '',
    arrivalAirportId: '',
    departureDate: '',
    departureTime: '',
    arrivalDate: '',
    arrivalTime: ''
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [seats, setSeats] = useState([]);

  // Dropdown Data
  const [airlines, setAirlines] = useState([]);
  const [airports, setAirports] = useState([]);

  useEffect(() => {
    if (isOpen) {
        // Fetch dropdown data
        const fetchData = async () => {
            try {
                const [airlineRes, airportRes] = await Promise.all([
                    adminAirlineApi.getAll(),
                    adminAirportApi.getAll()
                ]);
                setAirlines(airlineRes.data?.result || []);
                setAirports(airportRes.data?.result || []);
            } catch (error) {
                console.error("Failed to fetch dropdown data", error);
            }
        };
        fetchData();
        
        // Reset or Populate Form
        if (flight) {
            setFormData({
                flightNumber: flight.flightNumber || '',
                airlineId: flight.airline?.id || '',
                departureAirportId: flight.departureAirport?.id || '',
                arrivalAirportId: flight.arrivalAirport?.id || '',
                departureDate: flight.departureTime ? flight.departureTime.split('T')[0] : '',
                departureTime: flight.departureTime ? flight.departureTime.split('T')[1].substring(0,5) : '',
                arrivalDate: flight.arrivalTime ? flight.arrivalTime.split('T')[0] : '',
                arrivalTime: flight.arrivalTime ? flight.arrivalTime.split('T')[1].substring(0,5) : ''
            });
            setImagePreview(flight.image || null);
            setImageFile(null);
            setSeats(flight.flightSeats || []);
        } else {
            setFormData({
                flightNumber: '',
                airlineId: '',
                departureAirportId: '',
                arrivalAirportId: '',
                departureDate: '',
                departureTime: '',
                arrivalDate: '',
                arrivalTime: ''
            });
            setImagePreview(null);
            setImageFile(null);
            setSeats([
                {
                    seatClass: 'ECONOMY',
                    price: 0,
                    quantity: 100,
                    cabinBaggage: '7kg',
                    checkedBaggage: '20kg',
                    isRefundable: false,
                    isChangeable: true,
                    hasMeal: false
                }
            ]);
        }
    }
  }, [isOpen, flight]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Seat Handlers
  const handleAddSeat = () => {
    setSeats([...seats, {
        seatClass: 'BUSINESS',
        price: 0,
        quantity: 20,
        cabinBaggage: '10kg',
        checkedBaggage: '30kg',
        isRefundable: true,
        isChangeable: true,
        hasMeal: true
    }]);
  };

  const handleRemoveSeat = (index) => {
    const newSeats = [...seats];
    newSeats.splice(index, 1);
    setSeats(newSeats);
  };

  const handleSeatChange = (index, field, value) => {
    const newSeats = [...seats];
    newSeats[index][field] = value;
    setSeats(newSeats);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Construct payload
    const finalData = {
        flightNumber: formData.flightNumber,
        airlineId: formData.airlineId,
        departureAirportId: formData.departureAirportId,
        arrivalAirportId: formData.arrivalAirportId,
        departureTime: `${formData.departureDate}T${formData.departureTime}:00`,
        arrivalTime: `${formData.arrivalDate}T${formData.arrivalTime}:00`,
        seats: seats
    };

    onSave(finalData, imageFile);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content flight-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{flight ? 'Cập nhật chuyến bay' : 'Thêm chuyến bay mới'}</h2>
          <button className="close-btn" onClick={onClose}>
            <i className="bi bi-x"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          {/* Section 1: General Info */}
          <div className="form-section">
            <h3 className="section-title">Thông tin chung</h3>
            <div className="form-grid">
               {/* Image Upload */}
               <div className="form-group full-width">
                <label>Hình ảnh chuyến bay</label>
                <div className="image-upload-preview">
                    {imagePreview && <img src={imagePreview} alt="Preview" className="preview-img" />}
                    <input type="file" onChange={handleImageChange} accept="image/*" className="form-control" />
                </div>
               </div>

               <div className="form-group">
                 <label>Mã chuyến bay</label>
                 <input type="text" name="flightNumber" value={formData.flightNumber} onChange={handleInputChange} required placeholder="VN123" />
               </div>

               <div className="form-group">
                 <label>Hãng hàng không</label>
                 <select name="airlineId" value={formData.airlineId} onChange={handleInputChange} required>
                    <option value="">-- Chọn Hãng --</option>
                    {airlines.map(a => <option key={a.id} value={a.id}>{a.name} ({a.code})</option>)}
                 </select>
               </div>

               <div className="form-group">
                 <label>Sân bay đi</label>
                 <select name="departureAirportId" value={formData.departureAirportId} onChange={handleInputChange} required>
                    <option value="">-- Chọn Sân bay đi --</option>
                    {airports.map(a => <option key={a.id} value={a.id}>{a.name} ({a.code})</option>)}
                 </select>
               </div>

               <div className="form-group">
                 <label>Sân bay đến</label>
                 <select name="arrivalAirportId" value={formData.arrivalAirportId} onChange={handleInputChange} required>
                    <option value="">-- Chọn Sân bay đến --</option>
                    {airports.map(a => <option key={a.id} value={a.id}>{a.name} ({a.code})</option>)}
                 </select>
               </div>

               <div className="form-group">
                 <label>Ngày đi</label>
                 <input type="date" name="departureDate" value={formData.departureDate} onChange={handleInputChange} required />
               </div>
               <div className="form-group">
                 <label>Giờ đi</label>
                 <input type="time" name="departureTime" value={formData.departureTime} onChange={handleInputChange} required />
               </div>

               <div className="form-group">
                 <label>Ngày đến</label>
                 <input type="date" name="arrivalDate" value={formData.arrivalDate} onChange={handleInputChange} required />
               </div>
               <div className="form-group">
                 <label>Giờ đến</label>
                 <input type="time" name="arrivalTime" value={formData.arrivalTime} onChange={handleInputChange} required />
               </div>
            </div>
          </div>

          {/* Section 2: Seats */}
          <div className="form-section">
            <div className="section-header-row">
                <h3 className="section-title">Cấu hình Hạng vé</h3>
                <button type="button" className="add-seat-btn" onClick={handleAddSeat}>
                    <i className="bi bi-plus-circle"></i> Thêm hạng vé
                </button>
            </div>
            
            <div className="seats-container">
                {seats.map((seat, index) => (
                    <div key={index} className="seat-card">
                        <div className="seat-card-header">
                            <span className="seat-index">#{index + 1}</span>
                            {seats.length > 1 && (
                                <button type="button" className="remove-seat-btn" onClick={() => handleRemoveSeat(index)}>
                                    <i className="bi bi-trash"></i>
                                </button>
                            )}
                        </div>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Hạng vé</label>
                                <select 
                                    value={seat.seatClass} 
                                    onChange={(e) => handleSeatChange(index, 'seatClass', e.target.value)}
                                    required
                                >
                                    {SEAT_CLASSES.map(sc => <option key={sc.value} value={sc.value}>{sc.label}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Giá vé (VND)</label>
                                <input 
                                    type="number" 
                                    value={seat.price} 
                                    onChange={(e) => handleSeatChange(index, 'price', e.target.value)}
                                    required min="0" 
                                />
                            </div>
                            <div className="form-group">
                                <label>Số lượng</label>
                                <input 
                                    type="number" 
                                    value={seat.quantity} 
                                    onChange={(e) => handleSeatChange(index, 'quantity', e.target.value)}
                                    required min="1" 
                                />
                            </div>
                             <div className="form-group">
                                <label>Hành lý xách tay</label>
                                <input 
                                    type="text" 
                                    value={seat.cabinBaggage} 
                                    onChange={(e) => handleSeatChange(index, 'cabinBaggage', e.target.value)}
                                    placeholder="7kg"
                                />
                            </div>
                            <div className="form-group">
                                <label>Hành lý ký gửi</label>
                                <input 
                                    type="text" 
                                    value={seat.checkedBaggage} 
                                    onChange={(e) => handleSeatChange(index, 'checkedBaggage', e.target.value)}
                                    placeholder="20kg"
                                />
                            </div>
                            
                            {/* Checkboxes */}
                            <div className="form-group full-width checkboxes-row">
                                <label className="checkbox-label">
                                    <input 
                                        type="checkbox" 
                                        checked={seat.isRefundable} 
                                        onChange={(e) => handleSeatChange(index, 'isRefundable', e.target.checked)} 
                                    />
                                    Hoàn vé
                                </label>
                                <label className="checkbox-label">
                                    <input 
                                        type="checkbox" 
                                        checked={seat.isChangeable} 
                                        onChange={(e) => handleSeatChange(index, 'isChangeable', e.target.checked)} 
                                    />
                                    Đổi vé
                                </label>
                                <label className="checkbox-label">
                                    <input 
                                        type="checkbox" 
                                        checked={seat.hasMeal} 
                                        onChange={(e) => handleSeatChange(index, 'hasMeal', e.target.checked)} 
                                    />
                                    Suất ăn
                                </label>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose} disabled={isLoading}>
              Huỷ
            </button>
            <button type="submit" className="save-btn" disabled={isLoading}>
              {isLoading ? 'Đang lưu...' : (flight ? 'Cập nhật' : 'Lưu')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFlightModal;
