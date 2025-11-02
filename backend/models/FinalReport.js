import mongoose from "mongoose";

const FinalReportSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  jobApplicationId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true 
  },
  metrics: {
    mcqScore: { type: Number, min: 0, max: 100, default: 0 },
    resumeScore: { type: Number, min: 0, max: 100, default: 0 },
    jobMatch: { type: Number, min: 0, max: 100, default: 0 },
    totalScore: { type: Number, min: 0, max: 100, default: 0 }
  },
  mcqData: {
    totalQuestions: { type: Number, default: 0 },
    correctAnswers: { type: Number, default: 0 },
    incorrectAnswers: { type: Number, default: 0 },
    timeTaken: { type: Number, default: 0 },
    topicWisePerformance: [{
      topic: String,
      correct: Number,
      total: Number,
      percentage: Number
    }],
    completedAt: Date
  },
  resumeData: {
    matchScore: { type: Number, min: 0, max: 100 },
    keywordAnalysis: {
      coveragePercentage: { type: Number, min: 0, max: 100 },
      neededKeywords: [{
        keyword: String,
        found: Boolean
      }]
    },
    experienceAnalysis: [{
      title: String,
      relevanceScore: { type: Number, min: 0, max: 10 },
      depthScore: { type: Number, min: 0, max: 10 },
      suggestions: [String]
    }],
    projectAnalysis: [{
      title: String,
      relevanceScore: { type: Number, min: 0, max: 10 },
      complexityScore: { type: Number, min: 0, max: 8 },
      suggestions: [String]
    }],
    overallSuggestions: String
  },
  improvements: [{
    title: String,
    description: String,
    severity: {
      type: String,
      enum: ['high', 'medium', 'low'],
      default: 'medium'
    }
  }],
  reportStatus: {
    type: String,
    enum: ['generating', 'completed', 'error'],
    default: 'generating'
  },
  generatedAt: { type: Date, default: Date.now },
  lastUpdated: { type: Date, default: Date.now }
}, { timestamps: true });

// Index for faster queries
FinalReportSchema.index({ userId: 1, jobApplicationId: 1 });
FinalReportSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model("FinalReport", FinalReportSchema);