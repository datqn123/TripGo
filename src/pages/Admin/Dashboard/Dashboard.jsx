import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import adminApi from '../../../api/adminApi';

const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [statsData, setStatsData] = useState({
    totalReward: 0,
    totalBooking: 0, 
    totalHotel: 0,
    totalTour: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await adminApi.getTotalInfo();
        if (response.data && response.data.result) {
          setStatsData(response.data.result);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      }
    };

    fetchStats();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const stats = [
    {
      id: 1,
      title: 'Tổng Doanh thu',
      value: formatCurrency(statsData.totalRevenue || 0),
      change: '+12.5%', // Keep static for now or calculate if historical data available
      icon: 'bi-wallet2',
      color: '#10b981',
      bgColor: '#d1fae5'
    },
    {
      id: 2,
      title: 'Tổng Lượt đặt chỗ',
      value: (statsData.totalBooking || 0).toLocaleString(),
      change: '+4.5%',
      icon: 'bi-calendar-check',
      color: '#3b82f6',
      bgColor: '#dbeafe'
    },
    {
      id: 3,
      title: 'Khách sạn đang hoạt động',
      value: (statsData.totalHotel || 0).toLocaleString(),
      change: '+3.1%',
      icon: 'bi-building',
      color: '#06b6d4',
      bgColor: '#cffafe'
    },
    {
      id: 4,
      title: 'Tour đang hoạt động',
      value: (statsData.totalTour || 0).toLocaleString(),
      change: '+12.5%',
      icon: 'bi-signpost-2',
      color: '#f97316',
      bgColor: '#ffedd5'
    }
  ];

  const bookingDistribution = [
    { type: 'Khách sạn', value: 55, color: '#3b82f6' },
    { type: 'Tour', value: 30, color: '#06b6d4' },
    { type: 'Chuyến bay', value: 15, color: '#f97316' }
  ];

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <h1 className="dashboard-title">Tổng quan</h1>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        {stats.map((stat) => (
          <div key={stat.id} className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: stat.bgColor }}>
              <i className={stat.icon} style={{ color: stat.color }}></i>
            </div>
            <div className="stat-content">
              <div className="stat-title">{stat.title}</div>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-change" style={{ color: stat.color }}>
                <i className="bi bi-arrow-up"></i>
                {stat.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        {/* Revenue Chart */}
        <div className="chart-card revenue-card">
          <div className="chart-header">
            <div>
              <h3>Xu hướng Doanh thu</h3>
              <p className="chart-subtitle">Doanh thu từ Khách sạn, Tour và Chuyến bay</p>
            </div>
            <span className="chart-period">30 ngày gần nhất</span>
          </div>
          <div className="chart-placeholder">
            <svg viewBox="0 0 500 200" className="revenue-chart">
              <defs>
                <linearGradient id="revenueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#3b82f6', stopOpacity: 0.3 }} />
                  <stop offset="100%" style={{ stopColor: '#3b82f6', stopOpacity: 0.05 }} />
                </linearGradient>
              </defs>
              {/* Sample trend line - replace with actual chart library */}
              <path 
                d="M 10,150 L 50,130 L 100,120 L 150,100 L 200,95 L 250,85 L 300,80 L 350,70 L 400,65 L 450,50 L 490,40" 
                fill="none" 
                stroke="#3b82f6" 
                strokeWidth="3"
              />
              <path 
                d="M 10,150 L 50,130 L 100,120 L 150,100 L 200,95 L 250,85 L 300,80 L 350,70 L 400,65 L 450,50 L 490,40 L 490,200 L 10,200 Z" 
                fill="url(#revenueGradient)"
              />
            </svg>
            <div className="chart-labels">
              <span>1 Nov</span>
              <span>5 Nov</span>
              <span>10 Nov</span>
              <span>15 Nov</span>
              <span>20 Nov</span>
              <span>25 Nov</span>
              <span>30 Nov</span>
            </div>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="chart-card pie-card">
          <div className="chart-header">
            <div>
              <h3>Phân phối Đặt chỗ</h3>
              <p className="chart-subtitle">Tỷ lệ theo Loại</p>
            </div>
          </div>
          <div className="pie-chart-container">
            <div className="pie-chart">
              <svg viewBox="0 0 200 200" className="donut-chart">
                {/* Simple donut chart - replace with actual chart library */}
                <circle cx="100" cy="100" r="70" fill="none" stroke="#3b82f6" strokeWidth="40" 
                  strokeDasharray="242 440" transform="rotate(-90 100 100)" />
                <circle cx="100" cy="100" r="70" fill="none" stroke="#06b6d4" strokeWidth="40" 
                  strokeDasharray="132 440" strokeDashoffset="-242" transform="rotate(-90 100 100)" />
                <circle cx="100" cy="100" r="70" fill="none" stroke="#f97316" strokeWidth="40" 
                  strokeDasharray="66 440" strokeDashoffset="-374" transform="rotate(-90 100 100)" />
              </svg>
              <div className="chart-center">
                <div className="chart-total">8.5K</div>
                <div className="chart-label">Tổng</div>
              </div>
            </div>
            <div className="chart-legend">
              {bookingDistribution.map((item, index) => (
                <div key={index} className="legend-item">
                  <span className="legend-color" style={{ backgroundColor: item.color }}></span>
                  <span className="legend-percent">{item.value}%</span>
                  <span className="legend-label">{item.type}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
