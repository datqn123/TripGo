import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AddAirlineModal from '../../../components/Admin/Modals/AddAirlineModal';
import AddAirportModal from '../../../components/Admin/Modals/AddAirportModal';
import AddFlightModal from '../../../components/Admin/Modals/AddFlightModal';
import './FlightManagement.css';

const FlightManagement = () => {
  const [activeTab, setActiveTab] = useState('airlines');
  const [showAddAirlineModal, setShowAddAirlineModal] = useState(false);
  const [showAddAirportModal, setShowAddAirportModal] = useState(false);
  const [showAddFlightModal, setShowAddFlightModal] = useState(false);

  // Sample data - Airlines
  const airlines = [
    {
      id: 1,
      logo: '✈️',
      name: 'VietJet Air',
      code: 'VJ'
    },
    {
      id: 2,
      logo: '🛫',
      name: 'Vietnam Airline',
      code: 'VNA'
    },
    {
      id: 3,
      logo: '✈️',
      name: 'Thai AirAsia',
      code: 'TAA'
    },
    {
      id: 4,
      logo: '⭐',
      name: 'Jetstar Hongkong',
      code: 'JH1'
    },
    {
      id: 5,
      logo: '🛩️',
      name: 'Jeju Air',
      code: 'JJA'
    }
  ];

  // Sample data - Airports
  const airports = [
    {
      id: 1,
      name: 'Sân bay quốc tế Tân Sơn Nhất',
      city: 'TP.HCM',
      code: 'SGN',
      location: 'Hà Nội'
    },
    {
      id: 2,
      name: 'Sân bay quốc tế Nội Bài',
      city: 'Hà Nội',
      code: 'HAN',
      location: 'Hà Nội'
    },
    {
      id: 3,
      name: 'Sân bay quốc tế Đà Nẵng',
      city: 'Đà Nẵng',
      code: 'DAD',
      location: 'Đà Nẵng'
    }
  ];

  // Sample data - Flights
  const flights = [
    {
      id: 1,
      flightNumber: 'VN125',
      airline: 'Vietnam Airline',
      route: 'HAN - HNM',
      date: '22/12/2024',
      time: '08:35 - 10:45',
      price: '1.250.000 đ',
      status: 'Sẵn có'
    },
    {
      id: 2,
      flightNumber: 'VJ456',
      airline: 'VietJet Air',
      route: 'HAN - DAD',
      date: '27/12/2024',
      time: '14:00 - 16:20',
      price: '850.000 đ',
      status: 'Sẵn có'
    },
    {
      id: 3,
      flightNumber: 'VN124',
      airline: 'Bamboo Airway',
      route: 'DAL - FPD',
      date: '22/12/2024',
      time: '18:15 - 19:35',
      price: '1.550.000 đ',
      status: 'Sẵn có'
    }
  ];

  const getStatusClass = (status) => {
    return status === 'Sẵn có' ? 'status-available' : 'status-unavailable';
  };

  const handleSaveAirline = (airlineData) => {
    // TODO: Save airline to backend API
    console.log('New Airline:', airlineData);
    // You can add logic here to update the airlines list
  };

  const handleSaveAirport = (airportData) => {
    // TODO: Save airport to backend API
    console.log('New Airport:', airportData);
    // You can add logic here to update the airports list
  };

  const handleSaveFlight = (flightData) => {
    // TODO: Save flight to backend API
    console.log('New Flight:', flightData);
    // You can add logic here to update the flights list
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
          <button className="add-button" onClick={() => setShowAddAirlineModal(true)}>
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
                <th>HỆ HÃNG BAY</th>
                <th>HÀNH ĐỘNG</th>
              </tr>
            </thead>
            <tbody>
              {airlines.map((airline) => (
                <tr key={airline.id}>
                  <td>
                    <div className="airline-logo">{airline.logo}</div>
                  </td>
                  <td className="airline-name">{airline.name}</td>
                  <td>{airline.code}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="action-btn view-btn" title="Xem chi tiết">
                        <i className="bi bi-eye"></i>
                      </button>
                      <button className="action-btn edit-btn" title="Chỉnh sửa">
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button className="action-btn delete-btn" title="Xóa">
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
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
          <button className="add-button" onClick={() => setShowAddAirportModal(true)}>
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
              {airports.map((airport) => (
                <tr key={airport.id}>
                  <td>
                    <div className="airport-info">
                      <i className="bi bi-airplane airport-icon"></i>
                      <div>
                        <div className="airport-name">{airport.name}</div>
                        <div className="airport-city">{airport.city}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="airport-code">{airport.code}</span>
                  </td>
                  <td>{airport.location}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="action-btn edit-btn" title="Chỉnh sửa">
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button className="action-btn delete-btn" title="Xóa">
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
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

      {/* Flights Section */}
      <div className="management-section">
        <div className="section-header">
          <div>
            <h2>Quản lý chuyến bay</h2>
            <p className="section-subtitle">Quản lý thông tin các chuyến bay trong hệ thống</p>
          </div>
          <button className="add-button" onClick={() => setShowAddFlightModal(true)}>
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
                <th>CHUYẾN BAY</th>
                <th>NGÀY BAY</th>
                <th>GIỜ BAY</th>
                <th>TRẠNG THÁI</th>
                <th>HÀNH ĐỘNG</th>
              </tr>
            </thead>
            <tbody>
              {flights.map((flight) => (
                <tr key={flight.id}>
                  <td className="flight-number">{flight.flightNumber}</td>
                  <td>{flight.airline}</td>
                  <td>{flight.route}</td>
                  <td>{flight.date}</td>
                  <td>{flight.time}</td>
                  <td>
                    <span className={`status-badge ${getStatusClass(flight.status)}`}>
                      {flight.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="action-btn edit-btn" title="Chỉnh sửa">
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button className="action-btn delete-btn" title="Xóa">
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
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
      />

      {/* Add Airport Modal */}
      <AddAirportModal
        isOpen={showAddAirportModal}
        onClose={() => setShowAddAirportModal(false)}
        onSave={handleSaveAirport}
      />

      {/* Add Flight Modal */}
      <AddFlightModal
        isOpen={showAddFlightModal}
        onClose={() => setShowAddFlightModal(false)}
        onSave={handleSaveFlight}
      />
    </div>
  );
};

export default FlightManagement;
