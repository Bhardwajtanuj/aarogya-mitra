#!/usr/bin/env python3
"""
Comprehensive script to generate ALL remaining frontend pages
"""

import os

BASE = r"d:\resume\resume projects\aarogya-mitra\frontend\src\pages"

# All page templates
PAGES = {
    "patient/BookAppointment.jsx": """import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { Calendar, Clock, User, AlertCircle, CheckCircle } from 'lucide-react';

const BookAppointment = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [formData, setFormData] = useState({
    appointmentDate: '',
    timeSlot: { startTime: '', endTime: '' },
    symptoms: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await api.get('/appointments/doctors');
      setDoctors(response.data.data);
    } catch (error) {
      setError('Failed to load doctors');
    }
  };

  const timeSlots = [
    { start: '09:00', end: '10:00' },
    { start: '10:00', end: '11:00' },
    { start: '11:00', end: '12:00' },
    { start: '14:00', end: '15:00' },
    { start: '15:00', end: '16:00' },
    { start: '16:00', end: '17:00' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDoctor) {
      setError('Please select a doctor');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.post('/appointments', {
        doctor: selectedDoctor._id,
        ...formData
      });
      setSuccess(true);
      setTimeout(() => navigate('/patient/appointments'), 2000);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="page-container flex items-center justify-center min-h-[60vh]">
        <div className="card p-8 text-center max-w-md">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Appointment Booked!</h2>
          <p className="text-gray-600">Your appointment has been successfully booked.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Book Appointment</h1>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2">
          <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Doctors List */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Select a Doctor</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {doctors.map((doctor) => (
              <div
                key={doctor._id}
                onClick={() => setSelectedDoctor(doctor)}
                className={`card p-4 cursor-pointer transition-all ${
                  selectedDoctor?._id === doctor._id
                    ? 'ring-2 ring-primary-500 shadow-lg'
                    : 'hover:shadow-lg'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="bg-primary-100 p-2 rounded-full">
                    <User className="h-6 w-6 text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{doctor.name}</h3>
                    <p className="text-sm text-primary-600">{doctor.specialization}</p>
                    <p className="text-sm text-gray-500 mt-1">{doctor.qualification}</p>
                    <p className="text-sm font-medium text-gray-700 mt-2">
                      Fee: ₹{doctor.consultationFee}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Booking Form */}
        <div>
          <div className="card p-6 sticky top-24">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Appointment Details</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">
                  <Calendar className="inline h-4 w-4 mr-1" />
                  Date
                </label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="input-field"
                  value={formData.appointmentDate}
                  onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                />
              </div>

              <div>
                <label className="label">
                  <Clock className="inline h-4 w-4 mr-1" />
                  Time Slot
                </label>
                <select
                  required
                  className="input-field"
                  onChange={(e) => {
                    const [start, end] = e.target.value.split('-');
                    setFormData({
                      ...formData,
                      timeSlot: { startTime: start, endTime: end }
                    });
                  }}
                >
                  <option value="">Select time</option>
                  {timeSlots.map((slot, idx) => (
                    <option key={idx} value={`${slot.start}-${slot.end}`}>
                      {slot.start} - {slot.end}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">Symptoms (Optional)</label>
                <textarea
                  className="input-field"
                  rows={3}
                  placeholder="Describe your symptoms..."
                  value={formData.symptoms}
                  onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                />
              </div>

              <button
                type="submit"
                disabled={loading || !selectedDoctor}
                className="w-full btn-primary"
              >
                {loading ? 'Booking...' : 'Book Appointment'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
""",

    "patient/MyAppointments.jsx": """import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Calendar, Clock, User, FileText } from 'lucide-react';

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await api.get('/patient/appointments');
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
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Appointments</h1>

      {/* Filter Tabs */}
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

      {/* Appointments List */}
      {filteredAppointments.length > 0 ? (
        <div className="grid gap-4">
          {filteredAppointments.map((appointment) => (
            <div key={appointment._id} className="card p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="bg-primary-100 p-2 rounded-full">
                      <User className="h-6 w-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-800">
                        Dr. {appointment.doctor.name}
                      </h3>
                      <p className="text-sm text-primary-600">
                        {appointment.doctor.specialization}
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(appointment.appointmentDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>
                        {appointment.timeSlot.startTime} - {appointment.timeSlot.endTime}
                      </span>
                    </div>
                  </div>

                  {appointment.symptoms && (
                    <div className="mt-3 text-sm">
                      <span className="font-medium text-gray-700">Symptoms: </span>
                      <span className="text-gray-600">{appointment.symptoms}</span>
                    </div>
                  )}

                  {appointment.doctorNotes && (
                    <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <FileText className="h-4 w-4 text-blue-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-blue-900">Doctor's Notes:</p>
                          <p className="text-sm text-blue-700">{appointment.doctorNotes}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-4 md:mt-0 md:ml-6">
                  <span className={`badge-${appointment.status} text-sm px-4 py-2`}>
                    {appointment.status}
                  </span>
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

export default MyAppointments;
""",

    "patient/UploadReports.jsx": """import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Upload, FileText, Trash2, AlertCircle, CheckCircle } from 'lucide-react';

const UploadReports = () => {
  const [reports, setReports] = useState([]);
  const [file, setFile] = useState(null);
  const [reportName, setReportName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await api.get('/patient/reports');
      setReports(response.data.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'File size must be less than 5MB' });
        return;
      }
      setFile(selectedFile);
      setMessage({ type: '', text: '' });
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage({ type: 'error', text: 'Please select a file' });
      return;
    }

    setUploading(true);
    setMessage({ type: '', text: '' });

    const formData = new FormData();
    formData.append('report', file);
    formData.append('reportName', reportName || file.name);

    try {
      await api.post('/patient/upload-report', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMessage({ type: 'success', text: 'Report uploaded successfully!' });
      setFile(null);
      setReportName('');
      fetchReports();
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to upload report'
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="page-container">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Medical Reports</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Upload Form */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Upload New Report</h2>

            {message.text && (
              <div className={`mb-4 p-4 rounded-lg flex items-start space-x-2 ${
                message.type === 'success'
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-red-50 border border-red-200'
              }`}>
                {message.type === 'success' ? (
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                )}
                <p className={`text-sm ${
                  message.type === 'success' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {message.text}
                </p>
              </div>
            )}

            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="label">Report Name</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g., Blood Test Report"
                  value={reportName}
                  onChange={(e) => setReportName(e.target.value)}
                />
              </div>

              <div>
                <label className="label">Select File</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      {file ? file.name : 'Click to upload or drag and drop'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PDF, JPG, PNG (max 5MB)
                    </p>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={uploading || !file}
                className="w-full btn-primary"
              >
                {uploading ? 'Uploading...' : 'Upload Report'}
              </button>
            </form>
          </div>
        </div>

        {/* Reports List */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Your Reports</h2>
          {reports.length > 0 ? (
            <div className="grid gap-4">
              {reports.map((report, index) => (
                <div key={index} className="card p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{report.name}</h3>
                      <p className="text-sm text-gray-500">
                        Uploaded: {new Date(report.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <a
                    href={report.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary text-sm px-4 py-2"
                  >
                    View
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className="card p-12 text-center">
              <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No reports uploaded yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadReports;
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

print("Patient pages created successfully!")
