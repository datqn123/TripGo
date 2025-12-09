import React, { useEffect, useState } from 'react';
import { fetchVouchers } from '../../utils/voucherdata';
import VoucherCard from './VoucherCard';

const VoucherList = () => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadVouchers = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch vouchers from API
        const response = await fetchVouchers();
        console.log(response);
        
        if (response.code) {
          // Success - use the result array
          setVouchers(response.result);
        } else {
          // API returned an error code
          setError(response.message || 'Không thể tải danh sách vouchers');
        }
      } catch (err) {
        setError(err.message || 'Đã xảy ra lỗi khi tải vouchers');
        console.error('Error loading vouchers:', err);
      } finally {
        setLoading(false);
      }
    };

    loadVouchers();
  }, []);

  if (loading) {
    return (
      <div className="container">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
          <p className="mt-3">Đang tải vouchers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="alert alert-danger my-4" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
        </div>
      </div>
    );
  }

  if (vouchers.length === 0) {
    return (
      <div className="container">
        <div className="text-center py-5">
          <i className="bi bi-inbox" style={{ fontSize: '48px', color: '#ccc' }}></i>
          <p className="mt-3 text-muted">Không có vouchers nào</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="row">
        {vouchers.map((voucher) => (
          <div key={voucher.id} className="col-md-6 col-lg-4">
            <VoucherCard 
              voucher={{
                ...voucher,
                // Add isExpiringSoon based on isActive
                isExpiringSoon: voucher.isActive
              }} 
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default VoucherList;
