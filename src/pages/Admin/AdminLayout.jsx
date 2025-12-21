import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from '../../components/Admin/Sidebar/Sidebar';
import AdminHeader from '../../components/Admin/AdminHeader/AdminHeader';
import './AdminLayout.css';

const AdminLayout = () => {
  // Check admin authentication
  const isAdmin = () => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    return token && userRole === 'ADMIN';
  };

  // Redirect to admin login if not authenticated
  if (!isAdmin()) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="admin-layout">
      <Sidebar />
      
      <div className="admin-main">
        <AdminHeader />
        
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
