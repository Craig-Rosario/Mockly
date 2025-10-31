import mongoose from "mongoose";

const JobDetailsSchema = new mongoose.Schema({
  candidateName: { type: String, required: true },
  candidateEmail: { type: String, required: true },
  candidateLocation: { type: String, required: true },
  willingToRelocate: { type: String, enum: ["yes", "no"], default: "no" },
  totalYOE: { type: Number, required: true },
  primaryStack: [String],
  
  resume: {
    originalName: String,
    fileName: String,
    filePath: String,
    fileUrl: String,
    fileSize: Number,
    mimeType: String,
    uploadedAt: { type: Date, default: Date.now },
    extractedText: String,
    skills: [String],
    experience: Number,
    education: [String],
    contactInfo: {
      phone: String,
      email: String,
      linkedin: String
    },
    analysisScore: { type: Number, min: 0, max: 100 },
    lastAnalyzed: Date
  }, 
  
  jobTitle: { type: String, required: true },  
  company: { type: String, required: true },    
  location: { type: String, required: true },  
  workMode: { type: String, enum: ["Remote", "Hybrid", "Onsite"], default: "Remote" },
  jobType: { type: String },
  jobIndustry: { type: String },
  jobDescription: String,  
  requiredSkills: [String],
  
  appliedOn: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["Applied", "Interview Scheduled", "Rejected", "Offer", "In Progress", "Follow-up"],
    default: "Applied"
  },
  
  mcqResults: {
    score: { type: Number, default: 0 },
    totalQuestions: { type: Number, default: 0 },
    correctAnswers: { type: Number, default: 0 },
    timeTaken: { type: Number, default: 0 }, 
    completedAt: Date
  },
  
  interviewResults: {
    overallScore: { type: Number, default: 0 },
    communicationScore: { type: Number, default: 0 },
    technicalScore: { type: Number, default: 0 },
    confidenceLevel: { type: Number, default: 0 },
    feedback: String,
    completedAt: Date
  },
  
  finalReport: {
    overallRating: { type: Number, default: 0 },
    recommendation: String,
    strengths: [String],
    areasForImprovement: [String],
    generatedAt: Date
  },
  
  // Reference to the resume analysis
  resumeAnalysisId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ResumeAnalysis',
    default: null
  },
  
  // Status of resume analysis
  resumeAnalysisStatus: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'error'],
    default: 'pending'
  }
}, { timestamps: true });

const UserSchema = new mongoose.Schema({
  clerkId: { type: String, unique: true, required: true },
  name: String,
  email: { type: String, unique: true, required: true },
  location: String,

  jobApplications: [JobDetailsSchema],

  resume: {
    originalName: String,
    fileName: String,
    filePath: String,
    fileUrl: String,
    fileSize: Number,
    mimeType: String,
    uploadedAt: { type: Date, default: Date.now },
    extractedText: String,
    skills: [String],
    experience: Number,
    education: [String],
    contactInfo: {
      phone: String,
      email: String,
      linkedin: String
    },
    analysisScore: { type: Number, min: 0, max: 100 },
    lastAnalyzed: Date
  },
  
  resumeHistory: [{
    originalName: String,
    fileName: String,
    filePath: String,
    fileUrl: String,
    fileSize: Number,
    mimeType: String,
    uploadedAt: { type: Date, default: Date.now },
    extractedText: String,
    skills: [String],
    experience: Number,
    education: [String],
    contactInfo: {
      phone: String,
      email: String,
      linkedin: String
    },
    analysisScore: { type: Number, min: 0, max: 100 },
    lastAnalyzed: Date
  }],

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
