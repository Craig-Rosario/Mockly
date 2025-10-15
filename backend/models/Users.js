import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  clerkId: { type: String, unique: true, required: true },
  name: String,
  email: { type: String, unique: true, required: true },
  location: String,

  resume: {
    fileUrl: String,
    lastUpdated: { type: Date, default: Date.now },
    overallScore: { type: Number, default: 0 },
    confidenceLevel: { type: Number, default: 0 },
    completionRate: { type: Number, default: 0 },
  },

  aiPerformance: {
    totalAttempts: { type: Number, default: 0 },
    accuracyRate: { type: Number, default: 0 },
    avgTime: { type: Number, default: 0 },
  },

  mcqPerformance: {
    level: { type: String, default: "beginner" },
    testResults: { type: Number, default: 0 },
    successRate: { type: Number, default: 0 },
  },

  recentActivity: [
    {
      message: String,
      timestamp: { type: Date, default: Date.now },
    },
  ],
}, { timestamps: true });

export default mongoose.model("User", UserSchema);
