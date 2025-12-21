import React, { useState, useEffect } from 'react';
import homeApi from '../../../api/homeApi';
import adminApi from '../../../api/adminApi';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import './AddHotel.css';

const AddHotel = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    starRating: 3,
    checkIn: '14:00',
    checkOut: '12:00',
    description: '',
    locationId: '',
    city: 'Hồ Chí Minh', // Keep for address display/logic if needed, or remove if redundant
    address: '',
    hotelType: 'HOTEL',
    hotelView: '',
  });

  const [amenitiesList, setAmenitiesList] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [locations, setLocations] = useState([]); // Dynamic locations
  const [selectedImages, setSelectedImages] = useState([]); // File objects
  const [imagePreviewUrls, setImagePreviewUrls] = useState([]); // Previews

  useEffect(() => {
    fetchAmenities();
    fetchLocations();
  }, []);

  const fetchAmenities = async () => {
    try {
      const response = await homeApi.getAmenities();
      if (response.data && response.data.result) {
        setAmenitiesList(response.data.result);
      }
    } catch (error) {
      console.error("Failed to fetch amenities:", error);
    }
  };

  const fetchLocations = async () => {
    try {
      const response = await homeApi.getDropdownLocations();
      if (response.data && response.data.result) {
        setLocations(response.data.result);
      }
    } catch (error) {
      console.error("Failed to fetch locations:", error);
    }
  };


  const handleAmenityChange = (id) => {
    setSelectedAmenities(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const [rooms, setRooms] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(prev => [...prev, ...files]);

    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviewUrls(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviewUrls(prev => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const updateRoom = (id, field, value) => {
    setRooms(prev => prev.map(room => 
      room.id === id ? { ...room, [field]: value } : room
    ));
  };

  const removeRoom = (id) => {
    setRooms(prev => prev.filter(room => room.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const hotelRequest = {
        name: formData.name,
        address: formData.address,
        description: formData.description,
        starRating: formData.starRating,
        type: formData.hotelType,
        checkInTime: formData.checkIn,
        checkOutTime: formData.checkOut,
        contactPhone: formData.phone,
        contactEmail: formData.email,
        locationId: formData.locationId,
        amenityIds: selectedAmenities,
        viewTypes: formData.hotelView ? [formData.hotelView] : []
      };

      const data = new FormData();
      // Append 'hotel' part as JSON
      data.append('hotel', new Blob([JSON.stringify(hotelRequest)], { type: "application/json" }));
      
      // Append images
      selectedImages.forEach(file => data.append('images', file));

      await adminApi.createHotel(data);
      toast.success('Tạo khách sạn thành công!');
      navigate('/admin/hotels');
    } catch (error) {
      console.error('Create hotel failed:', error);
      toast.error('Tạo khách sạn thất bại. Vui lòng thử lại.');
    }
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
              <label>Số điện thoại</label>
              <input
                type="text"
                name="phone"
                placeholder="0912..."
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="form-group">
              <label>Email liên hệ</label>
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

            <div className="form-group">
              <label>Loại hình lưu trú <span className="required">*</span></label>
              <select
                name="hotelType"
                value={formData.hotelType}
                onChange={handleInputChange}
                required
              >
                <option value="HOTEL">Khách sạn thường</option>
                <option value="RESORT">Khu nghỉ dưỡng</option>
                <option value="HOMESTAY">Nhà dân / Homestay</option>
                <option value="VILLA">Biệt thự</option>
                <option value="APARTMENT">Căn hộ</option>
              </select>
            </div>

            <div className="form-group">
              <label>Hướng nhìn (View)</label>
              <select
                name="hotelView"
                value={formData.hotelView}
                onChange={handleInputChange}
              >
                <option value="">Chọn hướng nhìn</option>
                <option value="OCEAN_VIEW">Hướng biển</option>
                <option value="MOUNTAIN_VIEW">Hướng núi</option>
                <option value="CITY_VIEW">Hướng thành phố</option>
                <option value="GARDEN_VIEW">Hướng vườn</option>
                <option value="POOL_VIEW">Hướng hồ bơi</option>
                <option value="RIVER_VIEW">Hướng sông</option>
                <option value="LAKE_VIEW">Hướng hồ</option>
                <option value="STREET_VIEW">Hướng phố</option>
              </select>
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
                name="locationId"
                value={formData.locationId}
                onChange={handleInputChange}
                required
              >
                <option value="">Chọn địa điểm</option>
                {locations.map(loc => (
                  <option key={loc.id} value={loc.id}>{loc.name}</option>
                ))}
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
          <h3 className="section-title">Tiện nghi</h3>
          <div className="amenities-grid">
            {amenitiesList.map(amenity => (
              <label key={amenity.id} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={selectedAmenities.includes(amenity.id)}
                  onChange={() => handleAmenityChange(amenity.id)}
                />
                <span>
                   {amenity.icon && <i className={`fa ${amenity.icon} me-2`}></i>}
                   {amenity.name}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Images */}
        <div className="form-section">
          <h3 className="section-title">Hình ảnh</h3>
          <div className="image-upload-area">
            {imagePreviewUrls.length > 0 ? (
               <div className="image-previews">
                 {imagePreviewUrls.map((url, index) => (
                   <div key={index} className="preview-item">
                     <img src={url} alt={`Preview ${index}`} />
                     <button type="button" onClick={() => removeImage(index)} className="remove-img-btn">
                       <i className="bi bi-x"></i>
                     </button>
                   </div>
                 ))}
                 <div className="add-more-img">
                   <input type="file" id="image-upload" multiple onChange={handleImageChange} hidden />
                   <label htmlFor="image-upload">
                     <i className="bi bi-plus-lg"></i>
                   </label>
                 </div>
               </div>
            ) : (
                <div className="upload-placeholder">
                  <i className="bi bi-cloud-upload"></i>
                  <p>Chọn hoặc kéo thả hình ở đây</p>
                  <label htmlFor="image-upload" className="upload-btn">
                    Tải ảnh lên
                  </label>
                  <input
                    type="file"
                    id="image-upload"
                    multiple
                    onChange={handleImageChange}
                    hidden
                  />
                </div>
            )}
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
