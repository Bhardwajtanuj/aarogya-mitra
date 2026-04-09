import express from 'express';
import axios from 'axios';
import Prediction from '../models/Prediction.js';
import Notification from '../models/Notification.js';
import { protect } from '../middleware/auth.js';
import { validate, heartDiseasePredictionSchema, diabetesPredictionSchema, thyroidPredictionSchema } from '../validators/schemas.js';
import { sendNotificationToUser } from '../server.js';

const router = express.Router();

// Helper: call ML service and save prediction
const runPrediction = async (req, res, diseaseType, mlEndpoint, schema) => {
    try {
        const inputData = req.body;

        const mlResponse = await axios.post(
            `${process.env.ML_SERVICE_URL}${mlEndpoint}`,
            inputData,
            { headers: { 'Content-Type': 'application/json' }, timeout: 15000 }
        );

        const { prediction, probability, risk_level } = mlResponse.data;

        const predictionRecord = await Prediction.create({
            user: req.user._id,
            predictionType: diseaseType,
            inputData: new Map(Object.entries(inputData)),
            result: { prediction, probability, riskLevel: risk_level }
        });

        // Send notification
        const notification = await Notification.create({
            user: req.user._id,
            title: 'Prediction Complete',
            message: `Your ${diseaseType.replace('_', ' ')} risk assessment is ready. Risk Level: ${risk_level?.toUpperCase()}`,
            type: 'prediction_complete',
            relatedId: predictionRecord._id
        });
        sendNotificationToUser(req.user._id.toString(), notification);

        res.status(200).json({
            success: true,
            message: 'Prediction completed successfully',
            data: { prediction, probability, riskLevel: risk_level, predictionId: predictionRecord._id }
        });
    } catch (error) {
        console.error('Prediction error:', error.message);
        if (error.code === 'ECONNREFUSED') {
            return res.status(503).json({ success: false, message: 'ML service is currently unavailable.' });
        }
        res.status(500).json({ success: false, message: 'Error making prediction', error: error.message });
    }
};

// POST /api/predictions/heart-disease
router.post('/heart-disease', protect, validate(heartDiseasePredictionSchema), (req, res) =>
    runPrediction(req, res, 'heart_disease', '/predict', heartDiseasePredictionSchema));

// POST /api/predictions/diabetes
router.post('/diabetes', protect, validate(diabetesPredictionSchema), (req, res) =>
    runPrediction(req, res, 'diabetes', '/predict/diabetes', diabetesPredictionSchema));

// POST /api/predictions/thyroid
router.post('/thyroid', protect, validate(thyroidPredictionSchema), (req, res) =>
    runPrediction(req, res, 'thyroid', '/predict/thyroid', thyroidPredictionSchema));

// GET /api/predictions/history
router.get('/history', protect, async (req, res) => {
    try {
        const predictions = await Prediction.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .limit(50);
        res.status(200).json({ success: true, count: predictions.length, data: predictions });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching history', error: error.message });
    }
});

// GET /api/predictions/stats — for chart
router.get('/stats', protect, async (req, res) => {
    try {
        const predictions = await Prediction.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .limit(20);

        const stats = predictions.map(p => ({
            date: p.createdAt,
            type: p.predictionType,
            riskLevel: p.result.riskLevel,
            probability: p.result.probability
        }));

        res.status(200).json({ success: true, data: stats });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching stats', error: error.message });
    }
});

// GET /api/predictions/:id
router.get('/:id', protect, async (req, res) => {
    try {
        const prediction = await Prediction.findOne({ _id: req.params.id, user: req.user._id });
        if (!prediction) {
            return res.status(404).json({ success: false, message: 'Prediction not found' });
        }
        res.status(200).json({ success: true, data: prediction });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching prediction', error: error.message });
    }
});

export default router;
