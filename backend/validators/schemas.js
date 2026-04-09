import { z } from 'zod';

export const validate = (schema) => (req, res, next) => {
    try {
        schema.parse(req.body);
        next();
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: error.errors.map(e => ({ field: e.path.join('.'), message: e.message }))
        });
    }
};

export const heartDiseasePredictionSchema = z.object({
    age: z.number().min(1).max(120),
    sex: z.number().min(0).max(1),
    cp: z.number().min(0).max(3),
    trestbps: z.number().min(80).max(250),
    chol: z.number().min(100).max(600),
    fbs: z.number().min(0).max(1),
    restecg: z.number().min(0).max(2),
    thalach: z.number().min(60).max(250),
    exang: z.number().min(0).max(1),
    oldpeak: z.number().min(0).max(10),
    slope: z.number().min(0).max(2),
    ca: z.number().min(0).max(4),
    thal: z.number().min(0).max(3)
});

export const diabetesPredictionSchema = z.object({
    pregnancies: z.number().min(0).max(20),
    glucose: z.number().min(0).max(300),
    bloodPressure: z.number().min(0).max(200),
    skinThickness: z.number().min(0).max(100),
    insulin: z.number().min(0).max(900),
    bmi: z.number().min(0).max(70),
    diabetesPedigreeFunction: z.number().min(0).max(3),
    age: z.number().min(1).max(120)
});

export const thyroidPredictionSchema = z.object({
    age: z.number().min(1).max(120),
    sex: z.number().min(0).max(1),
    on_thyroxine: z.number().min(0).max(1),
    tsh: z.number().min(0).max(50),
    t3: z.number().min(0).max(10),
    tt4: z.number().min(0).max(400),
    t4u: z.number().min(0).max(3),
    fti: z.number().min(0).max(400)
});

export const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(50),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    role: z.enum(['patient', 'doctor', 'admin']).default('patient'),
    phone: z.string().optional(),
    dateOfBirth: z.string().optional(),
    gender: z.enum(['male', 'female', 'other']).optional(),
    address: z.string().optional(),
    specialization: z.string().optional(),
    experience: z.number().optional(),
    consultationFee: z.number().optional()
});

export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required')
});

export const appointmentSchema = z.object({
    doctor: z.string().min(1, 'Doctor ID is required'),
    patient: z.string().optional(),
    appointmentDate: z.string().min(1, 'Appointment date is required'),
    timeSlot: z.string().min(1, 'Time slot is required'),
    type: z.enum(['online', 'offline']).default('online'),
    symptoms: z.string().optional(),
    notes: z.string().optional()
});
