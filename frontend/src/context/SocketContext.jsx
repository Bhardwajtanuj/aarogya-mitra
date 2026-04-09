import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
    const { user, isAuthenticated } = useAuth();
    const socketRef = useRef(null);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (!isAuthenticated || !user) return;

        const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
            transports: ['websocket', 'polling']
        });
        socketRef.current = socket;

        socket.on('connect', () => {
            socket.emit('register', user._id || user.id);
        });

        socket.on('notification', (notification) => {
            setNotifications(prev => [notification, ...prev].slice(0, 50));
            setUnreadCount(prev => prev + 1);
            // Browser notification if permission granted
            if (Notification.permission === 'granted') {
                new Notification(notification.title, { body: notification.message });
            }
        });

        socket.on('disconnect', () => {
            console.log('[Socket] Disconnected');
        });

        return () => {
            socket.disconnect();
            socketRef.current = null;
        };
    }, [isAuthenticated, user]);

    const markAllRead = () => setUnreadCount(0);

    return (
        <SocketContext.Provider value={{ socket: socketRef.current, notifications, unreadCount, markAllRead, setNotifications, setUnreadCount }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);
