import mongoose from "mongoose";

// Track connection state for serverless optimization
let isConnected = false;

const connectDB = async () => {
  // Use existing connection if available
  if (isConnected) {
    console.log("✅ Using existing MongoDB connection");
    return;
  }

  try {
    // Optimize for serverless environment
    const connectionOptions = {
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      family: 4, // Use IPv4, skip trying IPv6
    };

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, connectionOptions);
    
    isConnected = true;
    console.log("✅ MongoDB Connected successfully");

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error("❌ MongoDB connection error:", err);
      isConnected = false;
    });

    mongoose.connection.on('disconnected', () => {
      console.warn("⚠️ MongoDB disconnected");
      isConnected = false;
    });

    // Handle process termination gracefully
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      isConnected = false;
      console.log('MongoDB connection closed due to app termination');
      process.exit(0);
    });

  } catch (err) {
    console.error("❌ MongoDB Connection Failed:", err.message);
    isConnected = false;
    
    // In serverless environment, don't exit the process
    if (process.env.NODE_ENV !== 'production' && process.env.VERCEL !== '1') {
      process.exit(1);
    } else {
      throw new Error(`Database connection failed: ${err.message}`);
    }
  }
};

export default connectDB;
