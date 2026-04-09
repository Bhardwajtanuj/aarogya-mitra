import mongoose from 'mongoose';

const predictionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    predictionType: {
        type: String,
        enum: ['heart_disease', 'diabetes', 'thyroid'],
        required: true
    },
    inputData: {
        type: Map,
        of: mongoose.Schema.Types.Mixed,
        required: true
    },
    result: {
        prediction: {
            type: String,
            required: true
        },
        probability: {
            type: Number
        },
        riskLevel: {
            type: String,
            enum: ['low', 'medium', 'high']
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for user queries
predictionSchema.index({ user: 1, createdAt: -1 });

const Prediction = mongoose.model('Prediction', predictionSchema);

export default Prediction;
