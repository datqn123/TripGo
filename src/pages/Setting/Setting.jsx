import { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import './setting.css';
import Profile from './Profile';
import Favorite from './Favorite';
import MyHistory from './MyHistory';

const Setting = () => {
    const location = useLocation();
    const [activeTab, setActiveTab] = useState('account'); // Default active tab

    useEffect(() => {
        if (location.state?.activeTab) {
            setActiveTab(location.state.activeTab);
        }
    }, [location]);

    const renderContent = () => {
        switch (activeTab) {
            case 'account':
                return <Profile />;
            case 'favorite':
                return <Favorite />;
            case 'history':
                return <MyHistory />;
            // Add other cases as needed
            default:
                return <Profile />;
        }
    };

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
                                    <div className="text-muted small mt-2" style={{ color: '#009abb' }}>Hạng Explorer</div>
                                </div>
                            </div>
                            <div className="sidebar-menu">
                                <div className={`sidebar-item ${activeTab === 'points' ? 'active' : ''}`} onClick={() => setActiveTab('points')}>
                                    <i className="bi bi-award"></i> Điểm của tôi
                                </div>
                                <div className={`sidebar-item ${activeTab === 'account' ? 'active' : ''}`} onClick={() => setActiveTab('account')}>
                                    <i className="bi bi-person"></i> Tài khoản
                                </div>
                                <div className={`sidebar-item ${activeTab === 'favorite' ? 'active' : ''}`} onClick={() => setActiveTab('favorite')}>
                                    <i className="bi bi-heart"></i> Yêu thích
                                </div>
                                <div className={`sidebar-item ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>
                                    <i className="bi bi-receipt"></i> Giao dịch của tôi
                                </div>
                                <div className="sidebar-item logout-text">
                                    <i className="bi bi-power"></i> Đăng xuất
                                </div>
                            </div>
                        </div>
                    </Col>

                    {/* Main Content */}
                    <Col lg={9}>
                        {renderContent()}
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Setting;
