import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const mongoUrl = process.env.MONGO_URL;

const connectDB = () => {
    mongoose
        .connect(mongoUrl)
        .then(() => console.log('✅ Connected to MongoDB'))
        .catch(err => {
            console.error('❌ Failed to connect to MongoDB');
            console.error(err);
        });
};

export default connectDB