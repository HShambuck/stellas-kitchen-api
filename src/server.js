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

// Database Connection Middleware for Serverless
// Ensures DB is connected before handling routes without creating redundant connections
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// Application Routing Matrix
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/riders", riderRoutes);

// Root Endpoint
app.get("/", (req, res) => {
  res.send("Stella's Kitchen API is spinning...");
});

// ONLY run app.listen when running locally (not in AWS Lambda)
if (process.env.NODE_ENV !== "production" && !process.env.LAMBDA_TASK_ROOT) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server executing watch mode on port ${PORT}`);
  });
}

export default app;
