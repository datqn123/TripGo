import React, { useState, useEffect, useRef } from 'react';
import { Form, ListGroup, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import hotelApi from '../../../api/hotelApi';
import { PUBLIC_API } from '../../../api/config'; // Might need this if hotelApi doesn't cover everything or for consistency
import './HotelNameSearch.css'; // We'll create this CSS file

const HotelNameSearch = () => {
    const [search, setSearch] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const searchRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const fetchHotels = async () => {
            if (search.trim().length < 2) {
                setResults([]);
                return;
            }

            setLoading(true);
            try {
                 const response = await hotelApi.searchHotelsEs({ search: search });
                 const data = response.data ? (response.data.result?.hotels || response.data.result || []) : [];
                 setResults(Array.isArray(data) ? data : []);
                 setShowDropdown(true);
            } catch (error) {
                console.error("Error searching hotels:", error);
                setResults([]);
            } finally {
                setLoading(false);
            }
        };

        const debounceTimer = setTimeout(() => {
            fetchHotels();
        }, 500);

        return () => clearTimeout(debounceTimer);
    }, [search]);

    const handleSelectHotel = (hotelId) => {
        navigate(`/hotel-detail/${hotelId}`);
        setShowDropdown(false);
        setSearch('');
    };

    return (
        <div className="hotel-name-search mb-4 position-relative" ref={searchRef}>
            <div className="search-input-wrapper position-relative">
                <Form.Control
                    type="text"
                    placeholder="Tìm kiếm tên khách sạn..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onFocus={() => search.length >= 2 && setShowDropdown(true)}
                    className="form-control-lg rounded-pill ps-5 border-0 shadow-sm"
                    style={{ height: '56px', fontSize: '1rem' }}
                />
                <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted fs-5"></i>
                {loading && (
                    <div className="position-absolute top-50 end-0 translate-middle-y me-3">
                        <div className="spinner-border spinner-border-sm text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                )}
            </div>

            {showDropdown && results.length > 0 && (
                <div className="search-results-dropdown position-absolute w-100 mt-2 bg-white rounded-4 shadow-lg" style={{ zIndex: 1000, top: '100%' }}>
                    <ListGroup variant="flush">
                        {results.map((hotel) => (
                            <ListGroup.Item 
                                key={hotel.id} 
                                action 
                                onClick={() => handleSelectHotel(hotel.id)}
                                className="border-0 p-3 d-flex align-items-center gap-3 hover-bg-light"
                            >
                                <div className="flex-shrink-0" style={{ width: '60px', height: '60px' }}>
                                    <Image 
                                        src={hotel.thumbnail || "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=100&auto=format&fit=crop"} 
                                        alt={hotel.name}
                                        className="w-100 h-100 object-fit-cover rounded-3" 
                                    />
                                </div>
                                <div className="flex-grow-1 min-w-0">
                                    <h6 className="mb-1 fw-bold text-truncate text-dark">{hotel.name}</h6>
                                    <p className="mb-0 small text-muted text-truncate">
                                        <i className="bi bi-geo-alt-fill me-1 text-secondary"></i>
                                        {hotel.locationName || hotel.address || hotel.location || 'Chưa cập nhật địa chỉ'}
                                    </p>
                                </div>
                                <div className="flex-shrink-0 text-end">
                                    {hotel.starRating && (
                                         <div className="small text-warning mb-1">
                                            {hotel.starRating} <i className="bi bi-star-fill"></i>
                                         </div>
                                    )}
                                </div>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </div>
            )}
            
            {showDropdown && search.length >= 2 && !loading && results.length === 0 && (
                 <div className="search-results-dropdown position-absolute w-100 mt-2 bg-white rounded-4 shadow-lg p-4 text-center text-muted" style={{ zIndex: 1000, top: '100%' }}>
                    <i className="bi bi-emoji-frown fs-4 mb-2 d-block"></i>
                    Không tìm thấy khách sạn nào
                </div>
            )}
        </div>
    );
};

export default HotelNameSearch;
