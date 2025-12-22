import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import AddAirlineModal from '../../../components/Admin/Modals/AddAirlineModal';
import AddAirportModal from '../../../components/Admin/Modals/AddAirportModal';
import AddFlightModal from '../../../components/Admin/Modals/AddFlightModal';
import adminAirportApi from '../../../api/adminAirportApi';
import adminAirlineApi from '../../../api/adminAirlineApi';
import './FlightManagement.css';

import adminFlightApi from '../../../api/adminFlightApi';

const FlightManagement = () => {
  const [activeTab, setActiveTab] = useState('airlines');
  
  // Modals
  const [showAddAirlineModal, setShowAddAirlineModal] = useState(false);
  const [showAddAirportModal, setShowAddAirportModal] = useState(false);
  const [showAddFlightModal, setShowAddFlightModal] = useState(false);

  // Data States
  const [airlines, setAirlines] = useState([]);
  const [editingAirline, setEditingAirline] = useState(null);
  
  const [airports, setAirports] = useState([]);
  const [editingAirport, setEditingAirport] = useState(null);

  const [flights, setFlights] = useState([]);
  const [editingFlight, setEditingFlight] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  // Fetch Data
  const fetchAirlines = async () => {
      try {
          const res = await adminAirlineApi.getAll();
          const data = res.data;
          setAirlines(data?.result || (Array.isArray(data) ? data : []) || []);
      } catch (error) {
          console.error("Failed to fetch airlines:", error);
      }
  };

  const fetchAirports = async () => {
    try {
        const res = await adminAirportApi.getAll();
        const data = res.data;
        setAirports(data?.result || (Array.isArray(data) ? data : []) || []);
    } catch (error) {
        console.error("Failed to fetch airports:", error);
    }
  };

  const fetchFlights = async () => {
      try {
          const res = await adminFlightApi.getAll();
          const data = res.data;
          setFlights(data?.result || (Array.isArray(data) ? data : []) || []);
      } catch (error) {
          console.error("Failed to fetch flights:", error);
      }
  };

  useEffect(() => {
      fetchAirlines();
      fetchAirports();
      fetchFlights();
  }, []);

  // Handlers - Airline
  const handleOpenAddAirline = () => {
      setEditingAirline(null);
      setShowAddAirlineModal(true);
  };

  const handleOpenEditAirline = (airline) => {
      setEditingAirline(airline);
      setShowAddAirlineModal(true);
  };

  const handleSaveAirline = async (airlineData) => {
    setIsLoading(true);
    try {
        if (editingAirline) {
            // Update
            await adminAirlineApi.update(editingAirline.id, airlineData);
            toast.success("Cập nhật hãng bay thành công");
        } else {
            // Create
            await adminAirlineApi.create(airlineData);
            toast.success("Tạo hãng bay thành công");
        }
        setShowAddAirlineModal(false);
        fetchAirlines(); // Refresh list
    } catch (error) {
        console.error("Save airline error:", error);
        toast.error("Lỗi khi lưu hãng bay");
    } finally {
        setIsLoading(false);
    }
  };

  const handleDeleteAirline = async (id) => {
      if (window.confirm("Bạn có chắc chắn muốn xóa hãng bay này?")) {
          try {
              await adminAirlineApi.delete(id);
              toast.success("Xóa hãng bay thành công");
              fetchAirlines();
          } catch (error) {
              console.error("Delete airline error:", error);
              toast.error("Không thể xóa hãng bay");
          }
      }
  };

  // Handlers - Airport
  const handleOpenAddAirport = () => {
      setEditingAirport(null);
      setShowAddAirportModal(true);
  };

  const handleOpenEditAirport = (airport) => {
      setEditingAirport(airport);
      setShowAddAirportModal(true);
  };

  const handleSaveAirport = async (airportData) => {
      setIsLoading(true);
      try {
          if (editingAirport) {
              await adminAirportApi.update(editingAirport.id, airportData);
              toast.success("Cập nhật sân bay thành công");
          } else {
              await adminAirportApi.create(airportData);
              toast.success("Tạo sân bay thành công");
          }
          setShowAddAirportModal(false);
          fetchAirports();
      } catch (error) {
          console.error("Save airport error:", error);
          toast.error("Lỗi khi lưu sân bay");
      } finally {
          setIsLoading(false);
      }
  };

  const handleDeleteAirport = async (id) => {
      if (window.confirm("Bạn có chắc chắn muốn xóa sân bay này?")) {
          try {
              await adminAirportApi.delete(id);
              toast.success("Xóa sân bay thành công");
              fetchAirports();
          } catch (error) {
              console.error("Delete airport error:", error);
              toast.error("Không thể xóa sân bay");
          }
      }
  };

  // Handlers - Flight
  const handleOpenAddFlight = () => {
      setEditingFlight(null);
      setShowAddFlightModal(true);
  };

  const handleOpenEditFlight = (flight) => {
      setEditingFlight(flight);
      setShowAddFlightModal(true);
  };

  const handleSaveFlight = async (flightData, imageFile) => {
    setIsLoading(true);
    try {
        if (editingFlight) {
            await adminFlightApi.update(editingFlight.id, flightData, imageFile);
            toast.success("Cập nhật chuyến bay thành công");
        } else {
            await adminFlightApi.create(flightData, imageFile);
            toast.success("Tạo chuyến bay thành công");
        }
        setShowAddFlightModal(false);
        fetchFlights();
    } catch (error) {
        console.error("Save flight error:", error);
        toast.error("Lỗi khi lưu chuyến bay");
    } finally {
        setIsLoading(false);
    }
  };

  const handleDeleteFlight = async (id) => {
      if (window.confirm("Bạn có chắc chắn muốn xóa chuyến bay này?")) {
          try {
              await adminFlightApi.delete(id);
              toast.success("Xóa chuyến bay thành công");
              fetchFlights();
          } catch (error) {
              console.error("Delete flight error:", error);
              toast.error("Không thể xóa chuyến bay");
          }
      }
  };

  const getStatusClass = (flight) => {
      // Logic for status based on time or explicit status field??
      // For now, assume 'Available' if departure time is in future
      const now = new Date();
      const dep = new Date(flight.departureTime);
      return dep > now ? 'status-available' : 'status-unavailable';
  };
  
  const getStatusText = (flight) => {
       const now = new Date();
       const dep = new Date(flight.departureTime);
       return dep > now ? 'Sắp bay' : 'Đã bay';
  };

  const formatDateTime = (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <div className="flight-management">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link to="/admin">Dashboard</Link>
        <span className="separator">{'>'}</span>
        <span className="current">Quản lý chuyến bay</span>
      </div>

      {/* Header */}
      <div className="page-header">
        <div className="header-left">
          <h1>Quản lý chuyến bay</h1>
          <p className="subtitle">Quản lý danh sách và thông tin tất cả các chuyến bay và hãng hàng không đối tác</p>
        </div>
      </div>

      {/* Airlines Section */}
      <div className="management-section">
        <div className="section-header">
          <div>
            <h2>Quản lý hãng hàng không</h2>
            <p className="section-subtitle">Quản lý danh sách và thông tin tất cả các hãng hàng không đối tác của công ty</p>
          </div>
          <button className="add-button" onClick={handleOpenAddAirline}>
            <i className="bi bi-plus-lg"></i>
            Thêm hãng mới
          </button>
        </div>

        <div className="table-container">
          <table className="flights-table">
            <thead>
              <tr>
                <th>LOGO</th>
                <th>TÊN HÃNG BAY</th>
                <th>MÃ HÃNG BAY (CODE)</th>
                <th>HÀNH ĐỘNG</th>
              </tr>
            </thead>
            <tbody>
              {airlines.length === 0 ? (
                  <tr>
                      <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>Chưa có hãng bay nào</td>
                  </tr>
              ) : (
                  airlines.map((airline) => (
                    <tr key={airline.id}>
                      <td>
                        <div className="airline-logo">
                            {airline.logoUrl ? (
                                <img 
                                    src={airline.logoUrl} 
                                    alt={airline.name} 
                                    style={{ width: '40px', height: '40px', objectFit: 'contain' }} 
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        // Robustly find the span sibling
                                        const span = e.target.parentNode.querySelector('span');
                                        if (span) span.style.display = 'inline';
                                    }}
                                />
                            ) : null}
                            <span style={{ display: airline.logoUrl ? 'none' : 'inline', fontSize: '24px' }}>✈️</span>
                        </div>
                      </td>
                      <td className="airline-name">{airline.name}</td>
                      <td>{airline.code}</td>
                      <td>
                        <div className="action-buttons">
                          <button className="action-btn edit-btn" title="Chỉnh sửa" onClick={() => handleOpenEditAirline(airline)}>
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button className="action-btn delete-btn" title="Xóa" onClick={() => handleDeleteAirline(airline.id)}>
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>

        <div className="pagination-container">
          <div className="pagination-info">
            Hiển thị <strong>1-5</strong> trong số <strong>44</strong> kết quả
          </div>
          <div className="pagination-controls">
            <button className="page-btn" disabled>
              <i className="bi bi-chevron-left"></i>
            </button>
            <button className="page-btn active">1</button>
            <button className="page-btn">2</button>
            <button className="page-btn">3</button>
            <span className="page-dots">...</span>
            <button className="page-btn">8</button>
            <button className="page-btn">
              <i className="bi bi-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Airports Section */}
      <div className="management-section">
        <div className="section-header">
          <div>
            <h2>Quản lý sân bay</h2>
            <p className="section-subtitle">Quản lý thông tin các sân bay trong hệ thống hệ thống</p>
          </div>
          <button className="add-button" onClick={handleOpenAddAirport}>
            <i className="bi bi-plus-lg"></i>
            Thêm sân bay
          </button>
        </div>

        <div className="table-container">
          <table className="flights-table">
            <thead>
              <tr>
                <th>TÊN SÂN BAY</th>
                <th>MÃ SÂN BAY</th>
                <th>ĐỊA ĐIỂM</th>
                <th>HÀNH ĐỘNG</th>
              </tr>
            </thead>
            <tbody>
              {airports.length === 0 ? (
                  <tr>
                      <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>Chưa có sân bay nào</td>
                  </tr>
              ) : (
                  airports.map((airport) => (
                    <tr key={airport.id}>
                      <td>
                        <div className="airport-info">
                          <i className="bi bi-airplane airport-icon"></i>
                          <div className="airport-name">{airport.name}</div>
                        </div>
                      </td>
                      <td>
                        <span className="airport-code">{airport.code}</span>
                      </td>
                      <td>{airport.location?.name || '---'}</td>
                      <td>
                        <div className="action-buttons">
                          <button className="action-btn edit-btn" title="Chỉnh sửa" onClick={() => handleOpenEditAirport(airport)}>
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button className="action-btn delete-btn" title="Xóa" onClick={() => handleDeleteAirport(airport.id)}>
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>

        <div className="pagination-container">
            {/* Pagination controls can be added here if API supports it */}
        </div>
      </div>

      {/* Flights Section */}
      <div className="management-section">
        <div className="section-header">
          <div>
            <h2>Quản lý chuyến bay</h2>
            <p className="section-subtitle">Quản lý thông tin các chuyến bay trong hệ thống</p>
          </div>
          <button className="add-button" onClick={handleOpenAddFlight}>
            <i className="bi bi-plus-lg"></i>
            Thêm chuyến bay
          </button>
        </div>

        <div className="table-container">
          <table className="flights-table">
            <thead>
              <tr>
                <th>MÃ CHUYẾN BAY</th>
                <th>HÃNG BAY</th>
                <th>LỘ TRÌNH</th>
                <th>THỜI GIAN</th>
                <th>TRẠNG THÁI</th>
                <th>HÀNH ĐỘNG</th>
              </tr>
            </thead>
            <tbody>
              {flights.length === 0 ? (
                  <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>Chưa có chuyến bay nào</td>
                  </tr>
              ) : (
                  flights.map((flight) => (
                    <tr key={flight.id}>
                      <td className="flight-number">{flight.flightNumber}</td>
                      <td>
                        <div className="airline-info">
                             {flight.airline?.logoUrl && <img src={flight.airline.logoUrl} alt="" style={{width: 20, marginRight: 5}} />}
                             {flight.airline?.name}
                        </div>
                      </td>
                      <td>
                          {flight.departureAirport?.code} <i className="bi bi-arrow-right-short"></i> {flight.arrivalAirport?.code}
                      </td>
                      <td>
                          <div>Đi: {formatDateTime(flight.departureTime)}</div>
                          <div>Đến: {formatDateTime(flight.arrivalTime)}</div>
                      </td>
                      <td>
                        <span className={`status-badge ${getStatusClass(flight)}`}>
                          {getStatusText(flight)}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button className="action-btn edit-btn" title="Chỉnh sửa" onClick={() => handleOpenEditFlight(flight)}>
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button className="action-btn delete-btn" title="Xóa" onClick={() => handleDeleteFlight(flight.id)}>
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>

        <div className="pagination-container">
          <div className="pagination-info">
            Hiển thị <strong>1-5</strong> trong số <strong>44</strong> kết quả
          </div>
          <div className="pagination-controls">
            <button className="page-btn" disabled>
              <i className="bi bi-chevron-left"></i>
            </button>
            <button className="page-btn active">1</button>
            <button className="page-btn">2</button>
            <button className="page-btn">3</button>
            <span className="page-dots">...</span>
            <button className="page-btn">8</button>
            <button className="page-btn">
              <i className="bi bi-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Add Airline Modal */}
      <AddAirlineModal
        isOpen={showAddAirlineModal}
        onClose={() => setShowAddAirlineModal(false)}
        onSave={handleSaveAirline}
        airline={editingAirline}
        isLoading={isLoading}
      />

      {/* Add Airport Modal */}
      <AddAirportModal
        isOpen={showAddAirportModal}
        onClose={() => setShowAddAirportModal(false)}
        onSave={handleSaveAirport}
        airport={editingAirport}
        isLoading={isLoading}
      />

      {/* Add Flight Modal */}
      <AddFlightModal
        isOpen={showAddFlightModal}
        onClose={() => setShowAddFlightModal(false)}
        onSave={handleSaveFlight}
        flight={editingFlight}
        isLoading={isLoading}
      />
    </div>
  );
};

export default FlightManagement;
