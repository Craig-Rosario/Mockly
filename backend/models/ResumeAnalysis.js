import mongoose from "mongoose";

const ResumeAnalysisSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  jobApplicationId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true 
  },
  analysisResult: {
    matchScore: { type: Number, min: 0, max: 100 },
    keywordAnalysis: {
      coveragePercentage: { type: Number, min: 0, max: 100 },
      neededKeywords: [{
        keyword: String,
        found: Boolean
      }]
    },
    overallSuggestions: String,
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
    }]
  },
  analysisStatus: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'error'],
    default: 'pending'
  },
  errorMessage: String,
  processingStartedAt: Date,
  processingCompletedAt: Date
}, { timestamps: true });

// Index for faster queries
ResumeAnalysisSchema.index({ userId: 1, jobApplicationId: 1 });
ResumeAnalysisSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model("ResumeAnalysis", ResumeAnalysisSchema);