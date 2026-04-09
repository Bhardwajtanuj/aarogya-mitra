import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`\n❌ Error connecting to MongoDB: ${error.message}`);
        console.error(`⚠️  Warning: The server will continue running in DEMO MODE without database persistence.\n`);
    }
};

export default connectDB;
