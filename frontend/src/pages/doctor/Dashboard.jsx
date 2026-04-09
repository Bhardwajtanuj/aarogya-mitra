import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { Calendar, Users, CheckCircle, XCircle } from 'lucide-react';

const DoctorDashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    accepted: 0,
    rejected: 0
  });
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/doctor/appointments');
      const appointments = response.data.data;
      
      setStats({
        total: appointments.length,
        pending: appointments.filter(a => a.status === 'pending').length,
        accepted: appointments.filter(a => a.status === 'accepted').length,
        rejected: appointments.filter(a => a.status === 'rejected').length
      });
      setRecentAppointments(appointments.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Doctor Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Appointments</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{stats.total}</p>
            </div>
            <Calendar className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Pending</p>
              <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.pending}</p>
            </div>
            <Users className="h-8 w-8 text-yellow-600" />
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Accepted</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{stats.accepted}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Rejected</p>
              <p className="text-3xl font-bold text-red-600 mt-2">{stats.rejected}</p>
            </div>
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
        </div>
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Recent Appointments</h2>
          <Link to="/doctor/appointments" className="text-primary-600 hover:text-primary-700 font-medium">
            View All
          </Link>
        </div>
        {recentAppointments.length > 0 ? (
          <div className="space-y-4">
            {recentAppointments.map((appointment) => (
              <div key={appointment._id} className="border-l-4 border-primary-500 bg-gray-50 p-4 rounded-r-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-800">{appointment.patient.name}</p>
                    <p className="text-sm text-gray-600">{appointment.patient.email}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(appointment.appointmentDate).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`badge-${appointment.status}`}>{appointment.status}</span>
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

export default DoctorDashboard;
