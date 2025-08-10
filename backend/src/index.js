import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';

// Route imports

// Load environment variables
dotenv.config();

// Config imports
import connectDB from './config/db.js';
// Connect to the database
connectDB();


// Initialize Express
const app = express();

// CORS config
const corsOptions = {
  origin: [
    process.env.CLIENT1,
    process.env.CLIENT2,
    process.env.CLIENT3,
    process.env.LOCAL
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
};

// Apply CORS and preflight
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Middleware
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Form Maker API!');
});

// Mount API routers

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});