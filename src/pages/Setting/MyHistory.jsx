import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, InputGroup, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { PUBLIC_API } from '../../api/config';
import './setting.css';
import logo from '../../assets/images/icons/VietnamAirlines.png'; // Assuming availability or use placeholder

const MyHistory = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('active');
    const [bookingType, setBookingType] = useState('all'); // all, hotel, flight, tour
    const [searchCode, setSearchCode] = useState('');
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [rating, setRating] = useState(0);
    
    // Cancel booking modal
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [bookingToCancel, setBookingToCancel] = useState(null);
    const [cancelingBooking, setCancelingBooking] = useState(false);
    
    // Hotel bookings from API
    const [hotelBookings, setHotelBookings] = useState([]);
    const [loadingHotels, setLoadingHotels] = useState(false);
    const [errorHotels, setErrorHotels] = useState(null);

    // Flight bookings from API
    const [flightBookings, setFlightBookings] = useState([]);
    const [loadingFlights, setLoadingFlights] = useState(false);
    const [errorFlights, setErrorFlights] = useState(null);

    // Cancelled bookings from API
    const [cancelledBookings, setCancelledBookings] = useState([]);
    const [loadingCancelled, setLoadingCancelled] = useState(false);
    const [errorCancelled, setErrorCancelled] = useState(null);

    // Lookup booking by code
    const [lookupResult, setLookupResult] = useState(null);
    const [lookingUp, setLookingUp] = useState(false);
    const [lookupError, setLookupError] = useState(null);

    const handleOpenReview = (item) => {
        setSelectedItem(item);
        setShowReviewModal(true);
        setRating(0);
    };

    const handleCloseReview = () => {
        setShowReviewModal(false);
        setSelectedItem(null);
    };

    // Handle cancel booking
    const handleCancelClick = (booking) => {
        setBookingToCancel(booking);
        setShowCancelModal(true);
    };

    const handleConfirmCancel = async () => {
        if (!bookingToCancel) return;

        try {
            setCancelingBooking(true);
            const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
            
            if (!token) {
                toast.error('Vui lòng đăng nhập để hủy đơn hàng');
                navigate('/login');
                return;
            }

            const response = await fetch(PUBLIC_API.CANCEL_BOOKING(bookingToCancel.id), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    toast.error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại');
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('token');
                    navigate('/login');
                    return;
                }
                throw new Error('Không thể hủy đơn hàng');
            }

            // Remove booking from local state
            setHotelBookings(prev => prev.filter(b => b.id !== bookingToCancel.id));
            toast.success('Đã hủy đơn hàng thành công!');
            setShowCancelModal(false);
            setBookingToCancel(null);
        } catch (err) {
            console.error('Error canceling booking:', err);
            toast.error('Không thể hủy đơn hàng. Vui lòng thử lại!');
        } finally {
            setCancelingBooking(false);
        }
    };

    // Fetch hotel bookings from API
    useEffect(() => {
        const fetchHotelBookings = async () => {
            try {
                setLoadingHotels(true);
                setErrorHotels(null);
                const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
                
                if (!token) {
                    toast.warning('Vui lòng đăng nhập để xem lịch sử đặt phòng');
                    navigate('/login');
                    return;
                }

                const response = await fetch(PUBLIC_API.MY_HOTELS_BOOKINGS, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        toast.error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại');
                        localStorage.removeItem('accessToken');
                        localStorage.removeItem('token');
                        navigate('/login');
                        return;
                    }
                    throw new Error('Không thể tải lịch sử đặt phòng');
                }

                const data = await response.json();
                console.log('Hotel bookings:', data);
                setHotelBookings(data.result || []);
            } catch (err) {
                console.error('Error fetching hotel bookings:', err);
                setErrorHotels(err.message);
                toast.error('Không thể tải lịch sử đặt phòng');
            } finally {
                setLoadingHotels(false);
            }
        };

        // Only fetch when hotel type is selected
        if (bookingType === 'hotel' || bookingType === 'all') {
            fetchHotelBookings();
        }
    }, [bookingType, navigate]);

    // Fetch flight bookings from API
    useEffect(() => {
        const fetchFlightBookings = async () => {
            try {
                setLoadingFlights(true);
                setErrorFlights(null);
                const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
                
                if (!token) {
                    toast.warning('Vui lòng đăng nhập để xem lịch sử đặt vé');
                    navigate('/login');
                    return;
                }

                const response = await fetch(PUBLIC_API.MY_FLIGHTS_BOOKINGS, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        toast.error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại');
                        localStorage.removeItem('accessToken');
                        localStorage.removeItem('token');
                        navigate('/login');
                        return;
                    }
                    throw new Error('Không thể tải lịch sử đặt vé');
                }

                const data = await response.json();
                console.log('Flight bookings:', data);
                setFlightBookings(data.result || []);
            } catch (err) {
                console.error('Error fetching flight bookings:', err);
                setErrorFlights(err.message);
                toast.error('Không thể tải lịch sử đặt vé');
            } finally {
                setLoadingFlights(false);
            }
        };

        // Only fetch when flight type is selected
        if (bookingType === 'flight' || bookingType === 'all') {
            fetchFlightBookings();
        }
    }, [bookingType, navigate]);

    // Fetch cancelled bookings from API
    useEffect(() => {
        const fetchCancelledBookings = async () => {
            try {
                setLoadingCancelled(true);
                setErrorCancelled(null);
                const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
                
                if (!token) {
                    toast.warning('Vui lòng đăng nhập để xem lịch sử đơn hàng');
                    navigate('/login');
                    return;
                }

                const response = await fetch(PUBLIC_API.MY_CANCELLED_BOOKINGS, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        toast.error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại');
                        localStorage.removeItem('accessToken');
                        localStorage.removeItem('token');
                        navigate('/login');
                        return;
                    }
                    throw new Error('Không thể tải danh sách đơn đã hủy');
                }

                const data = await response.json();
                console.log('Cancelled bookings:', data);
                setCancelledBookings(data.result || []);
            } catch (err) {
                console.error('Error fetching cancelled bookings:', err);
                setErrorCancelled(err.message);
                toast.error('Không thể tải danh sách đơn đã hủy');
            } finally {
                setLoadingCancelled(false);
            }
        };

        // Only fetch when cancelled tab is active
        if (activeTab === 'cancelled' && (bookingType === 'hotel' || bookingType === 'all')) {
            fetchCancelledBookings();
        }
    }, [activeTab, bookingType, navigate]);

    // Lookup booking by code with debounce
    useEffect(() => {
        // Clear lookup when search is empty
        if (!searchCode.trim()) {
            setLookupResult(null);
            setLookupError(null);
            return;
        }

        // Debounce the lookup
        const timer = setTimeout(async () => {
            try {
                setLookingUp(true);
                setLookupError(null);
                const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
                
                if (!token) {
                    toast.warning('Vui lòng đăng nhập để tra cứu đơn hàng');
                    navigate('/login');
                    return;
                }

                const response = await fetch(PUBLIC_API.LOOKUP_BOOKING(searchCode.trim()), {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        toast.error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại');
                        localStorage.removeItem('accessToken');
                        localStorage.removeItem('token');
                        navigate('/login');
                        return;
                    }
                    if (response.status === 404) {
                        setLookupError('Không tìm thấy đơn hàng với mã này');
                        setLookupResult(null);
                        return;
                    }
                    throw new Error('Không thể tra cứu đơn hàng');
                }

                const data = await response.json();
                console.log('Lookup result:', data);
                setLookupResult(data.result || data);
                setLookupError(null);
            } catch (err) {
                console.error('Error looking up booking:', err);
                setLookupError(err.message);
                setLookupResult(null);
            } finally {
                setLookingUp(false);
            }
        }, 500); // 500ms debounce

        return () => clearTimeout(timer);
    }, [searchCode, navigate]);

    // Helper functions
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const formatCurrency = (amount) => {
        if (!amount) return '0đ';
        return amount.toLocaleString('vi-VN') + 'đ';
    };

    const calculateNights = (checkIn, checkOut) => {
        if (!checkIn || !checkOut) return 0;
        const start = new Date(checkIn);
        const end = new Date(checkOut);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const getStatusText = (status) => {
        const statusMap = {
            'PENDING': 'Đang xử lý',
            'CONFIRMED': 'Đã xác nhận',
            'COMPLETED': 'Hoàn tất',
            'CANCELLED': 'Đã hủy'
        };
        return statusMap[status] || status;
    };

    const getStatusClass = (status) => {
        if (status === 'CONFIRMED' || status === 'COMPLETED') return 'success';
        if (status === 'PENDING') return 'pending';
        if (status === 'CANCELLED') return 'cancelled';
        return 'pending';
    };

    // Mock Data - Extended with hotels
    const activeTransactions = [
        {
            id: 'T1',
            bookingCode: 'FL001',
            type: 'flight',
            airline: 'Vietnam Airlines',
            departureCode: 'DAD',
            arrivalCode: 'HAN',
            departureTime: '13:00',
            arrivalTime: '14:10',
            duration: '1h 10p',
            flightType: 'Khứ hồi',
            price: '1.250.000đ',
            status: 'success',
            statusText: 'Đã thanh toán'
        },
        {
            id: 'T2',
            bookingCode: 'HT001',
            type: 'hotel',
            hotelName: 'Glamour Hotel Da Nang',
            roomType: 'Deluxe Room',
            checkIn: '20/12/2025',
            checkOut: '22/12/2025',
            nights: '2 đêm',
            price: '3.000.000đ',
            status: 'success',
            statusText: 'Đã thanh toán'
        }
    ];

    const completedTransactions = [
        {
            id: 'T3',
            bookingCode: 'TR001',
            type: 'tour',
            title: 'Tour Cù Lao Chàm',
            location: 'Đà Nẵng',
            time: '20/11/2025-21/11/2025',
            people: '2 người',
            price: '3.550.000đ',
            status: 'success',
            statusText: 'Đã hoàn tất',
            image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=500&q=60'
        },
        {
            id: 'T4',
            bookingCode: 'FL002',
            type: 'flight',
            airline: 'Vietnam Airlines',
            departureCode: 'DAD',
            arrivalCode: 'HAN',
            departureTime: '13:00',
            arrivalTime: '14:10',
            duration: '1h 10p',
            flightType: 'Khứ hồi',
            price: '1.250.000đ',
            status: 'success',
            statusText: 'Đã hoàn tất'
        }
    ];

    // Filter transactions by type and search code
    const filterTransactions = (transactions) => {
        let filtered = transactions;

        // Filter by booking type
        if (bookingType !== 'all') {
            filtered = filtered.filter(item => item.type === bookingType);
        }

        // Filter by search code
        if (searchCode.trim()) {
            filtered = filtered.filter(item => 
                item.bookingCode.toLowerCase().includes(searchCode.toLowerCase())
            );
        }

        return filtered;
    };

    const renderHotelCard = (item, isCompleted = false) => {
        // Map API data to display format
        const hotelName = item.service?.hotelName || item.hotelName || 'Khách sạn';
        const roomType = item.service?.name || item.roomType || 'N/A';
        const checkIn = formatDate(item.checkInDate);
        const checkOut = formatDate(item.checkOutDate);
        const nights = calculateNights(item.checkInDate, item.checkOutDate);
        const price = formatCurrency(item.finalPrice);
        const statusText = getStatusText(item.status);
        const statusClass = getStatusClass(item.status);

        return (
            <div className="transaction-card" key={item.id}>
                <div className="trans-header">
                    <div className="trans-airline">
                        <i className="bi bi-building" style={{ fontSize: '24px', color: '#009abb' }}></i>
                        <span>{hotelName}</span>
                    </div>
                    <div className="trans-price-col">
                        <div className="trans-price">{price}</div>
                        <span className={`status-badge ${statusClass}`}>
                            {statusText}
                        </span>
                    </div>
                </div>
                <div className="mb-3">
                    <div className="text-muted small mb-1">Mã đơn hàng: <strong>{item.bookingCode}</strong></div>
                    <div className="text-muted small mb-1">Loại phòng: {roomType}</div>
                    <div className="text-muted small mb-1">
                        <i className="bi bi-calendar-check me-1"></i>
                        {checkIn} - {checkOut} ({nights} đêm)
                    </div>
                    {item.isPaid && (
                        <div className="text-muted small">
                            <i className="bi bi-check-circle-fill text-success me-1"></i>
                            Đã thanh toán
                        </div>
                    )}
                </div>

                <div className="trans-actions">
                    {isCompleted ? (
                        <>
                            <button className="btn-action-outline">Đặt lại</button>
                            <button className="btn-action-primary" onClick={() => handleOpenReview(item)}>Đánh giá</button>
                        </>
                    ) : (
                        <>
                            <button 
                                className="btn-action-outline"
                                onClick={() => handleCancelClick(item)}
                            >
                                Huỷ
                            </button>
                            <button className="btn-action-primary">Xem chi tiết</button>
                        </>
                    )}
                </div>
            </div>
        );
    };

    const renderFlightCard = (item, isCompleted = false) => {
        // Map API data to display format
        const airline = item.service?.flightNumber || item.airline || 'Airline';
        const departureCode = item.service?.departureAirport || item.departureCode || '';
        const arrivalCode = item.service?.arrivalAirport || item.arrivalCode || '';
        const price = item.finalPrice ? formatCurrency(item.finalPrice) : (item.price || '0đ');
        const statusText = item.status ? getStatusText(item.status) : (item.statusText || '');
        const statusClass = item.status ? getStatusClass(item.status) : (item.status === 'success' ? 'success' : 'pending');
        
        // Parse times
        const departureTime = item.service?.departureTime ? new Date(item.service.departureTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : (item.departureTime || '');
        const arrivalTime = item.service?.arrivalTime ? new Date(item.service.arrivalTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : (item.arrivalTime || '');
        
        // Flight duration
        const duration = item.service?.duration || item.duration || '';
        
        return (
            <div className="transaction-card" key={item.id}>
                <div className="trans-header">
                    <div className="trans-airline">
                        <img src={logo} alt="Airline" style={{ height: '24px' }} />
                        <span>{airline}</span>
                    </div>
                    <div className="trans-price-col">
                        <div className="trans-price">{price}</div>
                        <span className={`status-badge ${statusClass}`}>
                            {statusText}
                        </span>
                    </div>
                </div>
                <div className="text-muted small mb-2">Mã đơn hàng: <strong>{item.bookingCode}</strong></div>
                <div className="trans-route justify-content-center mb-4">
                    <div className="text-center">
                        <div className="route-time">{departureTime}</div>
                        <div className="route-date">{departureCode}</div>
                    </div>
                    <div className="route-arrow">
                        <span>{duration}</span>
                        <div style={{ borderTop: '1px solid #cbd5e1', width: '60px', position: 'relative' }}>
                            <i className="bi bi-arrow-left-right" style={{ position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', background: '#fff', padding: '0 4px' }}></i>
                        </div>
                        <span style={{ color: '#0ea5e9', fontSize: '13px' }}>Một chiều</span>
                    </div>
                    <div className="text-center">
                        <div className="route-time">{arrivalTime}</div>
                        <div className="route-date">{arrivalCode}</div>
                    </div>
                </div>
                {item.isPaid && (
                    <div className="text-muted small mb-2">
                        <i className="bi bi-check-circle-fill text-success me-1"></i>
                        Đã thanh toán
                    </div>
                )}

                <div className="trans-actions">
                    {isCompleted ? (
                        <>
                            <button className="btn-action-outline">Đặt lại</button>
                            <button className="btn-action-primary" onClick={() => handleOpenReview(item)}>Đánh giá</button>
                        </>
                    ) : (
                        <>
                            <button className="btn-action-outline">Huỷ</button>
                            <button className="btn-action-primary">Xem chi tiết</button>
                        </>
                    )}
                </div>
            </div>
        );
    };

    const renderTourCard = (item) => (
        <div className="transaction-card" key={item.id}>
            <div className="trans-header mb-0">
                <div className="tour-history-card w-100">
                    <img src={item.image} alt={item.title} className="tour-thumb-sm" />
                    <div className="tour-info-col">
                        <div className="d-flex justify-content-between align-items-start">
                            <a href="#" className="tour-title-link">{item.title}</a>
                            <div className="text-end">
                                <div className="trans-price">{item.price}</div>
                                <span className={`status-badge ${item.status === 'success' ? 'success' : 'pending'}`}>
                                    {item.statusText}
                                </span>
                            </div>
                        </div>
                        <div className="text-muted small mb-1">Mã đơn hàng: <strong>{item.bookingCode}</strong></div>
                        <div className="tour-meta">
                            <i className="bi bi-geo-alt"></i> {item.location}
                        </div>
                        <div className="tour-meta">
                            <strong>Thời gian:</strong> {item.time}
                        </div>
                        <div className="tour-meta">
                            <i className="bi bi-people"></i> {item.people}
                        </div>

                        <div className="trans-actions mt-2 pt-0 border-0">
                            <button className="btn-action-outline">Đặt lại</button>
                            <button className="btn-action-primary" onClick={() => handleOpenReview(item)}>Đánh giá</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderTransactionCard = (item, isCompleted = false) => {
        if (item.type === 'hotel') return renderHotelCard(item, isCompleted);
        if (item.type === 'flight') return renderFlightCard(item, isCompleted);
        if (item.type === 'tour') return renderTourCard(item);
        return null;
    };

    return (
        <div>
            <h2 className="account-section-title">Giao dịch của tôi</h2>

            <div className="setting-card">
                <div className="setting-card-body">
                    {/* Status Tabs */}
                    <div className="setting-tabs">
                        <button
                            className={`setting-tab-item ${activeTab === 'active' ? 'active' : ''}`}
                            onClick={() => setActiveTab('active')}
                        >
                            Đang hoạt động
                        </button>
                        <button
                            className={`setting-tab-item ${activeTab === 'completed' ? 'active' : ''}`}
                            onClick={() => setActiveTab('completed')}
                        >
                            Hoàn tất
                        </button>
                        <button
                            className={`setting-tab-item ${activeTab === 'cancelled' ? 'active' : ''}`}
                            onClick={() => setActiveTab('cancelled')}
                        >
                            Đã huỷ
                        </button>
                    </div>

                    {/* Search and Type Filter */}
                    <div className="mt-4 mb-3">
                        <div className="row g-3">
                            <div className="col-md-6">
                                <InputGroup>
                                    <InputGroup.Text>
                                        <i className="bi bi-search"></i>
                                    </InputGroup.Text>
                                    <Form.Control
                                        placeholder="Tìm kiếm theo mã đơn hàng..."
                                        value={searchCode}
                                        onChange={(e) => setSearchCode(e.target.value)}
                                    />
                                </InputGroup>
                            </div>
                            <div className="col-md-6">
                                <div className="d-flex gap-2">
                                    <button
                                        className={`btn ${bookingType === 'all' ? 'btn-primary' : 'btn-outline-secondary'} flex-fill`}
                                        onClick={() => setBookingType('all')}
                                    >
                                        Tất cả
                                    </button>
                                    <button
                                        className={`btn ${bookingType === 'hotel' ? 'btn-primary' : 'btn-outline-secondary'} flex-fill`}
                                        onClick={() => setBookingType('hotel')}
                                    >
                                        Khách sạn
                                    </button>
                                    <button
                                        className={`btn ${bookingType === 'flight' ? 'btn-primary' : 'btn-outline-secondary'} flex-fill`}
                                        onClick={() => setBookingType('flight')}
                                    >
                                        Chuyến bay
                                    </button>
                                    <button
                                        className={`btn ${bookingType === 'tour' ? 'btn-primary' : 'btn-outline-secondary'} flex-fill`}
                                        onClick={() => setBookingType('tour')}
                                    >
                                        Tour
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="tab-content py-2">
                        {activeTab === 'active' && (
                            <div>
                                {/* Show lookup result when searching */}
                                {searchCode.trim() ? (
                                    <>
                                        {lookingUp && (
                                            <div className="text-center py-5">
                                                <Spinner animation="border" variant="primary" />
                                                <p className="mt-3 text-muted">Đang tìm kiếm đơn hàng...</p>
                                            </div>
                                        )}
                                        {lookupError && !lookingUp && (
                                            <div className="alert alert-warning" role="alert">
                                                <i className="bi bi-info-circle me-2"></i>
                                                {lookupError}
                                            </div>
                                        )}
                                        {lookupResult && !lookingUp && (
                                            <>
                                                {renderHotelCard(lookupResult, false)}
                                            </>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        {/* Show all hotel bookings when not searching */}
                                        {(bookingType === 'hotel' || bookingType === 'all') && (
                                            <>
                                                {loadingHotels && (
                                                    <div className="text-center py-5">
                                                        <Spinner animation="border" variant="primary" />
                                                        <p className="mt-3 text-muted">Đang tải lịch sử đặt phòng...</p>
                                                    </div>
                                                )}
                                                {errorHotels && !loadingHotels && (
                                                    <div className="alert alert-danger" role="alert">
                                                        <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                                        {errorHotels}
                                                    </div>
                                                )}
                                                {!loadingHotels && !errorHotels && hotelBookings
                                                    .filter(booking => 
                                                        booking.status === 'PENDING' || booking.status === 'CONFIRMED'
                                                    )
                                                    .map(booking => renderHotelCard(booking, false))
                                                }
                                            </>
                                        )}
                                        
                                        {/* Show flight bookings from API */}
                                        {(bookingType === 'flight' || bookingType === 'all') && (
                                            <>
                                                {loadingFlights && (
                                                    <div className="text-center py-5">
                                                        <Spinner animation="border" variant="primary" />
                                                        <p className="mt-3 text-muted">Đang tải lịch sử đặt vé...</p>
                                                    </div>
                                                )}
                                                {errorFlights && !loadingFlights && (
                                                    <div className="alert alert-danger" role="alert">
                                                        <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                                        {errorFlights}
                                                    </div>
                                                )}
                                                {!loadingFlights && !errorFlights && flightBookings
                                                    .filter(booking => 
                                                        booking.status === 'PENDING' || booking.status === 'CONFIRMED'
                                                    )
                                                    .map(booking => renderFlightCard(booking, false))
                                                }
                                            </>
                                        )}
                                        {bookingType === 'tour' && <div className="text-center py-5 text-muted">Chưa có tour nào</div>}
                                        
                                        {/* Empty state when no results */}
                                        {bookingType === 'hotel' && !loadingHotels && hotelBookings.filter(b => b.status === 'PENDING' || b.status === 'CONFIRMED').length === 0 && (
                                            <div className="text-center py-5 text-muted">Không có đặt phòng nào đang hoạt động</div>
                                        )}
                                        {bookingType === 'flight' && !loadingFlights && flightBookings.filter(b => b.status === 'PENDING' || b.status === 'CONFIRMED').length === 0 && (
                                            <div className="text-center py-5 text-muted">Không có đặt vé nào đang hoạt động</div>
                                        )}
                                    </>
                                )}
                            </div>
                        )}
                        {activeTab === 'completed' && (
                            <div>
                                {/* Show completed hotel bookings */}
                                {(bookingType === 'hotel' || bookingType === 'all') && (
                                    <>
                                        {loadingHotels && (
                                            <div className="text-center py-5">
                                                <Spinner animation="border" variant="primary" />
                                                <p className="mt-3 text-muted">Đang tải lịch sử đặt phòng...</p>
                                            </div>
                                        )}
                                        {!loadingHotels && hotelBookings
                                            .filter(booking => booking.status === 'COMPLETED')
                                            .filter(booking => 
                                                !searchCode.trim() || booking.bookingCode.toLowerCase().includes(searchCode.toLowerCase())
                                            )
                                            .map(booking => renderHotelCard(booking, true))
                                        }
                                    </>
                                )}
                                
                                {/* Show completed flight bookings */}
                                {(bookingType === 'flight' || bookingType === 'all') && (
                                    <>
                                        {loadingFlights && (
                                            <div className="text-center py-5">
                                                <Spinner animation="border" variant="primary" />
                                                <p className="mt-3 text-muted">Đang tải lịch sử đặt vé...</p>
                                            </div>
                                        )}
                                        {!loadingFlights && flightBookings
                                            .filter(booking => booking.status === 'COMPLETED')
                                            .filter(booking => 
                                                !searchCode.trim() || booking.bookingCode.toLowerCase().includes(searchCode.toLowerCase())
                                            )
                                            .map(booking => renderFlightCard(booking, true))
                                        }
                                    </>
                                )}
                                {bookingType === 'tour' && filterTransactions(completedTransactions).filter(t => t.type === 'tour').map(item => renderTransactionCard(item, true))}
                                
                                {/* Empty state */}
                                {bookingType === 'hotel' && !loadingHotels && hotelBookings.filter(b => b.status === 'COMPLETED').length === 0 && (
                                    <div className="text-center py-5 text-muted">Không có đặt phòng nào đã hoàn tất</div>
                                )}
                                {bookingType === 'flight' && !loadingFlights && flightBookings.filter(b => b.status === 'COMPLETED').length === 0 && (
                                    <div className="text-center py-5 text-muted">Không có đặt vé nào đã hoàn tất</div>
                                )}
                            </div>
                        )}
                        {activeTab === 'cancelled' && (
                            <div>
                                {/* Show cancelled hotel bookings */}
                                {(bookingType === 'hotel' || bookingType === 'all') && (
                                    <>
                                        {loadingCancelled && (
                                            <div className="text-center py-5">
                                                <Spinner animation="border" variant="primary" />
                                                <p className="mt-3 text-muted">Đang tải danh sách đơn đã hủy...</p>
                                            </div>
                                        )}
                                        {errorCancelled && !loadingCancelled && (
                                            <div className="alert alert-danger" role="alert">
                                                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                                {errorCancelled}
                                            </div>
                                        )}
                                        {!loadingCancelled && !errorCancelled && cancelledBookings
                                            .filter(booking => 
                                                !searchCode.trim() || booking.bookingCode.toLowerCase().includes(searchCode.toLowerCase())
                                            )
                                            .map(booking => renderHotelCard(booking, false))
                                        }
                                    </>
                                )}
                                
                                {/* Show cancelled flight bookings */}
                                {(bookingType === 'flight' || bookingType === 'all') && (
                                    <>
                                        {loadingFlights && (
                                            <div className="text-center py-5">
                                                <Spinner animation="border" variant="primary" />
                                                <p className="mt-3 text-muted">Đang tải danh sách vé đã hủy...</p>
                                            </div>
                                        )}
                                        {!loadingFlights && flightBookings
                                            .filter(booking => booking.status === 'CANCELLED')
                                            .filter(booking => 
                                                !searchCode.trim() || booking.bookingCode.toLowerCase().includes(searchCode.toLowerCase())
                                            )
                                            .map(booking => renderFlightCard(booking, false))
                                        }
                                    </>
                                )}
                                {bookingType === 'tour' && <div className="text-center py-5 text-muted">Chưa có tour bị hủy</div>}
                                
                                {/* Empty state */}
                                {bookingType === 'hotel' && !loadingCancelled && cancelledBookings.length === 0 && (
                                    <div className="text-center py-5 text-muted">Chưa có đơn hàng nào bị hủy</div>
                                )}
                                {bookingType === 'flight' && !loadingFlights && flightBookings.filter(b => b.status === 'CANCELLED').length === 0 && (
                                    <div className="text-center py-5 text-muted">Chưa có vé nào bị hủy</div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Review Modal */}
            <Modal show={showReviewModal} onHide={handleCloseReview} centered size="lg">
                <Modal.Header closeButton className="border-0 pb-0">
                    <Modal.Title className="fw-bold text-primary"><i className="bi bi-star-fill text-warning me-2"></i> Đánh giá</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4">
                    {selectedItem && (
                        <div className="modal-tour-info">
                            <div>
                                <div className="text-dark fw-bold mb-1">{selectedItem.type === 'tour' ? 'Tour du lịch' : 'Chuyến bay'}</div>
                                <div className="modal-tour-title">{selectedItem.title || (selectedItem.airline + ' ' + selectedItem.departureCode + '-' + selectedItem.arrivalCode)}</div>
                                <div className="text-muted small">
                                    {selectedItem.type === 'tour' ? `Thời gian: ${selectedItem.time}` : `${selectedItem.departureTime} - ${selectedItem.arrivalTime}`}
                                </div>
                            </div>
                            <div className="modal-tour-price">{selectedItem.price}</div>
                        </div>
                    )}

                    <div className="text-center mb-4">
                        <h5 className="fw-bold mb-3">Bạn cảm thấy chuyến đi như thế nào?</h5>
                        <div className="rating-stars">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <i
                                    key={star}
                                    className={`bi ${star <= rating ? 'bi-star-fill active' : 'bi-star inactive'} rating-star-icon`}
                                    onClick={() => setRating(star)}
                                ></i>
                            ))}
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="fw-bold mb-2">Nhận xét của bạn (Tuỳ chọn)</label>
                        <textarea
                            className="review-textarea"
                            placeholder="Chia sẻ trải nghiệm của bạn về chuyến đi này...."
                        ></textarea>
                    </div>

                    <div className="text-end">
                        <Button className="btn-action-primary" style={{ minWidth: '150px' }} onClick={handleCloseReview}>
                            Gửi đánh giá
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>

            {/* Cancel Booking Confirmation Modal */}
            <Modal show={showCancelModal} onHide={() => setShowCancelModal(false)} centered>
                <Modal.Header closeButton className="border-0 pb-0">
                    <Modal.Title className="fw-bold text-danger">
                        <i className="bi bi-exclamation-triangle-fill me-2"></i>
                        Xác nhận hủy đơn hàng
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4">
                    {bookingToCancel && (
                        <div>
                            <p className="mb-3">Bạn có chắc chắn muốn hủy đơn hàng này?</p>
                            <div className="bg-light p-3 rounded mb-3">
                                <div className="mb-2">
                                    <strong>Mã đơn hàng:</strong> {bookingToCancel.bookingCode}
                                </div>
                                <div className="mb-2">
                                    <strong>Khách sạn:</strong> {bookingToCancel.service?.hotelName}
                                </div>
                                <div className="mb-2">
                                    <strong>Loại phòng:</strong> {bookingToCancel.service?.name}
                                </div>
                                <div>
                                    <strong>Tổng tiền:</strong> {formatCurrency(bookingToCancel.finalPrice)}
                                </div>
                            </div>
                            <div className="alert alert-warning mb-0">
                                <i className="bi bi-info-circle me-2"></i>
                                <small>Sau khi hủy, bạn sẽ không thể hoàn tác thao tác này.</small>
                            </div>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer className="border-0">
                    <Button 
                        variant="secondary" 
                        onClick={() => setShowCancelModal(false)}
                        disabled={cancelingBooking}
                    >
                        Đóng
                    </Button>
                    <Button 
                        variant="danger" 
                        onClick={handleConfirmCancel}
                        disabled={cancelingBooking}
                    >
                        {cancelingBooking ? (
                            <>
                                <Spinner animation="border" size="sm" className="me-2" />
                                Đang hủy...
                            </>
                        ) : (
                            'Xác nhận hủy'
                        )}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default MyHistory;
