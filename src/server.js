import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

// Route Imports
import authRoutes from "./routes/authRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import menuRoutes from "./routes/menuRoutes.js";
import riderRoutes from "./routes/riderRoutes.js";

dotenv.config();

const app = express();

// Global Middlewares
app.use(cors());
app.use(express.json());

// Root Endpoint - Responds fast without waiting for DB
app.get("/", (req, res) => {
  res.status(200).send("Stella's Kitchen API is spinning...");
});

// Database Connection Middleware - Only runs on /api endpoints
const dbMiddleware = async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("Database connection failure:", error);
    res.status(500).json({ 
      error: "Database Connection Error", 
      details: error.message 
    });
  }
};

// Application Routing Matrix
app.use("/api/auth", dbMiddleware, authRoutes);
app.use("/api/orders", dbMiddleware, orderRoutes);
app.use("/api/menu", dbMiddleware, menuRoutes);
app.use("/api/riders", dbMiddleware, riderRoutes);

// ONLY run app.listen when running locally (not in AWS Lambda)
if (process.env.NODE_ENV !== "production" && !process.env.LAMBDA_TASK_ROOT) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server executing watch mode on port ${PORT}`);
  });
}

export default app;