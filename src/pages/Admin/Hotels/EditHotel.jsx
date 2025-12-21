import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import adminApi from '../../../api/adminApi';
import { API_BASE_URL } from '../../../api/config';
import { toast } from 'react-toastify';
import './AddHotel.css'; // Reusing existing styles

const EditHotel = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [existingImages, setExistingImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [originalHotel, setOriginalHotel] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    description: '',
    starRating: 5,
    type: 'HOTEL',
    checkInTime: '14:00',
    checkOutTime: '12:00',
    contactPhone: '',
    contactEmail: '',
    pricePerNightFrom: 0,
    priceRange: 'MODERATE',
    designStyle: 'MODERN',
    locationId: '',
    // Detailed scores
    averageRating: 0,
    totalReviews: 0,
    cleanlinessScore: 0,
    comfortScore: 0,
    locationScore: 0,
    facilitiesScore: 0,
    staffScore: 0,
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

  const [views, setViews] = useState({
    OCEAN_VIEW: false,
    CITY_VIEW: false,
    MOUNTAIN_VIEW: false,
    GARDEN_VIEW: false,
    POOL_VIEW: false,
  });

  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    // Scroll to top when loading
    window.scrollTo(0, 0);

    const fetchHotelDetails = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const response = await adminApi.getHotelById(id);
        if (response.data && response.data.result) {
           const hotel = response.data.result;
           setOriginalHotel(hotel);
           setExistingImages(hotel.images || []);
           
           // Map API data to form state
           setFormData({
             name: hotel.name || '',
             address: hotel.address || '',
             description: hotel.description || '',
             starRating: hotel.starRating || 5,
             type: hotel.type || hotel.hotelType || 'HOTEL',
             checkInTime: hotel.checkInTime || '14:00',
             checkOutTime: hotel.checkOutTime || '12:00',
             contactPhone: hotel.contactPhone || '',
             contactEmail: hotel.contactEmail || '',
             locationId: hotel.location?.id || hotel.locationId || '',
           });

           // Transform amenities list to boolean object if needed
           // Assuming backend returns list of strings/objects, or same boolean structure
           // This might need adjustment based on actual API response
           if (hotel.amenities) {
             // Reset all
             const newAmenities = { ...amenities }; 
             // If hotel.amenities is array of codes/enums
             if (Array.isArray(hotel.amenities)) {
                 console.log("Received amenities:", hotel.amenities);
                 
                 // Create a map of existing keys in lower case for easier matching
                 const existingKeysMap = Object.keys(newAmenities).reduce((acc, key) => {
                     acc[key.toLowerCase()] = key;
                     return acc;
                 }, {});

                 hotel.amenities.forEach(item => {
                     const itemStr = typeof item === 'string' ? item : (item.name || '');
                     const itemLower = itemStr.toLowerCase();
                     const itemLowerNoUnderscore = itemLower.replace('_', '');

                     // Try to find a match
                     let matchedKey = existingKeysMap[itemLower] || existingKeysMap[itemLowerNoUnderscore];
                     
                     if (matchedKey) {
                         newAmenities[matchedKey] = true;
                     } else {
                         // If not found in hardcoded list, add it dynamically
                         // Use the original string as key
                         newAmenities[itemStr] = true;
                     }
                 });
                 setAmenities(newAmenities);
             }
           }

           // Transform views
           if (hotel.views) {
              const newViews = { ...views };
              if (Array.isArray(hotel.views)) {
                  Object.keys(newViews).forEach(key => {
                      newViews[key] = hotel.views.includes(key) || hotel.views.some(v => v.name === key || v === key);
                  });
                  setViews(newViews);
              }
           }

           // Rooms
           if (hotel.rooms) {
             setRooms(hotel.rooms);
           }
        }
      } catch (error) {
        console.error("Failed to fetch hotel details:", error);
        toast.error("Không thể tải thông tin khách sạn");
      } finally {
        setLoading(false);
      }
    };

    fetchHotelDetails();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAmenityChange = (e) => {
    const { name, checked } = e.target;
    setAmenities(prev => ({ ...prev, [name]: checked }));
  };

  const handleViewChange = (e) => {
    const { name, checked } = e.target;
    setViews(prev => ({ ...prev, [name]: checked }));
  };

  const addRoom = () => {
    setRooms(prev => [...prev, {
      id: `temp-${Date.now()}`, // String ID for new rooms to distinguish from DB IDs
      name: '',
      quantity: 1, // Default to 1
      price: 0,
      capacity: 1,
      area: 0
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

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(prev => [...prev, ...files]);

    const filePreviews = files.map(file => URL.createObjectURL(file));
    setPreviewImages(prev => [...prev, ...filePreviews]);
  };

  const removeImage = (index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setPreviewImages(prev => {
      const newPreviews = prev.filter((_, i) => i !== index);
      // Revoke the URL to avoid memory leaks
      URL.revokeObjectURL(prev[index]);
      return newPreviews;
    });
  };

  const removeExistingImage = (index) => {
      setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        // Helper to find ID for an amenity key
        // Limitation: Can only find ID if it exists in originalHotel.amenities
        // If checking a new amenity that wasn't there, we don't know the ID unless we fetch all amenities.
        const getAmenityId = (key) => {
             if (!originalHotel || !originalHotel.amenities) return null;
             const found = originalHotel.amenities.find(a => {
                const aName = typeof a === 'string' ? a : (a.name || '');
                return aName.toLowerCase() === key.toLowerCase() || 
                       aName.toLowerCase().replace('_', '') === key.toLowerCase();
             });
             return found ? found.id : null;
        };

        const amenityIds = Object.keys(amenities)
            .filter(key => amenities[key])
            .map(key => getAmenityId(key))
            .filter(id => id !== null); // Removing nulls (cannot send unknown IDs)

        const viewTypes = Object.keys(views).filter(key => views[key]);
        
        
        // Extract existing image URLs
        const imageUrls = existingImages.map(img => typeof img === 'string' ? img : img.url);

        const hotelData = {
            // ...originalHotel, // REMOVED: Do not send original read-only fields (createdAt, location obj, etc.)
            ...formData,      // Send only form fields
            amenityIds,       // Replaces 'amenities'
            viewTypes,        // Replaces 'views'
            imageUrls,        // Existing images to keep
            imageUrls,        // Existing images to keep
        };

        // Ensure locationId is a number if possible
        if (hotelData.locationId) {
            hotelData.locationId = Number(hotelData.locationId);
        }
        
        // Remove keys that are not in HotelRequest DTO
        delete hotelData.rooms; // User confirmed backend doesn't accept rooms here
        delete hotelData.reviews; // Assuming reviews are also not updatable here
        delete hotelData.amenities;
        delete hotelData.views;
        delete hotelData.images; 
        delete hotelData.id;
        delete hotelData.createdAt;
        delete hotelData.updatedAt;
        delete hotelData.location; // The object, we send locationId
        delete hotelData.averageRating; // Usually calculated
        delete hotelData.totalReviews;
        delete hotelData.minPrice; // derived
        delete hotelData.hotelType; // alias for type

        // Remove keys that might be in formData but not desired if necessary, 
        // but formData should match editable fields.
        // clean up temporary keys if any.

        const submissionData = new FormData();
        // Backend expects 'hotel' part as JSON string with application/json content type usually,
        // but often text/plain works if mapped by ObjectMapper. 
        // Best practice: Blob with type application/json
        const jsonBlob = new Blob([JSON.stringify(hotelData)], { type: 'application/json' });
        submissionData.append("hotel", jsonBlob);
        
        selectedImages.forEach(image => {
          submissionData.append("images", image);
        });

        console.log("Submitting FormData for ID:", id);
        await adminApi.updateHotel(id, submissionData);
        toast.success("Cập nhật khách sạn thành công!");
        navigate('/admin/hotels');
    } catch (error) {
        console.error("Update failed:", error);
        toast.error("Cập nhật thất bại");
    }
  };

  const handleCancel = () => {
    navigate('/admin/hotels');
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="add-hotel-container">
      {/* Header */}
      <div className="form-header">
        <button className="back-btn" onClick={handleCancel}>
          <i className="bi bi-arrow-left"></i>
          Chỉnh sửa khách sạn
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
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Loại hình</label>
              <select name="type" value={formData.type} onChange={handleInputChange}>
                <option value="HOTEL">Hotel</option>
                <option value="RESORT">Resort</option>
                <option value="VILLA">Villa</option>
                <option value="HOMESTAY">Homestay</option>
                <option value="APARTMENT">Apartment</option>
              </select>
            </div>

            <div className="form-group">
              <label>Hạng sao (1-5)</label>
              <input
                type="number"
                name="starRating"
                min="1"
                max="5"
                value={formData.starRating}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Email liên hệ</label>
              <input
                type="email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>SĐT liên hệ</label>
              <input
                type="text"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Giờ nhận phòng</label>
              <input
                type="time"
                name="checkInTime"
                value={formData.checkInTime}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Giờ trả phòng</label>
              <input
                type="time"
                name="checkOutTime"
                value={formData.checkOutTime}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group full-width">
              <label>Mô tả</label>
              <textarea
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>
            
             <div className="form-group">
              <label>Phong cách thiết kế</label>
              <select name="designStyle" value={formData.designStyle} onChange={handleInputChange}>
                <option value="MODERN">Modern</option>
                <option value="TRADITIONAL">Traditional</option>
                <option value="BOUTIQUE">Boutique</option>
                <option value="CLASSIC">Classic</option>
                <option value="MINIMALIST">Minimalist</option>
              </select>
            </div>
          </div>
        </div>

        {/* Pricing & Location */}
        <div className="form-section">
          <h3 className="section-title">Giá & Vị trí</h3>
          <div className="form-grid">
            <div className="form-group">
                <label>Giá từ (VND)</label>
                <input
                    type="number"
                    name="pricePerNightFrom"
                    value={formData.pricePerNightFrom}
                    onChange={handleInputChange}
                />
            </div>
             <div className="form-group">
              <label>Phân khúc giá</label>
              <select name="priceRange" value={formData.priceRange} onChange={handleInputChange}>
                <option value="BUDGET">Budget</option>
                <option value="MODERATE">Moderate</option>
                <option value="UPSCALE">Upscale</option>
                <option value="LUXURY">Luxury</option>
              </select>
            </div>
             
             <div className="form-group full-width">
              <label>Địa chỉ chi tiết</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
              />
            </div>
             <div className="form-group">
              <label>Địa điểm (Location ID)</label>
              <input
                type="text"
                name="locationId"
                value={formData.locationId}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="form-section">
          <h3 className="section-title">Hình ảnh</h3>
          <div className="image-upload-area">
            <div className="upload-placeholder">
              <i className="bi bi-cloud-upload" style={{ fontSize: '2rem', marginBottom: '10px' }}></i>
              <p>Chọn hoặc kéo thả hình ở đây</p>
              <input 
                type="file" 
                multiple 
                onChange={handleImageChange} 
                style={{display: 'none'}} 
                id="image-upload"
                accept="image/*"
              />
              <label htmlFor="image-upload" className="upload-btn" style={{cursor: 'pointer', display: 'inline-block'}}>
                Tải ảnh lên
              </label>
            </div>
          </div>
          
          
          {/* Existing Images */}
          {existingImages.length > 0 && (
             <div style={{ marginTop: '1rem' }}>
                <h4 className="subsection-title">Hình ảnh hiện tại</h4>
                <div className="preview-images-container" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {existingImages.map((img, index) => {
                    let src = typeof img === 'string' ? img : (img.imageUrl || img.url); // Prioritize imageUrl based on debug
                    
                    if (src && !src.startsWith('http')) {
                        // Assuming API_BASE_URL is http://localhost:8080/api
                        // And images are served from http://localhost:8080/uploads/...
                        // We need to remove '/api' from API_BASE_URL
                        const baseUrl = API_BASE_URL.replace(/\/api$/, '');
                        src = `${baseUrl}/${src.startsWith('/') ? src.slice(1) : src}`;
                    }
                    return (
                        <div key={`existing-${index}`} className="preview-image-item" style={{ display: 'flex', alignItems: 'center', gap: '15px', border: '1px solid #eee', padding: '10px', borderRadius: '4px' }}>
                          <div style={{ position: 'relative' }}>
                              <img src={src} alt="Existing" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px' }} />
                          </div>
                          <div style={{ flex: 1 }}>
                              <input 
                                  type="text" 
                                  value={src || ''} 
                                  readOnly 
                                  style={{ width: '100%', padding: '5px', borderRadius: '4px', border: '1px solid #ddd', backgroundColor: '#f9f9f9', color: '#555' }}
                              />
                          </div>
                          <button 
                            type="button" 
                            onClick={() => removeExistingImage(index)}
                            className="remove-image-btn"
                            style={{
                              background: '#ff4d4f',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              padding: '5px 10px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '5px'
                            }}
                          >
                            <i className="bi bi-trash"></i> Xóa
                          </button>
                        </div>
                    );
                  })}
                </div>
             </div>
          )}

          {/* New Images */}
          {previewImages.length > 0 && (
            <div className="preview-images-container" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '1rem' }}>
              {previewImages.map((src, index) => (
                <div key={index} className="preview-image-item" style={{ position: 'relative' }}>
                  <img src={src} alt="Preview" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px' }} />
                  <button 
                    type="button" 
                    onClick={() => removeImage(index)}
                    style={{
                      position: 'absolute',
                      top: '-5px',
                      right: '-5px',
                      background: 'red',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '20px',
                      height: '20px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px'
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Ratings & Scores */}
        <div className="form-section">
            <h3 className="section-title">Đánh giá & Điểm số (Recommendation)</h3>
            <div className="form-grid">
                <div className="form-group">
                    <label>Điểm trung bình</label>
                    <input type="number" step="0.1" name="averageRating" value={formData.averageRating} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                    <label>Tổng đánh giá</label>
                    <input type="number" name="totalReviews" value={formData.totalReviews} onChange={handleInputChange} />
                </div>
                {/* Specific Scores */}
                 <div className="form-group">
                    <label>Sạch sẽ (Cleanliness)</label>
                    <input type="number" step="0.1" name="cleanlinessScore" value={formData.cleanlinessScore} onChange={handleInputChange} />
                </div>
                 <div className="form-group">
                    <label>Thoải mái (Comfort)</label>
                    <input type="number" step="0.1" name="comfortScore" value={formData.comfortScore} onChange={handleInputChange} />
                </div>
                 <div className="form-group">
                    <label>Vị trí (Location)</label>
                    <input type="number" step="0.1" name="locationScore" value={formData.locationScore} onChange={handleInputChange} />
                </div>
                 <div className="form-group">
                    <label>Tiện nghi (Facilities)</label>
                    <input type="number" step="0.1" name="facilitiesScore" value={formData.facilitiesScore} onChange={handleInputChange} />
                </div>
                 <div className="form-group">
                    <label>Nhân viên (Staff)</label>
                    <input type="number" step="0.1" name="staffScore" value={formData.staffScore} onChange={handleInputChange} />
                </div>
            </div>
        </div>

        {/* Amenities & Views */}
        <div className="form-section">
          <h3 className="section-title">Tiện nghi & Hướng nhìn</h3>
          <h4 className="subsection-title">Hướng nhìn (Views)</h4>
          <div className="amenities-grid">
             {Object.keys(views).map(key => (
                <label key={key} className="checkbox-label">
                  <input
                    type="checkbox"
                    name={key}
                    checked={views[key]}
                    onChange={handleViewChange}
                  />
                  <span>{key.replace('_', ' ')}</span>
                </label>
             ))}
          </div>

          <h4 className="subsection-title" style={{marginTop: '1rem'}}>Tiện nghi (Amenities)</h4>
          <div className="amenities-grid">
            {Object.keys(amenities).map(key => (
                 <label key={key} className="checkbox-label">
                  <input
                    type="checkbox"
                    name={key}
                    checked={amenities[key]}
                    onChange={handleAmenityChange}
                  />
                  <span>{key}</span>
                </label>
            ))}
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
                    <th>Số lượng</th>
                    <th>Giá phòng</th>
                    <th>Số người</th>
                    <th>Diện tích (m2)</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {rooms.map(room => (
                    <tr key={room.id}>
                      <td>
                        <input
                          type="text"
                          value={room.name}
                          onChange={(e) => updateRoom(room.id, 'name', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={room.quantity || ''}
                          onChange={(e) => updateRoom(room.id, 'quantity', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={room.price}
                          onChange={(e) => updateRoom(room.id, 'price', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={room.capacity}
                          onChange={(e) => updateRoom(room.id, 'capacity', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={room.area || ''}
                          onChange={(e) => updateRoom(room.id, 'area', e.target.value)}
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
            CẬP NHẬT
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditHotel;
