import React, { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import { useSocket } from '../context/SocketContext';
import api from '../utils/api';

const NotificationBell = () => {
    const { notifications, unreadCount, markAllRead, setNotifications, setUnreadCount } = useSocket();
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        // Load past notifications from API
        api.get('/notifications').then(r => {
            setNotifications(r.data.data || []);
            const unread = (r.data.data || []).filter(n => !n.read).length;
            setUnreadCount(unread);
        }).catch(() => {});
    }, []);

    useEffect(() => {
        const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleOpen = () => {
        setOpen(!open);
        if (!open && unreadCount > 0) {
            api.patch('/notifications/read-all').catch(() => {});
            markAllRead();
        }
    };

    const typeColor = {
        appointment_update: 'bg-blue-100 text-blue-700',
        prediction_complete: 'bg-green-100 text-green-700',
        doctor_note: 'bg-purple-100 text-purple-700',
        general: 'bg-gray-100 text-gray-700'
    };

    return (
        <div className="relative" ref={ref}>
            <button onClick={handleOpen} className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
                <Bell className="h-6 w-6 text-gray-600" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 z-50">
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="font-semibold text-gray-800">Notifications</h3>
                        <span className="text-xs text-gray-400">{notifications.length} total</span>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-6 text-center text-gray-400">
                                <Bell className="h-8 w-8 mx-auto mb-2 opacity-30" />
                                <p className="text-sm">No notifications yet</p>
                            </div>
                        ) : (
                            notifications.map((n, i) => (
                                <div key={n._id || i} className="p-3 border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-start gap-2">
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium mt-0.5 ${typeColor[n.type] || typeColor.general}`}>
                                            {n.type?.replace('_', ' ') || 'general'}
                                        </span>
                                    </div>
                                    <p className="text-sm font-medium text-gray-800 mt-1">{n.title}</p>
                                    <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>
                                    <p className="text-xs text-gray-300 mt-1">
                                        {new Date(n.createdAt).toLocaleString()}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
