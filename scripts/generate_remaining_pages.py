#!/usr/bin/env python3
import os

BASE = r"d:\resume\resume projects\aarogya-mitra\frontend\src\pages"

# Remaining pages
PAGES = {
    "patient/Prediction.jsx": """import React, { useState } from 'react';
import api from '../../utils/api';
import { Heart, Activity, AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';

const Prediction = () => {
  const [formData, setFormData] = useState({
    age: '',
    sex: '1',
    cp: '0',
    trestbps: '',
    chol: '',
    fbs: '0',
    restecg: '0',
    thalach: '',
    exang: '0',
    oldpeak: '',
    slope: '0',
    ca: '0',
    thal: '0'
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    const numericData = {};
    for (const [key, value] of Object.entries(formData)) {
      numericData[key] = parseFloat(value);
    }

    try {
      const response = await api.post('/predictions/heart-disease', numericData);
      setResult(response.data.data);
    } catch (error) {
      setError(error.response?.data?.message || 'Prediction failed');
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="page-container">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Heart Disease Prediction</h1>
        <p className="text-gray-600">AI-powered health risk assessment</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="card p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Age</label>
                  <input type="number" required className="input-field" value={formData.age}
                    onChange={(e) => setFormData({...formData, age: e.target.value})} />
                </div>
                <div>
                  <label className="label">Sex</label>
                  <select className="input-field" value={formData.sex}
                    onChange={(e) => setFormData({...formData, sex: e.target.value})}>
                    <option value="1">Male</option>
                    <option value="0">Female</option>
                  </select>
                </div>
                <div>
                  <label className="label">Chest Pain Type (0-3)</label>
                  <input type="number" required min="0" max="3" className="input-field" value={formData.cp}
                    onChange={(e) => setFormData({...formData, cp: e.target.value})} />
                </div>
                <div>
                  <label className="label">Resting Blood Pressure</label>
                  <input type="number" required className="input-field" value={formData.trestbps}
                    onChange={(e) => setFormData({...formData, trestbps: e.target.value})} />
                </div>
                <div>
                  <label className="label">Cholesterol (mg/dl)</label>
                  <input type="number" required className="input-field" value={formData.chol}
                    onChange={(e) => setFormData({...formData, chol: e.target.value})} />
                </div>
                <div>
                  <label className="label">Fasting Blood Sugar &gt; 120</label>
                  <select className="input-field" value={formData.fbs}
                    onChange={(e) => setFormData({...formData, fbs: e.target.value})}>
                    <option value="0">No</option>
                    <option value="1">Yes</option>
                  </select>
                </div>
                <div>
                  <label className="label">Resting ECG (0-2)</label>
                  <input type="number" required min="0" max="2" className="input-field" value={formData.restecg}
                    onChange={(e) => setFormData({...formData, restecg: e.target.value})} />
                </div>
                <div>
                  <label className="label">Max Heart Rate</label>
                  <input type="number" required className="input-field" value={formData.thalach}
                    onChange={(e) => setFormData({...formData, thalach: e.target.value})} />
                </div>
                <div>
                  <label className="label">Exercise Induced Angina</label>
                  <select className="input-field" value={formData.exang}
                    onChange={(e) => setFormData({...formData, exang: e.target.value})}>
                    <option value="0">No</option>
                    <option value="1">Yes</option>
                  </select>
                </div>
                <div>
                  <label className="label">ST Depression</label>
                  <input type="number" step="0.1" required className="input-field" value={formData.oldpeak}
                    onChange={(e) => setFormData({...formData, oldpeak: e.target.value})} />
                </div>
                <div>
                  <label className="label">Slope (0-2)</label>
                  <input type="number" required min="0" max="2" className="input-field" value={formData.slope}
                    onChange={(e) => setFormData({...formData, slope: e.target.value})} />
                </div>
                <div>
                  <label className="label">CA (0-4)</label>
                  <input type="number" required min="0" max="4" className="input-field" value={formData.ca}
                    onChange={(e) => setFormData({...formData, ca: e.target.value})} />
                </div>
                <div>
                  <label className="label">Thal (0-3)</label>
                  <input type="number" required min="0" max="3" className="input-field" value={formData.thal}
                    onChange={(e) => setFormData({...formData, thal: e.target.value})} />
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full btn-primary">
                {loading ? 'Analyzing...' : 'Get Prediction'}
              </button>
            </form>
          </div>
        </div>

        <div>
          {error && (
            <div className="card p-6 bg-red-50 border-2 border-red-200 mb-4">
              <AlertCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <p className="text-red-600 text-center">{error}</p>
            </div>
          )}

          {result && (
            <div className="card p-6">
              <div className="text-center mb-4">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                  result.prediction === 'Positive' ? 'bg-red-100' : 'bg-green-100'
                }`}>
                  <Heart className={`h-8 w-8 ${
                    result.prediction === 'Positive' ? 'text-red-600' : 'text-green-600'
                  }`} />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Prediction Result</h3>
                <p className={`text-xl font-semibold ${
                  result.prediction === 'Positive' ? 'text-red-600' : 'text-green-600'
                }`}>
                  {result.prediction}
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Probability</p>
                  <p className="text-lg font-bold text-gray-800">
                    {(result.probability * 100).toFixed(1)}%
                  </p>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Risk Level</p>
                  <span className={`inline-block px-3 py-1 rounded-full font-semibold ${getRiskColor(result.riskLevel)}`}>
                    {result.riskLevel.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-900">
                  <strong>Note:</strong> This is an AI prediction and should not replace professional medical advice.
                  Please consult with a healthcare provider.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Prediction;
""",

    "doctor/Dashboard.jsx": """import React, { useState, useEffect } from 'react';
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
""",

    "doctor/Appointments.jsx": """import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Calendar, Clock, User, FileText, Check, X } from 'lucide-react';

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await api.get('/doctor/appointments');
      setAppointments(response.data.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (appointmentId, status, notes = '') => {
    try {
      await api.put(`/doctor/appointments/${appointmentId}/status`, {
        status,
        doctorNotes: notes
      });
      fetchAppointments();
    } catch (error) {
      console.error('Error updating appointment:', error);
    }
  };

  const filteredAppointments = filter === 'all'
    ? appointments
    : appointments.filter(a => a.status === filter);

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Appointments</h1>

      <div className="flex space-x-2 mb-6 overflow-x-auto">
        {['all', 'pending', 'accepted', 'rejected', 'completed'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${
              filter === status
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {filteredAppointments.length > 0 ? (
        <div className="grid gap-4">
          {filteredAppointments.map((appointment) => (
            <div key={appointment._id} className="card p-6">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="bg-primary-100 p-2 rounded-full">
                      <User className="h-6 w-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-800">{appointment.patient.name}</h3>
                      <p className="text-sm text-gray-600">{appointment.patient.email}</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-3 text-sm mb-3">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(appointment.appointmentDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>{appointment.timeSlot.startTime} - {appointment.timeSlot.endTime}</span>
                    </div>
                  </div>

                  {appointment.symptoms && (
                    <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-700">Symptoms:</p>
                      <p className="text-sm text-gray-600">{appointment.symptoms}</p>
                    </div>
                  )}

                  {appointment.patient.bloodGroup && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Blood Group:</span> {appointment.patient.bloodGroup}
                    </p>
                  )}
                </div>

                <div className="mt-4 lg:mt-0 lg:ml-6 flex flex-col space-y-2">
                  <span className={`badge-${appointment.status} text-center`}>
                    {appointment.status}
                  </span>
                  
                  {appointment.status === 'pending' && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleStatusUpdate(appointment._id, 'accepted')}
                        className="flex-1 btn-success text-sm px-3 py-2"
                      >
                        <Check className="h-4 w-4 inline mr-1" />
                        Accept
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(appointment._id, 'rejected')}
                        className="flex-1 btn-danger text-sm px-3 py-2"
                      >
                        <X className="h-4 w-4 inline mr-1" />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card p-12 text-center">
          <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No appointments found</p>
        </div>
      )}
    </div>
  );
};

export default DoctorAppointments;
""",

    "admin/Dashboard.jsx": """import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Users, UserCheck, Calendar, Activity } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    totalAppointments: 0,
    pendingAppointments: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/admin/dashboard');
      setStats(response.data.data);
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
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Patients</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">{stats.totalPatients}</p>
            </div>
            <Users className="h-10 w-10 text-blue-600" />
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Doctors</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{stats.totalDoctors}</p>
            </div>
            <UserCheck className="h-10 w-10 text-green-600" />
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Appointments</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">{stats.totalAppointments}</p>
            </div>
            <Calendar className="h-10 w-10 text-purple-600" />
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Pending Appointments</p>
              <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.pendingAppointments}</p>
            </div>
            <Activity className="h-10 w-10 text-yellow-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
""",

    "admin/ManageUsers.jsx": """import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Users, UserCheck } from 'lucide-react';

const ManageUsers = () => {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [activeTab, setActiveTab] = useState('patients');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const [patientsRes, doctorsRes] = await Promise.all([
        api.get('/admin/patients'),
        api.get('/admin/doctors')
      ]);
      setPatients(patientsRes.data.data);
      setDoctors(doctorsRes.data.data);
    } catch (error) {
      console.error('Error fetching users:', error);
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
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Manage Users</h1>

      <div className="flex space-x-2 mb-6">
        <button
          onClick={() => setActiveTab('patients')}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            activeTab === 'patients'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Patients ({patients.length})
        </button>
        <button
          onClick={() => setActiveTab('doctors')}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            activeTab === 'doctors'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Doctors ({doctors.length})
        </button>
      </div>

      {activeTab === 'patients' ? (
        <div className="grid gap-4">
          {patients.map((patient) => (
            <div key={patient._id} className="card p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800">{patient.name}</h3>
                  <p className="text-sm text-gray-600">{patient.email}</p>
                  <p className="text-sm text-gray-500">{patient.phone}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Blood Group: {patient.bloodGroup || 'N/A'}</p>
                  <p className="text-sm text-gray-500">
                    Joined: {new Date(patient.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-4">
          {doctors.map((doctor) => (
            <div key={doctor._id} className="card p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <UserCheck className="h-6 w-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800">Dr. {doctor.name}</h3>
                  <p className="text-sm text-primary-600">{doctor.specialization}</p>
                  <p className="text-sm text-gray-600">{doctor.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Fee: ₹{doctor.consultationFee}</p>
                  <p className="text-sm text-gray-500">Experience: {doctor.experience} years</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
""",

    "admin/ManageAppointments.jsx": """import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Calendar, Clock, User } from 'lucide-react';

const ManageAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await api.get('/admin/appointments');
      setAppointments(response.data.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAppointments = filter === 'all'
    ? appointments
    : appointments.filter(a => a.status === filter);

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Manage Appointments</h1>

      <div className="flex space-x-2 mb-6 overflow-x-auto">
        {['all', 'pending', 'accepted', 'rejected', 'completed'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${
              filter === status
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {filteredAppointments.length > 0 ? (
        <div className="grid gap-4">
          {filteredAppointments.map((appointment) => (
            <div key={appointment._id} className="card p-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Patient</h4>
                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-800">{appointment.patient.name}</p>
                      <p className="text-sm text-gray-600">{appointment.patient.email}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Doctor</h4>
                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium text-gray-800">Dr. {appointment.doctor.name}</p>
                      <p className="text-sm text-gray-600">{appointment.doctor.specialization}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">
                      {new Date(appointment.appointmentDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">
                      {appointment.timeSlot.startTime} - {appointment.timeSlot.endTime}
                    </span>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <span className={`badge-${appointment.status}`}>{appointment.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card p-12 text-center">
          <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No appointments found</p>
        </div>
      )}
    </div>
  );
};

export default ManageAppointments;
"""
}

def create_file(path, content):
    full_path = os.path.join(BASE, path)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Created: {full_path}")

for path, content in PAGES.items():
    create_file(path, content)

print("All remaining pages created successfully!")
