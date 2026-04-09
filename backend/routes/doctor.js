import express from 'express';
import User from '../models/User.js';
import Appointment from '../models/Appointment.js';
import Notification from '../models/Notification.js';
import { protect, authorize } from '../middleware/auth.js';
import { sendNotificationToUser } from '../server.js';

const router = express.Router();

router.use(protect);
router.use(authorize('doctor'));

// GET /api/doctor/profile
router.get('/profile', async (req, res) => {
    try {
        const doctor = await User.findById(req.user._id).select('-password');
        res.status(200).json({ success: true, data: doctor });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching profile', error: error.message });
    }
});

// PUT /api/doctor/profile
router.put('/profile', async (req, res) => {
    try {
        const allowedUpdates = [
            'name', 'phone', 'specialization', 'qualification',
            'experience', 'consultationFee', 'availableDays', 'availableTimeSlots'
        ];
        const updates = {};
        allowedUpdates.forEach(field => {
            if (req.body[field] !== undefined) updates[field] = req.body[field];
        });

        const doctor = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true }).select('-password');
        res.status(200).json({ success: true, message: 'Profile updated successfully', data: doctor });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating profile', error: error.message });
    }
});

// GET /api/doctor/appointments
router.get('/appointments', async (req, res) => {
    try {
        const { status } = req.query;
        const query = { doctor: req.user._id };
        if (status) query.status = status;

        const appointments = await Appointment.find(query)
            .populate('patient', 'name email phone dateOfBirth gender bloodGroup')
            .sort({ appointmentDate: -1 });

        res.status(200).json({ success: true, data: appointments });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching appointments', error: error.message });
    }
});

// GET /api/doctor/availability-calendar
router.get('/availability-calendar', async (req, res) => {
    try {
        const doctor = await User.findById(req.user._id).select('availableDays availableTimeSlots');
        const { month, year } = req.query;
        const targetMonth = month ? parseInt(month) : new Date().getMonth();
        const targetYear = year ? parseInt(year) : new Date().getFullYear();

        // Get appointments for this month
        const startDate = new Date(targetYear, targetMonth, 1);
        const endDate = new Date(targetYear, targetMonth + 1, 0);

        const appointments = await Appointment.find({
            doctor: req.user._id,
            appointmentDate: { $gte: startDate, $lte: endDate },
            status: { $in: ['pending', 'accepted'] }
        }).select('appointmentDate timeSlot status');

        res.status(200).json({
            success: true,
            data: {
                availableDays: doctor.availableDays || [],
                availableTimeSlots: doctor.availableTimeSlots || [],
                appointments
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching calendar', error: error.message });
    }
});

// GET /api/doctor/appointments/:id
router.get('/appointments/:id', async (req, res) => {
    try {
        const appointment = await Appointment.findOne({
            _id: req.params.id,
            doctor: req.user._id
        }).populate('patient', 'name email phone dateOfBirth gender bloodGroup medicalReports');

        if (!appointment) {
            return res.status(404).json({ success: false, message: 'Appointment not found' });
        }

        res.status(200).json({ success: true, data: appointment });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching appointment', error: error.message });
    }
});

// PUT /api/doctor/appointments/:id/status
router.put('/appointments/:id/status', async (req, res) => {
    try {
        const { status, doctorNotes } = req.body;

        if (!['accepted', 'rejected', 'completed'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status' });
        }

        const appointment = await Appointment.findOne({
            _id: req.params.id,
            doctor: req.user._id
        }).populate('doctor', 'name');

        if (!appointment) {
            return res.status(404).json({ success: false, message: 'Appointment not found' });
        }

        appointment.status = status;
        if (doctorNotes) appointment.doctorNotes = doctorNotes;
        await appointment.save();

        // Create notification for patient
        const statusMessages = {
            accepted: `Your appointment has been accepted by Dr. ${appointment.doctor.name}`,
            rejected: `Your appointment has been declined by Dr. ${appointment.doctor.name}`,
            completed: `Your appointment has been marked as completed`
        };

        const notification = await Notification.create({
            user: appointment.patient,
            title: `Appointment ${status.charAt(0).toUpperCase() + status.slice(1)}`,
            message: statusMessages[status],
            type: 'appointment_update',
            relatedId: appointment._id
        });

        // Send real-time notification via Socket.IO
        sendNotificationToUser(appointment.patient.toString(), notification);

        // If completed and doctor notes provided, send another notification
        if (status === 'completed' && doctorNotes) {
            const noteNotification = await Notification.create({
                user: appointment.patient,
                title: 'Doctor Notes Added',
                message: `Dr. ${appointment.doctor.name} has added notes to your appointment`,
                type: 'doctor_note',
                relatedId: appointment._id
            });
            sendNotificationToUser(appointment.patient.toString(), noteNotification);
        }

        res.status(200).json({
            success: true,
            message: `Appointment ${status} successfully`,
            data: appointment
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating appointment', error: error.message });
    }
});

// PUT /api/doctor/appointments/:id/notes  — add/update doctor notes only
router.put('/appointments/:id/notes', async (req, res) => {
    try {
        const { doctorNotes } = req.body;
        if (!doctorNotes) {
            return res.status(400).json({ success: false, message: 'Notes are required' });
        }

        const appointment = await Appointment.findOneAndUpdate(
            { _id: req.params.id, doctor: req.user._id },
            { doctorNotes },
            { new: true }
        ).populate('doctor', 'name');

        if (!appointment) {
            return res.status(404).json({ success: false, message: 'Appointment not found' });
        }

        // Notify patient
        const notification = await Notification.create({
            user: appointment.patient,
            title: 'Doctor Notes Updated',
            message: `Dr. ${appointment.doctor.name} updated notes for your appointment`,
            type: 'doctor_note',
            relatedId: appointment._id
        });
        sendNotificationToUser(appointment.patient.toString(), notification);

        res.status(200).json({ success: true, message: 'Notes updated', data: appointment });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating notes', error: error.message });
    }
});

export default router;
