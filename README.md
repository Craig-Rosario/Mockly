<h1 align="center">
Mockly - AI-Powered Job Application Assistant
</h1>

<p align="center">
  <strong>Transform your job application process with AI-powered resume analysis and skill assessments.</strong>
</p>

---

## 📋 Table of Contents

- [What is Mockly?](#-what-is-mockly)
- [✨ Key Features](#-key-features)
- [🏗️ How It Works](#️-how-it-works)
- [📊 Application Flow](#-application-flow)
- [🚀 Setup Instructions](#-setup-instructions)
- [📁 Project Structure](#-project-structure)
- [🎯 Advantages](#-advantages)
- [🛠️ Tech Stack](#️-tech-stack)
- [🔧 API Endpoints](#-api-endpoints)
- [📈 Usage Guide](#-usage-guide)

---

## What is Mockly?

**Mockly** is an intelligent job application platform that leverages AI to help job seekers optimize their applications and prepare for interviews. The platform provides comprehensive analysis of resumes against job descriptions, generates customized MCQ tests and delivers detailed performance reports.

### 🎨 Core Vision

Mockly bridges the gap between job seekers and employers by providing:
- **AI-powered resume optimization** using Google Gemini
- **Skill assessment through dynamic MCQs**
- **Comprehensive performance analytics**
- **Job application tracking and management**

---

## ✨ Key Features

### 🧠 AI-Powered Resume Analysis
- **Smart matching algorithm** that compares resumes against job descriptions
- **Keyword analysis** with coverage percentage and missing keywords identification
- **Experience relevance scoring** with detailed suggestions for improvement
- **Project analysis** with complexity and relevance scoring
- **Overall recommendations** for resume enhancement

### 📝 Dynamic MCQ Generation
- **Job-specific questions** generated based on role requirements
- **Real-time scoring** with detailed analytics
- **Time-based assessments** with performance tracking
- **Topic-wise breakdown** of strengths and weaknesses

### 📊 Comprehensive Reporting
- **Final evaluation metrics** combining all assessment components
- **Visual dashboards** with performance charts
- **Progress tracking** across multiple applications
- **Detailed analytics** for continuous improvement

### 👤 User Management
- **Secure authentication** with Clerk integration
- **Profile management** with application history
- **Dashboard analytics** with performance insights
- **Application status tracking**

---

## 🏗️ How It Works

Mockly follows a systematic approach to job application optimization:

### 1. **User Registration & Profile Setup**
- Secure sign-up with email verification
- Profile creation with personal and professional details
- Resume upload and parsing

### 2. **Job Application Creation**
- Personal details input (contact info, experience, skills)
- Job details specification (title, company, description, requirements)
- Application submission and tracking

### 3. **AI-Powered Analysis Phase**
```
Resume + Job Description → Gemini AI → Analysis Report
```
- Resume text extraction using PDF parsing
- Job requirement analysis and keyword extraction
- AI-generated compatibility score and recommendations

### 4. **Skill Assessment**
- Dynamic MCQ generation based on job requirements
- Timed assessments with instant feedback
- Performance analytics and improvement suggestions

### 5. **Final Evaluation & Reporting**
- Comprehensive score calculation
- Visual performance dashboard
- Actionable insights for improvement

---

## 📊 Application Flow

```mermaid
graph TD
    A[User Registration] --> B[Dashboard]
    B --> C[Create Job Application]
    C --> D[Personal Details Form]
    D --> E[Job Details Form]
    E --> F[Resume Analysis]
    F --> G[AI Processing with Gemini]
    G --> H[Analysis Results]
    H --> I[MCQ Assessment]
    I --> K[Final Report]
    K --> L[Dashboard Analytics]
    
    F --> M[PDF Text Extraction]
    M --> N[Keyword Matching]
    N --> O[Experience Analysis]
    O --> P[Project Evaluation]
    P --> G
    
    style A fill:#b3e5fc
    style G fill:#d1c4e9
    style K fill:#c8e6c9
```

### Detailed Workflow:

1. **Authentication Layer** (Clerk)
   - User registration/login
   - JWT token management
   - Session persistence

2. **Application Creation**
   - Multi-step form with validation
   - Resume upload and storage
   - Job details specification

3. **AI Analysis Pipeline**
   - PDF text extraction (pdf-parse, pdf2json)
   - Gemini AI integration for intelligent analysis
   - Structured response processing and validation

4. **Assessment Modules**
   - Dynamic MCQ generation
   - Timed assessments
   - Performance tracking

5. **Reporting System**
   - Score aggregation
   - Visual analytics
   - Performance insights

---

## 🚀 Setup Instructions

### Prerequisites

Ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (local or cloud instance)
- **Git**

### Environment Variables

Create `.env` files in both `backend` and `frontend` directories:

#### Backend `.env`:
```env
# Database
MONGODB_URI=mongodb://localhost:27017/mockly
# or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mockly

# Clerk Authentication
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Server Configuration
PORT=5000
NODE_ENV=development
```

#### Frontend `.env`:
```env
# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

# API Configuration
VITE_API_BASE_URL=http://localhost:5000/api
```
#### Gemini `.env`:
```env
# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key
```

### Installation Steps

#### 1. Clone the Repository
```bash
git clone https://github.com/Craig-Rosario/mockly.git
cd mockly
```

#### 2. Backend Setup
```bash
cd backend
npm install
npm start
# Server will run on http://localhost:5000
```

#### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
# Application will run on http://localhost:5173
```

#### 4. Verify Installation
- Navigate to `http://localhost:5173`
- Register a new account
- Test the complete flow by creating a job application

---

## 📁 Project Structure

```
Mockly/
├── 📁 backend/                    # Node.js Express Server
│   ├── 📁 config/                 # Database and configuration files
│   │   ├── db.js                  # MongoDB connection
│   │   └── fileUpload.js          # Multer configuration
│   ├── 📁 models/                 # Mongoose schemas
│   │   ├── Users.js               # User model with job applications
│   │   ├── ResumeAnalysis.js      # Resume analysis results
│   │   ├── MCQ.js                 # MCQ questions and results
│   │   └── FinalReport.js         # Final evaluation metrics
│   ├── 📁 routes/                 # API endpoints
│   │   ├── userRoutes.js          # User and application routes
│   │   └── fileRoutes.js          # File upload/download routes
│   ├── 📁 services/               # Business logic
│   │   ├── geminiService.js       # Google Gemini AI integration
│   │   └── pdfExtractor.js        # PDF text extraction
│   ├── 📁 uploads/                # File storage
│   │   └── resumes/               # Uploaded resume files
│   ├── 📁 test/                   # Test files
│   ├── server.js                  # Express server entry point
│   └── package.json               # Backend dependencies
├── 📁 frontend/                   # React TypeScript Application
│   ├── 📁 src/
│   │   ├── 📁 components/         # Reusable UI components
│   │   │   ├── 📁 ui/             # Shadcn/ui components
│   │   │   ├── 📁 custom/         # Custom components
│   │   │   │   ├── AppStepper.tsx # Multi-step form navigation
│   │   │   │   └── Mloader.tsx    # Loading animations
│   │   │   └── 📁 magicui/        # Enhanced UI components
│   │   ├── 📁 pages/              # Application pages
│   │   │   ├── 📁 landing/        # Public landing page
│   │   │   └── 📁 home/           # Authenticated user pages
│   │   │       └── 📁 dashboard/  # Main dashboard
│   │   │           ├── Dashboard.tsx        # Main dashboard layout
│   │   │           ├── DashboardContent.tsx # Dashboard overview
│   │   │           ├── ProfileContent.tsx   # User profile
│   │   │           ├── PreviousJobsContent.tsx # Job history
│   │   │           └── 📁 add-jobs/         # Job application flow
│   │   │               ├── PersonalDetails.tsx  # Step 1: Personal info
│   │   │               ├── JobDetails.tsx       # Step 2: Job requirements
│   │   │               ├── ResumeAnalysis.tsx   # Step 3: AI analysis
│   │   │               ├── Mcq.tsx              # Step 4: Skill assessment
│   │   │               ├── McqAnalysis.tsx      # MCQ results
│   │   │               ├── MockInterview.tsx    # Step 5: Interview
│   │   │               ├── MockInterviewAnalysis.tsx # Interview results
│   │   │               └── FinalReport.tsx      # Step 6: Final metrics
│   │   ├── 📁 contexts/           # React Context providers
│   │   │   └── JobApplicationContext.tsx # Application state management
│   │   ├── 📁 hooks/              # Custom React hooks
│   │   ├── 📁 lib/                # Utility functions
│   │   │   ├── api.ts             # API client functions
│   │   │   └── utils.ts           # Helper utilities
│   │   ├── 📁 router/             # Application routing
│   │   │   └── AppRoutes.tsx      # Route definitions
│   │   └── 📁 types/              # TypeScript type definitions
│   └── package.json               # Frontend dependencies
├── 📁 Gemini/                     # Python AI service (alternative)
│   ├── main.py                    # Flask server for AI processing
│   ├── analysePDF.py              # PDF analysis logic
│   └── requirements.txt           # Python dependencies
└── README.md                      # This file
```

---

## 🎯 Advantages

### For Job Seekers

#### 🎯 **Personalized Optimization**
- **Tailored Analysis**: Each resume is analyzed against specific job requirements
- **Actionable Insights**: Receive specific suggestions for resume improvement
- **Skill Gap Identification**: Understand what skills need development

#### 📈 **Performance Tracking**
- **Progress Monitoring**: Track improvement across multiple applications
- **Comparative Analysis**: Compare performance against different job types
- **Historical Data**: Access to past applications and results

#### 🚀 **Career Development**
- **Interview Preparation**: Practice with AI-powered mock MCQ with Resume Analysis
- **Skill Assessment**: Identify strengths and areas for improvement
- **Industry Insights**: Understand market requirements for different roles

---

## 🛠️ Tech Stack

### Frontend Technologies

| Technology | Purpose | Benefits |
|------------|---------|----------|
| **React 19** | UI Framework | Modern hooks, concurrent features |
| **TypeScript** | Type Safety | Enhanced developer experience, fewer bugs |
| **Vite** | Build Tool | Fast development and optimized builds |
| **Tailwind CSS** | Styling | Utility-first, responsive design |
| **Shadcn/ui** | Component Library | Beautiful, accessible components |
| **Framer Motion** | Animations | Smooth, performant animations |
| **React Router** | Navigation | Client-side routing |
| **Clerk** | Authentication | Secure user management |

### Backend Technologies

| Technology | Purpose | Benefits |
|------------|---------|----------|
| **Node.js** | Runtime | JavaScript everywhere, NPM ecosystem |
| **Express.js** | Web Framework | Minimal, flexible, robust |
| **MongoDB** | Database | Document-based, scalable |
| **Mongoose** | ODM | Schema validation, query building |
| **Google Gemini AI** | AI Processing | Advanced language understanding |
| **Multer** | File Upload | Efficient file handling |
| **PDF-Parse** | Text Extraction | Reliable PDF processing |
| **Clerk Express** | Authentication | Secure API protection |

### Development Tools

| Tool | Purpose |
|------|---------|
| **Nodemon** | Development Server |
| **Git** | Version Control |
| **VS Code** | IDE |

---

## 🔧 API Endpoints

### Authentication Endpoints

```http
# Protected routes require Authorization: Bearer <token>
```

### User Management

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/users/current-user` | Get current user details | Yes |
| `POST` | `/api/users/job-application` | Create new job application | Yes |
| `GET` | `/api/users/job-applications` | Get all user applications | Yes |
| `GET` | `/api/users/debug-applications` | Debug application data | Yes |

### Resume Analysis

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/users/analyze-resume/:applicationId` | Trigger resume analysis | Yes |
| `GET` | `/api/users/resume-analysis/:applicationId` | Get analysis results | Yes |

### MCQ System

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/users/job-application/:applicationId/mcqs` | Get/Generate MCQs | Yes |
| `POST` | `/api/users/job-application/:applicationId/mcq-results` | Submit MCQ results | Yes |

### File Management

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/files/upload-resume` | Upload resume file | Yes |
| `GET` | `/api/files/resume/:filename` | Download resume file | Yes |
| `DELETE` | `/api/files/resume/:filename` | Delete resume file | Yes |


---

## 📈 Usage Guide

### Getting Started

#### 1. **Account Setup**
```bash
# Visit the application
http://localhost:5173

# Register with email
# Verify email address
# Complete profile setup
```

#### 2. **First Job Application**
```bash
# Navigate to Dashboard
# Click "Add Job Application"
# Follow the multi-step process:
#   → Personal Details
#   → Job Details  
#   → Resume Analysis
#   → MCQ Assessment
#   → Final Report
```

#### 3. **Understanding Results**

**Resume Analysis Metrics:**
- **Match Score (0-100)**: Overall compatibility with job requirements
- **Keyword Coverage**: Percentage of job keywords found in resume
- **Experience Relevance**: Scoring of work experience relevance
- **Project Analysis**: Evaluation of project complexity and relevance

**MCQ Performance:**
- **Accuracy Score**: Percentage of correct answers
- **Time Efficiency**: Speed of completion
- **Topic Breakdown**: Performance by skill area

**Final Evaluation:**
- **Composite Score**: Weighted average of all assessments
- **Ranking**: Fit level (Excellent/Good/Needs Improvement)
- **Recommendations**: Specific improvement suggestions

---


