import React from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';

const AboutPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-100 to-white">
            <div className="max-w-4xl mx-auto p-8">
                <h1 className="text-4xl font-bold text-purple-800 mb-8">About RideEase</h1>
                
                <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                    <h2 className="text-2xl font-semibold text-purple-700 mb-4">Our Mission</h2>
                    <p className="text-gray-700 mb-4">
                        RideEase is committed to providing seamless and reliable transportation solutions 
                        for everyone. We believe in making travel accessible, affordable, and comfortable 
                        for all our users.
                    </p>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                    <h2 className="text-2xl font-semibold text-purple-700 mb-4">Developer</h2>
                    <div className="flex items-center space-x-4 mb-4">
                        <img 
                            src="/developer-photo.jpg" 
                            alt="Divyanshi Dwivedi"
                            className="w-24 h-24 rounded-full object-cover"
                        />
                        <div>
                            <h3 className="text-xl font-semibold">Divyanshi Dwivedi</h3>
                            <p className="text-gray-600">BCA Student</p>
                            <p className="text-gray-600">Chatrapati Shahu Ji Maharaj University</p>
                        </div>
                    </div>
                    <div className="flex space-x-4">
                        <a href="https://github.com/yourusername" className="text-gray-600 hover:text-purple-700">
                            <Github className="w-6 h-6" />
                        </a>
                        <a href="https://linkedin.com/in/yourusername" className="text-gray-600 hover:text-purple-700">
                            <Linkedin className="w-6 h-6" />
                        </a>
                        <a href="mailto:your.email@example.com" className="text-gray-600 hover:text-purple-700">
                            <Mail className="w-6 h-6" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutPage; 