import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddHotel.css';

const AddHotel = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    checkIn: '14:00',
    checkOut: '12:00',
    description: '',
    location: '',
    city: 'Hồ Chí Minh',
    address: '',
  });

  const [amenities, setAmenities] = useState({
    pool: false,
    teaCoffee: false,
    cityView: false,
    mountainView: false,
    gardenView: false,
    restaurant: false,
    gym: false,
    carRental: false,
    parking: false
  });

  const [rooms, setRooms] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAmenityChange = (e) => {
    const { name, checked } = e.target;
    setAmenities(prev => ({ ...prev, [name]: checked }));
  };

  const addRoom = () => {
    setRooms(prev => [...prev, {
      id: Date.now(),
      name: '',
      roomNumber: '',
      price: '',
      capacity: '',
      beds: ''
    }]);
  };

  const updateRoom = (id, field, value) => {
    setRooms(prev => prev.map(room => 
      room.id === id ? { ...room, [field]: value } : room
    ));
  };

  const removeRoom = (id) => {
    setRooms(prev => prev.filter(room => room.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Submit to API
    console.log({ formData, amenities, rooms });
    navigate('/admin/hotels');
  };

  const handleCancel = () => {
    navigate('/admin/hotels');
  };

  return (
    <div className="add-hotel-container">
      {/* Header */}
      <div className="form-header">
        <button className="back-btn" onClick={handleCancel}>
          <i className="bi bi-arrow-left"></i>
          Thêm khách sạn
        </button>
      </div>

      <form onSubmit={handleSubmit} className="hotel-form">
        {/* Basic Info */}
        <div className="form-section">
          <h3 className="section-title">Thông tin cơ bản</h3>
          <div className="form-grid">
            <div className="form-group full-width">
              <label>Tên khách sạn <span className="required">*</span></label>
              <input
                type="text"
                name="name"
                placeholder="Nhập tên khách sạn"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="email@example.com"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Giờ nhận phòng</label>
              <input
                type="time"
                name="checkIn"
                value={formData.checkIn}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Giờ trả phòng</label>
              <input
                type="time"
                name="checkOut"
                value={formData.checkOut}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group full-width">
              <label>Mô tả</label>
              <textarea
                name="description"
                placeholder="Mô tả về khách sạn"
                rows="4"
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="form-section">
          <h3 className="section-title">Địa chỉ</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Địa điểm <span className="required">*</span></label>
              <select
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
              >
                <option value="">Chọn địa điểm</option>
                <option value="hcm">TP. Hồ Chí Minh</option>
                <option value="hanoi">Hà Nội</option>
                <option value="dalat">Đà Lạt</option>
                <option value="nhatrang">Nha Trang</option>
                <option value="phuquoc">Phú Quốc</option>
              </select>
            </div>

            <div className="form-group">
              <label>Thành phố</label>
              <select
                name="city"
                value={formData.city}
                onChange={handleInputChange}
              >
                <option value="Hồ Chí Minh">Hồ Chí Minh</option>
                <option value="Hà Nội">Hà Nội</option>
                <option value="Đà Nẵng">Đà Nẵng</option>
              </select>
            </div>

            <div className="form-group full-width">
              <label>Địa chỉ chi tiết</label>
              <input
                type="text"
                name="address"
                placeholder="Nhập địa chỉ"
                value={formData.address}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        {/* Amenities */}
        <div className="form-section">
          <h3 className="section-title">Phương thức Trợ cập</h3>
          <div className="amenities-grid">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="pool"
                checked={amenities.pool}
                onChange={handleAmenityChange}
              />
              <span>Suối</span>
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="teaCoffee"
                checked={amenities.teaCoffee}
                onChange={handleAmenityChange}
              />
              <span>Trà/Cà phê</span>
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="cityView"
                checked={amenities.cityView}
                onChange={handleAmenityChange}
              />
              <span>City View</span>
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="mountainView"
                checked={amenities.mountainView}
                onChange={handleAmenityChange}
              />
              <span>Mountain View</span>
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="gardenView"
                checked={amenities.gardenView}
                onChange={handleAmenityChange}
              />
              <span>Garden View</span>
            </label>
          </div>

          <h4 className="subsection-title">Khác</h4>
          <div className="amenities-grid">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="restaurant"
                checked={amenities.restaurant}
                onChange={handleAmenityChange}
              />
              <span>Nhà hàng</span>
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="gym"
                checked={amenities.gym}
                onChange={handleAmenityChange}
              />
              <span>Phòng gym</span>
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="carRental"
                checked={amenities.carRental}
                onChange={handleAmenityChange}
              />
              <span>Loại xe</span>
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="parking"
                checked={amenities.parking}
                onChange={handleAmenityChange}
              />
              <span>Giữ xe</span>
            </label>
          </div>
        </div>

        {/* Images */}
        <div className="form-section">
          <h3 className="section-title">Hình ảnh</h3>
          <div className="image-upload-area">
            <div className="upload-placeholder">
              <i className="bi bi-cloud-upload"></i>
              <p>Chọn hoặc kéo thả hình ở đây</p>
              <button type="button" className="upload-btn">
                Tải ảnh lên
              </button>
            </div>
          </div>
        </div>

        {/* Room List */}
        <div className="form-section">
          <div className="section-header">
            <h3 className="section-title">Danh sách phòng</h3>
            <button type="button" className="add-room-btn" onClick={addRoom}>
              <i className="bi bi-plus-lg"></i>
              Thêm phòng
            </button>
          </div>

          {rooms.length > 0 && (
            <div className="rooms-table-container">
              <table className="rooms-table">
                <thead>
                  <tr>
                    <th>Tên phòng</th>
                    <th>Số phòng</th>
                    <th>Giá phòng</th>
                    <th>Số người</th>
                    <th>Số giường</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {rooms.map(room => (
                    <tr key={room.id}>
                      <td>
                        <input
                          type="text"
                          placeholder="Name"
                          value={room.name}
                          onChange={(e) => updateRoom(room.id, 'name', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          placeholder="1"
                          value={room.roomNumber}
                          onChange={(e) => updateRoom(room.id, 'roomNumber', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          placeholder="0"
                          value={room.price}
                          onChange={(e) => updateRoom(room.id, 'price', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          placeholder="0"
                          value={room.capacity}
                          onChange={(e) => updateRoom(room.id, 'capacity', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          placeholder="0"
                          value={room.beds}
                          onChange={(e) => updateRoom(room.id, 'beds', e.target.value)}
                        />
                      </td>
                      <td>
                        <button
                          type="button"
                          className="remove-room-btn"
                          onClick={() => removeRoom(room.id)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={handleCancel}>
            Hủy
          </button>
          <button type="submit" className="submit-btn">
            LƯU KHÁCH SẠN
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddHotel;
