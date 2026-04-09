import React, { useState, useEffect } from 'react';
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
