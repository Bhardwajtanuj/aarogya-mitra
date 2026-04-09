import express from 'express';
import User from '../models/User.js';
import Appointment from '../models/Appointment.js';
import { protect, authorize } from '../middleware/auth.js';
import { upload, uploadToCloudinary } from '../config/cloudinary.js';

const router = express.Router();

// All routes are protected and require patient role
router.use(protect);
router.use(authorize('patient'));

// @route   GET /api/patient/profile
// @desc    Get patient profile
// @access  Private (Patient)
router.get('/profile', async (req, res) => {
    try {
        const patient = await User.findById(req.user._id).select('-password');

        res.status(200).json({
            success: true,
            data: patient
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching profile',
            error: error.message
        });
    }
});

// @route   PUT /api/patient/profile
// @desc    Update patient profile
// @access  Private (Patient)
router.put('/profile', async (req, res) => {
    try {
        const allowedUpdates = ['name', 'phone', 'dateOfBirth', 'gender', 'bloodGroup'];
        const updates = {};

        allowedUpdates.forEach(field => {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        });

        const patient = await User.findByIdAndUpdate(
            req.user._id,
            updates,
            { new: true, runValidators: true }
        ).select('-password');

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: patient
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating profile',
            error: error.message
        });
    }
});

// @route   POST /api/patient/upload-report
// @desc    Upload medical report
// @access  Private (Patient)
router.post('/upload-report', upload.single('report'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Please upload a file'
            });
        }

        // Upload to Cloudinary
        const result = await uploadToCloudinary(req.file.buffer, 'medical-reports');

        // Add to user's medical reports
        const patient = await User.findById(req.user._id);
        patient.medicalReports.push({
            name: req.body.reportName || req.file.originalname,
            url: result.secure_url
        });
        await patient.save();

        res.status(200).json({
            success: true,
            message: 'Report uploaded successfully',
            data: {
                name: req.body.reportName || req.file.originalname,
                url: result.secure_url
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error uploading report',
            error: error.message
        });
    }
});

// @route   GET /api/patient/reports
// @desc    Get all medical reports
// @access  Private (Patient)
router.get('/reports', async (req, res) => {
    try {
        const patient = await User.findById(req.user._id).select('medicalReports');

        res.status(200).json({
            success: true,
            data: patient.medicalReports
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching reports',
            error: error.message
        });
    }
});

// @route   GET /api/patient/appointments
// @desc    Get patient appointments
// @access  Private (Patient)
router.get('/appointments', async (req, res) => {
    try {
        const appointments = await Appointment.find({ patient: req.user._id })
            .populate('doctor', 'name specialization email phone')
            .sort({ appointmentDate: -1 });

        res.status(200).json({
            success: true,
            data: appointments
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching appointments',
            error: error.message
        });
    }
});

export default router;
