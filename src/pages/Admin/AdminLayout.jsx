import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from '../../components/Admin/Sidebar/Sidebar';
import AdminHeader from '../../components/Admin/AdminHeader/AdminHeader';
import './AdminLayout.css';

const AdminLayout = () => {
  // Check admin authentication
  const isAdmin = () => {
    const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (!token || !userStr) return false;
    
    try {
      const user = JSON.parse(userStr);
      // Check roles for ADMIN
      // Roles might be array of objects or strings
      return user.roles && user.roles.some(role => {
         const roleName = typeof role === 'object' ? role.name : role;
         return roleName === 'ADMIN';
      });
    } catch (e) {
      return false;
    }
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
