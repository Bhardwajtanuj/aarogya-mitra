import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { ChevronLeft, ChevronRight, Calendar, Clock, User, CheckCircle } from 'lucide-react';

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const AvailabilityCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarData, setCalendarData] = useState({ availableDays: [], availableTimeSlots: [], appointments: [] });
  const [selectedDay, setSelectedDay] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [localAvailDays, setLocalAvailDays] = useState([]);
  const [newSlot, setNewSlot] = useState({ startTime: '', endTime: '' });
  const [localSlots, setLocalSlots] = useState([]);
  const [saveMsg, setSaveMsg] = useState('');

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();

  useEffect(() => { fetchCalendar(); }, [month, year]);

  const fetchCalendar = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/doctor/availability-calendar?month=${month}&year=${year}`);
      setCalendarData(res.data.data);
      setLocalAvailDays(res.data.data.availableDays || []);
      setLocalSlots(res.data.data.availableTimeSlots || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const getDaysInMonth = () => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);
    return days;
  };

  const isAvailableDay = (day) => {
    if (!day) return false;
    const dow = new Date(year, month, day).getDay();
    return localAvailDays.includes(DAYS_OF_WEEK[dow]);
  };

  const getAppointmentsForDay = (day) => {
    if (!day) return [];
    return calendarData.appointments.filter(a => {
      const aDate = new Date(a.appointmentDate);
      return aDate.getDate() === day && aDate.getMonth() === month && aDate.getFullYear() === year;
    });
  };

  const toggleDay = (dayName) => {
    setLocalAvailDays(prev =>
      prev.includes(dayName) ? prev.filter(d => d !== dayName) : [...prev, dayName]
    );
  };

  const addSlot = () => {
    if (!newSlot.startTime || !newSlot.endTime) return;
    setLocalSlots(prev => [...prev, { ...newSlot }]);
    setNewSlot({ startTime: '', endTime: '' });
  };

  const removeSlot = (idx) => setLocalSlots(prev => prev.filter((_, i) => i !== idx));

  const saveAvailability = async () => {
    setSaving(true);
    try {
      await api.put('/doctor/profile', { availableDays: localAvailDays, availableTimeSlots: localSlots });
      setSaveMsg('Availability saved!');
      setEditMode(false);
      fetchCalendar();
      setTimeout(() => setSaveMsg(''), 3000);
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const statusColor = { pending: 'bg-yellow-400', accepted: 'bg-green-400', completed: 'bg-blue-400' };

  const days = getDaysInMonth();
  const today = new Date();
  const isToday = (d) => d && today.getDate() === d && today.getMonth() === month && today.getFullYear() === year;

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Availability Calendar</h1>
          <p className="text-gray-500">Manage your schedule and view appointments</p>
        </div>
        <button onClick={() => setEditMode(!editMode)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${editMode ? 'bg-gray-200 text-gray-700' : 'btn-primary text-sm'}`}>
          {editMode ? 'Cancel' : 'Edit Availability'}
        </button>
      </div>

      {saveMsg && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg flex items-center gap-2">
          <CheckCircle className="h-4 w-4" /> {saveMsg}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-4">
            <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-gray-100"><ChevronLeft className="h-5 w-5" /></button>
            <h2 className="text-lg font-semibold text-gray-800">{MONTHS[month]} {year}</h2>
            <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-gray-100"><ChevronRight className="h-5 w-5" /></button>
          </div>

          <div className="grid grid-cols-7 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} className="text-center text-xs font-semibold text-gray-400 py-2">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {days.map((day, idx) => {
              const appts = getAppointmentsForDay(day);
              const avail = isAvailableDay(day);
              const selected = selectedDay === day;
              return (
                <div key={idx}
                  onClick={() => day && setSelectedDay(day === selectedDay ? null : day)}
                  className={`min-h-[60px] p-1 rounded-lg border transition-all cursor-pointer ${
                    !day ? 'border-transparent' :
                    selected ? 'border-primary-500 bg-primary-50' :
                    isToday(day) ? 'border-primary-300 bg-primary-50' :
                    avail ? 'border-green-200 bg-green-50 hover:border-green-400' :
                    'border-gray-100 hover:border-gray-300 bg-white'
                  }`}>
                  {day && (
                    <>
                      <p className={`text-sm font-medium text-center ${isToday(day) ? 'text-primary-700 font-bold' : 'text-gray-700'}`}>{day}</p>
                      {avail && <div className="w-1.5 h-1.5 rounded-full bg-green-400 mx-auto mt-1" />}
                      <div className="flex flex-wrap gap-0.5 mt-1 justify-center">
                        {appts.slice(0, 3).map((a, i) => (
                          <div key={i} className={`w-2 h-2 rounded-full ${statusColor[a.status] || 'bg-gray-300'}`} title={a.status} />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex gap-4 mt-4 text-xs text-gray-500">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-green-400 inline-block" /> Available</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-yellow-400 inline-block" /> Pending</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-blue-400 inline-block" /> Completed</span>
          </div>
        </div>

        {/* Side panel */}
        <div className="space-y-4">
          {/* Selected day appointments */}
          {selectedDay && (
            <div className="card p-4">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary-600" />
                {MONTHS[month]} {selectedDay}
              </h3>
              {getAppointmentsForDay(selectedDay).length === 0 ? (
                <p className="text-sm text-gray-400">No appointments</p>
              ) : (
                getAppointmentsForDay(selectedDay).map((a, i) => (
                  <div key={i} className="p-2 bg-gray-50 rounded-lg mb-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium">{a.timeSlot?.startTime} - {a.timeSlot?.endTime}</span>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor[a.status]} text-white`}>{a.status}</span>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Edit availability */}
          {editMode ? (
            <div className="card p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Set Available Days</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {DAYS_OF_WEEK.map(d => (
                  <button key={d}
                    onClick={() => toggleDay(d)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                      localAvailDays.includes(d) ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-gray-100 text-gray-600 border border-gray-200'
                    }`}>
                    {d.slice(0, 3)}
                  </button>
                ))}
              </div>

              <h4 className="font-medium text-gray-700 mb-2 flex items-center gap-1 text-sm">
                <Clock className="h-4 w-4" /> Time Slots
              </h4>
              {localSlots.map((s, i) => (
                <div key={i} className="flex items-center gap-2 mb-1">
                  <span className="text-sm text-gray-600 flex-1">{s.startTime} – {s.endTime}</span>
                  <button onClick={() => removeSlot(i)} className="text-red-400 hover:text-red-600 text-xs">✕</button>
                </div>
              ))}
              <div className="flex gap-2 mt-2">
                <input type="time" value={newSlot.startTime}
                  onChange={e => setNewSlot({ ...newSlot, startTime: e.target.value })}
                  className="input-field text-sm flex-1 py-1" />
                <input type="time" value={newSlot.endTime}
                  onChange={e => setNewSlot({ ...newSlot, endTime: e.target.value })}
                  className="input-field text-sm flex-1 py-1" />
                <button onClick={addSlot} className="px-3 py-1 bg-primary-600 text-white rounded-lg text-sm">+</button>
              </div>

              <button onClick={saveAvailability} disabled={saving}
                className="w-full btn-primary mt-4 text-sm py-2">
                {saving ? 'Saving...' : 'Save Availability'}
              </button>
            </div>
          ) : (
            <div className="card p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Current Availability</h3>
              <div className="flex flex-wrap gap-1 mb-3">
                {(calendarData.availableDays || []).map(d => (
                  <span key={d} className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">{d.slice(0, 3)}</span>
                ))}
                {(calendarData.availableDays || []).length === 0 && <p className="text-sm text-gray-400">No days set</p>}
              </div>
              {(calendarData.availableTimeSlots || []).map((s, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="h-3 w-3 text-gray-400" />
                  {s.startTime} – {s.endTime}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AvailabilityCalendar;
