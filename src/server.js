import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import menuRoutes from './routes/menuRoutes.js';

dotenv.config();

// Execute Database Connection
connectDB();

const app = express();

// Global Middlewares
app.use(cors());
app.use(express.json());

// Application Routing Matrix
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/menu', menuRoutes);


// Root Endpoint
app.get('/', (req, res) => {
  res.send("Stella's Kitchen API is spinning...");
});


// Placeholder for routes - Will mount actual route modules here next
app.use('/api/riders', (req, res) => res.send('Rider routes coming up next...'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server executing watch mode on port ${PORT}`);
});