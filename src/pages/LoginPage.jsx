import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        
        // Hardcoded credentials
        const validEmail = 'divyanshiadmin@gmail.com';
        const validPassword = '123456';

        if (email === validEmail && password === validPassword) {
            // Set auth state in localStorage
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('userEmail', email);
            
            // Redirect to home page
            navigate('/');
        } else {
            setError('Invalid email or password');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-100 to-white">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-2xl font-bold text-center mb-6 text-purple-800">Login to RideEase</h1>
                
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-purple-700 text-white py-2 rounded-lg hover:bg-purple-800 transition-colors"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
