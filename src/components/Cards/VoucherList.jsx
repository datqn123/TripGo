import React, { useEffect, useState, useRef } from 'react';
import { fetchVouchers } from '../../utils/voucherdata';
import VoucherCard from './VoucherCard';
import './card.css';

const VoucherList = () => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const sliderRef = useRef(null);

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

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -336, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 336, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <section className="voucher-section">
        <div className="container">
          <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Đang tải...</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="voucher-section">
        <div className="container">
          <div className="alert alert-danger my-4" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
          </div>
        </div>
      </section>
    );
  }

  if (vouchers.length === 0) {
    return null;
  }

  return (
    <section className="voucher-section">
      <div className="container">
        <h2 className="section-title">Ưu đãi dành cho bạn</h2>
        <div className="voucher-slider-wrapper">
          {/* Navigation buttons */}
          <button className="voucher-nav-btn prev" onClick={scrollLeft}>
            <i className="bi bi-chevron-left"></i>
          </button>

          <div className="voucher-slider" ref={sliderRef}>
            {vouchers.map((voucher) => (
              <div key={voucher.id} className="voucher-card-wrapper">
                <VoucherCard
                  voucher={{
                    ...voucher,
                    isExpiringSoon: voucher.isActive
                  }}
                />
              </div>
            ))}
          </div>

          <button className="voucher-nav-btn next" onClick={scrollRight}>
            <i className="bi bi-chevron-right"></i>
          </button>
        </div>
      </div>
    </section>
  );
};

export default VoucherList;

