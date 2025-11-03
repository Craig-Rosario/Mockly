# 🎯 Mockly - AI-Powered Job Application Assistant

<p align="center">
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Google_Gemini-8E75B2?style=for-the-badge&logo=google&logoColor=white" alt="Gemini AI" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
</p>

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
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## 🎯 What is Mockly?

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
    
    style A fill:#e1f5fe
    style G fill:#f3e5f5
    style K fill:#e8f5e8
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

### Installation Steps

#### 1. Clone the Repository
```bash
git clone https://github.com/your-username/mockly.git
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
cd ../frontend
npm install
npm run dev
# Application will run on http://localhost:5173
```

#### 4. Database Setup
```bash
# If using local MongoDB
mongod --dbpath /path/to/your/database

# Create database and collections (automatic on first run)
```

#### 5. Verify Installation
- Navigate to `http://localhost:5173`
- Register a new account
- Test the complete flow by creating a job application

### Additional Setup Options

#### Using Docker (Optional)
```bash
# Build and run with Docker Compose
docker-compose up --build

# Or run individual services
docker build -t mockly-backend ./backend
docker build -t mockly-frontend ./frontend
```

#### Development Mode
```bash
# Backend with nodemon
cd backend && npm run dev

# Frontend with hot reload
cd frontend && npm run dev
```

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

### For Recruiters & HR Teams

#### 🔍 **Efficient Screening**
- **Automated Analysis**: Quick assessment of candidate-job fit
- **Standardized Evaluation**: Consistent criteria across all applications
- **Data-Driven Decisions**: Objective scoring and analytics

#### 📊 **Enhanced Analytics**
- **Candidate Insights**: Detailed breakdown of skills and experience
- **Hiring Trends**: Track successful candidate profiles
- **Process Optimization**: Improve job descriptions based on analysis results

### Technical Advantages

#### 🔒 **Security & Privacy**
- **Secure Authentication**: Enterprise-grade security with Clerk
- **Data Protection**: Encrypted storage and transmission
- **Privacy Compliance**: GDPR-compliant data handling

#### 🚀 **Scalability**
- **Cloud-Ready Architecture**: Easy deployment and scaling
- **Microservices Design**: Modular and maintainable codebase
- **Performance Optimized**: Fast processing with efficient algorithms

#### 🔄 **Integration Capabilities**
- **API-First Design**: Easy integration with existing HR systems
- **Webhook Support**: Real-time notifications and updates
- **Export Options**: Data export in multiple formats

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
| **ESLint** | Code Quality |
| **Prettier** | Code Formatting |
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
| `GET` | `/api/users/current-user` | Get current user details | ✅ |
| `POST` | `/api/users/job-application` | Create new job application | ✅ |
| `GET` | `/api/users/job-applications` | Get all user applications | ✅ |
| `GET` | `/api/users/debug-applications` | Debug application data | ✅ |

### Resume Analysis

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/users/analyze-resume/:applicationId` | Trigger resume analysis | ✅ |
| `GET` | `/api/users/resume-analysis/:applicationId` | Get analysis results | ✅ |

### MCQ System

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/users/job-application/:applicationId/mcqs` | Get/Generate MCQs | ✅ |
| `POST` | `/api/users/job-application/:applicationId/mcq-results` | Submit MCQ results | ✅ |

### File Management

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/files/upload-resume` | Upload resume file | ✅ |
| `GET` | `/api/files/resume/:filename` | Download resume file | ✅ |
| `DELETE` | `/api/files/resume/:filename` | Delete resume file | ✅ |

### Health Check

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/` | Server health status | ❌ |
| `GET` | `/api/protected` | Test authentication | ✅ |

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

### Advanced Features

#### Custom Job Tracking
```typescript
// Track multiple applications
const applications = await jobApplicationApi.getAllApplications(token);

// Filter by status
const activeApplications = applications.filter(app => 
  app.status === 'applied' || app.status === 'interview'
);
```

#### Performance Analytics
```typescript
// Get performance trends
const performanceData = applications.map(app => ({
  date: app.appliedOn,
  score: app.finalReport?.metrics?.totalScore || 0
}));
```

#### Export Functionality
```typescript
// Export application data
const exportData = {
  user: userData,
  applications: applications,
  analytics: performanceAnalytics
};
```

---

## 🤝 Contributing

We welcome contributions to Mockly! Here's how you can help:

### Development Workflow

#### 1. **Fork & Clone**
```bash
git clone https://github.com/your-username/mockly.git
cd mockly
```

#### 2. **Create Feature Branch**
```bash
git checkout -b feature/your-feature-name
```

#### 3. **Development Setup**
```bash
# Install dependencies
cd backend && npm install
cd ../frontend && npm install

# Set up environment variables
cp .env.example .env

# Start development servers
npm run dev
```

#### 4. **Code Standards**
- Follow TypeScript best practices
- Use ESLint and Prettier configurations
- Write unit tests for new features
- Update documentation

#### 5. **Submit Pull Request**
```bash
git add .
git commit -m "feat: add new feature"
git push origin feature/your-feature-name
```

### Contribution Areas

#### 🐛 **Bug Fixes**
- Report bugs with detailed reproduction steps
- Fix existing issues from the issue tracker
- Improve error handling and user experience

#### ✨ **New Features**
- Enhanced AI analysis capabilities
- Additional assessment types
- Integration with job boards
- Mobile application development

#### 📚 **Documentation**
- API documentation improvements
- Tutorial creation
- Code examples and guides
- Internationalization

#### 🧪 **Testing**
- Unit test coverage improvement
- Integration testing
- Performance testing
- Security testing

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### License Summary

```
MIT License

Copyright (c) 2024 Mockly

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```

---

## 🎉 Acknowledgments

- **Google Gemini AI** for advanced language processing capabilities
- **Clerk** for secure authentication infrastructure
- **Shadcn/ui** for beautiful component library
- **MongoDB** for flexible document storage
- **React & TypeScript** communities for excellent tooling

---

## 📞 Support

### Getting Help

- **Documentation**: Check this README and inline code comments
- **Issues**: Report bugs and request features on GitHub Issues
- **Discussions**: Join community discussions for questions and ideas

### Contact Information

- **Project Repository**: [GitHub Repository Link]
- **Issue Tracker**: [GitHub Issues Link]
- **Discussions**: [GitHub Discussions Link]

---

<p align="center">
  <strong>Built with ❤️ by the Mockly Team</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/github/stars/your-username/mockly?style=social" alt="GitHub Stars" />
  <img src="https://img.shields.io/github/forks/your-username/mockly?style=social" alt="GitHub Forks" />
  <img src="https://img.shields.io/github/watchers/your-username/mockly?style=social" alt="GitHub Watchers" />
</p>
