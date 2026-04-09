import React, { useState, useEffect } from 'react';
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
