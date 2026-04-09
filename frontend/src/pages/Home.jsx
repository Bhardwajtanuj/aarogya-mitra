import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Heart, Calendar, Users, Activity, Shield, TrendingUp } from 'lucide-react';

const Home = () => {
    const { isAuthenticated, user } = useAuth();

    const features = [
        {
            icon: <Calendar className="h-8 w-8" />,
            title: 'Easy Appointments',
            description: 'Book appointments with top doctors in just a few clicks'
        },
        {
            icon: <Users className="h-8 w-8" />,
            title: 'Expert Doctors',
            description: 'Access to qualified and experienced healthcare professionals'
        },
        {
            icon: <Activity className="h-8 w-8" />,
            title: 'Health Predictions',
            description: 'AI-powered disease prediction for early detection'
        },
        {
            icon: <Shield className="h-8 w-8" />,
            title: 'Secure & Private',
            description: 'Your health data is encrypted and completely secure'
        }
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-green-600 text-white">
                <div className="absolute inset-0 bg-black opacity-10"></div>
                <div className="relative page-container py-20 md:py-32">
                    <div className="text-center max-w-4xl mx-auto animate-fade-in">
                        <div className="flex justify-center mb-6">
                            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
                                <Heart className="h-16 w-16 text-white animate-pulse-slow" />
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            Welcome to Aarogya Mitra
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-blue-50">
                            Your Trusted e-Healthcare Management System
                        </p>
                        <p className="text-lg mb-10 text-blue-100 max-w-2xl mx-auto">
                            Seamlessly connect with healthcare professionals, manage appointments,
                            and get AI-powered health insights - all in one place.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            {isAuthenticated ? (
                                <Link
                                    to={`/${user.role}`}
                                    className="bg-white text-primary-700 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1"
                                >
                                    Go to Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        to="/register"
                                        className="bg-white text-primary-700 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1"
                                    >
                                        Get Started
                                    </Link>
                                    <Link
                                        to="/login"
                                        className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/10 transition-all duration-300"
                                    >
                                        Login
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white" />
                    </svg>
                </div>
            </section>

            {/* Features Section */}
            <section className="page-container py-20">
                <div className="text-center mb-16 animate-slide-up">
                    <h2 className="section-title">Why Choose Aarogya Mitra?</h2>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Experience healthcare management like never before with our comprehensive platform
                    </p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="card-hover p-6 text-center animate-slide-up"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary-100 to-green-100 text-primary-600 rounded-full mb-4">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-gray-800">{feature.title}</h3>
                            <p className="text-gray-600">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Stats Section */}
            <section className="bg-gradient-to-r from-primary-50 to-green-50 py-16">
                <div className="page-container">
                    <div className="grid md:grid-cols-3 gap-8 text-center">
                        <div className="animate-slide-up">
                            <div className="text-4xl font-bold gradient-text mb-2">500+</div>
                            <div className="text-gray-600 font-medium">Expert Doctors</div>
                        </div>
                        <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
                            <div className="text-4xl font-bold gradient-text mb-2">10,000+</div>
                            <div className="text-gray-600 font-medium">Happy Patients</div>
                        </div>
                        <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
                            <div className="text-4xl font-bold gradient-text mb-2">95%</div>
                            <div className="text-gray-600 font-medium">Satisfaction Rate</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            {!isAuthenticated && (
                <section className="page-container py-20">
                    <div className="card bg-gradient-to-r from-primary-600 to-green-600 text-white p-12 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Ready to Transform Your Healthcare Experience?
                        </h2>
                        <p className="text-xl mb-8 text-blue-50">
                            Join thousands of patients and doctors on our platform today
                        </p>
                        <Link
                            to="/register"
                            className="inline-block bg-white text-primary-700 px-10 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1"
                        >
                            Create Free Account
                        </Link>
                    </div>
                </section>
            )}
        </div>
    );
};

export default Home;
