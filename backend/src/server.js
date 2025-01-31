import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import connectDB from './config/db.js'; 
import connectCloudinary from './config/cloudinary.js';

import extractID from './middlewares/extractID.js';
import { handleMulterError } from './middlewares/uploadMiddleware.js';

import authRoutes from './routes/authRoutes.js';
import itemRoutes from './routes/itemRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';

// loading environment variables
dotenv.config();

const port = process.env.PORT || 4000; 

// app config
const app = express();
connectDB();
connectCloudinary();

// middlewares
app.use(cors());
app.use(cors({
    origin: process.env.CORS_ORIGIN,
}));
app.use(express.json());
app.use(handleMulterError);

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/items', extractID, itemRoutes);
app.use('/api/user', extractID, userRoutes);
app.use('/api/orders', extractID, orderRoutes);
app.use('/api/cart', extractID, cartRoutes);
app.use('/api/reviews', extractID, reviewRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});