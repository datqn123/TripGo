import React, { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import Banner from "../Banner/Banner";
import AdvanceSearch from "../AdvanceSearch/AdvanceSearch";
import { useNavigate, useLocation } from "react-router-dom";
import { PUBLIC_API } from "../../../api/config";

// Airline Mapping (Mock IDs based on common knowledge or user example)
const AIRLINE_MAPPING = {
    'Vietnam Airlines': 1,
    'Vietjet Air': 2,
    'Singapore Airlines': 3,
    'Bamboo Airways': 4 
};

const Outstandingoffer = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Parse URL Search Params
    const getSearchParams = () => {
        const params = new URLSearchParams(location.search);
        return {
            departureLocationId: params.get('departureLocationId'),
            arrivalLocationId: params.get('arrivalLocationId'),
            departureDate: params.get('departureDate'),
            minPrice: params.get('minPrice'),
            maxPrice: params.get('maxPrice'),
            airlineIds: params.get('airlineIds')
        };
    };

    const [flightCards, setFlightCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filter States
    const [selectedPrices, setSelectedPrices] = useState(new Set());
    const [selectedAirlines, setSelectedAirlines] = useState(new Set());
    const [selectedTimeRange, setSelectedTimeRange] = useState(new Set()); // Client-side filtering if API doesn't support

    // Load initial state from URL if needed, currently just fetching based on params
    useEffect(() => {
        fetchFlights();
    }, [location.search]); // Re-fetch when URL changes

    const fetchFlights = async () => {
        try {
            setLoading(true);
            setError(null);

            const searchParams = getSearchParams();
            const queryParams = new URLSearchParams();

            // Add Location & Date params if they exist
            if (searchParams.departureLocationId) queryParams.append('departureLocationId', searchParams.departureLocationId);
            if (searchParams.arrivalLocationId) queryParams.append('arrivalLocationId', searchParams.arrivalLocationId);
            if (searchParams.departureDate) queryParams.append('departureDate', searchParams.departureDate);

            // Add Price params (override if present in URL, otherwise logic handles filter state push to URL)
            if (searchParams.minPrice) queryParams.append('minPrice', searchParams.minPrice);
            if (searchParams.maxPrice) queryParams.append('maxPrice', searchParams.maxPrice);
            
            // Add Airline params
            if (searchParams.airlineIds) queryParams.append('airlineIds', searchParams.airlineIds);

            // If no params, might fallback to default cards or empty search
            // The previous code fetched FLIGHT_CARDS (default list). 
            // If we have search params, use SEARCH endpoint. Else usage FLIGHT_CARDS?
            // User instruction implies this page acts as search result. 
            // Let's check if we have ANY search params.
            const hasSearchParams = Array.from(queryParams.keys()).length > 0;
            
            console.log("DEBUG: hasSearchParams", hasSearchParams);
            console.log("DEBUG: FLIGHTS_SEARCH config", PUBLIC_API.FLIGHTS_SEARCH);
            console.log("DEBUG: FLIGHT_CARDS config", PUBLIC_API.FLIGHT_CARDS);

            const endpoint = hasSearchParams ? PUBLIC_API.FLIGHTS_SEARCH : PUBLIC_API.FLIGHT_CARDS;
            const url = hasSearchParams ? `${endpoint}?${queryParams.toString()}` : endpoint;

            console.log("Fetching flights from URL:", url);

            const response = await fetch(url, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) {
                // If 404 on search, it might mean no results
                if (response.status === 404 && hasSearchParams) {
                     setFlightCards([]);
                     return;
                }
                throw new Error('Không thể tải danh sách chuyến bay');
            }

            const data = await response.json();
            // Search API might return list directly or wrapped result
            setFlightCards(Array.isArray(data) ? data : (data.result || []));
            
        } catch (err) {
            console.error('Error fetching flights:', err);
            setError(err.message);
            // toast.error('Không thể tải danh sách chuyến bay');
        } finally {
            setLoading(false);
        }
    };

    // Handle Filter Apply
    const applyFilters = () => {
        const currentParams = getSearchParams();
        const queryParams = new URLSearchParams();
        
        // Preserve location/date
        if (currentParams.departureLocationId) queryParams.append('departureLocationId', currentParams.departureLocationId);
        if (currentParams.arrivalLocationId) queryParams.append('arrivalLocationId', currentParams.arrivalLocationId);
        if (currentParams.departureDate) queryParams.append('departureDate', currentParams.departureDate);

        // Calculate Min/Max Price
        let min = Infinity;
        let max = -Infinity;
        let hasPrice = false;

        selectedPrices.forEach(range => {
            hasPrice = true;
            switch(range) {
                case 'under1m': 
                     min = Math.min(min, 0); 
                     max = Math.max(max, 1000000); 
                     break;
                case '1m-2m':
                     min = Math.min(min, 1000000); 
                     max = Math.max(max, 2000000); 
                     break;
                case '2m-4m':
                     min = Math.min(min, 2000000); 
                     max = Math.max(max, 4000000); 
                     break;
                case 'above4m':
                     min = Math.min(min, 4000000); 
                     // No upper bound really, but let's just append minPrice
                     break;
                default: break;
            }
        });

        if (hasPrice) {
            if (min !== Infinity) queryParams.append('minPrice', min);
            
            if (selectedPrices.has('above4m')) {
            } else if (max !== -Infinity) {
                queryParams.append('maxPrice', max);
            }
        }

        // Airlines
        if (selectedAirlines.size > 0) {
            // Convert Set names to IDs
            const ids = [];
            selectedAirlines.forEach(name => {
                if(AIRLINE_MAPPING[name]) ids.push(AIRLINE_MAPPING[name]);
            });
            if(ids.length > 0) queryParams.append('airlineIds', ids.join(','));
        }

        // Time Filters - Client side? 
        // URL updating
        navigate(`/plane?${queryParams.toString()}`);
    };

    const toggleFilter = (set, item) => {
        const newSet = new Set(set);
        if (newSet.has(item)) newSet.delete(item);
        else newSet.add(item);
        return newSet;
    };

    // Checkbox Handlers
    const handlePriceChange = (range) => setSelectedPrices(prev => toggleFilter(prev, range));
    const handleAirlineChange = (airline) => setSelectedAirlines(prev => toggleFilter(prev, airline));

    // Format price
    const formatPrice = (price) => {
        if (!price) return '0đ';
        return price.toLocaleString('vi-VN') + 'đ';
    };

    return (
        <div className="bg-gray-50 min-h-screen pb-12">
            <Banner />
            <AdvanceSearch />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Filter */}
                    <aside className="w-full lg:w-[280px] flex-shrink-0">
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <div className="flex items-center gap-2 mb-5">
                                <span className="text-xl">🎯</span>
                                <h3 className="text-lg font-bold text-gray-800 m-0">Bộ lọc</h3>
                            </div>

                            <div className="space-y-6">
                                {/* Price Range */}
                                <div>
                                    <h4 className="text-sm font-bold text-gray-700 mb-3">Khoảng giá</h4>
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-3 text-sm text-gray-600 cursor-pointer hover:text-[#0292c6] transition-colors">
                                            <input type="checkbox" onChange={() => handlePriceChange('under1m')} checked={selectedPrices.has('under1m')} className="w-4 h-4 rounded border-gray-300 text-[#0292c6] focus:ring-[#0292c6]" />
                                            <span>Dưới 1.000.000đ</span>
                                        </label>
                                        <label className="flex items-center gap-3 text-sm text-gray-600 cursor-pointer hover:text-[#0292c6] transition-colors">
                                            <input type="checkbox" onChange={() => handlePriceChange('1m-2m')} checked={selectedPrices.has('1m-2m')} className="w-4 h-4 rounded border-gray-300 text-[#0292c6] focus:ring-[#0292c6]" />
                                            <span>1.000.000đ - 2.000.000đ</span>
                                        </label>
                                        <label className="flex items-center gap-3 text-sm text-gray-600 cursor-pointer hover:text-[#0292c6] transition-colors">
                                            <input type="checkbox" onChange={() => handlePriceChange('2m-4m')} checked={selectedPrices.has('2m-4m')} className="w-4 h-4 rounded border-gray-300 text-[#0292c6] focus:ring-[#0292c6]" />
                                            <span>2.000.000đ - 4.000.000đ</span>
                                        </label>
                                        <label className="flex items-center gap-3 text-sm text-gray-600 cursor-pointer hover:text-[#0292c6] transition-colors">
                                            <input type="checkbox" onChange={() => handlePriceChange('above4m')} checked={selectedPrices.has('above4m')} className="w-4 h-4 rounded border-gray-300 text-[#0292c6] focus:ring-[#0292c6]" />
                                            <span>Trên 4.000.000đ</span>
                                        </label>
                                    </div>
                                </div>
                                <hr className="border-gray-100" />

                                {/* Airline */}
                                <div>
                                    <h4 className="text-sm font-bold text-gray-700 mb-3">Hãng hàng không</h4>
                                    <div className="space-y-2">
                                        {['Vietnam Airlines', 'Vietjet Air', 'Singapore Airlines'].map((label, idx) => (
                                            <label key={idx} className="flex items-center gap-3 text-sm text-gray-600 cursor-pointer hover:text-[#0292c6] transition-colors">
                                                <input 
                                                    type="checkbox" 
                                                    onChange={() => handleAirlineChange(label)}
                                                    checked={selectedAirlines.has(label)}
                                                    className="w-4 h-4 rounded border-gray-300 text-[#0292c6] focus:ring-[#0292c6]" 
                                                />
                                                <span>{label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <hr className="border-gray-100" />

                                {/* Departure Time - Visual Only for now as API param logic unsure */}
                                <div>
                                    <h4 className="text-sm font-bold text-gray-700 mb-3">Giờ khởi hành</h4>
                                    <div className="space-y-2">
                                        {['Sáng sớm (00:00 - 06:00)', 'Buổi sáng (06:00 - 12:00)', 'Buổi chiều (12:00 - 18:00)', 'Buổi tối (18:00 - 24:00)'].map((label, idx) => (
                                            <label key={idx} className="flex items-center gap-3 text-sm text-gray-600 cursor-pointer hover:text-[#0292c6] transition-colors">
                                                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#0292c6] focus:ring-[#0292c6]" />
                                                <span>{label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <button 
                                    onClick={applyFilters}
                                    className="w-full mt-4 bg-[#0292c6] text-white py-3 rounded-xl font-semibold text-sm hover:bg-[#027aa5] transition-all shadow-md hover:shadow-lg transform active:scale-95"
                                >
                                    Áp dụng bộ lọc
                                </button>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1">
                        <h3 className="text-[#0292c6] text-xl font-bold mb-6 flex items-center gap-2">
                            <span>{getSearchParams().departureDate || 'Chuyến bay gần nhất'}</span>
                        </h3>
                        
                        {loading ? (
                            <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                                <Spinner animation="border" variant="primary" />
                                <p className="mt-3 text-gray-500 font-medium">Đang tải danh sách chuyến bay...</p>
                            </div>
                        ) : error ? (
                            <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-red-600 flex items-center gap-3">
                                <i className="bi bi-exclamation-triangle-fill"></i>
                                {error}
                            </div>
                        ) : flightCards.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100 text-gray-500 font-medium">
                                Không tìm thấy chuyến bay phù hợp
                            </div>
                        ) : (
                            <div className="space-y-5">
                                {flightCards.map((flight) => (
                                    <div key={flight.id} className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.05)] border border-gray-100 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:border-[#0292c6]/30 transition-all duration-300 relative group">
                                        {/* Date Badge */}
                                        <div className="absolute top-4 right-4 text-gray-400 text-sm font-medium flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full">
                                            <i className="bi bi-calendar3"></i> {flight.flightDate || 'N/A'}
                                        </div>

                                        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mt-2">
                                            
                                            {/* Airline Info */}
                                            <div className="flex flex-col items-center w-full md:w-32 flex-shrink-0">
                                                <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-2 bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-100 p-2">
                                                    {flight.airlineLogo ? (
                                                        <img src={flight.airlineLogo} alt={flight.airlineName} className="w-full h-full object-contain" />
                                                    ) : (
                                                        <span className="text-2xl">✈️</span>
                                                    )}
                                                </div>
                                                <div className="text-xs font-bold text-gray-800 text-center leading-tight min-h-[2.5em] flex items-center justify-center">
                                                    {flight.airlineName || 'N/A'}
                                                </div>
                                            </div>

                                            {/* Flight Route */}
                                            <div className="flex items-center justify-center gap-4 sm:gap-8 flex-1 w-full border-t md:border-t-0 p-4 md:p-0 border-gray-100 md:border-none">
                                                <div className="text-center">
                                                    <div className="text-3xl font-bold text-gray-800">{flight.departureTime || 'N/A'}</div>
                                                    <div className="text-sm font-semibold text-gray-500 mt-1">{flight.departureCode || flight.departureCity || 'SGN'}</div>
                                                </div>
                                                
                                                <div className="flex flex-col items-center px-4">
                                                    <i className="bi bi-airplane text-[#0292c6] text-xl transform rotate-90 w-8 h-8 flex items-center justify-center bg-blue-50 rounded-full mb-1"></i>
                                                    <div className="text-xs font-semibold text-gray-400">{flight.duration || 'N/A'}</div>
                                                </div>

                                                <div className="text-center">
                                                    <div className="text-3xl font-bold text-gray-800">{flight.arrivalTime || 'N/A'}</div>
                                                    <div className="text-sm font-semibold text-gray-500 mt-1">{flight.arrivalCode || flight.arrivalCity || 'HAN'}</div>
                                                </div>
                                            </div>

                                            {/* Price & Action */}
                                            <div className="flex flex-col items-end gap-3 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-gray-100">
                                                <div className="text-2xl font-bold text-[#0292c6]">
                                                    {formatPrice(flight.originalPrice)}
                                                </div>
                                                <button className="w-full md:w-auto bg-[#0292c6] text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-[#027aa5] transition-colors shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#0292c6] focus:ring-offset-2">
                                                    Chọn chuyến bay
                                                </button>
                                            </div>

                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Outstandingoffer;
