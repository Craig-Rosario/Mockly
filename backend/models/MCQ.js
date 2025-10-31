import mongoose from "mongoose";

const MCQSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  jobApplicationId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true 
  },
  jobDescription: {
    type: String,
    required: true
  },
  questions: [{
    question: {
      type: String,
      required: true
    },
    options: [{
      type: String,
      required: true
    }],
    correctAnswer: {
      type: String,
      required: true
    },
    topic: String
  }],
  mcqStatus: {
    type: String,
    enum: ['generated', 'in_progress', 'completed'],
    default: 'generated'
  },
  results: {
    totalQuestions: { type: Number, default: 0 },
    correctAnswers: { type: Number, default: 0 },
    incorrectAnswers: { type: Number, default: 0 },
    score: { type: Number, default: 0 }, // percentage
    timeTaken: { type: Number, default: 0 }, // in seconds
    answersSubmitted: [{
      questionIndex: Number,
      selectedAnswer: String,
      isCorrect: Boolean,
      timeSpent: Number
    }],
    topicWisePerformance: [{
      topic: String,
      correct: Number,
      total: Number,
      percentage: Number
    }],
    completedAt: Date
  },
  generatedAt: { type: Date, default: Date.now },
  completedAt: Date
}, { timestamps: true });

// Index for faster queries
MCQSchema.index({ userId: 1, jobApplicationId: 1 });
MCQSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model("MCQ", MCQSchema);