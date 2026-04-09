import express from 'express';
import User from '../models/User.js';
import Appointment from '../models/Appointment.js';
import { protect } from '../middleware/auth.js';
import { validate, appointmentSchema } from '../validators/schemas.js';

const router = express.Router();

// @route   GET /api/appointments/doctors
// @desc    Get all available doctors
// @access  Private
router.get('/doctors', protect, async (req, res) => {
    try {
        const doctors = await User.find({ role: 'doctor' })
            .select('name specialization qualification experience consultationFee availableDays availableTimeSlots profileImage');

        res.status(200).json({
            success: true,
            count: doctors.length,
            data: doctors
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching doctors',
            error: error.message
        });
    }
});

// @route   GET /api/appointments/doctors/:id
// @desc    Get single doctor details
// @access  Private
router.get('/doctors/:id', protect, async (req, res) => {
    try {
        const doctor = await User.findOne({ _id: req.params.id, role: 'doctor' })
            .select('name specialization qualification experience consultationFee availableDays availableTimeSlots profileImage email phone');

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found'
            });
        }

        res.status(200).json({
            success: true,
            data: doctor
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching doctor',
            error: error.message
        });
    }
});

// @route   POST /api/appointments
// @desc    Create new appointment
// @access  Private (Patient)
router.post('/', protect, validate(appointmentSchema), async (req, res) => {
    try {
        const { doctor, appointmentDate, timeSlot, symptoms } = req.body;

        // Check if doctor exists
        const doctorExists = await User.findOne({ _id: doctor, role: 'doctor' });
        if (!doctorExists) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found'
            });
        }

        // Check if appointment slot is already booked
        const existingAppointment = await Appointment.findOne({
            doctor,
            appointmentDate: new Date(appointmentDate),
            'timeSlot.startTime': timeSlot.startTime,
            status: { $in: ['pending', 'accepted'] }
        });

        if (existingAppointment) {
            return res.status(400).json({
                success: false,
                message: 'This time slot is already booked'
            });
        }

        // Create appointment
        const appointment = await Appointment.create({
            patient: req.user._id,
            doctor,
            appointmentDate: new Date(appointmentDate),
            timeSlot,
            symptoms
        });

        const populatedAppointment = await Appointment.findById(appointment._id)
            .populate('doctor', 'name specialization email phone');

        res.status(201).json({
            success: true,
            message: 'Appointment booked successfully',
            data: populatedAppointment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating appointment',
            error: error.message
        });
    }
});

// @route   GET /api/appointments/:id
// @desc    Get single appointment
// @access  Private
router.get('/:id', protect, async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id)
            .populate('patient', 'name email phone')
            .populate('doctor', 'name specialization email phone');

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }

        // Check authorization
        if (
            req.user.role !== 'admin' &&
            appointment.patient._id.toString() !== req.user._id.toString() &&
            appointment.doctor._id.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this appointment'
            });
        }

        res.status(200).json({
            success: true,
            data: appointment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching appointment',
            error: error.message
        });
    }
});

// @route   PUT /api/appointments/:id/cancel
// @desc    Cancel appointment
// @access  Private (Patient)
router.put('/:id/cancel', protect, async (req, res) => {
    try {
        const appointment = await Appointment.findOne({
            _id: req.params.id,
            patient: req.user._id
        });

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }

        if (appointment.status === 'completed' || appointment.status === 'cancelled') {
            return res.status(400).json({
                success: false,
                message: 'Cannot cancel this appointment'
            });
        }

        appointment.status = 'cancelled';
        await appointment.save();

        res.status(200).json({
            success: true,
            message: 'Appointment cancelled successfully',
            data: appointment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error cancelling appointment',
            error: error.message
        });
    }
});

export default router;
