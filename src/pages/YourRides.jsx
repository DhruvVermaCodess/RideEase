import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Clock, Car } from 'lucide-react';

const YourRides = () => {
    const [rides, setRides] = useState([]);

    useEffect(() => {
        const storedRides = JSON.parse(localStorage.getItem('uberBookings') || '[]');
        // Add status if not present
        const ridesWithStatus = storedRides.map(ride => ({
            ...ride,
            status: ride.status || 'ongoing'
        }));
        setRides(ridesWithStatus);
    }, []);

    const handleStatusChange = (index) => {
        const updatedRides = [...rides];
        updatedRides[index].status = 'completed';
        setRides(updatedRides);
        localStorage.setItem('uberBookings', JSON.stringify(updatedRides));
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">Your Rides</h1>
                
                {rides.length === 0 ? (
                    <div className="bg-white rounded-lg p-6 text-center">
                        <p className="text-gray-500">No rides found</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {rides.map((ride, index) => (
                            <div key={index} className="bg-white rounded-lg shadow-lg p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center space-x-2">
                                            <MapPin className="text-gray-500" />
                                            <span>Pickup: {ride.pickup}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Navigation className="text-gray-500" />
                                            <span>Drop: {ride.drop}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="font-semibold">₹{ride.ride.price}</span>
                                        <span className={`px-3 py-1 rounded-full text-sm ${
                                            ride.status === 'ongoing' 
                                                ? 'bg-blue-100 text-blue-800'
                                                : 'bg-green-100 text-green-800'
                                        }`}>
                                            {ride.status}
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="flex items-center justify-between border-t pt-4">
                                    <div className="flex items-center space-x-4">
                                        <Car className="text-gray-500" />
                                        <div>
                                            <p className="font-medium">{ride.ride.name}</p>
                                            <div className="flex items-center text-sm text-gray-500">
                                                <Clock className="w-4 h-4 mr-1" />
                                                <span>{ride.ride.time}</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {ride.status === 'ongoing' && (
                                        <button
                                            onClick={() => handleStatusChange(index)}
                                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                                        >
                                            Mark as Completed
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default YourRides;
