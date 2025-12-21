import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddTour.css';

const AddTour = () => {
  const navigate = useNavigate();
  const [tourData, setTourData] = useState({
    name: '',
    code: '',
    duration: '',
    maxPeople: '',
    shortDescription: '',
    pricePerNight: '',
    description: '',
    startLocation: '',
    endLocation: '',
    transportation: 'xe-du-lich'
  });

  const [itinerary, setItinerary] = useState([
    { day: 1, title: '', description: '', activities: '' }
  ]);

  const [images, setImages] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTourData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleItineraryChange = (index, field, value) => {
    const updatedItinerary = [...itinerary];
    updatedItinerary[index][field] = value;
    setItinerary(updatedItinerary);
  };

  const addNewDay = () => {
    setItinerary([...itinerary, {
      day: itinerary.length + 1,
      title: '',
      description: '',
      activities: ''
    }]);
  };

  const removeDay = (index) => {
    const updatedItinerary = itinerary.filter((_, i) => i !== index);
    // Update day numbers
    updatedItinerary.forEach((item, i) => {
      item.day = i + 1;
    });
    setItinerary(updatedItinerary);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages(prev => [...prev, ...files]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Submit form data to API
    console.log('Tour Data:', tourData);
    console.log('Itinerary:', itinerary);
    console.log('Images:', images);
    navigate('/admin/tours');
  };

  const handleCancel = () => {
    navigate('/admin/tours');
  };

  return (
    <div className="add-tour">
      <div className="add-tour-header">
        <button className="back-button" onClick={handleCancel}>
          <i className="bi bi-arrow-left"></i>
          Thêm tour mới
        </button>
      </div>

      <form onSubmit={handleSubmit} className="tour-form">
        {/* Basic Information */}
        <div className="form-section">
          <h2 className="section-title">Thông tin cơ bản</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>Tên Tour</label>
              <input
                type="text"
                name="name"
                value={tourData.name}
                onChange={handleInputChange}
                placeholder="Nhập tên tour"
                required
              />
            </div>

            <div className="form-group">
              <label>Mã Tour</label>
              <input
                type="text"
                name="code"
                value={tourData.code}
                onChange={handleInputChange}
                placeholder="Nhập mã tour"
                required
              />
            </div>

            <div className="form-group">
              <label>Thời lượng (ngày)</label>
              <input
                type="number"
                name="duration"
                value={tourData.duration}
                onChange={handleInputChange}
                placeholder="Số ngày"
                min="1"
                required
              />
            </div>

            <div className="form-group">
              <label>Số lượng tối đa</label>
              <input
                type="number"
                name="maxPeople"
                value={tourData.maxPeople}
                onChange={handleInputChange}
                placeholder="Số người"
                min="1"
                required
              />
            </div>

            <div className="form-group">
              <label>Mô tả ngắn</label>
              <input
                type="text"
                name="shortDescription"
                value={tourData.shortDescription}
                onChange={handleInputChange}
                placeholder="Mô tả ngắn gọn"
              />
            </div>

            <div className="form-group">
              <label>Giá mỗi đêm</label>
              <input
                type="number"
                name="pricePerNight"
                value={tourData.pricePerNight}
                onChange={handleInputChange}
                placeholder="VNĐ"
                min="0"
                required
              />
            </div>

            <div className="form-group full-width">
              <label>Mô tả</label>
              <textarea
                name="description"
                value={tourData.description}
                onChange={handleInputChange}
                placeholder="Mô tả chi tiết về tour"
                rows="4"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Location & Transportation */}
        <div className="form-section">
          <h2 className="section-title">Địa điểm & Di chuyển</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>Điểm khởi hành</label>
              <input
                type="text"
                name="startLocation"
                value={tourData.startLocation}
                onChange={handleInputChange}
                placeholder="Nhập điểm khởi hành"
                required
              />
            </div>

            <div className="form-group">
              <label>Điểm đến</label>
              <input
                type="text"
                name="endLocation"
                value={tourData.endLocation}
                onChange={handleInputChange}
                placeholder="Nhập điểm đến"
                required
              />
            </div>

            <div className="form-group">
              <label>Phương tiện</label>
              <select
                name="transportation"
                value={tourData.transportation}
                onChange={handleInputChange}
              >
                <option value="xe-du-lich">Xe du lịch</option>
                <option value="may-bay">Máy bay</option>
                <option value="tau-hoa">Tàu hỏa</option>
                <option value="tau-thuy">Tàu thủy</option>
                <option value="xe-may">Xe máy</option>
                <option value="di-bo">Đi bộ</option>
              </select>
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="form-section">
          <h2 className="section-title">Hình ảnh</h2>
          <div className="image-upload-area">
            <input
              type="file"
              id="tour-images"
              accept="image/png, image/jpeg, image/gif"
              multiple
              onChange={handleImageUpload}
              hidden
            />
            <label htmlFor="tour-images" className="upload-label">
              <i className="bi bi-cloud-upload"></i>
              <p>Tải ảnh</p>
              <span className="upload-hint">PNG, JPG, GIF tối đa 1MB. Tỉ lệ là 1024</span>
            </label>
          </div>
          {images.length > 0 && (
            <div className="uploaded-images">
              {images.map((img, index) => (
                <div key={index} className="image-preview">
                  <img src={URL.createObjectURL(img)} alt={`Preview ${index}`} />
                  <button
                    type="button"
                    className="remove-image"
                    onClick={() => setImages(images.filter((_, i) => i !== index))}
                  >
                    <i className="bi bi-x"></i>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Itinerary */}
        <div className="form-section">
          <h2 className="section-title">Lịch trình</h2>
          <div className="itinerary-list">
            {itinerary.map((day, index) => (
              <div key={index} className="itinerary-day">
                <div className="day-header">
                  <h3>Ngày {day.day}</h3>
                  {itinerary.length > 1 && (
                    <button
                      type="button"
                      className="remove-day-btn"
                      onClick={() => removeDay(index)}
                    >
                      <i className="bi bi-x-circle"></i>
                    </button>
                  )}
                </div>
                
                <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    value={day.title}
                    onChange={(e) => handleItineraryChange(index, 'title', e.target.value)}
                    placeholder="Tiêu đề ngày"
                  />
                </div>

                <div className="form-group">
                  <label>Mô tả chi tiết</label>
                  <textarea
                    value={day.description}
                    onChange={(e) => handleItineraryChange(index, 'description', e.target.value)}
                    placeholder="Mô tả chi tiết lịch trình trong ngày"
                    rows="3"
                  ></textarea>
                </div>

                <div className="form-group">
                  <label>Hoạt động chính nội</label>
                  <textarea
                    value={day.activities}
                    onChange={(e) => handleItineraryChange(index, 'activities', e.target.value)}
                    placeholder="Các hoạt động chính trong ngày"
                    rows="3"
                  ></textarea>
                </div>
              </div>
            ))}
          </div>

          <button type="button" className="add-day-btn" onClick={addNewDay}>
            <i className="bi bi-plus-lg"></i>
            Thêm ngày
          </button>
        </div>

        {/* Action Buttons */}
        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={handleCancel}>
            Huỷ
          </button>
          <button type="submit" className="submit-btn">
            Lưu tour
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTour;
