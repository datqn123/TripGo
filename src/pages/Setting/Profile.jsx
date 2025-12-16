import React, { useState } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import './setting.css';
const Profile = () => {
    const [userData, setUserData] = useState({
        fullName: "Nguyễn ABC",
        email: "abc@gmail.com",
        phone: ""
    });
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
                                <button className="btn-outline-custom">
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
                                <button className="btn-outline-custom">
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
                                <button className="btn-outline-custom">
                                    Đổi mật khẩu
                                </button>
                            </div>
                        </div>

                        {/* Delete Account Card */}
                        <div className="setting-card">
                            <div className="setting-card-header">
                                <span className="text-primary-custom" style={{ color: '#009abb' }}>Xoá tài khoản</span>
                                <button className="btn-delete">
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
        </>
    );
};

export default Profile;