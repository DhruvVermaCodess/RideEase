import React, { useState, useEffect, useCallback } from 'react';
import { MapPin, Navigation, Clock, Car, CreditCard, Search, Star, Phone, X } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import PaymentGateway from './PaymentGateway';
import { useNavigate } from 'react-router-dom';

// Fix for default marker icons in Leaflet with React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Card Components
const Card = ({ children, className = '' }) => (
    <div className={`bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 shadow-xl ${className}`}>
        {children}
    </div>
);

const CardContent = ({ children, className = '' }) => (
    <div className={`p-4 ${className}`}>
        {children}
    </div>
);

// Map update component
const MapUpdater = ({ center }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(center);
    }, [center, map]);
    return null;
};

// Update the constants at the top
const INDIA_BOUNDS = {
    north: 37.6,
    south: 8.4,
    east: 97.25,
    west: 68.7
};

// Add this helper function
const isLocationInIndia = (lat, lng) => {
    return lat >= INDIA_BOUNDS.south && 
           lat <= INDIA_BOUNDS.north && 
           lng >= INDIA_BOUNDS.west && 
           lng <= INDIA_BOUNDS.east;
};

// Add this new component before the UberApp component
const ClickHandler = ({ onMapClick }) => {
    const map = useMap();
    useEffect(() => {
        if (!map) return;
        
        map.on('click', onMapClick);
        return () => {
            map.off('click', onMapClick);
        };
    }, [map, onMapClick]);
    
    return null;
};

const UberApp = () => {
    const [activeTab, setActiveTab] = useState('ride');
    const [pickupLocation, setPickupLocation] = useState('');
    const [dropLocation, setDropLocation] = useState('');
    const [selectedRide, setSelectedRide] = useState(null);
    const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]); // Center of India
    const [pickupCoords, setPickupCoords] = useState(null);
    const [dropCoords, setDropCoords] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [distance, setDistance] = useState(null);
    const [rideOptions, setRideOptions] = useState([
        { id: 1, name: 'UberGo', price: '24.00', time: '4', image: 'car' },
        { id: 2, name: 'Premier', price: '32.00', time: '5', image: 'car' },
        { id: 3, name: 'UberXL', price: '45.00', time: '4', image: 'car' }
    ]);
    const [showPayment, setShowPayment] = useState(false);
    const navigate = useNavigate();
    const [routeCoordinates, setRouteCoordinates] = useState([]);

    // Function to geocode location using Nominatim
    const geocodeLocation = async (location, isPickup = true) => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}&countrycodes=in`
            );
            const data = await response.json();

            if (data.length > 0) {
                const coords = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
                
                if (!isLocationInIndia(coords[0], coords[1])) {
                    alert('Please select a location within India');
                    return;
                }

                if (isPickup) {
                    setPickupCoords(coords);
                } else {
                    setDropCoords(coords);
                }
                setMapCenter(coords);
            }
        } catch (error) {
            console.error('Geocoding error:', error);
        }
    };

    // Handle location input changes
    const handlePickupChange = (e) => {
        setPickupLocation(e.target.value);
        if (e.target.value.length > 3) {
            geocodeLocation(e.target.value, true);
        }
    };

    const handleDropChange = (e) => {
        setDropLocation(e.target.value);
        if (e.target.value.length > 3) {
            geocodeLocation(e.target.value, false);
        }
    };

    // Add click handler for map
    const handleMapClick = useCallback((e) => {
        const { lat, lng } = e.latlng;
        
        if (!isLocationInIndia(lat, lng)) {
            alert('Please select a location within India');
            return;
        }

        if (!pickupCoords) {
            setPickupCoords([lat, lng]);
            setPickupLocation(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
        } else if (!dropCoords) {
            setDropCoords([lat, lng]);
            setDropLocation(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
        }
    }, [pickupCoords, dropCoords]);

    // Add function to calculate distance and prices
    const calculateRideDetails = useCallback(async () => {
        if (pickupCoords && dropCoords) {
            setIsLoading(true);
            try {
                // Calculate route using OpenStreetMap Directions API
                const response = await fetch(
                    `https://router.project-osrm.org/route/v1/driving/${pickupCoords[1]},${pickupCoords[0]};${dropCoords[1]},${dropCoords[0]}?overview=full&geometries=geojson`
                );
                const data = await response.json();
                
                // Set route coordinates
                setRouteCoordinates(data.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]));
                
                const distanceInKm = (data.routes[0].distance / 1000).toFixed(2);
                setDistance(distanceInKm);

                // Calculate estimated time based on average speeds
                // UberGo: 40 km/h, Premier: 35 km/h, UberXL: 30 km/h
                const calculateTime = (speed) => {
                    const minutes = Math.ceil((distanceInKm / speed) * 60); // Convert to minutes and round up
                    if (minutes >= 60) {
                        const hours = Math.floor(minutes / 60);
                        const remainingMinutes = minutes % 60;
                        return `${hours}h ${remainingMinutes}m`;
                    }
                    return `${minutes}m`;
                };

                // Update ride options with calculated prices and times
                const basePrice = 20; // Base price in rupees
                const perKmRate = 12; // Rate per km in rupees
                const newRideOptions = [
                    { 
                        id: 1, 
                        name: 'UberGo', 
                        price: (basePrice + perKmRate * distanceInKm).toFixed(2), 
                        time: calculateTime(40), 
                        image: 'car' 
                    },
                    { 
                        id: 2, 
                        name: 'Premier', 
                        price: (basePrice * 1.5 + perKmRate * 1.2 * distanceInKm).toFixed(2), 
                        time: calculateTime(35), 
                        image: 'car' 
                    },
                    { 
                        id: 3, 
                        name: 'UberXL', 
                        price: (basePrice * 2 + perKmRate * 1.5 * distanceInKm).toFixed(2), 
                        time: calculateTime(30), 
                        image: 'car' 
                    }
                ];
                setRideOptions(newRideOptions);

                // Simulate loading
                await new Promise(resolve => setTimeout(resolve, 5000));
            } catch (error) {
                console.error('Error calculating route:', error);
            } finally {
                setIsLoading(false);
            }
        }
    }, [pickupCoords, dropCoords]);

    // Add effect to trigger calculation
    useEffect(() => {
        if (pickupCoords && dropCoords) {
            calculateRideDetails();
        }
    }, [pickupCoords, dropCoords, calculateRideDetails]);

    // Add booking handler
    const handleBooking = () => {
        if (!pickupLocation || !dropLocation) {
            alert('Please select both pickup and drop locations');
            return;
        }

        const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
        
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        if (selectedRide) {
            setShowPayment(true);
        }
    };

    const handlePaymentSuccess = () => {
        const booking = {
            pickup: pickupLocation,
            drop: dropLocation,
            ride: rideOptions.find(r => r.id === selectedRide),
            distance,
            timestamp: new Date().toISOString()
        };
        const existingBookings = JSON.parse(localStorage.getItem('uberBookings') || '[]');
        localStorage.setItem('uberBookings', JSON.stringify([...existingBookings, booking]));
        setShowPayment(false);
        alert('Ride booked successfully!');
    };

    const handlePaymentCancel = () => {
        setShowPayment(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 relative">
            {/* Add decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full opacity-20 blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-300 rounded-full opacity-20 blur-3xl"></div>
            </div>

            {/* Main Content */}
            <main className="max-w-6xl mx-auto p-6 relative z-10">
                <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Book Your Ride</h1>
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Left Column - Map */}
                    <div className="h-[500px] rounded-2xl overflow-hidden shadow-2xl relative z-0">
                        <MapContainer
                            center={mapCenter}
                            zoom={5}
                            maxBounds={[
                                [INDIA_BOUNDS.south, INDIA_BOUNDS.west],
                                [INDIA_BOUNDS.north, INDIA_BOUNDS.east]
                            ]}
                            style={{ height: '100%', width: '100%' }}
                        >
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                            <MapUpdater center={mapCenter} />
                            {pickupCoords && (
                                <Marker position={pickupCoords}>
                                    <Popup>Pickup Location</Popup>
                                </Marker>
                            )}
                            {dropCoords && (
                                <Marker position={dropCoords}>
                                    <Popup>Drop Location</Popup>
                                </Marker>
                            )}
                            {routeCoordinates.length > 0 && (
                                <Polyline
                                    positions={routeCoordinates}
                                    color="#6366f1"
                                    weight={4}
                                    opacity={0.8}
                                />
                            )}
                            <ClickHandler onMapClick={handleMapClick} />
                        </MapContainer>
                        {isLoading && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Ride Options */}
                    <div className="space-y-6">
                        {/* Location Inputs */}
                        <Card>
                            <CardContent className="space-y-4">
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 text-purple-600" />
                                    <input
                                        type="text"
                                        placeholder="Enter pickup location"
                                        className="w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/50 backdrop-blur-sm transition-all"
                                        value={pickupLocation}
                                        onChange={handlePickupChange}
                                    />
                                </div>
                                <div className="relative">
                                    <Navigation className="absolute left-3 top-3 text-purple-600" />
                                    <input
                                        type="text"
                                        placeholder="Enter destination"
                                        className="w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/50 backdrop-blur-sm transition-all"
                                        value={dropLocation}
                                        onChange={handleDropChange}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Ride Options */}
                        <Card>
                            <CardContent>
                                <h2 className="text-xl font-semibold mb-4 text-gray-800">Choose your ride</h2>
                                {distance && (
                                    <div className="mb-4 p-3 bg-purple-50 rounded-lg text-purple-700 flex items-center">
                                        <Navigation className="w-5 h-5 mr-2" />
                                        Distance: {distance} km
                                    </div>
                                )}
                                <div className="space-y-4">
                                    {rideOptions.map((ride) => (
                                        <div
                                            key={ride.id}
                                            className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all transform hover:scale-[1.02] ${
                                                selectedRide === ride.id 
                                                    ? 'border-purple-500 bg-purple-50' 
                                                    : 'hover:bg-gray-50'
                                            }`}
                                            onClick={() => setSelectedRide(ride.id)}
                                        >
                                            <div className="flex items-center space-x-4">
                                                <div className="p-2 bg-purple-100 rounded-lg">
                                                    <Car className="w-6 h-6 text-purple-600" />
                                                </div>
                                                <div>
                                                    <h3 className="font-medium text-gray-800">{ride.name}</h3>
                                                    <div className="flex items-center text-sm text-gray-500">
                                                        <Clock className="w-4 h-4 mr-1" />
                                                        <span>{ride.time}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-lg font-semibold text-purple-600">₹{ride.price}</div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Payment Method */}
                        <Card>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-purple-100 rounded-lg">
                                            <CreditCard className="w-5 h-5 text-purple-600" />
                                        </div>
                                        <span className="font-medium text-gray-800">Payment Method</span>
                                    </div>
                                    <button className="text-purple-600 hover:text-purple-800 font-medium">Change</button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Book Button */}
                        <button
                            className={`w-full py-4 rounded-xl text-white font-semibold transition-all transform hover:scale-[1.02] ${
                                selectedRide && pickupLocation && dropLocation 
                                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg' 
                                    : 'bg-gray-300 cursor-not-allowed'
                            }`}
                            disabled={!selectedRide || !pickupLocation || !dropLocation}
                            onClick={handleBooking}
                        >
                            Book Ride Now
                        </button>
                    </div>
                </div>
            </main>

            {/* Add the PaymentGateway component */}
            {showPayment && selectedRide && (
                <PaymentGateway
                    amount={rideOptions.find(r => r.id === selectedRide).price}
                    onSuccess={handlePaymentSuccess}
                    onCancel={handlePaymentCancel}
                />
            )}
        </div>
    );
};

export default UberApp;