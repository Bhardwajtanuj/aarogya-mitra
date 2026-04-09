import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Calendar, Clock, User, FileText, Check, X, Save, ChevronDown, ChevronUp } from 'lucide-react';

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  const [notes, setNotes] = useState({});
  const [savingNotes, setSavingNotes] = useState({});
  const [notesMsg, setNotesMsg] = useState({});

  useEffect(() => { fetchAppointments(); }, []);

  const fetchAppointments = async () => {
    try {
      const res = await api.get('/doctor/appointments');
      setAppointments(res.data.data);
      // Pre-fill notes
      const n = {};
      res.data.data.forEach(a => { n[a._id] = a.doctorNotes || ''; });
      setNotes(n);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await api.put(`/doctor/appointments/${id}/status`, { status, doctorNotes: notes[id] || undefined });
      fetchAppointments();
    } catch (e) { console.error(e); }
  };

  const handleSaveNotes = async (id) => {
    setSavingNotes(prev => ({ ...prev, [id]: true }));
    try {
      await api.put(`/doctor/appointments/${id}/notes`, { doctorNotes: notes[id] });
      setNotesMsg(prev => ({ ...prev, [id]: 'Notes saved!' }));
      setTimeout(() => setNotesMsg(prev => ({ ...prev, [id]: '' })), 2000);
    } catch (e) { console.error(e); }
    finally { setSavingNotes(prev => ({ ...prev, [id]: false })); }
  };

  const filteredAppointments = filter === 'all' ? appointments : appointments.filter(a => a.status === filter);

  const statusBadge = {
    pending: 'bg-yellow-100 text-yellow-700',
    accepted: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
    completed: 'bg-blue-100 text-blue-700',
    cancelled: 'bg-gray-100 text-gray-600'
  };

  if (loading) return (
    <div className="page-container flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600" />
    </div>
  );

  return (
    <div className="page-container">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Appointments</h1>

      <div className="flex space-x-2 mb-6 overflow-x-auto pb-1">
        {['all', 'pending', 'accepted', 'rejected', 'completed'].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-lg font-medium capitalize whitespace-nowrap transition-colors ${
              filter === s ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}>
            {s}
            <span className="ml-1 text-xs opacity-70">
              ({s === 'all' ? appointments.length : appointments.filter(a => a.status === s).length})
            </span>
          </button>
        ))}
      </div>

      {filteredAppointments.length === 0 ? (
        <div className="card p-12 text-center">
          <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No appointments found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAppointments.map(appt => (
            <div key={appt._id} className="card overflow-hidden">
              <div className="p-5">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-primary-100 p-2 rounded-full">
                        <User className="h-5 w-5 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800">{appt.patient?.name}</h3>
                        <p className="text-sm text-gray-500">{appt.patient?.email}</p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-2 text-sm mb-2">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        {new Date(appt.appointmentDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="h-4 w-4 text-gray-400" />
                        {appt.timeSlot?.startTime} – {appt.timeSlot?.endTime}
                      </div>
                    </div>

                    {appt.symptoms && (
                      <div className="mb-2 p-2 bg-gray-50 rounded text-sm text-gray-600">
                        <span className="font-medium">Symptoms: </span>{appt.symptoms}
                      </div>
                    )}
                    {appt.patient?.bloodGroup && (
                      <p className="text-sm text-gray-500"><span className="font-medium">Blood Group:</span> {appt.patient.bloodGroup}</p>
                    )}
                  </div>

                  <div className="mt-4 lg:mt-0 lg:ml-6 flex flex-col items-end gap-2 min-w-[140px]">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${statusBadge[appt.status]}`}>
                      {appt.status}
                    </span>
                    {appt.status === 'pending' && (
                      <div className="flex gap-2">
                        <button onClick={() => handleStatusUpdate(appt._id, 'accepted')}
                          className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">
                          <Check className="h-3.5 w-3.5" /> Accept
                        </button>
                        <button onClick={() => handleStatusUpdate(appt._id, 'rejected')}
                          className="flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700">
                          <X className="h-3.5 w-3.5" /> Reject
                        </button>
                      </div>
                    )}
                    {appt.status === 'accepted' && (
                      <button onClick={() => handleStatusUpdate(appt._id, 'completed')}
                        className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                        Mark Complete
                      </button>
                    )}
                    <button onClick={() => setExpandedId(expandedId === appt._id ? null : appt._id)}
                      className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 mt-1">
                      <FileText className="h-3.5 w-3.5" />
                      {expandedId === appt._id ? 'Hide' : 'Doctor Notes'}
                      {expandedId === appt._id ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Doctor Notes panel */}
              {expandedId === appt._id && (
                <div className="border-t border-gray-100 bg-gray-50 p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Doctor Notes (visible to patient after completion)
                  </label>
                  <textarea
                    rows={3}
                    value={notes[appt._id] || ''}
                    onChange={e => setNotes(prev => ({ ...prev, [appt._id]: e.target.value }))}
                    placeholder="Enter diagnosis, prescription, follow-up instructions..."
                    className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                  />
                  <div className="flex items-center gap-3 mt-2">
                    <button onClick={() => handleSaveNotes(appt._id)}
                      disabled={savingNotes[appt._id]}
                      className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700 disabled:opacity-50">
                      <Save className="h-3.5 w-3.5" />
                      {savingNotes[appt._id] ? 'Saving...' : 'Save Notes'}
                    </button>
                    {notesMsg[appt._id] && <span className="text-green-600 text-sm">{notesMsg[appt._id]}</span>}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorAppointments;
