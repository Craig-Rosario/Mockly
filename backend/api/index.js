import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "../config/db.js";
import userRoutes from "../routes/userRoutes.js";
import fileRoutes from "../routes/fileRoutes.js";
import { clerkMiddleware, requireAuth, getAuth } from "@clerk/express";

const app = express();

// Initialize database connection for serverless
let dbConnected = false;

const initializeDB = async () => {
  if (!dbConnected) {
    await connectDB();
    dbConnected = true;
  }
};

// CORS configuration
app.use(cors({
  origin: [
    'https://mockly-frontend.vercel.app',
    'https://mockly-six.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000',
    'https://*.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(clerkMiddleware());

// Initialize database before handling requests
app.use(async (req, res, next) => {
  try {
    await initializeDB();
    next();
  } catch (error) {
    console.error('Database initialization error:', error);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// Health check endpoint
app.get("/", (req, res) => {
  res.status(200).json({ 
    message: "✅ Mockly Backend API running on Vercel!",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({ 
    status: "healthy",
    timestamp: new Date().toISOString(),
    database: dbConnected ? "connected" : "disconnected"
  });
});

// Protected route for testing auth
app.get("/api/protected", requireAuth(), async (req, res) => {
  try {
    const { userId } = getAuth(req);
    res.json({ 
      message: "✅ Authenticated route access granted!", 
      userId,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Protected route error:", error);
    res.status(500).json({ error: "Failed to fetch user data" });
  }
});

// API routes
app.use("/api/users", userRoutes);
app.use("/api/files", fileRoutes);

// Handle 404 for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ 
    error: 'API endpoint not found',
    path: req.path,
    method: req.method
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);
  
  if (error.name === 'ValidationError') {
    return res.status(400).json({ 
      error: 'Validation Error',
      details: error.message
    });
  }
  
  if (error.name === 'CastError') {
    return res.status(400).json({ 
      error: 'Invalid ID format',
      details: error.message
    });
  }
  
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : error.message
  });
});

// Export the Express app for Vercel
export default app;