import React, { useState, useEffect } from 'react';
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
