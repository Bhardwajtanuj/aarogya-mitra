import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { Calendar, Activity, FileText, Heart, TrendingUp } from 'lucide-react';

const PatientDashboard = () => {
    const [stats, setStats] = useState({
        totalAppointments: 0,
        pendingAppointments: 0,
        completedAppointments: 0,
        totalReports: 0
    });
    const [recentAppointments, setRecentAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [appointmentsRes, reportsRes] = await Promise.all([
                api.get('/patient/appointments'),
                api.get('/patient/reports')
            ]);

            const appointments = appointmentsRes.data.data;
            setStats({
                totalAppointments: appointments.length,
                pendingAppointments: appointments.filter(a => a.status === 'pending').length,
                completedAppointments: appointments.filter(a => a.status === 'completed').length,
                totalReports: reportsRes.data.data.length
            });
            setRecentAppointments(appointments.slice(0, 5));
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const quickActions = [
        { title: 'Book Appointment', icon: <Calendar />, link: '/patient/book-appointment', color: 'from-blue-500 to-blue-600' },
        { title: 'My Appointments', icon: <Activity />, link: '/patient/appointments', color: 'from-green-500 to-green-600' },
        { title: 'Upload Reports', icon: <FileText />, link: '/patient/upload-reports', color: 'from-purple-500 to-purple-600' },
        { title: 'Health Prediction', icon: <Heart />, link: '/patient/prediction', color: 'from-red-500 to-red-600' }
    ];

    if (loading) {
        return (
            <div className="page-container flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="mb-8 animate-fade-in">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Patient Dashboard</h1>
                <p className="text-gray-600">Welcome back! Here's your health overview.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="card p-6 animate-slide-up">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm font-medium">Total Appointments</p>
                            <p className="text-3xl font-bold text-gray-800 mt-2">{stats.totalAppointments}</p>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-lg">
                            <Calendar className="h-8 w-8 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="card p-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm font-medium">Pending</p>
                            <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.pendingAppointments}</p>
                        </div>
                        <div className="bg-yellow-100 p-3 rounded-lg">
                            <Activity className="h-8 w-8 text-yellow-600" />
                        </div>
                    </div>
                </div>

                <div className="card p-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm font-medium">Completed</p>
                            <p className="text-3xl font-bold text-green-600 mt-2">{stats.completedAppointments}</p>
                        </div>
                        <div className="bg-green-100 p-3 rounded-lg">
                            <TrendingUp className="h-8 w-8 text-green-600" />
                        </div>
                    </div>
                </div>

                <div className="card p-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm font-medium">Medical Reports</p>
                            <p className="text-3xl font-bold text-purple-600 mt-2">{stats.totalReports}</p>
                        </div>
                        <div className="bg-purple-100 p-3 rounded-lg">
                            <FileText className="h-8 w-8 text-purple-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {quickActions.map((action, index) => (
                        <Link
                            key={index}
                            to={action.link}
                            className="card-hover p-6 text-center group"
                        >
                            <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${action.color} text-white rounded-full mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                {action.icon}
                            </div>
                            <h3 className="font-semibold text-gray-800">{action.title}</h3>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Recent Appointments */}
            <div className="card p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">Recent Appointments</h2>
                    <Link to="/patient/appointments" className="text-primary-600 hover:text-primary-700 font-medium">
                        View All
                    </Link>
                </div>
                {recentAppointments.length > 0 ? (
                    <div className="space-y-4">
                        {recentAppointments.map((appointment) => (
                            <div key={appointment._id} className="border-l-4 border-primary-500 bg-gray-50 p-4 rounded-r-lg">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-semibold text-gray-800">Dr. {appointment.doctor.name}</p>
                                        <p className="text-sm text-gray-600">{appointment.doctor.specialization}</p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {new Date(appointment.appointmentDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <span className={`badge-${appointment.status}`}>
                                        {appointment.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-center py-8">No appointments yet</p>
                )}
            </div>
        </div>
    );
};

export default PatientDashboard;
