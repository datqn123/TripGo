import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import tourApi from '../../../api/tourApi';
import homeApi from '../../../api/homeApi';
import './AddTour.css'; // Reuse existing styles

const EditTour = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [locations, setLocations] = useState([]);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    duration: '',
    priceAdult: 0,
    priceChild: 0,
    price: 0,
    originalPrice: 0,
    maxPeople: '',
    description: '',
    transportation: 'xe-du-lich',
    startLocationId: '',
    destinationId: '',
    highlights: [],
    includes: [],
    excludes: [],
    schedules: [], // List of { startDate, endDate, availableSeats }
    itineraries: [], // List of { dayNumber, title, description }
  });

  // Image State
  const [existingImages, setExistingImages] = useState([]); // List of Strings (URLs)
  const [selectedFiles, setSelectedFiles] = useState([]); // List of File objects
  const [previewImages, setPreviewImages] = useState([]); // List of Strings (Blob URLs)

  // UI Helper states
  const [newHighlight, setNewHighlight] = useState('');
  const [newInclude, setNewInclude] = useState('');
  const [newExclude, setNewExclude] = useState('');
  
  useEffect(() => {
    fetchInitialData();
    // Cleanup blob URLs on unmount
    return () => {
        previewImages.forEach(url => URL.revokeObjectURL(url));
    };
  }, [id]);

  // Helper to parse potential string lists from backend
  const parseList = (input) => {
      if (!input) return [];
      if (Array.isArray(input)) return input;
      if (typeof input === 'string') {
          // Attempt to parse if JSON
          try {
             const parsed = JSON.parse(input);
             if (Array.isArray(parsed)) return parsed;
          } catch(e) {}

          // Fallback to splitting by special separator used in DB
          if (input.includes('||')) return input.split('||');
          return [input];
      }
      return [];
  };

  const fetchInitialData = async () => {
      setLoading(true);
      try {
          // Fetch locations for dropdowns
          const locRes = await homeApi.getDropdownLocations();
          if (locRes.data && locRes.data.result) {
              setLocations(locRes.data.result);
          }

          // Fetch Tour Details
          const res = await tourApi.getTour(id);
          if (res.data) {
             const tour = res.data.result || res.data;
             
             setFormData({
                 title: tour.title || '',
                 slug: tour.slug || '',
                 duration: tour.duration || '',
                 priceAdult: tour.priceAdult || 0,
                 priceChild: tour.priceChild || 0,
                 price: tour.price || 0,
                 originalPrice: tour.originalPrice || 0,
                 maxPeople: tour.maxPeople || '',
                 description: tour.description || '',
                 transportation: tour.transportation || 'xe-du-lich',
                 startLocationId: tour.startLocation?.id || tour.startLocationId || '',
                 destinationId: tour.destination?.id || tour.destinationId || '',
                 highlights: parseList(tour.highlights),
                 includes: parseList(tour.includes),
                 excludes: parseList(tour.excludes),
                 schedules: Array.isArray(tour.schedules) ? tour.schedules.map(({ startDate, endDate, availableSeats }) => ({ startDate, endDate, availableSeats })) : [],
                 itineraries: Array.isArray(tour.itineraries) ? tour.itineraries.map(({ dayNumber, title, description }) => ({ dayNumber, title, description })) : [],
             });
             setExistingImages(tour.imageUrls || []);
          }

      } catch (error) {
          console.error("Failed to fetch data:", error);
          toast.error("Không thể tải thông tin tour");
      } finally {
          setLoading(false);
      }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // --- List Handlers ---
  const addItem = (field, value, createSetter) => {
      if (!value.trim()) return;
      setFormData(prev => ({
          ...prev,
          [field]: [...prev[field], value]
      }));
      createSetter('');
  };

  const removeItem = (field, index) => {
      setFormData(prev => ({
          ...prev,
          [field]: prev[field].filter((_, i) => i !== index)
      }));
  };

  // --- Schedule Handlers ---
  const addSchedule = () => {
      setFormData(prev => ({
          ...prev,
          schedules: [...prev.schedules, { startDate: '', endDate: '', availableSeats: 0 }]
      }));
  };

  const updateSchedule = (index, field, value) => {
      const newSchedules = [...formData.schedules];
      newSchedules[index][field] = value;
      setFormData(prev => ({ ...prev, schedules: newSchedules }));
  };

  const removeSchedule = (index) => {
      setFormData(prev => ({
          ...prev,
          schedules: prev.schedules.filter((_, i) => i !== index)
      }));
  };

  // --- Itinerary Handlers ---
  const addItineraryDay = () => {
      setFormData(prev => ({
          ...prev,
          itineraries: [...prev.itineraries, { 
              dayNumber: prev.itineraries.length + 1, 
              title: '', 
              description: '' 
          }]
      }));
  };

  const updateItinerary = (index, field, value) => {
      const newItineraries = [...formData.itineraries];
      newItineraries[index][field] = value;
      setFormData(prev => ({ ...prev, itineraries: newItineraries }));
  };

  const removeItineraryDay = (index) => {
      const newItineraries = formData.itineraries.filter((_, i) => i !== index);
      newItineraries.forEach((day, i) => day.dayNumber = i + 1);
      setFormData(prev => ({ ...prev, itineraries: newItineraries }));
  };

  // --- Image Handlers (File Upload) ---
  const handleFileChange = (e) => {
      const files = Array.from(e.target.files);
      if (files.length === 0) return;

      setSelectedFiles(prev => [...prev, ...files]);
      
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setPreviewImages(prev => [...prev, ...newPreviews]);
  };

  const removeSelectedFile = (index) => {
      setSelectedFiles(prev => prev.filter((_, i) => i !== index));
      setPreviewImages(prev => {
          const newPreviews = prev.filter((_, i) => i !== index);
          URL.revokeObjectURL(prev[index]); // Cleanup
          return newPreviews;
      });
  };

  const removeExistingImage = (index) => {
      setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const submissionData = new FormData();
        
        // Prepare Tour JSON
        // Prepare Tour JSON with strict fields as requested
        const tourData = {
            title: formData.title,
            slug: formData.slug,
            duration: formData.duration,
            priceAdult: Number(formData.priceAdult),
            priceChild: Number(formData.priceChild),
            price: Number(formData.price),
            originalPrice: Number(formData.originalPrice),
            maxPeople: formData.maxPeople,
            description: formData.description,
            transportation: formData.transportation,
            startLocationId: Number(formData.startLocationId),
            destinationId: Number(formData.destinationId),
            highlights: formData.highlights,
            includes: formData.includes,
            excludes: formData.excludes,
            imageUrls: existingImages, // Retain remaining existing images
            schedules: formData.schedules.map(({ startDate, endDate, availableSeats }) => ({ startDate, endDate, availableSeats: Number(availableSeats) })),
            itineraries: formData.itineraries.map(({ dayNumber, title, description }) => ({ dayNumber: Number(dayNumber), title, description }))
        };

        const jsonBlob = new Blob([JSON.stringify(tourData)], { type: 'application/json' });
        submissionData.append("tour", jsonBlob);

        // Append New Files
        selectedFiles.forEach(file => {
            submissionData.append("images", file);
        });

        console.log("Submitting Tour FormData:", tourData);
        await tourApi.updateTour(id, submissionData);
        toast.success("Cập nhật tour thành công!");
        navigate('/admin/tours');
    } catch (error) {
        console.error("Update failed:", error);
        toast.error("Cập nhật thất bại");
    }
  };

  const handleCancel = () => {
    navigate('/admin/tours');
  };

  if (loading) return <div className="p-5 text-center">Loading...</div>;

  return (
    <div className="add-tour">
      <div className="add-tour-header">
        <button className="back-button" onClick={handleCancel}>
          <i className="bi bi-arrow-left"></i>
          Chi tiết / Chỉnh sửa Tour
        </button>
      </div>

      <form onSubmit={handleSubmit} className="tour-form">
        {/* Basic Information */}
        <div className="form-section">
          <h2 className="section-title">Thông tin cơ bản</h2>
          <div className="form-grid">
            <div className="form-group full-width">
              <label>Tên Tour</label>
              <input type="text" name="title" value={formData.title} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label>Slug</label>
              <input type="text" name="slug" value={formData.slug} onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label>Thời lượng</label>
              <input type="text" name="duration" value={formData.duration} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label>Số người tối đa</label>
              <input type="text" name="maxPeople" value={formData.maxPeople} onChange={handleInputChange} />
            </div>
             <div className="form-group">
              <label>Phương tiện</label>
              <input type="text" name="transportation" value={formData.transportation} onChange={handleInputChange} />
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="form-section">
          <h2 className="section-title">Giá cả</h2>
          <div className="form-grid">
            <div className="form-group"><label>Giá hiển thị (VNĐ)</label><input type="number" name="price" value={formData.price} onChange={handleInputChange} /></div>
            <div className="form-group"><label>Giá gốc (VNĐ)</label><input type="number" name="originalPrice" value={formData.originalPrice} onChange={handleInputChange} /></div>
            <div className="form-group"><label>Giá người lớn (VNĐ)</label><input type="number" name="priceAdult" value={formData.priceAdult} onChange={handleInputChange} /></div>
            <div className="form-group"><label>Giá trẻ em (VNĐ)</label><input type="number" name="priceChild" value={formData.priceChild} onChange={handleInputChange} /></div>
          </div>
        </div>

        {/* Locations */}
        <div className="form-section">
           <h2 className="section-title">Địa điểm</h2>
           <div className="form-grid">
                <div className="form-group">
                    <label>Điểm khởi hành</label>
                    <select name="startLocationId" value={formData.startLocationId} onChange={handleInputChange}>
                        <option value="">Chọn điểm đi</option>
                        {locations.map(loc => (<option key={loc.id} value={loc.id}>{loc.name}</option>))}
                    </select>
                </div>
                <div className="form-group">
                    <label>Điểm đến</label>
                    <select name="destinationId" value={formData.destinationId} onChange={handleInputChange}>
                         <option value="">Chọn điểm đến</option>
                        {locations.map(loc => (<option key={loc.id} value={loc.id}>{loc.name}</option>))}
                    </select>
                </div>
           </div>
        </div>

        {/* Description & Lists */}
        <div className="form-section">
             <h2 className="section-title">Mô tả chi tiết</h2>
             <div className="form-group full-width">
                 <label>Mô tả chung</label>
                 <textarea name="description" rows="5" value={formData.description} onChange={handleInputChange} />
             </div>

             {/* Highlights */}
             <div className="list-manager">
                 <label>Điểm nổi bật (Highlights)</label>
                 <div className="input-with-button">
                     <input type="text" value={newHighlight} onChange={(e) => setNewHighlight(e.target.value)} placeholder="Thêm điểm nổi bật..." />
                     <button type="button" onClick={() => addItem('highlights', newHighlight, setNewHighlight)}>Thêm</button>
                 </div>
                 <ul>
                     {Array.isArray(formData.highlights) && formData.highlights.map((item, idx) => (
                         <li key={idx}>{item} <i className="bi bi-x" onClick={() => removeItem('highlights', idx)}></i></li>
                     ))}
                 </ul>
             </div>

             {/* Includes/Excludes simplified for brevity in this update, assume same logic */}
             <div className="list-manager mt-3">
                 <label>Bao gồm (Includes)</label>
                 <div className="input-with-button">
                     <input type="text" value={newInclude} onChange={(e) => setNewInclude(e.target.value)} placeholder="Thêm mục..." />
                     <button type="button" onClick={() => addItem('includes', newInclude, setNewInclude)}>Thêm</button>
                 </div>
                 <ul>{Array.isArray(formData.includes) && formData.includes.map((item, idx) => (<li key={idx}>{item} <i className="bi bi-x" onClick={() => removeItem('includes', idx)}></i></li>))}</ul>
             </div>

             <div className="list-manager mt-3">
                 <label>Không bao gồm (Excludes)</label>
                 <div className="input-with-button">
                     <input type="text" value={newExclude} onChange={(e) => setNewExclude(e.target.value)} placeholder="Thêm mục..." />
                     <button type="button" onClick={() => addItem('excludes', newExclude, setNewExclude)}>Thêm</button>
                 </div>
                 <ul>{Array.isArray(formData.excludes) && formData.excludes.map((item, idx) => (<li key={idx}>{item} <i className="bi bi-x" onClick={() => removeItem('excludes', idx)}></i></li>))}</ul>
             </div>
        </div>

        {/* Schedules */}
         <div className="form-section">
           <div className="section-header">
             <h2 className="section-title">Lịch trình khởi hành</h2>
             <button type="button" className="add-btn-small" onClick={addSchedule}>+ Thêm lịch</button>
           </div>
           {Array.isArray(formData.schedules) && formData.schedules.map((sch, idx) => (
               <div key={idx} className="schedule-item">
                   <div className="form-grid">
                       <div className="form-group"><label>Ngày bắt đầu</label><input type="date" value={sch.startDate} onChange={(e) => updateSchedule(idx, 'startDate', e.target.value)} /></div>
                       <div className="form-group"><label>Ngày kết thúc</label><input type="date" value={sch.endDate} onChange={(e) => updateSchedule(idx, 'endDate', e.target.value)} /></div>
                       <div className="form-group"><label>Số chỗ trống</label><input type="number" value={sch.availableSeats} onChange={(e) => updateSchedule(idx, 'availableSeats', e.target.value)} /></div>
                       <div className="form-group d-flex align-items-end"><button type="button" className="remove-btn" onClick={() => removeSchedule(idx)}>Xóa</button></div>
                   </div>
               </div>
           ))}
        </div>

        {/* Itineraries */}
        <div className="form-section">
             <div className="section-header">
                <h2 className="section-title">Lịch trình chi tiết</h2>
                <button type="button" className="add-btn-small" onClick={addItineraryDay}>+ Thêm ngày</button>
             </div>
             {Array.isArray(formData.itineraries) && formData.itineraries.map((day, idx) => (
                 <div key={idx} className="itinerary-day-edit">
                     <div className="day-header-edit">
                         <h4>Ngày {day.dayNumber}</h4>
                         <button type="button" className="remove-btn-icon" onClick={() => removeItineraryDay(idx)}><i className="bi bi-trash"></i></button>
                     </div>
                     <div className="form-group"><label>Tiêu đề</label><input type="text" value={day.title} onChange={(e) => updateItinerary(idx, 'title', e.target.value)} /></div>
                     <div className="form-group"><label>Mô tả</label><textarea rows="3" value={day.description} onChange={(e) => updateItinerary(idx, 'description', e.target.value)} /></div>
                 </div>
             ))}
        </div>

        {/* Images - UPDATED */}
        <div className="form-section">
           <div className="section-header">
                <h2 className="section-title">Hình ảnh</h2>
           </div>
           
           <div className="image-upload-area">
                <label className="upload-label">
                    <input 
                        type="file" 
                        multiple 
                        accept="image/*"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                    />
                    <i className="bi bi-cloud-upload"></i>
                    <p>Kéo thả hoặc click để chọn ảnh</p>
                    <span className="upload-hint">Hỗ trợ JPG, PNG, WEBP</span>
                </label>
           </div>

           <div className="uploaded-images">
               {/* Existing Images */}
               {existingImages.map((url, idx) => (
                   <div key={`exist-${idx}`} className="image-card-edit">
                       <img src={url} alt={`exist-${idx}`} />
                       <button type="button" className="remove-img-btn" onClick={() => removeExistingImage(idx)}>×</button>
                   </div>
               ))}
               
               {/* New File Previews */}
               {previewImages.map((url, idx) => (
                   <div key={`new-${idx}`} className="image-card-edit">
                       <img src={url} alt={`new-${idx}`} />
                       <button type="button" className="remove-img-btn" onClick={() => removeSelectedFile(idx)}>×</button>
                   </div>
               ))}
           </div>
        </div>


        {/* Action Buttons */}
        <div className="form-actions sticky-bottom">
          <button type="button" className="cancel-btn" onClick={handleCancel}>Quay lại</button>
          <button type="submit" className="submit-btn" disabled={loading}>Lưu thay đổi</button>
        </div>
      </form>
    </div>
  );
};

export default EditTour;
