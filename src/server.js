import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import menuRoutes from './routes/menuRoutes.js';
import riderRoutes from './routes/riderRoutes.js';

dotenv.config();

// Execute Database Connection
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Global Middlewares
app.use(cors());
app.use(express.json());

// Application Routing Matrix
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/riders', riderRoutes);

// Root Endpoint
app.get('/', (req, res) => {
  res.send("Stella's Kitchen API is spinning...");
});



app.listen(PORT, () => {
  console.log(`Server executing watch mode on port ${PORT}`);
});