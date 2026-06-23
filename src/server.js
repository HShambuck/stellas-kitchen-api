import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

dotenv.config();

// Execute Database Connection
connectDB();

const app = express();

// Global Middlewares
app.use(cors());
app.use(express.json());

// Root Endpoint
app.get('/', (req, res) => {
  res.send("Stella's Kitchen API is spinning...");
});

// Placeholder for routes - We will mount actual route modules here next
app.use('/api/auth', (req, res) => res.send('Auth routes coming up next...'));
app.use('/api/orders', (req, res) => res.send('Order routes coming up next...'));
app.use('/api/riders', (req, res) => res.send('Rider routes coming up next...'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server executing watch mode on port ${PORT}`);
});