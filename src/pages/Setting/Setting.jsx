import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import './setting.css';
import Profile from './Profile';

const Setting = () => {


    return (
        <div className="setting-page py-4">
            <Container>
                <Row className="g-4">
                    {/* Sidebar */}
                    <Col lg={3}>
                        <div className="setting-sidebar">
                            <div className="user-profile-header">
                                <img
                                    src="https://ui-avatars.com/api/?name=Nguyen+ABC&background=random&size=64"
                                    className="user-avatar-lg"
                                    alt="User"
                                />
                                <div>
                                    <div className="fw-bold text-dark">Nguyễn ABC</div>
                                    <div className="text-muted small" style={{ color: '#009abb' }}>Hạng Explorer</div>
                                </div>
                            </div>
                            <div className="sidebar-menu">
                                <div className="sidebar-item">
                                    <i className="bi bi-award"></i> Điểm của tôi
                                </div>
                                <div className="sidebar-item active">
                                    <i className="bi bi-person"></i> Tài khoản
                                </div>
                                <div className="sidebar-item">
                                    <i className="bi bi-heart"></i> Yêu thích
                                </div>
                                <div className="sidebar-item">
                                    <i className="bi bi-credit-card"></i> Thẻ của tôi
                                </div>
                                <div className="sidebar-item">
                                    <i className="bi bi-receipt"></i> Giao dịch của tôi
                                </div>
                                <div className="sidebar-item logout-text">
                                    <i className="bi bi-power"></i> Đăng xuất
                                </div>
                            </div>
                        </div>
                    </Col>

                    {/* Main Content */}
                    <Profile />
                </Row>
            </Container>
        </div>
    );
};

export default Setting;
