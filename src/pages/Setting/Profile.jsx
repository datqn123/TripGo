import React, { useState } from 'react';
import { Container, Row, Col, Form, Modal, Button } from 'react-bootstrap';
import './setting.css';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        fullName: "Nguyễn ABC",
        email: "abc@gmail.com",
        phone: ""
    });

    const [showEmailModal, setShowEmailModal] = useState(false);
    const [showPhoneModal, setShowPhoneModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
    const [showDeleteSuccessModal, setShowDeleteSuccessModal] = useState(false);

    // Checkbox state for delete confirmation
    const [isDeleteConfirmed, setIsDeleteConfirmed] = useState(false);

    const handleDeleteAccount = () => {
        setShowDeleteConfirmModal(false);
        setTimeout(() => {
            setShowDeleteSuccessModal(true);
        }, 300);
    };

    return (
        <>
            <Col lg={9}>
                <h4 className="fw-bold mb-4" style={{ color: '#009abb', fontSize: '32px' }}>Tài khoản</h4>
                {/* Account Info Card */}
                <div className="setting-card">
                    <div className="setting-card-header">
                        <span>Thông tin tài khoản</span>
                    </div>
                    <div className="setting-card-body">
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label className="form-label-custom">Tên đầy đủ</Form.Label>
                                <Form.Control
                                    type="text"
                                    className="form-control-custom"
                                    defaultValue="Nguyễn ABC"
                                />
                            </Form.Group>

                            <Row className="g-4 mb-3">
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label className="form-label-custom">Giới tính</Form.Label>
                                        <Form.Select className="form-control-custom">
                                            <option>Nam</option>
                                            <option>Nữ</option>
                                            <option>Khác</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Label className="form-label-custom">Ngày sinh</Form.Label>
                                    <Row className="g-2">
                                        <Col>
                                            <Form.Select className="form-control-custom">
                                                <option>Ngày</option>
                                                {[...Array(31)].map((_, i) => <option key={i} value={i + 1}>{i + 1}</option>)}
                                            </Form.Select>
                                        </Col>
                                        <Col>
                                            <Form.Select className="form-control-custom">
                                                <option>Tháng</option>
                                                {[...Array(12)].map((_, i) => <option key={i} value={i + 1}>{i + 1}</option>)}
                                            </Form.Select>
                                        </Col>
                                        <Col>
                                            <Form.Select className="form-control-custom">
                                                <option>Năm</option>
                                                {[...Array(100)].map((_, i) => <option key={i} value={2025 - i}>{2025 - i}</option>)}
                                            </Form.Select>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>

                            <Form.Group className="mb-4">
                                <Form.Label className="form-label-custom">Thành phố cư trú</Form.Label>
                                <Form.Control
                                    type="text"
                                    className="form-control-custom"
                                    placeholder="Thành phố cư trú"
                                />
                            </Form.Group>

                            <div className="text-end">
                                <button className="btn-save" type="button">Lưu</button>
                            </div>
                        </Form>
                    </div>
                </div>

                {/* Email Card */}
                <div className="setting-card">
                    <div className="setting-card-header">
                        <span className="text-primary-custom" style={{ color: '#009abb' }}>Email</span>
                        <button className="btn-outline-custom" onClick={() => setShowEmailModal(true)}>
                            <i className="bi bi-plus-lg"></i> Thêm email
                        </button>
                    </div>
                    <div className="setting-card-body">
                        <div className="text-dark">1. {userData.email}</div>
                    </div>
                </div>

                {/* Phone Card */}
                <div className="setting-card mb-4">
                    <div className="setting-card-header">
                        <span className="text-primary-custom" style={{ color: '#009abb' }}>Số điện thoại</span>
                        <button className="btn-outline-custom" onClick={() => setShowPhoneModal(true)}>
                            <i className="bi bi-plus-lg"></i> Thêm sđt
                        </button>
                    </div>
                    <div className="setting-card-body">
                        {/* Empty state or existing phone */}
                    </div>
                </div>

                {/* Password Card */}
                <div className="setting-card mb-4">
                    <div className="setting-card-header">
                        <span className="text-primary-custom" style={{ color: '#009abb' }}>Mật khẩu</span>
                        <button className="btn-outline-custom" onClick={() => setShowPasswordModal(true)}>
                            Đổi mật khẩu
                        </button>
                    </div>
                </div>

                {/* Delete Account Card */}
                <div className="setting-card">
                    <div className="setting-card-header">
                        <span className="text-primary-custom" style={{ color: '#009abb' }}>Xoá tài khoản</span>
                        <button className="btn-delete" onClick={() => setShowDeleteConfirmModal(true)}>
                            Xoá
                        </button>
                    </div>
                    <div className="setting-card-body pt-0 mt-2">
                        <small className="text-muted">
                            Sau khi tài khoản của bạn bị xóa, bạn sẽ không thể phục hồi tài khoản hoặc dữ liệu của mình
                        </small>
                    </div>
                </div>
            </Col>

            {/* --- Modals --- */}

            {/* Add Email Modal */}
            <Modal show={showEmailModal} onHide={() => setShowEmailModal(false)} centered>
                <Modal.Header closeButton className="border-bottom-0 pb-0">
                    <Modal.Title style={{ color: '#009abb', fontWeight: 'bold' }}>Thêm email</Modal.Title>
                </Modal.Header>
                <Modal.Body className="pt-4">
                    <Form.Control
                        type="email"
                        placeholder="Thêm email mới"
                        className="form-control-custom mb-4"
                        style={{ padding: '12px' }}
                    />
                    <div className="text-end">
                        <Button className="btn-save" onClick={() => setShowEmailModal(false)}>Lưu</Button>
                    </div>
                </Modal.Body>
            </Modal>

            {/* Add Phone Modal */}
            <Modal show={showPhoneModal} onHide={() => setShowPhoneModal(false)} centered>
                <Modal.Header closeButton className="border-bottom-0 pb-0">
                    <Modal.Title style={{ color: '#009abb', fontWeight: 'bold' }}>Thêm số điện thoại</Modal.Title>
                </Modal.Header>
                <Modal.Body className="pt-4">
                    <Form.Control
                        type="text"
                        placeholder="Thêm số điện thoại mới"
                        className="form-control-custom mb-4"
                        style={{ padding: '12px' }}
                    />
                    <div className="text-end">
                        <Button className="btn-save" onClick={() => setShowPhoneModal(false)}>Lưu</Button>
                    </div>
                </Modal.Body>
            </Modal>

            {/* Change Password Modal */}
            <Modal show={showPasswordModal} onHide={() => setShowPasswordModal(false)} centered size="lg">
                <Modal.Header className="border-bottom-0 pb-0">
                    <Modal.Title style={{ color: '#009abb', fontWeight: 'bold' }}>Đổi mật khẩu</Modal.Title>
                </Modal.Header>
                <Modal.Body className="pt-4">
                    <Form.Group className="mb-3">
                        <Form.Label className="fw-bold text-dark">Mật khẩu hiện tại</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Nhập mật khẩu hiện tại"
                            className="form-control-custom"
                            style={{ padding: '12px' }}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label className="fw-bold text-dark">Mật khẩu mới</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Nhập mật khẩu mới"
                            className="form-control-custom"
                            style={{ padding: '12px' }}
                        />
                    </Form.Group>
                    <Form.Group className="mb-4">
                        <Form.Label className="fw-bold text-dark">Xác nhận mật khẩu mới</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Thêm email mới" // Keeping as requested in visual flow, though weird placeholder for password confirm
                            className="form-control-custom"
                            style={{ padding: '12px' }}
                        />
                    </Form.Group>
                    <div className="text-end">
                        <Button className="btn-save" onClick={() => setShowPasswordModal(false)}>Lưu</Button>
                    </div>
                </Modal.Body>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteConfirmModal} onHide={() => setShowDeleteConfirmModal(false)} centered>
                <Modal.Body className="text-center p-4">
                    <div className="mb-3">
                        <div style={{
                            width: '80px', height: '80px', background: '#fff7ed', borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto'
                        }}>
                            <i className="bi bi-exclamation-triangle" style={{ fontSize: '40px', color: '#c2410c' }}></i>
                        </div>
                    </div>
                    <h4 className="fw-bold mb-3">Xác nhận xoá tài khoản</h4>
                    <p className="text-muted mb-4">
                        Sau khi tài khoản bị xoá, tất cả dữ liệu hành trình, điểm thưởng và thông tin cá nhân của bạn sẽ bị xoá vĩnh viễn và không thể khôi phục
                    </p>

                    <div className="form-check text-start d-flex justify-content-center gap-2 mb-4">
                        <Form.Check
                            type="checkbox"
                            id="delete-confirm-check"
                            label=""
                            onChange={(e) => setIsDeleteConfirmed(e.target.checked)}
                        />
                        <label htmlFor="delete-confirm-check" style={{ color: '#009abb', fontWeight: '500', cursor: 'pointer' }}>
                            Tôi hiểu rằng hành động này không thể hoàn tác<br />
                            <span className="text-muted fw-normal">Vui lòng xác nhận để tiếp tục</span>
                        </label>
                    </div>

                    <div className="d-flex gap-3 justify-content-center">
                        <Button variant="outline-secondary" className="px-5 py-2" onClick={() => setShowDeleteConfirmModal(false)} style={{ borderRadius: '8px' }}>
                            Huỷ
                        </Button>
                        <Button
                            disabled={!isDeleteConfirmed}
                            className="px-5 py-2 text-white border-0"
                            style={{ background: '#c2410c', borderRadius: '8px', opacity: isDeleteConfirmed ? 1 : 0.6 }}
                            onClick={handleDeleteAccount}
                        >
                            Xoá
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>

            {/* Delete Success Modal */}
            <Modal show={showDeleteSuccessModal} onHide={() => setShowDeleteSuccessModal(false)} centered>
                <Modal.Body className="text-center p-5">
                    <div className="mb-4">
                        <div style={{
                            width: '80px', height: '80px', background: '#dcfce7', borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto'
                        }}>
                            <i className="bi bi-check-lg" style={{ fontSize: '40px', color: '#16a34a' }}></i>
                        </div>
                    </div>
                    <h4 className="fw-bold mb-3">Tài khoản của bạn đã xoá được thành công</h4>
                    <p className="text-muted mb-4">
                        Chúng tôi rất tiếc khi bạn rời đi. Dữ liệu của bạn đã được xoá vĩnh viễn khỏi hệ thống TripGo
                    </p>
                    <Button className="w-100 py-2 btn-save" onClick={() => navigate('/')}>
                        Về trang chủ
                    </Button>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default Profile;