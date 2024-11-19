import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    
    const isActive = (path) => location.pathname === path;

    return (
        <>
            {/* Header */}
            <header className="bg-gradient-to-r from-purple-800 to-purple-600 text-white p-4">
                <div className="flex items-center justify-between max-w-6xl mx-auto">
                    <div className="flex items-center space-x-4">
                        <Menu 
                            className="w-6 h-6 cursor-pointer md:hidden" 
                            onClick={() => setSidebarOpen(true)} 
                        />
                        <h1 
                            className="text-2xl font-bold cursor-pointer" 
                            onClick={() => navigate('/')}
                        >
                            RideEase
                        </h1>
                    </div>
                    <nav className="hidden md:flex space-x-6">
                        <button
                            className={`px-4 py-2 rounded-full ${
                                isActive('/') ? 'bg-white text-purple-800' : ''
                            }`}
                            onClick={() => navigate('/')}
                        >
                            Ride
                        </button>
                        <button
                            className={`px-4 py-2 rounded-full ${
                                isActive('/yourRides') ? 'bg-white text-purple-800' : ''
                            }`}
                            onClick={() => navigate('/yourRides')}
                        >
                            Your Rides
                        </button>
                        <button
                            className={`px-4 py-2 rounded-full ${
                                isActive('/about') ? 'bg-white text-purple-800' : ''
                            }`}
                            onClick={() => navigate('/about')}
                        >
                            About
                        </button>
                    </nav>
                </div>
            </header>

            {/* Mobile Sidebar */}
            <div className={`fixed inset-0 z-50 md:hidden ${isSidebarOpen ? 'block' : 'hidden'}`}>
                {/* Overlay */}
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50"
                    onClick={() => setSidebarOpen(false)}
                ></div>
                
                {/* Sidebar */}
                <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
                    <div className="p-4 border-b">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-purple-800">Menu</h2>
                            <X 
                                className="w-6 h-6 cursor-pointer text-gray-600" 
                                onClick={() => setSidebarOpen(false)}
                            />
                        </div>
                    </div>
                    <nav className="p-4">
                        <div className="space-y-2">
                            <button
                                className={`w-full text-left px-4 py-2 rounded-lg ${
                                    isActive('/') ? 'bg-purple-100 text-purple-800' : 'text-gray-600'
                                }`}
                                onClick={() => {
                                    navigate('/');
                                    setSidebarOpen(false);
                                }}
                            >
                                Ride
                            </button>
                            <button
                                className={`w-full text-left px-4 py-2 rounded-lg ${
                                    isActive('/yourRides') ? 'bg-purple-100 text-purple-800' : 'text-gray-600'
                                }`}
                                onClick={() => {
                                    navigate('/yourRides');
                                    setSidebarOpen(false);
                                }}
                            >
                                Your Rides
                            </button>
                            <button
                                className={`w-full text-left px-4 py-2 rounded-lg ${
                                    isActive('/about') ? 'bg-purple-100 text-purple-800' : 'text-gray-600'
                                }`}
                                onClick={() => {
                                    navigate('/about');
                                    setSidebarOpen(false);
                                }}
                            >
                                About
                            </button>
                        </div>
                    </nav>
                </div>
            </div>
        </>
    );
};

export default Header; 