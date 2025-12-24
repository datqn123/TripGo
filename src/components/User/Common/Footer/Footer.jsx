import React from "react";
import "./footer.css"
import { Container } from "react-bootstrap";
import { NavLink } from "react-router-dom";

const Footer = () => {


  return (
    <>
      <footer style={{
        background: '#0f172a',
        padding: '40px 0 24px 0',
        color: '#fff'
      }}>
        <Container>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '40px',
            marginBottom: '32px'
          }}>
            {/* Logo & Description */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <img
                  src="/Logo.png"
                  alt="TripGo Logo"
                  style={{ width: '36px', height: '36px', objectFit: 'contain' }}
                />
                <span style={{ fontSize: '20px', fontWeight: '700', color: '#fff' }}>TripGo</span>
              </div>
              <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.6', marginBottom: '20px' }}>
                Nền tảng đặt tour và khách sạn hàng đầu Việt Nam. Cam kết mang đến trải nghiệm du lịch tuyệt vời nhất cho bạn.
              </p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <a href="#" style={{
                  width: '32px', height: '32px', background: '#1e293b', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff'
                }}>
                  <i className="bi bi-facebook"></i>
                </a>
                <a href="#" style={{
                  width: '32px', height: '32px', background: '#1e293b', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff'
                }}>
                  <i className="bi bi-instagram"></i>
                </a>
                <a href="#" style={{
                  width: '32px', height: '32px', background: '#1e293b', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff'
                }}>
                  <i className="bi bi-youtube"></i>
                </a>
                <a href="#" style={{
                  width: '32px', height: '32px', background: '#1e293b', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff'
                }}>
                  <i className="bi bi-linkedin"></i>
                </a>
              </div>
            </div>

            {/* Về chúng tôi */}
            <div>
              <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#fff', marginBottom: '16px' }}>Về chúng tôi</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '10px' }}>
                  <NavLink to="/" style={{ color: '#94a3b8', fontSize: '14px', textDecoration: 'none' }}>Giới thiệu</NavLink>
                </li>
                <li style={{ marginBottom: '10px' }}>
                  <NavLink to="/" style={{ color: '#94a3b8', fontSize: '14px', textDecoration: 'none' }}>Đối tác</NavLink>
                </li>
                <li style={{ marginBottom: '10px' }}>
                  <NavLink to="/" style={{ color: '#94a3b8', fontSize: '14px', textDecoration: 'none' }}>Báo chí</NavLink>
                </li>
              </ul>
            </div>

            {/* Hỗ trợ */}
            <div>
              <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#fff', marginBottom: '16px' }}>Hỗ trợ</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '10px' }}>
                  <NavLink to="/" style={{ color: '#94a3b8', fontSize: '14px', textDecoration: 'none' }}>Trung tâm trợ giúp</NavLink>
                </li>
                <li style={{ marginBottom: '10px' }}>
                  <NavLink to="/" style={{ color: '#94a3b8', fontSize: '14px', textDecoration: 'none' }}>Điều khoản sử dụng</NavLink>
                </li>
                <li style={{ marginBottom: '10px' }}>
                  <NavLink to="/" style={{ color: '#94a3b8', fontSize: '14px', textDecoration: 'none' }}>Chính sách bảo mật</NavLink>
                </li>
                <li style={{ marginBottom: '10px' }}>
                  <NavLink to="/" style={{ color: '#94a3b8', fontSize: '14px', textDecoration: 'none' }}>Quy chế hoạt động</NavLink>
                </li>
              </ul>
            </div>

            {/* Liên hệ */}
            <div>
              <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#fff', marginBottom: '16px' }}>Liên hệ</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <i className="bi bi-telephone" style={{ color: '#0099cc', fontSize: '16px' }}></i>
                  <div>
                    <span style={{ color: '#fff', fontSize: '14px', fontWeight: '500' }}>1900 1234</span>
                    <span style={{ color: '#64748b', fontSize: '12px', display: 'block' }}>24/7 hỗ trợ</span>
                  </div>
                </li>
                <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <i className="bi bi-envelope" style={{ color: '#0099cc', fontSize: '16px' }}></i>
                  <div>
                    <span style={{ color: '#fff', fontSize: '14px' }}>support@tripgo.vn</span>
                    <span style={{ color: '#64748b', fontSize: '12px', display: 'block' }}>Email hỗ trợ</span>
                  </div>
                </li>
                <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <i className="bi bi-globe" style={{ color: '#0099cc', fontSize: '16px' }}></i>
                  <div>
                    <span style={{ color: '#fff', fontSize: '14px' }}>www.tripgo.vn</span>
                    <span style={{ color: '#64748b', fontSize: '12px', display: 'block' }}>Website chính thức</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom row - App buttons */}
          <div style={{
            borderTop: '1px solid #1e293b',
            paddingTop: '20px',
            display: 'flex',
            justifyContent: 'flex-start',
            gap: '12px'
          }}>
            <a href="#" style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: '#1e293b', padding: '8px 16px', borderRadius: '8px',
              textDecoration: 'none', color: '#fff'
            }}>
              <i className="bi bi-google-play" style={{ fontSize: '20px' }}></i>
              <div>
                <span style={{ fontSize: '10px', color: '#94a3b8', display: 'block' }}>GET IT ON</span>
                <span style={{ fontSize: '14px', fontWeight: '500' }}>Google Play</span>
              </div>
            </a>
            <a href="#" style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: '#1e293b', padding: '8px 16px', borderRadius: '8px',
              textDecoration: 'none', color: '#fff'
            }}>
              <i className="bi bi-apple" style={{ fontSize: '20px' }}></i>
              <div>
                <span style={{ fontSize: '10px', color: '#94a3b8', display: 'block' }}>Download on the</span>
                <span style={{ fontSize: '14px', fontWeight: '500' }}>App Store</span>
              </div>
            </a>
          </div>
        </Container>
      </footer>


    </>
  );
};

export default Footer;
