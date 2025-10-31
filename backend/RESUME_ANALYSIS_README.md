# Resume Analysis Backend Implementation

## Overview

This backend implementation provides automated resume analysis using Gemini AI and stores results in MongoDB. The system analyzes candidate resumes against job descriptions and provides detailed feedback.

## Architecture

### 1. Models
- **ResumeAnalysis**: Stores analysis results with references to users and job applications
- **Users**: Extended with resume analysis status tracking

### 2. Services
- **pdfExtractor.js**: Extracts text from PDF resumes using pdf-parse and pdf2json
- **geminiService.js**: Integrates with Google's Gemini AI for resume analysis

### 3. API Endpoints

#### POST `/api/users/analyze-resume/:applicationId`
Analyzes a resume for a specific job application.

**Authentication**: Required (Clerk)
**Parameters**: 
- `applicationId` (URL parameter): MongoDB ObjectId of the job application

**Response Structure**:
```json
{
  "message": "Resume analysis completed successfully",
  "analysis": {
    "matchScore": 85,
    "keywordAnalysis": {
      "coveragePercentage": 75,
      "neededKeywords": [
        {"keyword": "React", "found": true},
        {"keyword": "Node.js", "found": true},
        {"keyword": "AWS", "found": false}
      ]
    },
    "overallSuggestions": "Strong technical background. Consider highlighting AWS experience.",
    "experienceAnalysis": [
      {
        "title": "Senior Developer at TechCorp",
        "relevanceScore": 9,
        "depthScore": 8,
        "suggestions": ["Quantify impact with metrics", "Highlight leadership experience"]
      }
    ],
    "projectAnalysis": [
      {
        "title": "E-commerce Platform",
        "relevanceScore": 8,
        "complexityScore": 7,
        "suggestions": ["Mention scalability achievements", "Add performance metrics"]
      }
    ]
  },
  "analysisId": "607c191e810c19729de860ea",
  "createdAt": "2024-10-31T12:00:00Z",
  "updatedAt": "2024-10-31T12:00:00Z"
}
```

#### GET `/api/users/resume-analysis/:applicationId`
Retrieves existing resume analysis for a job application.

**Authentication**: Required (Clerk)
**Parameters**: 
- `applicationId` (URL parameter): MongoDB ObjectId of the job application

## Data Flow

1. **Fetch Application Data**: Retrieve candidate and job details from MongoDB
2. **Extract Resume Content**: Use PDF extraction services to get text from resume file
3. **Analyze with Gemini**: Send structured data to Gemini AI for analysis
4. **Store Results**: Save analysis results in ResumeAnalysis collection
5. **Return Response**: Send formatted analysis back to frontend

## Input Data Structure

The system expects job application data in this format:
```json
{
  "candidateName": "John Doe",
  "candidateEmail": "john@example.com",
  "candidateLocation": "New York",
  "willingToRelocate": "yes",
  "totalYOE": 5,
  "resume": {
    "fileName": "resume.pdf",
    "filePath": "/uploads/resumes/uuid-resume.pdf",
    "fileUrl": "/api/files/resume/uuid-resume.pdf"
  },
  "jobTitle": "Senior Full Stack Developer",
  "company": "TechCorp",
  "location": "San Francisco",
  "workMode": "Remote",
  "jobType": "fulltime",
  "jobIndustry": "technology",
  "jobDescription": "We're looking for a senior developer...",
  "requiredSkills": ["React", "Node.js", "MongoDB", "AWS"]
}
```

## Error Handling

The system handles various error scenarios:

- **Missing Resume**: Returns 400 if no resume is attached to the application
- **Invalid PDF**: Validates PDF files before processing
- **Text Extraction Failure**: Uses fallback methods for PDF text extraction
- **Gemini API Errors**: Handles API failures and invalid responses
- **Database Errors**: Manages MongoDB operation failures

## Status Tracking

Resume analysis goes through these statuses:
- `pending`: Analysis not yet started
- `processing`: Currently analyzing the resume
- `completed`: Analysis finished successfully
- `error`: Analysis failed (error message stored)

## Dependencies

### Node.js Packages
```json
{
  "@google/generative-ai": "^0.21.0",
  "pdf-parse": "^1.1.1",
  "pdf2json": "^3.1.4"
}
```

### Environment Variables
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

## Integration with Frontend

The Resume Analysis page can call these endpoints to:

1. Trigger analysis: `POST /api/users/analyze-resume/${applicationId}`
2. Check analysis status: `GET /api/users/resume-analysis/${applicationId}`
3. Display results using the returned analysis object

## Performance Considerations

- **Caching**: Analysis results are cached to avoid re-processing
- **Async Processing**: Large PDF processing happens asynchronously
- **Error Recovery**: Fallback PDF extraction methods ensure reliability
- **Rate Limiting**: Gemini API calls are managed to avoid quota issues

## Security

- **Authentication**: All endpoints require valid Clerk authentication
- **Authorization**: Users can only access their own job applications
- **File Validation**: PDF files are validated before processing
- **Input Sanitization**: All user inputs are validated and sanitized

## Monitoring and Logging

The system logs:
- PDF extraction attempts and results
- Gemini API calls and responses
- Error conditions and recovery attempts
- Processing times for performance monitoring

## Testing

To test the implementation:

1. Ensure MongoDB is running
2. Set up Gemini API key in environment variables
3. Create a job application with an uploaded resume
4. Call the analyze endpoint with the application ID
5. Verify the analysis results are stored and returned correctly

## Future Enhancements

Potential improvements:
- Batch processing for multiple applications
- Real-time progress updates via WebSockets
- Resume comparison between candidates
- Historical analysis tracking and trends
- Custom analysis templates per company/role